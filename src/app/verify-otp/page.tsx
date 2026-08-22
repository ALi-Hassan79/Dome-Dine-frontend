"use client";

import { useState, useEffect, useRef, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Pin, MailCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api, ApiRequestError } from "@/lib/api";

function VerifyOtpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { setSession } = useAuth();
  const email = params.get("email") || "";
  const redirect = params.get("redirect") || "/";

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleDigitChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    setDigits(pasted.padEnd(6, " ").split("").map((c) => (c === " " ? "" : c)));
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length !== 6) {
      setError("Enter all 6 digits.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const { token, user } = await api.post<{ token: string; user: any }>("/auth/verify-otp", {
        email,
        otp,
      });
      setSession(token, user);
      router.push(redirect);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Verification failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setInfo(null);
    try {
      await api.post("/auth/resend-otp", { email });
      setInfo("A new code has been sent.");
      setCooldown(30);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Could not resend code.");
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-5 py-16 board-texture">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Pin className="text-marker" size={20} />
          <span className="font-display text-3xl text-chalk">Dorm & Dine</span>
        </Link>

        <div className="bg-paper text-ink p-8 torn-top shadow-xl text-center">
          <MailCheck className="mx-auto text-marker mb-3" size={32} />
          <h1 className="font-display text-3xl mb-1">Check your email</h1>
          <p className="text-sm text-ink/60 mb-6">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-ink">{email || "your email"}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  value={d}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  maxLength={1}
                  inputMode="numeric"
                  className="w-11 h-13 text-center text-lg font-mono border border-ink/15 rounded-sm bg-white/60 focus:outline-none focus:ring-2 focus:ring-board py-2"
                />
              ))}
            </div>

            {error && (
              <p className="text-sm text-marker bg-marker/10 border border-marker/20 rounded-sm px-3 py-2">
                {error}
              </p>
            )}
            {info && (
              <p className="text-sm text-board bg-board/10 border border-board/20 rounded-sm px-3 py-2">
                {info}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-board text-chalk font-medium py-2.5 rounded-sm hover:brightness-110 transition disabled:opacity-50"
            >
              {submitting ? "Verifying..." : "Verify & continue"}
            </button>
          </form>

          <button
            onClick={handleResend}
            disabled={cooldown > 0}
            className="text-sm text-marker font-medium hover:underline mt-5 disabled:text-ink/40 disabled:no-underline"
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Didn't get it? Resend code"}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}