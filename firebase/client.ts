// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase-admin/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyNxhaDLRzEoUypz_HKApzcDd3VPsyS1k",
  authDomain: "vantageai-9829b.firebaseapp.com",
  projectId: "vantageai-9829b",
  storageBucket: "vantageai-9829b.firebasestorage.app",
  messagingSenderId: "692466332426",
  appId: "1:692466332426:web:44edb0dcdba26595b0c0f3"
};

// Initialize Firebase
const app =!getApps.length?initializeApp(firebaseConfig):getApp()
export const auth=getAuth(app)
export const db=getFirestore(app)
