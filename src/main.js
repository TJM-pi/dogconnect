import Vue from 'vue'
import App from './App.vue'
import router from './router'
<<<<<<< HEAD
import firebase from 'firebase'

Vue.config.productionTip = false

let app = null

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount('#app')
  }
})
=======

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
>>>>>>> 4c6f8522f44c3281b0f1ac8336631af5a8e846c3
