"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShieldCheck, Thermometer, Weight, Award, Factory,
  CheckCircle2, Clock, Globe, MessageCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TIMELINE = [
  { year: "2012", event: "Factory founded in Yiwu, Zhejiang — started with badminton equipment" },
  { year: "2015", event: "Expanded into racket sports OEM, first export to USA distributor" },
  { year: "2019", event: "Dedicated pickleball production line established. First USAPA-spec paddles produced" },
  { year: "2021", event: "Introduced Thermoformed (热压) production — in response to delamination complaints from OEM brands" },
  { year: "2022", event: "Launched tropical-grade edge adhesive system — specifically for Southeast Asia & Philippines market" },
  { year: "2024", event: "Reached 10M+ pickleball units shipped. Serving 30+ countries including PH, SG, MY, TH, AU" },
  { year: "2025", event: "Became preferred supplier for 3 PPF-recognised clubs in Manila. B2B court supply program launched" },
];

const QUALITY_PILLARS = [
  {
    icon: ShieldCheck,
    title: "USAPA Specification Compliance",
    desc: "All paddles are produced to USAPA dimensional and material standards — surface roughness, face size, and edge profile all meet regulation specs. We provide full test documentation.",
    stat: "100% spec-compliant production",
  },
  {
    icon: Weight,
    title: "±3g Weight Precision",
    desc: "Weight inconsistency is the #1 complaint in Reddit reviews and Shopee PH feedback. We use a precision pre-production weighing protocol with a tolerance tighter than most Chinese competitors (±3g vs industry-standard ±8–10g).",
    stat: "±3g guaranteed on every unit",
  },
  {
    icon: Thermometer,
    title: "Tropical-Grade Edge Guard",
    desc: "Tested for 45°C sustained outdoor use — the failure point for most Chinese OEM edge adhesives. Our edge guard system was specifically redesigned for Southeast Asian outdoor courts (SM Mall parking lots, open-air venues).",
    stat: "Rated for 45°C / 6+ months outdoor",
  },
  {
    icon: Factory,
    title: "True Thermoformed Construction",
    desc: "Unlike OEM brands that use cold-press with foam-fill to fake thermoformed feel, we use actual hot-press bonding with temperature-controlled dies. This eliminates delamination — the most severe quality issue in the market.",
    stat: "Zero foam-fill shortcuts",
  },
];

const CERTS = [
  { name: "USAPA Specification Compliant", icon: "🏆", sub: "Materials & dimensions" },
  { name: "ISO 9001:2015", icon: "📋", sub: "Quality management system" },
  { name: "SGS Material Test", icon: "🔬", sub: "Carbon fiber verification" },
  { name: "REACH Compliance", icon: "✅", sub: "Chemical safety certified" },
  { name: "FCC / CE Ready", icon: "📡", sub: "For electronic accessories" },
];

export default function AboutClient() {
  const whatsapp = () => {
    window.open(`https://wa.me/8618666680913?text=${encodeURIComponent("Hi, I'd like to learn more about your factory and get a quote.")}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--color-neon)_0%,_transparent_55%)] opacity-5" />
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-block bg-neon/10 text-neon text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 border border-neon/20">
              Yiwu, Zhejiang, China
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight uppercase mb-6">
              Not a Middleman.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-green-400">
                The Factory.
              </span>
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mb-10">
              We know the &ldquo;OEM = fake paddle&rdquo; reputation problem is real. That&apos;s why we built 
              our entire quality system around exactly what the Reddit/Shopee reviews complain about most.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {[
              { num: "13+", label: "Years in production" },
              { num: "10M+", label: "Units shipped" },
              { num: "30+", label: "Countries served" },
              { num: "2019", label: "Pickleball dedicated line" },
            ].map(({ num, label }) => (
              <div key={label} className="bg-white/3 border border-white/8 rounded-2xl p-5 text-center">
                <p className="text-3xl md:text-4xl font-black text-neon">{num}</p>
                <p className="text-gray-500 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Trust Problem ── */}
      <section className="py-20 px-4 bg-deep-blue border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase">
            We Know What Buyers in the Philippines <span className="text-neon">Are Afraid Of</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-left mt-12">
            {[
              {
                problem: "\"Delamination after 1 month\"",
                source: "Reddit r/Pickleball — most upvoted complaint",
                our: "We use true hot-press thermoforming, not foam-fill cold press. Zero delamination warranty.",
              },
              {
                problem: "\"Weight not as described\"",
                source: "Shopee PH 1-star reviews",
                our: "Every paddle is individually weighed. ±3g precision. Weight printed on the actual paddle.",
              },
              {
                problem: "\"Edge guard peeled in 3 weeks\"",
                source: "Philippine Facebook groups",
                our: "Tropical-specific adhesive rated for 45°C. Tested for 6 months outdoor Manila use.",
              },
            ].map(({ problem, source, our }) => (
              <div key={problem} className="bg-background/60 border border-white/8 rounded-2xl p-6">
                <p className="text-red-400 font-bold text-lg mb-1 italic">{problem}</p>
                <p className="text-gray-600 text-xs mb-4">— {source}</p>
                <div className="border-t border-white/5 pt-4 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-neon flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">{our}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quality Pillars ── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase text-center mb-16 tracking-tight">
            Quality <span className="text-neon">Commitments</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {QUALITY_PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0d0d10] border border-white/8 rounded-3xl p-8 hover:border-neon/30 transition-colors"
              >
                <div className="w-12 h-12 bg-neon/10 rounded-2xl flex items-center justify-center mb-5">
                  <pillar.icon className="w-6 h-6 text-neon" />
                </div>
                <h3 className="text-xl font-black text-white mb-3">{pillar.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-5">{pillar.desc}</p>
                <div className="inline-block bg-neon/10 border border-neon/20 text-neon text-sm font-bold px-4 py-2 rounded-full">
                  {pillar.stat}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certifications ── */}
      <section className="py-20 px-4 bg-deep-blue border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-10 uppercase">
            Certifications & <span className="text-neon">Compliance</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {CERTS.map((cert) => (
              <div key={cert.name} className="flex items-center gap-3 bg-background/60 border border-white/10 px-5 py-4 rounded-2xl">
                <span className="text-2xl">{cert.icon}</span>
                <div className="text-left">
                  <p className="text-white font-bold text-sm">{cert.name}</p>
                  <p className="text-gray-500 text-xs">{cert.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Factory Timeline ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-white uppercase text-center mb-16">
            Our <span className="text-neon">Story</span> & Real Factory
          </h2>
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Timeline */}
            <div className="relative flex-1">
              <div className="absolute left-[18px] md:left-[22px] top-0 bottom-0 w-px bg-gradient-to-b from-neon via-neon/30 to-transparent" />
              <div className="space-y-8">
                {TIMELINE.map((item, i) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-6 items-start pl-2"
                  >
                    <div className="flex-shrink-0 w-9 h-9 bg-neon/10 border-2 border-neon/40 rounded-full flex items-center justify-center relative z-10">
                      <Clock className="w-4 h-4 text-neon" />
                    </div>
                    <div className="bg-white/3 border border-white/5 rounded-2xl px-5 py-4 flex-1">
                      <span className="text-neon font-black text-sm font-mono">{item.year}</span>
                      <p className="text-gray-300 mt-1 text-sm leading-relaxed">{item.event}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Factory Images */}
            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
              {["/gallery/gallery_8.jpg", "/gallery/gallery_9.jpg", "/gallery/gallery_5.jpg", "/gallery/gallery_6.jpg", "/gallery/gallery_7.jpg"].map((src, i) => (
                <motion.div 
                  key={src}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative rounded-2xl overflow-hidden border border-white/10 ${i === 4 ? "col-span-2 aspect-[21/9]" : "aspect-square"}`}
                >
                  <Image src={src} alt="Factory Production & Shipping" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 33vw" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Philippines Choose Us ── */}
      <section className="py-20 px-4 bg-neon/5 border-y border-neon/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase">
            Why Philippine Buyers <span className="text-neon">Choose Us</span> Over Local Shopee Sellers
          </h2>
          <p className="text-gray-400 mb-12 text-lg max-w-2xl mx-auto">
            Ordering above ₱10,000 from overseas attracts Philippine import duties — which eliminates most direct competition from Six Zero, CRBN, etc. Our DDP pricing means you pay one price, guaranteed, no surprise duties.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: "DDP Philippines", desc: "We handle customs, import duties, and last-mile delivery. You pay one price. No surprises." },
              { icon: Award, title: "True USAPA Specs", desc: "Full spec documentation available. PPF tournament buyers can verify compliance." },
              { icon: MessageCircle, title: "WhatsApp Direct", desc: "Talk directly to the factory — not a trading company or reseller. 5-minute reply guaranteed." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-background/60 border border-white/10 rounded-2xl p-6">
                <Icon className="w-8 h-8 text-neon mb-4" />
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
          <button
            onClick={whatsapp}
            className="mt-12 inline-flex items-center gap-3 bg-neon text-black font-black px-10 py-4 rounded-full text-lg shadow-[0_0_30px_rgba(57,255,20,0.3)] hover:scale-105 transition-transform"
          >
            <MessageCircle className="w-5 h-5" /> Talk to the Factory
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
