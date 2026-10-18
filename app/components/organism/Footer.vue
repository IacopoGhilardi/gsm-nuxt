<template>
  <footer class="bg-navy-900 text-sand">
    <div class="mx-auto max-w-screen-xl px-5 py-14 lg:px-8">
      <div class="grid gap-10 md:grid-cols-3">
        <div>
          <img
            src="~/assets/images/logo.png"
            alt="GSM Abbigliamento da Lavoro"
            class="h-11 w-auto brightness-0 invert"
          />
          <p class="mt-5 max-w-xs text-sm leading-relaxed text-sand/70">
            {{ texts.claim }}
          </p>
        </div>

        <nav aria-label="Navigazione footer">
          <h2 class="eyebrow text-coral">Naviga</h2>
          <ul class="mt-5 space-y-3">
            <li v-for="item in navbarTexts.navigation" :key="item.label">
              <NuxtLink
                :to="item.route"
                class="inline-flex items-center gap-3 text-sm text-sand/80 transition-colors hover:text-white"
              >
                <span class="flex w-4 shrink-0 justify-center text-coral"><AppIcon :name="item.icon" class="text-sm" /></span>
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div>
          <h2 class="eyebrow text-coral">Contatti</h2>
          <ul class="mt-5 space-y-3 text-sm">
            <li>
              <a
                :href="`tel:${contacts.phone.value}`"
                class="inline-flex items-center gap-3 text-sand/80 transition-colors hover:text-white"
              >
                <span class="flex w-4 shrink-0 justify-center text-coral"><AppIcon name="phone" class="text-sm" /></span>
                {{ formattedPhone }}
              </a>
            </li>
            <li>
              <a
                :href="`https://wa.me/${contacts.phone.value.replace('+', '')}`"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-3 text-sand/80 transition-colors hover:text-white"
              >
                <span class="flex w-4 shrink-0 justify-center text-coral"><AppIcon name="whatsapp" class="text-sm" /></span>
                WhatsApp
              </a>
            </li>
            <li>
              <a
                :href="`mailto:${contacts.email.value}`"
                class="inline-flex items-start gap-3 break-all text-sand/80 transition-colors hover:text-white"
              >
                <span class="flex w-4 shrink-0 justify-center text-coral"><AppIcon name="envelope" class="text-sm" /></span>
                {{ contacts.email.value }}
              </a>
            </li>
            <li class="inline-flex items-center gap-3 text-sand/80">
              <span class="flex w-4 shrink-0 justify-center text-coral"><AppIcon name="location-dot" class="text-sm" /></span>
              Pisa e provincia
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-12 flex flex-col gap-2 border-t border-sand/15 pt-7 text-xs text-sand/55 md:flex-row md:items-center md:justify-between"
      >
        <p>© {{ year }} {{ texts.azienda }} — {{ texts.settore }}</p>
        <p>P.IVA {{ texts.partitaIva }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import texts from '~/data/footerTexts.json'
import navbarTexts from '~/data/navbarTexts.json'
import contacts from '~/data/contactsTexts.json'

const year = new Date().getFullYear()
const formattedPhone = contacts.phone.value.replace(
  /^(\+39)(\d{3})(\d{3})(\d{4})$/,
  '$1 $2 $3 $4'
)
</script>
