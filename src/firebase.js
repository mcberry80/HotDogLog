import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCISZB8UfM4XpAdaLHZS-dVLwnaRAW7DZI",
  authDomain: "userdata-ad96d.firebaseapp.com",
  projectId: "userdata-ad96d",
  storageBucket: "userdata-ad96d.appspot.com",
  messagingSenderId: "1035408154540",
  appId: "1:1035408154540:web:82e3516663d89c31436409"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const firestore = firebase.firestore();

export { firebase, auth, googleAuthProvider, firestore };

