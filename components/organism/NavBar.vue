<template>
<div>
    <div class="max-w-screen-2xl mx-auto w-full drawer">
        <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col">
            <div class="navbar bg-primaryLight shadow-lg w-full">
                <div class="mx-2 flex-1 px-2">
                    <NuxtLink to="/" class="btn btn-ghost text-xl">
                        <img class="max-h-full" src="~/assets/images/logo.png" alt="">
                    </NuxtLink>
                </div>
                <div class="flex-none lg:hidden cursor-pointer">
                    <label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost"> 
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    class="inline-block h-6 w-6 stroke-current">
                        <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                    </label>
                </div>
                <div class="hidden flex-none lg:block">
                    <ul class="menu menu-horizontal">
                        <NavItem 
                            v-for="item in texts.navigation" 
                            :key="item.label"
                            :label="item.label"
                            :route="item.route"
                            :icon="item.icon"
                        />
                    </ul>
                </div>
            </div>
        </div>
      <div class="drawer-side fixed inset-0 z-50">
        <label for="my-drawer-3" class="drawer-overlay bg-black opacity-80"></label>
        <ul class="menu bg-primaryLight min-h-full w-64">
          <li class="flex justify-end">
            <label for="my-drawer-3" class="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-6 w-6 stroke-current">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </label>
            <div class="divider"></div>
          </li>
          <NavItem 
            v-for="item in texts.navigation" 
            :key="item.label"
            :label="item.label"
            :route="item.route"
            :icon="item.icon"
          />
        </ul>
      </div>

    </div>
</div>
</template>

<script setup lang="ts">
import NavItem from '~/components/atoms/NavItem.vue';
import texts from '~/data/navbarTexts.json';
</script>

<style scoped>
.navbar a {
    transition: color 0.3s ease;
}
</style>
