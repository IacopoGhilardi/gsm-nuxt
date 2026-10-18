import tailwindcss from '@tailwindcss/vite'
import catalogs from './app/data/catalogs.json'

// Il sito e' statico: le route dello sfogliatore sono dinamiche e vanno
// elencate esplicitamente, altrimenti non finiscono nel build.
const catalogRoutes = catalogs.flatMap((partner) =>
  partner.catalogs
    .filter((catalog) => 'pages' in catalog && catalog.pages)
    .map((catalog) => `/cataloghi/${partner.name}/${catalog.id}`)
)

export default defineNuxtConfig({
  compatibilityDate: '2025-10-18',

  modules: ['@nuxtjs/sitemap'],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()]
  },

  runtimeConfig: {
    public: {
      // Sovrascrivibile al build con NUXT_PUBLIC_CATALOG_PAGES_BASE
      catalogPagesBase:
        'https://pub-b0f8272c710649f68ef7029d37933dc5.r2.dev/sfoglia'
    }
  },

  nitro: {
    prerender: {
      routes: catalogRoutes
    }
  },

  plugins: ['~/plugins/gsap.ts'],

  // pathPrefix: false -> <AppIcon> invece di <AtomsAppIcon>
  components: [{ path: '~/components', pathPrefix: false }],

  site: {
    url: 'https://www.gsm-adl.it',
    name: 'GSM Abbigliamento da Lavoro',
    description: 'Abbigliamento da lavoro, stampe, ricami e gadget promozionali a Pisa.',
    defaultLocale: 'it'
  },

  app: {
    head: {
      htmlAttrs: { lang: 'it' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#2e4052' },
        {
          name: 'description',
          content: 'Abbigliamento da lavoro, stampe, ricami e gadget promozionali a Pisa.'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap'
        }
      ]
    }
  }
})
