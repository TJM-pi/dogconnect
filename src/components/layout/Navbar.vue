<template>
  <div class="navbar">
    <nav class="blue darken-1">
      <div class="container">
        <router-link :to="{ name: 'Map' }" class="brand-logo left">DogConnect!</router-link>
        <ul class="right">
          <li v-if="!user"><router-link :to="{ name: 'Signup' }">Signup</router-link></li>
          <li v-if="!user"><router-link :to="{ name: 'Login' }">Login</router-link></li>
          <li v-if="user && profile"><router-link  :to="{ name: 'Profile', params: {id: id }}">{{ profile.alias }}</router-link></li>
          <li v-if="user"><a @click="logout">Logout</a></li>
        </ul>  
      </div>     
    </nav>
  </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
  name: 'Navbar',
  data () {
    return {
      user: null,
      profile: null,
      id: null
    }
  },
  methods: {
    logout () {
      firebase.auth().signOut().then(() => {
        this.$router.push({ name: 'Login'})
      })
    }
  },
  created () {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
        db.collection('users').where('user_id', '==', this.user.uid)
      .get().then(snapshot => {
        snapshot.forEach(doc => {
          this.profile = doc.data()
          this.id = doc.id
        })
      })
      } else {
        this.user = null
      }
    })
  },
}
</script>

<style>

</style>
