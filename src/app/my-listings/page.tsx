"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { RequireRole } from "@/components/RequireRole";
import { useAuth } from "@/context/AuthContext";
import { ownerApi, type OwnerListing } from "@/lib/owner";
import { ApiRequestError } from "@/lib/api";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<OwnerListing["status"], string> = {
  approved: "bg-[#2b3a2e] text-chalk",
  pending: "bg-yellow text-ink",
  rejected: "bg-marker text-white",
};

function MyListingsDashboard() {
  const { token } = useAuth();
  const [items, setItems] = useState<OwnerListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingOn, setActingOn] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    ownerApi
      .getMine(token)
      .then(({ listings }) => setItems(listings))
      .catch((err) => setError(err instanceof ApiRequestError ? err.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, [token]);

  const toggleAvailable = async (l: OwnerListing) => {
    if (!token) return;
    setActingOn(l.id);
    try {
      await ownerApi.update(l.id, { available: !l.available }, token);
      setItems((prev) =>
        prev.map((x) => (x.id === l.id ? { ...x, available: !x.available } : x))
      );
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Action failed.");
    } finally {
      setActingOn(null);
    }
  };

  const remove = async (l: OwnerListing) => {
    if (!token) return;
    if (!confirm(`Delete "${l.name}"? This can't be undone.`)) return;
    setActingOn(l.id);
    try {
      await ownerApi.remove(l.id, token);
      setItems((prev) => prev.filter((x) => x.id !== l.id));
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Action failed.");
    } finally {
      setActingOn(null);
    }
  };

  return (
    <main className="flex-1 board-texture px-5 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-baseline justify-between mb-6">
          <h1 className="font-display text-4xl text-chalk">My listings</h1>
          <Link
            href="/list-your-place"
            className="text-sm font-medium bg-yellow text-ink px-4 py-1.5 rounded-sm hover:brightness-95 transition"
          >
            + Add new
          </Link>
        </div>

        {error && <p className="text-marker text-sm mb-4">{error}</p>}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-24 rounded-sm bg-paper/10 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-chalk/60">
            <p className="font-display text-2xl text-yellow mb-1">Nothing pinned yet.</p>
            <p className="text-sm">Add your first listing to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((l) => (
              <div key={l.id} className="bg-paper text-ink rounded-sm p-5 shadow-lg shadow-black/10">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display text-xl text-marker">
                        {l.type === "hostel" ? "Room" : "Mess"}
                      </span>
                      <h3 className="font-semibold text-lg">{l.name}</h3>
                      <span
                        className={cn(
                          "text-[11px] font-mono uppercase px-2 py-0.5 rounded-sm",
                          STATUS_STYLE[l.status]
                        )}
                      >
                        {l.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-ink/60">
                      {l.university} · Rs {l.price.toLocaleString()}/month
                    </p>
                    {l.status === "rejected" && (
                      <p className="mt-1 text-xs text-marker">
                        This listing was rejected by an admin. Edit and resubmit.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <label className="flex items-center gap-1.5 text-xs text-ink/70">
                      <input
                        type="checkbox"
                        checked={l.available}
                        disabled={actingOn === l.id}
                        onChange={() => toggleAvailable(l)}
                      />
                      Available
                    </label>
                    <Link
                      href={`/my-listings/${l.id}/edit`}
                      className="text-xs font-medium bg-paper-dim text-ink px-3 py-1 rounded-sm hover:brightness-95 transition text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => remove(l)}
                      disabled={actingOn === l.id}
                      className="text-xs font-medium bg-marker text-white px-3 py-1 rounded-sm hover:brightness-110 transition disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function MyListingsPage() {
  return (
    <>
      <Navbar />
      <RequireRole role="owner">
        <MyListingsDashboard />
      </RequireRole>
    </>
  );
}