<template>
  <mainLayout>
    <div class="max-w-screen-xl mx-auto px-4 text-center">
      <div class="text-primary pb-8">
        <MainTitle
            :text="texts.mainTitle" 
            :subtitle="texts.subtitle"
          />
      </div>
     
      <div v-for="(partner, index) in catalogList" :key="index" class="card-container py-4">
        <details class="collapse collapse-arrow bg-base-200">
          <summary class="collapse-title text-xl font-medium h-24 px-6">
              <img :src="getImagePath(partner.image)" alt="Logo" class="max-h-full">
          </summary>
          <div class="collapse-content">
            <div class="flex-col space-y-4 mt-8 px-4">
              <CatalogSection 
                :partner="partner.name"
                :catalogs="partner.catalogs"
              />
            </div>
          </div>
        </details>
      </div>
    </div>
  </mainLayout>
</template>

<script setup lang="ts">
import MainLayout from '~/components/layout/MainLayout.vue';
import MainTitle from '~/components/atoms/MainTitle.vue';
import CatalogSection from '~/components/molecules/CatalogDropdown.vue';
import catalogList from '~/data/catalogs.json';
import texts from '~/data/cataloghiTexts.json';
import IsaccoLogo from '~/assets/images/partners/logo-isacco.png';
import EndiLogo from '~/assets/images/partners/logo-endi.gif';
import MakitoLogo from '~/assets/images/partners/makito-logo.png';
import JrcLogo from '~/assets/images/partners/logo-jrc.jpg';

const { $gsap } = useNuxtApp();
const contentRefs = ref<HTMLElement[]>([]);

const images = {
  'logo-isacco.png': IsaccoLogo,
  'logo-endi.gif': EndiLogo,
  'makito-logo.png': MakitoLogo,
  'logo-jrc.jpg': JrcLogo,
};

function getImagePath(imageName: string) {
  return images[imageName as keyof typeof images];
}
</script>
