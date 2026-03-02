import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD49y7PR0x1CTfHVLyRBY1kE79-eKHDEbA",
  authDomain: "mental-health-tracker-innerhue.firebaseapp.com",
  projectId: "mental-health-tracker-innerhue",
  storageBucket: "mental-health-tracker-innerhue.appspot.com",
  messagingSenderId: "223782544936",
  appId: "1:223782544936:web:f39ad807b40d8a0456f71d",
  measurementId: "G-Z9P1MK83V1",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

export { app, auth };
export const db = getFirestore(app);