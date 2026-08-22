"use client";

import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FilterBar, type Filters } from "@/components/FilterBar";
import { ListingCard } from "@/components/ListingCard";
import { fetchListings } from "@/lib/listings";
import type { Listing } from "@/lib/data";
import { ApiRequestError } from "@/lib/api";

export default function Home() {
  const [filters, setFilters] = useState<Filters | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchListings()
      .then(setListings)
      .catch((err) =>
        setError(err instanceof ApiRequestError ? err.message : "Could not load listings.")
      )
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!filters) return listings;
    return listings.filter((l) => {
      if (
        filters.query &&
        !`${l.name} ${l.university}`.toLowerCase().includes(filters.query.toLowerCase())
      )
        return false;
      if (filters.university !== "All" && l.university !== filters.university) return false;
      if (filters.type !== "all" && l.type !== filters.type) return false;
      if (filters.gender !== "all" && l.gender !== filters.gender) return false;
      if (l.price > filters.maxPrice) return false;
      if (filters.availableOnly && !l.available) return false;
      return true;
    });
  }, [filters, listings]);

  return (
    <>
      <Navbar />
      <main className="flex-1 board-texture">
        <Hero />
        <FilterBar onChange={setFilters} />

        <section className="mx-auto max-w-6xl px-5 pt-16 pb-24">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-3xl text-chalk">
              {loading ? "Loading..." : `${filtered.length} pinned near you`}
            </h2>
            <span className="font-mono text-xs text-chalk/50">Sorted by relevance</span>
          </div>

          {error ? (
            <div className="text-center py-20 text-chalk/60">
              <p className="font-display text-2xl text-marker mb-2">Couldn&apos;t load listings.</p>
              <p className="text-sm">{error} — is the backend running?</p>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-56 rounded-sm bg-paper/10 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-chalk/60">
              <p className="font-display text-2xl text-yellow mb-2">Board&apos;s empty here.</p>
              <p className="text-sm">Try widening your filters — nothing pinned matches yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {filtered.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}