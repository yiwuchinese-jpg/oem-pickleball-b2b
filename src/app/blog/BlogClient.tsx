"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, Tag, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const POSTS_PER_PAGE = 9;

const CATEGORY_COLORS: Record<string, string> = {
  "Market Insights": "text-neon bg-neon/10 border-neon/30",
  "Industry News": "text-blue-400 bg-blue-400/10 border-blue-400/30",
  "Factory Tips": "text-orange-400 bg-orange-400/10 border-orange-400/30",
  "Product Guides": "text-purple-400 bg-purple-400/10 border-purple-400/30",
  "Default": "text-gray-400 bg-gray-400/10 border-gray-400/30"
};

const ALL_CATEGORIES = ["All", "Market Insights", "Industry News", "Factory Tips", "Product Guides"];

export default function BlogClient({ initialPosts }: { initialPosts?: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Map incoming data
  const allPosts = useMemo(() => {
    if (!initialPosts) return [];
    return initialPosts.map((p) => {
      const cat = p.category || "Industry News"; // Fallback category
      return {
        slug: p.slug,
        title: p.title,
        excerpt: p.description || "Click to read more about this topic.",
        cover: p.coverUrl || "/gallery/gallery_17.jpg",
        date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }) : "Recently",
        readTime: "5 min read",
        tag: cat,
        tagColor: CATEGORY_COLORS[cat] || CATEGORY_COLORS["Default"],
        rawCategory: cat
      };
    });
  }, [initialPosts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || post.rawCategory === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allPosts, searchQuery, selectedCategory]);

  // Paginate posts
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE) || 1;
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  // Event handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-20">
        {/* Header */}
        <div className="max-w-6xl mx-auto px-5 md:px-8 mb-12">
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

        {/* Filters & Search */}
        <div className="max-w-6xl mx-auto px-5 md:px-8 mb-12 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-neon text-black"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/50 transition-all placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Post Grid */}
        <div className="max-w-6xl mx-auto px-5 md:px-8 min-h-[400px]">
          {paginatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              <AnimatePresence mode="popLayout">
                {paginatedPosts.map((post, i) => (
                  <motion.article
                    key={post.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
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
                          loading={i < 3 ? "eager" : "lazy"}
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
              </AnimatePresence>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex flex-col items-center justify-center py-20 text-gray-500"
            >
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg">No articles found matching your criteria.</p>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="mt-4 text-neon hover:underline text-sm"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="max-w-6xl mx-auto px-5 md:px-8 mt-16 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-full border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-1.5 px-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                    currentPage === page 
                      ? "bg-neon text-black" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-full border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="max-w-6xl mx-auto px-5 md:px-8 mt-24 text-center">
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
