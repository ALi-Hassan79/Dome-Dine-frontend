import { api } from "@/lib/api";

// Raw shape returned by the backend (controllers/reviewController.js -> toCamel)
export type ApiReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { id: string; name: string } | null;
};

export function fetchReviews(listingId: string): Promise<{ reviews: ApiReview[] }> {
  return api.get<{ reviews: ApiReview[] }>(`/listings/${listingId}/reviews`);
}

export async function createReview(
  listingId: string,
  data: { rating: number; comment: string },
  token: string
): Promise<ApiReview> {
  const { review } = await api.post<{ review: ApiReview }>(
    `/listings/${listingId}/reviews`,
    data,
    token
  );
  return review;
}
