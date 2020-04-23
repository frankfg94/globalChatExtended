import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import '@fortawesome/fontawesome-free/css/all.css'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#CBDDB7',
        accent: '#B4C5A2',
        emojiBg: '#E1F4CB',
        selectEmoji: colors.green.lighten1,
        textOnPrimary: '#e6ffe6',
        selectEmojiText: '#000000'
      },
      dark: {
        primary: '#CBDDB7',
        accent: '#B4C5A2',
        emojiBg: '#E1F4CB',
        selectEmoji: '#FFFFFF',
        textOnPrimary: '#e6ffe6',
        selectEmojiText: '#FFFFFF'
      }
    }
  }
})
