<template>
<div class="modal fade" id="StoryModal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="ModalLabel">{{storyID}}'s Story</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <img v-if="image.length>0" :src="image" class="preview-image">
            <h6>Story: </h6>
            <p>{{story}}</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <router-link :to="{ name: 'Profile', params: {id: storyID}}" class="btn btn-primary" data-dismiss="modal">{{storyID}}'s profile</router-link>
        </div>
        </div>
    </div>
</div>
</template>

<script>
/* eslint-disable no-unused-vars */
import db from '@/firebase/init'
import $ from 'jquery'

export default {
    name: 'Story',
    props: ['storyID'],
    data () {
        return {
            profile: null,
            story: null,
            image: ""
        }
    },
    methods: {
      close() {
        this.$emit('close');
      },
      loadStory(){
        db.collection('users').doc(this.storyID).get()
        .then(user => {
            this.profile = user.data()
        }).then(() => {
            db.collection('pings').where('user_id', '==', this.profile.user_id)
            .get().then(snapshot => {
                snapshot.forEach(doc => {
                    this.story = doc.data().story
                    this.image = doc.data().image
                    window.$('#StoryModal').modal('show')
                })
            })
        })
      }
    },
    mounted(){
        this.loadStory()
    },
    beforeUpdate () {
        this.loadStory()
    }
}
</script>

<style lang="scss" scoped>

</style>