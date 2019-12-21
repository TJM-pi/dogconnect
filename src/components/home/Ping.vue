<template>
  <transition name="modal-fade">
      <div class="ping container">
        <form class="card-panel">
            <h2 class="center blue-text">Ping</h2>
            <div class="field">
                <label for="text">Story:</label>
                <input type="text" name="story" v-model="story">
            </div>
            <div class="field">
                <UploadImage @send="storeImage"/>
            </div>
            <p class="red-text center" v-if="feedback">{{ feedback }}</p>
            <div class="field">
                <button class="btn blue" @click.prevent="ping">Create</button>
                <button class="btn blue" @click.prevent="close">Cancel</button>
            </div>
        </form>
    </div>
  </transition>
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
      sendImage (event) {
          this.$emit('sent', this.image) //$emit activates parent event handler 'sent', sends this.image as parameter
      },
      storeImage (value) {
          this.image = value;
      },
      close() {
        this.$emit('close'); 
      },
      ping(event) {
          if (this.story) {
            this.feedback = null
            this.$emit('ping', this.story)
          } else {
              this.feedback = 'Please enter a story'
          }
      }
    },
    destroyed() {
        this.sendImage()
    }
}
</script>

<style lang="scss">
.modal-fade-enter,
.modal-fade-leave-active {
    opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity .5s ease
}

.ping {
    max-width: 400px;
    margin-top: 60px;
}

.ping h2 {
    font-size: 4.2em;
}

.ping .field {
    margin-bottom: 16px;
}

.ping .btn {
    margin-right: 10px;
}
</style>