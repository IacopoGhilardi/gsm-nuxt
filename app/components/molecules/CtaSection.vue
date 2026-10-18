<template>
  <section class="bg-navy-900">
    <div
      class="mx-auto flex max-w-screen-xl flex-col gap-9 px-5 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-20"
    >
      <div class="max-w-xl">
        <h2
          class="text-3xl font-bold uppercase leading-[1.05] tracking-tight text-white sm:text-4xl"
        >
          {{ cta.title }}
        </h2>
        <p class="mt-5 text-base leading-relaxed text-sand/70 sm:text-lg">{{ cta.subtitle }}</p>
      </div>

      <div class="flex shrink-0 flex-col gap-3 sm:flex-row">
        <a
          :href="`tel:${contacts.phone.value}`"
          class="inline-flex items-center justify-center gap-3 bg-coral px-7 py-4 font-display text-lg font-semibold uppercase tracking-wider text-white transition-colors hover:bg-coral-dark"
        >
          <i class="fa-solid fa-phone text-sm" aria-hidden="true"></i>
          {{ cta.primary }}
        </a>
        <a
          :href="`https://wa.me/${contacts.phone.value.replace('+', '')}`"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center justify-center gap-3 border border-sand/35 px-7 py-4 font-display text-lg font-semibold uppercase tracking-wider text-white transition-colors hover:border-sand hover:bg-white/10"
        >
          <i class="fa-brands fa-whatsapp text-base" aria-hidden="true"></i>
          {{ cta.secondary }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import texts from '~/data/homeTexts.json'
import contacts from '~/data/contactsTexts.json'

const cta = texts.cta
</script>
