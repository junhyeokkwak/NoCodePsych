import firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuESEWuWNPXs8qA39A4vXvws0NzdO_j10",
  authDomain: "nocodepsych.firebaseapp.com",
  projectId: "nocodepsych",
  storageBucket: "nocodepsych.appspot.com",
  messagingSenderId: "303508408029",
  appId: "1:303508408029:web:b1956e2a952246b4147d34",
};

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: "https://www.example.com/finishSignUp?cartId=1234",
  // This must be true.
  handleCodeInApp: true,
  iOS: {
    bundleId: "com.example.ios",
  },
  android: {
    packageName: "com.example.android",
    installApp: true,
    minimumVersion: "12",
  },
  dynamicLinkDomain: "example.page.link",
};
const app = initializeApp(firebaseConfig);
// const auth = firebase.auth();
const db = getFirestore(app);
// connectFirestoreEmulator(db, "localhost", 8080); // make sure this matches firebase.json

const auth = getAuth(app);
export { app, db, auth };
// const now = firebase.firestore.Timestamp.now();
// const storage = firebase.storage();
// const fire = firebase;
// const googleProvider = new fire.auth.GoogleAuthProvider();
// export { app, auth, db, now, storage, actionCodeSettings, googleProvider };
// export default fire;
