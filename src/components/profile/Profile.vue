<template>
    <div class="view-profile container">
        <div v-if="profile" class="card">
            <h2 class="blue-text center">{{ profile.alias }}</h2>
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
</style>