"use client";

import { useState, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Pin, KeyRound } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/auth/reset-password", { email, otp, newPassword });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Could not reset password.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="flex-1 flex items-center justify-center px-5 py-16 board-texture">
        <div className="w-full max-w-sm text-center bg-paper text-ink p-8 torn-top shadow-xl">
          <h1 className="font-display text-3xl mb-2 text-marker">Password updated</h1>
          <p className="text-sm text-ink/60 mb-6">
            You can now sign in with your new password.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-board text-chalk font-medium py-2.5 rounded-sm hover:brightness-110 transition"
          >
            Go to sign in
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center px-5 py-16 board-texture">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Pin className="text-marker" size={20} />
          <span className="font-display text-3xl text-chalk">Dorm & Dine</span>
        </Link>

        <div className="bg-paper text-ink p-8 torn-top shadow-xl">
          <KeyRound className="mx-auto text-marker mb-3" size={28} />
          <h1 className="font-display text-3xl text-center mb-1">Reset your password</h1>
          <p className="text-sm text-ink/60 text-center mb-6">
            Enter the code sent to{" "}
            <span className="font-medium text-ink">{email || "your email"}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-wide text-ink/60">
                6-digit code
              </label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                maxLength={6}
                className="mt-1 w-full border border-ink/15 rounded-sm px-3 py-2 text-sm bg-white/60 focus:outline-none focus:ring-2 focus:ring-board tracking-widest font-mono text-center"
                placeholder="000000"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wide text-ink/60">
                New password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full border border-ink/15 rounded-sm px-3 py-2 text-sm bg-white/60 focus:outline-none focus:ring-2 focus:ring-board"
                placeholder="At least 6 characters"
              />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wide text-ink/60">
                Confirm new password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full border border-ink/15 rounded-sm px-3 py-2 text-sm bg-white/60 focus:outline-none focus:ring-2 focus:ring-board"
                placeholder="Repeat password"
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
              {submitting ? "Resetting..." : "Reset password"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}