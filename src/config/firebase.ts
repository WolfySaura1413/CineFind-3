/**
 * Firebase configuration
 *
 * Initializes Firebase with credentials from environment variables.
 * Never commit API keys — use .env file locally.
 */

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_APP_ID || '',
};

// Validate that required Firebase config is present
function validateFirebaseConfig(): void {
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'appId',
  ] as const;

  const missing = requiredFields.filter(
    (field) => !firebaseConfig[field]
  );

  if (missing.length > 0) {
    console.error(
      `Firebase configuration incomplete. Missing: ${missing.join(', ')}. Check your .env file.`
    );
  }
}

validateFirebaseConfig();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth: Auth = getAuth(app);

// Set persistence to LOCAL (survives browser refresh)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.warn('Failed to set auth persistence:', error);
});

// Initialize Firestore
export const db: Firestore = getFirestore(app);

export default app;
