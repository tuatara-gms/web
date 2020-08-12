const pkg = require('./package')
const conf = require('./config')
module.exports = {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: 'Techno-Service',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ],
    link: [
      { rel: 'stylesheet', href: '/knocks/style.css' },
      { rel: 'stylesheet', href: '/knocksapp/style.css' },
      { rel: 'stylesheet', href: '/tcsc/style.css' }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#2d8cf0' },

  /*
   ** Global CSS
   */
  css: ['view-design/dist/styles/iview.css'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/iview',
    // '@/plugins/iview-theme',
    '@/plugins/c.js',
    // '@/plugins/axios.js',
    '@/plugins/utils'
    // '@/plugins/tawkto'
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // '@nuxtjs/pwa',
    // With options
    ['cookie-universal-nuxt', { alias: 'cookies' }]
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: conf.baseURL
  },
  server: {
    port: conf.port, // default: 3000
    host: conf.host // default: localhost
  },
  router: {
    middleware: []
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (ctx.isDev) {
        // eslint-disable-next-line
                config.devtool = 'eval-source-map';
      }
    }
  }
}
