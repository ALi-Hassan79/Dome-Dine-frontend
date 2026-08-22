"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ListingCard } from "@/components/ListingCard";
import { useAuth } from "@/context/AuthContext";
import { bookmarksApi } from "@/lib/bookmarks";
import type { Listing } from "@/lib/data";
import { ApiRequestError } from "@/lib/api";

function LoggedOutPrompt() {
  return (
    <main className="flex-1 board-texture flex items-center justify-center px-5 py-16">
      <div className="max-w-sm text-center bg-paper text-ink p-8 torn-top shadow-xl">
        <h1 className="font-display text-3xl mb-2">Your saved listings</h1>
        <p className="text-sm text-ink/60 mb-6">
          Sign in to see hostels and mess you&apos;ve saved.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/login?redirect=/saved"
            className="w-full bg-board text-chalk font-medium py-2.5 rounded-sm hover:brightness-110 transition"
          >
            Sign in
          </Link>
          <Link
            href="/register?redirect=/saved"
            className="w-full bg-paper-dim text-ink font-medium py-2.5 rounded-sm hover:brightness-95 transition"
          >
            Create free account
          </Link>
        </div>
      </div>
    </main>
  );
}

function SavedListingsGrid() {
  const { token } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    bookmarksApi
      .getSavedListings(token)
      .then(setListings)
      .catch((err) =>
        setError(err instanceof ApiRequestError ? err.message : "Could not load saved listings.")
      )
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <main className="flex-1 board-texture px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-4xl text-chalk mb-1">Saved listings</h1>
        <p className="text-sm text-chalk/60 mb-8">Hostels and mess you&apos;ve bookmarked.</p>

        {error ? (
          <p className="text-marker text-sm">{error}</p>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-56 rounded-sm bg-paper/10 animate-pulse" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 text-chalk/60">
            <p className="font-display text-2xl text-yellow mb-1">Nothing saved yet.</p>
            <p className="text-sm mb-4">Tap the heart on any listing to save it here.</p>
            <Link href="/" className="text-marker text-sm font-medium hover:underline">
              Browse listings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function SavedPage() {
  const { user, loading: authLoading } = useAuth();

  return (
    <>
      <Navbar />
      {authLoading ? null : user ? <SavedListingsGrid /> : <LoggedOutPrompt />}
    </>
  );
}
