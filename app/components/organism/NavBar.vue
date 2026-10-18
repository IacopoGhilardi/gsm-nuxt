<template>
  <header class="sticky top-0 z-50">
    <div class="border-b border-ink/10 bg-base-100/90 backdrop-blur-md">
      <div class="mx-auto flex h-20 max-w-screen-xl items-center gap-4 px-5 lg:px-8">
        <NuxtLink to="/" class="shrink-0" aria-label="GSM — torna alla home">
          <img
            src="~/assets/images/logo.png"
            alt="GSM Abbigliamento da Lavoro"
            class="h-11 w-auto lg:h-12"
          />
        </NuxtLink>

        <!-- Desktop -->
        <nav class="ml-auto hidden items-center gap-1 lg:flex" aria-label="Navigazione principale">
          <NavItem
            v-for="item in texts.navigation"
            :key="item.label"
            :label="item.label"
            :route="item.route"
            :icon="item.icon"
          />
        </nav>

        <a
          :href="whatsappUrl"
          target="_blank"
          rel="noopener"
          class="ml-auto hidden items-center gap-2 bg-coral px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral-dark lg:ml-6 lg:flex"
        >
          <AppIcon name="whatsapp" class="text-base" />
          <span>{{ formattedPhone }}</span>
        </a>

        <!-- Mobile -->
        <button
          type="button"
          class="ml-auto flex h-11 w-11 items-center justify-center border border-ink/15 text-ink transition-colors hover:bg-sand lg:hidden"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          aria-label="Apri il menu"
          @click="open = true"
        >
          <AppIcon name="bars" class="text-lg" />
        </button>
      </div>
    </div>

    <!-- Drawer mobile -->
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 bg-ink/60 lg:hidden"
        @click="open = false"
      />
    </Transition>
    <Transition name="slide">
      <aside
        v-if="open"
        id="mobile-nav"
        class="fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85vw] flex-col bg-base-100 shadow-2xl lg:hidden"
      >
        <div class="flex h-20 items-center justify-between border-b border-ink/10 px-5">
          <span class="eyebrow text-navy">Menu</span>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center text-ink/60 transition-colors hover:text-coral"
            aria-label="Chiudi il menu"
            @click="open = false"
          >
            <AppIcon name="xmark" class="text-xl" />
          </button>
        </div>

        <nav class="flex flex-col p-3" aria-label="Navigazione mobile">
          <NuxtLink
            v-for="item in texts.navigation"
            :key="item.label"
            :to="item.route"
            class="flex items-center gap-3 border-l-2 px-4 py-4 font-display text-lg font-semibold uppercase tracking-wide transition-colors"
            :class="
              isActive(item.route)
                ? 'border-coral bg-sand-light text-navy'
                : 'border-transparent text-ink/70 hover:border-ink/20 hover:text-navy'
            "
            @click="open = false"
          >
            <span class="flex w-5 shrink-0 justify-center"><AppIcon :name="item.icon" class="text-base" /></span>
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="mt-auto space-y-3 border-t border-ink/10 p-5">
          <a
            :href="whatsappUrl"
            target="_blank"
            rel="noopener"
            class="flex w-full items-center justify-center gap-2 bg-coral px-4 py-3 text-sm font-semibold text-white"
          >
            <AppIcon name="whatsapp" class="text-base" />
            Scrivici su WhatsApp
          </a>
        </div>
      </aside>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import NavItem from '~/components/atoms/NavItem.vue'
import texts from '~/data/navbarTexts.json'
import contacts from '~/data/contactsTexts.json'

const open = ref(false)
const route = useRoute()

const whatsappUrl = `https://wa.me/${contacts.phone.value.replace('+', '')}`

const formattedPhone = computed(() =>
  contacts.phone.value.replace(/^(\+39)(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3 $4')
)

const isActive = (path: string) =>
  path === '/' ? route.path === '/' : route.path.startsWith(path)

// Chiude il drawer alla navigazione e blocca lo scroll quando è aperto
watch(() => route.fullPath, () => (open.value = false))
watch(open, (isOpen) => {
  if (import.meta.client) {
    document.documentElement.style.overflow = isOpen ? 'hidden' : ''
  }
})
onUnmounted(() => {
  if (import.meta.client) document.documentElement.style.overflow = ''
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
