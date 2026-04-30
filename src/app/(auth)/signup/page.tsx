"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white p-8 shadow-sm border border-gray-100 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#0a0a0a]">Check your email</h2>
          <p className="mt-2 text-sm text-gray-500">
            We sent a confirmation link to <strong>{email}</strong>. Please verify your email to continue.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block text-sm font-medium text-[#0a0a0a] underline underline-offset-2 hover:text-[#c9a84c]"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white p-8 shadow-sm border border-gray-100">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#0a0a0a] tracking-tight">
            Create account
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Join Waqar Store for exclusive deals
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
            placeholder="Muhammad Ahmad"
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="••••••••"
            hint="Minimum 8 characters"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <Button type="submit" fullWidth loading={loading} className="mt-2">
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#0a0a0a] hover:text-[#c9a84c] transition-colors"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-4 text-center text-xs text-gray-400">
          By creating an account, you agree to our{" "}
          <Link href="/legal/terms" className="underline hover:text-[#c9a84c]">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="underline hover:text-[#c9a84c]">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
