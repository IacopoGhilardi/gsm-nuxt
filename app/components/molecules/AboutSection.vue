<template>
  <section id="chi-siamo" class="scroll-mt-24 bg-sand-light py-20 lg:py-28">
    <div
      class="mx-auto grid max-w-screen-xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8"
    >
      <div class="relative order-2 lg:order-1">
        <div class="absolute -left-3 -top-3 h-28 w-28 bg-coral sm:-left-5 sm:-top-5" aria-hidden="true" />
        <img
          :src="aboutImage"
          alt="Capo di abbigliamento professionale indossato"
          class="relative aspect-4/3 w-full object-cover object-left shadow-lift lg:aspect-square"
          loading="lazy"
        />
      </div>

      <div class="order-1 lg:order-2">
        <SectionHeading
          :eyebrow="about.eyebrow"
          :title="about.title"
        />
        <div class="mt-7 space-y-5">
          <p
            v-for="(paragraph, i) in about.paragraphs"
            :key="i"
            class="text-base leading-relaxed text-ink/70 sm:text-lg"
          >
            {{ paragraph }}
          </p>
        </div>

        <NuxtLink
          to="/contatti"
          class="group mt-9 inline-flex items-center gap-3 border-b-2 border-coral pb-1 font-display text-lg font-semibold uppercase tracking-wider text-navy transition-colors hover:text-coral"
        >
          {{ about.ctaLabel }}
          <AppIcon name="arrow-right" class="text-sm transition-transform group-hover:translate-x-1" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import SectionHeading from '~/components/atoms/SectionHeading.vue'
import aboutImage from '~/assets/images/home/01_home_endyfactory-1024x512.jpg'
import texts from '~/data/homeTexts.json'

const about = texts.about
</script>
