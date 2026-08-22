import { getSupabaseClient, isSupabaseConfigured, LISTING_PHOTOS_BUCKET } from "@/lib/supabase";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export class ImageUploadError extends Error {}

// folderId groups a listing's photos under one path in the bucket, e.g.
// "abc-123/<uuid>.jpg". For a brand-new listing (no id yet) the form passes
// a client-generated uuid instead, which is fine — the path only needs to
// be unique, not tied to the final database id.
export async function uploadListingImage(file: File, folderId: string): Promise<string> {
  if (!isSupabaseConfigured) {
    throw new ImageUploadError(
      "Photo uploads aren't set up yet — add your Supabase URL and anon key to .env.local."
    );
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ImageUploadError("Only JPG, PNG, or WEBP photos are allowed.");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new ImageUploadError("Each photo must be under 5MB.");
  }

  const supabase = getSupabaseClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folderId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(LISTING_PHOTOS_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });

  if (error) {
    throw new ImageUploadError(error.message || "Upload failed.");
  }

  const { data } = supabase.storage.from(LISTING_PHOTOS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// Best-effort cleanup when a photo is removed from the form or a listing is
// deleted. Failures are swallowed by callers — an orphaned file in storage
// isn't worth surfacing an error to the user over.
export async function deleteListingImage(publicUrl: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const marker = `/object/public/${LISTING_PHOTOS_BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const path = publicUrl.slice(idx + marker.length);
  await getSupabaseClient().storage.from(LISTING_PHOTOS_BUCKET).remove([path]);
}