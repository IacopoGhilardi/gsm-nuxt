<template>
    <div class="carousel w-full overflow-hidden">
      <div
        class="carousel-track flex"
        :style="{ transform: `translateX(-${scrollOffset}px)` }"
        ref="carouselTrack"
      >
        <div
          v-for="(partner, index) in displayedPartners"
          :key="index"
          class="carousel-item w-3/12 h-32 flex-shrink-0 flex items-center justify-center py-2 px-7"
        >
          <img :src="partner.path" :alt="partner.title" class="object-contain max-h-24 max-w-24" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import logoEndi from '~/assets/images/partners/logo-endi.gif'
  import logoIsacco from '~/assets/images/partners/logo-isacco.png'
  import logoJrc from '~/assets/images/partners/logo-jrc.jpg'
  import logoMakito from '~/assets/images/partners/makito-logo.png'
  
  const partners = [
    { path: logoEndi, title: 'Endi' },
    { path: logoIsacco, title: 'Isacco' },
    { path: logoJrc, title: 'Jrc' },
    { path: logoMakito, title: 'Makito' },
  ]
  
  const displayedPartners = [...partners, ...partners]
  const scrollOffset = ref(0)
  const scrollSpeed = 1
  let scrollInterval
  
  const startScroll = () => {
    const carouselTrack = document.querySelector('.carousel-track')
  
    scrollInterval = setInterval(() => {
      scrollOffset.value += scrollSpeed
      // Quando l'offset supera la metà della larghezza, reimposta senza interrompere
      if (scrollOffset.value >= carouselTrack.scrollWidth / 2) {
        scrollOffset.value = 0
      }
    }, 16) // Circa 60 FPS
  }
  
  onMounted(() => {
    startScroll()
  })
  
  onUnmounted(() => {
    clearInterval(scrollInterval)
  })
  </script>
  
  <style scoped>
  .carousel-item {
    width: 25%; /* Assicurati che ogni elemento occupi il 25% della larghezza del contenitore */
    height: 8rem; /* Imposta un'altezza fissa per uniformare le dimensioni */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1.75rem;
  }
  
  .carousel-item img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain; /* Assicura che l'immagine si adatti senza distorsioni */
  }
  </style>
  