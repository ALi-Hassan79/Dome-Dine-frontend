import { api } from "@/lib/api";
import { toListing } from "@/lib/listings";
import type { Listing } from "@/lib/data";

// Raw shape actually returned by GET /api/bookmarks
// (controllers/bookmarkController.js -> getMyBookmarks). Note this is
// snake_case straight from Postgres for the nested listing, since that
// route doesn't go through listingController's toCamel().
type ApiBookmarkEntry = {
  bookmarkId: string;
  savedAt: string;
  listing: {
    id: string;
    type: "hostel" | "mess";
    name: string;
    university: string;
    gender: "boys" | "girls" | "co-ed";
    price: number;
    distance_km: string | number;
    room_type: string | null;
    meal_plan: string | null;
    tags: string[];
    available: boolean;
    rating: number;
    review_count: number;
    images?: string[];
  };
};

export const bookmarksApi = {
  // Returns just the ids of listings the current user has saved, so the
  // UI can cheaply mark cards as "saved" without needing full listing data.
  getBookmarkedIds: async (token: string): Promise<string[]> => {
    const { bookmarks } = await api.get<{ bookmarks: ApiBookmarkEntry[] }>("/bookmarks", token);
    return bookmarks.map((b) => b.listing.id);
  },

  // Full listing objects for the "Saved" page — the backend already joins
  // this in one call, no need to fetch each listing individually.
  getSavedListings: async (token: string): Promise<Listing[]> => {
    const { bookmarks } = await api.get<{ bookmarks: ApiBookmarkEntry[] }>("/bookmarks", token);
    return bookmarks.map((b) =>
      toListing({
        id: b.listing.id,
        type: b.listing.type,
        name: b.listing.name,
        university: b.listing.university,
        gender: b.listing.gender,
        price: b.listing.price,
        distanceKm: Number(b.listing.distance_km),
        roomType: b.listing.room_type,
        mealPlan: b.listing.meal_plan,
        tags: b.listing.tags,
        whatsappNumber: "", // not shown on the saved-list card, only on detail page
        available: b.listing.available,
        rating: b.listing.rating,
        reviewCount: b.listing.review_count,
        images: b.listing.images ?? [],
      })
    );
  },

  add: (listingId: string, token: string) =>
    api.post<{ bookmark: unknown }>(`/bookmarks/${listingId}`, undefined, token),

  remove: (listingId: string, token: string) =>
    api.delete<{ message: string }>(`/bookmarks/${listingId}`, token),
};
