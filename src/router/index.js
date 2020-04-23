import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Join from '../views/Join.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Join',
    component: Join,
    meta: { title: 'Accueil - Global Chat' }
  },
  {
    path: '/Chat',
    name: 'Chat',
    component: Home,
    meta: { title: 'Global Chat' },
    beforeEnter: (to, from, next) => {
      if (sessionStorage.getItem('user') === null) {
        next('/')
      } else {
        next()
      }
    }
  }
]
const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  document.title = to.meta.title

  next()
})

export default router
