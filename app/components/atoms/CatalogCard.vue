<template>
  <a
    :href="catalog.catalog"
    target="_blank"
    rel="noopener"
    class="group block focus-visible:outline-none"
    :aria-label="`${openLabel} — ${label}`"
  >
    <div
      class="relative overflow-hidden border border-ink/10 bg-sand-light transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:border-ink group-hover:shadow-[6px_6px_0_0_var(--color-coral)] group-focus-visible:-translate-x-1 group-focus-visible:-translate-y-1 group-focus-visible:border-ink group-focus-visible:shadow-[6px_6px_0_0_var(--color-coral)]"
    >
      <img
        :src="catalog.cover"
        :alt="`Copertina catalogo ${label}`"
        class="aspect-3/4 w-full object-cover"
        loading="lazy"
      />

      <div
        class="absolute inset-0 flex items-end bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <span
          class="flex w-full items-center justify-between gap-2 px-4 py-4 font-display text-sm font-semibold uppercase tracking-wider text-white"
        >
          {{ openLabel }}
          <i class="fa-solid fa-arrow-up-right-from-square text-xs" aria-hidden="true"></i>
        </span>
      </div>
    </div>

    <p
      class="mt-3 font-display text-base font-semibold uppercase tracking-wide text-navy transition-colors group-hover:text-coral"
    >
      {{ label }}
    </p>
  </a>
</template>

<script setup lang="ts">
const props = defineProps<{
  catalog: { cover: string; catalog: string; id: string }
  openLabel: string
}>()

// Dall'id "isacco-chef-line-2026" ricaviamo "Chef Line 2026"
const label = computed(() => {
  const parts = props.catalog.id.split('-')
  return parts
    .slice(1)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
})
</script>
