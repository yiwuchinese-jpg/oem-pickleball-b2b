import { MetadataRoute } from "next";

// 用 Next.js 动态 robots.ts 替代静态 public/robots.txt
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/studio/"],
      },
    ],
    sitemap: "https://pickleoem.com/sitemap.xml",
  };
}
