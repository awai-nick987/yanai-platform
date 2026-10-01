import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB_Z3gI4TATfqVl2C2JeS9GWMLyWN09FCs",
  authDomain: "yanai-platform-12be9.firebaseapp.com",
  projectId: "yanai-platform-12be9",
  storageBucket: "yanai-platform-12be9.firebasestorage.app",
  messagingSenderId: "932481440273",
  appId: "1:932481440273:web:8cbf9bd482b08c1f53afb0",
  measurementId: "G-NPM657JGX0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
