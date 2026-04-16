import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Our Factory | Yiwu OEM Pickleball Manufacturer — Quality & Trust",
  description:
    "Yiwu-based pickleball manufacturer with USAPA-compliant production, heat-resistant edge guard technology, and ±3g weight precision. Trusted by brands in 30+ countries.",
  alternates: {
    canonical: "https://pickleoem.com/about",
  },
  openGraph: {
    title: "About Our Factory | Yiwu OEM Pickleball Manufacturer",
    description: "USAPA-compliant production, heat-resistant edge guard, ±3g weight precision. Trusted by brands in 30+ countries.",
    url: "https://pickleoem.com/about",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Yiwu OEM Pickleball Factory" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Our Factory | Yiwu OEM Pickleball Manufacturer",
    description: "USAPA-compliant production, ±3g weight precision. Trusted by brands in 30+ countries.",
    images: ["/og-image.jpg"],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
