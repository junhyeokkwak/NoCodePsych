import firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth } from "firebase/auth"
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDX77kloKRrzU-nWWZ5SlPL8rxrdiO0ByU",
  authDomain: "yale-wrapped.firebaseapp.com",
  projectId: "yale-wrapped",
  storageBucket: "yale-wrapped.appspot.com",
  messagingSenderId: "865985230937",
  appId: "1:865985230937:web:7dbd5cf6d0a90b3c2a9948",
};
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };
// try {
//   initializeApp(firebaseConfig);
// } catch (err) {
//   if (!/already exists/.test(err.message)) {
//     console.error("Firebase initialization error", err.stack);
//   }
// }
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
connectFirestoreEmulator(db, 'localhost', 8080); // make sure this matches firebase.json

const auth = getAuth(app);
export { app, db, auth };
// const now = firebase.firestore.Timestamp.now();
// const storage = firebase.storage();
// const fire = firebase;
// const googleProvider = new fire.auth.GoogleAuthProvider();
// export { app, auth, db, now, storage, actionCodeSettings, googleProvider };
// export default fire;
