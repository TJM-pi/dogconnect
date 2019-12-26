<template>
    <div class="info container">
        <div v-if="profile" class="card">
            <h2 class="blue-text center">{{ profile.alias }}</h2>
        </div>
        <div class="field center">
            <label for="description">Description:</label>
            <input type="text" name="description" v-model="description">
        </div>
        <div class="field">
            <UploadImage @send="storeImage"/>
        </div>
        <div class="field">
          <button class="btn blue" @click.prevent="confirm">Confirm</button>
          <button v-if="confirmed" class="btn blue" @click.prevent="change">Go to profile</button>
          <button class="btn blue" @click.prevent="close">Cancel</button>
        </div>
    </div>
</template>

<script>
import db from '@/firebase/init'
import UploadImage from '@/components/layout/UploadImage'

export default {
    name: 'Info',
    props: ['profile'],
    components: {
        UploadImage
    },
    data() {
        return {
            confirmed: false,
            description: null,
            image: ""
        }
    },
    methods: {
        confirm() {
            //this.$children[0].destroyElement()
            this.confirmed = true
            if (this.description) {
                db.collection('users').doc(this.$route.params.id).update({
                    description: this.description
                })
            }
            if (this.image) {
                db.collection('users').doc(this.$route.params.id).update({
                    image: this.image
                })
            }
        },
        close() {
            this.$router.go(-1)
        },
        change() {
            this.$router.push({name: 'Profile', params: {id: this.$route.params.id}})
        },
        storeImage(value) {
            this.image = value
        }
    }
}
</script>

<style>
.info {
    max-width: 400px;
    margin-top: 60px;
}

.info h2 {
    font-size: 4.2em;
}

.info .field {
    margin-bottom: 16px;
}
</style>