<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-icon>fab fa-yandex-international</v-icon>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        color="primary"
        font-color="primary"
        @click="langDialogue = !langDialogue"
      >languages
      </v-btn>

      <v-dialog
        v-model="langDialogue"
        max-width="500px"
      >
        <v-card>
          <v-card-title>
              Change target language
            </v-card-title>
            <v-card-text>
              <v-select
                v-model="targetLanguage"
                :items="supportedLanguages"
                label="Languages"
                item-value="text"
                @change="validateLangChange"
              ></v-select>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="primary"
                text
                @click="langDialogue = false"
              >
                Close
              </v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>

    <v-content>
      <v-container fluid>
      <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
const axios = require('axios')

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    langDialogue: false,
    supportedLanguages: [
      { text: 'English', ui: 'en' },
      { text: 'Spanish', ui: 'es' },
      { text: 'French', ui: 'fr' }
    ],
    targetLanguage: 'English'
  }),

  methods: {
    getSupportedLanguages: async function (text, targetLanguage) {
      const key = 'trnsl.1.1.20200419T135148Z.c4fac443bbed2781.b22675d40250840dd99e7ad5aec754f224de4dc1'
      const requestURL = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs'
      const response = await axios.get(requestURL, {
        params: {
          key: key,
          text: text,
          ui: 'en'
        }
      })
      const responseOK = response && response.status === 200 && response.statusText === 'OK'
      if (responseOK) {
        console.log('Translated text: ' + response.data.text)
        return { original: text, translation: response.data.text[0] }
      } else {
        return { original: text, translation: 'Erreur de traduction' }
      }
    },

    validateLangChange: function () {
      console.log(this.supportedLanguages.find(item => item.text === this.targetLanguage).ui)
      this.$store.commit('changeLang', this.supportedLanguages.find(item => item.text === this.targetLanguage).ui)
    }
  }
}
</script>
