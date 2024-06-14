//FirebaseExports.ts
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Firebase Keys
const key1 = process.env.NEXT_PUBLIC_FIREBASE_APIKEY;
const key2 = process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN;
const key3 = process.env.NEXT_PUBLIC_FIREBASE_PROJECTID;
const key4 = process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET;
const key5 = process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID;
const key6 = process.env.NEXT_PUBLIC_FIREBASE_APPID;
const key7 = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID;

// Initialize Firebase
const firebaseConfig = {
  apiKey: key1,
  authDomain: key2,
  projectId: key3,
  storageBucket: key4,
  messagingSenderId: key5,
  appId: key6,
  measurementId: key7,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage };