<template>
    <div class="map">
        <div class="google-map" id="map"></div>
    </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'Map',
    data () {
        return {
            lat: 53,
            lng: -3
        }
    },
    methods: {
        renderMap() {
            const map = new window.google.maps.Map(document.getElementById('map'), {
                center: {
                    lat: this.lat,
                    lng: this.lng
                },
                zoom: 6,
                maxZoom: 15,
                minZoom: 3,
                streetViewControl: false
            })

            db.collection('users').get().then(users => {
                users.docs.forEach(doc => {
                    let data = doc.data()
                    if (data.geolocation) {
                        let marker = new window.google.maps.Marker({
                            position: {
                                lat: data.geolocation.lat,
                                lng: data.geolocation.lng
                            },
                            map
                        })
                        marker.addListener('click', () => {
                            this.$router.push({ name: 'Profile', params: { id: doc.id }})
                        })
                    }
                })
            })
            
        }
    },
    mounted() {
        let user = firebase.auth().currentUser
        console.log(user)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                this.lat = pos.coords.latitude
                this.lng = pos.coords.longitude

                db.collection('users').where('user_id', '==', user.uid).get()
                .then(snapshot => {
                    snapshot.forEach((doc) => {
                        db.collection('users').doc(doc.id).update({
                            geolocation: {
                                lat: pos.coords.latitude,
                                lng: pos.coords.longitude
                            }
                        })
                    })
                }).then(() => {
                    this.renderMap()
                })
            }, (err) => {
                console.log(err)
                this.renderMap()
            }, {
                maximumAge: 60000,
                timeout: 3000
            })
        } else {
            this.renderMap()
        }
    }
}
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
</style>