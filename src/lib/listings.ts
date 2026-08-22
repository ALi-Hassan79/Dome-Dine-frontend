import { api } from "@/lib/api";
import type { Listing } from "@/lib/data";

// Deterministic color per listing so cards keep the varied look the
// static data.ts had, without the backend needing to store a color.
const PALETTE = ["#c1443d", "#3d6b52", "#8a5a3d", "#e8b54d", "#2b3a2e"];
function colorFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

// Raw shape returned by the backend (controllers/listingController.js -> toCamel)
export type ApiListing = {
  id: string;
  type: "hostel" | "mess";
  name: string;
  university: string;
  gender: "boys" | "girls" | "co-ed";
  price: number;
  distanceKm: number;
  roomType: string | null;
  mealPlan: string | null;
  tags: string[];
  whatsappNumber: string;
  available: boolean;
  rating: number;
  reviewCount: number;
  images: string[];
};

export function toListing(l: ApiListing): Listing {
  return {
    id: l.id,
    type: l.type,
    name: l.name,
    university: l.university,
    gender: l.gender,
    price: l.price,
    priceUnit: "month",
    distanceKm: l.distanceKm,
    rating: l.rating,
    reviewCount: l.reviewCount,
    available: l.available,
    roomType: (l.roomType as Listing["roomType"]) ?? undefined,
    mealPlan: (l.mealPlan as Listing["mealPlan"]) ?? undefined,
    tags: l.tags,
    color: colorFor(l.id),
    images: l.images ?? [],
  };
}

export async function fetchListings(): Promise<Listing[]> {
  const { listings } = await api.get<{ listings: ApiListing[] }>("/listings?limit=100");
  return listings.map(toListing);
}

export async function fetchListingById(id: string): Promise<Listing & { whatsappNumber: string }> {
  const { listing } = await api.get<{ listing: ApiListing }>(`/listings/${id}`);
  return { ...toListing(listing), whatsappNumber: listing.whatsappNumber };
}