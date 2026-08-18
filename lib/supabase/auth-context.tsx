"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export interface UserProfileData {
  fullName: string;
  avatarUrl: string;
  location: string;
  radiusKm: number;
  phone: string;
  bio: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfileData;
  loading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signInWithEmail: (email: string, pass: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<{ error: Error | null }>;
  demoSignIn: () => void;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfileData>) => void;
}

const DEFAULT_PROFILE: UserProfileData = {
  fullName: "",
  avatarUrl: "",
  location: "Greenpoint, NY",
  radiusKm: 5,
  phone: "+1 (555) 234-5678",
  bio: "Pre-loved fashion & sustainable home decor enthusiast.",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData>(DEFAULT_PROFILE);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Load local storage initial state on client mount to prevent SSR hydration mismatch
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("fetchistore_demo_user");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          queueMicrotask(() => setUser(parsedUser));
        } catch {}
      }
      const savedProfile = localStorage.getItem("fetchistore_user_profile");
      if (savedProfile) {
        try {
          const parsedProfile = JSON.parse(savedProfile);
          queueMicrotask(() => setUserProfile({ ...DEFAULT_PROFILE, ...parsedProfile }));
        } catch {}
      }
    }
  }, []);

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
        if (session?.user?.user_metadata?.full_name) {
          setUserProfile((prev) => ({
            ...prev,
            fullName: session.user.user_metadata.full_name,
            avatarUrl: session.user.user_metadata.avatar_url || prev.avatarUrl,
          }));
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user?.user_metadata?.full_name) {
          setUserProfile((prev) => ({
            ...prev,
            fullName: session.user.user_metadata.full_name,
            avatarUrl: session.user.user_metadata.avatar_url || prev.avatarUrl,
          }));
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      queueMicrotask(() => setLoading(false));
    }
  }, []);

  const updateProfile = (updates: Partial<UserProfileData>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...updates };
      if (typeof window !== "undefined") {
        localStorage.setItem("fetchistore_user_profile", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });
        if (error) throw error;
        setUser(data.user);
        if (data.user?.user_metadata?.full_name) {
          updateProfile({ fullName: data.user.user_metadata.full_name });
        }
      } else {
        // Local dev fallback when Supabase credentials are not set
        const displayName = email.split("@")[0];
        const localUser = {
          id: `user-${Date.now()}`,
          email,
          user_metadata: { full_name: displayName },
          app_metadata: {},
          aud: "authenticated",
          created_at: new Date().toISOString(),
        } as unknown as User;
        setUser(localUser);
        localStorage.setItem("fetchistore_demo_user", JSON.stringify(localUser));
        updateProfile({ fullName: displayName });
      }
      setIsAuthModalOpen(false);
      return { error: null };
    } catch (err: unknown) {
      const error = err as Error;
      return { error };
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
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
          if (name) updateProfile({ fullName: name });
        }
      } else {
        // Local dev fallback when Supabase credentials are not set
        const displayName = name || email.split("@")[0];
        const localUser = {
          id: `user-${Date.now()}`,
          email,
          user_metadata: { full_name: displayName },
          app_metadata: {},
          aud: "authenticated",
          created_at: new Date().toISOString(),
        } as unknown as User;
        setUser(localUser);
        localStorage.setItem("fetchistore_demo_user", JSON.stringify(localUser));
        if (name) updateProfile({ fullName: name });
      }
      setIsAuthModalOpen(false);
      return { error: null };
    } catch (err: unknown) {
      const error = err as Error;
      return { error };
    }
  };

  const demoSignIn = () => {
    const name = userProfile.fullName || "Authenticated User";
    const demoUser = {
      id: "demo-user-123",
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      user_metadata: { full_name: name },
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
        userProfile,
        loading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signInWithEmail,
        signUpWithEmail,
        demoSignIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      session: null,
      userProfile: DEFAULT_PROFILE,
      loading: false,
      isAuthModalOpen: false,
      openAuthModal: () => {},
      closeAuthModal: () => {},
      signInWithEmail: async () => ({ error: null }),
      signUpWithEmail: async () => ({ error: null }),
      demoSignIn: () => {},
      signOut: async () => {},
      updateProfile: () => {},
    };
  }
  return context;
}

