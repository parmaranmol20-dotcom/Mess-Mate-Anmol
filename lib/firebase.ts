import { initializeApp, getApps, getApp, FirebaseApp, deleteApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

export interface FirebaseCredentials {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export function getEnvFirebaseCredentials(): FirebaseCredentials {
  return {
    apiKey: (process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "").trim(),
    authDomain: (process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "").trim(),
    projectId: (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "").trim(),
    storageBucket: (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "").trim(),
    messagingSenderId: (process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "").trim(),
    appId: (process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "").trim(),
  };
}

export function getCustomFirebaseCredentials(): FirebaseCredentials | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("messmate_custom_firebase_credentials");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.apiKey && parsed.projectId) {
      return {
        apiKey: String(parsed.apiKey).trim(),
        authDomain: String(parsed.authDomain || "").trim() || `${parsed.projectId}.firebaseapp.com`,
        projectId: String(parsed.projectId).trim(),
        storageBucket: String(parsed.storageBucket || "").trim() || `${parsed.projectId}.appspot.com`,
        messagingSenderId: String(parsed.messagingSenderId || "").trim(),
        appId: String(parsed.appId || "").trim(),
      };
    }
  } catch (err) {
    console.warn("Failed to parse custom Firebase credentials from storage:", err);
  }
  return null;
}

export function getEffectiveFirebaseCredentials(): {
  credentials: FirebaseCredentials;
  source: "env" | "custom" | "demo";
  isConfigured: boolean;
} {
  const envCreds = getEnvFirebaseCredentials();
  if (
    envCreds.apiKey &&
    envCreds.projectId &&
    envCreds.apiKey !== "demo-api-key-messmate-preview" &&
    envCreds.projectId !== "messmate-demo"
  ) {
    return {
      credentials: envCreds,
      source: "env",
      isConfigured: true,
    };
  }

  const customCreds = getCustomFirebaseCredentials();
  if (customCreds && customCreds.apiKey && customCreds.projectId) {
    return {
      credentials: customCreds,
      source: "custom",
      isConfigured: true,
    };
  }

  return {
    credentials: {
      apiKey: "demo-api-key-messmate-preview",
      authDomain: "messmate-demo.firebaseapp.com",
      projectId: "messmate-demo",
      storageBucket: "messmate-demo.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:1234567890:web:demoapppreview",
    },
    source: "demo",
    isConfigured: false,
  };
}

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let googleProvider: GoogleAuthProvider | undefined;
let isFirebaseConfigured: boolean = false;

export function initFirebase(customCreds?: FirebaseCredentials) {
  const effective = customCreds
    ? { credentials: customCreds, source: "custom" as const, isConfigured: true }
    : getEffectiveFirebaseCredentials();

  isFirebaseConfigured = effective.isConfigured;

  try {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      app = existingApps[0];
    } else {
      app = initializeApp(effective.credentials);
    }

    if (app) {
      auth = getAuth(app);
      try {
        db = getFirestore(app);
      } catch (e) {
        console.warn("Firestore initialization notice:", e);
      }
      googleProvider = new GoogleAuthProvider();
      googleProvider.setCustomParameters({ prompt: "select_account" });
    }
  } catch (err) {
    console.warn("Firebase initialization notice:", err);
  }

  return { app, auth, db, googleProvider, isFirebaseConfigured };
}

export async function reinitializeFirebaseWithConfig(creds: FirebaseCredentials) {
  if (typeof window === "undefined") return false;
  try {
    const existingApps = getApps();
    for (const a of existingApps) {
      await deleteApp(a);
    }

    app = initializeApp(creds);
    auth = getAuth(app);
    try {
      db = getFirestore(app);
    } catch (e) {
      console.warn("Firestore reinit warning:", e);
    }
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });
    isFirebaseConfigured = true;

    localStorage.setItem("messmate_custom_firebase_credentials", JSON.stringify(creds));
    return true;
  } catch (err) {
    console.error("Failed to reinitialize Firebase with custom config:", err);
    throw err;
  }
}

export async function clearCustomFirebaseConfig() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("messmate_custom_firebase_credentials");
  const existingApps = getApps();
  for (const a of existingApps) {
    await deleteApp(a);
  }
  initFirebase();
}

// Initial bootstrap
if (typeof window !== "undefined" || process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  initFirebase();
}

export { app, auth, db, googleProvider, isFirebaseConfigured };
