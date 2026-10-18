<template>
  <section class="relative isolate overflow-hidden bg-navy-900">
    <img
      :src="heroImage"
      alt=""
      aria-hidden="true"
      class="absolute inset-0 h-full w-full object-cover object-center"
    />
    <div
      class="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-900/50"
      aria-hidden="true"
    />
    <div
      class="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent"
      aria-hidden="true"
    />

    <div class="relative mx-auto max-w-screen-xl px-5 pb-0 pt-24 sm:pt-32 lg:px-8 lg:pt-40">
      <div class="max-w-3xl pb-20 lg:pb-28">
        <p class="eyebrow text-coral">{{ hero.eyebrow }}</p>

        <h1
          class="mt-6 whitespace-pre-line text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          {{ hero.title }}
        </h1>

        <p class="mt-7 max-w-xl text-base leading-relaxed text-sand/80 sm:text-lg">
          {{ hero.subtitle }}
        </p>

        <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <NuxtLink
            to="/cataloghi"
            class="group inline-flex items-center justify-center gap-3 bg-coral px-7 py-4 font-display text-lg font-semibold uppercase tracking-wider text-white transition-colors hover:bg-coral-dark"
          >
            {{ hero.catalogButton }}
            <i
              class="fa-solid fa-arrow-right text-sm transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            ></i>
          </NuxtLink>
          <a
            href="#chi-siamo"
            class="inline-flex items-center justify-center gap-3 border border-sand/35 px-7 py-4 font-display text-lg font-semibold uppercase tracking-wider text-white transition-colors hover:border-sand hover:bg-white/10"
          >
            {{ hero.aboutButton }}
          </a>
        </div>
      </div>
    </div>

    <!-- Fascia dati -->
    <div class="relative border-t border-sand/15 bg-navy-900/70 backdrop-blur-sm">
      <!-- flex invece di colonne fisse: si adatta al numero di voci nei testi -->
      <dl
        class="mx-auto flex max-w-screen-xl flex-col divide-y divide-sand/15 px-5 sm:flex-row sm:divide-x sm:divide-y-0 lg:px-8"
      >
        <div
          v-for="fact in hero.facts"
          :key="fact.label"
          class="flex-1 px-0 py-7 sm:px-8 sm:first:pl-0"
        >
          <dt class="eyebrow text-sand/55">{{ fact.label }}</dt>
          <dd class="mt-2 font-display text-3xl font-bold uppercase text-white sm:text-4xl">
            {{ fact.value }}
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<script setup>
import heroImage from '~/assets/images/home/chisiamo_endyfactory2.jpg'
import texts from '~/data/homeTexts.json'

const hero = texts.hero
</script>
