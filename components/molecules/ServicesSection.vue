<template>
  <div class="bg-primary text-white">
    <div class="max-w-screen-lg mx-auto">
      <MainTitle
        :text="homeTexts.servizi.title"
        :subtitle="homeTexts.servizi.subtitle"
      />
  
      <div class="flex flex-col md:flex-row justify-center">
        <ServiceItem
          v-for="service in services"
          :key="service.title"
          :service="service"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import MainTitle from '~/components/atoms/MainTitle.vue';
import ServiceItem from '~/components/atoms/ServiceItem.vue';
import homeTexts from '@/data/homeTexts.json';
import embroidery from '~/assets/images/home/services/cross-stitch.png'
import apron from '~/assets/images/home/services/apron (1).png'
import usb from '~/assets/images/home/services/usb.png'

const services = [
  {
    title: 'Stampe e ricami',
    img: embroidery
  },
  {
    title: 'Gadget promozionali',
    img: usb
  },
  {
    title: 'Abbigliamento da lavoro',
    img: apron
  }
]
</script>
