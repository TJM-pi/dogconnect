<template>
   <div class="row" style="margin: 0 auto;">
        <div class="col-lg-4 col-sm-2 col-1"></div>
        <div class="card col-lg-4 col-sm-8 col-10 mt-4">
            <div class="card-body text-center">
                <h1>Edit personal info</h1>
                <!--<h3 v-if="profile" class="card-title">{{profile.alias}}</h3>-->
                <img v-if="image.length>0" :src="image" class="readjust img-thumbnail mt-4">
                <h6 class="mt-4">Description: </h6>
                <div class="input-group">
                    <textarea v-model="description" name="desc" id="desc" cols="30" rows="2" class="form-control"></textarea>
                </div>
                <UploadImage @send="storeImage"/>
                <div class="btn-group">
                    <button class="btn btn-danger btn-md mr-2" @click.prevent="close">Cancel</button>
                    <button class="btn btn-primary btn-md mr-2" @click.prevent="confirm">Confirm</button>
                <!--<button  v-if="confirmed" class="btn btn-primary btn-md" @click.prevent="change">Go to profile</button>-->
                </div>
            </div>
        </div>
        <div class="col-lg-4 col-sm-2 col-1"></div>
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
            this.change()
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

<style lang="scss" scoped>
.readjust{
    object-fit: cover;
    object-position: center;
    height:270px;
    width:80%;
    margin: 0 auto;
    margin-top: 20px;
}
</style>