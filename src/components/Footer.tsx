"use client";

import NextLink from "next/link";
import { MessageCircle, Mail, MapPin } from "lucide-react";
import { trackCTAClick, trackWhatsAppOpen, trackEmailClick } from "@/lib/analytics";

const NAV_SECTIONS = [
  {
    title: "Products",
    links: [
      { label: "Carbon Fiber Paddles", href: "/products?cat=PADDLE" },
      { label: "Outdoor Balls", href: "/products?cat=BALL" },
      { label: "Starter Bundles", href: "/products?cat=BUNDLE" },
      { label: "Full Catalog", href: "/products" },
    ],
  },
  {
    title: "OEM & Custom",
    links: [
      { label: "Private Label Paddles", href: "/oem" },
      { label: "Custom Logo Balls", href: "/oem" },
      { label: "Carbon Grade Guide", href: "/oem#carbon" },
      { label: "OEM Process", href: "/oem#process" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About the Factory", href: "/about" },
      { label: "Quality Commitments", href: "/about#quality" },
      { label: "Certifications", href: "/about#certs" },
    ],
  },
  {
    title: "Market Intelligence",
    links: [
      { label: "Philippines Market 2026", href: "/market" },
      { label: "Price Tier Guide", href: "/market#tiers" },
      { label: "Top Opportunities", href: "/market#opportunities" },
      { label: "Import Duty Guide", href: "/market#duty" },
    ],
  },
];

export default function Footer() {
  const whatsappUrl = "https://wa.me/8618666680913?text=Hi, I saw your pickleball website, I want to get wholesale pricing...";

  return (
    <>
      <footer id="inquiry" data-track-section="Footer" className="bg-background pt-20 pb-32 lg:pb-12 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top: Brand + Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
            {/* Brand */}
            <div>
              <NextLink href="/" className="inline-block mb-6">
                <span className="text-xl font-black tracking-tighter text-white flex items-center gap-2">
                  <span className="text-neon uppercase tracking-widest text-[10px] bg-neon/10 px-2 py-1 rounded">
                    DJW
                  </span>
                  PICKLEBALL
                </span>
              </NextLink>
              <h2 className="text-2xl font-black text-white mb-4">
                GET THE FACTORY PRICE NOW.
                <span className="block text-neon">STOP OVERPAYING.</span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-sm text-sm">
                Leading manufacturer in Yiwu, China. We supply the fastest growing pickleball brands in Philippines,
                Southeast Asia, and 30+ countries worldwide. MOQ 1,000 pcs (Balls) / 50 pcs (Paddles).
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 text-neon flex-shrink-0" />
                  Yiwu, Zhejiang, China (Pickleball Manufacturing Hub)
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Mail className="w-4 h-4 text-neon flex-shrink-0" />
                  <a href="mailto:buydiscoball@gmail.com" className="hover:text-neon transition">
                    buydiscoball@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-2">Start WhatsApp Chat</h3>
              <p className="text-gray-400 mb-6 text-sm">
                Get a quote usually within <span className="font-bold text-white">5 minutes</span>.
                DDP Philippines available.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  trackCTAClick("Footer_WhatsApp");
                  trackWhatsAppOpen("Footer_WhatsApp");
                }}
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 rounded-xl font-bold text-base hover:bg-[#20BE59] hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp Us Now
              </a>
              <div className="mt-4 flex items-center justify-between">
                <span className="h-px bg-white/10 flex-1" />
                <span className="px-4 text-gray-500 text-sm font-bold">OR</span>
                <span className="h-px bg-white/10 flex-1" />
              </div>
              <a
                href="mailto:buydiscoball@gmail.com"
                onClick={() => trackEmailClick("Footer_Email")}
                className="w-full flex items-center justify-center gap-3 bg-white/10 text-white py-3.5 mt-4 rounded-xl font-bold text-base hover:bg-white/20 transition-colors"
              >
                <Mail className="w-5 h-5 text-gray-300" /> Send Email Inquiry
              </a>
            </div>
          </div>

          {/* Nav Link Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-12 mb-12">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title}>
                <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <NextLink
                        href={link.href}
                        className="text-gray-500 text-sm hover:text-neon transition-colors"
                      >
                        {link.label}
                      </NextLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-gray-600 text-xs gap-4">
            <p>© {new Date().getFullYear()} Direct China Pickleball Wholesale · Yiwu, China · All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
              Factory Operating Normal
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-xl border-t border-white/10 z-50 lg:hidden flex gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            trackCTAClick("MobileSticky_WhatsApp");
            trackWhatsAppOpen("MobileSticky_WhatsApp");
          }}
          className="flex-1 bg-[#25D366] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
        >
          <MessageCircle className="w-5 h-5" /> Chat WhatsApp
        </a>
        <a
          href="mailto:buydiscoball@gmail.com"
          onClick={() => trackEmailClick("MobileSticky_Email")}
          className="bg-white/10 text-white p-3.5 rounded-xl flex items-center justify-center border border-white/20"
        >
          <Mail className="w-5 h-5" />
        </a>
      </div>
    </>
  );
}
