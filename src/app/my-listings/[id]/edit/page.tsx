"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { RequireRole } from "@/components/RequireRole";
import { ListingForm } from "@/components/ListingForm";
import { useAuth } from "@/context/AuthContext";
import { ownerApi, type OwnerListing, type ListingFormValues } from "@/lib/owner";
import { ApiRequestError } from "@/lib/api";

function EditListingForm() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { token } = useAuth();
  const [listing, setListing] = useState<OwnerListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    if (!token) return;
    ownerApi
      .getOne(params.id, token)
      .then(({ listing }) => setListing(listing))
      .catch((err) => {
        if (err instanceof ApiRequestError && err.status === 404) setNotFoundFlag(true);
        else setError(err instanceof ApiRequestError ? err.message : "Failed to load listing.");
      })
      .finally(() => setLoading(false));
  }, [params.id, token]);

  const handleUpdate = async (values: ListingFormValues) => {
    if (!token) return;
    setSubmitting(true);
    setError(null);
    try {
      await ownerApi.update(params.id, values, token);
      router.push("/my-listings");
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Could not update listing.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 board-texture px-5 py-10">
        <div className="mx-auto max-w-lg">
          <div className="h-96 rounded-sm bg-paper/10 animate-pulse" />
        </div>
      </main>
    );
  }

  if (notFoundFlag || !listing) {
    return (
      <main className="flex-1 board-texture px-5 py-10">
        <div className="mx-auto max-w-lg text-center text-chalk/60">
          <p className="font-display text-2xl text-marker mb-2">Listing not found.</p>
          <Link href="/my-listings" className="text-sm underline">
            Back to my listings
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 board-texture px-5 py-10">
      <div className="mx-auto max-w-lg">
        <Link
          href="/my-listings"
          className="inline-flex items-center gap-1.5 text-sm text-chalk/70 hover:text-chalk mb-6"
        >
          <ArrowLeft size={15} /> Back to my listings
        </Link>

        <h1 className="font-display text-4xl text-chalk mb-1">Edit listing</h1>
        <p className="text-sm text-chalk/60 mb-6">
          {listing.status === "rejected"
            ? "This was rejected — update it and resubmit for review."
            : "Changes go back to the admin for re-approval before they're visible again."}
        </p>

        <div className="bg-paper text-ink p-6 sm:p-8 torn-top shadow-xl">
          {error && (
            <p className="text-sm text-marker bg-marker/10 border border-marker/20 rounded-sm px-3 py-2 mb-4">
              {error}
            </p>
          )}
          <ListingForm
            initial={listing}
            submitting={submitting}
            onSubmit={handleUpdate}
            submitLabel="Save changes"
          />
        </div>
      </div>
    </main>
  );
}

export default function EditListingPage() {
  return (
    <>
      <Navbar />
      <RequireRole role="owner">
        <EditListingForm />
      </RequireRole>
    </>
  );
}