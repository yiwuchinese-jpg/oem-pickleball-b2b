import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Our Factory | Yiwu OEM Pickleball Manufacturer — Quality & Trust",
  description:
    "Yiwu-based pickleball manufacturer with USAPA-compliant production, heat-resistant edge guard technology, and ±3g weight precision. Trusted by brands in 30+ countries.",
};

export default function AboutPage() {
  return <AboutClient />;
}
