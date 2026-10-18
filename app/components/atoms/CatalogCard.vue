<template>
  <!-- NuxtLink riconosce da solo gli URL esterni e rende una <a> normale:
       niente <component :is>, che con resolveComponent in un'espressione del
       template finiva nell'HTML come tag <NuxtLink> letterale. -->
  <NuxtLink
    :to="browsable ? `/cataloghi/${partner}/${catalog.id}` : catalog.catalog"
    :target="browsable ? undefined : '_blank'"
    :rel="browsable ? undefined : 'noopener'"
    class="group block focus-visible:outline-none"
    :aria-label="browsable ? `Sfoglia ${label}` : `Apri il PDF di ${label}`"
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
          {{ browsable ? 'Sfoglia' : 'Apri il PDF' }}
          <AppIcon :name="browsable ? 'fa-solid fa-book-open' : 'fa-solid fa-arrow-up-right-from-square'" class="text-xs" />
        </span>
      </div>
    </div>

    <p
      class="mt-3 font-display text-base font-semibold uppercase tracking-wide text-navy transition-colors group-hover:text-coral"
    >
      {{ label }}
    </p>
    <p v-if="browsable" class="mt-0.5 text-sm text-ink/45">{{ catalog.pages }} pagine</p>
  </NuxtLink>
</template>

<script setup lang="ts">
import { catalogLabel } from '~/utils/catalogPages'

const props = defineProps<{
  partner: string
  catalog: { cover: string; catalog: string; id: string; pages?: number }
}>()

const label = computed(() => catalogLabel(props.catalog.id))

// Senza pagine pre-renderizzate il link punta direttamente al PDF, come prima
const browsable = computed(() => Boolean(props.catalog.pages))
</script>
