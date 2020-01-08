<template>
    <div class="container">
        <h1 class="text-center">Statistics</h1>
        <div class="btn-group mb-2">
            <button class="btn btn-primary mr-2" @click="change('global')">Global</button>
            <button class="btn btn-primary" @click="change('yours')">Personal</button>
        </div>
        <div class="google-map" id="map"></div>
    </div>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";

export default {
    data(){
        return {
            map: null,
            heatmap: null,
            heatMapData: [],
            lat: null,
            lng: null,
            user: firebase.auth().currentUser,
            statType: "global"
        }
    },

    methods: {
        change(value){
            this.statType = value
            this.initialize(this.statType)
        },
        loadGlobalHeatMapData(){
            this.heatMapData = []
            return db //vracas promise ovdje
            .collection("archived-pings")
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    let ping = doc.data()
                    
                    this.heatMapData.push(
                        new window.google.maps.LatLng(ping.latitude, ping.longitude)
                    )
                })
            })
        },
        loadYoursHeatMapData(){
            this.heatMapData = []
            return db
            .collection("archived-pings")
            .where("user_id","==",this.user.uid)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    let ping = doc.data()
                    this.heatMapData.push(
                        new window.google.maps.LatLng(ping.latitude,ping.longitude)
                    )
                })
            })
        },
        loadHeatMap(){
            this.heatmap = new window.google.maps.visualization.HeatmapLayer({
                data: this.heatMapData
            })
        },
        setHeatMapToMap(){
            this.heatmap.setMap(this.map)
        },
        renderMap(){
            this.map = new window.google.maps.Map(document.getElementById("map"), {
                center:{
                    lat: this.lat,
                    lng: this.lng
                },
                zoom: 13,
                streetViewControl: false
            })
        },
        loadLocation(){
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(
                    pos => {
                        this.lat = pos.coords.latitude
                        this.lng = pos.coords.longitude
                        this.renderMap()
                    },
                    err => {
                        console.log(err)
                    },
                    {
                        maximumAge: 60000,
                        timeout: 3000
                    }
                );
            }
            else {
                this.renderMap()
            }
        },
        initialize(type){
            this.loadLocation()
            if(type==="global"){
                this.loadGlobalHeatMapData() //vratis promise i onda rokas dalje sa then i nema MUKOTRPNIH asinkronih problema :D
                    .then(() => this.loadHeatMap())
                    .then(() => this.setHeatMapToMap())
            }
            else if(type==="yours"){
                this.loadYoursHeatMapData()
                    .then(() => this.loadHeatMap())
                    .then(() => this.setHeatMapToMap())
            }
        }
    },
    mounted(){
        this.initialize("global")
    }
}
</script>

<style lang="scss" scoped>
.google-map {
    width: 70%;
    height: 65%;
    position: absolute;
}
.btn-group button{
    border-radius: 0px !important;
}
</style>