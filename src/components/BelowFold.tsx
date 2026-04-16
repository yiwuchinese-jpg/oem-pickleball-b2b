"use client";

import dynamic from "next/dynamic";

// Lazy-load all below-the-fold heavy components
const VideoWall = dynamic(() => import("@/components/VideoWall"), {
  ssr: false,
  loading: () => <div className="h-screen bg-[#050505] border-t border-white/5" />,
});
const ProductShowcase = dynamic(() => import("@/components/ProductShowcase"), {
  ssr: false,
  loading: () => <div className="min-h-[120vh] bg-[#050505] border-t border-white/5" />,
});
const PriceAdvantage = dynamic(() => import("@/components/PriceAdvantage"), { ssr: false });
const PhotoGallery = dynamic(() => import("@/components/PhotoGallery"), { ssr: false });
const Testimonials = dynamic(() => import("@/components/Testimonials"), { ssr: false });
const HowItWorks = dynamic(() => import("@/components/HowItWorks"), { ssr: false });
const SiteNavSection = dynamic(() => import("@/components/SiteNavSection"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export default function BelowFold() {
  return (
    <>
      <PhotoGallery />
      <VideoWall />
      <ProductShowcase />
      <PriceAdvantage />
      <Testimonials />
      <HowItWorks />
      <SiteNavSection />
      <Footer />
    </>
  );
}
