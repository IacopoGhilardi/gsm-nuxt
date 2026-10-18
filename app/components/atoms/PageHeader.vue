<template>
  <section class="grid-paper border-b border-ink/10 bg-navy">
    <div class="mx-auto max-w-screen-xl px-5 py-16 lg:px-8 lg:py-20">
      <SectionHeading inverted :eyebrow="eyebrow" :title="title" :subtitle="subtitle" />
    </div>
  </section>
</template>

<script setup lang="ts">
import SectionHeading from '~/components/atoms/SectionHeading.vue'

defineProps<{
  eyebrow?: string
  title: string
  subtitle?: string
}>()
</script>
