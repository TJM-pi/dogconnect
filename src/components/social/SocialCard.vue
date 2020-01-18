<template>
    <div class="col-lg-4 col-md-6 col-12 mt-4 mb-4">
        <div class="card h-100 shadow rounded">
            <img v-if="cur_user.image" class="rounded-top" width="100%" height="250" :src=cur_user.image alt="">
            <img v-else width="100%"  class="rounded-top"  height="250" src="https://cdn.steemitimages.com/DQmbQGsqqhgTgZK2Wh4o3o9pALrNqPVryT3AH17J4WExoqS/no-image-available-grid.jpg" alt="">
            <div class="card-body text-center">
                <p v-if="alreadyFriend" class="topleftrelationship">Friend</p>
                <p v-else-if="alreadyBlocked" class="topleftrelationship">Blocked</p>
                <p v-else class="topleftrelationship" style="height:24px;"></p>
                <h5 class="card-title">
                    <router-link :to="{ name: 'Profile', params: {id: cur_user.docid}}">{{cur_user.alias}}</router-link>
                </h5>
                <p v-if="cur_user.description" class="card-text limit-length">{{cur_user.description}}</p>
                <p v-else class="card-text">No description</p>
            </div>
            <div class="card-footer text-center rounded">
                  <div class="btn-group">
                    <button v-show="!alreadyFriend" @click="addFriend" title="Add user as a friend"
                        class="btn btn-primary btn-lg mr-5 rounded-circle"><i class="fas fa-plus"></i></button>
                    <button v-show="alreadyFriend" @click="unFriend" title="Unfriend user"
                        class="btn btn-secondary btn-lg mr-5 rounded-circle"><i class="fas fa-plus"></i></button>
                    <button v-show="!alreadyBlocked" @click="blockFriend" title="Block user"
                        class="btn btn-danger btn-lg rounded-circle"><i class="fas fa-minus"></i></button>
                    <button v-show="alreadyBlocked" @click="unBlock" title="Unblock user"
                        class="btn btn-secondary btn-lg rounded-circle"><i class="fas fa-minus"></i></button>
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
                        //console.log("hereee: ", newUserDoc)
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
                        //console.log("hereee: ", newUserDoc)
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
                        //console.log("newBLOCKEDARR: ",newUserDoc)
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

<style lang="scss" scoped>
.card-footer .btn-group .btn{
    //border-radius: 50% !important;
    margin-top:0px;
    width:60px;
    height:60px;
}
.topleftrelationship{
    padding:0px;
    margin:0px;
    text-align:left;
    font-weight:bold;
}
.limit-length{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    //max-width: 60ch;
}
a:hover{
    text-decoration:none;
}
</style>