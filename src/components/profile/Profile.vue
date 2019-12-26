<template>
    <div class="view-profile container">
        <div v-if="profile" class="card">
            <h2 class="blue-text center">{{ profile.alias }}</h2>
        </div>
        <div v-if="!loading && profile.description" class="field center">
            <p>{{ profile.description }}</p>
        </div>
        <div class="image-preview" v-if="!loading && profile.image">
             <img class="preview" :src="profile.image" />
        </div>
        <div v-if="currentUser" class="field center">
            <button class="btn blue" @click="editInfo">Edit personal info</button>
        </div>
        <div v-if="currentUser" class="field center">
            <button class="btn blue" @click="settings">Settings</button>
        </div>
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

<style>
.view-profile {
    max-width: 400px;
    margin-top: 60px;
}

.view-profile h2 {
    font-size: 4.2em;
}

.view-profile .field {
    margin-bottom: 16px;
}

.view-profile .btn {
    width: 200px;
}
</style>