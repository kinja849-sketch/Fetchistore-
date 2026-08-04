"use client";

import React, { useState } from "react";
import { X, Mail, Lock, User as UserIcon, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/supabase/auth-context";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signInWithEmail, signUpWithEmail, demoSignIn } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    if (tab === "signin") {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setErrorMsg(error.message || "Failed to sign in. Please try again.");
      }
    } else {
      const { error } = await signUpWithEmail(email, password, name);
      if (error) {
        setErrorMsg(error.message || "Failed to sign up. Please try again.");
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close auth dialog"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand/10 text-brand mb-3">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {tab === "signup" ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {tab === "signup"
              ? "Sign up to explore nearby second-hand & new goods"
              : "Sign in to access your orders, cart and favorite items"}
          </p>
        </div>

        {/* Auth Tabs */}
        <div className="grid grid-cols-2 p-1 mb-6 bg-gray-100 rounded-2xl text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => {
              setTab("signup");
              setErrorMsg("");
            }}
            className={`py-2.5 rounded-xl transition-all ${
              tab === "signup"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              setTab("signin");
              setErrorMsg("");
            }}
            className={`py-2.5 rounded-xl transition-all ${
              tab === "signin"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Sign In
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <UserIcon size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name (e.g. Sarah Connor)"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-brand text-white rounded-xl font-semibold text-sm hover:bg-brand-dark transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-brand/20 disabled:opacity-50"
          >
            <span>{tab === "signup" ? "Create Account" : "Sign In"}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <span className="relative bg-white px-3 text-xs text-gray-400 uppercase font-medium">
            Or quick start
          </span>
        </div>

        {/* Quick Demo Login */}
        <button
          onClick={demoSignIn}
          type="button"
          className="w-full py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-medium text-xs hover:bg-emerald-100 transition-colors flex items-center justify-center space-x-2"
        >
          <Sparkles size={16} />
          <span>Continue as Demo User (1-Click)</span>
        </button>
      </div>
    </div>
  );
}
