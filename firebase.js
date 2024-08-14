// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore";  // Make sure to add this import

const firebaseConfig = {
  apiKey: "AIzaSyBmnAY2R6Phi_QTd9Q5kh90NxaXx5gkyC0",
  authDomain: "flashcard-saas-ecd70.firebaseapp.com",
  projectId: "flashcard-saas-ecd70",
  storageBucket: "flashcard-saas-ecd70.appspot.com",
  messagingSenderId: "31191270260",
  appId: "1:31191270260:web:4041381f3730674a7b6221",
  measurementId: "G-N45JPV3Y7C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export default db;
