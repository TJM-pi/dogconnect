<template>
    <div class="row">
        <div class="col-sm-4"></div>
        <div class="card col-sm-4 mt-4">
            <img v-if="!loading && profile.image" width="80%" height="200" style="margin: 0 auto;"
                :src="profile.image" alt="">
            <div class="card-body text-center">
                <h1 v-if="profile" class="card-title">{{profile.alias}}</h1>
                <p v-if="!loading && profile.description" class="card-text">{{profile.description}}</p>

                <div v-if="currentUser" class="btn-group-vertical">
                    <button class="btn btn-primary btn-lg" @click="editInfo">Edit personal info</button>
                    <button class="btn btn-primary btn-lg mt-2" @click="settings">Edit settings</button>
                </div>
            </div>
        </div>
        <div class="col-sm-4"></div>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
    name: 'Profile',
    data () {
        return {
            profile: null,
            user: firebase.auth().currentUser,
            id: null,
            currentUser: null,
            loading: true,
        }
    },
    methods: {
        settings() {
            this.$router.push({name: 'Settings', params: {id: this.$route.params.id, profile: this.profile}})
        },
        editInfo() {
            this.$router.push({name: 'Info', params: {id: this.$route.params.id, profile: this.profile}})
        }
    },
    created () {
        db.collection('users').doc(this.$route.params.id).get()
        .then(user => {
            this.profile = user.data()
            this.id = this.profile.alias
            this.currentUser = this.profile.user_id == this.user.uid ? true : false
            this.loading = false
        })
    },
}
</script>

<style lang="scss" scoped>

</style>