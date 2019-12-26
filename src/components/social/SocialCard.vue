<template>
    <div class="container">
        <div class="col sm12 m7">
            <!--<h2 class="header">Horizontal Card</h2>-->
            <div class="card horizontal">
                <div class="card-image">
                    <img v-if="cur_user.image" :src="cur_user.image" alt="">
                    <img v-else src="https://www.blogsaays.com/wp-content/uploads/2014/02/no-user-profile-picture-whatsapp.jpg">
                </div>

                <div class="card-stacked">
                    <div class="card-content">
                        <p v-show="alreadyFriend" style="float:right;">Friend</p>
                        <p v-show="alreadyBlocked" style="float:right;">Blocked</p>
                        <a href="#"> <h4 class="usernameH4">{{cur_user.alias}}</h4> </a>
                        <p style="margin-bottom:15px;">{{cur_user.description}}</p>
                    </div>

                    <div class="card-action">
                        <a v-show="!alreadyFriend" @click="addFriend" title="Add user as a friend" class="btn-floating btn-large waves-effect waves-light blue"><i class="material-icons">add</i></a>
                        <a v-show="alreadyFriend" @click="unFriend"  title="Unfriend user" class="btn-floating btn-large waves-effect waves-light undoBTN"><i class="material-icons">add</i></a>

                        <a v-show="!alreadyBlocked" @click="blockFriend" title="Block user" class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons">remove</i></a>
                        <a v-show="alreadyBlocked" @click="unBlock"  title="Unblock user" class="btn-floating btn-large waves-effect waves-light undoBTN"><i class="material-icons">remove</i></a>
                        
                        <!-- uzmi lat, long, zoom i ispisi dolje string kao konkretnu lokaciju -->
                        <p class="lokacijaP">Zadnje viđen na lokaciji: {{curUserLoc()}}</p>


                    </div>
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
    .card-image{
        width:20%;
        height:auto !important;
    }
    .card-image img{
        height:100%;
        width:100% !important;
    }

    .card-action{
        padding:0px !important;
        text-align:right;
    }

    .card-action a{
        margin: 10px 15px 10px 10px;
    }

    .usernameH4{
        margin: 0px 0px 10px 0px;
        font-weight:600;
    }

    .lokacijaP{
        margin:5px 10px 10px 0px;
        color:gray;
    }
    .undoBTN{
        background-color:lightgray;
    }
    .undoBTN:hover{
        background-color:lightgray !important;
    }

</style>