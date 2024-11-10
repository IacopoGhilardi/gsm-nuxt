<template>
    <div class="min-h-screen flex flex-col bg-primaryLight">
        <NavBar></NavBar>
        <div class="flex-grow">
            <slot></slot>        
        </div>
        <Footer></Footer>
    </div>
</template>
<script setup>
import NavBar from '~/components/organism/NavBar.vue'
import Footer from '~/components/organism/Footer.vue'
</script>
