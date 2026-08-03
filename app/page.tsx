"use client";

import { useUser } from "@clerk/nextjs";
import AuthenticatedFeed from "@/components/home/authenticated-feed";
import UnauthenticatedWelcome from "@/components/home/unauthenticated-welcome";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isSignedIn ? <AuthenticatedFeed /> : <UnauthenticatedWelcome />;
}
