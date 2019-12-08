<template>
    <div id="social" class="container">
        <h1>hey</h1>

        <SocialCard v-for="user in users" :key="user.id" :cur_user="user"/>
    </div>
</template>

<script>

import firebase from "firebase"
import SocialCard from "@/components/social/SocialCard"

export default {
    name: "Social",
    components: {
        SocialCard
    },

    data(){
        return{
            users: [],
            user: null
        }
    },

    methods: {

    },

    created(){
        var self = this;
        firebase.auth().onAuthStateChanged(function(user){
            self.user = user;
        });

        this.users = []
        firebase
            .firestore()
            .collection("users")
            .get()
            .then(snap => {
                snap.forEach(doc => {
                    var user = doc.data();
                    user.id = doc.id;
                    console.log(doc.data());
                    this.users.push(user);
                })
            })
    }
};
</script>

<style lang="scss">
    .card-image{
        width:20%;
        height:150px;
    }
    .card-image img{
        height:100%;
        width:100% !important;
    }

</style>