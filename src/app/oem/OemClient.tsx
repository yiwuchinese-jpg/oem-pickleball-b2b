"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle, CheckCircle2, ChevronDown, ChevronUp,
  Layers, Palette, Package, Globe, Zap, ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Carbon Fiber Selector Data ───────────────────────────────────────────────
const CARBON_GRADES = [
  {
    grade: "T700 3K", price: "$", performance: 72, spin: 70, power: 75, control: 80,
    best: "Entry to mid-range retail", tags: ["Budget-Friendly", "Lightweight", "USAPA Approved"],
    desc: "Most popular grade for wholesale. Excellent stiffness-to-weight ratio — ideal for bulk Shopee/TikTok Shop listings.",
  },
  {
    grade: "T700 12K", price: "$$", performance: 80, spin: 88, power: 78, control: 76,
    best: "High-spin mid-range", tags: ["High Spin", "Raw Texture", "Popular"],
    desc: "12K weave creates a rough surface texture that maximizes spin. The go-to for players who rely on dink shots and spin serves.",
  },
  {
    grade: "T800 3K", price: "$$$", performance: 90, spin: 82, power: 90, control: 85,
    best: "Premium single paddle", tags: ["Pro-Level", "Stiff & Powerful", "Tournament Ready"],
    desc: "Higher modulus carbon for more power transfer and less vibration. Popular for tournament-level builds and premium brand lines.",
  },
  {
    grade: "T800 12K", price: "$$$$", performance: 96, spin: 95, power: 92, control: 90,
    best: "Top-tier brand flagship", tags: ["Flagship", "USAPA Tournament", "Max Performance"],
    desc: "The best of both worlds — top-grade carbon with high-spin 12K weave. Used by Six Zero, CRBN-level brand equivalents.",
  },
];

const OEM_STEPS = [
  {
    num: "01", icon: MessageCircle, title: "Send Your Brief",
    desc: "Share your logo, target price point, quantity, and any design references. WhatsApp or email — we reply in under 5 minutes.",
    detail: "No need for a formal tech pack. A rough idea and logo file is enough to get started.",
  },
  {
    num: "02", icon: Layers, title: "Choose Specs",
    desc: "Select carbon grade (T700/T800), thickness (14/16/20mm), shape (standard/wide/elongated), weight target, and grip length.",
    detail: "Our team advises on the optimal combination for your target market segment.",
  },
  {
    num: "03", icon: Palette, title: "Design & Mockup",
    desc: "Our in-house design team creates a digital mockup within 24 hours. Review colors, logo placement, and edge guard style.",
    detail: "Unlimited revisions on digital mockup before we produce any physical sample.",
  },
  {
    num: "04", icon: Package, title: "Physical Sample (7 Days)",
    desc: "We produce 1–3 physical samples for your approval. Review feel, weight accuracy (±3g), and finish quality.",
    detail: "Sample cost is deducted from your first bulk order. DHL/FedEx express sample shipping available.",
  },
  {
    num: "05", icon: Globe, title: "Bulk Production + DDP",
    desc: "On approval, full production begins. Your order is shipped DDP — all customs, duties, and taxes handled by us.",
    detail: "Production lead time: 25–35 days depending on quantity. Real-time factory video updates provided.",
  },
];

const FAQS = [
  {
    q: "What is the minimum order quantity for OEM paddles?",
    a: "Minimum 50 pcs for OEM paddles with custom logo. For full custom shape/mold, MOQ is 500 pcs. Balls start at 500 pcs for custom logo.",
  },
  {
    q: "Do your paddles pass USAPA approval?",
    a: "Yes — we can produce paddles that meet USAPA specifications. We provide the test documentation and spec sheets. Official USAPA listing requires the buyer to register the paddle under their brand name.",
  },
  {
    q: "What payment terms do you accept?",
    a: "We accept T/T (telegraphic transfer), PayPal for sample fees, and L/C for orders above $50,000. 30% deposit on order, 70% before shipment is standard.",
  },
  {
    q: "Can you handle Philippine customs / import duties?",
    a: "Yes — our DDP service means we handle all export from China AND import into the Philippines. You receive the goods at your door with all taxes paid. This is our most popular shipping option for Philippine buyers.",
  },
  {
    q: "How long does it take to get a sample?",
    a: "7 business days for a paddle sample from a confirmed design. Balls are 5 days. DHL express shipping to Philippines takes 3–5 additional days.",
  },
  {
    q: "What about edge guard quality in hot climates?",
    a: "We use heat-resistant adhesive rated for 50°C, specifically because of tropical market demand. Our edge guards are tested for 6 months of outdoor use in 35°C+ conditions — a direct response to Philippine/Southeast Asia climate requirements.",
  },
];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function OemClient() {
  const [selectedGrade, setSelectedGrade] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const whatsapp = (msg?: string) => {
    const text = msg ?? "Hi, I'm interested in OEM/custom pickleball manufacturing. Can we discuss?";
    window.open(`https://wa.me/8618666680913?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--color-neon)_0%,_transparent_50%)] opacity-5" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block bg-neon/10 text-neon text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 border border-neon/20">
              OEM & ODM Manufacturing
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight uppercase mb-6">
              Your Brand.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-green-400">
                Our Factory.
              </span>
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mb-10">
              We manufacture private-label pickleball paddles and balls for brands in 30+ countries.
              From concept to DDP delivery in your door — fully handled.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => whatsapp()}
                className="flex items-center gap-3 bg-neon text-black font-black px-8 py-4 rounded-full text-lg shadow-[0_0_30px_rgba(57,255,20,0.3)] hover:scale-105 transition-transform"
              >
                <MessageCircle className="w-5 h-5" /> Start OEM Discussion
              </button>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-4 rounded-full text-white font-bold">
                <Zap className="w-4 h-4 text-neon" /> Sample in 7 Days
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Row ── */}
      <section className="py-12 border-y border-white/5 bg-deep-blue">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { num: "200+", label: "Mold Options" },
            { num: "30+", label: "Countries Served" },
            { num: "7 Days", label: "Sample Lead Time" },
            { num: "±3g", label: "Weight Precision" },
          ].map(({ num, label }) => (
            <div key={label} className="text-center">
              <p className="text-4xl md:text-5xl font-black text-neon">{num}</p>
              <p className="text-gray-400 text-sm mt-1 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Carbon Fiber Selector ── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
              Choose Your <span className="text-neon">Carbon Grade</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Every grade delivers a different feel. We help you match the right spec to your target market.
            </p>
          </div>

          {/* Grade Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {CARBON_GRADES.map((g, i) => (
              <button
                key={g.grade}
                onClick={() => setSelectedGrade(i)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                  selectedGrade === i
                    ? "bg-neon text-black shadow-[0_0_15px_rgba(57,255,20,0.4)]"
                    : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                }`}
              >
                {g.grade}
              </button>
            ))}
          </div>

          {/* Selected Grade Detail */}
          <motion.div
            key={selectedGrade}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#0d0d10] border border-white/10 rounded-3xl p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-3xl font-black text-white">{CARBON_GRADES[selectedGrade].grade}</h3>
                  <span className="text-neon font-black text-xl">{CARBON_GRADES[selectedGrade].price}</span>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {CARBON_GRADES[selectedGrade].desc}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Best for: <span className="text-white font-bold">{CARBON_GRADES[selectedGrade].best}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {CARBON_GRADES[selectedGrade].tags.map((t) => (
                    <span key={t} className="text-xs bg-neon/10 text-neon border border-neon/20 px-3 py-1 rounded-full font-bold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Overall Performance", val: CARBON_GRADES[selectedGrade].performance },
                  { label: "Spin Potential", val: CARBON_GRADES[selectedGrade].spin },
                  { label: "Power", val: CARBON_GRADES[selectedGrade].power },
                  { label: "Control", val: CARBON_GRADES[selectedGrade].control },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{label}</span>
                      <span className="text-white font-bold">{val}/100</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-neon to-green-400 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10">
              <button
                onClick={() => whatsapp(`Hi, I'm interested in OEM paddles using ${CARBON_GRADES[selectedGrade].grade} carbon fiber. Please advise on MOQ and pricing.`)}
                className="flex items-center gap-2 bg-[#25D366] text-white font-bold px-8 py-3.5 rounded-full hover:bg-[#1ebe5d] transition-colors shadow-[0_0_20px_rgba(37,211,102,0.3)]"
              >
                <MessageCircle className="w-4 h-4" />
                Get Quote for {CARBON_GRADES[selectedGrade].grade}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── OEM Steps ── */}
      <section className="py-24 px-4 bg-deep-blue border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
              The OEM <span className="text-neon">Process</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              From your first WhatsApp message to goods at your warehouse — here&apos;s exactly how it works.
            </p>
          </div>
          <div className="space-y-4">
            {OEM_STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 bg-background/50 border border-white/5 rounded-2xl p-6 hover:border-neon/20 transition-colors group"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-neon/10 border border-neon/20 rounded-2xl flex items-center justify-center group-hover:bg-neon/20 transition-colors">
                  <step.icon className="w-6 h-6 text-neon" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-neon font-black text-sm font-mono">{step.num}</span>
                    <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  </div>
                  <p className="text-gray-400 mb-2">{step.desc}</p>
                  <p className="text-gray-600 text-sm italic">{step.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Customize ── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight text-center mb-16">
            Everything is <span className="text-neon">Customizable</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Palette, title: "Logo & Branding", items: ["Pad printing", "Hot stamping", "Laser engraving", "Sublimation"] },
              { icon: Layers, title: "Carbon Spec", items: ["T700 / T800", "3K / 12K weave", "14 / 16 / 20mm thickness", "Raw vs matte finish"] },
              { icon: Package, title: "Packaging", items: ["Custom box design", "Sleeve packaging", "Retail hang-tag", "Multi-language inserts"] },
              { icon: ShieldCheck, title: "Certifications", items: ["USAPA spec compliance", "Material test docs", "Weight certification", "QC video report"] },
              { icon: Globe, title: "Shipping", items: ["DDP any country", "Philippines customs handled", "FedEx / DHL samples", "Sea freight bulk"] },
              { icon: Zap, title: "Balls Customization", items: ["Any Pantone color", "Custom 40-hole pattern", "Logo laser engraved", "6 / 12 / 100 pack"] },
            ].map(({ icon: Icon, title, items }) => (
              <div key={title} className="bg-[#0d0d10] border border-white/8 rounded-3xl p-6 hover:border-neon/30 transition-colors group">
                <div className="w-12 h-12 bg-neon/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-neon/20 transition-colors">
                  <Icon className="w-6 h-6 text-neon" />
                </div>
                <h3 className="text-white font-bold text-lg mb-4">{title}</h3>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-400 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-neon flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-4 bg-deep-blue border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black text-white uppercase text-center mb-12">
            OEM <span className="text-neon">FAQ</span>
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-background/60 border border-white/8 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-white font-semibold pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-neon flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                <AnimatePresenceWrapper show={openFaq === i}>
                  <div className="px-6 pb-5 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                </AnimatePresenceWrapper>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase">
          Ready to Build <span className="text-neon">Your Brand?</span>
        </h2>
        <p className="text-gray-400 text-xl max-w-xl mx-auto mb-10">
          Send us your logo or idea. We&apos;ll have a mockup ready in 24 hours and a sample in your hands within 2 weeks.
        </p>
        <button
          onClick={() => whatsapp()}
          className="inline-flex items-center gap-3 bg-neon text-black font-black px-10 py-5 rounded-full text-xl shadow-[0_0_40px_rgba(57,255,20,0.4)] hover:scale-105 transition-transform"
        >
          <MessageCircle className="w-6 h-6" /> Start on WhatsApp — Free
        </button>
      </section>

      <Footer />
    </div>
  );
}

// Simple collapse wrapper
function AnimatePresenceWrapper({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return <>{children}</>;
}
