import { FirebaseOptions } from '@firebase/app';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.FIREBASE_API_KEY!,
  authDomain: 'nextfire-c0103.firebaseapp.com',
  projectId: 'nextfire-c0103',
  storageBucket: 'nextfire-c0103.appspot.com',
  messagingSenderId: '539615434928',
  appId: '1:539615434928:web:80033fb7c3dde26b52c375',
  measurementId: 'G-L9DCJPXQSP',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();
export const storage = firebase.storage();
