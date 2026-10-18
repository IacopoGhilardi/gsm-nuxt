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
 * Il costo dominante e' la rasterizzazione del PDF, non la compressione:
 * per questo ogni pagina viene rasterizzata una volta sola alla larghezza
 * maggiore, e la variante mobile si ricava riducendo quella. Le pagine
 * vengono lavorate a blocchi in parallelo su tutti i core.
 *
 * Uso:
 *   node scripts/render-catalogs.mjs                  # tutti i cataloghi
 *   node scripts/render-catalogs.mjs --only isacco    # un solo partner
 *   node scripts/render-catalogs.mjs --only isacco-chef-line-2026
 *   node scripts/render-catalogs.mjs --jobs 4         # meno processi paralleli
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

/** La prima e' quella rasterizzata; le altre si ricavano riducendola. */
const WIDTHS = [
  { name: 'w1800', px: 1800, quality: 78 }, // desktop e zoom
  { name: 'w1000', px: 1000, quality: 74 } // mobile
]
const BASE = WIDTHS[0]
const DERIVED = WIDTHS.slice(1)

const CHUNK = 6 // pagine per blocco: piccolo abbastanza da bilanciare i core
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
const jobs = Math.max(1, Number(argValue('--jobs')) || os.availableParallelism())
// Dentro al progetto (ed escluso da git): os.tmpdir() su macOS e' un
// /var/folders/... impronunciabile, scomodo da passare allo script di upload.
const outDir = path.resolve(argValue('--out') ?? path.join(ROOT, '.cataloghi-build'))

// ------------------------------------------------------------------ utility

const pad = (n) => String(n).padStart(4, '0')
const mb = (bytes) => `${(bytes / 1048576).toFixed(1)} MB`

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

/** Esegue i task con al massimo `limit` in volo contemporaneamente. */
async function pool(items, limit, worker) {
  const queue = [...items.entries()]
  const runners = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    for (;;) {
      const next = queue.shift()
      if (!next) return
      await worker(next[1], next[0])
    }
  })
  await Promise.all(runners)
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
  await run('curl', ['-sSfL', '-C', '-', '--retry', '3', '-o', partial, url], {
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

/**
 * Rasterizza [from..to] una volta sola alla larghezza maggiore e ne ricava
 * tutte le varianti. Ogni blocco ha la sua cartella temporanea, altrimenti
 * i processi paralleli si pestano i file a vicenda.
 */
async function renderChunk(pdf, tmpRoot, destDirs, from, to, index) {
  const tmp = path.join(tmpRoot, `b${index}`)
  await mkdir(tmp, { recursive: true })
  const prefix = path.join(tmp, 'pg')

  await run('pdftoppm', [
    '-jpeg',
    '-jpegopt', 'quality=92',
    '-scale-to-x', String(BASE.px),
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
    const src = path.join(tmp, file)

    await run('cwebp', [
      '-quiet', '-q', String(BASE.quality), '-m', '6',
      src, '-o', path.join(destDirs[BASE.name], `p${pad(n)}.webp`)
    ])

    for (const width of DERIVED) {
      await run('cwebp', [
        '-quiet', '-q', String(width.quality), '-m', '6',
        '-resize', String(width.px), '0', // 0 = altezza proporzionale
        src, '-o', path.join(destDirs[width.name], `p${pad(n)}.webp`)
      ])
    }

    await rm(src)
  }

  await rm(tmp, { recursive: true, force: true })
  return produced.length
}

async function renderCatalog(catalog) {
  const id = catalog.id
  console.log(`\n▸ ${id}`)

  const pdfDir = path.join(outDir, '_pdf')
  const tmpRoot = path.join(outDir, '_tmp', id)
  await mkdir(pdfDir, { recursive: true })
  await mkdir(tmpRoot, { recursive: true })

  const pdf = await download(catalog.catalog, path.join(pdfDir, `${id}.pdf`))
  const pages = await pageCount(pdf)

  const destDirs = {}
  for (const width of WIDTHS) {
    destDirs[width.name] = path.join(outDir, 'sfoglia', id, width.name)
    await mkdir(destDirs[width.name], { recursive: true })
  }

  // Una pagina va rifatta se manca in almeno una delle larghezze
  const present = Object.fromEntries(
    await Promise.all(
      WIDTHS.map(async (w) => [w.name, new Set(await readdir(destDirs[w.name]))])
    )
  )
  const missing = []
  for (let n = 1; n <= pages; n++) {
    if (WIDTHS.some((w) => !present[w.name].has(`p${pad(n)}.webp`))) missing.push(n)
  }

  if (!missing.length) {
    step(`${pages} pagine, gia' complete`)
  } else {
    step(`${pages} pagine, ${missing.length} da renderizzare su ${jobs} processi`)

    // Blocchi di pagine consecutive, cosi' una sola chiamata a pdftoppm per blocco
    const chunks = []
    for (let i = 0; i < missing.length; i += CHUNK) {
      const batch = missing.slice(i, i + CHUNK)
      chunks.push([batch[0], batch[batch.length - 1]])
    }

    const started = Date.now()
    let done = 0
    await pool(chunks, jobs, async ([from, to], index) => {
      // L'await va risolto PRIMA di toccare il contatore: con "done += await…"
      // ogni worker legge done prima di sospendersi e si sovrascrivono a vicenda
      const rendered = await renderChunk(pdf, tmpRoot, destDirs, from, to, index)
      done += rendered
      const rate = done / ((Date.now() - started) / 1000)
      const left = Math.round((missing.length - done) / Math.max(rate, 0.01))
      process.stdout.write(
        `\r    ${done}/${missing.length} pagine — ${rate.toFixed(1)}/s, ~${left}s rimanenti   `
      )
    })
    process.stdout.write('\n')
  }

  await rm(tmpRoot, { recursive: true, force: true })
  if (!keepPdf) await rm(pdf, { force: true })

  step(`${mb(await dirSize(path.join(outDir, 'sfoglia', id)))} di WebP`)
  return pages
}

// --------------------------------------------------------------------- main

async function main() {
  await requireTool('pdfinfo', 'brew install poppler')
  await requireTool('pdftoppm', 'brew install poppler')
  await requireTool('cwebp', 'brew install webp')

  const partners = JSON.parse(await readFile(CATALOGS_JSON, 'utf8'))
  await mkdir(outDir, { recursive: true })

  console.log(`Cartella di lavoro: ${outDir}`)
  console.log(`Processi paralleli: ${jobs}`)

  let done = 0
  let skipped = 0

  for (const partner of partners) {
    for (const catalog of partner.catalogs) {
      if (only && only !== partner.name && only !== catalog.id) continue

      if (!catalog.catalog.toLowerCase().endsWith('.pdf')) {
        console.log(`\n▸ ${catalog.id}: link esterno, niente da renderizzare`)
        skipped++
        continue
      }

      try {
        catalog.pages = await renderCatalog(catalog)
        done++
        // Salva subito: se il prossimo catalogo fallisce, il lavoro fatto resta
        await writeFile(CATALOGS_JSON, `${JSON.stringify(partners, null, 2)}\n`)
      } catch (error) {
        console.error(`\n  ✗ ${catalog.id}: ${error.message}`)
        skipped++
      }
    }
  }

  const total = await dirSize(path.join(outDir, 'sfoglia')).catch(() => 0)
  console.log(`\n${done} cataloghi renderizzati, ${skipped} saltati — ${mb(total)} in totale`)
  console.log(`\nOra carica le pagine sul bucket:\n  ./scripts/upload-catalogs.sh ${outDir}\n`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
