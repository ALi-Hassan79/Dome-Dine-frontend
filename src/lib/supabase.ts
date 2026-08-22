import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let client: SupabaseClient | null = null;

// Lazy getter instead of creating the client at module load time.
// createClient() throws synchronously if the URL is empty, and since this
// module is imported by ListingForm (which loads on pages that have nothing
// to do with photo uploads), that throw was crashing every page that ever
// imports the form -- not just photo uploads. Deferring creation until a
// photo upload actually happens keeps the rest of the app working even
// before Supabase is configured.
export function getSupabaseClient(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase isn't configured. Add NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local to enable photo uploads."
    );
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}

// Storage bucket that stores listing photos. Must be created in the Supabase
// dashboard (Storage -> New bucket -> "listing-photos", set Public) with an
// upload policy that allows authenticated inserts. See uploadImage.ts.
export const LISTING_PHOTOS_BUCKET = "listing-photos";