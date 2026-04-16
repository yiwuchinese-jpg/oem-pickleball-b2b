import type { Metadata } from "next";
import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Products | OEM Pickleball Factory — Paddles & Balls Wholesale",
  description:
    "Full catalog of USAPA-approved pickleball paddles (T700 carbon fiber) and outdoor balls. MOQ 1000 pcs. DDP shipping to Philippines & Southeast Asia.",
  alternates: {
    canonical: "https://pickleoem.com/products",
  },
  openGraph: {
    title: "Products | OEM Pickleball Factory — Paddles & Balls Wholesale",
    description: "T700 carbon fiber paddles, USAPA-approved balls. MOQ 1000 pcs. DDP shipping to Philippines & SEA.",
    url: "https://pickleoem.com/products",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Pickleball Wholesale Products Catalog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Products | OEM Pickleball Factory — Paddles & Balls Wholesale",
    description: "T700 carbon fiber paddles, USAPA-approved balls. MOQ 1000 pcs.",
    images: ["/og-image.jpg"],
  },
};

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsClient />
    </Suspense>
  );
}
