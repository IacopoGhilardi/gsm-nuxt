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
 
   <div class="">
    <canvas id="pdf-canvas" style="border: 1px solid red;"></canvas>   </div>
 </template>
 
 <script setup>
 import { ref, onMounted } from 'vue'
 import catalogs from '~/data/catalogs.json'
 import { useRoute } from 'vue-router'
 import { useNuxtApp } from '#app'

const route = useRoute()
const partner = route.params.partner
const id = route.params.id

const url = ref('')

const findUrlFromCatalogs = () => {
    const partnerCatalogs = catalogs.find(catalog => catalog.name === partner)?.catalogs
    if (!partnerCatalogs) {
        return undefined;
    }
    
    const catalog = partnerCatalogs.find(catalog => catalog.id === id)?.catalog
    if (!catalog) {
        return null;
    }
    
    return catalog;
}

onMounted(() => {
    url.value = findUrlFromCatalogs();
    if (url.value) {
        const { $renderPdf } = useNuxtApp();
        $renderPdf(url.value, 'pdf-canvas');
    }
});
 </script>