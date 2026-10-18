<template>
  <MainLayout>
    <HeroSection />
    <PartnersSection />
    <ServicesSection />
    <AboutSection />
    <CtaSection />
  </MainLayout>
</template>

<script setup>
import MainLayout from '~/components/layout/MainLayout.vue'
import HeroSection from '~/components/molecules/HeroSection.vue'
import PartnersSection from '~/components/molecules/PartnersSection.vue'
import ServicesSection from '~/components/molecules/ServicesSection.vue'
import AboutSection from '~/components/molecules/AboutSection.vue'
import CtaSection from '~/components/molecules/CtaSection.vue'

const description =
  'Abbigliamento da lavoro a Pisa: divise, camici, abbigliamento tecnico, stampe, ricami e gadget personalizzati. Ti portiamo i campioni in azienda.'

useSeoMeta({
  title: 'Abbigliamento da Lavoro a Pisa - GSM',
  description,
  keywords: 'abbigliamento da lavoro, divise da lavoro, Pisa, ricami, stampe, gadget promozionali',
  ogTitle: 'Abbigliamento da Lavoro a Pisa - GSM',
  ogDescription: description,
  ogType: 'website',
  ogUrl: 'https://www.gsm-adl.it',
  ogLocale: 'it_IT'
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'GSM di Ghilardi Mario Stefano',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Pisa',
          addressRegion: 'Toscana',
          addressCountry: 'IT'
        },
        telephone: '+393473568443',
        email: 'gsmabbigliamentodalavoro@gmail.com',
        description: 'Specializzati in abbigliamento da lavoro a Pisa.',
        areaServed: { '@type': 'AdministrativeArea', name: 'Pisa e provincia' },
        url: 'https://www.gsm-adl.it',
        image: 'https://www.gsm-adl.it/og-image.jpg',
        vatID: 'IT02370530509',
        knowsAbout: [
          'abbigliamento da lavoro',
          'divise professionali',
          'stampe e ricami su tessuto',
          'gadget promozionali personalizzati'
        ]
      })
    }
  ]
})
</script>
