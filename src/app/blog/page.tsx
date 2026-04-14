import type { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Pickleball OEM Blog | Factory Tips, Market Insights & How-To Guides",
  description:
    "Expert guides on finding OEM pickleball manufacturers, Southeast Asia market data, and quality verification tips for wholesale buyers.",
  openGraph: {
    title: "Pickleball OEM Blog | Factory Tips & Market Insights",
    description: "Expert guides for pickleball wholesale buyers.",
    url: "https://pickleoem.com/blog",
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
