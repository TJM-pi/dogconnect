<template>
<div class="modal fade" id="RemoveModal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="ModalLabel">Remove Ping</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <h4 v-if="!loading && deleted" class="text-center">Your ping has been successfully deleted.</h4>
        <h4 v-else-if="!loading && !deleted" class="text-center">You have no pings to delete.</h4>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="close">Ok</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
/* eslint-disable no-unused-vars */
import firebase from "firebase";
import db from "@/firebase/init";
export default {
    name: 'Remove',
    props: ['user'],
    data () {
        return {
          loading: true,
          deleted: false
        }
    },
    methods: {
      close() {
        this.$emit('close'); 
      },
    },
    mounted(){
      db
      .collection("pings")
      .where("user_id","==",this.user.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          db.collection("pings").doc(doc.id).delete().then(this.deleted=true)
        })
      }).then(() => {
          this.loading=false;
        })
    }
}
</script>

<style lang="scss">
</style>