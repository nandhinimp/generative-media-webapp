import { initializeApp, getApps, getApp } from "firebase/app";
import { browserLocalPersistence, getAuth, GoogleAuthProvider, setPersistence, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const hasConfig = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

const app = typeof window !== "undefined" && hasConfig
  ? (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig))
  : undefined;

const auth = (app ? getAuth(app) : (null as unknown as Auth));
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });

if (app) {
  setPersistence(auth, browserLocalPersistence).catch(() => {
    // Persistence is best-effort.
  });
}

export { auth, googleProvider };