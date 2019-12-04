<template>
    <div class="login container">
        <form class="card-panel" @click.prevent="login">
            <h2 class="center blue-text">Login</h2>
            <div class="field">
                <label for="email">Email:</label>
                <input type="email" name="email" v-model="email">
            </div>
            <div class="field">
                <label for="password">Password:</label>
                <input type="password" name="password" v-model="password">
            </div>
            <p class="red-text center" v-if="feedback">{{ feedback }}</p>
            <div class="field">
                <button class="btn blue">Login</button>
            </div>
        </form>
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
.login {
    max-width: 400px;
    margin-top: 60px;
}

.login h2 {
    font-size: 4.2em;
}

.login .field {
    margin-bottom: 16px;
}
</style>