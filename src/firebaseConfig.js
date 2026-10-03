// Firebase Configuration for StockShadow
// ==========================================
// INSTRUCTIONS: Replace the placeholder values below with your actual
// Firebase project config from https://console.firebase.google.com/
// Go to: Project Settings → General → Your apps → Firebase SDK snippet
// ==========================================

import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMrxBLhlLYWpXIu_qAg9DsTglVQCJde9U",
  authDomain: "tradeflow-13116.firebaseapp.com",
  projectId: "tradeflow-13116",
  storageBucket: "tradeflow-13116.firebasestorage.app",
  messagingSenderId: "449134773850",
  appId: "1:449134773850:web:92c55b560ec0bd4fe0fa63",
  measurementId: "G-BRQ03KNV5H"
};

// Initialize Firebase
// NOTE: these values identify the project (not secrets). Real protection comes
// from firestore.rules + authorized domains — never from hiding the config.
const app = initializeApp(firebaseConfig);

const appCheckSiteKey = import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY;
if (import.meta.env.DEV || appCheckSiteKey) {
  if (import.meta.env.DEV) self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(appCheckSiteKey || 'local-debug'),
    isTokenAutoRefreshEnabled: true
  });
}

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);

// Initialize Cloud Firestore and export it
export const db = getFirestore(app);
export default app;
