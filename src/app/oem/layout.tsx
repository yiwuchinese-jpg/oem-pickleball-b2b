import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OEM Pickleball Paddle Manufacturer | Custom Paddle Factory China",
  description:
    "Custom pickleball paddle OEM/ODM factory. T700/T800 carbon fiber, 16mm thermoforming, custom edge guard & grip design. Low MOQ, DDP shipping worldwide. Get a quote in 24h.",
  alternates: {
    canonical: "https://pickleoem.com/oem",
  },
  openGraph: {
    title: "OEM Pickleball Paddle Manufacturer | Custom Paddle Factory",
    description:
      "Custom pickleball paddle OEM/ODM factory in China. T700/T800 carbon fiber, 16mm thermoforming. Low MOQ, DDP shipping worldwide.",
    url: "https://pickleoem.com/oem",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "OEM Pickleball Paddle Factory" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OEM Pickleball Paddle Manufacturer | Custom Factory",
    description: "Custom pickleball paddle OEM/ODM factory in China. Low MOQ, DDP shipping worldwide.",
    images: ["/og-image.jpg"],
  },
};

export default function OEMLayout({ children }: { children: React.ReactNode }) {
  return children;
}
