<template>
<div class="row mt-4" style="margin: 0 auto;">
    <div class="col-lg-4 col-sm-2 col-1"></div>
    <form class="card col-lg-4 col-sm-8 col-10">
        <div class="card-body">
            <h1 class="card-title text-center">Login</h1>
            <div class="form-group">
                <label for="InputEmail">Email address:</label>
                <input type="email" class="form-control" id="InputEmail" aria-describedby="emailHelp" placeholder="Enter email" v-model="email">
            </div>
            <div class="form-group">
                <label for="InputPass">Password:</label>
                <input type="password" class="form-control" id="InputPass" placeholder="Password" v-model="password">
            </div>
            <div style="text-align:center;">
                <button type="submit" id="logbtn" class="btn btn-primary btn-lg" @click.prevent="login">Login</button>
                <p v-if="feedback" style="color:red; margin:0px;" class="mt-3">{{feedback}}</p>
            </div>
        </div>
    </form>
    <div class="col-lg-4 col-sm-2 col-1"></div>
</div>
</template>

<script>
/* eslint-disable no-unused-vars */
import firebase from 'firebase'
export default {
    name: 'Login',
    data () {
        return {
            email: null,
            password: null,
            feedback: null
        }
    },
    methods: {
        login () {
            if (this.email && this.password) {
                this.feedback = null
                firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                .then(cred => {
                    this.$router.push({ 
                        name: 'Map'
                    })
                }).catch(err => {
                    this.feedback = err.message
                })
            } else {
                this.feedback = 'Please fill out both fields'
            }
        }
    }
}
</script>

<style>
#logbtn{
    text-align:center;
    margin: 0 auto;
    justify-content: center;
}
</style>