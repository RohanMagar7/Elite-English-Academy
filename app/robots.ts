import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const siteUrl = "https://eliteenglishacademy.magarohan8.workers.dev";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
        },
        sitemap: `${siteUrl}/sitemap.xml`,
        host: siteUrl,
    };
}
