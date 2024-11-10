<template>
  <mainLayout>
    <div>
      <MainTitle 
        :text="texts.mainTitle" 
        :subtitle="texts.subtitle"
      />
      <details class="collapse bg-base-200">
        <summary class="collapse-title text-xl font-medium">
            <img class="max-h-full max-w-1/2" src="~/assets/images/partners/logo-endi.gif" alt="Endi">
        </summary>
        <div class="collapse-content">
          <div class="flex-col space-y-4 mt-8 px-4">
            <CatalogSection 
              v-for="(partner, index) in catalogList" 
              :key="index" 
              :catalogs="partner.catalogs"
            />
          </div>
        </div>
      </details>
    </div>
  </mainLayout>
</template>

<script setup lang="ts">
import MainLayout from '~/components/layout/MainLayout.vue';
import MainTitle from '~/components/atoms/MainTitle.vue';
import CatalogSection from '~/components/molecules/CatalogDropdown.vue';
import catalogList from '~/data/catalogs.json';
import texts from '~/data/cataloghiTexts.json';
</script>