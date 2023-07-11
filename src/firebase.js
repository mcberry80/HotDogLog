import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

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
const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth();
const googleAuthProvider = new GoogleAuthProvider();
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { firebaseApp, auth, googleAuthProvider, firestore, storage };
