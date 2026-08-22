"use client";

import { useEffect, useState } from "react";
import { useParams, notFound, usePathname } from "next/navigation";
import Link from "next/link";
import { MapPin, Star, ArrowLeft, MessageCircle, Lock, Heart } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { fetchListingById } from "@/lib/listings";
import { fetchReviews, createReview, type ApiReview } from "@/lib/reviews";
import type { Listing } from "@/lib/data";
import { ApiRequestError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useBookmarks } from "@/context/BookmarksContext";

function SignInGate() {
  const pathname = usePathname();
  return (
    <div className="torn-top bg-paper text-ink p-8 shadow-xl shadow-black/20 text-center">
      <Lock className="mx-auto text-marker mb-3" size={28} />
      <h1 className="font-display text-3xl mb-2">Sign in to see this listing</h1>
      <p className="text-sm text-ink/60 mb-6 max-w-xs mx-auto">
        Create a free account to see full details, ratings, and contact the owner directly on
        WhatsApp.
      </p>
      <div className="flex flex-col gap-2 max-w-xs mx-auto">
        <Link
          href={`/register?redirect=${encodeURIComponent(pathname)}`}
          className="w-full bg-board text-chalk font-medium py-2.5 rounded-sm hover:brightness-110 transition"
        >
          Create free account
        </Link>
        <Link
          href={`/login?redirect=${encodeURIComponent(pathname)}`}
          className="w-full bg-paper-dim text-ink font-medium py-2.5 rounded-sm hover:brightness-95 transition"
        >
          I already have an account
        </Link>
      </div>
    </div>
  );
}

function ListingGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="-mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6">
      <div className="h-64 sm:h-80 overflow-hidden bg-ink/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={`${name} photo ${active + 1}`}
          className="h-full w-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-1.5 px-6 sm:px-8 pt-2 overflow-x-auto">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "h-14 w-14 shrink-0 rounded-sm overflow-hidden border-2 transition",
                i === active ? "border-marker" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ListingPage() {
  const params = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [listing, setListing] = useState<(Listing & { whatsappNumber: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    fetchListingById(params.id)
      .then(setListing)
      .catch((err) => {
        if (err instanceof ApiRequestError && err.status === 404) setNotFoundFlag(true);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (notFoundFlag) notFound();

  if (loading || authLoading) {
    return (
      <>
        <Navbar />
        <main className="flex-1 board-texture px-5 py-10">
          <div className="mx-auto max-w-3xl">
            <div className="h-96 rounded-sm bg-paper/10 animate-pulse" />
          </div>
        </main>
      </>
    );
  }

  if (!listing) return null;

  // Gate full details behind sign-in — logged-out visitors only see the prompt.
  if (!user) {
    return (
      <>
        <Navbar />
        <main className="flex-1 board-texture px-5 py-10">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-chalk/70 hover:text-chalk mb-6"
            >
              <ArrowLeft size={15} /> Back to board
            </Link>
            <SignInGate />
          </div>
        </main>
      </>
    );
  }

  const waLink = `https://wa.me/${listing.whatsappNumber.replace(/\D/g, "")}`;

  return (
    <>
      <Navbar />
      <main className="flex-1 board-texture px-5 py-10">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-chalk/70 hover:text-chalk mb-6"
          >
            <ArrowLeft size={15} /> Back to board
          </Link>

          <div className="torn-top bg-paper text-ink p-6 sm:p-8 shadow-xl shadow-black/20">
            {listing.images && listing.images.length > 0 && (
              <ListingGallery images={listing.images} name={listing.name} />
            )}

            <div className="flex items-start justify-between gap-3">
              <span
                className={
                  "font-mono text-[11px] uppercase tracking-wide px-2 py-0.5 rounded-sm font-medium " +
                  (listing.available ? "bg-[#2b3a2e] text-chalk" : "bg-[#8a8f87] text-chalk")
                }
              >
                {listing.available ? "Available now" : "Full"}
              </span>
              <span className="font-display text-3xl text-marker rotate-[-2deg]">
                {listing.type === "hostel" ? "Room" : "Mess"}
              </span>
            </div>

            <h1 className="mt-3 font-sans font-bold text-3xl">{listing.name}</h1>

            <div className="mt-2 flex items-center gap-1.5 text-ink/70">
              <MapPin size={16} />
              {listing.university} · {listing.distanceKm} km from campus gate
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Star size={16} className="fill-yellow text-yellow" />
              <span className="font-medium">{listing.rating}</span>
              <span className="text-ink/50 text-sm">
                ({listing.reviewCount} student reviews)
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {listing.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-paper-dim text-ink/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-dashed border-ink/20 pt-6">
              <div>
                <p className="font-mono text-2xl font-bold">
                  Rs {listing.price.toLocaleString()}
                </p>
                <p className="text-xs text-ink/60">per {listing.priceUnit}</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold capitalize">{listing.gender}</p>
                <p className="text-xs text-ink/60">gender</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold capitalize">
                  {listing.roomType ?? listing.mealPlan}
                </p>
                <p className="text-xs text-ink/60">
                  {listing.type === "hostel" ? "room type" : "meal plan"}
                </p>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-medium py-3 rounded-sm hover:brightness-95 transition"
              >
                <MessageCircle size={18} />
                Contact owner on WhatsApp
              </a>
              {user?.role === "student" && (
                <button
                  type="button"
                  onClick={() => toggleBookmark(listing.id)}
                  aria-pressed={isBookmarked(listing.id)}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm font-medium border transition",
                    isBookmarked(listing.id)
                      ? "bg-marker/10 border-marker text-marker"
                      : "border-ink/20 text-ink/70 hover:border-ink/40"
                  )}
                >
                  <Heart size={18} className={cn(isBookmarked(listing.id) && "fill-marker")} />
                  {isBookmarked(listing.id) ? "Saved" : "Save"}
                </button>
              )}
            </div>
          </div>

          <ReviewsSection
            listingId={listing.id}
            rating={listing.rating}
            reviewCount={listing.reviewCount}
            onReviewPosted={(newRating, newReviewCount) =>
              setListing((prev) =>
                prev ? { ...prev, rating: newRating, reviewCount: newReviewCount } : prev
              )
            }
          />
        </div>
      </main>
    </>
  );
}

function ReviewsSection({
  listingId,
  rating,
  reviewCount,
  onReviewPosted,
}: {
  listingId: string;
  rating: number;
  reviewCount: number;
  onReviewPosted: (newRating: number, newReviewCount: number) => void;
}) {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const [formRating, setFormRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // A student can only post one review per listing. If they already have
  // one in the fetched list, hide the form instead of letting them submit
  // a second (the backend may allow it, so this is a frontend-side guard).
  const ownReview = user ? reviews.find((r) => r.user?.id === user.id) : undefined;

  useEffect(() => {
    setReviewsLoading(true);
    fetchReviews(listingId)
      .then(({ reviews }) => setReviews(reviews))
      .catch((err) =>
        setReviewsError(err instanceof ApiRequestError ? err.message : "Could not load reviews.")
      )
      .finally(() => setReviewsLoading(false));
  }, [listingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (ownReview) {
      setFormError("You've already reviewed this listing.");
      return;
    }
    if (formRating < 1) {
      setFormError("Pick a star rating first.");
      return;
    }
    setFormError(null);
    setSubmitting(true);
    try {
      const review = await createReview(listingId, { rating: formRating, comment }, token);
      setReviews((prev) => [review, ...prev]);
      setFormRating(0);
      setComment("");

      // Recompute the average locally so the star rating up top reflects
      // this review immediately, instead of waiting for a page reload.
      const newReviewCount = reviewCount + 1;
      const newRating = (rating * reviewCount + review.rating) / newReviewCount;
      onReviewPosted(Math.round(newRating * 10) / 10, newReviewCount);
    } catch (err) {
      setFormError(err instanceof ApiRequestError ? err.message : "Couldn't submit your review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="torn-top bg-paper text-ink p-6 sm:p-8 mt-8 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-marker">Student reviews</h2>
        <span className="flex items-center gap-1.5 text-sm">
          <Star size={15} className="fill-yellow text-yellow" />
          <span className="font-medium">{rating}</span>
          <span className="text-ink/50">({reviewCount})</span>
        </span>
      </div>

      <div className="mt-5 border-t border-dashed border-ink/20 pt-5">
        {user?.role === "student" && ownReview ? (
          <p className="text-sm text-ink/70">
            You&apos;ve already reviewed this listing. Thanks for sharing your experience!
          </p>
        ) : user?.role === "student" ? (
          <form onSubmit={handleSubmit}>
            <p className="text-sm font-medium mb-2">Leave a review</p>
            <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
                  onMouseEnter={() => setHoverRating(n)}
                  onClick={() => setFormRating(n)}
                  className="p-0.5"
                >
                  <Star
                    size={22}
                    className={
                      n <= (hoverRating || formRating) ? "fill-yellow text-yellow" : "text-ink/25"
                    }
                  />
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was your stay? Mention what stood out, good or bad..."
              rows={3}
              className="mt-3 w-full resize-none rounded-sm border border-ink/20 bg-chalk/40 px-3 py-2 text-sm placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-yellow"
            />

            {formError && <p className="mt-2 text-sm text-marker">{formError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-3 inline-flex items-center justify-center bg-marker text-chalk font-medium px-5 py-2 rounded-sm hover:brightness-95 transition disabled:opacity-60"
            >
              {submitting ? "Posting..." : "Post review"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-ink/70">Only students can leave reviews.</p>
        )}
      </div>

      <div className="mt-6 border-t border-dashed border-ink/20 pt-5 space-y-4">
        {reviewsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-16 rounded-sm bg-ink/5 animate-pulse" />
            ))}
          </div>
        ) : reviewsError ? (
          <p className="text-sm text-ink/60">{reviewsError}</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-ink/60">No reviews yet — be the first to share your experience.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="border-b border-dashed border-ink/10 pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-sm">{r.user?.name ?? "Anonymous"}</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < r.rating ? "fill-yellow text-yellow" : "text-ink/20"}
                    />
                  ))}
                </div>
              </div>
              {r.comment && <p className="mt-1 text-sm text-ink/80">{r.comment}</p>}
              <p className="mt-1 text-xs text-ink/40">
                {new Date(r.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}