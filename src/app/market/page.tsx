import type { Metadata } from "next";
import MarketClient from "./MarketClient";

export const metadata: Metadata = {
  title: "Pickleball Market in Philippines & Southeast Asia 2026 | Wholesale Guide",
  description:
    "In-depth market data: 18,000 registered players, 277 clubs, 132% awareness growth in Philippines. Why import duties make local wholesale a massive opportunity.",
  alternates: {
    canonical: "https://pickleoem.com/market",
  },
  openGraph: {
    title: "Pickleball Market Philippines & Southeast Asia 2026",
    description: "18,000 players, 277 clubs, 132% growth. The complete Philippines pickleball market data for wholesale buyers.",
    url: "https://pickleoem.com/market",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Philippines Pickleball Market Data 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pickleball Market Philippines & SEA 2026",
    description: "18,000 players, 277 clubs, 132% growth. Complete market data for wholesale buyers.",
    images: ["/og-image.jpg"],
  },
};

export default function MarketPage() {
  return <MarketClient />;
}
