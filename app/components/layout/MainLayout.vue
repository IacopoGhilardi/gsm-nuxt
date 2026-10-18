<template>
  <div class="min-h-screen flex flex-col bg-base-100">
    <NavBar />
    <main class="flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import NavBar from '~/components/organism/NavBar.vue'
import Footer from '~/components/organism/Footer.vue'
</script>
