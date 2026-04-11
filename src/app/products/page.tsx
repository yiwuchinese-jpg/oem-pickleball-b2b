import type { Metadata } from "next";
import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export const metadata: Metadata = {
  title: "Products | OEM Pickleball Factory — Paddles & Balls Wholesale",
  description:
    "Full catalog of USAPA-approved pickleball paddles (T700 carbon fiber) and outdoor balls. MOQ 1000 pcs. DDP shipping to Philippines & Southeast Asia.",
};

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsClient />
    </Suspense>
  );
}
