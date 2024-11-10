<template>
    <div class="card w-full mt-10">
        <figure>
            <img
                :src="service.img"
                class="max-h-32 max-w-32"
                alt="embroidery" />
        </figure>
        <div class="card-body flex flex-col items-center">
            <h2 class="card-title">{{ service.title }}</h2>
        </div>
    </div>
</template>
<script setup>
defineProps({
    service: {
        type: Object,
        required: true
    }
})
</script>