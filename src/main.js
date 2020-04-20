import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueSocketIO from 'vue-socket.io'
import socketio from 'socket.io-client'
import { store } from './store/store'

const SocketInstance = socketio.connect('http://localhost:3001', {
  query: {
    token: window.localStorage.getItem('auth')
  }
})

Vue.use(new VueSocketIO({
  debug: true,
  connection: SocketInstance
}))

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
