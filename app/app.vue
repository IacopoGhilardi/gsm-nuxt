<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const SITE = 'https://www.gsm-adl.it'
const route = useRoute()

/**
 * URL canonico: sempre senza query, cosi' ?p=12 dello sfogliatore non crea
 * doppioni agli occhi di Google.
 */
const canonical = computed(() => {
  const path = route.path.replace(/\/+$/, '')
  return `${SITE}${path || '/'}`
})

useHead({
  // Le pagine impostano solo il proprio titolo; qui si aggiunge il suffisso,
  // evitando di ripeterlo quando il titolo lo contiene gia'.
  titleTemplate: (title?: string) => {
    if (!title) return 'GSM - Abbigliamento da Lavoro a Pisa'
    return title.includes('Abbigliamento da Lavoro')
      ? title
      : `${title} - Abbigliamento da Lavoro`
  },
  link: [{ rel: 'canonical', href: canonical }]
})

useSeoMeta({
  ogSiteName: 'GSM Abbigliamento da Lavoro',
  ogLocale: 'it_IT',
  ogType: 'website',
  ogUrl: canonical,
  ogImage: `${SITE}/og-image.jpg`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: 'Bozzetti di divise da lavoro disegnate su misura',
  twitterCard: 'summary_large_image',
  twitterImage: `${SITE}/og-image.jpg`
})
</script>
