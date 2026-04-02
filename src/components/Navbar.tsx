"use client";

import { useState, useEffect } from "react";
import { Link } from "lucide-react";
import { motion } from "framer-motion";
import { trackCTAClick, trackWhatsAppOpen } from "@/lib/analytics";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCTA = () => {
    const text = encodeURIComponent("Hi, I want to get wholesale pricing for pickleballs.");
    trackCTAClick("Navbar_CTA");
    trackWhatsAppOpen("Navbar_CTA");
    window.open(`https://wa.me/8618666680913?text=${text}`, "_blank");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo / Brand Name */}
          <div className="flex-shrink-0 cursor-pointer">
            <h1 className="text-lg md:text-2xl font-black tracking-tighter text-white flex items-center gap-1 md:gap-2">
              <span className="text-neon uppercase tracking-widest text-[10px] md:text-sm bg-neon/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                OEM
              </span>
              PICKLEBALL
            </h1>
          </div>

          {/* Desktop Badges (hidden on mobile) */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <span className="text-gray-300 flex items-center gap-2">
              🏭 Direct China Factory
            </span>
            <span className="text-gray-300 flex items-center gap-2">
              📦 MOQ 1000 pcs
            </span>
            <span className="text-gray-300 flex items-center gap-2">
              🚢 DDP Shipping
            </span>
          </div>

          {/* CTA Button */}
          <div className="flex-shrink-0">
            <button
              onClick={handleCTA}
              className="bg-neon text-black font-bold px-4 py-1.5 md:px-6 md:py-2.5 rounded-full hover:bg-neon-hover transition-colors shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:shadow-[0_0_25px_rgba(57,255,20,0.6)] transform hover:scale-105 duration-200 text-xs md:text-base whitespace-nowrap"
            >
              <span className="sm:hidden">Get Quote</span>
              <span className="hidden sm:inline">Get Wholesale Price</span>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
