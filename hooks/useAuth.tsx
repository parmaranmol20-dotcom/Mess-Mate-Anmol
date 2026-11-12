"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  auth,
  db,
  googleProvider,
  isFirebaseConfigured,
  getEffectiveFirebaseCredentials,
  reinitializeFirebaseWithConfig,
  clearCustomFirebaseConfig,
  FirebaseCredentials,
} from "@/lib/firebase";
import { UserProfile, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  firebaseConfigSource: "env" | "custom" | "default" | "demo";
  envCredentialsStatus: { [key: string]: boolean };
  isDemoSession: boolean;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (name: string, email: string, pass: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  signOutUser: () => Promise<void>;
  loginAsDemo: (role?: UserRole) => void;
  updateLocalProfile: (updates: Partial<UserProfile>) => void;
  configureCustomFirebase: (creds: FirebaseCredentials) => Promise<{ success: boolean; error?: string }>;
  resetFirebaseConfig: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_STUDENT: UserProfile = {
  uid: "demo-student-dbs-01",
  name: "Aarav Sharma",
  email: "aarav.sharma@dbs.edu.in",
  photoURL: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
  phone: "+91 98765 43210",
  role: "student",
  college: "DBS Global University",
  pgAddress: "Room 204, Devbhoomi Boys PG, Manduwala, Dehradun",
  createdAt: new Date().toISOString(),
};

const DEMO_ADMIN: UserProfile = {
  uid: "demo-admin-messmate",
  name: "Faculty Admin (MessMate Core)",
  email: "admin@messmate.in",
  photoURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
  phone: "+91 88590 12345",
  role: "admin",
  college: "DBS Global University",
  pgAddress: "MessMate HQ, Innovation Hub, DBS Dehradun",
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoSession, setIsDemoSession] = useState<boolean>(false);
  const [configSource, setConfigSource] = useState<"env" | "custom" | "default" | "demo">("default");
  const [configured, setConfigured] = useState<boolean>(false);
  const [envStatus, setEnvStatus] = useState<{ [key: string]: boolean }>({});

  // Sync config detection
  const syncConfigStatus = useCallback(() => {
    const effective = getEffectiveFirebaseCredentials();
    setConfigSource(effective.source);
    setConfigured(effective.isConfigured);

    if (typeof window !== "undefined") {
      setEnvStatus({
        NEXT_PUBLIC_FIREBASE_API_KEY: Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: Boolean(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: Boolean(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: Boolean(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
        NEXT_PUBLIC_FIREBASE_APP_ID: Boolean(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
      });
    }
  }, []);

  // Restore stored demo session on refresh if any
  useEffect(() => {
    syncConfigStatus();
    if (typeof window !== "undefined") {
      const storedDemo = localStorage.getItem("messmate_demo_user");
      if (storedDemo) {
        try {
          const parsed = JSON.parse(storedDemo);
          setProfile(parsed);
          setIsDemoSession(true);
        } catch {
          localStorage.removeItem("messmate_demo_user");
        }
      }
    }
  }, [syncConfigStatus]);

  // Firebase auth state listener
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsDemoSession(false);

        // Fallback default profile derived from real Google/Firebase auth
        let studentProfile: UserProfile = {
          uid: currentUser.uid,
          name: currentUser.displayName || currentUser.email?.split("@")[0] || "Student",
          email: currentUser.email || "",
          photoURL: currentUser.photoURL || undefined,
          phone: currentUser.phoneNumber || undefined,
          role: "student",
          college: "DBS Global University",
          pgAddress: "Manduwala PG Corridor, Dehradun",
          createdAt: new Date().toISOString(),
        };

        // Attempt Firestore persistence and fetch, but never let Firestore failure crash auth
        if (db) {
          try {
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              studentProfile = { ...studentProfile, ...(userDoc.data() as UserProfile) };
            } else {
              try {
                await setDoc(userDocRef, studentProfile);
              } catch (writeErr) {
                console.warn("Firestore user profile save notice (will use in-memory profile):", writeErr);
              }
            }
          } catch (err) {
            console.warn("Firestore profile read notice (will use Google profile):", err);
          }
        }

        setProfile(studentProfile);
      } else {
        if (typeof window !== "undefined" && !localStorage.getItem("messmate_demo_user")) {
          setProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [configured]);

  // Real Google OAuth Sign In Flow
  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    const effective = getEffectiveFirebaseCredentials();
    if (!effective.isConfigured || !auth || !googleProvider) {
      return {
        success: false,
        error:
          "FIREBASE_NOT_CONFIGURED: Firebase credentials are not set. Please add your Firebase configuration in the setup modal to enable real Google OAuth.",
      };
    }

    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const authedUser = result.user;

      let studentProfile: UserProfile = {
        uid: authedUser.uid,
        name: authedUser.displayName || authedUser.email?.split("@")[0] || "Student",
        email: authedUser.email || "",
        photoURL: authedUser.photoURL || undefined,
        phone: authedUser.phoneNumber || undefined,
        role: "student",
        college: "DBS Global University",
        pgAddress: "Manduwala / Kandoli PG Corridor, Dehradun",
        createdAt: new Date().toISOString(),
      };

      if (db) {
        try {
          const userDocRef = doc(db, "users", authedUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            studentProfile = { ...studentProfile, ...(userDoc.data() as UserProfile) };
          } else {
            try {
              await setDoc(userDocRef, studentProfile);
            } catch (wErr) {
              console.warn("Firestore initial user save notice:", wErr);
            }
          }
        } catch (dbErr) {
          console.warn("Firestore profile sync skipped (using Google OAuth profile):", dbErr);
        }
      }

      setUser(authedUser);
      setProfile(studentProfile);
      setIsDemoSession(false);
      return { success: true };
    } catch (err: unknown) {
      console.error("Google sign in error details:", err);
      let errorMsg = "Failed to sign in with Google.";

      const anyErr = err as { code?: string; message?: string };
      const code = anyErr?.code || "";

      if (code === "auth/unauthorized-domain") {
        const currentDomain = typeof window !== "undefined" ? window.location.hostname : "your Vercel domain";
        errorMsg = `Domain unauthorized: In Firebase Console, go to Authentication > Settings > Authorized domains, and add "${currentDomain}".`;
      } else if (code === "auth/popup-closed-by-user") {
        errorMsg = "Sign-in popup was closed before completing. Please try again.";
      } else if (code === "auth/popup-blocked") {
        errorMsg = "The sign-in popup was blocked by your browser. Please allow popups for this site and click Continue with Google again.";
      } else if (code === "auth/operation-not-allowed") {
        errorMsg = "Google Sign-In is disabled in your Firebase project. In Firebase Console, go to Authentication > Sign-in method, click Google, and enable it.";
      } else if (code === "auth/invalid-api-key" || code === "auth/api-key-not-valid") {
        errorMsg = "Invalid Firebase API Key. Please verify your NEXT_PUBLIC_FIREBASE_API_KEY.";
      } else if (code === "auth/cancelled-popup-request") {
        errorMsg = "Another authentication window is already open. Please complete or close it first.";
      } else if (code === "auth/network-request-failed") {
        errorMsg = "Network error while connecting to Google. Please check your internet connection.";
      } else if (anyErr?.message) {
        errorMsg = anyErr.message;
      }

      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Real Email & Password Login
  const signInWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const effective = getEffectiveFirebaseCredentials();
    if (!effective.isConfigured || !auth) {
      // Demo fallback
      if (email.toLowerCase().includes("admin")) {
        loginAsDemo("admin");
      } else {
        loginAsDemo("student");
      }
      return { success: true };
    }

    try {
      setLoading(true);
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (db) {
        try {
          const userDocRef = doc(db, "users", res.user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          }
        } catch (e) {
          console.warn("Firestore profile read notice:", e);
        }
      }
      return { success: true };
    } catch (err: unknown) {
      const anyErr = err as { code?: string; message?: string };
      let errorMsg = "Invalid email or password.";
      if (anyErr?.code === "auth/user-not-found" || anyErr?.code === "auth/wrong-password" || anyErr?.code === "auth/invalid-credential") {
        errorMsg = "Invalid email or password. Please verify your credentials or register.";
      } else if (anyErr?.message) {
        errorMsg = anyErr.message;
      }
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Real Email Registration
  const signUpWithEmail = async (
    name: string,
    email: string,
    pass: string,
    role: UserRole = "student"
  ): Promise<{ success: boolean; error?: string }> => {
    const effective = getEffectiveFirebaseCredentials();
    if (!effective.isConfigured || !auth) {
      const demoUser: UserProfile = {
        ...DEMO_STUDENT,
        name,
        email,
        role,
      };
      setProfile(demoUser);
      setIsDemoSession(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("messmate_demo_user", JSON.stringify(demoUser));
      }
      return { success: true };
    }

    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      try {
        await updateProfile(res.user, { displayName: name });
      } catch (upErr) {
        console.warn("Profile name update notice:", upErr);
      }

      const newProfile: UserProfile = {
        uid: res.user.uid,
        name,
        email,
        role,
        college: "DBS Global University",
        pgAddress: "Manduwala / Kandoli Area",
        createdAt: new Date().toISOString(),
      };

      if (db) {
        try {
          await setDoc(doc(db, "users", res.user.uid), newProfile);
        } catch (dbErr) {
          console.warn("Firestore profile write notice:", dbErr);
        }
      }
      setProfile(newProfile);
      return { success: true };
    } catch (err: unknown) {
      const anyErr = err as { code?: string; message?: string };
      let errorMsg = "Registration failed.";
      if (anyErr?.code === "auth/email-already-in-use") {
        errorMsg = "This email address is already registered. Please sign in instead.";
      } else if (anyErr?.code === "auth/weak-password") {
        errorMsg = "Password should be at least 6 characters long.";
      } else if (anyErr?.message) {
        errorMsg = anyErr.message;
      }
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOutUser = async () => {
    if (auth && configured) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error("Sign out error:", err);
      }
    }
    setUser(null);
    setProfile(null);
    setIsDemoSession(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("messmate_demo_user");
    }
  };

  // Interactive Demo login helper for instant evaluation
  const loginAsDemo = (role: UserRole = "student") => {
    const demoProfile = role === "admin" ? DEMO_ADMIN : DEMO_STUDENT;
    setProfile(demoProfile);
    setIsDemoSession(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("messmate_demo_user", JSON.stringify(demoProfile));
    }
  };

  const updateLocalProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      const updated = { ...profile, ...updates };
      setProfile(updated);
      if (isDemoSession && typeof window !== "undefined") {
        localStorage.setItem("messmate_demo_user", JSON.stringify(updated));
      }
      // If real Firebase Firestore is active, sync updates asynchronously
      if (db && user && !isDemoSession) {
        try {
          setDoc(doc(db, "users", user.uid), updates, { merge: true }).catch((e) =>
            console.warn("Async profile update notice:", e)
          );
        } catch (e) {
          console.warn("Firestore update notice:", e);
        }
      }
    }
  };

  // Configure custom Firebase credentials in browser
  const configureCustomFirebase = async (
    creds: FirebaseCredentials
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      await reinitializeFirebaseWithConfig(creds);
      syncConfigStatus();
      setLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setLoading(false);
      const msg = err instanceof Error ? err.message : "Failed to initialize Firebase credentials.";
      return { success: false, error: msg };
    }
  };

  // Reset custom Firebase config
  const resetFirebaseConfig = async () => {
    setLoading(true);
    await clearCustomFirebaseConfig();
    syncConfigStatus();
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isFirebaseConfigured: configured,
        firebaseConfigSource: configSource,
        envCredentialsStatus: envStatus,
        isDemoSession,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOutUser,
        loginAsDemo,
        updateLocalProfile,
        configureCustomFirebase,
        resetFirebaseConfig,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
