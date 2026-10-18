#!/usr/bin/env node
/**
 * Sposta su Cloudflare R2 i file dei cataloghi ancora ospitati su AWS S3,
 * cosi' resta un solo bucket (R2 non fa pagare il traffico in uscita).
 *
 * Cosa fa, nell'ordine:
 *   1. raccoglie da app/data/catalogs.json ogni URL che punta ancora a S3
 *   2. lo scarica mantenendo lo stesso percorso
 *   3. carica tutto su R2 con rclone
 *   4. verifica che ogni nuovo URL pubblico risponda 200 col tipo giusto
 *   5. solo a quel punto riscrive catalogs.json
 *
 * Il passo 5 avviene solo se il 4 e' andato a buon fine: se qualcosa non
 * torna, il JSON resta intatto e il sito continua a puntare a S3.
 *
 * Uso:
 *   node scripts/migrate-to-r2.mjs --dry-run   # mostra cosa farebbe
 *   node scripts/migrate-to-r2.mjs             # esegue
 */

import { execFile, spawn } from 'node:child_process'
import { promisify } from 'node:util'
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const run = promisify(execFile)

const S3_HOST = 'gsm-website.s3.eu-north-1.amazonaws.com'
const R2_PUBLIC = 'https://pub-b0f8272c710649f68ef7029d37933dc5.r2.dev'
const RCLONE_DEST = 'gsm-website:gsm-website'

const ROOT = path.resolve(import.meta.dirname, '..')
const CATALOGS_JSON = path.join(ROOT, 'app/data/catalogs.json')
const WORK = path.join(ROOT, '.cataloghi-build', '_migrazione')

const dryRun = process.argv.includes('--dry-run')
const mb = (b) => `${(b / 1048576).toFixed(1)} MB`

/**
 * Percorso dell'oggetto dentro il bucket, identico in locale e su R2.
 * I nomi contengono dei "+" letterali (cat+estetica+2008+web.pdf): vanno
 * lasciati stare, quindi niente decodifica che li trasformerebbe in spazi.
 */
const objectKey = (url) => new URL(url).pathname.replace(/^\//, '')

// ------------------------------------------------- 1. cosa c'e' da spostare

const partners = JSON.parse(await readFile(CATALOGS_JSON, 'utf8'))

/** Tutti i punti del JSON che contengono un URL, per poterli riscrivere dopo. */
const refs = []
for (const partner of partners) {
  for (const catalog of partner.catalogs) {
    for (const field of ['cover', 'catalog']) {
      refs.push({ catalog, field, url: catalog[field] })
    }
  }
}

const toMove = refs.filter((r) => r.url.includes(S3_HOST))
const unique = [...new Set(toMove.map((r) => r.url))]

if (!unique.length) {
  console.log('Niente da spostare: nessun riferimento a S3 in catalogs.json.')
  process.exit(0)
}

console.log(`${unique.length} file da spostare da S3 a R2\n`)
for (const url of unique) {
  console.log('  ' + url.replace(`https://${S3_HOST}/`, ''))
}

if (dryRun) {
  console.log('\n--dry-run: mi fermo qui, non ho toccato nulla.')
  process.exit(0)
}

// ------------------------------------------------------------ 2. download

await mkdir(WORK, { recursive: true })
console.log(`\nScarico in ${WORK}`)

let downloaded = 0
for (const [i, url] of unique.entries()) {
  const key = objectKey(url)
  const dest = path.join(WORK, key)
  await mkdir(path.dirname(dest), { recursive: true })

  if (existsSync(dest)) {
    downloaded += (await stat(dest)).size
    process.stdout.write(`\r  ${i + 1}/${unique.length} (gia' presente)        `)
    continue
  }

  await run('curl', ['-sSfL', '--retry', '3', '-o', `${dest}.part`, url], {
    maxBuffer: 1 << 24
  })
  await run('mv', [`${dest}.part`, dest])
  downloaded += (await stat(dest)).size
  process.stdout.write(`\r  ${i + 1}/${unique.length} — ${mb(downloaded)}        `)
}
console.log(`\n  scaricati ${mb(downloaded)}`)

// -------------------------------------------------------------- 3. upload

console.log(`\nCarico su ${RCLONE_DEST}`)
const uploadCode = await new Promise((resolve) => {
  spawn(
    'rclone',
    [
      'copy', WORK, RCLONE_DEST,
      '--transfers', '8',
      '--checkers', '16',
      // il token e' ristretto al bucket e non puo' elencarlo: senza questo
      // rclone prova a crearlo e prende 403
      '--s3-no-check-bucket',
      '--progress'
    ],
    { stdio: 'inherit' }
  ).on('close', resolve)
})
if (uploadCode !== 0) {
  console.error('\nUpload fallito. catalogs.json non e\' stato toccato.')
  process.exit(1)
}

// ------------------------------------------------------------- 4. verifica

console.log('\nVerifico i nuovi URL pubblici…')
const failures = []
for (const url of unique) {
  const target = `${R2_PUBLIC}/${objectKey(url)}`
  const { stdout } = await run('curl', [
    '-sI', '-o', '/dev/null',
    '-w', '%{http_code} %{content_type} %{size_download}',
    target
  ])
  const [code, type] = stdout.trim().split(' ')
  if (code !== '200') failures.push(`${code}  ${target}`)
  else if (target.endsWith('.pdf') && !String(type).includes('pdf')) {
    failures.push(`tipo errato (${type})  ${target}`)
  }
}

if (failures.length) {
  console.error(`\n${failures.length} URL non verificati:`)
  for (const f of failures) console.error('  ' + f)
  console.error('\ncatalogs.json NON e\' stato modificato: il sito continua a usare S3.')
  process.exit(1)
}
console.log(`  ${unique.length}/${unique.length} ok`)

// ------------------------------------------------- 5. riscrittura del JSON

for (const ref of toMove) {
  ref.catalog[ref.field] = ref.url.replace(`https://${S3_HOST}`, R2_PUBLIC)
}
// baseUrl non e' usato da nessuna parte nel codice e punta a bucket sbagliati
for (const partner of partners) delete partner.baseUrl

await writeFile(CATALOGS_JSON, `${JSON.stringify(partners, null, 2)}\n`)

console.log(`
Fatto. catalogs.json ora punta solo a R2.

Prossimi passi:
  git diff app/data/catalogs.json     # controlla le sostituzioni
  npm run generate                    # ricostruisci il sito

Quando il sito nuovo e' online e hai verificato che i cataloghi si aprono,
puoi svuotare il bucket S3 e smettere di pagarlo.
`)
