import { api } from "@/lib/api";

export type OwnerListing = {
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
  status: "pending" | "approved" | "rejected";
  rating: number;
  reviewCount: number;
  createdAt: string;
  images: string[];
};

export type ListingFormValues = {
  type: "hostel" | "mess";
  name: string;
  university: string;
  gender: "boys" | "girls" | "co-ed";
  price: number;
  distanceKm: number;
  roomType?: string;
  mealPlan?: string;
  tags: string[];
  whatsappNumber: string;
  available: boolean;
  images: string[];
};

export const ownerApi = {
  getMine: (token: string) =>
    api.get<{ listings: OwnerListing[] }>("/listings/mine", token),

  getOne: (id: string, token: string) =>
    api.get<{ listing: OwnerListing }>(`/listings/${id}`, token),

  create: (values: ListingFormValues, token: string) =>
    api.post<{ listing: OwnerListing }>("/listings", values, token),

  update: (id: string, values: Partial<ListingFormValues>, token: string) =>
    api.patch<{ listing: OwnerListing }>(`/listings/${id}`, values, token),

  remove: (id: string, token: string) => api.delete(`/listings/${id}`, token),
};