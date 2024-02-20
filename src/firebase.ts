import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCUf3INg2CNnjK-yGdOo7_LJrmXTPHcQBc",
  authDomain: "x-react-ddc01.firebaseapp.com",
  projectId: "x-react-ddc01",
  storageBucket: "x-react-ddc01.appspot.com",
  messagingSenderId: "326375790822",
  appId: "1:326375790822:web:9e1e85e82fa8e2dea3c327",
  measurementId: "G-YVZYX1XS9J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
