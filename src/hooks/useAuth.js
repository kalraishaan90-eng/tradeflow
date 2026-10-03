import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '../firebaseConfig';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      // Don't treat popup-closed-by-user as a real error
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message);
        console.error('Google sign-in error:', err);
      }
    }
  };

  const signInWithGitHub = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message);
        console.error('GitHub sign-in error:', err);
      }
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      setError(err.message);
      console.error('Sign-out error:', err);
    }
  };

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithGitHub,
    signOut
  };
}
