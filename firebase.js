import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';



const firebaseConfig = {
  apiKey: "AIzaSyD49y7PR0x1CTfHVLyRBY1kE79-eKHDEbA",
  authDomain: "mental-health-tracker-innerhue.firebaseapp.com",
  projectId: "mental-health-tracker-innerhue",
  storageBucket: "mental-health-tracker-innerhue.firebasestorage.app",
  messagingSenderId: "223782544936",
  appId: "1:223782544936:web:f39ad807b40d8a0456f71d",
  measurementId: "G-Z9P1MK83V1"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


export { auth };