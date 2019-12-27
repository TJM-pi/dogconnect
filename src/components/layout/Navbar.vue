<template>
  <div class="container-fluid" style="padding:0px;">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a href="#" class="navbar-brand w-50 mr-auto">Dogconnect</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent"
              aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse w-100" id="navbarContent">
        <ul class="navbar-nav w-100 justify-content-center">
          <li class="nav-item active"><router-link :to="{name: 'Map'}" class="nav-link">Mapa</router-link></li>
          <li class="nav-item"><router-link :to="{name: 'Social'}" class="nav-link">Social</router-link></li>
          <li class="nav-item"><router-link :to="{name: 'Stats'}" class="nav-link">Statistics</router-link></li>
        </ul>
        <ul v-if="profile" class="navbar-nav w-100 ml-auto justify-content-end">
          <li class="nav-item active"><router-link :to="{name: 'Profile', params: {id: id}}" class="nav-link">{{profile.alias}}</router-link></li>
          <li class="nav-item"><a href="" class="nav-link"  @click="logout">Logout</a></li>
        </ul>
        <ul v-if="!profile" class="navbar-nav w-100 ml-auto justify-content-end">
          <li class="nav-item active"><router-link :to="{name: 'Login'}" class="nav-link">Login</router-link></li>
          <li class="nav-item active"><router-link :to="{name: 'Signup'}" class="nav-link">Signup</router-link></li>
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
