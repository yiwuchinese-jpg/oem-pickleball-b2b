"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, ShieldCheck, Package, Zap, X, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Product Data ─────────────────────────────────────────────────────────────
type Category = "ALL" | "PADDLE" | "BALL" | "BUNDLE";

interface Product {
  id: number;
  imgSrc: string;
  name: string;
  category: "PADDLE" | "BALL" | "BUNDLE";
  tag?: string;
  specs: { label: string; value: string }[];
  moq: string;
  badge?: string;
}

const PRODUCTS: Product[] = [
  // ── Paddles (1–14) ───────────────────────────────
  {
    id: 1, imgSrc: "/products/1.png", name: "Pro Carbon Series A", category: "PADDLE",
    tag: "Best Seller", badge: "USAPA Approved",
    specs: [
      { label: "Carbon Fiber", value: "T700 3K" },
      { label: "Thickness", value: "16mm" },
      { label: "Weight", value: "225 ± 3g" },
      { label: "Surface", value: "Thermoformed" },
    ],
    moq: "MOQ 100 pcs",
  },
  {
    id: 2, imgSrc: "/products/2.png", name: "Elite Power Paddle", category: "PADDLE",
    badge: "USAPA Approved",
    specs: [
      { label: "Carbon Fiber", value: "T800 12K" },
      { label: "Thickness", value: "14mm" },
      { label: "Weight", value: "215 ± 3g" },
      { label: "Surface", value: "Thermoformed" },
    ],
    moq: "MOQ 100 pcs",
  },
  {
    id: 3, imgSrc: "/products/3.png", name: "Control Series 16mm", category: "PADDLE",
    specs: [
      { label: "Carbon Fiber", value: "T700 3K" },
      { label: "Thickness", value: "16mm" },
      { label: "Weight", value: "230 ± 3g" },
      { label: "Surface", value: "Thermoformed" },
    ],
    moq: "MOQ 100 pcs",
  },
  {
    id: 4, imgSrc: "/products/4.png", name: "Spin Master Pro", category: "PADDLE",
    tag: "High Spin",
    specs: [
      { label: "Carbon Fiber", value: "T700 12K" },
      { label: "Thickness", value: "16mm" },
      { label: "Weight", value: "220 ± 3g" },
      { label: "Surface", value: "Raw Carbon" },
    ],
    moq: "MOQ 100 pcs",
  },
  {
    id: 5, imgSrc: "/products/5.png", name: "Entry Carbon Paddle", category: "PADDLE",
    tag: "Budget-Friendly",
    specs: [
      { label: "Carbon Fiber", value: "T700 3K" },
      { label: "Thickness", value: "13mm" },
      { label: "Weight", value: "240 ± 5g" },
      { label: "Surface", value: "Standard" },
    ],
    moq: "MOQ 200 pcs",
  },
  {
    id: 6, imgSrc: "/products/6.png", name: "Power Graphite Series", category: "PADDLE",
    specs: [
      { label: "Material", value: "Graphite Face" },
      { label: "Thickness", value: "14mm" },
      { label: "Weight", value: "235 ± 5g" },
      { label: "Core", value: "Polymer Honeycomb" },
    ],
    moq: "MOQ 200 pcs",
  },
  {
    id: 7, imgSrc: "/products/7.png", name: "Ultralight Series", category: "PADDLE",
    tag: "Feather Light",
    specs: [
      { label: "Carbon Fiber", value: "T800 3K" },
      { label: "Thickness", value: "16mm" },
      { label: "Weight", value: "205 ± 3g" },
      { label: "Surface", value: "Thermoformed" },
    ],
    moq: "MOQ 100 pcs",
  },
  {
    id: 8, imgSrc: "/products/8.png", name: "Dual-Texture Pro", category: "PADDLE",
    specs: [
      { label: "Carbon Fiber", value: "T700 3K" },
      { label: "Thickness", value: "16mm" },
      { label: "Weight", value: "225 ± 3g" },
      { label: "Grip Length", value: "5.5 inch" },
    ],
    moq: "MOQ 100 pcs",
  },
  {
    id: 9, imgSrc: "/products/9.png", name: "Tournament Edition T800", category: "PADDLE",
    tag: "Pro-Level", badge: "USAPA Approved",
    specs: [
      { label: "Carbon Fiber", value: "T800 12K" },
      { label: "Thickness", value: "16mm" },
      { label: "Weight", value: "218 ± 3g" },
      { label: "Surface", value: "Thermoformed" },
    ],
    moq: "MOQ 50 pcs",
  },
  {
    id: 10, imgSrc: "/products/10.png", name: "Classic Honeycomb Paddle", category: "PADDLE",
    specs: [
      { label: "Material", value: "Fiberglass" },
      { label: "Thickness", value: "13mm" },
      { label: "Weight", value: "250 ± 5g" },
      { label: "Core", value: "PP Honeycomb" },
    ],
    moq: "MOQ 300 pcs",
  },
  {
    id: 11, imgSrc: "/products/11.png", name: "Wide Body Control Paddle", category: "PADDLE",
    specs: [
      { label: "Carbon Fiber", value: "T700 3K" },
      { label: "Thickness", value: "16mm" },
      { label: "Weight", value: "235 ± 3g" },
      { label: "Shape", value: "Wide Body" },
    ],
    moq: "MOQ 100 pcs",
  },
  {
    id: 12, imgSrc: "/products/12.png", name: "Elongated Reach Series", category: "PADDLE",
    specs: [
      { label: "Carbon Fiber", value: "T700 3K" },
      { label: "Thickness", value: "16mm" },
      { label: "Weight", value: "220 ± 3g" },
      { label: "Shape", value: "Elongated" },
    ],
    moq: "MOQ 100 pcs",
  },
  {
    id: 13, imgSrc: "/products/13.png", name: "Custom OEM Paddle A", category: "PADDLE",
    tag: "OEM Ready",
    specs: [
      { label: "Carbon Fiber", value: "T700 / T800" },
      { label: "Thickness", value: "14–20mm Options" },
      { label: "Weight", value: "Custom ± 3g" },
      { label: "Logo", value: "Custom Print" },
    ],
    moq: "MOQ 50 pcs",
  },
  {
    id: 14, imgSrc: "/products/14.png", name: "Custom OEM Paddle B", category: "PADDLE",
    tag: "OEM Ready",
    specs: [
      { label: "Carbon Fiber", value: "T700 / T800" },
      { label: "Thickness", value: "14–20mm Options" },
      { label: "Weight", value: "Custom ± 3g" },
      { label: "Color", value: "Full Custom" },
    ],
    moq: "MOQ 50 pcs",
  },
  // ── Balls (15–21) ────────────────────────────────
  {
    id: 15, imgSrc: "/products/15.png", name: "Outdoor 40-Hole Ball (Standard)", category: "BALL",
    tag: "Best Seller", badge: "USAPA Approved",
    specs: [
      { label: "Holes", value: "40 Standard" },
      { label: "Material", value: "Rotational Molded PP" },
      { label: "Diameter", value: "74mm ± 0.5mm" },
      { label: "Use", value: "Outdoor / Hard Court" },
    ],
    moq: "MOQ 1000 pcs",
  },
  {
    id: 16, imgSrc: "/products/16.png", name: "High-Visibility Neon Ball", category: "BALL",
    tag: "Tropical Ready",
    specs: [
      { label: "Color", value: "Fluorescent Yellow / Orange" },
      { label: "Holes", value: "40 Standard" },
      { label: "Material", value: "Rotational Molded PP" },
      { label: "Visibility", value: "High-Vis Color" },
    ],
    moq: "MOQ 1000 pcs",
  },
  {
    id: 17, imgSrc: "/products/17.png", name: "Heat-Resistant Outdoor Ball", category: "BALL",
    tag: "PH Climate Ready",
    specs: [
      { label: "Temp Resistance", value: "Up to 45°C" },
      { label: "Holes", value: "40 Standard" },
      { label: "Material", value: "Enhanced PP Blend" },
      { label: "Bounce", value: "Consistent 68–78cm" },
    ],
    moq: "MOQ 1000 pcs",
  },
  {
    id: 18, imgSrc: "/products/18.png", name: "Indoor Training Ball", category: "BALL",
    specs: [
      { label: "Holes", value: "26 Indoor Pattern" },
      { label: "Material", value: "Softer PP" },
      { label: "Weight", value: "22–23.3g" },
      { label: "Use", value: "Indoor Court" },
    ],
    moq: "MOQ 1000 pcs",
  },
  {
    id: 19, imgSrc: "/products/19.png", name: "Custom Logo Ball", category: "BALL",
    tag: "OEM Ready",
    specs: [
      { label: "Logo", value: "Laser Engraved / Pad Print" },
      { label: "Color", value: "Custom Any Pantone" },
      { label: "Holes", value: "40 Standard" },
      { label: "Cert", value: "USAPA Design" },
    ],
    moq: "MOQ 500 pcs",
  },
  {
    id: 20, imgSrc: "/products/20.png", name: "Tournament Match Ball", category: "BALL",
    badge: "USAPA Approved",
    specs: [
      { label: "Standard", value: "IFP / USAPA Match" },
      { label: "Holes", value: "40 Precision Drilled" },
      { label: "Roundness", value: "99.8% Spherical" },
      { label: "Bounce", value: "72–75cm regulated" },
    ],
    moq: "MOQ 1000 pcs",
  },
  {
    id: 21, imgSrc: "/products/21.png", name: "Bulk 12-Pack Court Supply", category: "BALL",
    tag: "Court B2B",
    specs: [
      { label: "Pack", value: "12 balls / box" },
      { label: "Target", value: "Court Operators" },
      { label: "Material", value: "Rotational Molded PP" },
      { label: "Durability", value: "200+ hours tested" },
    ],
    moq: "MOQ 500 pcs (6000 balls)",
  },
  // ── Bundles ───────────────────────────────────────
  {
    id: 22, imgSrc: "/products/1.png", name: "Starter Bundle (2 Paddles + 4 Balls)", category: "BUNDLE",
    tag: "Top Value",
    specs: [
      { label: "Includes", value: "2× Carbon Paddle" },
      { label: "Includes", value: "4× Outdoor Ball" },
      { label: "Includes", value: "1× Carry Bag" },
      { label: "MOQ Price", value: "Contact for Quote" },
    ],
    moq: "MOQ 50 sets",
  },
  {
    id: 23, imgSrc: "/products/9.png", name: "Pro Tournament Set", category: "BUNDLE",
    specs: [
      { label: "Includes", value: "1× T800 Paddle" },
      { label: "Includes", value: "6× Match Balls" },
      { label: "Includes", value: "Premium Case" },
      { label: "MOQ Price", value: "Contact for Quote" },
    ],
    moq: "MOQ 30 sets",
  },
  {
    id: 24, imgSrc: "/products/15.png", name: "Court Operator Pack", category: "BUNDLE",
    tag: "B2B Favorite",
    specs: [
      { label: "Includes", value: "100× Outdoor Balls" },
      { label: "Includes", value: "20× Paddles" },
      { label: "Use", value: "Court rental supply" },
      { label: "MOQ Price", value: "Contact for Quote" },
    ],
    moq: "MOQ 1 pack",
  },
];

const TABS: { label: string; value: Category }[] = [
  { label: "All Products", value: "ALL" },
  { label: "🏓 Paddles", value: "PADDLE" },
  { label: "🎯 Balls", value: "BALL" },
  { label: "📦 Bundles", value: "BUNDLE" },
];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ProductsClient() {
  const [active, setActive] = useState<Category>("ALL");
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = active === "ALL" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);

  const handleWhatsapp = (product?: Product) => {
    const msg = product
      ? `Hi, I'm interested in "${product.name}" — please send MOQ and factory pricing.`
      : "Hi, I'd like to get wholesale pricing on your pickleball products.";
    window.open(`https://wa.me/8618666680913?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── Hero Banner ── */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-background border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-neon)_0%,_transparent_55%)] opacity-5 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="inline-block bg-neon/10 text-neon text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 border border-neon/20">
                Factory Direct Catalog
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight uppercase">
                Paddles &<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-green-400">
                  Balls
                </span>
              </h1>
              <p className="mt-5 text-gray-400 text-lg max-w-xl">
                {PRODUCTS.length}+ factory molds. T700 / T800 carbon fiber paddles · USAPA-approved outdoor balls.
                All DDP-shipped to Philippines & Southeast Asia.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: ShieldCheck, label: "USAPA Approved" },
                { icon: Package, label: "DDP Philippines" },
                { icon: Zap, label: "5-Min Quote" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-white font-semibold">
                  <Icon className="w-4 h-4 text-neon" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter Tabs ── */}
      <section className="sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActive(tab.value)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  active === tab.value
                    ? "bg-neon text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {tab.label}
                <span className="ml-2 opacity-60 text-xs">
                  ({tab.value === "ALL" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === tab.value).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Grid ── */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="group bg-[#0d0d10] border border-white/8 rounded-3xl overflow-hidden hover:border-neon/40 transition-all duration-300 cursor-pointer hover:shadow-[0_0_30px_rgba(57,255,20,0.08)] flex flex-col"
                  onClick={() => setSelected(product)}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-white overflow-hidden">
                    {product.tag && (
                      <span className="absolute top-3 left-3 z-10 bg-neon text-black text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wide shadow">
                        {product.tag}
                      </span>
                    )}
                    {product.badge && (
                      <span className="absolute top-3 right-3 z-10 bg-black/70 text-neon text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide border border-neon/30 backdrop-blur-sm">
                        ✓ {product.badge}
                      </span>
                    )}
                    <Image
                      src={product.imgSrc}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h2 className="text-white font-bold text-sm leading-tight">{product.name}</h2>
                      <span className="flex-shrink-0 text-[10px] font-bold text-neon bg-neon/10 px-2 py-1 rounded-full border border-neon/20 whitespace-nowrap">
                        {product.category}
                      </span>
                    </div>

                    {/* Key Specs */}
                    <div className="grid grid-cols-2 gap-1.5 mb-4">
                      {product.specs.slice(0, 2).map((s) => (
                        <div key={s.label} className="bg-white/3 border border-white/5 rounded-lg px-2.5 py-1.5">
                          <p className="text-gray-500 text-[9px] uppercase tracking-wider">{s.label}</p>
                          <p className="text-white text-xs font-bold">{s.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-gray-500 text-xs font-medium">{product.moq}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleWhatsapp(product); }}
                        className="flex items-center gap-1.5 bg-[#25D366] text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-[#1ebe5d] transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> Quote
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── B2B Banner ── */}
      <section className="py-20 px-4 bg-neon/5 border-t border-neon/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Don&apos;t see what you need?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            We have 200+ molds and can produce fully custom designs. Send us your tech pack — we reply in 5 minutes via WhatsApp.
          </p>
          <button
            onClick={() => handleWhatsapp()}
            className="inline-flex items-center gap-3 bg-neon text-black font-black px-10 py-4 rounded-full text-lg shadow-[0_0_30px_rgba(57,255,20,0.3)] hover:shadow-[0_0_50px_rgba(57,255,20,0.5)] transition-all hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            Send Custom Request via WhatsApp
          </button>
        </div>
      </section>

      <Footer />

      {/* ── Product Detail Modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/40 hover:text-white p-2 bg-white/5 rounded-full transition-colors"
              onClick={() => setSelected(null)}
            >
              <X className="w-7 h-7" />
            </button>
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-3xl bg-[#0d0d10] border border-white/10 rounded-[2rem] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="relative w-full md:w-1/2 aspect-square bg-white flex-shrink-0">
                  <Image
                    src={selected.imgSrc}
                    alt={selected.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
                {/* Details */}
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold text-neon bg-neon/10 px-2.5 py-1 rounded-full border border-neon/20">
                      {selected.category}
                    </span>
                    {selected.badge && (
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                        ✓ {selected.badge}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-6">{selected.name}</h2>
                  <div className="space-y-3 mb-8">
                    {selected.specs.map((s) => (
                      <div key={s.label} className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-500 text-sm">{s.label}</span>
                        <span className="text-white font-bold text-sm">{s.value}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-gray-500 text-sm">Minimum Order</span>
                      <span className="text-neon font-bold text-sm">{selected.moq}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleWhatsapp(selected)}
                    className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white font-bold py-4 rounded-2xl text-lg hover:bg-[#1ebe5d] transition-colors shadow-[0_0_25px_rgba(37,211,102,0.3)] hover:shadow-[0_0_40px_rgba(37,211,102,0.5)]"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Ask for Factory Price
                  </button>
                  <p className="text-center text-gray-500 text-xs mt-3">
                    Usually replied within 5 minutes · DDP shipping included
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
