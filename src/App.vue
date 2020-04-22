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
        v-if="logged"
        color="blue darken-1"
        font-color="primary"
        @click="langDialogue = !langDialogue"
      >languages
      </v-btn>
       <v-btn text
        v-if="logged"
        class="mx-3"
        color=white
        font-color="primary"
        @click="disconnect"
      >
      <v-icon>mdi-power</v-icon>
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
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </v-container>
    </v-content>
  </v-app>
</template>
<style scoped>

</style>

<script>
const axios = require('axios')

export default {
  name: 'App',

  components: {
  },

  data: () => ({
    langDialogue: false,
    supportedLanguages: [],
    targetLanguage: 'English',
    logged: false
  }),
  watch: {
    $route (to, from) {
      this.userConnected()
    }
  },
  methods: {
    userConnected: function () {
      console.log('log user : ' + sessionStorage.getItem('user'))
      if (sessionStorage.getItem('user')) {
        this.logged = true
      } else {
        this.logged = false
      }
    },
    validateLangChange: function () {
      console.log(this.supportedLanguages.find(item => item.text === this.targetLanguage).ui)
      this.$store.commit('changeLang', this.supportedLanguages.find(item => item.text === this.targetLanguage).ui)
    },
    customSort: function (a, b) {
      return a.text.localeCompare(b.text)
    },
    disconnect: function () {
      this.$router.push({ name: 'Join' })
      this.$socket.emit('userGone', this.$store.getters.user)
      sessionStorage.removeItem('user')
      this.logged = false
    }
  },

  mounted: function () {
    this.$nextTick(async function () {
      const key = 'trnsl.1.1.20200419T135148Z.c4fac443bbed2781.b22675d40250840dd99e7ad5aec754f224de4dc1'
      const requestURL = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs'
      await axios.post(requestURL, null, {
        params: {
          key: key,
          ui: 'en'
        }
      }).then(response => {
        const data = response.data.langs
        const langs = []
        Object.entries(data).map(function (key) {
          langs.push({
            ui: key[0],
            text: key[1]
          })
        })
        this.supportedLanguages = langs.sort(this.customSort)
      }).catch(error => {
        console.log(error)
      })
    })
    this.userConnected()
  }
}
</script>
