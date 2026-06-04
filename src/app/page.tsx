import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BelowFold from "@/components/BelowFold";
import WhatsAppPopup from "@/components/WhatsAppPopup";

export const metadata: Metadata = {
  title: "DJW Pickleball Factory | Custom OEM Paddles & Wholesale Balls Direct",
  description:
    "Direct from China factory: USAPA-approved T700/T800 carbon fiber pickleball paddles, roto-molded balls. Custom OEM/ODM, low MOQ, DDP shipping to 30+ countries. Get factory pricing today.",
  alternates: {
    canonical: "https://pickleoem.com",
  },
  openGraph: {
    title: "DJW Pickleball Factory | Custom OEM Paddles & Wholesale Direct",
    description:
      "Factory-direct USAPA-approved pickleball paddles & balls. Custom OEM, carbon fiber, DDP shipping to 30+ countries.",
    url: "https://pickleoem.com",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "DJW Pickleball Factory" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DJW Pickleball Factory | OEM Paddles & Wholesale",
    description: "Factory-direct USAPA-approved paddles & balls. Custom OEM, DDP shipping worldwide.",
    images: ["/og-image.jpg"],
  },
};

// Server Component — SSR首屏 (Navbar + Hero)，BelowFold 客户端懒加载剩余模块

// Static page — built once and cached indefinitely
export const revalidate = false;

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative selection:bg-neon selection:text-black">
      <Navbar />
      <Hero />
      <BelowFold />
      <WhatsAppPopup />
    </main>
  );
}
