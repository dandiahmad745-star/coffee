
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

import { firebaseConfig } from './config';
export { FirebaseProvider, useFirebaseApp, useAuth, useFirestore, useFirebase } from './provider';
export { FirebaseClientProvider } from './client-provider';
export { useUser } from './auth/use-user';


// Call this function to get the Firebase app instance.
export function initializeFirebase(): {
  firebaseApp: FirebaseApp,
  auth: Auth,
  firestore: Firestore,
} {
  const apps = getApps();
  const firebaseApp = apps.length ? apps[0] : initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  return { firebaseApp, auth, firestore };
}
