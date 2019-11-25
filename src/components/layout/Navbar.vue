<template>
  <div class="navbar">
    <nav class="blue darken-1">
      <div class="container nav-wrapper">
        <router-link :to="{ name: 'Map' }" class="brand-logo left" style="font-size:2vw;">
          Dogconnect!
        </router-link>
         
         <ul class="nav-wrapper center-nav hide-on-small-only ultext">
          <li><router-link :to="{ name: 'Map' }"> Mapa</router-link></li>
          <li><router-link :to="{ name: 'Social' }">Social</router-link></li>
          <li><router-link :to="{ name: 'Stats' }">Stats</router-link></li>
        </ul>

        <ul class="nav-wrapper center-nav hide-on-med-and-up">
          <li><router-link :to="{ name: 'Social' }"><i class="material-icons">people</i></router-link></li>
          <li><router-link :to="{ name: 'Map' }"><i class="material-icons">public</i></router-link></li>
          <li><router-link :to="{ name: 'Stats' }"><i class="material-icons">show_chart</i></router-link></li>
        </ul>

        <ul class="right hide-on-small-only ultext">
          <li v-if="!user"><router-link :to="{ name: 'Signup' }">Signup</router-link></li>
          <li v-if="!user"><router-link :to="{ name: 'Login' }">Login</router-link></li>
          <li v-if="user"><a href="">{{ user.email }}</a></li>
          <li v-if="user"><a @click="logout">Logout</a></li>
        </ul>

        <ul class="right hide-on-med-and-up">
          <li v-on:click="isHidden = !isHidden"><a href="#"><i class="material-icons">menu</i></a></li>
        </ul>
      </div>
    </nav>

    <nav v-if="!isHidden" class="navbar blue darken-2 hide-on-med-and-up">
      <div class="container nav-wrapper">
        <ul v-if="!isHidden" class="right">
          <li v-if="!user"><router-link :to="{ name: 'Signup' }">Signup</router-link></li>
          <li v-if="!user"><router-link :to="{ name: 'Login' }">Login</router-link></li>
          <li v-if="user"><a href="">{{ user.email }}</a></li>
          <li v-if="user"><a @click="logout">Logout</a></li>
        </ul>
      </div>
    </nav>
  </div>

</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Navbar',
  data () {
    return {
      user: null,
      isHidden: true
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
      } else {
        this.user = null;
      }
    })
    }
}
</script>


<style lang="scss">  
  nav .brand-logo i.material-icons{
    margin-right:0px;
  }

  .center-nav{
    position: absolute;
    color: #fff;
    display: inline-block;
    font-size: 2.1rem;
    padding: 0;

    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
  }

  .ultext li a{
    font-size:17px;
  }
</style>
