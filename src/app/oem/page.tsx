import type { Metadata } from "next";
import OemClient from "./OemClient";

export const metadata: Metadata = {
  title: "OEM & Custom Pickleball | Private Label Factory — Yiwu China",
  description:
    "Full OEM/ODM pickleball paddle and ball manufacturing. Custom logo, T700/T800 carbon fiber selection, packaging design. Sample in 7 days. DDP shipping worldwide.",
};

export default function OemPage() {
  return <OemClient />;
}
