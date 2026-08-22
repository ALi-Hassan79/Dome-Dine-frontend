"use client";

import { useEffect, useState } from "react";
import { MapPin, Check, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { adminApi, type PendingListing } from "@/lib/admin";
import { ApiRequestError } from "@/lib/api";

export function PendingListingsTab() {
  const { token } = useAuth();
  const [items, setItems] = useState<PendingListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingOn, setActingOn] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    adminApi
      .getPendingListings(token)
      .then(({ listings }) => setItems(listings))
      .catch((err) => setError(err instanceof ApiRequestError ? err.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDecision = async (id: string, status: "approved" | "rejected") => {
    if (!token) return;
    setActingOn(id);
    try {
      await adminApi.setListingStatus(id, status, token);
      setItems((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Action failed.");
    } finally {
      setActingOn(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 rounded-sm bg-paper/10 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-marker text-sm">{error}</p>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-chalk/60">
        <p className="font-display text-2xl text-yellow mb-1">All caught up.</p>
        <p className="text-sm">No listings waiting for review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((l) => (
        <div key={l.id} className="bg-paper text-ink rounded-sm p-5 shadow-lg shadow-black/10">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-display text-xl text-marker">
                  {l.type === "hostel" ? "Room" : "Mess"}
                </span>
                <h3 className="font-semibold text-lg truncate">{l.name}</h3>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-ink/60">
                <MapPin size={13} />
                {l.university} · {l.distance_km} km
              </div>
              <p className="mt-1 text-sm text-ink/60">
                Submitted by <span className="font-medium text-ink">{l.owner.name}</span> (
                {l.owner.email})
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {l.tags.map((t) => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-paper-dim text-ink/70">
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-2 font-mono text-sm font-bold">Rs {l.price.toLocaleString()}/month</p>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => handleDecision(l.id, "approved")}
                disabled={actingOn === l.id}
                className="flex items-center gap-1.5 text-sm font-medium bg-[#2b3a2e] text-chalk px-3 py-1.5 rounded-sm hover:brightness-110 transition disabled:opacity-50"
              >
                <Check size={14} /> Approve
              </button>
              <button
                onClick={() => handleDecision(l.id, "rejected")}
                disabled={actingOn === l.id}
                className="flex items-center gap-1.5 text-sm font-medium bg-marker text-white px-3 py-1.5 rounded-sm hover:brightness-110 transition disabled:opacity-50"
              >
                <X size={14} /> Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}