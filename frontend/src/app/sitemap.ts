import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://prompt-forge-two-indol.vercel.app", lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: "https://prompt-forge-two-indol.vercel.app/explore", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: "https://prompt-forge-two-indol.vercel.app/categories", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: "https://prompt-forge-two-indol.vercel.app/trending", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: "https://prompt-forge-two-indol.vercel.app/leaderboard", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: "https://prompt-forge-two-indol.vercel.app/community", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: "https://prompt-forge-two-indol.vercel.app/documentation", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}
