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
      <div class="modal-body">
        <img v-if="image.length>0" :src="image" class="preview-image">
        <h6>Story: </h6>
        <div class="input-group">
          <textarea v-model="story" name="story" id="story" cols="30" rows="2" class="form-control"></textarea>
        </div>
        <UploadImage @send="storeImage"/>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" data-dismiss="modal" @click.prevent="ping">Create</button>
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

.preview-image{
  width:100%;
  max-height:300px;
  border:1px solid white;
  margin-bottom: 10px;
}
</style>