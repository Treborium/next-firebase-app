import { initializeApp, getApp, FirebaseOptions } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyDdA0izl7IP1I1gIfwwUUTBL9uw8F7R0iI',
  authDomain: 'nextfire-c0103.firebaseapp.com',
  projectId: 'nextfire-c0103',
  storageBucket: 'nextfire-c0103.appspot.com',
  messagingSenderId: '539615434928',
  appId: '1:539615434928:web:80033fb7c3dde26b52c375',
  measurementId: 'G-L9DCJPXQSP',
};

function createFirebaseApp(config) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}

const firebaseApp = createFirebaseApp(firebaseConfig);

export const auth = getAuth(firebaseApp)
export const googleAuthProvider = new GoogleAuthProvider();

export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
