<template>
  <transition name="modal-fade">
    <div v-if="modalData" class="mod container">
      <form class="card-panel">
        <h2 class="center blue-text">{{ modalData.naslov }}</h2>
        <div v-if="modalData.alias" class="field">
          <label for="alias">New alias:</label>
          <input type="text" name="alias" v-model="alias"/>
        </div>
        <div v-if="modalData.email" class="field">
          <label for="email">New email:</label>
          <input type="email" name="email" v-model="email"/>
        </div>
        <div v-if="modalData.password" class="field">
          <label for="password">New password:</label>
          <input type="password" name="password" v-model="password"/>
        </div>
        <div v-if="modalData.delete" class="field">
          <button class="btn red" @click.prevent="change">Delete</button>
          <button class="btn blue" @click.prevent="close">Cancel</button>
        </div>
        <p class="red-text center" v-if="feedback">{{ feedback }}</p>
        <div v-if="!modalData.delete" class="field">
          <button class="btn blue" @click.prevent="change">Change</button>
          <button class="btn blue" @click.prevent="close">Cancel</button>
        </div>
      </form>
    </div>
  </transition>
</template>


<script>
/* eslint-disable no-unused-vars */
import firebase from 'firebase'
export default {
  name: "Modal",
  props: ["modalData"],
  data() {
    return {
      password: null,
      email: null,
      alias: null,
      feedback: null,
      id: null
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    change(event, value) {
        if (this.modalData.alias) {
          this.id = 'alias'
          if (this.alias) {
            this.feedback = null
            this.$emit("change", this.id, this.alias)
          } else {
            this.feedback = 'Alias is already taken'
          }
        } else if (this.modalData.email) {
          this.id = 'email'
            if (this.email) {
              this.feedback = null
              this.$emit("change", this.id, this.email)
            } else {
              this.feedback = 'Please enter the correct email'
            }
        } else if (this.modalData.password) {
          this.id = 'password'
          if (this.password) {
            this.feedback = null
            this.$emit("change", this.id, this.password)
          } else {
            this.feedback = 'Please enter the correct password'
          }
        } else {
          this.id = 'delete'
          this.feedback = null
          this.$emit("change", this.id, null)
        } 
    }
  },
};
</script>

<style>
.modal-fade-enter,
.modal-fade-leave-active {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}

.mod {
  max-width: 400px;
  margin-top: 60px;
}

.mod h2 {
  font-size: 4.2em;
}

.mod .field {
  margin-bottom: 16px;
}

.mod .btn {
  margin-bottom: 16px;
}
</style>