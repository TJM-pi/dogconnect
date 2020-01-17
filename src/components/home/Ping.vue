<template>
<div class="modal fade" id="PingModal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="ModalLabel">Create Ping</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div v-if="geolocation" class="modal-body">
        <img v-if="image.length>0" :src="image" class="readjust img-thumbnail mb-4">
        <h6>Story: </h6>
        <div class="input-group">
          <textarea v-model="story" name="story" id="story" cols="30" rows="2" class="form-control"></textarea>
        </div>
        <UploadImage @send="storeImage"/>
      </div>
      <div v-else-if="!geolocation" class="modal-body">
        <h2 class="text-center">You must have geolocation enabled to create a ping.</h2>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button v-if="geolocation" type="button" class="btn btn-primary" data-dismiss="modal" @click.prevent="ping">Create</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
/* eslint-disable no-unused-vars */
import UploadImage from '@/components/layout/UploadImage'
export default {
    name: 'Ping',
    props: ['geolocation'],
    components: {
        UploadImage
    },
    data () {
        return {
            story: null,
            feedback: null,
            image: ""
        }
    },
    methods: {
      storeImage (value) {
          this.image = value;
      },
      close() {
        this.$emit('close'); 
      },
      ping() {
          console.log("here", this.story)
          if (this.story) {
            this.feedback = null
            this.$emit('ping', this.story, this.image)
          } else {
              this.feedback = 'Please enter a story'
          }
      }
    },
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
</style>