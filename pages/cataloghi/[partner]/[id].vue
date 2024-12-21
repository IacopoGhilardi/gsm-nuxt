<template>
    <div class="navbar bg-primaryLight">
     <div class="mx-2 flex-1 px-2">
       <NuxtLink to="/" class="btn btn-ghost text-xl">
         <img class="max-h-full" src="~/assets/images/logo.png" alt="">
       </NuxtLink>
     </div>
     <div class="flex-none">
       <NuxtLink to="/cataloghi" class="btn btn-square btn-ghost bg-orange-500 rounded-full flex items-center justify-center w-12 h-12">
         <svg
           xmlns="http://www.w3.org/2000/svg"
           fill="none"
           viewBox="0 0 24 24"
           class="inline-block h-5 w-5 stroke-current">
           <path
             stroke-linecap="round"
             stroke-linejoin="round"
             stroke-width="2"
             d="M19 12h-14M12 5l-7 7 7 7"></path>
         </svg>
       </NuxtLink>
     </div>
 </div>
 
   <div class="max-w-screen-lg mx-auto px-4">
    <div class="pdf-container">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Caricamento PDF in corso...</p>
      </div>
      <div v-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="retryLoading" class="retry-button">
          Riprova
        </button>
      </div>
      <canvas 
        id="pdf-canvas" 
        class="w-full"
        :class="{ 'hidden': loading || error }"
      ></canvas>
    </div>
  </div>
</template>
 
 <script setup>
 import { ref, onMounted } from 'vue'
 import { useRoute } from 'vue-router'
 import { useNuxtApp } from '#app'

const route = useRoute()
const partner = route.params.partner
const id = route.params.id

const url = ref('')
const loading = ref(true)
const error = ref('')

import catalogoPdf from '~/assets/pdf/cat+ristorazione+03-08.pdf'

const findUrlFromCatalogs = () => {
    return '/pdf/cat+ristorazione+03-08.pdf'
}

const loadPdf = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    url.value = findUrlFromCatalogs();
    if (!url.value) {
      throw new Error('PDF non trovato');
    }
    
    const { $renderPdf } = useNuxtApp();
    await $renderPdf(url.value, 'pdf-canvas');
  } catch (e) {
    console.error('Errore nel caricamento:', e);
    error.value = 'Errore nel caricamento del PDF. Riprova più tardi.';
  } finally {
    loading.value = false;
  }
};

const retryLoading = () => {
  loadPdf();
};

onMounted(() => {
  loadPdf();
});
 </script>

<style scoped>
.pdf-container {
  width: 100%;
  margin: 2rem auto;
  min-height: 500px;
  position: relative;
}

.loading-state {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
}

.error-state {
  text-align: center;
  padding: 2rem;
  color: red;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #333;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

#pdf-canvas {
  background: #f0f0f0;
  border: 1px solid #ccc;
}
</style>