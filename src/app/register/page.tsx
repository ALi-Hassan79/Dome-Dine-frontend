"use client";

import { useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Pin } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "owner">("student");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post("/auth/register", { name, email, password, role });
      router.push(
        `/verify-otp?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirect)}`
      );
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Could not register.");
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
          <h1 className="font-display text-3xl text-center mb-1">Create an account</h1>
          <p className="text-sm text-ink/60 text-center mb-6">
            We&apos;ll email you a code to verify it&apos;s really you
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-wide text-ink/60">
                Full name
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full border border-ink/15 rounded-sm px-3 py-2 text-sm bg-white/60 focus:outline-none focus:ring-2 focus:ring-board"
                placeholder="Ali Hassan"
              />
            </div>
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
              <label className="text-xs font-mono uppercase tracking-wide text-ink/60">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-ink/15 rounded-sm px-3 py-2 text-sm bg-white/60 focus:outline-none focus:ring-2 focus:ring-board"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wide text-ink/60 block mb-1.5">
                I am a
              </label>
              <div className="flex rounded-sm overflow-hidden border border-ink/15">
                {(["student", "owner"] as const).map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex-1 py-2 text-sm font-mono capitalize transition ${
                      role === r ? "bg-board text-chalk" : "bg-white/50 text-ink/70"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
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
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-sm text-center text-ink/60 mt-6">
            Already have an account?{" "}
            <Link
              href={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-marker font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}