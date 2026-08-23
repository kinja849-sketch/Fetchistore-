"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { Loader2, AlertCircle } from "lucide-react";

export default function SSOCallbackPage() {
  const clerk = useClerk();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function processCallback() {
      try {
        if (clerk?.loaded) {
          await clerk.handleRedirectCallback({
            signInForceRedirectUrl: "/",
            signUpForceRedirectUrl: "/",
          });
          window.location.href = "/";
        }
      } catch (err: unknown) {
        const error = err as { message?: string };
        console.error("SSO Callback Error:", error);
        setErrorMsg(error.message || "Single sign-on authentication failed. Please try again.");
      }
    }
    processCallback();
  }, [clerk]);

  if (errorMsg) {
    return (
      <div className="h-[100dvh] bg-[#FFF9E9] flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm bg-white p-6 rounded-2xl border border-[#E3DEC3] shadow-xs">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#1B1C1C]">Authentication Error</h2>
          <p className="text-xs font-medium text-[#666B59] leading-relaxed">{errorMsg}</p>
          <Link
            href="/sign-in"
            className="inline-block w-full py-2.5 px-4 bg-[#56642B] text-white font-bold text-xs rounded-xl hover:bg-[#465322] transition-colors"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-[#FFF9E9] flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#56642B] animate-spin mx-auto" />
        <p className="text-sm font-semibold text-[#666B59]">Completing single sign-on...</p>
      </div>
    </div>
  );
}
