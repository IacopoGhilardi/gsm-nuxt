<template>
  <NuxtLink
    :to="route"
    class="relative px-4 py-2 font-display text-base font-semibold uppercase tracking-widest transition-colors"
    :class="isActive ? 'text-navy' : 'text-ink/60 hover:text-navy'"
  >
    {{ label }}
    <span
      class="absolute inset-x-4 -bottom-0.5 h-[3px] origin-left bg-coral transition-transform duration-300"
      :class="isActive ? 'scale-x-100' : 'scale-x-0'"
      aria-hidden="true"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  route: string
  icon?: string
}>()

const currentRoute = useRoute()
const isActive = computed(() =>
  props.route === '/'
    ? currentRoute.path === '/'
    : currentRoute.path.startsWith(props.route)
)
</script>
