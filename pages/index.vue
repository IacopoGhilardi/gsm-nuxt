<template>
  <MainLayout>
    <HeroSection></HeroSection>
    <PartnersSection></PartnersSection>
    <ServicesSection></ServicesSection>
    <AboutSection></AboutSection>
  </MainLayout>
</template>
<script setup>
import HeroSection from '~/components/molecules/HeroSection.vue'
import PartnersSection from '~/components/molecules/PartnersSection.vue'
import AboutSection from '~/components/molecules/AboutSection.vue';
import ServicesSection from "~/components/molecules/ServicesSection.vue";
import MainLayout from '~/components/layout/MainLayout.vue'
</script>
