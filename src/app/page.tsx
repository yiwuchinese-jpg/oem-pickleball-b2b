import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SiteNavSection from "@/components/SiteNavSection";
import BelowFold from "@/components/BelowFold";
import WhatsAppPopup from "@/components/WhatsAppPopup";

// Server Component — SSR首屏 (Navbar + Hero)，BelowFold 客户端懒加载剩余模块
export default function Home() {
  return (
    <main className="min-h-screen bg-background relative selection:bg-neon selection:text-black">
      <Navbar />
      <Hero />
      <SiteNavSection />
      <BelowFold />
      <WhatsAppPopup />
    </main>
  );
}
