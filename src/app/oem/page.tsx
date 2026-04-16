import type { Metadata } from "next";
import OemClient from "./OemClient";

export const metadata: Metadata = {
  title: "OEM & Custom Pickleball | Private Label Factory — Yiwu China",
  description:
    "Full OEM/ODM pickleball paddle and ball manufacturing. Custom logo, T700/T800 carbon fiber selection, packaging design. Sample in 7 days. DDP shipping worldwide.",
  alternates: {
    canonical: "https://pickleoem.com/oem",
  },
  openGraph: {
    title: "OEM & Custom Pickleball | Private Label Factory — Yiwu China",
    description: "Custom logo, T700/T800 carbon fiber, packaging design. Sample in 7 days. DDP worldwide.",
    url: "https://pickleoem.com/oem",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "OEM Custom Pickleball Manufacturing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OEM & Custom Pickleball | Private Label Factory",
    description: "Custom logo, T700/T800 carbon fiber, packaging. Sample in 7 days.",
    images: ["/og-image.jpg"],
  },
};

export default function OemPage() {
  return <OemClient />;
}
