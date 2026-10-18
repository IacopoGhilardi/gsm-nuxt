/**
 * Lo sfogliatore legge pagine WebP pre-renderizzate da scripts/render-catalogs.mjs
 * invece del PDF originale: i cataloghi arrivano a 362 MB e 348 pagine, pesi
 * che nessun browser gestisce bene, men che meno su rete mobile.
 *
 * Il numero di pagine sta in app/data/catalogs.json, quindi gli URL si
 * costruiscono senza interrogare il bucket: niente fetch, niente CORS.
 */

/** Le due larghezze prodotte dallo script di rendering. */
export const PAGE_WIDTHS = [1000, 1800] as const

/**
 * Base degli URL delle pagine. Si sovrascrive senza toccare il codice con
 * NUXT_PUBLIC_CATALOG_PAGES_BASE al momento del build (il sito e' statico,
 * quindi il valore viene congelato li').
 */
export const usePagesBase = () =>
  useRuntimeConfig().public.catalogPagesBase as string

export const buildPageUrl = (
  base: string,
  catalogId: string,
  page: number,
  width: number
) => `${base}/${catalogId}/w${width}/p${String(page).padStart(4, '0')}.webp`

export const buildPageSrcset = (base: string, catalogId: string, page: number) =>
  PAGE_WIDTHS.map((w) => `${buildPageUrl(base, catalogId, page, w)} ${w}w`).join(', ')

/** Dall'id "isacco-chef-line-2026" ricaviamo "Chef Line 2026". */
export const catalogLabel = (catalogId: string) =>
  catalogId
    .split('-')
    .slice(1)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
