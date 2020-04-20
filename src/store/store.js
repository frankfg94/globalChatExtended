import Vue from 'vue'
import Vuex from 'vuex'
const axios = require('axios')

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    targetLang: 'en',
    messages: []
  },

  mutations: {
    changeLang (state, lang) {
      state.targetLang = lang
    },
    addMessage (state, msg) {
      state.messages.push(msg)
    },
    changeVisibility (state, idx) {
      state.messages[idx].showTranslation = !state.messages[idx].showTranslation
    },
    modifyMessage (state, msg) {
      console.log('modify ' + msg.translation)
      state.messages[state.messages.findIndex(x => x.date === msg.date)] = msg
    }
  },

  actions: {
    async translateMessage ({ commit, state }, idx) {
      const msg = state.messages[idx]
      msg.ui = state.targetLang
      const key = 'trnsl.1.1.20200419T135148Z.c4fac443bbed2781.b22675d40250840dd99e7ad5aec754f224de4dc1'
      const requestURL = 'https://translate.yandex.net/api/v1.5/tr.json/translate'
      const response = await axios.get(requestURL, {
        params: {
          key: key,
          text: msg.original,
          lang: msg.ui
        }
      })
      console.log('store ' + msg.translation)
      const responseOK = response && response.status === 200 && response.statusText === 'OK'
      if (responseOK) {
        console.log('Translated text: ' + response.data.text)
        msg.translation = response.data.text
        console.log('test ' + msg.translation)
        commit('modifyMessage', msg)
      } else {
        msg.translation = 'Erreur de traduction'
        commit('modifyMessage', msg)
      }
    }
  },

  getters: {
    targetLang: state => state.targetLang,
    messages: state => state.messages
  }
})
