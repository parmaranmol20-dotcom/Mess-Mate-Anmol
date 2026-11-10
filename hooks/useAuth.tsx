"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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
import { auth, db, googleProvider, isFirebaseConfigured } from "@/lib/firebase";
import { UserProfile, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  isDemoSession: boolean;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (name: string, email: string, pass: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  signOutUser: () => Promise<void>;
  loginAsDemo: (role?: UserRole) => void;
  updateLocalProfile: (updates: Partial<UserProfile>) => void;
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

  // Restore stored demo session on refresh if any
  useEffect(() => {
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
  }, []);

  // Firebase auth state listener
  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsDemoSession(false);
        try {
          if (db) {
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              setProfile(userDoc.data() as UserProfile);
            } else {
              // Create new user profile in Firestore
              const newProfile: UserProfile = {
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
              await setDoc(userDocRef, newProfile);
              setProfile(newProfile);
            }
          }
        } catch (err) {
          console.error("Error retrieving user profile from Firestore:", err);
          // Fallback basic profile
          setProfile({
            uid: currentUser.uid,
            name: currentUser.displayName || currentUser.email?.split("@")[0] || "Student",
            email: currentUser.email || "",
            photoURL: currentUser.photoURL || undefined,
            role: "student",
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        // If not in demo mode, clear profile
        if (!localStorage.getItem("messmate_demo_user")) {
          setProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real Google Sign In Flow
  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    if (!auth || !googleProvider || !isFirebaseConfigured) {
      // Auto-fallback to rich demo login if credentials missing
      loginAsDemo("student");
      return {
        success: true,
        error: "Firebase keys not set in .env.local; switched to interactive demo session.",
      };
    }

    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const authedUser = result.user;

      if (db) {
        const userDocRef = doc(db, "users", authedUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          const newProfile: UserProfile = {
            uid: authedUser.uid,
            name: authedUser.displayName || "Student",
            email: authedUser.email || "",
            photoURL: authedUser.photoURL || undefined,
            role: "student",
            college: "DBS Global University",
            pgAddress: "Dehradun PG Area",
            createdAt: new Date().toISOString(),
          };
          await setDoc(userDocRef, newProfile);
          setProfile(newProfile);
        } else {
          setProfile(userDoc.data() as UserProfile);
        }
      }
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to sign in with Google";
      console.error("Google sign in error:", err);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Real Email & Password Login
  const signInWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!auth || !isFirebaseConfigured) {
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
        const userDocRef = doc(db, "users", res.user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
      }
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Invalid email or password.";
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
    if (!auth || !isFirebaseConfigured) {
      const demoUser: UserProfile = {
        ...DEMO_STUDENT,
        name,
        email,
        role,
      };
      setProfile(demoUser);
      setIsDemoSession(true);
      localStorage.setItem("messmate_demo_user", JSON.stringify(demoUser));
      return { success: true };
    }

    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(res.user, { displayName: name });

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
        await setDoc(doc(db, "users", res.user.uid), newProfile);
      }
      setProfile(newProfile);
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Registration failed";
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOutUser = async () => {
    if (auth && isFirebaseConfigured) {
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

  // Interactive Demo login helper for instant testing & evaluation
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
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isFirebaseConfigured,
        isDemoSession,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOutUser,
        loginAsDemo,
        updateLocalProfile,
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

