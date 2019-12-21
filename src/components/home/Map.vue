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
      
      <!--<a v-show="!isModalVisible" class="btn-floating blue" @click="showPings" title="Refresh map, Calls showPings(), mouseover has been cut"> 
        <i class="material-icons">refresh</i>
      </a>-->
    </div>

    <Ping v-if="isModalVisible" @close="closeModal" @ping="createPing" @sent="storeImage"/>
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
      all_markers: [], //u njemu se nalaze svi Marker(), pri dodavanju novog pinga ga je potrebno updatati || showPings iz njega filtrirano prikazuje na mapu
      user: firebase.auth().currentUser,
      userDoc: null,
      storyID: null,
      image: "",
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
    storeImage (value) {
      this.image = value
    },
    addListenerToMarker(marker, ping) { //implementacija click eventa pinga
      if (ping) { //showPings
        marker.addListener("click", () => {
          db.collection("users")
            .where("user_id", "==", ping.data().user_id)
            .get()
            .then(snapshot => {
              console.log("showPings")
              snapshot.forEach(doc => {
                  this.storyID = doc.id;
                  this.isStoryVisible = true;
              });
            });
        });
      } else { //createPing
        marker.addListener('click', () => {
          db.collection('users')
          .where('user_id', '==', this.user.uid)
          .get()
          .then(snapshot => {
            console.log("createPing")
            snapshot.forEach(doc => {
              this.storyID = doc.id;
              this.isStoryVisible = true;
            })
          })
        })
      }
    },

    setMapOnAllMarkers(){
      for(let i=0;i<this.all_markers.length; i++)
        this.all_markers[i].setMap(this.map)
      
    },
    setMapOnFriendMarkers(){
      let friendsArr = this.userDoc.friend_id
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
    updatePings(){
      db.collection("pings")
        .get()
        .then(pings => {
          pings.docs.forEach(doc => {
            if (doc.data().latitude && doc.data().longitude) {
              let marker = new window.google.maps.Marker({
                position: {
                  lat: doc.data().latitude,
                  lng: doc.data().longitude
                },
                map: this.map, //pri mountu odma stavlja sve pingove na mapu ovdje
                user_id: doc.data().user_id
              });
              this.addListenerToMarker(marker, doc)
              this.all_markers.push(marker)
            }
          });
        });
    },
    getLocation() { //updates user's lat, lng coordinates to current one's
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
    createPing(value, image) { //2nd parameter is not used at all, you have image in this.image
      this.getLocation();
      let marker = new window.google.maps.Marker({
        position: {
          lat: this.lat,
          lng: this.lng
        },
        map: this.map
      });
      this.addListenerToMarker(marker, null)
      this.all_markers.push(marker)

      let found = false;
      db.collection('pings').get().then(pings => {
        pings.docs.forEach(doc => {
          if (doc.data().user_id == this.user.uid) {
            db.collection('pings').doc(doc.id).update({
              latitude: this.lat,
              longitude: this.lng,
              user_id: this.user.uid,
              story: value,
              image: this.image
            })
            found = true
          }
        })
      }).then(() => {
        if (!found) {
          db.collection('pings').add({
          latitude: this.lat,
          longitude: this.lng,
          user_id: this.user.uid,
          story: value,
          image: this.image
        })
      }
      })
      this.closeModal();
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
    updateUserDoc(){
      db
      .collection("users")
      .where("user_id","==",this.user.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.userDoc = doc.data()
          console.log("userDoc updated.", this.userDoc)
        })
      }
      )
    },
  },
  mounted() {
    this.updateUserDoc()
    this.updatePings()
    if (navigator.geolocation) { //location enabled
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.lat = pos.coords.latitude;
          this.lng = pos.coords.longitude;
          this.renderMap();
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