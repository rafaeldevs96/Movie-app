// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcElEhZii6SAyDRIwBr9rA57aphUCEcuE",
  authDomain: "movie-app-da8ac.firebaseapp.com",
  projectId: "movie-app-da8ac",
  storageBucket: "movie-app-da8ac.firebasestorage.app",
  messagingSenderId: "301854822932",
  appId: "1:301854822932:web:ca4405870c3eec2dc14d01",
  measurementId: "G-RF3V840DDC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {app}