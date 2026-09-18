/* ============================================
   ELITE ENGLISH ACADEMY
          Developer : Rohan Magar
   ============================================ */

import type { MetadataRoute } from "next";

const siteUrl = "https://eliteenglishacademy.magarohan8.workers.dev";

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [
        "",
        "/about",
        "/admission",
        "/contact",
        "/courses",
        "/gallery",
        "/notices",
        "/testimonials",
        "/login",
        "/profile",
    ];

    return routes.map((route) => ({
        url: `${siteUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : 0.7,
    }));
}
