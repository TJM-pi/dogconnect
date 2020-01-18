<template>
<div class="modal fade" id="StoryModal" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="ModalLabel">{{storyID}}'s Story</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <img v-if="image.length>0" :src="image" class="readjust img-thumbnail">
            <h5 class="mt-3 text-center">Story:</h5>
            <p class="limit-length">{{story}}</p>
            <p class="dateCreated" >{{date}}</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="close">Cancel</button>
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
            image: "",
            date: null
        }
    },
    methods: {
      close() {
        this.$emit('close');
      },
      prettyDate(uglyDate){
          let months = {
              0:"January",1: "February",2:"March",3:"April",
              4:"May",5:"june",6:"July",7:"August",8:"September",
              9:"October",10:"November",11:"December"
          }
          return uglyDate.getDate() + " " + 
                 months[uglyDate.getMonth()] + " " + 
                 uglyDate.getFullYear()
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
                    this.date = this.prettyDate(doc.data().dateCreated.toDate())
                    //console.log(this.date)
                    window.$('#StoryModal').modal('show')
                })
            })
        })
      }
    },
    mounted(){
        window.addEventListener('keydown', (e) => { //da mozes zatvoriti modal sa Esc key-em bez bug-ova 
            if (e.key == 'Escape') {this.close()}
        });
        this.loadStory()
    },
    beforeUpdate () {
        this.loadStory()
    }
}
</script>

<style lang="scss">
.readjust{
    object-fit: cover;
    object-position: center;
    max-height:300px;
    width:80%;
    margin: 0 auto;
    display: block;
}
.limit-length{
    width:80%;
    margin: 0 auto;
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    text-align:justify;
    text-align-last:center;
}
.dateCreated{
    color:gray;
    margin: 10px 0px 0px 0px;
    text-align:center;
    font-size:15px;
}
</style>