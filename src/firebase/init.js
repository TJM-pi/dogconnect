import firebase from 'firebase'


var firebaseConfig = {
    apiKey: "AIzaSyCFk697SjTTyJs_I8uygd4Zsm38AVOjx6s",
    authDomain: "dogconnect-361de.firebaseapp.com",
    databaseURL: "https://dogconnect-361de.firebaseio.com",
    projectId: "dogconnect-361de",
    storageBucket: "dogconnect-361de.appspot.com",
    messagingSenderId: "328701303921",
    appId: "1:328701303921:web:316b61d645930b99694fd0",
    measurementId: "G-4RJZLD54V0"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);

firebase.analytics();

export default firebaseApp.firestore()