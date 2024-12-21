import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAnOeC_JzK_e9ywWVYMN1qAevq1_rquZF4",
  authDomain: "tadorado-tailors.firebaseapp.com",
  projectId: "tadorado-tailors",
  storageBucket: "tadorado-tailors.firebasestorage.app",
  messagingSenderId: "902428178297",
  appId: "1:902428178297:web:d58b86321452bbf66821a8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Storage
export const storage = getStorage(app);
