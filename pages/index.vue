<template>
  <MainLayout>
    <HeroSection></HeroSection>
    <PartnersSection></PartnersSection>
    <ServicesSection></ServicesSection>
    <AboutSection></AboutSection>
  </MainLayout>
</template>
<script setup>
import HeroSection from '~/components/atoms/heroSection'
import PartnersSection from '~/components/atoms/partnersSection'
import AboutSection from '~/components/atoms/AboutSection.vue';
import ServicesSection from "~/components/atoms/ServicesSection.vue";
import MainLayout from '~/components/layout/MainLayout.vue'
</script>
