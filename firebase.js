import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBmnAY2R6Phi_QTd9Q5kh90NxaXx5gkyC0",
  authDomain: "flashcard-saas-ecd70.firebaseapp.com",
  projectId: "flashcard-saas-ecd70",
  storageBucket: "flashcard-saas-ecd70.appspot.com",
  messagingSenderId: "31191270260",
  appId: "1:31191270260:web:4041381f3730674a7b6221",
  measurementId: "G-N45JPV3Y7C"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
