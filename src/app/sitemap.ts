import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/siteConfig";
import { portfolioAlbums } from "@/data/albums";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const routes = ["", "/portfolio", "/services", "/contact"];

  const staticRoutes: MetadataRoute.Sitemap = routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const dynamicRoutes: MetadataRoute.Sitemap = portfolioAlbums.map((album) => ({
    url: `${base}/portfolio/${album.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
