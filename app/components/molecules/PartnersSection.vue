<template>
  <section class="border-b border-ink/10 bg-base-100 py-14 lg:py-16">
    <div class="mx-auto max-w-screen-xl px-5 lg:px-8">
      <p class="eyebrow text-center text-ink/45">{{ texts.partners.eyebrow }}</p>
    </div>

    <div
      class="marquee-viewport relative mt-9 overflow-hidden"
      role="list"
      :aria-label="texts.partners.eyebrow"
    >
      <div class="marquee-track items-center gap-14 sm:gap-20">
        <div
          v-for="(partner, index) in displayedPartners"
          :key="`${partner.title}-${index}`"
          role="listitem"
          class="flex h-20 w-32 shrink-0 items-center justify-center sm:w-40"
        >
          <img
            :src="partner.path"
            :alt="partner.title"
            class="max-h-14 max-w-full object-contain opacity-60 transition duration-300 hover:opacity-100"
            :class="partner.filter"
            loading="lazy"
          />
        </div>
      </div>

      <div
        class="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-base-100 to-transparent sm:w-28"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-base-100 to-transparent sm:w-28"
        aria-hidden="true"
      />
    </div>
  </section>
</template>

<script setup>
import texts from '~/data/homeTexts.json'
import logoEndi from '~/assets/images/partners/logo-endi.gif'
import logoIsacco from '~/assets/images/partners/logo-isacco.png'
import logoJrc from '~/assets/images/partners/logo-jrc.jpg'
import logoMakito from '~/assets/images/partners/makito-logo.png'

const partners = [
  { path: logoEndi, title: 'Endi', filter: 'grayscale hover:grayscale-0' },
  { path: logoIsacco, title: 'Isacco', filter: 'grayscale hover:grayscale-0' },
  { path: logoJrc, title: 'JRC', filter: 'grayscale hover:grayscale-0' },
  // Wordmark bianco su trasparente: brightness-0 lo rende leggibile sul fondo chiaro
  { path: logoMakito, title: 'Makito', filter: 'brightness-0' }
]

// Duplicato: il marquee traslando del 50% ricomincia senza stacchi
const displayedPartners = [...partners, ...partners, ...partners, ...partners]
</script>
