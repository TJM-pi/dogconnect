<template>
<div class="modal fade" id="SettingsModal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h4 class="modal-title" id="ModalLabel">{{modalData.naslov}}</h4>
            <button type="button" class="close" aria-label="Close" @click.prevent="close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
          <div v-if="modalData.alias" class="container">
            <label for="alias"><h4>New alias</h4></label>
            <input type="text" name="alias" v-model="alias" class="form-control"/>
            <label for="password" class="mt-3"><h4>Password</h4></label>
            <input type="password" name="password" v-model="confirmation" class="form-control">
          </div>
          <div v-if="modalData.email" class="container">
            <label for="email"><h4>New email</h4></label>
            <input type="email" name="email" v-model="email" class="form-control"/>
            <label for="password" class="mt-3"><h4>Password</h4></label>
            <input type="password" name="password" v-model="confirmation" class="form-control">
          </div>
          <div v-if="modalData.password" class="container">
            <label for="oldPassword"><h4>Old Password</h4></label>
            <input type="password" name="oldPassword" v-model="confirmation" class="form-control">
            <label for="newPassword" class="mt-3"><h4>New password</h4></label>
            <input type="password" name="newPassword" v-model="password" class="form-control"/>
          </div>
          <div v-if="modalData.delete" class="container">
            <label for="password"><h4>Password</h4></label>
            <input type="password" name="password" v-model="confirmation" class="form-control">
            <div class="btn-group mt-2">
              <button class="btn btn-primary btn-lg mr-2" @click.prevent="close">Cancel</button>
              <button class="btn btn-danger btn-lg" @click.prevent="change">Delete account</button>
            </div>
          </div>
          <p v-if="feedback" style="color:red; margin: 10px 0px 0px 0px;">{{feedback}}</p>
        </div>
        <div v-if="!modalData.delete" class="modal-footer mt-3">
            <button type="button" class="btn btn-secondary" @click.prevent="close">Cancel</button>
            <button type="button" class="btn btn-primary" @click.prevent="change">Change</button>
        </div>
        </div>
    </div>
</div>
</template>


<script>
/* eslint-disable no-unused-vars */
import firebase from 'firebase'
import db from '@/firebase/init'
import $ from 'jquery'

export default {
  name: "Modal",
  props: ["modalData"],
  data() {
    return {
      user: firebase.auth().currentUser,
      password: null,
      confirmation: null,
      email: null,
      alias: null,
      feedback: null,
    };
  },
  methods: {
    close() {
      this.feedback = null
      this.confirmation = null
      window.$('#SettingsModal').modal('toggle')
    },
    change(){
      let credential = firebase.auth.EmailAuthProvider.credential(
        this.user.email, this.confirmation
      )
      
      this.user.reauthenticateWithCredential(credential).then(() => {
        
        if(this.modalData.alias){
          db.collection("users")
            .where("alias","==",this.alias)
            .get()
            .then(querySnapshot => {
              if(querySnapshot.size>0)
                this.feedback = 'Alias is already taken'
              else if(this.alias.length==0)
                this.feedback = 'Please enter alias'
              else{
                db.collection("users").doc(this.$route.params.id).update({alias: this.alias})
                  .then(() => {
                    this.close()
                    this.$router.push({name: 'Profile', params: {id: this.$route.params.id}})
                    this.$router.go()
                  })
              }
            })
        }
        
        else if(this.modalData.email){
          this.user.updateEmail(this.email).then(() => {
            this.close()
            this.$router.push({name: 'Profile', params: {id: this.$route.params.id}})
          }).catch(error => {
              if(error.code === 'auth/invalid-email')
                this.feedback = 'Please enter a valid email'
              else if(error.code === 'auth/email-already-in-use')
                this.feedback = 'Email is already registered with another account'
            })
        }
        
        else if(this.modalData.password){
          this.user.updatePassword(this.password).then(() => {
            this.close()
            this.$router.push({name: 'Profile', params: {id: this.$route.params.id}})
          }).catch(error => this.feedback = error.message)
        }
        
        else if(this.modalData.delete){
          db.collection("users").doc(this.$route.params.id).delete()
          db.collection("pings").where("user_id","==",this.user.uid)
            .get().then(querySnapshot => {
              querySnapshot.forEach(doc => db.collection("pings").doc(doc.id).delete())
            })
            .then(() => this.user.delete())
            .then(() => {
              this.close()
              this.$router.push({name: 'Signup'})
              this.$router.go()
            })
        }
      }).catch(error => this.feedback = 'Password incorrect')

    }
  },
};
</script>

<style>
</style>