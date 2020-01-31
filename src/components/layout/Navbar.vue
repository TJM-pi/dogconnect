<template>
   <div class="container-fluid" style="padding:0px;" id="navheader">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <router-link :to="{name: 'Map'}" class="navbar-brand w-50 mr-auto">
        <img src="/images/logo.png" height="40" width="200" alt="Dogconnect" class="mr-2">
      </router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent"
              aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
        
              <i class="fas fa-bars" style="color:#fff; font-size:26px;"></i>
      </button>

      <div class="collapse navbar-collapse w-100" id="navbarContent">
        <ul v-if="profile" class="navbar-nav w-100 justify-content-center" id="centerNav">
          <li class="nav-item" :class="{active:active === 'Map'}">
            <router-link :to="{name: 'Map'}" class="nav-link" data-toggle="collapse" data-target=".navbar-collapse.show">
              <i class="fas fa-globe-europe"></i> Map
            </router-link>
          </li>
          <li class="nav-item" :class="{active:active === 'Social'}">
            <router-link :to="{name: 'Social'}" class="nav-link" data-toggle="collapse" data-target=".navbar-collapse.show">
              <i class="fas fa-user-friends"></i> Social
            </router-link>
          </li>
          <li class="nav-item" :class="{active:active === 'Stats'}">
            <router-link :to="{name: 'Stats'}" class="nav-link" data-toggle="collapse" data-target=".navbar-collapse.show">
              <i class="fas fa-chart-area"></i> Statistics
            </router-link>
          </li>
        </ul>
        <ul v-if="profile" class="navbar-nav w-100 ml-auto justify-content-end">
          <li class="nav-item" :class="{active:active === 'Profile'}">
            <router-link :to="{name: 'Profile', params: {id: id}}" class="nav-link" data-toggle="collapse" data-target=".navbar-collapse.show">
              {{profile.alias}}
            </router-link>
          </li>
          <li class="nav-item" :class="{active:active === 'Logout'}">
            <a href="" class="nav-link"  @click="logout">
              Logout
            </a>
          </li>
        </ul>
        <ul v-if="!profile" class="navbar-nav w-100 ml-auto justify-content-end">
          <li class="nav-item" :class="{active:active === 'Login'}">
            <router-link :to="{name: 'Login'}" class="nav-link" data-toggle="collapse" data-target=".navbar-collapse.show">
              Login
            </router-link>
          </li>
          <li class="nav-item" :class="{active:active === 'Signup'}">
            <router-link :to="{name: 'Signup'}" class="nav-link" data-toggle="collapse" data-target=".navbar-collapse.show">
              Signup
            </router-link>
          </li>
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
      id: null,
      isHidden: true,
      active: 'Map',
    }
  },
  methods: {
    logout () {
      firebase.auth().signOut().then(() => {
        this.$router.push({ name: 'Login'})
      })
    },
  },
  watch:{
    $route(to){
      this.active = to.name
    }
  },
  mounted () {
    this.active = this.$router.currentRoute.name
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

<style lang="scss">
  body{
    background-color:#e8f1f5 !important;
  }
  .navbar{
    background-color:#0080ff !important;
    width:100%;
    margin: 0 auto;
    margin-bottom:10px;
    padding-bottom:0px;
    padding-top:0px;
  }
  .navbar .nav-link{
    color:white !important;
    font-size: 17px;
    border-bottom: 1px solid transparent;
    border-radius: .25rem;
  }
  #centerNav .nav-item{
    margin-right:15px !important;
  }
  .nav-item{
    padding-top:8px;
    padding-bottom:8px;
  }
  .nav-link:hover{
    border-color: white !important;
  }
  .navbar .navbar-brand {
    color:white;
  }
  .navbar .fas{
    font-size: 20px;
  }
  .active .nav-link{
    border-color: white;
  }
</style>
