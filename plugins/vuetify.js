import colors from 'vuetify/lib/util/colors'
import { createVuetify } from 'vuetify'
import { mdi } from "vuetify/lib/iconsets/mdi";
import '@mdi/font/css/materialdesignicons.css'

export default defineNuxtPlugin(nuxtApp => {
  const myAllBlackTheme = {
    dark: false,
    colors: {
      primary: '#00AF7C',
      accent: '#114b34',
      primaryl2: colors.teal.lighten2,
      primaryl3: colors.teal.lighten3,
      primaryl4: colors.teal.lighten4,
      primaryl5: colors.teal.lighten5,
      green50: '#E6F8F3',
      darkBlue: '#77849E',
      darkBlue50: '#E5E8EF',
      darkBlue200: '#BCC3D1',
      darkBlue300: '#9FA9BD',
      error: '#ED5047',
      warning: '#FFD15A',
      info: '#047cfc',
      success: '#00AF7C'
    }
  }

  const vuetify = createVuetify({
    icons: {
      defaultSet: 'mdi',
      sets: {
        mdi,
      }
    },
    theme: {
      defaultTheme: 'myAllBlackTheme',
      themes: {
        myAllBlackTheme,
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})