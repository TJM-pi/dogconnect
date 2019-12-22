<template>
  <transition name="modal-fade">
      <div v-if="profile" class="story container">
        <form class="card-panel">
            <h2 class="center blue-text">{{ profile.alias }}'s story</h2>
            <div class="field">
                <label for="text">Story:</label>
                <p :v-bind="story">{{ story }}</p>
            </div>
            <div class="image-preview" v-if="image.length > 0">
             <img class="preview" :src="image" />
            </div>
            <div class="field">
                <router-link :to="{ name: 'Profile', params: {id: storyID}}"><button class="btn blue">Go To Profile!</button></router-link>
                <button class="btn blue" @click.prevent="close">Close</button>
            </div>
        </form>
    </div>
  </transition>
</template>

<script>
import db from '@/firebase/init'
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
    },
    created () {
        db.collection('users').doc(this.storyID).get()
        .then(user => {
            this.profile = user.data()
        }).then(() => {
            db.collection('pings').where('user_id', '==', this.profile.user_id)
            .get().then(snapshot => {
                snapshot.forEach(doc => { //forEach? uvijek će biti samo jedan, Todo: fix
                    this.story = doc.data().story
                    this.image = doc.data().image
                })
            })
        })
    },
}
</script>

<style>
.modal-fade-enter,
.modal-fade-leave-active {
    opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 1s ease
}

.story {
    max-width: 400px;
    margin-top: 60px;
}

.story h2 {
    font-size: 4.2em;
}

.story .field {
    margin-bottom: 16px;
}

.story .btn {
    margin-right: 10px;
}
.story .image-preview{
    text-align:center;
}
.story img.preview {
  width: 200px;
  background-color: white;
  border: 1px solid #ddd;
  padding: 5px;
}
</style>