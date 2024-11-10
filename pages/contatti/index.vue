<template>
<MainLayout>
    <div>
        <div
    class="hero min-h-[50vh]"
    style="background-image: url(https://www.olsa.com/sites/olsa/files/styles/internal_hero_img/public/2023-12/contact-us-_hero-banner_688x447_D.jpg.webp?itok=gmuZ-fOK);">
            <div class="hero-overlay bg-opacity-60"></div>
            <div class="hero-content text-neutral-content text-center py-12">
                <div>
                    <h1 class="mb-5 text-5xl font-bold mb-12">Contattaci</h1>
                    <div class="contact-details grid grid-cols-1 md:grid-cols-2 gap-8 md:hidden block">
                        <div class="contact-item flex flex-col items-center p-6 rounded-lg shadow-md bg-primary text-white">
                            <div class="bg-white bg-opacity-20 rounded-full w-24 h-24 flex items-center justify-center">
                                <i :class="phoneDetails.icon" class="text-white text-5xl"></i>
                            </div>
                            <p class="font-bold text-2xl mt-2 mb-6">{{ phoneDetails.title }}</p>
                            <p class="text-lg">{{ phoneDetails.value }}</p>
                        </div>
                        <div class="contact-item flex flex-col items-center p-6 rounded-lg shadow-md bg-primary text-white">
                            <div class="bg-white bg-opacity-20 rounded-full w-24 h-24 flex items-center justify-center">
                                <i :class="emailDetails.icon" class="text-white text-5xl"></i>
                            </div>
                            <p class="font-semibold mt-2 mb-6 text-2xl">{{ emailDetails.title }}</p>
                            <p class="text-lg">{{ emailDetails.value }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="contact-details grid-cols-2 gap-8 hidden md:grid -translate-y-1/2 mx-auto max-w-screen-lg">
            <div class="contact-item flex flex-col items-center p-6 rounded-lg shadow-md bg-primary text-white">
                <div class="bg-white bg-opacity-20 rounded-full w-24 h-24 flex items-center justify-center">
                    <i :class="phoneDetails.icon" class="text-white text-5xl"></i>
                </div>
                <p class="font-bold text-2xl mt-2 mb-6">{{ phoneDetails.title }}</p>
                <p class="text-lg">{{ phoneDetails.value }}</p>
            </div>
            <div class="contact-item flex flex-col items-center p-6 rounded-lg shadow-md bg-primary text-white">
                <div class="bg-white bg-opacity-20 rounded-full w-24 h-24 flex items-center justify-center">
                    <i :class="emailDetails.icon" class="text-white text-5xl"></i>
                </div>
                <p class="font-semibold mt-2 mb-6 text-2xl">{{ emailDetails.title }}</p>
                <p class="text-lg">{{ emailDetails.value }}</p>
            </div>
        </div>
    </div>
</MainLayout>
</template>

<script setup>
import MainLayout from '@layouts/MainLayout.vue'

const phoneDetails =
    {
        icon: 'fas fa-phone',
        title: 'Telefono',
        value: '+39 347 356 8443'
    }

const emailDetails =
    {
        icon: 'fas fa-envelope',
        title: 'Email',
        value: 'gsmabbigliamentodalavoro@gmail.com'
    }
</script>