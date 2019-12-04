[<template>
  <div class="map">
    <div class="google-map" id="map" @mousemove.prevent="showPings"></div>
    <a v-show="!isModalVisible" class="btn-floating right yellow" @click="showModal">
      <i class="material-icons">add</i>
    </a>
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
      user: firebase.auth().currentUser,
      storyID: null,
      image: ""
    }
  },
  methods: {
    storeImage (value) {
      this.image = value
    },
    addListenerToMarker(marker, ping) {
      if (ping) {
        marker.addListener("click", () => {
        db.collection("users")
          .where("user_id", "==", ping.data().user_id)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
                this.storyID = doc.id;
                this.isStoryVisible = true;
            });
          });
      });
      } else {
        marker.addListener('click', () => {
          db.collection('users').where('user_id', '==', this.user.uid)
          .get().then(snapshot => {
            snapshot.forEach(doc => {
              this.storyID = doc.id;
              this.isStoryVisible = true;
            })
          })
        })
      }
    },
    showPings() {
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
                map: this.map
              });
              this.addListenerToMarker(marker, doc)
            }
          });
        });
    },
    getLocation() {
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
    createPing(value, image) {
      this.getLocation();
      let marker = new window.google.maps.Marker({
        position: {
          lat: this.lat,
          lng: this.lng
        },
        map: this.map
      });
      this.addListenerToMarker(marker, null)
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
    }
  },
  mounted() {
    if (navigator.geolocation) {
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

<style>
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

.btn-floating {
  position: sticky;
  margin-top: 16px;
  right: 10px;
}
</style>