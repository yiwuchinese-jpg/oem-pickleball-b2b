"use client";

import NextLink from "next/link";
import { motion } from "framer-motion";
import { Package, Settings, Factory, TrendingUp, ArrowRight } from "lucide-react";

const SITE_SECTIONS = [
  {
    href: "/products",
    icon: Package,
    tag: "24+ SKUs",
    title: "Full Product Catalog",
    desc: "Browse all paddles, balls, and bundle sets with specs, MOQ, and instant WhatsApp pricing.",
    color: "from-neon/20 to-transparent",
    borderColor: "hover:border-neon/40",
    glowColor: "shadow-[0_0_40px_rgba(57,255,20,0.1)]",
  },
  {
    href: "/oem",
    icon: Settings,
    tag: "T700 · T800 · Custom",
    title: "OEM & Private Label",
    desc: "Your logo on our paddles. Choose carbon grade, thickness, color. Sample in 7 days.",
    color: "from-blue-500/20 to-transparent",
    borderColor: "hover:border-blue-400/40",
    glowColor: "shadow-[0_0_40px_rgba(96,165,250,0.05)]",
  },
  {
    href: "/about",
    icon: Factory,
    tag: "Yiwu · Est. 2012",
    title: "About The Factory",
    desc: "Why our quality is different: thermoformed construction, ±3g weight precision, and tropical-grade edge adhesive.",
    color: "from-purple-500/20 to-transparent",
    borderColor: "hover:border-purple-400/40",
    glowColor: "shadow-[0_0_40px_rgba(168,85,247,0.05)]",
  },
  {
    href: "/market",
    icon: TrendingUp,
    tag: "Philippines · SEA",
    title: "Market Intelligence",
    desc: "18,000 players. 277 clubs. 132% growth. The complete Philippines pickleball market data for buyers & distributors.",
    color: "from-orange-500/20 to-transparent",
    borderColor: "hover:border-orange-400/40",
    glowColor: "shadow-[0_0_40px_rgba(249,115,22,0.05)]",
  },
];

export default function SiteNavSection() {
  return (
    <section className="py-24 px-4 bg-deep-blue border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block bg-neon/10 text-neon text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 border border-neon/20">
            Explore More
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            Everything You Need<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-green-400">
              In One Place
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {SITE_SECTIONS.map((section, i) => (
            <motion.div
              key={section.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <NextLink
                href={section.href}
                className={`group flex flex-col h-full bg-gradient-to-br ${section.color} bg-[#0d0d10] border border-white/8 rounded-3xl p-7 transition-all duration-300 ${section.borderColor} hover:${section.glowColor} hover:-translate-y-1`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-white/20 transition-colors">
                    <section.icon className="w-6 h-6 text-neon" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 bg-white/5 px-2.5 py-1 rounded-full">
                    {section.tag}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mb-3 group-hover:text-neon transition-colors">
                  {section.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1">
                  {section.desc}
                </p>
                <div className="flex items-center gap-2 text-neon text-sm font-bold">
                  Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </NextLink>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
