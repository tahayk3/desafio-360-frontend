import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDAdxzp...",
  authDomain: "mueblesxela-d948d.firebaseapp.com",
  projectId: "mueblesxela-d948d",
  storageBucket: "mueblesxela-d948d.appspot.com",
  messagingSenderId: "923069492395",
  appId: "1:923069492395:web:8dc800148d8c2673eb1bee",
  measurementId: "G-E6SR0SYDHJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

