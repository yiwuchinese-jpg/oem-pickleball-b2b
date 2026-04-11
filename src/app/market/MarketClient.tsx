"use client";

import { motion } from "framer-motion";
import {
  TrendingUp, Users, MapPin, DollarSign, AlertTriangle,
  CheckCircle2, MessageCircle, Building2, ShoppingBag, Video,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MARKET_STATS = [
  { num: "18,000", label: "Registered Players", sub: "Philippines 2025", icon: Users, color: "text-neon" },
  { num: "277", label: "Active Clubs", sub: "as of Oct 2025", icon: Building2, color: "text-blue-400" },
  { num: "+132%", label: "Awareness Growth", sub: "PH 2024 vs 2023 — #2 in SEA", icon: TrendingUp, color: "text-neon" },
  { num: "$3B+", label: "Global Market 2030E", sub: "From $1.61B in 2024", icon: DollarSign, color: "text-yellow-400" },
  { num: "30", label: "SM Mall Courts", sub: "Out of 86 total malls", icon: MapPin, color: "text-red-400" },
  { num: "₱10,000", label: "Import Duty Threshold", sub: "Key competitive moat", icon: AlertTriangle, color: "text-orange-400" },
];

const PRICE_TIERS = [
  { range: "₱300–700", label: "Wood / Cheapest White-Label", recommendation: "Avoid", color: "bg-red-500/10 border-red-500/20 text-red-400" },
  { range: "₱700–1,500", label: "Entry White-Label / Fakes Hotbed", recommendation: "High risk, low trust", color: "bg-orange-500/10 border-orange-500/20 text-orange-400" },
  { range: "₱1,500–3,000", label: "Bundle Main Battleground ⭐", recommendation: "Recommended entry point", color: "bg-neon/10 border-neon/20 text-neon" },
  { range: "₱3,000–7,000", label: "Carbon Mid-Range ⭐", recommendation: "Key differentiation zone", color: "bg-neon/10 border-neon/30 text-neon" },
  { range: "₱7,000–15,000", label: "Local Distributor Official Brands", recommendation: "Expensive, non-COD", color: "bg-white/5 border-white/10 text-gray-400" },
  { range: "₱15,000+", label: "Direct Import Flagships (taxed)", recommendation: "Import duty barrier applies", color: "bg-white/5 border-white/10 text-gray-400" },
];

const OPPORTUNITIES = [
  {
    icon: ShoppingBag,
    title: "B2C: Bundle Starter Sets",
    priority: "🔴 Highest Volume",
    desc: "2 paddles + 4 balls + carry bag. This is the #1 best-selling format on Shopee PH. New players don't know what to buy — bundles eliminate the decision. Target COD + J&T nationwide shipping.",
    moq: "Start at 50 sets",
  },
  {
    icon: Building2,
    title: "B2B: Court Operator Supply",
    priority: "🟢 Blue Ocean",
    desc: "SM Mall, Robinsons, Ayala Malls all have pickleball courts. Each court burns through 50–100 balls per month. Approach court managers directly for monthly supply contracts. Stable, recurring revenue.",
    moq: "500–1000 balls/month",
  },
  {
    icon: TrendingUp,
    title: "Mid-Range Carbon Paddle",
    priority: "⭐ Sweet Spot",
    desc: "The ₱2,500–5,000 range is where trust and price intersect. Buyers here are upgrading from white-label junk. They want USAPA-approved specs, weight precision, and a brand story. This is us.",
    moq: "MOQ 100 pcs",
  },
  {
    icon: Video,
    title: "TikTok Shop Philippines",
    priority: "🟡 Fast Growing",
    desc: "TikTok Shop PH supports pickleball paddle sales. Unboxing + real-court testing content drives discovery. Partner with TikTok creators to review your products → drive to TikTok Shop checkout.",
    moq: "Start with 50–100 units",
  },
];

const PAIN_POINTS = [
  {
    product: "Paddle",
    issue: "Delamination (分层)",
    insight: "Most OEM brands fake thermoforming with cold-press + foam fill. Our solution: true hot-press bonding at controlled temperatures.",
  },
  {
    product: "Paddle",
    issue: "Weight Inconsistency",
    insight: "Same model, different units can vary 15g+ on cheap OEM lines. Buyers hate it. Our ±3g precision is our strongest differentiator.",
  },
  {
    product: "Paddle",
    issue: "Edge Guard Peeling",
    insight: "30°C+ heat accelerates adhesive failure 3× faster (source: Picklefox research). Tropical-grade adhesive is a must for PH market.",
  },
  {
    product: "Ball",
    issue: "Cracking on Hard Courts",
    insight: "SM Mall courts are paved parking lots. Standard PP balls crack in 3–10 sessions. Enhanced PP blend with wall-thickness consistency is the answer.",
  },
  {
    product: "Ball",
    issue: "Going Out of Round",
    insight: "Rotational molding quality control gaps create uneven wall thickness → asymmetric bounce. Our process has ±0.5mm wall tolerance.",
  },
  {
    product: "Ball",
    issue: "Low Visibility",
    insight: "Outdoor parking lot courts have mixed lighting. Fluorescent orange/yellow balls are an emerging trend — and currently underserved.",
  },
];

export default function MarketClient() {
  const whatsapp = () => {
    window.open(`https://wa.me/8618666680913?text=${encodeURIComponent("Hi, I'm interested in wholesale supply for the Philippines market.")}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-neon)_0%,_transparent_60%)] opacity-5" />
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 bg-neon/10 text-neon text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 border border-neon/20">
              <TrendingUp className="w-3 h-3" /> 2026 Market Intelligence Report
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight uppercase mb-6">
              Pickleball Philippines<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-green-400">
                Is Exploding.
              </span>
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mb-8">
              18,000 registered players. 277 clubs. 132% awareness growth in one year.
              And import duties that create a massive structural advantage for local wholesale suppliers.
            </p>
            <p className="text-sm text-gray-600">
              Data sources: PPF Wikipedia · ABS-CBN Feb 2026 · UPA Asia × YouGov Research · Reddit r/PickleballPhilippines · Shopee PH · Global Pickleball Federation
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Market Stats ── */}
      <section className="py-16 px-4 bg-deep-blue border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {MARKET_STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-background/60 border border-white/8 rounded-2xl p-5 text-center"
              >
                <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2`} />
                <p className={`text-2xl md:text-3xl font-black ${stat.color}`}>{stat.num}</p>
                <p className="text-white text-xs font-bold mt-1">{stat.label}</p>
                <p className="text-gray-600 text-[10px] mt-0.5">{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Import Duty Moat ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase text-center mb-6 tracking-tight">
            The <span className="text-neon">₱10,000 Moat</span>
          </h2>
          <p className="text-gray-400 text-center text-lg max-w-2xl mx-auto mb-12">
            Philippine customs automatically taxes international orders above ₱10,000. This single rule eliminates Six Zero, CRBN, Selkirk, and Franklin as real competitors in the mid-range wholesale space.
          </p>
          <div className="bg-[#0d0d10] border border-white/8 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-6">
                <p className="text-red-400 font-bold text-lg mb-3">🇺🇸 US Direct Brands</p>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>• Six Zero: ₱8,000–18,000 (taxed above ₱10K)</li>
                  <li>• CRBN: ₱9,000–22,000 (heavy customs on import)</li>
                  <li>• Selkirk: ₱12,000–25,000 (most subject to import duty)</li>
                  <li className="text-red-400 font-bold pt-2">→ Real cost after duty: 1.3×–1.5× listed price</li>
                </ul>
              </div>
              <div className="bg-neon/5 border border-neon/20 rounded-2xl p-6">
                <p className="text-neon font-bold text-lg mb-3">🏭 Your Local Wholesale (Us)</p>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>• Mid carbon paddle DDP to PH: ₱2,500–5,000</li>
                  <li>• Well below ₱10K threshold per unit</li>
                  <li>• Bulk orders DDP — customs handled by us</li>
                  <li className="text-neon font-bold pt-2">→ Buyers pay one price. Zero hidden costs.</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/8 pt-6 text-center">
              <p className="text-white font-bold text-lg mb-1">Competitive Analysis Result:</p>
              <p className="text-gray-400">
                In the ₱3,000–8,000 segment, you face <span className="text-white font-bold">zero brand competition</span> from genuine US premium paddles. Your only competition is other Chinese OEM sellers — and they don&apos;t have your quality documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Price Tier Map ── */}
      <section className="py-20 px-4 bg-deep-blue border-y border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase text-center mb-12">
            Philippines Price <span className="text-neon">Tier Map</span>
          </h2>
          <div className="space-y-3">
            {PRICE_TIERS.map((tier) => (
              <div
                key={tier.range}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl border ${tier.color}`}
              >
                <div>
                  <span className="font-black text-lg">{tier.range}</span>
                  <span className="text-sm ml-3 opacity-70">{tier.label}</span>
                </div>
                <span className="text-xs font-bold opacity-80">{tier.recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pain Points ── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-white uppercase text-center mb-4 tracking-tight">
            The Real <span className="text-neon">Buyer Pain Points</span>
          </h2>
          <p className="text-gray-400 text-center mb-14 text-lg max-w-2xl mx-auto">
            Scraped from Reddit r/PickleballPhilippines, Shopee PH reviews, and PPF Facebook groups. This is what buyers are <em>actually</em> complaining about.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PAIN_POINTS.map((point, i) => (
              <motion.div
                key={point.issue}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#0d0d10] border border-white/8 rounded-2xl p-6 hover:border-neon/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-white/5 px-2 py-1 rounded">
                    {point.product}
                  </span>
                </div>
                <h3 className="text-red-400 font-bold text-lg mb-3">⚠️ {point.issue}</h3>
                <div className="border-t border-white/5 pt-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-neon flex-shrink-0 mt-0.5" />
                    <p className="text-gray-400 text-sm leading-relaxed">{point.insight}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Opportunities ── */}
      <section className="py-24 px-4 bg-deep-blue border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-white uppercase text-center mb-16 tracking-tight">
            Top <span className="text-neon">Opportunities</span> Right Now
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {OPPORTUNITIES.map((opp, i) => (
              <motion.div
                key={opp.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-background/50 border border-white/8 rounded-3xl p-8 hover:border-neon/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="w-12 h-12 bg-neon/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <opp.icon className="w-6 h-6 text-neon" />
                  </div>
                  <span className="text-sm font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-gray-300">
                    {opp.priority}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mb-3">{opp.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-5">{opp.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-neon text-sm font-bold">{opp.moq}</span>
                  <button
                    onClick={whatsapp}
                    className="flex items-center gap-1.5 bg-[#25D366] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#1ebe5d] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Discuss →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase">
          The Market Is Ready.<br />
          <span className="text-neon">Are You?</span>
        </h2>
        <p className="text-gray-400 text-xl max-w-xl mx-auto mb-10">
          The window to establish a local pickleball brand in the Philippines is 12–24 months. Early movers capture the distribution channels and court supply contracts. Let&apos;s talk.
        </p>
        <button
          onClick={whatsapp}
          className="inline-flex items-center gap-3 bg-neon text-black font-black px-10 py-5 rounded-full text-xl shadow-[0_0_40px_rgba(57,255,20,0.4)] hover:scale-105 transition-transform"
        >
          <MessageCircle className="w-6 h-6" /> I Want to Enter This Market
        </button>
      </section>

      <Footer />
    </div>
  );
}
