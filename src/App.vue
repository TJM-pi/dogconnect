<template>
  <div id="app">
<<<<<<< HEAD
    <Navbar/>
=======
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
>>>>>>> 4c6f8522f44c3281b0f1ac8336631af5a8e846c3
    <router-view/>
  </div>
</template>

<<<<<<< HEAD
<script>
import Navbar from '@/components/layout/Navbar'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>
body {
  background: #f7f7f7;
=======
<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
>>>>>>> 4c6f8522f44c3281b0f1ac8336631af5a8e846c3
}
</style>
