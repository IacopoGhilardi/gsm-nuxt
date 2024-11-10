<template>
    <footer class="footer footer-center bg-primary text-white p-10">
  <ul class="grid grid-flow-col gap-8">
    <NavItem 
        v-for="item in navbarTexts.navigation" 
        :key="item.label"
        :label="item.label"
        :route="item.route"
        :icon="item.icon"
        />
    </ul>
  <aside class="flex flex-col md:flex-row gap-2">
    <p>{{ texts.azienda }}</p>
    <span class="hidden md:block">-</span>
    <p>P.IVA {{ texts.partitaIva }}</p>
    <span class="hidden md:block">-</span>
    <p>{{ texts.settore }}</p>
  </aside>
</footer>
</template>
<script setup>
import texts from '@/data/footerTexts.json';
import navbarTexts from '@/data/navbarTexts.json';
import NavItem from '~/components/atoms/NavItem.vue';
</script>
