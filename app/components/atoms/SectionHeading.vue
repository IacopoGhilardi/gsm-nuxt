<template>
  <div :class="align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'">
    <p v-if="eyebrow" class="eyebrow text-coral">{{ eyebrow }}</p>
    <component
      :is="as"
      class="mt-4 text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl"
      :class="inverted ? 'text-white' : 'text-navy'"
    >
      {{ title }}
    </component>
    <div
      class="mt-6 h-[3px] w-14 bg-coral"
      :class="align === 'center' ? 'mx-auto' : ''"
      aria-hidden="true"
    />
    <p
      v-if="subtitle"
      class="mt-6 text-base leading-relaxed sm:text-lg"
      :class="inverted ? 'text-sand/75' : 'text-ink/65'"
    >
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    subtitle?: string
    inverted?: boolean
    align?: 'left' | 'center'
    /** Livello del titolo: le pagine interne ne vogliono uno h1. */
    as?: 'h1' | 'h2'
  }>(),
  { inverted: false, align: 'left', as: 'h2' }
)
</script>
