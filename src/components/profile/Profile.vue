<template>
    <div class="view-profile container">
        <div v-if="profile" class="card">
            <h2 class="blue-text center">{{ profile.alias }}</h2>
        </div>
        <div class="field center">
            <button class="btn blue">Edit personal info</button>
        </div>
        <div class="field center">
            <button class="btn blue">Settings</button>
        </div>
    </div>
</template>

<script>
import db from '@/firebase/init'

export default {
    name: 'Profile',
    data () {
        return {
            profile: null
        }
    },
    created () {
        db.collection('users').doc(this.$route.params.id).get()
        .then(user => {
            this.profile = user.data()
        })
    }
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