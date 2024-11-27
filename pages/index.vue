<template>
  <MainLayout>
    <HeroSection></HeroSection>
    <PartnersSection></PartnersSection>
    <ServicesSection></ServicesSection>
    <AboutSection></AboutSection>
  </MainLayout>
</template>
<script setup>
import HeroSection from '~/components/molecules/HeroSection.vue'
import PartnersSection from '~/components/molecules/PartnersSection.vue'
import AboutSection from '~/components/molecules/AboutSection.vue';
import ServicesSection from "~/components/molecules/ServicesSection.vue";
import MainLayout from '~/components/layout/MainLayout.vue'
import { useHead } from '@vueuse/head'


useHead({
  title: 'Abbigliamento da Lavoro a Pisa - Gsm',
  meta: [
    { name: 'description', content: 'Abbigliamento da lavoro a Pisa. Offriamo soluzioni personalizzate per ogni esigenza.' },
    { name: 'keywords', content: 'abbigliamento da lavoro, Pisa, abbigliamento da lavoro Pisa' },
    { property: 'og:title', content: 'Abbigliamento da Lavoro a Pisa - Gsm' },
    { property: 'og:description', content: 'Abbigliamento da lavoro a Pisa. Offriamo soluzioni personalizzate per ogni esigenza.' },
    { property: 'og:image', content: 'https://www.gsm-adl.it/wp-content/uploads/2024/09/gsm-logo-2024-1.png' },
    { property: 'og:url', content: 'https://www.gsm-adl.it' }
  ],
  script: [
    {
      type: 'application/ld+json',
      json: {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "GSM di Ghilardi Mario Stefano",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Pisa",
          "addressCountry": "IT"
        },
        "description": "Specializzati in abbigliamento da lavoro a Pisa.",
        "url": "https://www.gsm-adl.it"
      }
    }
  ]
})
</script>
