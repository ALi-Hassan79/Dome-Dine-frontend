"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ListingForm } from "@/components/ListingForm";
import { useAuth } from "@/context/AuthContext";
import { ownerApi, type ListingFormValues } from "@/lib/owner";
import { ApiRequestError } from "@/lib/api";

function LoggedOutPrompt() {
  return (
    <main className="flex-1 board-texture flex items-center justify-center px-5 py-16">
      <div className="max-w-sm text-center bg-paper text-ink p-8 torn-top shadow-xl">
        <h1 className="font-display text-3xl mb-2">List your hostel or mess</h1>
        <p className="text-sm text-ink/60 mb-6">
          Create an owner account (or sign in) to post your place on the board.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/register"
            className="w-full bg-board text-chalk font-medium py-2.5 rounded-sm hover:brightness-110 transition"
          >
            Create owner account
          </Link>
          <Link
            href="/login"
            className="w-full bg-paper-dim text-ink font-medium py-2.5 rounded-sm hover:brightness-95 transition"
          >
            I already have an account
          </Link>
        </div>
      </div>
    </main>
  );
}

function WrongRolePrompt() {
  return (
    <main className="flex-1 board-texture flex items-center justify-center px-5 py-16">
      <div className="max-w-sm text-center bg-paper text-ink p-8 torn-top shadow-xl">
        <h1 className="font-display text-3xl mb-2">Owners only</h1>
        <p className="text-sm text-ink/60">
          Your account is registered as a student. Listing a place needs an owner account —
          register a separate one with a different email to list your hostel or mess.
        </p>
      </div>
    </main>
  );
}

export default function ListYourPlacePage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (values: ListingFormValues) => {
    if (!token) return;
    setSubmitting(true);
    setError(null);
    try {
      await ownerApi.create(values, token);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Could not create listing.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;
  if (!user) return <><Navbar /><LoggedOutPrompt /></>;
  if (user.role !== "owner") return <><Navbar /><WrongRolePrompt /></>;

  if (success) {
    return (
      <>
        <Navbar />
        <main className="flex-1 board-texture flex items-center justify-center px-5 py-16">
          <div className="max-w-sm text-center bg-paper text-ink p-8 torn-top shadow-xl">
            <h1 className="font-display text-3xl mb-2 text-marker">Pinned to the board</h1>
            <p className="text-sm text-ink/60 mb-6">
              Your listing is submitted and waiting for admin approval. It'll go live once
              reviewed.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setSuccess(false)}
                className="w-full bg-board text-chalk font-medium py-2.5 rounded-sm hover:brightness-110 transition"
              >
                Add another
              </button>
              <button
                onClick={() => router.push("/my-listings")}
                className="w-full bg-paper-dim text-ink font-medium py-2.5 rounded-sm hover:brightness-95 transition"
              >
                View my listings
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 board-texture px-5 py-10">
        <div className="mx-auto max-w-lg">
          <h1 className="font-display text-4xl text-chalk mb-1">List your place</h1>
          <p className="text-sm text-chalk/60 mb-6">
            Fill this in and it'll go to the admin for approval before it's visible to
            students.
          </p>
          <div className="bg-paper text-ink p-6 sm:p-8 torn-top shadow-xl">
            {error && (
              <p className="text-sm text-marker bg-marker/10 border border-marker/20 rounded-sm px-3 py-2 mb-4">
                {error}
              </p>
            )}
            <ListingForm submitting={submitting} onSubmit={handleCreate} submitLabel="Submit for review" />
          </div>
        </div>
      </main>
    </>
  );
}