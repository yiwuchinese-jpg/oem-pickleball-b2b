import type { Metadata } from "next";
import MarketClient from "./MarketClient";

export const metadata: Metadata = {
  title: "Pickleball Market in Philippines & Southeast Asia 2026 | Wholesale Guide",
  description:
    "In-depth market data: 18,000 registered players, 277 clubs, 132% awareness growth in Philippines. Why import duties make local wholesale a massive opportunity.",
};

export default function MarketPage() {
  return <MarketClient />;
}
