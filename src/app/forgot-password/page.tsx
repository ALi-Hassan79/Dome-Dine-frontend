"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pin } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post("/auth/forgot-password", { email });
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Something went wrong.");
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
          <h1 className="font-display text-3xl text-center mb-1">Forgot password?</h1>
          <p className="text-sm text-ink/60 text-center mb-6">
            Enter your email and we&apos;ll send a code to reset it.
          </p>

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
              {submitting ? "Sending..." : "Send reset code"}
            </button>
          </form>

          <p className="text-sm text-center text-ink/60 mt-6">
            <Link href="/login" className="text-marker font-medium hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}