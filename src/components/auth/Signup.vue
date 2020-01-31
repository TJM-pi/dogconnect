<template>
<div class="row mt-4" style="margin: 0 auto;">
    <div class="col-lg-4 col-sm-2 col-1"></div>
    <form class="card col-lg-4 col-sm-8 col-10">
        <div class="card-body">
            <h1 class="card-title text-center">Signup</h1>
            <div class="form-group">
                <label for="InputAlias">Alias:</label>
                <input type="text" class="form-control" id="InputAlias" placeholder="Enter alias" v-model="alias">
            </div>
            <div class="form-group">
                <label for="InputEmail">Email address:</label>
                <input type="email" class="form-control" id="InputEmail" aria-describedby="emailHelp" placeholder="Enter email" v-model="email">
            </div>
            <div class="form-group">
                <label for="InputPass">Password:</label>
                <input type="password" class="form-control" id="InputPass" placeholder="Password" v-model="password">
            </div>
            <div style="text-align:center;">
                <button type="submit" id="asd" class="btn btn-primary btn-lg" @click.prevent="signup">Signup</button>
                <p v-if="feedback" style="color:red; margin:0px;" class="mt-3">{{feedback}}</p>
            </div>
        </div>
    </form>
    <div class="col-lg-4 col-sm-2 col-1"></div>
</div>
</template>

<script>
import slugify from 'slugify'
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
    name: 'Signup',
    data () {
        return {
            email: null,
            password: null,
            alias: null,
            feedback: null,
            slug: null,
            pings: null
        }
    },
    methods: {
        signup() {
            if (this.alias && this.email && this.password) {
                this.slug = slugify(this.alias, {
                    replacement: '-',
                    remove: /[$*_+~.()'"!\-:@]/g,
                    lower: true
                })
                let ref = db.collection('users').doc(this.slug)
                ref.get().then(doc => {
                    if (doc.exists) {
                        this.feedback = 'This alias already exists'
                    } else {
                        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                        .then(cred => {
                            ref.set({
                                alias: this.alias,
                                geolocation: null,
                                user_id: cred.user.uid,
                                pings: this.pings
                            })
                        }).then(() => {
                            this.$router.push({
                                name: 'Map'
                            })
                        })
                        .catch(err => {
                            this.feedback = err.message
                        })
                        //this.feedback = 'This alias is free for use'
                    }
                })
            } else {
                this.feedback = 'You must enter all fields'
            }
        }
    }
}
</script>

<style>
</style>