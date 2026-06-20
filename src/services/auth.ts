/**
 * Authentication service layer
 *
 * Implements Firebase Auth calls for sign up, sign in, sign out, etc.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/config/firebase';

export interface AuthUser {
  id: string;
  email: string;
  createdAt: Date;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Convert Firebase User to AuthUser
 */
function firebaseUserToAuthUser(fbUser: FirebaseUser): AuthUser {
  return {
    id: fbUser.uid,
    email: fbUser.email || '',
    createdAt: fbUser.metadata?.creationTime || new Date(),
  };
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(credentials: AuthCredentials): Promise<AuthUser> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    return firebaseUserToAuthUser(userCredential.user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      const message = getAuthErrorMessage(error.message);
      throw new Error(message);
    }
    throw new Error('Sign up failed');
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(credentials: AuthCredentials): Promise<AuthUser> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    return firebaseUserToAuthUser(userCredential.user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      const message = getAuthErrorMessage(error.message);
      throw new Error(message);
    }
    throw new Error('Sign in failed');
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error: unknown) {
    if (error instanceof Error) {
      const message = getAuthErrorMessage(error.message);
      throw new Error(message);
    }
    throw new Error('Sign out failed');
  }
}

/**
 * Get the currently authenticated user (promise-based)
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        unsubscribe();
        if (firebaseUser) {
          resolve(firebaseUserToAuthUser(firebaseUser));
        } else {
          resolve(null);
        }
      },
      reject
    );
  });
}

/**
 * Listen to auth state changes (real-time)
 */
export function onAuthStateChange(
  callback: (user: AuthUser | null) => void
): () => void {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(firebaseUserToAuthUser(firebaseUser));
    } else {
      callback(null);
    }
  });
}

/**
 * Reset password for a user email
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: unknown) {
    if (error instanceof Error) {
      const message = getAuthErrorMessage(error.message);
      throw new Error(message);
    }
    throw new Error('Password reset failed');
  }
}

/**
 * Map Firebase auth error messages to user-friendly strings
 */
function getAuthErrorMessage(firebaseErrorMessage: string): string {
  if (firebaseErrorMessage.includes('email-already-in-use')) {
    return 'Email is already in use. Please use a different email.';
  }
  if (firebaseErrorMessage.includes('weak-password')) {
    return 'Password is too weak. Use at least 6 characters.';
  }
  if (firebaseErrorMessage.includes('user-not-found')) {
    return 'User not found. Please check your email.';
  }
  if (firebaseErrorMessage.includes('wrong-password')) {
    return 'Incorrect password. Please try again.';
  }
  if (firebaseErrorMessage.includes('invalid-email')) {
    return 'Invalid email address.';
  }
  return 'Authentication failed. Please try again.';
}

export default {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  onAuthStateChange,
  resetPassword,
};

