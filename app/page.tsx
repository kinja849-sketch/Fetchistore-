"use client";

import { useUser } from "@clerk/nextjs";
import { useAuth } from "@/lib/supabase/auth-context";
import AuthenticatedFeed from "@/components/home/authenticated-feed";
import UnauthenticatedWelcome from "@/components/home/unauthenticated-welcome";

export default function Home() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { user: supabaseUser, loading: supabaseLoading } = useAuth();

  const isLoaded = clerkLoaded && !supabaseLoading;
  const isAuthenticated = !!clerkUser || !!supabaseUser;

  if (!isLoaded) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FFF9E9]">
        <div className="w-8 h-8 border-4 border-[#56642B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <AuthenticatedFeed /> : <UnauthenticatedWelcome />;
}
