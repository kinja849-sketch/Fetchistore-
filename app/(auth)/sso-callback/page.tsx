"use client";

import { useEffect, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

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
        setErrorMsg(error.message || "SSO Callback processing error");
        window.location.href = "/sign-in";
      }
    }
    processCallback();
  }, [clerk]);

  return (
    <div className="min-h-screen bg-[#FFF9E9] flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#56642B] animate-spin mx-auto" />
        <p className="text-sm font-semibold text-[#666B59]">Completing single sign-on...</p>
        {errorMsg && <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>}
      </div>
    </div>
  );
}
