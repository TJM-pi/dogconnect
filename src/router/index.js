import Vue from 'vue'
import VueRouter from 'vue-router'
<<<<<<< HEAD
import Map from '@/components/home/Map'
import Signup from '@/components/auth/Signup'
import Login from '@/components/auth/Login'
import Profile from '@/components/profile/Profile'
import firebase from 'firebase'
=======
import Home from '../views/Home.vue'
>>>>>>> 4c6f8522f44c3281b0f1ac8336631af5a8e846c3

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
<<<<<<< HEAD
    name: 'Map',
    component: Map,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/profile/:id',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true
    }
=======
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
>>>>>>> 4c6f8522f44c3281b0f1ac8336631af5a8e846c3
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

<<<<<<< HEAD
router.beforeEach((to, from, next) => {
  if (to.matched.some(rec => rec.meta.requiresAuth)) {
    let user = firebase.auth().currentUser
    if (user) {
      next()
    } else {
      next({ name: 'Login' })
    }
  } else {
    next()
  }
})

=======
>>>>>>> 4c6f8522f44c3281b0f1ac8336631af5a8e846c3
export default router
