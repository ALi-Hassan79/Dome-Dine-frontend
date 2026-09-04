import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dome-dine-frontend-56.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/list-your-place`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // If you have individual listing pages (e.g. /listings/[id]), ideally
    // fetch all listing IDs from Supabase here and add one entry per
    // listing so each hostel/mess page gets indexed individually. Example:
    //
    // const { data: listings } = await supabase.from("listings").select("id, updated_at");
    // ...listings.map((l) => ({
    //   url: `${baseUrl}/listings/${l.id}`,
    //   lastModified: new Date(l.updated_at),
    //   changeFrequency: "weekly",
    //   priority: 0.7,
    // })),
  ];
}