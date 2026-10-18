#!/usr/bin/env node
/**
 * Mostra a che punto e' il rendering dei cataloghi, guardando i file gia'
 * prodotti. Si puo' lanciare in un altro terminale mentre render-catalogs.mjs
 * sta girando, anche se il suo output non e' visibile.
 *
 * Uso:
 *   node scripts/render-progress.mjs          # una fotografia
 *   node scripts/render-progress.mjs --watch  # si aggiorna ogni 5 secondi
 */

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const run = promisify(execFile)
const ROOT = path.resolve(import.meta.dirname, '..')
const BUILD = path.join(ROOT, '.cataloghi-build')
const SFOGLIA = path.join(BUILD, 'sfoglia')
const watch = process.argv.includes('--watch')

const mb = (b) => `${(b / 1048576).toFixed(0)} MB`

/** Totale pagine: da catalogs.json se gia' noto, altrimenti dal PDF scaricato. */
async function totalPages(id, fromJson) {
  if (fromJson) return fromJson
  const pdf = path.join(BUILD, '_pdf', `${id}.pdf`)
  if (!existsSync(pdf)) return null
  try {
    const { stdout } = await run('pdfinfo', [pdf])
    return Number(stdout.match(/^Pages:\s+(\d+)$/m)?.[1]) || null
  } catch {
    return null
  }
}

async function snapshot() {
  if (!existsSync(SFOGLIA)) {
    console.log('Nessun rendering in corso: .cataloghi-build/sfoglia non esiste ancora.')
    return
  }

  const catalogs = JSON.parse(
    await import('node:fs/promises').then((fs) =>
      fs.readFile(path.join(ROOT, 'app/data/catalogs.json'), 'utf8')
    )
  )
  const known = Object.fromEntries(
    catalogs.flatMap((p) => p.catalogs.map((c) => [c.id, c.pages]))
  )

  const dirs = (await readdir(SFOGLIA)).sort()
  let bytes = 0
  let donePages = 0
  const rows = []

  for (const id of dirs) {
    const wide = path.join(SFOGLIA, id, 'w1800')
    if (!existsSync(wide)) continue
    const files = await readdir(wide)
    const done = files.length
    donePages += done

    for (const w of ['w1000', 'w1800']) {
      const d = path.join(SFOGLIA, id, w)
      if (!existsSync(d)) continue
      for (const f of await readdir(d)) bytes += (await stat(path.join(d, f))).size
    }

    const total = await totalPages(id, known[id])
    const times = await Promise.all(
      files.slice(-40).map((f) => stat(path.join(wide, f)).then((s) => s.mtimeMs))
    )
    const span = times.length > 1 ? (Math.max(...times) - Math.min(...times)) / 1000 : 0
    const rate = span > 1 ? times.length / span : null
    const fresh = Date.now() - Math.max(...times, 0) < 30000

    rows.push({ id, done, total, rate, fresh })
  }

  console.clear()
  console.log(`Rendering cataloghi — ${new Date().toLocaleTimeString('it-IT')}\n`)
  for (const r of rows) {
    const total = r.total ?? '?'
    const pct = r.total ? `${Math.round((r.done / r.total) * 100)}%`.padStart(4) : '    '
    const eta =
      r.fresh && r.rate && r.total && r.done < r.total
        ? `  ~${Math.round((r.total - r.done) / r.rate / 60)} min`
        : ''
    const mark = r.fresh ? '▶' : r.total && r.done >= r.total ? '✓' : ' '
    console.log(
      `${mark} ${r.id.padEnd(32)} ${String(r.done).padStart(4)}/${String(total).padEnd(4)} ${pct}${eta}`
    )
  }
  console.log(`\n${donePages} pagine, ${mb(bytes)} di WebP in .cataloghi-build/`)
  if (watch) console.log('\n(--watch attivo, Ctrl-C per uscire)')
}

await snapshot()
if (watch) setInterval(snapshot, 5000)
