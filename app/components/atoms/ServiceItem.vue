<template>
  <article
    class="group relative flex flex-col border border-sand/20 bg-white/5 p-8 transition-colors duration-300 hover:border-coral/60 hover:bg-white/10"
  >
    <div class="flex items-start justify-between gap-4">
      <span
        class="flex h-14 w-14 items-center justify-center bg-coral text-2xl text-white"
        aria-hidden="true"
      >
        <AppIcon :name="service.icon" />
      </span>
      <span
        class="font-display text-5xl font-bold leading-none text-sand/15 transition-colors group-hover:text-sand/30"
        aria-hidden="true"
      >
        {{ index }}
      </span>
    </div>

    <h3 class="mt-8 text-2xl font-semibold uppercase leading-tight tracking-tight text-white">
      {{ service.title }}
    </h3>
    <p class="mt-3 text-sm leading-relaxed text-sand/70">{{ service.description }}</p>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  service: { title: string; description: string; icon: string }
  index: string
}>()
</script>
