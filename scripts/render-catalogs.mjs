#!/usr/bin/env node
/**
 * Pre-renderizza i cataloghi PDF in pagine WebP per lo sfogliatore del sito.
 *
 * I PDF originali sono file da stampa (fino a 362 MB, ~2,6 MB a pagina): non
 * sono servibili a un browser. Qui ogni pagina diventa due WebP (1000px per il
 * mobile, 1800px per il desktop e lo zoom), nell'ordine dei 100 KB l'una, che
 * lo sfogliatore carica una alla volta.
 *
 * Il numero di pagine viene scritto dentro app/data/catalogs.json: lo
 * sfogliatore costruisce gli URL da quello e non deve interrogare nulla a
 * runtime, quindi sul bucket non serve configurare il CORS.
 *
 * Uso:
 *   node scripts/render-catalogs.mjs                  # tutti i cataloghi
 *   node scripts/render-catalogs.mjs --only isacco    # un solo partner
 *   node scripts/render-catalogs.mjs --only isacco-chef-line-2026
 *   node scripts/render-catalogs.mjs --out /percorso  # cartella di lavoro
 *   node scripts/render-catalogs.mjs --keep-pdf       # non cancella i PDF scaricati
 *
 * E' ripartibile: le pagine gia' renderizzate vengono saltate.
 * Richiede: poppler (pdfinfo, pdftoppm) e cwebp  ->  brew install poppler webp
 */

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFile, writeFile, mkdir, readdir, rm, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const run = promisify(execFile)

const WIDTHS = [
  { name: 'w1000', px: 1000, quality: 74 }, // mobile
  { name: 'w1800', px: 1800, quality: 78 } // desktop e zoom
]
const CHUNK = 8 // pagine renderizzate per volta, per non riempire il disco
const ROOT = path.resolve(import.meta.dirname, '..')
const CATALOGS_JSON = path.join(ROOT, 'app/data/catalogs.json')

// ---------------------------------------------------------------- argomenti

const argv = process.argv.slice(2)
const argValue = (flag) => {
  const i = argv.indexOf(flag)
  return i === -1 ? null : argv[i + 1]
}
const only = argValue('--only')
const keepPdf = argv.includes('--keep-pdf')
const outDir = path.resolve(
  argValue('--out') ?? path.join(os.tmpdir(), 'gsm-cataloghi')
)

// ------------------------------------------------------------------ utility

const pad = (n) => String(n).padStart(4, '0')
const mb = (bytes) => `${(bytes / 1048576).toFixed(1)} MB`

const log = (...a) => console.log(...a)
const step = (...a) => console.log('  ·', ...a)

async function requireTool(bin, hint) {
  try {
    await run('which', [bin])
  } catch {
    console.error(`\nManca "${bin}". Installalo con:  ${hint}\n`)
    process.exit(1)
  }
}

async function dirSize(dir) {
  let total = 0
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    total += entry.isDirectory() ? await dirSize(p) : (await stat(p)).size
  }
  return total
}

// -------------------------------------------------------------------- passi

/** Scarica il PDF, riprendendo se il file e' gia' parzialmente presente. */
async function download(url, dest) {
  if (existsSync(dest)) {
    step(`PDF gia' scaricato (${mb((await stat(dest)).size)})`)
    return dest
  }
  step('download del PDF…')
  const partial = `${dest}.part`
  await run('curl', ['-sS', '-L', '-C', '-', '--retry', '3', '-o', partial, url], {
    maxBuffer: 1 << 24
  })
  await run('mv', [partial, dest])
  step(`scaricato ${mb((await stat(dest)).size)}`)
  return dest
}

async function pageCount(pdf) {
  const { stdout } = await run('pdfinfo', [pdf])
  const match = stdout.match(/^Pages:\s+(\d+)$/m)
  if (!match) throw new Error('impossibile leggere il numero di pagine')
  return Number(match[1])
}

/** Renderizza [from..to] alla larghezza indicata e converte in WebP. */
async function renderRange(pdf, tmp, destDir, { px, quality }, from, to) {
  const prefix = path.join(tmp, 'pg')
  await run('pdftoppm', [
    '-jpeg',
    '-jpegopt', 'quality=92',
    '-scale-to-x', String(px),
    '-scale-to-y', '-1', // mantiene le proporzioni
    '-f', String(from),
    '-l', String(to),
    pdf,
    prefix
  ])

  const produced = (await readdir(tmp)).filter((f) => f.endsWith('.jpg')).sort()
  for (const file of produced) {
    // pdftoppm numera i file con la pagina reale del PDF
    const n = Number(file.match(/(\d+)\.jpg$/)[1])
    const dest = path.join(destDir, `p${pad(n)}.webp`)
    await run('cwebp', [
      '-quiet',
      '-q', String(quality),
      '-m', '6',
      path.join(tmp, file),
      '-o', dest
    ])
    await rm(path.join(tmp, file))
  }
}

async function renderCatalog(partner, catalog) {
  const id = catalog.id
  log(`\n▸ ${id}`)

  const workDir = path.join(outDir, '_pdf')
  const tmpDir = path.join(outDir, '_tmp', id)
  await mkdir(workDir, { recursive: true })
  await mkdir(tmpDir, { recursive: true })

  const pdf = await download(catalog.catalog, path.join(workDir, `${id}.pdf`))
  const pages = await pageCount(pdf)
  step(`${pages} pagine`)

  for (const width of WIDTHS) {
    const destDir = path.join(outDir, 'sfoglia', id, width.name)
    await mkdir(destDir, { recursive: true })

    const existing = new Set(await readdir(destDir))
    const missing = []
    for (let n = 1; n <= pages; n++) {
      if (!existing.has(`p${pad(n)}.webp`)) missing.push(n)
    }

    if (!missing.length) {
      step(`${width.name}: gia' completo`)
      continue
    }

    step(`${width.name}: ${missing.length} pagine da renderizzare`)
    for (let i = 0; i < missing.length; i += CHUNK) {
      const batch = missing.slice(i, i + CHUNK)
      await renderRange(pdf, tmpDir, destDir, width, batch[0], batch[batch.length - 1])
      process.stdout.write(
        `\r    ${width.name}: ${Math.min(i + CHUNK, missing.length)}/${missing.length}   `
      )
    }
    process.stdout.write('\n')
  }

  await rm(tmpDir, { recursive: true, force: true })
  if (!keepPdf) await rm(pdf, { force: true })

  const size = await dirSize(path.join(outDir, 'sfoglia', id))
  step(`fatto: ${pages} pagine, ${mb(size)} di WebP`)
  return pages
}

// --------------------------------------------------------------------- main

async function main() {
  await requireTool('pdfinfo', 'brew install poppler')
  await requireTool('pdftoppm', 'brew install poppler')
  await requireTool('cwebp', 'brew install webp')

  const partners = JSON.parse(await readFile(CATALOGS_JSON, 'utf8'))
  await mkdir(outDir, { recursive: true })

  log(`Cartella di lavoro: ${outDir}`)

  let done = 0
  let skipped = 0

  for (const partner of partners) {
    for (const catalog of partner.catalogs) {
      const matches = !only || only === partner.name || only === catalog.id
      if (!matches) continue

      if (!catalog.catalog.toLowerCase().endsWith('.pdf')) {
        log(`\n▸ ${catalog.id}: link esterno, niente da renderizzare`)
        skipped++
        continue
      }

      try {
        catalog.pages = await renderCatalog(partner.name, catalog)
        done++
      } catch (error) {
        console.error(`\n  ✗ ${catalog.id}: ${error.message}`)
        skipped++
      }
    }
  }

  // Il conteggio pagine finisce nel JSON: lo sfogliatore costruisce gli URL
  // da li' e a runtime non interroga il bucket.
  await writeFile(CATALOGS_JSON, `${JSON.stringify(partners, null, 2)}\n`)

  const total = await dirSize(path.join(outDir, 'sfoglia')).catch(() => 0)
  log(`\n${done} cataloghi renderizzati, ${skipped} saltati — ${mb(total)} in totale`)
  log(`\nOra carica le pagine sul bucket:\n  ./scripts/upload-catalogs.sh ${outDir}\n`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
