import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize client Firebase app if needed (though firebaseAdmin is used on server, Next.js handles it fine)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export interface DecodedUser {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  image?: string; // Alias for compatibility with database image storage
}

/**
 * Decodes the Firebase ID token from the Request headers without using the Admin SDK.
 * Parses the JWT token payload structure natively.
 */
export async function getFirebaseRequestUser(req: Request): Promise<DecodedUser | null> {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    
    // Support decoding in both standard Node and Edge runtime environments
    let decodedJson = "";
    if (typeof Buffer !== "undefined") {
      decodedJson = Buffer.from(payload, "base64").toString("utf-8");
    } else {
      decodedJson = atob(payload);
    }
    
    const decoded = JSON.parse(decodedJson);

    // Firebase standard claims: 'user_id' or 'sub' holds the unique UID
    const uid = decoded.user_id || decoded.sub;
    if (!uid) return null;

    return {
      uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      image: decoded.picture, // Map picture claim directly to image field
    };
  } catch (error) {
    console.error("Error decoding firebase request token:", error);
    return null;
  }
}