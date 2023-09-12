// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

import { getFirestore } from '@firebase/firestore';
import { getDatabase, ref, set } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCJTvovwVoa2tEXGNaXZxr21KtARITFLoc',
  authDomain: 'packing-manager.firebaseapp.com',
  projectId: 'packing-manager',
  storageBucket: 'packing-manager.appspot.com',
  messagingSenderId: '19041306689',
  appId: '1:19041306689:web:4f881c75181d2d7a4a5ec0',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const firestore = getFiresStore(app);
export const firestore = getFirestore(app);
export const database = getDatabase(app);
