import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-10-18',

  modules: ['@nuxtjs/sitemap'],

  css: [
    '@fortawesome/fontawesome-free/css/all.css',
    '~/assets/css/main.css'
  ],

  vite: {
    plugins: [tailwindcss()]
  },

  plugins: ['~/plugins/gsap.ts'],

  components: true,

  site: {
    url: 'https://www.gsm-adl.it',
    name: 'GSM Abbigliamento da Lavoro',
    description: 'Abbigliamento da lavoro, stampe, ricami e gadget promozionali a Pisa.',
    defaultLocale: 'it'
  },

  app: {
    head: {
      htmlAttrs: { lang: 'it' },
      titleTemplate: '%s - Abbigliamento da Lavoro',
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
