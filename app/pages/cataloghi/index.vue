<template>
  <MainLayout>
    <PageHeader :eyebrow="texts.eyebrow" :title="texts.mainTitle" :subtitle="texts.subtitle" />

    <div class="mx-auto max-w-screen-xl space-y-5 px-5 py-14 lg:px-8 lg:py-20">
      <section
        v-for="(partner, index) in catalogList"
        :key="partner.name"
        class="border border-ink/10 bg-base-100"
      >
        <h2>
          <button
            type="button"
            class="flex w-full items-center gap-5 px-5 py-6 text-left transition-colors hover:bg-sand-light lg:px-8"
            :aria-expanded="isOpen(index)"
            :aria-controls="`catalogs-${partner.name}`"
            @click="toggle(index)"
          >
            <img
              :src="getImagePath(partner.image)"
              :alt="`Logo ${displayName(partner.name)}`"
              class="h-11 w-auto max-w-32 object-contain lg:h-14"
              :class="partner.name === 'makito' ? 'brightness-0' : ''"
            />

            <span class="min-w-0 flex-1">
              <span
                class="block font-display text-xl font-semibold uppercase tracking-wide text-navy lg:text-2xl"
              >
                {{ displayName(partner.name) }}
              </span>
              <span class="mt-0.5 block text-sm text-ink/50">
                {{ partner.catalogs.length }}
                {{ partner.catalogs.length === 1 ? texts.catalogSingular : texts.catalogPlural }}
              </span>
            </span>

            <span
              class="flex h-10 w-10 shrink-0 items-center justify-center border border-ink/15 text-navy transition-all duration-300"
              :class="isOpen(index) ? 'rotate-180 border-coral bg-coral text-white' : ''"
              aria-hidden="true"
            >
              <i class="fa-solid fa-chevron-down text-sm"></i>
            </span>
          </button>
        </h2>

        <div
          v-show="isOpen(index)"
          :id="`catalogs-${partner.name}`"
          class="border-t border-ink/10 px-5 py-9 lg:px-8 lg:py-10"
        >
          <CatalogSection
            :partner="partner.name"
            :catalogs="partner.catalogs"
            :open-label="texts.openLabel"
          />
        </div>
      </section>

      <!-- Aiuto -->
      <aside
        class="flex flex-col gap-5 border border-ink/10 bg-sand-light p-8 sm:flex-row sm:items-center sm:justify-between lg:p-10"
      >
        <div>
          <h2 class="text-2xl font-semibold uppercase tracking-tight text-navy">
            {{ texts.helpTitle }}
          </h2>
          <p class="mt-2 max-w-xl text-sm leading-relaxed text-ink/65 sm:text-base">
            {{ texts.helpText }}
          </p>
        </div>
        <NuxtLink
          to="/contatti"
          class="inline-flex shrink-0 items-center justify-center gap-3 bg-navy px-7 py-4 font-display text-lg font-semibold uppercase tracking-wider text-white transition-colors hover:bg-coral"
        >
          {{ texts.helpCta }}
          <i class="fa-solid fa-arrow-right text-sm" aria-hidden="true"></i>
        </NuxtLink>
      </aside>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '~/components/layout/MainLayout.vue'
import PageHeader from '~/components/atoms/PageHeader.vue'
import CatalogSection from '~/components/molecules/CatalogDropdown.vue'
import catalogList from '~/data/catalogs.json'
import texts from '~/data/cataloghiTexts.json'
import IsaccoLogo from '~/assets/images/partners/logo-isacco.png'
import EndiLogo from '~/assets/images/partners/logo-endi.gif'
import MakitoLogo from '~/assets/images/partners/makito-logo.png'
import JrcLogo from '~/assets/images/partners/logo-jrc.jpg'

const images: Record<string, string> = {
  'logo-isacco.png': IsaccoLogo,
  'logo-endi.gif': EndiLogo,
  'makito-logo.png': MakitoLogo,
  'logo-jrc.jpg': JrcLogo
}

const getImagePath = (imageName: string) => images[imageName]

const displayName = (name: string) =>
  name === 'jrc' ? 'JRC' : name.charAt(0).toUpperCase() + name.slice(1)

// Il primo brand è aperto di default, gli altri si aprono a richiesta
const openPanels = ref<number[]>([0])
const isOpen = (index: number) => openPanels.value.includes(index)
const toggle = (index: number) => {
  openPanels.value = isOpen(index)
    ? openPanels.value.filter((i) => i !== index)
    : [...openPanels.value, index]
}

useSeoMeta({
  title: 'Cataloghi',
  description: texts.subtitle,
  ogTitle: 'Cataloghi - GSM Abbigliamento da Lavoro',
  ogDescription: texts.subtitle
})
</script>
