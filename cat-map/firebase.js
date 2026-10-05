
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBm4zHG4OsX3ql3oItk3AILSwbvOpge-k4",
  authDomain: "qu-cats-map.firebaseapp.com",
  projectId: "qu-cats-map",
  storageBucket: "qu-cats-map.firebasestorage.app",
  messagingSenderId: "1070969621910",
  appId: "1:1070969621910:web:67199bf212e602e10821b7",
  measurementId: "G-FKH3TLZYL2"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export {
  db,
  collection,
  addDoc
};