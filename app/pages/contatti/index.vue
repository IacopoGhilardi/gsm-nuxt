<template>
  <MainLayout>
    <PageHeader :eyebrow="texts.eyebrow" :title="texts.mainTitle" :subtitle="texts.subtitle" />

    <div class="mx-auto max-w-screen-xl px-5 py-14 lg:px-8 lg:py-20">
      <!-- Canali diretti -->
      <div class="grid gap-5 md:grid-cols-3">
        <a
          v-for="channel in channels"
          :key="channel.title"
          :href="channel.href"
          :target="channel.external ? '_blank' : undefined"
          :rel="channel.external ? 'noopener' : undefined"
          class="group flex flex-col border border-ink/10 bg-base-100 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-[6px_6px_0_0_var(--color-coral)]"
        >
          <span
            class="flex h-14 w-14 items-center justify-center bg-navy text-xl text-white transition-colors group-hover:bg-coral"
          >
            <i :class="channel.icon" aria-hidden="true"></i>
          </span>

          <span class="eyebrow mt-7 text-ink/45">{{ channel.title }}</span>
          <span
            class="mt-2 font-display font-semibold text-navy"
            :class="
              channel.compact
                ? 'break-all text-lg lowercase lg:text-xl'
                : 'text-xl uppercase tracking-wide lg:text-2xl'
            "
          >
            {{ channel.value }}
          </span>
          <span
            class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-coral transition-transform group-hover:translate-x-1"
          >
            {{ channel.label }}
            <i class="fa-solid fa-arrow-right text-xs" aria-hidden="true"></i>
          </span>
        </a>
      </div>

      <!-- Info -->
      <div class="mt-5 grid gap-5 md:grid-cols-2">
        <div
          v-for="info in infos"
          :key="info.title"
          class="flex items-center gap-5 border border-ink/10 bg-sand-light p-8"
        >
          <span class="flex h-12 w-12 shrink-0 items-center justify-center bg-coral/10 text-lg text-coral">
            <i :class="info.icon" aria-hidden="true"></i>
          </span>
          <div>
            <p class="eyebrow text-ink/45">{{ info.title }}</p>
            <p class="mt-1.5 font-display text-lg font-semibold uppercase tracking-wide text-navy">
              {{ info.value }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <CtaSection />
  </MainLayout>
</template>

<script setup>
import MainLayout from '~/components/layout/MainLayout.vue'
import PageHeader from '~/components/atoms/PageHeader.vue'
import CtaSection from '~/components/molecules/CtaSection.vue'
import texts from '~/data/contactsTexts.json'

const whatsappNumber = texts.phone.value.replace('+', '')
const formattedPhone = texts.phone.value.replace(
  /^(\+39)(\d{3})(\d{3})(\d{4})$/,
  '$1 $2 $3 $4'
)

const channels = [
  {
    icon: texts.phone.icon,
    title: texts.phone.title,
    value: formattedPhone,
    label: texts.phone.label,
    href: `tel:${texts.phone.value}`,
    external: false
  },
  {
    icon: texts.whatsapp.icon,
    title: texts.whatsapp.title,
    value: formattedPhone,
    label: texts.whatsapp.label,
    href: `https://wa.me/${whatsappNumber}`,
    external: true
  },
  {
    icon: texts.email.icon,
    title: texts.email.title,
    value: texts.email.value,
    label: texts.email.label,
    href: `mailto:${texts.email.value}`,
    external: false,
    compact: true
  }
]

const infos = [texts.area, texts.hours]

useSeoMeta({
  title: 'Contatti',
  description: texts.subtitle,
  ogTitle: 'Contatti - GSM Abbigliamento da Lavoro',
  ogDescription: texts.subtitle
})
</script>
