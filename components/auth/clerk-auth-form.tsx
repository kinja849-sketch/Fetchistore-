"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth as useSupabaseAuth } from "@/lib/supabase/auth-context";

interface ClerkAuthFormProps {
  initialMode?: "signin" | "signup";
  onSuccess?: () => void;
  isModal?: boolean;
}

export function ClerkAuthForm({ initialMode = "signin", onSuccess, isModal = false }: ClerkAuthFormProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const clerk = useClerk();
  const { demoSignIn } = useSupabaseAuth();

  // Suppress third-party Cloudflare Turnstile sandbox logs in local development
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const origError = console.error;
      const origWarn = console.warn;
      console.error = (...args: unknown[]) => {
        const msg = String(args[0] || "");
        if (msg.includes("clerk-captcha") || msg.includes("Turnstile") || msg.includes("about:blank") || msg.includes("sandboxed")) return;
        origError.apply(console, args);
      };
      console.warn = (...args: unknown[]) => {
        const msg = String(args[0] || "");
        if (msg.includes("clerk-captcha") || msg.includes("Turnstile") || msg.includes("about:blank") || msg.includes("sandboxed")) return;
        origWarn.apply(console, args);
      };
      return () => {
        console.error = origError;
        console.warn = origWarn;
      };
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      if (clerk?.loaded && clerk?.client?.signIn) {
        const result = await clerk.client.signIn.create({
          identifier: email,
          password,
        });

        if (result.status === "complete" && result.createdSessionId) {
          await clerk.setActive({ session: result.createdSessionId });
          if (onSuccess) onSuccess();
          else window.location.href = "/";
          return;
        } else {
          setErrorMsg("Authentication incomplete. Please check your credentials.");
        }
      } else {
        demoSignIn();
        if (onSuccess) onSuccess();
        else window.location.href = "/";
      }
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string }>; message?: string };
      setErrorMsg(error.errors?.[0]?.message || error.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      if (clerk?.loaded && clerk?.client?.signUp) {
        const result = await clerk.client.signUp.create({
          emailAddress: email,
          password,
        });

        if (result.status === "complete" && result.createdSessionId) {
          await clerk.setActive({ session: result.createdSessionId });
          if (onSuccess) onSuccess();
          else window.location.href = "/";
          return;
        } else if (result.status === "missing_requirements") {
          await clerk.client.signUp.prepareEmailAddressVerification({ strategy: "email_code" });
          setPendingVerification(true);
        } else {
          setErrorMsg("Account creation incomplete. Please try again.");
        }
      } else {
        demoSignIn();
        if (onSuccess) onSuccess();
        else window.location.href = "/";
      }
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string }>; message?: string };
      setErrorMsg(error.errors?.[0]?.message || error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      if (clerk?.loaded && clerk?.client?.signUp) {
        const completeSignUp = await clerk.client.signUp.attemptEmailAddressVerification({
          code: verificationCode,
        });
        if (completeSignUp.status === "complete" && completeSignUp.createdSessionId) {
          await clerk.setActive({ session: completeSignUp.createdSessionId });
          if (onSuccess) onSuccess();
          else window.location.href = "/";
        } else {
          setErrorMsg("Verification failed. Please check the code and try again.");
        }
      }
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message: string }>; message?: string };
      setErrorMsg(error.errors?.[0]?.message || error.message || "Verification code invalid.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg("");
    try {
      if (clerk?.loaded && clerk?.client) {
        if (mode === "signin") {
          await clerk.client.signIn.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/",
          });
        } else {
          await clerk.client.signUp.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/",
          });
        }
      } else {
        demoSignIn();
        if (onSuccess) onSuccess();
        else window.location.href = "/";
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMsg(error.message || "Google authentication failed.");
    }
  };

  return (
    <div className={`w-full ${isModal ? "" : "min-h-screen bg-[#FFF9E9] flex flex-col items-center justify-center p-3 sm:p-5"}`}>
      <div className={`w-full max-w-[400px] mx-auto bg-[#FFF9E9] ${isModal ? "p-0" : "px-2 py-1"}`}>
        {/* Clean 3D Character Illustration (No printed text or logo in image) */}
        <div className="w-full relative h-[260px] sm:h-[290px] mb-1">
          <Image
            src={mode === "signin" ? "/images/auth/sign-in-clean-illustration.jpg" : "/images/auth/sign-up-clean-illustration.jpg"}
            alt={mode === "signin" ? "Fetchistore Sign In Character Illustration" : "Fetchistore Sign Up Character Illustration"}
            fill
            priority
            className="object-contain object-bottom"
          />
        </div>

        {/* Brand Header */}
        <div className="text-center mt-1 mb-5">
          {/* Single Organic 2-Leaf Icon */}
          <div className="flex items-center justify-center mb-0.5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#56642B]">
              <path d="M12 21V12" stroke="#56642B" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 12C9.5 12 7.5 9.5 7.5 6C11 6 12 8.5 12 12Z" fill="#56642B" />
              <path d="M12 12C14.5 12 16.5 9.5 16.5 6C13 6 12 8.5 12 12Z" fill="#56642B" />
            </svg>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#56642B] tracking-tight font-serif">
            Fetchistore
          </h2>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2C302E] mt-1 tracking-tight">
            {mode === "signin" ? "Welcome Back" : "Create Your Account"}
          </h3>

          <p className="text-xs sm:text-sm text-[#666B59] font-medium mt-1 px-2 leading-relaxed">
            {mode === "signin"
              ? "Sign in to continue your style journey."
              : "Join our community for exclusive style, early access and personal edits."}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 text-xs font-semibold text-[#ba1a1a] bg-red-50 border border-red-200 rounded-2xl text-center">
            {errorMsg}
          </div>
        )}

        {/* Pending Email Code Verification View */}
        {pendingVerification ? (
          <form onSubmit={handleVerifyCode} className="space-y-3.5">
            <div className="text-center mb-2">
              <p className="text-xs font-medium text-[#46483C]">
                We sent a 6-digit verification code to <span className="font-bold text-[#1B1C1C]">{email}</span>
              </p>
            </div>
            <div>
              <input
                type="text"
                required
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 bg-white border border-[#E3DEC3] rounded-2xl text-center text-lg font-bold tracking-widest text-[#1B1C1C] focus:ring-2 focus:ring-[#56642B] focus:border-transparent outline-none transition-all shadow-xs"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#56642B] hover:bg-[#465322] active:scale-[0.99] text-white font-bold text-sm rounded-2xl transition-all shadow-xs flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <span>Verify & Complete</span>}
            </button>
          </form>
        ) : (
          /* Standard Auth Form */
          <form onSubmit={mode === "signin" ? handleSignIn : handleSignUp} className="space-y-3">
            {/* Clerk Custom Flow Bot Protection CAPTCHA Mount Point */}
            <div id="clerk-captcha" className="hidden" />

            {/* Email Field */}
            <div className="relative flex items-center bg-white border border-[#E3DEC3] rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#56642B] focus-within:border-transparent transition-all shadow-xs">
              <Mail size={18} className="text-[#888D79] shrink-0 mr-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-transparent outline-none text-sm font-medium text-[#2C302E] placeholder-[#9CA3AF]"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="relative flex items-center bg-white border border-[#E3DEC3] rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#56642B] focus-within:border-transparent transition-all shadow-xs">
                <Lock size={18} className="text-[#888D79] shrink-0 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-transparent outline-none text-sm font-medium text-[#2C302E] placeholder-[#9CA3AF]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#888D79] hover:text-[#2C302E] transition-colors ml-2 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Forgot Password Link on Sign In */}
              {mode === "signin" && (
                <div className="text-right mt-1.5">
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setErrorMsg("Password reset email feature: Please use Clerk dashboard or sign in with Google.");
                    }}
                    className="text-xs font-medium text-[#666B59] hover:text-[#2C302E] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-1 bg-[#56642B] hover:bg-[#465322] active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-2xl transition-all shadow-xs flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
              )}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E3DEC3]" />
          </div>
          <span className="relative bg-[#FFF9E9] px-3 text-xs font-medium text-[#666B59]">
            {mode === "signin" ? "or continue with" : "or"}
          </span>
        </div>

        {/* Single Google Social SSO Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full py-3 bg-white border border-[#E3DEC3] hover:bg-gray-50 active:scale-[0.99] text-[#2C302E] font-bold text-sm rounded-2xl transition-all shadow-xs flex items-center justify-center space-x-3 cursor-pointer"
        >
          {/* Google Multicolor SVG */}
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          <span>Google</span>
        </button>

        {/* Toggle Mode Footer Link */}
        <div className="mt-5 text-center text-xs font-semibold text-[#666B59]">
          {mode === "signin" ? (
            <p>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMsg("");
                }}
                className="font-bold text-[#A65B32] hover:underline cursor-pointer ml-0.5"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrorMsg("");
                }}
                className="font-bold text-[#A65B32] hover:underline cursor-pointer ml-0.5"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

        {/* Sign Up Terms Footer */}
        {mode === "signup" && (
          <div className="mt-3.5 text-center text-xs font-semibold text-[#A65B32] space-x-1">
            <a href="#" className="underline hover:text-[#2C302E]">
              Terms
            </a>
            <span className="text-[#666B59]">&</span>
            <a href="#" className="underline hover:text-[#2C302E]">
              Privacy
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
