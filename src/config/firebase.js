// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyALt6EBNWJ0o7XC3wbzQ6Ylv6oNqSh8E7A",
  authDomain: "chat-app-92e40.firebaseapp.com",
  projectId: "chat-app-92e40",
  storageBucket: "chat-app-92e40.appspot.com",
  messagingSenderId: "696462830717",
  appId: "1:696462830717:web:bbcb8fc279c1d316a95514",
  databaseURL: "https://chat-app-92e40-default-rtdb.firebaseio.com/",
  measurementId: "G-5VL849VMG2",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
// const database = firebase.database();

export default firebase;
