import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VR Factory Tour | 360° Virtual Pickleball Factory Walkthrough",
  description:
    "Explore our pickleball factory in 360° VR. Walk through production floors, QC labs, and warehouse — all from your browser. No visit needed to verify our facility.",
  alternates: {
    canonical: "https://pickleoem.com/vr-tour",
  },
  openGraph: {
    title: "VR Factory Tour | 360° Pickleball Factory Walkthrough",
    description:
      "360° virtual tour of our pickleball factory. Explore production lines, QC labs, and warehouse from your browser.",
    url: "https://pickleoem.com/vr-tour",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "VR Pickleball Factory Tour" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VR Factory Tour | 360° Walkthrough",
    description: "360° virtual tour of our pickleball factory. No visit needed.",
    images: ["/og-image.jpg"],
  },
};

export default function VRTourLayout({ children }: { children: React.ReactNode }) {
  return children;
}
