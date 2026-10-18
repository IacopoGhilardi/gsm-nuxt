/**
 * Dati strutturati BreadcrumbList.
 *
 * Google li usa per mostrare il percorso al posto dell'URL nudo nei risultati
 * di ricerca. I nomi devono corrispondere a quelli visibili nella pagina.
 */
export function useBreadcrumbs(trail: Array<{ name: string; path: string }>) {
  const site = 'https://www.gsm-adl.it'
  const items = [{ name: 'Home', path: '/' }, ...trail]

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: `${site}${item.path === '/' ? '' : item.path}` || site
          }))
        })
      }
    ]
  })
}
