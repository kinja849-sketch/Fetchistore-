import { ClerkAuthForm } from "@/components/auth/clerk-auth-form";

export const metadata = {
  title: "Create Account — Fetchistore",
  description: "Join our community for exclusive style, early access and personal edits.",
};

export default function SignUpPage() {
  return <ClerkAuthForm initialMode="signup" />;
}
