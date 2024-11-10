<template>
  <li>
    <NuxtLink 
      :to="props.route"
      :class="{ 'text-accent font-bold': isActive }"
    >
      <i :class="[icon, { 'text-accent': isActive }]"></i>
      {{ label }}
    </NuxtLink>
  </li>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  label: string;
  route: string;
  icon: string;
}>();

const route = useRoute();
const isActive = computed(() => route.path === props.route);
</script>

<style scoped>
/* Add any specific styles for the navigation item here */
</style> 