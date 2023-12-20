import vuetify from "vite-plugin-vuetify"
import { defineNuxtConfig } from "nuxt/config"


export default defineNuxtConfig({
  css: ["vuetify/styles", "~/assets/style/main.scss"], // vuetify ships precompiled css, no need to import sass
  vite: {
    ssr: {
      noExternal: ["vuetify"], // add the vuetify vite plugin
    },
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
    }
  ],
  components: {
    dirs: [
      "~/components"
    ],
  },
  app: {
    head: {
      title: 'Add subnet',
    }
  }
});
