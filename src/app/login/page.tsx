"use client";

import { useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Pin } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ApiRequestError } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/";
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.push(redirect);
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 403 && /verify/i.test(err.message)) {
        // Not verified yet — send them to finish OTP verification, carrying
        // the redirect along so they land back where they started.
        router.push(
          `/verify-otp?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirect)}`
        );
        return;
      }
      setError(err instanceof Error ? err.message : "Could not log in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-5 py-16 board-texture">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Pin className="text-marker" size={20} />
          <span className="font-display text-3xl text-chalk">Dorm & Dine</span>
        </Link>

        <div className="bg-paper text-ink p-8 torn-top shadow-xl">
          <h1 className="font-display text-3xl text-center mb-1">Welcome back</h1>
          <p className="text-sm text-ink/60 text-center mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-wide text-ink/60">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border border-ink/15 rounded-sm px-3 py-2 text-sm bg-white/60 focus:outline-none focus:ring-2 focus:ring-board"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wide text-ink/60">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-marker hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-ink/15 rounded-sm px-3 py-2 text-sm bg-white/60 focus:outline-none focus:ring-2 focus:ring-board"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-marker bg-marker/10 border border-marker/20 rounded-sm px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-board text-chalk font-medium py-2.5 rounded-sm hover:brightness-110 transition disabled:opacity-50"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-sm text-center text-ink/60 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="text-marker font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}