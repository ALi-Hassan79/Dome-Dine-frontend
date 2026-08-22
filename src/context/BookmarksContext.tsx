"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { bookmarksApi } from "@/lib/bookmarks";

type BookmarksContextValue = {
  loading: boolean;
  isBookmarked: (listingId: string) => boolean;
  toggleBookmark: (listingId: string) => Promise<void>;
};

const BookmarksContext = createContext<BookmarksContextValue | undefined>(undefined);

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Load the signed-in student's saved listings once we have a token;
  // clear them out on logout so a shared device doesn't leak saves.
  useEffect(() => {
    if (!token) {
      setBookmarkedIds(new Set());
      return;
    }
    setLoading(true);
    bookmarksApi
      .getBookmarkedIds(token)
      .then((ids) => setBookmarkedIds(new Set(ids)))
      .catch(() => setBookmarkedIds(new Set()))
      .finally(() => setLoading(false));
  }, [token]);

  const isBookmarked = useCallback(
    (listingId: string) => bookmarkedIds.has(listingId),
    [bookmarkedIds]
  );

  const toggleBookmark = useCallback(
    async (listingId: string) => {
      if (!token) return;
      const wasSaved = bookmarkedIds.has(listingId);

      // Optimistic update so the heart flips instantly.
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (wasSaved) next.delete(listingId);
        else next.add(listingId);
        return next;
      });

      try {
        if (wasSaved) await bookmarksApi.remove(listingId, token);
        else await bookmarksApi.add(listingId, token);
      } catch {
        // Revert if the request failed.
        setBookmarkedIds((prev) => {
          const next = new Set(prev);
          if (wasSaved) next.add(listingId);
          else next.delete(listingId);
          return next;
        });
      }
    },
    [token, bookmarkedIds]
  );

  return (
    <BookmarksContext.Provider value={{ loading, isBookmarked, toggleBookmark }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarksContext);
  if (!ctx) throw new Error("useBookmarks must be used inside <BookmarksProvider>");
  return ctx;
}
