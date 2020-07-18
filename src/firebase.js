import firebase from "firebase"

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyD_IEZn5NrtjFl4wLLiNMjOz_PuYgmQg5Y",
    authDomain: "instagram-clone-e0aec.firebaseapp.com",
    databaseURL: "https://instagram-clone-e0aec.firebaseio.com",
    projectId: "instagram-clone-e0aec",
    storageBucket: "instagram-clone-e0aec.appspot.com",
    messagingSenderId: "741575691738",
    appId: "1:741575691738:web:73457daf1a2faa079f04e3",
    measurementId: "G-Y8JLJMWT6S"
})

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage() 

export { db, auth, storage };