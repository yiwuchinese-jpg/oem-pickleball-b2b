"use client";

import Image from "next/image";
import NextLink from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BlogPostClient({ post }: { post: any }) {
  const displayPost = {
    title: post.title,
    cover: post.coverUrl || "/gallery/gallery_17.jpg",
    date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }) : "Recently",
    readTime: "5 min read",
    tag: "Industry News",
    tagColor: "text-neon bg-neon/10 border-neon/30",
    htmlContent: post.htmlContent || `<p>${post.description || "No content provided."}</p>`
  };

  const cleanHtml = displayPost.htmlContent
    .replace(/<a([^>]*)>(.*?(?:Browse|Explore|Contact|Quote|WhatsApp|Shop|Buy).*?)<\/a>/gi, '<a$1 class="ai-cta-button">$2</a>')
    .replace(/background-color\s*:\s*[^;"']+/gi, 'background-color:transparent')
    .replace(/(?<![a-z-])color\s*:\s*[^;"']+/gi, 'color:inherit');

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
              <span className={`px-3 py-1 rounded-full border text-[10px] uppercase font-bold tracking-widest ${displayPost.tagColor}`}>
                {displayPost.tag}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {displayPost.readTime}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" /> {displayPost.date}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-8">
              {displayPost.title}
            </h1>
            
            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden bg-white/5 shadow-2xl">
              <Image
                src={displayPost.cover}
                alt={displayPost.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </header>

          {/* Content */}
          <div 
            className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-p:text-gray-300 prose-a:text-neon hover:prose-a:text-white transition-colors prose-li:text-gray-300 prose-td:text-gray-300 prose-th:text-white prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
          />

          {/* CTA Banner */}
          <div className="mt-20 bg-neon/5 border border-neon/20 rounded-3xl p-8 md:p-12 text-center">
            <h3 className="text-2xl font-black text-white mb-4">Want to source this quality for your brand?</h3>
            <p className="text-gray-400 mb-6">Contact our factory directly on WhatsApp for an instant MOQ and pricing quote.</p>
            <button
              onClick={() => {
                const text = encodeURIComponent(`Hi, I read your article "${displayPost.title}" and want to get wholesale pricing.`);
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
