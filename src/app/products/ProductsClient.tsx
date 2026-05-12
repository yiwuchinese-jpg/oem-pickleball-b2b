"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronDown, Phone, Mail, ShoppingCart, Star, Clock, ShieldCheck, Flame } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Product as DbProduct, ProductSku } from "@/lib/supabase";
import Link from "next/link";
import { trackWhatsAppOpen, trackEmailClick } from "@/lib/analytics";

type Category = "ALL" | "PADDLE" | "BALL" | "BUNDLE";
type SortOption = "newest" | "price_asc" | "price_desc";

export type DbProductWithSkus = DbProduct & { product_skus: ProductSku[] };

// ─── Helper: get min price from SKUs (price_cents is already PHP cents) ────────
function getMinPriceCents(skus: ProductSku[]): number {
  if (!skus || skus.length === 0) return 0;
  return Math.min(...skus.map((s) => s.price_cents));
}

// Simulated Marquee Data
const RECENT_PURCHASES = [
  "🎉 Orders over ₱2,800 get a ₱280 Shipping Coupon! Contact support to claim.",
  "🔥 Juan from Manila just bought 3K Carbon Paddle",
  "⚡ Maria from Cebu just bought Pickleball 36-Pack Bucket",
  "⭐ Pedro from Quezon City rated us 5 stars",
  "🔥 45 people are viewing this page right now",
  "📦 12 orders shipped to Philippines today",
  "⚡ Mark from Davao just bought Pro Tournament Pickleballs",
];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ProductsClient({
  initialProducts = [],
}: {
  initialProducts?: DbProductWithSkus[];
}) {
  const [activeCategory, setActiveCategory] = useState<Category>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 59, seconds: 59 });

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 }; // Reset
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ── Filter + Search + Sort ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...initialProducts];

    // Category filter
    if (activeCategory !== "ALL") {
      list = list.filter((p) => p.category === activeCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "price_asc") {
      list.sort(
        (a, b) =>
          getMinPriceCents(a.product_skus) - getMinPriceCents(b.product_skus)
      );
    } else if (sortBy === "price_desc") {
      list.sort(
        (a, b) =>
          getMinPriceCents(b.product_skus) - getMinPriceCents(a.product_skus)
      );
    }
    return list;
  }, [initialProducts, activeCategory, sortBy, searchQuery]);

  const handleCategoryClick = useCallback((cat: Category) => {
    setActiveCategory(cat);
    setSearchQuery(""); // clear search when switching category
  }, []);

  const clearSearch = useCallback(() => setSearchQuery(""), []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ── Marquee / Scrolling Banner ── */}
      <div className="pt-16 md:pt-20">
        <div className="bg-neon text-black font-bold py-2 overflow-hidden flex whitespace-nowrap">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 15 }}
            className="flex items-center"
          >
            {[...RECENT_PURCHASES, ...RECENT_PURCHASES, ...RECENT_PURCHASES].map((text, i) => (
              <span key={i} className="mx-8 text-sm uppercase tracking-wide">
                {text}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Hero Header (Aggressive Conversion) ── */}
      <section className="pt-12 pb-8 px-4 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(57,255,20,0.08)_0%,transparent_70%)]" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          
          {/* Flash Sale Countdown */}
          <div className="inline-flex flex-col items-center mb-6">
            <span className="text-red-500 font-bold uppercase tracking-widest text-sm mb-2 flex items-center gap-1">
              <Clock className="w-4 h-4" /> Factory Flash Sale Ends In:
            </span>
            <div className="flex gap-2 text-2xl md:text-4xl font-black font-mono">
              <div className="bg-[#111] border border-white/10 px-3 py-2 rounded-lg text-white">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="text-neon py-2">:</span>
              <div className="bg-[#111] border border-white/10 px-3 py-2 rounded-lg text-white">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span className="text-neon py-2">:</span>
              <div className="bg-[#111] border border-red-500/30 px-3 py-2 rounded-lg text-red-500 animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-[1.1]"
          >
            Stop Paying Shopee Resellers. <br />
            <span className="text-neon bg-neon/10 px-2 rounded-lg">Buy Direct & Save 70%</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto mb-8 text-base md:text-lg leading-relaxed"
          >
            We manufacture for top global brands. Now shipping <span className="text-white font-bold">directly to the Philippines</span>. Same quality. Factory prices. DDP included.
          </motion.p>

          {/* Trust Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 md:gap-3 mb-16 md:mb-20"
          >
            <span className="bg-green-500/10 text-green-400 text-xs sm:text-sm px-4 py-2 rounded-full border border-green-500/20 font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 100% Quality Guaranteed
            </span>
            <span className="bg-blue-500/10 text-blue-400 text-xs sm:text-sm px-4 py-2 rounded-full border border-blue-500/20 font-bold flex items-center gap-1">
              ✈️ 5-8 Days to PH
            </span>
            <span className="bg-yellow-500/10 text-yellow-400 text-xs sm:text-sm px-4 py-2 rounded-full border border-yellow-500/20 font-bold flex items-center gap-1">
              ⭐️ 10,000+ Happy Players
            </span>
          </motion.div>

          {/* Category Circles */}
          <div className="flex justify-center gap-4 md:gap-16 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none">
            {[
              { label: "Paddles", value: "PADDLE" as Category, img: "/category/paddles.jpg" },
              { label: "Balls", value: "BALL" as Category, img: "/category/balls.jpg" },
              { label: "Bundles", value: "BUNDLE" as Category, img: "/category/bundles.jpg" },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                className="flex flex-col items-center group flex-shrink-0 snap-start"
              >
                <div
                  className={`w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden bg-white flex items-center justify-center p-3 md:p-4 transition-all duration-300 border-4 ${
                    activeCategory === cat.value
                      ? "border-neon shadow-[0_0_20px_rgba(57,255,20,0.5)] scale-110"
                      : "border-transparent group-hover:border-neon/50"
                  }`}
                >
                  <Image
                    src={cat.img}
                    alt={cat.label}
                    width={100}
                    height={100}
                    className="object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span
                  className={`mt-3 font-bold text-sm md:text-lg ${
                    activeCategory === cat.value
                      ? "text-neon"
                      : "text-white group-hover:text-neon"
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Search + Filter + Sort Bar ── */}
      <section className="border-t border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md sticky top-16 md:top-20 z-30 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="product-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-9 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon/50 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm whitespace-nowrap">
                <span className="text-gray-400 hidden sm:inline">Sort:</span>
                <select
                  id="product-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-[#111] border border-white/10 text-white text-sm font-medium focus:ring-0 cursor-pointer outline-none rounded-full px-3 py-2 hover:border-white/30 transition-colors"
                >
                  <option value="newest">Hot Sellers</option>
                  <option value="price_asc">Price ↑ Low to High</option>
                  <option value="price_desc">Price ↓ High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Grid ── */}
      <section className="py-12 px-4 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-white font-bold text-xl mb-2">No products found</p>
              <button
                onClick={() => { clearSearch(); setActiveCategory("ALL"); }}
                className="mt-6 px-6 py-2.5 rounded-full bg-neon text-black font-bold text-sm hover:bg-neon/90 transition-colors"
              >
                View Hot Sellers
              </button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              <AnimatePresence>
                {filtered.map((product, i) => {
                  const skus = product.product_skus || [];
                  const minPriceCents = getMinPriceCents(skus);
                  const price = (minPriceCents / 100).toFixed(2);
                  
                  const isSoldOut = skus.length > 0 ? skus.every((s) => s.stock_quantity <= 0) : false;
                  const mainImage =
                    (product.gallery_images && product.gallery_images.length > 0)
                      ? product.gallery_images[0]
                      : skus[0]?.image_url || "/products/1.png";
                  const href = `/products/${product.slug}`;

                  // 仅这两款产品开启疯狂促销模式
                  const isPromo = product.slug === '3k-carbon-fiber-pickleball-paddle' || product.slug === 'pro-tournament-pickleballs-3-pack';

                  if (isPromo) {
                    // Promotional / Aggressive Layout
                    const retailPrice = ((minPriceCents / 100) * 2.8).toFixed(2);
                    const discountPercent = Math.round((1 - (Number(price) / Number(retailPrice))) * 100);
                    const fakeStock = (product.id.charCodeAt(0) % 15) + 3;

                    return (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                      >
                        <Link
                          href={href}
                          prefetch={true}
                          scroll={true}
                          className="group bg-white rounded-2xl overflow-hidden flex flex-col transition-shadow hover:shadow-[0_0_40px_rgba(57,255,20,0.15)] border border-transparent hover:border-neon/30 h-full active:scale-[0.98] transition-all duration-200 relative"
                        >
                          {/* Discount Badge */}
                          <div className="absolute top-0 right-0 bg-red-500 text-white font-black text-xs md:text-sm px-3 py-1 rounded-bl-xl z-20 shadow-lg">
                            SAVE {discountPercent}%
                          </div>

                          {/* Image */}
                          <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-4">
                            {isSoldOut ? (
                              <span className="absolute top-3 left-3 z-10 bg-black/80 text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded uppercase tracking-wide backdrop-blur-sm">
                                Sold out
                              </span>
                            ) : (
                              <span className="absolute top-3 left-3 z-10 bg-black/80 text-neon text-[10px] md:text-xs font-bold px-3 py-1 rounded uppercase tracking-wide flex items-center gap-1 backdrop-blur-sm">
                                <Flame className="w-3 h-3 text-red-500" /> Hot Seller
                              </span>
                            )}
                            
                            <Image
                              src={mainImage}
                              alt={product.title}
                              fill
                              priority={i < 4}
                              className={`object-contain p-6 group-hover:scale-110 transition-transform duration-500 ease-out ${
                                isSoldOut ? "opacity-50" : ""
                              }`}
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              unoptimized={false}
                            />
                          </div>

                          {/* Info */}
                          <div className="p-2 md:p-4 flex flex-col flex-1 bg-white text-black relative">
                            {/* Stars - Desktop Only */}
                            <div className="hidden md:flex items-center gap-1 mb-1.5">
                              {[...Array(5)].map((_, idx) => (
                                <Star key={idx} className="w-2.5 h-2.5 md:w-3 md:h-3 fill-yellow-400 text-yellow-400" />
                              ))}
                              <span className="text-[9px] md:text-[10px] text-gray-500 ml-1">({(product.id.charCodeAt(0) * 3) + 124})</span>
                            </div>

                            <h2 className="font-bold text-xs md:text-base leading-snug mb-1 md:mb-3 min-h-0 md:min-h-[48px] line-clamp-1 md:line-clamp-2 group-hover:text-neon transition-colors">
                              {product.title}
                            </h2>

                            {/* Spacer to push content down equally */}
                            <div className="flex-1" />

                            {/* Price Area */}
                            <div className="flex flex-col w-full">
                              {/* Shopee Price & Savings - Desktop Only */}
                              <div className="hidden md:flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1.5">
                                <span className="text-[10px] md:text-xs text-gray-400 line-through">Shopee: ₱{retailPrice}</span>
                                <span className="text-[9px] md:text-[10px] text-red-500 font-bold bg-red-100 px-1.5 py-0.5 rounded w-fit">You save ₱{(Number(retailPrice) - Number(price)).toFixed(2)}</span>
                              </div>
                              
                              <div className="flex items-end justify-between mb-1 md:mb-3">
                                <div className="flex items-baseline text-red-600">
                                  <span className="font-black text-sm md:text-2xl">₱{price}</span>
                                </div>
                              </div>

                              {/* Scarcity Bar - Desktop Only */}
                              <div className="hidden md:block w-full bg-gray-100 rounded-full h-1 md:h-1.5 mb-1">
                                <div className="bg-red-500 h-1 md:h-1.5 rounded-full" style={{ width: `${(fakeStock / 20) * 100}%` }}></div>
                              </div>
                              <p className="hidden md:block text-[9px] md:text-[10px] text-red-500 font-bold">Only {fakeStock} left - order soon</p>

                              {/* Buy Button - Desktop Only */}
                              <button className="hidden md:flex w-full mt-2.5 md:mt-3 bg-black text-white text-sm md:text-base font-bold py-2 md:py-2.5 rounded-lg items-center justify-center gap-2 group-hover:bg-neon group-hover:text-black transition-colors shadow-md">
                                <ShoppingCart className="w-4 h-4" /> Buy Now
                              </button>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  }

                  // Standard / Clean Layout
                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                    >
                      <Link
                        href={href}
                        prefetch={true}
                        scroll={true}
                        className="group bg-white rounded-2xl overflow-hidden flex flex-col transition-shadow hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] h-full active:scale-[0.98] transition-transform duration-150"
                      >
                        {/* Image Area */}
                        <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-6">
                          {isSoldOut && (
                            <span className="absolute top-3 left-3 z-10 bg-gray-200 text-gray-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                              Sold out
                            </span>
                          )}
                          {!isSoldOut && product.tag && (
                            <span className="absolute top-3 left-3 z-10 bg-[#111] text-neon text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                              {product.tag}
                            </span>
                          )}
                          <Image
                            src={mainImage}
                            alt={product.title}
                            fill
                            priority={i < 4}
                            className={`object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out ${isSoldOut ? 'opacity-50' : ''}`}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            unoptimized={false}
                          />
                        </div>

                        {/* Info Area */}
                        <div className="p-2 md:p-4 flex flex-col flex-1 bg-white text-black relative">
                          {/* Stars - Desktop Only */}
                          <div className="hidden md:flex items-center gap-1 mb-1.5">
                            {[...Array(5)].map((_, idx) => (
                              <Star key={idx} className="w-2.5 h-2.5 md:w-3 md:h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="text-[9px] md:text-[10px] text-gray-500 ml-1">({(product.id.charCodeAt(0) * 3) + 124})</span>
                          </div>

                          <h2 className="font-bold text-xs md:text-base leading-snug mb-1 md:mb-3 min-h-0 md:min-h-[48px] line-clamp-1 md:line-clamp-2 group-hover:text-neon transition-colors">
                            {product.title}
                          </h2>

                          {/* Spacer to push content down equally */}
                          <div className="flex-1" />

                          <div className="flex flex-col w-full">
                            {/* Empty space matching promo card's Shopee tag + scarcity bar to keep identical height - Desktop Only */}
                            <div className="hidden md:block h-[18px] mb-1.5" /> 

                            <div className="flex items-end justify-between mb-1 md:mb-3">
                              <div className="flex items-baseline text-black">
                                <span className="text-[9px] md:text-[10px] text-gray-400 font-medium mr-1">From</span>
                                <span className="font-black text-sm md:text-2xl">₱{price}</span>
                              </div>
                              {skus.length > 1 && (
                                <span className="text-[9px] md:text-[10px] text-gray-400">
                                  {skus.length} variants
                                </span>
                              )}
                            </div>
                            
                            <div className="hidden md:block h-[14px] md:h-[16px] mb-1" /> {/* Match promo scarcity text height - Desktop Only */}

                            {/* Standard Button - Desktop Only */}
                            <button className="hidden md:flex w-full mt-2.5 md:mt-3 bg-black text-white text-sm md:text-base font-bold py-2 md:py-2.5 rounded-lg items-center justify-center gap-2 group-hover:bg-neon group-hover:text-black transition-colors shadow-md">
                              <ShoppingCart className="w-4 h-4" /> View Details
                            </button>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
