import { ClerkAuthForm } from "@/components/auth/clerk-auth-form";

export const metadata = {
  title: "Sign In — Fetchistore",
  description: "Sign in to continue your style journey with Fetchistore.",
};

export default function SignInPage() {
  return <ClerkAuthForm initialMode="signin" />;
}
