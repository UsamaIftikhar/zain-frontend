import vuetify from "vite-plugin-vuetify"
import { defineNuxtConfig } from "nuxt/config"


export default defineNuxtConfig({
  css: ["vuetify/styles", "~/assets/style/main.scss"], // vuetify ships precompiled css, no need to import sass
  vite: {
    ssr: {
      noExternal: ["vuetify"], // add the vuetify vite plugin
    },
  },
  build: {
    // transpile: ["@vuepic/vue-datepicker"],
  },
  ssr: false,
  modules: [
    // @ts-ignore
    // this adds the vuetify vite plugin
    // also produces type errors in the current beta release
    async (options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) =>
        config.plugins.push(vuetify())
      );
    },
    // "@pinia/nuxt",
    // "@pinia-plugin-persistedstate/nuxt"
  ],
  plugins: [
    // "~/plugins/mitt.js",
    // "~/plugins/i18n.js",
    // "~/plugins/vuelidate.js",
    // '~/plugins/intro.js'
  ],
  components: {
    dirs: [
      "~/components"
    ],
  },
  // app: {
  //   head: {
  //     title: 'Evercare Client Portal',
  //     script: [{ children: `(function(h,o,t,j,a,r){ h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)}; h._hjSettings={hjid:${configs.HotJar_id},hjsv:6}; a=o.getElementsByTagName('head')[0]; r=o.createElement('script');r.async=1; r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv; a.appendChild(r); })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=')`}]
  //   }
  // }
});
