export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
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
  components: true
})