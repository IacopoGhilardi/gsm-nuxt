<template>
  <div>
    <div>
      <NuxtLink 
        v-for="(item, index) in catalogs" 
        :key="index"
        :to="`/cataloghi/${item.id}`"
        class="block"
      >
        <img 
          :src="item.cover" 
          alt="Catalogo cover" 
          class="catalog-cover cursor-pointer transition-all hover:brightness-110" 
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  catalogs: Array<{
    cover: string
    id: string
  }>
}>()
</script>

<style scoped>
.catalog-cover {
  width: 200px;
  height: 300px;
  object-fit: cover;
}
</style> 