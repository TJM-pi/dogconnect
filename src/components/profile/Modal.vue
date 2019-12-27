<template>
<div class="modal fade" id="SettingsModal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h4 class="modal-title" id="ModalLabel">{{modalData.naslov}}</h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
          <div v-if="modalData.alias" class="container">
            <label for="alias"><h4>New alias</h4></label>
            <input type="text" name="alias" v-model="alias" class="form-control"/>
          </div>
          <div v-if="modalData.email" class="container">
            <label for="email"><h4>New email</h4></label>
            <input type="email" name="email" v-model="email" class="form-control"/>
          </div>
          <div v-if="modalData.password" class="container">
            <label for="alias"><h4>New password</h4></label>
            <input type="password" name="password" v-model="password" class="form-control"/>
          </div>
          <div v-if="modalData.delete" class="container">
            <h2>Are you sure?</h2>
            <div class="btn-group">
              <button class="btn btn-primary btn-lg mr-2" data-dismiss="modal" @click.prevent="close">Cancel</button>
              <button class="btn btn-danger btn-lg" data-dismiss="modal" @click.prevent="change">Delete account</button>
            </div>
          </div>
          <p v-if="feedback" style="color:red;">{{feedback}}</p>
        </div>
        <div v-if="!modalData.delete" class="modal-footer mt-3">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click.prevent="close">Cancel</button>
            <button type="button" class="btn btn-primary" @click.prevent="change">Change</button>
        </div>
        </div>
    </div>
</div>
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
</style>