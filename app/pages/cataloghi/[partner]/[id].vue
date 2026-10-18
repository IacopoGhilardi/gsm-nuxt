<template>
  <div class="flex h-[100dvh] flex-col overflow-hidden bg-navy-900">
    <!-- Barra -->
    <header class="shrink-0 border-b border-sand/15 bg-navy-900/95 backdrop-blur-md">
      <div class="mx-auto flex h-16 max-w-screen-2xl items-center gap-3 px-4 lg:px-6">
        <NuxtLink
          to="/cataloghi"
          class="flex h-10 shrink-0 items-center gap-2 px-2 text-sand/70 transition-colors hover:text-white"
        >
          <AppIcon name="arrow-left" class="text-sm" />
          <span class="hidden font-display text-base font-semibold uppercase tracking-wider sm:inline">
            Cataloghi
          </span>
        </NuxtLink>

        <h1
          class="min-w-0 flex-1 truncate text-center font-display text-lg font-semibold uppercase tracking-wide text-white"
        >
          {{ label }}
        </h1>

        <a
          :href="catalog.catalog"
          target="_blank"
          rel="noopener"
          class="flex h-10 shrink-0 items-center gap-2 px-2 text-sand/70 transition-colors hover:text-white"
          title="Scarica il PDF originale ad alta risoluzione"
        >
          <AppIcon name="download" class="text-sm" />
          <span class="hidden font-display text-base font-semibold uppercase tracking-wider sm:inline">
            PDF
          </span>
        </a>
      </div>
    </header>

    <!-- Pagina -->
    <div
      ref="stage"
      class="relative flex min-h-0 flex-1 items-center justify-center overflow-auto p-3 sm:p-6"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <img
        ref="pageImg"
        :key="page"
        :src="buildPageUrl(pagesBase, catalog.id, page, fitWidth)"
        :alt="`${label} — pagina ${page} di ${catalog.pages}`"
        :class="
          zoomed
            ? 'h-auto w-[240%] max-w-none cursor-zoom-out sm:w-[150%]'
            : 'max-h-full w-auto max-w-full cursor-zoom-in'
        "
        decoding="async"
        fetchpriority="high"
        @load="loading = false"
        @error="failed = true"
        @click="toggleZoom"
      />

      <div
        v-if="loading && !failed"
        class="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span class="h-10 w-10 animate-spin rounded-full border-2 border-sand/25 border-t-coral" />
      </div>

      <div v-if="failed" class="max-w-sm px-6 text-center">
        <p class="text-sand/80">
          Questa pagina non è disponibile nell'anteprima.
        </p>
        <a
          :href="catalog.catalog"
          target="_blank"
          rel="noopener"
          class="mt-5 inline-flex items-center gap-2 bg-coral px-5 py-3 font-display text-base font-semibold uppercase tracking-wider text-white"
        >
          <AppIcon name="download" class="text-sm" />
          Apri il PDF
        </a>
      </div>

      <!-- Frecce desktop -->
      <button
        v-if="page > 1"
        type="button"
        class="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center bg-navy-900/70 text-white transition-colors hover:bg-coral lg:flex"
        aria-label="Pagina precedente"
        @click="go(page - 1)"
      >
        <AppIcon name="chevron-left" />
      </button>
      <button
        v-if="page < catalog.pages"
        type="button"
        class="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center bg-navy-900/70 text-white transition-colors hover:bg-coral lg:flex"
        aria-label="Pagina successiva"
        @click="go(page + 1)"
      >
        <AppIcon name="chevron-right" />
      </button>
    </div>

    <!-- Comandi -->
    <nav
      class="shrink-0 border-t border-sand/15 bg-navy-900/95 backdrop-blur-md"
      aria-label="Navigazione pagine"
    >
      <div class="mx-auto flex h-16 max-w-screen-2xl items-center gap-3 px-4 lg:px-6">
        <button
          type="button"
          class="flex h-11 w-11 items-center justify-center border border-sand/25 text-white transition-colors enabled:hover:border-coral enabled:hover:bg-coral disabled:opacity-30"
          :disabled="page <= 1"
          aria-label="Pagina precedente"
          @click="go(page - 1)"
        >
          <AppIcon name="chevron-left" class="text-sm" />
        </button>

        <form
          class="flex flex-1 items-center justify-center gap-2"
          novalidate
          @submit.prevent="jump"
        >
          <input
            id="page-input"
            v-model="pageInput"
            type="text"
            inputmode="numeric"
            :aria-label="`Vai alla pagina, da 1 a ${catalog.pages}`"
            class="h-11 w-20 border border-sand/25 bg-transparent text-center font-display text-lg font-semibold text-white"
            @blur="jump"
          />
          <span class="font-display text-lg uppercase tracking-wider text-sand/55">
            / {{ catalog.pages }}
          </span>
        </form>

        <button
          type="button"
          class="flex h-11 w-11 items-center justify-center border border-sand/25 text-white transition-colors enabled:hover:border-coral enabled:hover:bg-coral disabled:opacity-30"
          :disabled="page >= catalog.pages"
          aria-label="Pagina successiva"
          @click="go(page + 1)"
        >
          <AppIcon name="chevron-right" class="text-sm" />
        </button>

        <button
          type="button"
          class="flex h-11 w-11 items-center justify-center border text-white transition-colors"
          :class="zoomed ? 'border-coral bg-coral' : 'border-sand/25 hover:border-coral hover:bg-coral'"
          :aria-pressed="zoomed"
          :aria-label="zoomed ? 'Riduci la pagina' : 'Ingrandisci la pagina'"
          @click="toggleZoom"
        >
          <AppIcon :name="zoomed ? 'fa-solid fa-magnifying-glass-minus' : 'fa-solid fa-magnifying-glass-plus'" class="text-sm" />
        </button>
      </div>
    </nav>

    <!-- Precarica le pagine adiacenti, cosi' lo sfoglio non attende la rete -->
    <div class="hidden" aria-hidden="true">
      <img v-for="n in neighbours" :key="n" :src="buildPageUrl(pagesBase, catalog.id, n, fitWidth)" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import catalogList from '~/data/catalogs.json'
import { buildPageUrl, catalogLabel, usePagesBase } from '~/utils/catalogPages'

const route = useRoute()
const router = useRouter()
const pagesBase = usePagesBase()

const partnerName = String(route.params.partner)
const catalogId = String(route.params.id)

const partner = catalogList.find((p) => p.name === partnerName)
const found = partner?.catalogs.find((c) => c.id === catalogId)

// Senza pagine pre-renderizzate non c'e' nulla da sfogliare
if (!found || !('pages' in found) || !found.pages) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Catalogo non disponibile',
    fatal: true
  })
}

const catalog = found as { id: string; catalog: string; cover: string; pages: number }
const label = catalogLabel(catalog.id)

const page = ref(1)
const pageInput = ref('1')
const loading = ref(true)
const failed = ref(false)
const zoomed = ref(false)
const stage = ref<HTMLElement | null>(null)
const pageImg = ref<HTMLImageElement | null>(null)

// Se l'immagine e' gia' completa quando Vue si idrata, @load non scatta piu'
const syncLoaded = () => {
  if (pageImg.value?.complete) loading.value = false
}
watch(page, () => nextTick(syncLoaded))
onMounted(syncLoaded)

/** Ingrandisce e centra la panoramica, cosi' lo zoom parte dal mezzo. */
function toggleZoom() {
  zoomed.value = !zoomed.value
  nextTick(() => {
    const el = stage.value
    if (!el) return
    el.scrollLeft = zoomed.value ? (el.scrollWidth - el.clientWidth) / 2 : 0
  })
}

const clamp = (n: number) => Math.min(Math.max(n, 1), catalog.pages)

/**
 * Quale variante servire. Lasciarlo decidere a srcset non funziona: un
 * telefono DPR 3 con sizes=100vw chiede 1170px e finisce sempre sul file
 * grande, vanificando la variante mobile. Sul telefono la pagina intera sta
 * in pochi centimetri, i 1000px bastano; il dettaglio si guarda con lo zoom,
 * che usa sempre 1800.
 *
 * Il default e' "schermo piccolo" perche' l'HTML statico non sa su che
 * dispositivo finira': cosi' il telefono, che e' quello con la rete lenta,
 * non scarica mai il file grande, e il desktop si limita a riscaricare una
 * volta la prima pagina (31 KB) dopo l'idratazione.
 */
const smallScreen = ref(true)
const fitWidth = computed(() => (zoomed.value || !smallScreen.value ? 1800 : 1000))

onMounted(() => {
  const mq = window.matchMedia('(max-width: 767px)')
  smallScreen.value = mq.matches
  mq.addEventListener('change', (e) => (smallScreen.value = e.matches))
})

// Due pagine avanti e una indietro: copre lo sfoglio in avanti senza sprecare rete
const neighbours = computed(() =>
  [page.value - 1, page.value + 1, page.value + 2]
    .filter((n) => n >= 1 && n <= catalog.pages && n !== page.value)
)

function go(n: number) {
  const target = clamp(n)
  // Risincronizza sempre il campo: digitando "999" deve tornare all'ultima pagina
  pageInput.value = String(target)
  if (target === page.value) return
  page.value = target
  loading.value = true
  failed.value = false
  zoomed.value = false
  stage.value?.scrollTo({ top: 0, left: 0 })
  // La pagina finisce nella query, cosi' il link e' condivisibile
  router.replace({ query: target === 1 ? {} : { p: String(target) } })
}

function jump() {
  const n = Number(pageInput.value)
  go(Number.isFinite(n) && n > 0 ? n : page.value)
}

// Swipe su mobile
let touchX = 0
let touchY = 0
const onTouchStart = (e: TouchEvent) => {
  touchX = e.changedTouches[0].clientX
  touchY = e.changedTouches[0].clientY
}
const onTouchEnd = (e: TouchEvent) => {
  if (zoomed.value) return
  const dx = e.changedTouches[0].clientX - touchX
  const dy = e.changedTouches[0].clientY - touchY
  // Solo gesti chiaramente orizzontali, per non rubare lo scroll verticale
  if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return
  go(page.value + (dx < 0 ? 1 : -1))
}

const onKey = (e: KeyboardEvent) => {
  if (e.target instanceof HTMLInputElement) return
  if (e.key === 'ArrowRight' || e.key === 'PageDown') go(page.value + 1)
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(page.value - 1)
}

// La route e' prerenderizzata senza query: vue-router la ripopola solo dopo
// l'idratazione, quindi leggerla una volta sola in onMounted la perderebbe.
// go() e' idempotente, percio' il replace che fa non innesca un ciclo.
watch(
  () => route.query.p,
  (value) => {
    const n = Number(value)
    if (Number.isFinite(n) && n >= 1) go(n)
  },
  { immediate: true }
)

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

useBreadcrumbs([
  { name: 'I nostri cataloghi', path: '/cataloghi' },
  { name: label, path: `/cataloghi/${partnerName}/${catalogId}` }
])

useSeoMeta({
  title: `${label} — Catalogo`,
  description: `Sfoglia online il catalogo ${label}. ${catalog.pages} pagine.`,
  robots: 'noindex'
})
</script>
