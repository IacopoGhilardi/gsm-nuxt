<template>
    <div>
        <div class="drawer">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <label for="my-drawer" class="drawer-button cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
    </label>
  </div>
  <div class="drawer-side mt-4">
      <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <button class="close-button" @click="isOpen = false" aria-label="close sidebar">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
        <ul class="menu text-base-content p-4 pt-16 min-h-full w-80 z-max">
      <li v-for="item in navItems" :key="item.label">
        <NuxtLink 
            :to="item.route"
            :class="{ 'text-accent font-bold': isActive(item.route) }"
        >
            <i :class="[item.icon, { 'text-accent': isActive(item.route) }]"></i>
            {{ item.label }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</div>
    </div>
</template>

<script setup>
const isOpen = ref(false)
const router = useRouter();
const route = useRoute();

const props = defineProps({
  navItems: {
    type: Array,
    required: true,
    default: () => []
  }
})

const isActive = (path) => {
    if (path === '/') {
        return route.path === '/';
    }
    return route.path.startsWith(path);
};
</script> 