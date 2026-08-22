import { api } from "@/lib/api";

export type PendingListing = {
  id: string;
  type: "hostel" | "mess";
  name: string;
  university: string;
  gender: "boys" | "girls" | "co-ed";
  price: number;
  distance_km: string;
  room_type: string | null;
  meal_plan: string | null;
  tags: string[];
  whatsapp_number: string;
  created_at: string;
  owner: { id: string; name: string; email: string };
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "student" | "owner" | "admin";
  is_active: boolean;
  created_at: string;
};

export const adminApi = {
  getPendingListings: (token: string) =>
    api.get<{ listings: PendingListing[] }>("/admin/listings/pending", token),

  setListingStatus: (id: string, status: "approved" | "rejected", token: string) =>
    api.patch(`/admin/listings/${id}/status`, { status }, token),

  getUsers: (token: string) => api.get<{ users: AdminUser[] }>("/admin/users", token),

  setUserStatus: (id: string, isActive: boolean, token: string) =>
    api.patch(`/admin/users/${id}/status`, { isActive }, token),
};