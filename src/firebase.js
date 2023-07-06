import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAy2CVm4p3HuzQvuiah1GvYB6vLii0KY0A",
  authDomain: "hotdoglog-4276e.firebaseapp.com",
  projectId: "hotdoglog-4276e",
  storageBucket: "hotdoglog-4276e.appspot.com",
  messagingSenderId: "650559031715",
  appId: "1:650559031715:web:1c0c8706ea00f3e6aeb216",
  measurementId: "G-BYFH8W08WB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const firestore = firebase.firestore();
const storage = firebase.storage();

export { firebase, auth, googleAuthProvider, firestore, storage };
