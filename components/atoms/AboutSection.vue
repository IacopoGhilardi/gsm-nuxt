<template>
  <div class="relative max-w-screen-lg mx-auto">
    <div class="text-primary-grey w-full h-full min-h-96 relative" id="principal-banner">
      <img class="md:block hidden h-full max-w-full" :src="EndiHome" alt="endi logo">
      <div class="md:hidden block absolute inset-0 bg-cover bg-center" :style="{ backgroundImage: `url(${EndiHome})` }">
      </div>
    </div>
    <div class="absolute top-0 right-0 md:w-6/12 w-full h-full p-4 text-center flex flex-col justify-center bg-black md:bg-opacity-0 bg-opacity-60">
      <h3 id="chi-siamo" class="md:text-4xl text-2xl font-bold md:text-primary text-white mb-6">Qualcosa su di noi</h3>
      <p class="md:text-primary text-white mb-4">{{ mainText }}</p>
    </div>
  </div>
</template>

<script setup>
import EndiHome from '~/assets/images/home/sfondo-removebg-preview.png'
const mainText = "Con oltre vent'anni di esperienza nel settore dell'abbigliamento da lavoro, offriamo soluzioni personalizzate e di alta qualità, garantendo un servizio professionale e affidabile."
</script>
<style scoped>
  .preview-banner {
    background-image: url('@/assets/images/sfondo-removebg-preview.png');
  }
</style>
