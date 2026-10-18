<template>
  <div class="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
    <CatalogCard
      v-for="item in catalogs"
      :key="item.id"
      :catalog="item"
      :open-label="openLabel"
    />
  </div>
</template>

<script setup lang="ts">
import CatalogCard from '~/components/atoms/CatalogCard.vue'

defineProps<{
  partner: string
  openLabel: string
  catalogs: Array<{ cover: string; catalog: string; id: string }>
}>()
</script>
