import Vue from 'vue'
import VueRouter from 'vue-router'
import Map from '@/components/home/Map'
import Ping from '@/components/home/Ping'
import Story from '@/components/home/Story'
import Social from '@/components/social/Social'
import Stats from '@/components/stats/Stats'
import Signup from '@/components/auth/Signup'
import Login from '@/components/auth/Login'
import Profile from '@/components/profile/Profile'
import Settings from '@/components/profile/Settings'
import Modal from '@/components/profile/Modal'
import Info from '@/components/profile/Info'
import firebase from 'firebase'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Map',
    component: Map,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/ping',
        name: 'Ping',
        component: Ping,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'story/:id',
        name: 'Story',
        component: Story
      }
    ]
  },
  {
    path: '/social',
    name: 'Social',
    component: Social,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/stats',
    name: 'Stats',
    component: Stats,
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
    },
  },
  {
    path: '/profile/:id/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      requiresAuth: true
    },
    props: true,
    children: [
      {
        path: '/modal',
        name: 'Modal',
        component: Modal,
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/profile/:id/info',
    name: 'Info',
    component: Info,
    meta: {
      requiresAuth: true
    },
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//login check
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

export default router
