<template>
   <div class="row">
        <div class="col-sm-4"></div>
        <div class="card col-sm-4 mt-4">
            <div class="card-body text-center">
                <h1>Edit personal info</h1>
                <!--<h3 v-if="profile" class="card-title">{{profile.alias}}</h3>-->
                <img v-if="image.length>0" :src="image" width="80%" height="200" style="margin: 0 auto;" class="mt-4">
                <h6 class="mt-4">Description: </h6>
                <div class="input-group">
                    <textarea v-model="description" name="desc" id="desc" cols="30" rows="2" class="form-control"></textarea>
                </div>
                <UploadImage @send="storeImage"/>
                <div class="btn-group">
                    <button class="btn btn-danger btn-md mr-2" @click.prevent="close">Cancel</button>
                    <button class="btn btn-primary btn-md mr-2" @click.prevent="confirm">Confirm</button>
                    <button  v-if="confirmed" class="btn btn-primary btn-md" @click.prevent="change">Go to profile</button>
                </div>
            </div>
        </div>
        <div class="col-sm-4"></div>
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
            profile_: null,
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
    },
    mounted(){
        this.profile_ = this.profile
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