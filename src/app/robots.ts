import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://dome-dine-frontend-56.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"], // adjust to match any private/auth routes
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}