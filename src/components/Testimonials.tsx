"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Alex M.",
    role: "Club Owner, Florida",
    content: "The bounce consistency on these 40-hole outdoor balls is identical to the premium brands we used to pay $3.00 for. Getting them at wholesale factory price completely changed our court profitability.",
    imageSrc: "", // User will replace with their image path
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah T.",
    role: "Tournament Director, CA",
    content: "We ordered 10,000 custom logo balls for our state tournament. The entire DDP shipping process was handled transparently, and the quality held up over 3 days of intense pro-level play.",
    imageSrc: "",
    rating: 5,
  },
  {
    id: 3,
    name: "David K.",
    role: "Amazon Seller",
    content: "Incredible OEM partner. Their carbon fiber paddle molds are top-tier and pass all USAPA rigidity tests. The 24/7 video updates from the factory gave me total peace of mind.",
    imageSrc: "",
    rating: 5,
  },
  {
    id: 4,
    name: "Michael R.",
    role: "Retail Chain Buyer",
    content: "Consistently delivering high-volume orders without a drop in quality control. The $0.20/pc pricing for true tournament-grade balls is something you won't find anywhere else.",
    imageSrc: "",
    rating: 5,
  },
];

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(scrollRef, { once: true, margin: "-100px" });

  return (
    <section className="py-24 relative bg-background overflow-hidden border-t border-white/5">
      {/* Background Ambient Lights */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-neon/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-deep-blue/20 rounded-full blur-[150px] translate-y-1/2 translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black uppercase text-white tracking-tight"
          >
            Trusted by <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-green-500">
              Pro Courts
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto"
          >
            See what thousands of top-tier buyers, club owners, and tournament directors say about our factory-direct quality.
          </motion.p>
        </div>

        {/* Testimonials Grid / Columns */}
        <div ref={scrollRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: "easeOut" }}
              className={`relative bg-[#09090b] rounded-3xl p-6 md:p-8 border border-white/10 hover:border-neon/40 transition-colors group shadow-2xl ${
                idx % 2 !== 0 ? "lg:translate-y-12" : "" // Creates a staggered vertical layout
              }`}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-neon text-neon" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                &quot;{item.content}&quot;
              </p>

              {/* Author & Optional Image */}
              <div className="mt-auto flex items-center gap-4 pt-6 border-t border-white/10">
                {/* User Image Area (Placeholder) */}
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/5 border border-white/10 shrink-0">
                  {item.imageSrc ? (
                    <Image 
                      src={item.imageSrc} 
                      alt={item.name} 
                      width={48} 
                      height={48} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    // Default avatar skeleton if no image is provided
                    <div className="w-full h-full flex items-center justify-center text-neon/50 bg-neon/5 text-lg font-black uppercase">
                      {item.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-white font-bold">{item.name}</h4>
                  <p className="text-sm text-neon font-mono tracking-tight">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
