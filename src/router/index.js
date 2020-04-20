import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Join from '../views/Join.vue'
import store from '../store/store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Join',
    component: Join
  },
  {
    path: '/Chat',
    name: 'Chat',
    component: Home,
    beforeEnter: (to, from, next) => {
      console.log('before enter :' + JSON.stringify(store.getters.user))
      if (store.getters.user.username !== undefined) {
        next('/')
      }
      next()
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
