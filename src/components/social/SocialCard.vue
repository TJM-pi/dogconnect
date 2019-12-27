<template>
    <div class="col-sm-4 mt-4" style="display:inline-block;">
        <div class="card">
            <img v-if="cur_user.image" width="100%" height="200" :src=cur_user.image alt="">
            <img v-else width="100%" height="200" src="https://images.unsplash.com/photo-1499084732479-de2c02d45fcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80" alt="">
            <div class="card-body text-center">
                <p v-show="alreadyFriend" style="padding:0px; margin:0px; text-align:left;">Friend</p>
                <p v-show="alreadyBlocked" style="padding:0px; margin:0px; text-align:left;">Blocked</p>
              
                <h5 class="card-title">{{cur_user.alias}}</h5>
                <p class="card-text">{{cur_user.description}}</p>
              
            </div>
            <div class="card-footer text-center">
                  <div class="btn-group">
                    <button v-show="!alreadyFriend" @click="addFriend" title="Add user as a friend"
                        class="btn btn-primary btn-lg mr-2"><i class="fas fa-plus"></i></button>
                    <button v-show="alreadyFriend" @click="unFriend" title="Unfriend user"
                        class="btn btn-secondary btn-lg mr-2"><i class="fas fa-plus"></i></button>
                    <button v-show="!alreadyBlocked" @click="blockFriend" title="Block user"
                        class="btn btn-danger btn-lg"><i class="fas fa-minus"></i></button>
                    <button v-show="alreadyBlocked" @click="unBlock" title="Unblock user"
                        class="btn btn-secondary btn-lg"><i class="fas fa-minus"></i></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: "SocialCard",
    props: ["cur_user"],
    data(){
        return{
            user: firebase.auth().currentUser,
            usersRef: db.collection("users"),
            alreadyFriend: false,
            alreadyBlocked: false
        };
    },

    methods: {
        addFriend(){
            this.usersRef
                .where("user_id","==",this.user.uid)
                .get()
                .then(querySnapshot =>{
                    querySnapshot.forEach(document => {
                        
                        this.alreadyFriend=true
                        this.alreadyBlocked=false
                        let newFriendsArr = (document.data().friend_id === undefined)
                                            ? [] : document.data().friend_id
                                                                    
                        //new friend added to friends
                        newFriendsArr.push(this.cur_user.user_id)
                        this.usersRef.doc(document.id).update({
                            friend_id: newFriendsArr
                        })
                        
                        //new friend removed from blocked if necessary
                        let BlockedArr = (document.data().blocked_id === undefined)
                                         ? [] : document.data().blocked_id
                        
                        let newBlockedArr = BlockedArr.filter(ele => ele!==this.cur_user.user_id)
                        
                        if(BlockedArr.includes(this.cur_user.user_id)){
                            this.usersRef.doc(document.id).update({
                                blocked_id: newBlockedArr
                            })
                        }
                        
                        //hardfix for lack of knowledge with returning promises
                        let newUserDoc = document.data()
                        newUserDoc.friend_id = newFriendsArr
                        newUserDoc.blocked_id = newBlockedArr
                        console.log("hereee: ", newUserDoc)
                        this.$emit('newUserDoc', newUserDoc)
                        
                    })
                })
        },
        blockFriend(){
            this.usersRef
                .where("user_id","==",this.user.uid)
                .get()
                .then(querySnapshot =>{
                    querySnapshot.forEach(document => {
                        
                        this.alreadyFriend=false
                        this.alreadyBlocked=true
                        let newBlockedArr = (document.data().blocked_id === undefined)
                                            ? [] : document.data().blocked_id;
                        
                        //new user blocked
                        newBlockedArr.push(this.cur_user.user_id)
                        this.usersRef.doc(document.id).update({
                            blocked_id: newBlockedArr 
                        })


                        //new user removed from friends if necessary
                        let FriendsArr = (document.data().friend_id === undefined)
                                         ? [] : document.data().friend_id
                        
                        let newFriendsArr = FriendsArr.filter(ele => ele!==this.cur_user.user_id)
                        if(FriendsArr.includes(this.cur_user.user_id)){
                            this.usersRef.doc(document.id).update({
                                friend_id: newFriendsArr
                            })
                        }

                        //hardfix for lack of knowledge with returning promises
                        let newUserDoc = document.data()
                        newUserDoc.friend_id = newFriendsArr
                        newUserDoc.blocked_id = newBlockedArr
                        console.log("hereee: ", newUserDoc)
                        this.$emit('newUserDoc', newUserDoc)
                    })
                })
        },

        unFriend(){
            this.usersRef
                .where("user_id","==",this.user.uid)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(document => {
                        this.alreadyFriend = false
                        let newFriendsArr = document.data().friend_id.filter(ele => ele!==this.cur_user.user_id)

                        this.usersRef.doc(document.id).update({
                            friend_id: newFriendsArr
                        })
                            
                        //hardfix
                        let newUserDoc = document.data()
                        newUserDoc.friend_id = newFriendsArr
                        this.$emit('newUserDoc', newUserDoc)
                    })
                })

        },
        unBlock(){
            this.usersRef
                .where("user_id","==",this.user.uid)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(document => {
                        this.alreadyBlocked = false
                        let newBlockedArr = document.data().blocked_id.filter(ele => ele!==this.cur_user.user_id)

                        this.usersRef.doc(document.id).update({
                            blocked_id: newBlockedArr
                        })
                        //hardfix
                        let newUserDoc = document.data()
                        newUserDoc.blocked_id = newBlockedArr
                        console.log("newBLOCKEDARR: ",newUserDoc)
                        this.$emit('newUserDoc',newUserDoc)
                    })
                })
        },
        curUserLoc(){
            if(this.cur_user.geolocation)
                return this.cur_user.geolocation.lat
            else 
                return "Nije ukljucio lokaciju"
        }
    },

    mounted(){
        //console.log("MOUNTED CARD with", this.cur_user.alias)
        this.usersRef
            .where("user_id","==",this.user.uid)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(document => {
                    let FriendsArr = (document.data().friend_id === undefined)
                                            ? [] : document.data().friend_id;
                    
                    let BlockedArr = (document.data().blocked_id === undefined)
                                            ? [] : document.data().blocked_id;
                    
                    //console.log("hereF: ", FriendsArr)
                    //console.log("hereB: ", BlockedArr)
                    if(FriendsArr.includes(this.cur_user.user_id)) this.alreadyFriend = true
                    if(BlockedArr.includes(this.cur_user.user_id)) this.alreadyBlocked = true
                })
            })
    },
}
</script>

<style lang="scss">
.card-footer .btn-group .btn{
    border-radius: 50% !important;
}
</style>