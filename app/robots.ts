import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://messmate.in";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/meals", "/kitchen-partner", "/about"],
      disallow: ["/admin", "/dashboard"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

