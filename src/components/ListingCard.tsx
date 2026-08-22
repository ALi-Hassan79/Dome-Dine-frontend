"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, MapPin, Users, UtensilsCrossed, Heart } from "lucide-react";
import { Pushpin } from "./Pushpin";
import type { Listing } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useBookmarks } from "@/context/BookmarksContext";

export function ListingCard({ listing }: { listing: Listing }) {
  const router = useRouter();
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const saved = isBookmarked(listing.id);

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent("/")}`);
      return;
    }
    toggleBookmark(listing.id);
  };

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group card-hover relative block pt-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow rounded-sm"
    >
      <Pushpin className="pin-dot absolute left-1/2 top-0 z-10 h-6 w-6 -translate-x-1/2 drop-shadow-md" />

      <div
        className={cn(
          "torn-top bg-paper text-ink relative px-4 pb-4 shadow-lg shadow-black/20",
          // No cover photo means there's nothing for the save button to
          // float over, so reserve extra top space for it instead of
          // letting it sit on top of the status row/text below.
          listing.images?.[0] ? "pt-5" : user?.role === "student" ? "pt-12" : "pt-5",
          "transition-transform duration-200 group-hover:-translate-y-1 group-hover:rotate-[0.3deg]"
        )}
        style={{
          transform: listing.id.charCodeAt(1) % 2 === 0 ? "rotate(-0.6deg)" : "rotate(0.6deg)",
        }}
      >
        {listing.images?.[0] && (
          <div className="-mx-4 -mt-5 mb-3 h-36 overflow-hidden relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={listing.images[0]}
              alt={listing.name}
              className="h-full w-full object-cover"
            />
            {user?.role === "student" && (
              <button
                type="button"
                onClick={handleSaveClick}
                aria-label={saved ? "Remove from saved listings" : "Save this listing"}
                aria-pressed={saved}
                className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-paper/95 shadow-md shadow-black/25 transition-transform hover:scale-110 active:scale-95"
              >
                <Heart
                  size={16}
                  className={cn("transition-colors", saved ? "fill-marker text-marker" : "text-ink/40")}
                />
              </button>
            )}
          </div>
        )}

        {!listing.images?.[0] && user?.role === "student" && (
          <button
            type="button"
            onClick={handleSaveClick}
            aria-label={saved ? "Remove from saved listings" : "Save this listing"}
            aria-pressed={saved}
            className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-paper/95 shadow-md shadow-black/25 transition-transform hover:scale-110 active:scale-95"
          >
            <Heart
              size={16}
              className={cn("transition-colors", saved ? "fill-marker text-marker" : "text-ink/40")}
            />
          </button>
        )}

        {/* status tag */}
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "font-mono text-[11px] uppercase tracking-wide px-2 py-0.5 rounded-sm font-medium",
              listing.available
                ? "bg-[#2b3a2e] text-chalk"
                : "bg-[#8a8f87] text-chalk"
            )}
          >
            {listing.available ? "Available now" : "Full"}
          </span>
          <span className="font-display text-2xl leading-none text-marker rotate-[-2deg]">
            {listing.type === "hostel" ? "Room" : "Mess"}
          </span>
        </div>

        <h3 className="mt-2 font-sans font-semibold text-lg leading-snug">
          {listing.name}
        </h3>

        <div className="mt-1 flex items-center gap-1.5 text-sm text-ink/70">
          <MapPin size={14} />
          <span>{listing.university} · {listing.distanceKm} km</span>
        </div>

        <div className="mt-2 flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1 font-medium">
            <Star size={14} className="fill-yellow text-yellow" />
            {listing.rating}
            <span className="text-ink/50 font-normal">({listing.reviewCount})</span>
          </span>
          <span className="flex items-center gap-1 text-ink/70">
            {listing.type === "hostel" ? (
              <>
                <Users size={14} />
                {listing.roomType}
              </>
            ) : (
              <>
                <UtensilsCrossed size={14} />
                {listing.mealPlan}
              </>
            )}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {listing.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-full bg-paper-dim text-ink/70"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-dashed border-ink/20 pt-3">
          <div className="font-mono">
            <span className="text-xl font-bold">Rs {listing.price.toLocaleString()}</span>
            <span className="text-ink/60 text-xs">/{listing.priceUnit}</span>
          </div>
        </div>

        {/* tear-off tab strip */}
        <div className="mt-3 -mx-4 -mb-4 flex border-t border-dashed border-ink/25 overflow-hidden">
          {["W", "H", "A", "T", "S", "A", "P", "P"].map((ch, i) => (
            <span
              key={i}
              className="flex-1 text-center text-[10px] font-mono py-1.5 border-r border-dashed border-ink/20 last:border-r-0 text-ink/50 [writing-mode:vertical-rl] rotate-180"
            >
              {ch}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}