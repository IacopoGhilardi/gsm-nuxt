<template>
  <section class="grid-paper bg-navy py-20 lg:py-28">
    <div class="mx-auto max-w-screen-xl px-5 lg:px-8">
      <SectionHeading
        inverted
        :eyebrow="texts.servizi.eyebrow"
        :title="texts.servizi.title"
        :subtitle="texts.servizi.subtitle"
      />

      <div class="mt-14 grid gap-5 md:grid-cols-3 lg:mt-16">
        <ServiceItem
          v-for="(service, i) in services"
          :key="service.title"
          :service="service"
          :index="String(i + 1).padStart(2, '0')"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import SectionHeading from '~/components/atoms/SectionHeading.vue'
import ServiceItem from '~/components/atoms/ServiceItem.vue'
import texts from '~/data/homeTexts.json'

const services = [
  {
    title: 'Stampe e ricami',
    description:
      'Logo aziendale su divise, camici e polo. Ricamo per i capi che durano, stampa per tirature rapide.',
    icon: 'fa-solid fa-stamp'
  },
  {
    title: 'Gadget promozionali',
    description:
      'Borse, penne, chiavette e omaggi personalizzati per fiere, eventi e clienti, con il tuo marchio.',
    icon: 'fa-solid fa-gift'
  },
  {
    title: 'Abbigliamento da lavoro',
    description:
      'Divise per ristorazione, medicale, estetica e officina. Taglie provate dal vivo, non indovinate online.',
    icon: 'fa-solid fa-shirt'
  }
]
</script>
