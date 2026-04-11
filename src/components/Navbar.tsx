"use client";

import { useState, useEffect } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { trackCTAClick, trackWhatsAppOpen } from "@/lib/analytics";

const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "OEM & Custom", href: "/oem" },
  { label: "About Factory", href: "/about" },
  { label: "Market Insights", href: "/market" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleCTA = () => {
    const text = encodeURIComponent("Hi, I want to get wholesale pricing for pickleballs.");
    trackCTAClick("Navbar_CTA");
    trackWhatsAppOpen("Navbar_CTA");
    window.open(`https://wa.me/8618666680913?text=${text}`, "_blank");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? "bg-background/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.2)] border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <NextLink href="/" className="flex-shrink-0">
              <span className="text-lg md:text-2xl font-black tracking-tighter text-white flex items-center gap-1 md:gap-2">
                <span className="text-neon uppercase tracking-widest text-[10px] md:text-sm bg-neon/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                  OEM
                </span>
                PICKLEBALL
              </span>
            </NextLink>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NextLink
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 group ${
                    pathname === link.href
                      ? "text-neon"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-neon/10 rounded-lg border border-neon/20"
                    />
                  )}
                </NextLink>
              ))}
            </div>

            {/* Right: CTA + Hamburger */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleCTA}
                className="bg-neon text-black font-bold px-4 py-1.5 md:px-6 md:py-2.5 rounded-full hover:bg-neon-hover transition-colors shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:shadow-[0_0_25px_rgba(57,255,20,0.6)] transform hover:scale-105 duration-200 text-xs md:text-base whitespace-nowrap"
              >
                <span className="sm:hidden">Quote</span>
                <span className="hidden sm:inline">Get Wholesale Price</span>
              </button>

              {/* Hamburger (mobile) */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-background/98 backdrop-blur-xl border-b border-white/10 lg:hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <NextLink
                    href={link.href}
                    className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-base font-bold transition-colors ${
                      pathname === link.href
                        ? "bg-neon/10 text-neon border border-neon/20"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.label}
                    <span className="text-gray-600">→</span>
                  </NextLink>
                </motion.div>
              ))}

              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
                <button
                  onClick={handleCTA}
                  className="w-full bg-neon text-black font-bold py-4 rounded-xl text-base shadow-[0_0_20px_rgba(57,255,20,0.3)]"
                >
                  💬 WhatsApp for Wholesale Price
                </button>
                <a
                  href="mailto:buydiscoball@gmail.com"
                  className="w-full bg-white/5 text-white font-bold py-3.5 rounded-xl text-base text-center border border-white/10"
                >
                  ✉️ Send Email Inquiry
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
