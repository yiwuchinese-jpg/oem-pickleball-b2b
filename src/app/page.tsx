import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductShowcase from "@/components/ProductShowcase";
import VideoWall from "@/components/VideoWall";
import PriceAdvantage from "@/components/PriceAdvantage";
import Testimonials from "@/components/Testimonials";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative selection:bg-neon selection:text-black">
      <Navbar />
      <Hero />
      <VideoWall />
      <ProductShowcase />
      <PriceAdvantage />
      <Testimonials />
      <HowItWorks />
      <Footer />
    </main>
  );
}
