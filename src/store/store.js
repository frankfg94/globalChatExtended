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
      icon: '',
      group: 'General'
    },
    userList: [],
    alwaysTranslate: true,
    currentGroup: '',
    groupList: [],
    unreadGroups: []
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
    },
    removeMessage (state, messageToDelete) {
      // Remove all the messages with the same text
      console.log('Deleting : ' + JSON.stringify(messageToDelete))
      console.log('Deleting with text ' + messageToDelete.original)
      state.messages = state.messages.filter(x => x.original !== messageToDelete.original)
      sessionStorage.setItem('messages', JSON.stringify(state.messages))
    },
    replaceAllMsg (state, data) {
      const idx = state.messages.findIndex(x => x.original === data.oldText)
      if (data.newText) {
        state.messages[idx].original = data.newText
        console.log('replaced msg: ' + JSON.stringify(state.messages[idx]))
        sessionStorage.setItem('messages', JSON.stringify(state.messages))
      }
    },
    changeGroup (state, targetGroupObject) {
      state.currentGroup = targetGroupObject
      // We tell the user that it must change the group on the screen
      sessionStorage.setItem('currentGroup', JSON.stringify(state.currentGroup))
    },
    setGroups (state, groupList) {
      state.groupList = groupList
      // At the moment we don't store locally the groups
      // sessionStorage.setItem('groupList', JSON.stringify(state.currentGroup))
    },
    addGroup (state, newGroup) {
      state.groupList.push(newGroup)
    },
    clearMsg (state) {
      state.messages = []
      sessionStorage.setItem('messages', JSON.stringify(state.messages))
    },
    clearNotifications (state, groupTitle) {
      state.unreadGroups = state.unreadGroups.filter(item => item !== groupTitle)
    },
    addNotification (state, notification) {
      state.unreadGroups.push(notification)
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
    alwaysTranslate: state => state.alwaysTranslate,
    currentGroup: state => state.currentGroup,
    unreadGroups: state => state.unreadGroups,
    groupList: state => state.groupList
  }
})

export default store
