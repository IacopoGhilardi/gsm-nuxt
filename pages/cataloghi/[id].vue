<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Immagine di copertina -->
      <div class="w-full md:w-1/3">
        <img 
          :src="catalogo?.cover" 
          :alt="catalogo?.title" 
          class="w-full h-auto rounded-lg shadow-lg"
        />
      </div>

      <!-- Dettagli del catalogo -->
      <div class="w-full md:w-2/3">
        <h1 class="text-3xl font-bold mb-4">{{ catalogo?.title }}</h1>
        <p class="text-gray-600 mb-4">{{ catalogo?.description }}</p>
        
        <!-- Puoi aggiungere altri dettagli qui -->
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { id } = route.params

// Qui dovrai implementare la logica per recuperare i dati del catalogo
// Esempio con composable:
const catalogo = ref(null)

onMounted(async () => {
  try {
    // Sostituisci questo con la tua vera chiamata API o logica di recupero 
  } catch (error) {
    console.error('Errore durante il recupero dei dati del catalogo:', error)
  }
})
</script> 