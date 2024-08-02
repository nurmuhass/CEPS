// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebase = {
  apiKey: "AIzaSyC4dIDk__zzcXOX9HUr3n7LUwX-OZW2KSA",
  authDomain: "i-report-fc213.firebaseapp.com",
  projectId: "i-report-fc213",
  storageBucket: "i-report-fc213.appspot.com",
  messagingSenderId: "795200266870",
  appId: "1:795200266870:web:2bf1039f06dcafed04f557",
  measurementId: "G-T1B7Y0GR5F"
};

// Initialize Firebase
const app = initializeApp(firebase);
const auth= initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  const db = getFirestore(app);
  const storage = getStorage(app);
  export { auth };
  export { db };
  export { storage };