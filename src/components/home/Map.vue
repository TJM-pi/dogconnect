[<template>
  <div class="map">
    <div class="google-map" id="map"></div>

    <div class="btn-group">
      <a v-show="!isModalVisible" class="btn-floating yellow" @click="showModal">
        <i class="material-icons">add</i>
      </a>
      <a v-show="!isModalVisible" class="btn-floating yellow" @click="filterDropdown = !filterDropdown">
        <i class="material-icons">sort</i>
      </a>
      <ul v-show="filterDropdown">
        <li v-show="filterValue!='all'" class="btn blue" @click="change('all')">All</li>
        <li v-show="filterValue=='all'" class="btn grey" @click="change('all')" disabled>All</li>
        <li v-show="filterValue!='friends'" class="btn blue" @click="change('friends')">Friends only</li>
        <li v-show="filterValue=='friends'" class="btn grey" @click="change('friends')" disabled>Friends only</li>
        <li v-show="filterValue!='blocked'" class="btn blue" @click="change('blocked')">Blocked only</li>
        <li v-show="filterValue=='blocked'" class="btn grey" @click="change('blocked')" disabled>Blocked only</li>
      </ul>
      <a v-show="!isModalVisible" class="btn-floating red" @click="removePing"><i class="material-icons">delete</i></a>
    </div>

    <Ping v-if="isModalVisible" @close="closeModal" @ping="createPing"/>
    <Story v-if="isStoryVisible" :storyID="storyID" @close="closeModal" />
  </div>
</template>

<script>
// Asinkrone funkcije zajebavaju, odvoji funkciju i pozovi je tek nakon!
/* eslint-disable no-unused-vars */
import Ping from "@/components/home/Ping";
import Story from "@/components/home/Story";
import firebase from "firebase";
import db from "@/firebase/init";

export default {
  name: "Map",
  components: {
    Ping,
    Story
  },
  data() {
    return {
      lat: null,
      lng: null,
      isModalVisible: false,
      isStoryVisible: false,
      map: null,
      all_markers: [], //u njemu se nalaze svi Marker(), showPings iz njega filtrirano prikazuje na mapu
      user: firebase.auth().currentUser,
      userDoc: null,
      storyID: null,
      filterDropdown: false,
      filterValue: "all"
    }
  },
  methods: {
    change(value){
      if(this.filterValue === value) this.filterValue = "all"
      else this.filterValue = value
      this.showPings()
    },
    addListenerToMarker(marker, ping) { //implementacija click eventa pinga
        marker.addListener("click", () => {
          db.collection("users")
            .where("user_id", "==", ping.user_id)
            .get()
            .then(snapshot => {
              console.log("showPings")
              snapshot.forEach(doc => {
                  this.storyID = doc.id;
                  this.isStoryVisible = true;
              });
            });
        });
    },

    setMapOnAllMarkers(){
      for(let i=0;i<this.all_markers.length; i++)
        this.all_markers[i].setMap(this.map)
    },
    setMapOnFriendMarkers(){
      let friendsArr = this.userDoc.friend_id
      if(friendsArr === undefined){
        console.log("You have no friends")
        return
      }
      for(let i=0;i<this.all_markers.length;i++)
      { 
        if(friendsArr.includes(this.all_markers[i].user_id))
          this.all_markers[i].setMap(this.map)
        else
          this.all_markers[i].setMap(null)
      }
    },
    setMapOnBlockedMarkers(){
      let blockedArr = this.userDoc.blocked_id
      if(blockedArr === undefined){
        console.log("You haven't blocked anyone")
        return
      }
      for(let i=0;i<this.all_markers.length;i++)
      { 
        if(blockedArr.includes(this.all_markers[i].user_id))
          this.all_markers[i].setMap(this.map)
        else
          this.all_markers[i].setMap(null)
      }
    },
    showPings(){ //use this method to list pings on map (HAS FILTER)
      console.log("showing pings")

      if(this.filterValue == "all") this.setMapOnAllMarkers()
      else if(this.filterValue == "friends") this.setMapOnFriendMarkers()
      else if(this.filterValue == "blocked") this.setMapOnBlockedMarkers()
    },
    addPingToMap(ping){
      let marker = new window.google.maps.Marker({
        position: {
          lat: ping.latitude,
          lng: ping.longitude
        },
        map: this.map, //odma ga stavi na mapu (pr. pri mountu)
        user_id: ping.user_id
      })
      this.addListenerToMarker(marker,ping)
      this.all_markers.push(marker)
    },
    getLocation() { //updates user's lat, lng coordinates to current one's (IMPORTANT WHILE USER IS MOVING AROUND)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            this.lat = pos.coords.latitude;
            this.lng = pos.coords.longitude;
            db.collection("users")
              .where("user_id", "==", this.user.uid)
              .get()
              .then(snapshot => {
                snapshot.forEach(doc => {
                  db.collection("users")
                    .doc(doc.id)
                    .update({
                      geolocation: {
                        lat: this.lat,
                        lng: this.lng
                      }
                    });
                });
              });
          },
          err => {
            console.log(err);
          },
          {
            maximumAge: 60000,
            timeout: 3000
          }
        );
      }
    },
    addPingToArchive(value,image){
      db.collection('archived-pings').add({ //all pings for stats
        latitude: this.lat,
        longitude: this.lng,
        user_id: this.user.uid,
        story: value,
        image: image,
        dateCreated: firebase.firestore.Timestamp.now()
      })
    },
    createPing(value, image) {
      this.addPingToArchive(value,image);
      this.getLocation();

      let found = false;
      for(let i=0;i<this.all_markers.length;i++)
      {
        if(this.all_markers[i].user_id === this.user.uid)
        {
          this.all_markers[i].setMap(null)
          this.all_markers.splice(i,1)
          found=true
          break
        }
      }

      if(!found){
        db.collection('pings').add({ //pings for map (1 ping 1 person)
          latitude: this.lat,
          longitude: this.lng,
          user_id: this.user.uid,
          story: value,
          image: image,
          dateCreated: firebase.firestore.Timestamp.now()
        })
      }
      else {
        db.collection('pings').get().then(pings => { 
          pings.docs.forEach(doc => {
            if (doc.data().user_id == this.user.uid) {
              db.collection('pings').doc(doc.id).update({
                latitude: this.lat,
                longitude: this.lng,
                user_id: this.user.uid,
                story: value,
                image: image,
                dateCreated: firebase.firestore.Timestamp.now()
              })
            }
          })
        })
      }
      this.closeModal();
    },
    removePing(){
      db
      .collection("pings")
      .where("user_id","==",this.user.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          db.collection("pings").doc(doc.id).delete().then(() => console.log("Deleted."))
        })
      })
    },
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.isStoryVisible = false;
    },
    renderMap() {
      this.map = new window.google.maps.Map(document.getElementById("map"), {
        center: {
          lat: this.lat,
          lng: this.lng
        },
        zoom: 6,
        maxZoom: 15,
        minZoom: 3,
        streetViewControl: false
      });
    },
    userDocListener(){ //refreshes userDoc (coz new friends/blocked)
      db
      .collection("users")
      .where("user_id","==",this.user.uid)
      .onSnapshot(snapshot => {
        snapshot.forEach(doc => {
          this.userDoc = doc.data()
          console.log("userDoc updated.", this.userDoc)
        })
      })
    },
    pingListener(){ //refreshes pings
      db
      .collection("pings")
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === "added") { //can add pings
            this.addPingToMap(change.doc.data())
            //console.log("New ping: ", change.doc.data());
          }
          if (change.type === "modified") { //triggered when same user creates ping twice
            this.addPingToMap(change.doc.data())
            console.log("Modified ping: ", change.doc.data());
          }
          if (change.type === "removed") { //currently cannot remove pings from db
            console.log("Removed ping: ", change.doc.data());
            let deletedPing = change.doc.data()
            for(let i=0;i<this.all_markers.length;i++){
              if(this.all_markers[i].user_id === deletedPing.user_id){
                this.all_markers[i].setMap(null)
                this.all_markers.splice(i,1)
                break
              }
            }
          }
        });
      });
    },
  },
  mounted() {
    this.userDocListener()
    if (navigator.geolocation) { //location enabled
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.lat = pos.coords.latitude;
          this.lng = pos.coords.longitude;
          this.renderMap();
          this.pingListener()
        },
        err => {
          console.log(err);
          this.renderMap();
        },
        {
          maximumAge: 60000,
          timeout: 3000
        }
      );
    } else {
      this.renderMap();
      this.pingListener()
    }
  }
};
</script>

<style lang="scss" scoped>
.google-map {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: #ffffff;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

.btn-group{
  margin-right:16px;
  float:right;
}

.btn-group ul li{
  display:block;
}
.btn-floating {
  display:block;
  text-align:center;
  margin: 16px 0px 16px 0px;
  //position: sticky;
  //margin-top: 16px;
  //right: 10px;
}
</style>