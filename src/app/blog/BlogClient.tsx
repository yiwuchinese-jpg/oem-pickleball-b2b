"use client";

import Image from "next/image";
import NextLink from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const POSTS = [
  {
    slug: "how-to-find-oem-pickleball-factory",
    title: "How to Find a Reliable OEM Pickleball Factory in China (2025 Guide)",
    excerpt:
      "Most buyers waste months switching factories. Here's the exact checklist our 300+ global clients use to verify quality, MOQ, and DDP shipping before placing their first order.",
    cover: "/gallery/gallery_17.jpg",
    date: "April 10, 2026",
    readTime: "8 min read",
    tag: "Sourcing Guide",
    tagColor: "text-neon bg-neon/10 border-neon/30",
  },
  {
    slug: "philippines-pickleball-market-2025",
    title: "Philippines Pickleball Market 2025: 18,000 Players, 277 Clubs & Where to Find Buyers",
    excerpt:
      "The Philippines is Southeast Asia's fastest-growing pickleball market. We break down player demographics, club locations, and the wholesale opportunity for distributors right now.",
    cover: "/gallery/gallery_12.jpg",
    date: "April 5, 2026",
    readTime: "6 min read",
    tag: "Market Intelligence",
    tagColor: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  },
  {
    slug: "roto-molded-vs-injection-molded-pickleball",
    title: "Roto-Molded vs. Injection-Molded Pickleballs: Why It Matters for Your Brand",
    excerpt:
      "The manufacturing method changes everything — bounce, durability, price, and USAPA compliance. Here's how to choose the right process for your OEM order.",
    cover: "/gallery/gallery_8.jpg",
    date: "March 28, 2026",
    readTime: "5 min read",
    tag: "Product Knowledge",
    tagColor: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  },
];

export default function BlogClient() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-20">
        {/* Header */}
        <div className="max-w-6xl mx-auto px-5 md:px-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-mono font-bold text-neon tracking-[0.25em] uppercase mb-4 border border-neon/30 px-4 py-1.5 rounded-full bg-neon/5">
              Factory Blog
            </span>
            <h1 className="text-5xl md:text-7xl font-black uppercase text-white leading-none tracking-tight">
              OEM{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-green-400">
                Insights
              </span>
            </h1>
            <p className="mt-5 text-gray-400 text-lg max-w-2xl">
              Sourcing guides, market data, and product knowledge for serious pickleball wholesale buyers.
            </p>
          </motion.div>
        </div>

        {/* Post Grid */}
        <div className="max-w-6xl mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-7">
          {POSTS.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="group"
            >
              <NextLink href={`/blog/${post.slug}`} className="block h-full">
                {/* Cover */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-white/5">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Tag */}
                  <span className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${post.tagColor}`}>
                    {post.tag}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {post.date}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-white font-black text-lg leading-snug mb-3 group-hover:text-neon transition-colors">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Read more */}
                <span className="inline-flex items-center gap-1.5 text-neon text-sm font-bold group-hover:gap-3 transition-all">
                  Read Article <ArrowRight className="w-4 h-4" />
                </span>
              </NextLink>
            </motion.article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="max-w-6xl mx-auto px-5 md:px-8 mt-20 text-center">
          <div className="bg-neon/5 border border-neon/20 rounded-3xl p-10 md:p-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to Start Your OEM Order?
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              WhatsApp us directly — most inquiries get a price quote within 5 minutes.
            </p>
            <button
              onClick={() => {
                const text = encodeURIComponent("Hi, I read your blog and I want to inquire about OEM pickleball pricing.");
                window.open(`https://wa.me/8618666680913?text=${text}`, "_blank");
              }}
              className="inline-flex items-center gap-2 bg-neon text-black px-8 py-4 rounded-full font-bold text-base shadow-[0_0_30px_rgba(57,255,20,0.3)] hover:bg-white transition-colors"
            >
              💬 WhatsApp for Factory Quote
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
