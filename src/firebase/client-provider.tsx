'use client';
import { ReactNode } from 'react';

import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

// This provider is responsible for initializing Firebase on the client side.
// It should be used as a wrapper around the root layout of the application.
// It ensures that Firebase is initialized only once.
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const { firebaseApp, auth, firestore } = initializeFirebase();

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
