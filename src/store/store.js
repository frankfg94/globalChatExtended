import Vue from 'vue'
import Vuex from 'vuex'
const axios = require('axios')

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    targetLang: 'en',
    messages: [],
    user: {
      username: '',
      icon: ''
    },
    userList: [],
    alwaysTranslate: true
  },

  mutations: {
    changeLang (state, lang) {
      state.targetLang = lang
      sessionStorage.setItem('targetLang', JSON.stringify(state.targetLang))
    },
    addMessage (state, msg) {
      console.log(msg)
      state.messages.push(msg)
      sessionStorage.setItem('messages', JSON.stringify(state.messages))
    },
    changeVisibility (state, msg) {
      const idx = state.messages.findIndex(x => x === msg)
      state.messages[idx].showTranslation = !state.messages[idx].showTranslation
    },
    modifyMessage (state, msg) {
      const idx = state.messages.findIndex(x => x === msg)
      state.messages.splice(idx, 1, msg)
      sessionStorage.setItem('messages', JSON.stringify(state.messages))
    },
    setUser (state, user) {
      state.user.username = user.username
      state.user.icon = user.icon
      sessionStorage.setItem('user', JSON.stringify(state.user))
    },
    setMessages (state, msgs) {
      state.messages = msgs
      sessionStorage.setItem('messages', JSON.stringify(state.messages))
    },
    usersChanged (state, users) {
      state.userList = users
    },
    changeAutoTranslate (state, bool) {
      state.alwaysTranslate = bool
      sessionStorage.setItem('alwaysTranslate', JSON.stringify(state.alwaysTranslate))
    }
  },

  actions: {
    async translateMessage ({ commit, state }, msg) {
      msg.ui = state.targetLang
      const key = 'trnsl.1.1.20200419T135148Z.c4fac443bbed2781.b22675d40250840dd99e7ad5aec754f224de4dc1'
      const requestURL = 'https://translate.yandex.net/api/v1.5/tr.json/translate'
      const response = await axios.get(requestURL, {
        params: {
          key: key,
          text: msg.original,
          lang: state.targetLang
        }
      })
      const responseOK = response && response.status === 200 && response.statusText === 'OK'
      if (responseOK) {
        msg.translation = response.data.text
      } else {
        msg.translation = 'Erreur de traduction'
      }
      return msg
    },
    async addMessage ({ commit, state }, msg) {
      if (msg.showTranslation) {
        msg = await this.dispatch('translateMessage', msg)
      }
      commit('addMessage', msg)
    }
  },

  getters: {
    targetLang: state => state.targetLang,
    messages: state => state.messages,
    user: state => state.user,
    userList: state => state.userList,
    alwaysTranslate: state => state.alwaysTranslate
  }
})

export default store
