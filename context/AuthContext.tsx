"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { claimLegacyWorkspace } from "@/services/generation.service";

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function maybeClaimLegacyWorkspace(currentUser: User) {
    if (typeof window === "undefined") return;

    const cacheKey = `workspace:claimed:${currentUser.uid}`;
    try {
      if (localStorage.getItem(cacheKey)) return;
      await claimLegacyWorkspace();
      localStorage.setItem(cacheKey, "1");
    } catch (claimError) {
      console.error("Legacy workspace claim failed:", claimError);
    }
  }

  function toAuthMessage(err: unknown) {
    if (typeof err === "object" && err && "code" in err) {
      const code = String((err as { code?: string }).code || "");
      if (code === "auth/configuration-not-found") {
        return "Google sign-in is not enabled in the Firebase project yet. Enable the Google provider in Firebase Authentication, then try again.";
      }
      if (code === "auth/popup-closed-by-user") {
        return "Sign-in was cancelled.";
      }
    }

    if (err instanceof Error && err.message) {
      return err.message;
    }

    return "Failed to sign in with Google.";
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);

        if (currentUser) {
          void maybeClaimLegacyWorkspace(currentUser);
        }
      },
      (err) => {
        console.error("Auth state change error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      console.error("Login failed:", err);
      setError(toAuthMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      await signOut(auth);
    } catch (err: unknown) {
      console.error("Logout failed:", err);
      setError(err instanceof Error ? err.message : "Failed to log out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}