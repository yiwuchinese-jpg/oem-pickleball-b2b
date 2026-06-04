import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pickleball Factory Tour | Real Production Photos & Quality Control",
  description:
    "Step inside our pickleball manufacturing facility. See real production lines, quality control stations, testing equipment, and warehouse. Verify our factory before you order.",
  alternates: {
    canonical: "https://pickleoem.com/factory-tour",
  },
  openGraph: {
    title: "Pickleball Factory Tour | Real Production Photos & QC",
    description:
      "Tour our pickleball factory: production lines, QC stations, carbon fiber processing, and warehouse photos. Verify before ordering.",
    url: "https://pickleoem.com/factory-tour",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Pickleball Factory Tour" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pickleball Factory Tour | Production Photos",
    description: "Real factory photos: production lines, QC, and warehouse. Verify before you order.",
    images: ["/og-image.jpg"],
  },
};

export default function FactoryTourLayout({ children }: { children: React.ReactNode }) {
  return children;
}
