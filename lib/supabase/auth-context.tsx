"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithEmail: (email: string, pass: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<{ error: Error | null }>;
  demoSignIn: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("fetchistore_demo_user");
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch {
          return null;
        }
      }
    }
    return null;
  });
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    let supabase: ReturnType<typeof createClient> | null = null;
    try {
      supabase = createClient();
    } catch {
      console.warn("Supabase credentials not configured; using local auth state.");
    }

    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      queueMicrotask(() => setLoading(false));
    }
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });
      if (error) throw error;
      setUser(data.user);
      setIsAuthModalOpen(false);
      return { error: null };
    } catch (err: unknown) {
      const error = err as Error;
      return { error };
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { full_name: name || email.split("@")[0] },
        },
      });
      if (error) throw error;
      if (data.user) {
        setUser(data.user);
      }
      setIsAuthModalOpen(false);
      return { error: null };
    } catch (err: unknown) {
      const error = err as Error;
      return { error };
    }
  };

  const demoSignIn = () => {
    const demoUser = {
      id: "demo-user-123",
      email: "alex.shopper@example.com",
      user_metadata: { full_name: "Alex Shopper" },
      app_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
    } as unknown as User;
    
    setUser(demoUser);
    localStorage.setItem("fetchistore_demo_user", JSON.stringify(demoUser));
    setIsAuthModalOpen(false);
  };

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore fallback
    }
    setUser(null);
    setSession(null);
    localStorage.removeItem("fetchistore_demo_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithEmail,
        signUpWithEmail,
        demoSignIn,
        signOut,
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
