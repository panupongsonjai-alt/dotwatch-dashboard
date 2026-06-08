import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBhNeVVNhJc_EpQezssrgJ2iCpugB2iFA8",
  authDomain: "dotwatch-4e9d1.firebaseapp.com",
  databaseURL: "https://dotwatch-4e9d1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dotwatch-4e9d1",
  storageBucket: "dotwatch-4e9d1.firebasestorage.app",
  messagingSenderId: "265279844898",
  appId: "1:265279844898:web:c3c820e55084725ea7d07b",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);