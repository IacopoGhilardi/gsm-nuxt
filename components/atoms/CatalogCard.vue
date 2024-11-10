<template>
  <div class="card-container">
    <div class="card relative">
      <a :href="props.pdfPath" target="_blank" class="absolute top-0 left-0 w-full h-full hover:bg-primary transition-all cursor-pointer hover:bg-opacity-40"></a>
      <div class="w-full h-full">
        <img class="card-image" :src="props.imageName" alt="Abbigliamento da lavoro a Pisa - Catalogo">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  imageName: String,
  pdfPath: String
});
</script>

<style>
.card-container {
  width: fit-content;
}

.card {
  max-height: 300px;
  max-width: 240px;
}

.card-image {
  max-height: 300px;
  max-width: 240px;
}
</style> 