<template lang="">
    <div class="text-center p-8">
        <h1 class="text-2xl md:text-5xl font-bold text-primary-grey">{{ props.text }}</h1>
    </div>

    <div class="text-primary-grey mx-auto px-8 md:px-0 md:text-lg text-sm">
      <p>{{ props.subtitle }}</p>
    </div>
</template>
<script setup lang="ts">

const props = defineProps({
    text: String,
    subtitle: String
})
</script>