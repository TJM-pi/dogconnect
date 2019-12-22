<template>
    <div id="social" class="container">
        <h1>hey</h1>
        <a @click="filterDropdown = !filterDropdown" class="dropdown-trigger btn blue" data-target="dropdown1">filter</a>
        <ul v-show="filterDropdown">
            <li v-show="filterBy !== 'friend'"><a @click="change('friend')" class="btn blue">Friends only</a></li>
            <li v-show="filterBy === 'friend'"><a @click="change('friend')" class="btn grey">Friends only</a></li>
            <li v-show="filterBy !== 'blocked'"><a @click="change('blocked')" class="btn red"> Blocked only</a></li>
            <li v-show="filterBy === 'blocked'"><a @click="change('blocked')" class="btn grey"> Blocked only</a></li>

            <li>Search: <input v-model="searchTerm" type="search" style="width:40%;"></li>
        </ul>

        <SocialCard v-for="user in filteredUsers" :key="user.user_id" :cur_user="user" 
                    @newUserDoc="updateUserDoc"/>
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
            filterBy: false,
            searchTerm: ""
        }
    },

    methods: {
        change(clickValue){
            console.log(clickValue)
            if(this.filterBy === clickValue) this.filterBy = false
            else this.filterBy = clickValue
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
                if(user.user_id != this.user.uid) //preskoci sebe
                    this.users.push(user);
                   
                 else this.userDoc = user //ucitaj svoj doc.data() odma
            })
        })
        console.log("Social mounted")
    },

    computed: {
        filteredUsers(){
            let filteredArr = this.users
            if(this.filterBy=="friend"){
                console.log("filter friends")
                let friends = this.userDoc.friend_id
                filteredArr = this.filterArrByArr(this.users, friends)
            }
            else if(this.filterBy=="blocked"){
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
    .card-image{
        width:20%;
        height:150px;
    }
    .card-image img{
        height:100%;
        width:100% !important;
    }

</style>