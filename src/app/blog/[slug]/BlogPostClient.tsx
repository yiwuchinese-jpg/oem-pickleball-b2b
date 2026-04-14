"use client";

import Image from "next/image";
import NextLink from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const POST_CONTENT: Record<string, any> = {
  "how-to-find-oem-pickleball-factory": {
    title: "How to Find a Reliable OEM Pickleball Factory in China (2025 Guide)",
    cover: "/gallery/gallery_17.jpg",
    date: "April 10, 2026",
    readTime: "8 min read",
    tag: "Sourcing Guide",
    tagColor: "text-neon bg-neon/10 border-neon/30",
    content: (
      <>
        <p>Finding a reliable pickleball paddle factory in China can be overwhelming. Many trading companies pose as manufacturers, offering inflated prices and poor communication. If you want to build a profitable brand or supply your club, you need a true OEM partner.</p>
        
        <h2>1. Manufacturer vs. Trading Company</h2>
        <p>The first step is verifying if you are talking to a factory or a middleman. Ask for a live video tour of their production line, especially the roto-molding machines and raw carbon fiber storage. A real factory will gladly show you this (just like our 24/7 live cams).</p>
        
        <h2>2. MOQ and Customization Capabilities</h2>
        <p>A good OEM partner should be flexible but realistic. Standard MOQ for custom designs usually starts at 500-1,000 pieces to cover the initial mold and setup costs. Ask if they offer T700 or customized Kevlar faces.</p>
        
        <h2>3. Request a Sample Pack First</h2>
        <p>Never place a bulk order without testing samples. We always encourage clients to request our $50 sample pack, which includes different surface textures and core thicknesses so you can verify the USAPA-level quality firsthand.</p>
        
        <h2>4. Logistics and DDP Shipping</h2>
        <p>Unless you have your own freight forwarder, look for factories that offer DDP (Delivery Duty Paid). This means the factory handles customs, taxes, and final delivery to your door or Amazon FBA warehouse seamlessly.</p>
      </>
    ),
  },
  "philippines-pickleball-market-2025": {
    title: "Philippines Pickleball Market 2025: 18,000 Players, 277 Clubs & Where to Find Buyers",
    cover: "/gallery/gallery_12.jpg",
    date: "April 5, 2026",
    readTime: "6 min read",
    tag: "Market Intelligence",
    tagColor: "text-orange-400 bg-orange-400/10 border-orange-400/30",
    content: (
      <>
        <p>The Philippines is currently experiencing a massive pickleball boom, making it one of the most lucrative wholesale markets in Southeast Asia for 2025 and 2026.</p>

        <h2>The Data: Explosive Growth</h2>
        <p>According to recent sports association data, active players have surged past 18,000, with over 277 dedicated courts and clubs operating nationwide. Metro Manila, Cebu, and Davao are leading the charge.</p>

        <h2>Who is Buying?</h2>
        <p>The demand is split between three main groups:</p>
        <ul>
          <li><strong>Club Owners:</strong> Needing bulk 40-hole outdoor balls and durable rental paddles.</li>
          <li><strong>Local Retailers:</strong> Looking for mid-tier carbon fiber paddles with custom localized branding.</li>
          <li><strong>Tournament Directors:</strong> Seeking high-quality, consistent tournament balls.</li>
        </ul>

        <h2>How to Enter as a Distributor</h2>
        <p>If you are looking to become a distributor in the Philippines, the key is locking in a low factory-direct rate (like our $0.20/pc balls). With retail prices often hitting $2-3 locally, the margin is incredible for early local suppliers.</p>
      </>
    ),
  },
  "roto-molded-vs-injection-molded-pickleball": {
    title: "Roto-Molded vs. Injection-Molded Pickleballs: Why It Matters for Your Brand",
    cover: "/gallery/gallery_8.jpg",
    date: "March 28, 2026",
    readTime: "5 min read",
    tag: "Product Knowledge",
    tagColor: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    content: (
      <>
        <p>When sourcing pickleballs wholesale, the most critical decision is the manufacturing process. It defines the durability, bounce, and whether the ball will get USAPA approval.</p>

        <h2>Injection Molding (The Cheaper Option)</h2>
        <p>Injection-molded balls are made by fusing two distinct halves. You will usually see a seam down the middle. While cheaper, these balls are prone to cracking at the seam, especially in colder weather. They are okay for casual play but unsuitable for tournaments.</p>

        <h2>Roto-Molding (The Premium Standard)</h2>
        <p>Rotational molding creates a single, seamless hollow ball. Hot plastic is spun inside a mold, ensuring even wall thickness and absolutely no weak points. This results in superior durability and a consistent, true bounce.</p>

        <h2>Our Factory Standard</h2>
        <p>We strictly use the roto-molding process for all our 40-hole outdoor balls. By optimizing our production lines in Yiwu, we have brought the cost of these premium roto-molded balls down to just $0.20/pc — allowing you to sell tournament-grade balls at injection-molded prices.</p>
      </>
    ),
  },
};

export default function BlogPostClient({ slug }: { slug: string }) {
  const post = POST_CONTENT[slug];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-20">
        <article className="max-w-4xl mx-auto px-5 md:px-8">
          {/* Back button */}
          <NextLink
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-10 text-sm font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </NextLink>

          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
              <span className={`px-3 py-1 rounded-full border text-[10px] uppercase font-bold tracking-widest ${post.tagColor}`}>
                {post.tag}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {post.readTime}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" /> {post.date}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-8">
              {post.title}
            </h1>
            
            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden bg-white/5 shadow-2xl">
              <Image
                src={post.cover}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-p:text-gray-300 prose-a:text-neon hover:prose-a:text-white transition-colors prose-li:text-gray-300">
            {post.content}
          </div>

          {/* CTA Banner */}
          <div className="mt-20 bg-neon/5 border border-neon/20 rounded-3xl p-8 md:p-12 text-center">
            <h3 className="text-2xl font-black text-white mb-4">Want to source this quality for your brand?</h3>
            <p className="text-gray-400 mb-6">Contact our factory directly on WhatsApp for an instant MOQ and pricing quote.</p>
            <button
              onClick={() => {
                const text = encodeURIComponent(`Hi, I read your article "${post.title}" and want to get wholesale pricing.`);
                window.open(`https://wa.me/8618666680913?text=${text}`, "_blank");
              }}
              className="inline-flex items-center gap-2 bg-neon text-black px-8 py-4 rounded-full font-bold text-sm hover:bg-white transition-colors shadow-[0_0_20px_rgba(57,255,20,0.3)]"
            >
              💬 Request Factory Quote
            </button>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
