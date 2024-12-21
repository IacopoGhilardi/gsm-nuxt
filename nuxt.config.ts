export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap'
  ],
  compatibilityDate: '2024-10-29',
  plugins: [
    '~/plugins/fontawesome.ts',
    '~/plugins/pdfRenderer.ts'
  ],
  css: [
    '@fortawesome/fontawesome-free/css/all.css'
  ],
  alias: {
    '@layouts': '/components/layout',
    '@components': '/components'
  },
  site: {
    url: 'https://www.gsm-adl.it',
    name: 'GSM Adl',
    description: 'Sito specializzato in abbigliamento da lavoro a Pisa.',
    defaultLocale: 'it'
  },
  sitemap: {
    _route: '/'
  },
  components: true,
  app: {
    head: {
      titleTemplate: '%s - Abbigliamento da Lavoro',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Sito specializzato in abbigliamento da lavoro a Pisa.' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})