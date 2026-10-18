#!/usr/bin/env node
/**
 * Controlla che ogni catalogo marcato come sfogliabile abbia davvero le sue
 * pagine sul bucket.
 *
 * Serve perche' il campo "pages" in catalogs.json e le immagini su R2 sono
 * due cose separate: se si pubblica il sito dopo aver renderizzato ma prima
 * di aver caricato, lo sfogliatore si apre su pagine rotte. Da lanciare
 * sempre prima di pubblicare.
 *
 * Uso:
 *   node scripts/check-catalogs.mjs
 *   NUXT_PUBLIC_CATALOG_PAGES_BASE=... node scripts/check-catalogs.mjs
 */

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const run = promisify(execFile)
const ROOT = path.resolve(import.meta.dirname, '..')

const BASE =
  process.env.NUXT_PUBLIC_CATALOG_PAGES_BASE ??
  'https://pub-b0f8272c710649f68ef7029d37933dc5.r2.dev/sfoglia'

const pad = (n) => String(n).padStart(4, '0')
const url = (id, page, w) => `${BASE}/${id}/w${w}/p${pad(page)}.webp`

async function head(target) {
  try {
    const { stdout } = await run('curl', [
      '-sI', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '20', target
    ])
    return stdout.trim()
  } catch {
    return 'ERR'
  }
}

const partners = JSON.parse(
  await readFile(path.join(ROOT, 'app/data/catalogs.json'), 'utf8')
)

const browsable = partners.flatMap((p) =>
  p.catalogs.filter((c) => c.pages).map((c) => ({ partner: p.name, ...c }))
)
const notBrowsable = partners.flatMap((p) =>
  p.catalogs.filter((c) => !c.pages && c.catalog.toLowerCase().endsWith('.pdf'))
)

if (!browsable.length) {
  console.log('Nessun catalogo sfogliabile: niente da controllare.')
  process.exit(0)
}

console.log(`Controllo ${browsable.length} cataloghi su ${BASE}\n`)

const problems = []
await Promise.all(
  browsable.map(async (c) => {
    // prima, una di mezzo e ultima, in entrambe le larghezze
    const samples = [1, Math.max(1, Math.ceil(c.pages / 2)), c.pages]
    const checks = samples.flatMap((n) => [1000, 1800].map((w) => [n, w]))
    const bad = []
    for (const [n, w] of checks) {
      const code = await head(url(c.id, n, w))
      if (code !== '200') bad.push(`p${n}/w${w} -> ${code}`)
    }
    if (bad.length) problems.push({ id: c.id, bad })
    console.log(`  ${bad.length ? '✗' : '✓'} ${c.id.padEnd(32)} ${c.pages} pagine`)
  })
)

if (notBrowsable.length) {
  console.log(`\n${notBrowsable.length} cataloghi senza pagine renderizzate (linkano al PDF):`)
  for (const c of notBrowsable) console.log(`  · ${c.id}`)
}

if (problems.length) {
  console.error(`\n${problems.length} cataloghi con pagine mancanti sul bucket:`)
  for (const p of problems) console.error(`  ${p.id}: ${p.bad.join(', ')}`)
  console.error('\nLancia ./scripts/upload-catalogs.sh .cataloghi-build prima di pubblicare.')
  process.exit(1)
}

console.log('\nTutto a posto: le pagine dei cataloghi sfogliabili sono online.')
