<template>
    <div class="row" style="margin: 0 auto;">
        <div class="col-lg-4 col-sm-2 col-1"></div>
        <div class="card col-lg-4 col-sm-8 col-10 mt-4 shadow">
            <img v-if="!loading && profile.image" class="readjust img-thumbnail shadow" :src="profile.image" alt="">
            <img v-else-if="!loading" class="readjust img-thumbnail shadow"
                 src="https://cdn.steemitimages.com/DQmbQGsqqhgTgZK2Wh4o3o9pALrNqPVryT3AH17J4WExoqS/no-image-available-grid.jpg" alt="">
    
            <div class="card-body text-center">
                <h1 v-if="profile" class="card-title">{{profile.alias}}</h1>
                <p v-if="!loading && profile.description" class="card-text">{{profile.description}}</p>
                <p v-else-if="!loading">No description.</p>
                <div v-if="currentUser" class="btn-group-vertical">
                    <button class="btn btn-primary btn-lg" @click="editInfo">Edit personal info</button>
                    <button class="btn btn-primary btn-lg mt-2" @click="settings">Edit settings</button>
                </div>
            </div>
        </div>
        <div class="col-lg-4 col-sm-2 col-1"></div>
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
.card{
    padding: 0px;
}
.readjust{
    object-fit: cover;
    object-position: center;
    height:270px;
    width:80%;
    margin: 0 auto;
    margin-top: 20px;
}
</style>