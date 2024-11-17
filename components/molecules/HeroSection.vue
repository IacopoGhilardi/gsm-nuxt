<template>
    <div
        class="hero min-h-[50vh]"
        :style="`background-image: url(${heroImage})`">
        <div class="hero-overlay bg-black bg-opacity-70"></div>
        <div class="hero-content text-neutral-content text-center">
        <div class="max-w-md">
            <h1 class="mb-5 lg:text-4xl text-2xl font-bold text-white">
                {{ heroTexts.hero.title }}
            </h1>
            <div class="lg:space-x-3 flex justify-center lg:flex-row flex-col lg:space-y-0 space-y-3 px-6">
            <NuxtLink to="/cataloghi" class="btn bg-primary text-white border-primary">
                {{ heroTexts.hero.catalogButton }}
            </NuxtLink>
            <NuxtLink to="#chi-siamo" class="btn bg-accent text-white border-accent">
                {{ heroTexts.hero.aboutButton }}
            </NuxtLink>
            </div>
        </div>
        </div>
    </div>
</template>
<script setup>
import heroImage from '@/assets/images/home/chisiamo_endyfactory2.jpg'
import heroTexts from '@/data/homeTexts.json'
</script>
<style scoped>
html {
  scroll-behavior: smooth;
}
</style>