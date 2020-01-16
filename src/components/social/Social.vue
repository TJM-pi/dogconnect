<template>
    <div class="container">
        <h1 class="text-center mt-4 mb-4">Social</h1>   
        <div class="input-group">
            <div class="input-group-prepend">
                <div class="dropdown">
                    <button class="btn btn-primary" id="dropdownFilter" data-toggle="dropdown">{{filterBy}}</button>
                    <div class="dropdown-menu">
                        <a href="" class="dropdown-item" @click.prevent="change('All')">All</a>
                        <a href="" class="dropdown-item"  @click.prevent="change('Friends')">Friends</a>
                        <a href="" class="dropdown-item"  @click.prevent="change('Blocked')">Blocked</a>
                    </div>
                </div>
            </div>
            <input v-model="searchTerm" type="text" class="form-control" placeholder="Search user">
        </div>
        <div class="row mb-4">
        <SocialCard v-for="user in filteredUsers" :key="user.user_id" :cur_user="user" 
                    @newUserDoc="updateUserDoc"/>
        </div>
    </div>
</template>

<script>

import firebase from "firebase"
import db from '@/firebase/init'
import SocialCard from "@/components/social/SocialCard"

export default {
    name: "Social",
    components: {
        SocialCard
    },

    data(){
        return{
            users: [],
            user: null,
            userDoc: null,
            filterDropdown: false,
            filterBy: "All",
            searchTerm: ""
        }
    },

    methods: {
        change(clickValue){
            console.log(clickValue)
            //if(this.filterBy === clickValue) this.filterBy = false
            //else this.filterBy = clickValue
            this.filterBy = clickValue
        },

        removeFromArr(array, item){
            let index = array.indexOf(item)
            if(index !== -1) array.splice(index,1)
            return array
        },

        filterArrByArr(users, keepIDArr){ // users.user_id: [1,2,3,4,5], keepIDArr: [4,1] --> return list of users with uid's [4,1] 
            let filteredArr = []
            let deepKeepIDArr = Array.from(keepIDArr)
            for(let i=0; i<users.length; i++){
                for(let j=0; j<deepKeepIDArr.length; j++){
                    if(users[i].user_id === deepKeepIDArr[j]){
                        filteredArr.push(users[i])
                        deepKeepIDArr.splice(j,1)
                    }
                }
            }
            console.log(filteredArr)
            return filteredArr
        },

        updateUserDoc(newUserDocument){
            this.userDoc = newUserDocument
            console.log("Updated user doc: ",this.userDoc)
        }
    },

    mounted(){
        this.user = firebase.auth().currentUser
        db
        .collection("users")
        .get()
        .then(snap => {
            snap.forEach(doc => {
                var user = doc.data();
                if(user.user_id != this.user.uid){ //preskoci sebe
                    user.docid = doc.id;
                    this.users.push(user);
                }
                   
                else this.userDoc = user //ucitaj svoj doc.data() odma
            })
        })
        console.log("Social mounted")
    },

    computed: {
        filteredUsers(){
            let filteredArr = this.users
            if(this.filterBy=="Friends"){
                console.log("filter friends")
                let friends = this.userDoc.friend_id
                filteredArr = this.filterArrByArr(this.users, friends)
            }
            else if(this.filterBy=="Blocked"){
                console.log("filter blocked")
                let blocked = this.userDoc.blocked_id
                console.log("in social blockedarr: ", blocked)
                filteredArr = this.filterArrByArr(this.users,blocked)
            }
            return filteredArr.filter(user => user.alias.includes(this.searchTerm))
        }
    }
}
</script>

<style lang="scss" scoped>
.btn{
    margin-top:0px;
}

</style>