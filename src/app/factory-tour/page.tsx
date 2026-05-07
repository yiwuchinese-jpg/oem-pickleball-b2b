'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Video, MapPin, Search, FileCheck, X, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// 自动生成我们之前重命名的 34 张图片路径
const FACTORY_IMAGES = [
  ...Array.from({ length: 21 }, (_, i) => `/factory-real/factory-${i + 1}.jpeg`),
  ...Array.from({ length: 13 }, (_, i) => `/factory-real/factory-${i + 22}.webp`)
];

export default function FactoryTourPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const whatsapp = () => {
    window.open(`https://wa.me/8618666680913?text=${encodeURIComponent("Hi, I saw your VR factory tour. I'd like to verify your factory and get a quote.")}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-neon)_0%,_transparent_60%)] opacity-[0.03]" />
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 bg-neon/10 text-neon text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6 border border-neon/20">
              <MapPin className="w-3 h-3" /> Yiwu, Zhejiang, China
            </span>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6">
              Virtual <span className="text-neon">Factory Verification</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Don&#39;t just take our word for it. Step inside our 360° VR facility and browse our raw, unfiltered production line. See exactly where and how your carbon fiber paddles are made.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Official Business License & Location ── */}
      <section className="py-12 md:py-20 px-4 bg-[#0d0d10] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Left: License Image */}
            <div className="flex-1 w-full space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative p-2 rounded-2xl bg-gradient-to-br from-neon/20 to-transparent border border-neon/30"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white/5">
                  <Image 
                    src="/business-license.png" 
                    alt="Official Business License - Jinhua Lidu Sports Goods Co., Ltd." 
                    fill 
                    className="object-contain p-2" 
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-neon text-black font-black px-6 py-3 rounded-full text-sm uppercase tracking-wider shadow-lg flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> Officially Verified
                </div>
              </motion.div>
            </div>

            {/* Right: Verified Info & Google Maps */}
            <div className="flex-1 w-full space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-neon/10 text-neon px-4 py-2 rounded-lg border border-neon/20 mb-4">
                  <FileCheck className="w-5 h-5" />
                  <span className="font-bold text-sm">Government Registered Manufacturer</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
                  100% Legal & <span className="text-neon">Verified Entity</span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  We are a legally registered manufacturing enterprise in China, not a shell company or temporary trading desk. Our business license explicitly covers the <strong className="text-white">manufacturing of sports equipment</strong>.
                </p>
              </div>
              
              <ul className="space-y-3">
                {[
                  { label: "Company Name", value: "Jinhua Lidu Sports Goods Co., Ltd." },
                  { label: "Registered Capital", value: "1,000,000 RMB" },
                  { label: "Business Scope", value: "Sports Equipment & Gear Manufacturing" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-neon"></div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                      <p className="text-white font-bold">{item.value}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Google Maps Location */}
              <div className="mt-8 border border-white/10 rounded-2xl overflow-hidden bg-[#111] shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <div className="bg-[#1a1a1a] px-4 py-3 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-neon" />
                    <span className="text-white font-bold text-sm">Factory Location</span>
                  </div>
                  <a 
                    href="https://maps.google.com/?q=Jinhua+Lidu+Sports+Goods+Co.,+Ltd" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-neon text-xs font-bold hover:underline"
                  >
                    Open in Maps ↗
                  </a>
                </div>
                <div className="relative w-full h-[200px] md:h-[250px]">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110034.42618758838!2d119.5398285552309!3d29.083815040332896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x344f6f4f41052841%3A0xc3f3454b51c89073!2sJinhua%2C%20Zhejiang%2C%20China!5e0!3m2!1sen!2sus!4v1709280000000!5m2!1sen!2sus" 
                    className="absolute inset-0 w-full h-full border-none"
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    sandbox="allow-scripts allow-same-origin allow-popups"
                  />
                </div>
                <div className="px-4 py-3 bg-[#1a1a1a] border-t border-white/5">
                  <p className="text-gray-400 text-xs">
                    Building 4, Bailongqiao Town Linjiang Industrial Zone, Wucheng District, Jinhua City, Zhejiang Province, China
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 360 VR Factory Tour ── */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Video className="w-8 h-8 text-neon" />
            <h2 className="text-2xl md:text-4xl font-black uppercase">Live 360° VR Tour</h2>
          </div>
          
          <div className="relative w-full h-[60vh] md:h-[75vh] rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(57,255,20,0.05)] bg-[#111]">
            <iframe
              className="absolute inset-0 w-full h-full border-none"
              style={{ objectFit: 'cover' }}
              src="https://air.1688.com/pages/vr_viewer/vr_hall/dq193oei7/index.html?__pageId__=1247378&wh_pid=1247378&wvUseWKWebView=true&__existtitle__=1&xrBizCode=pmAuthentication&previewToken=c4222f843c8744fc8bd69f8accdff72f&sellerLoginId=lidu363636888"
              allowFullScreen
              allow="autoplay; fullscreen; xr-spatial-tracking; camera; gyroscope; accelerometer"
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
            />
            {/* Left top brand mask */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 pointer-events-auto flex items-center justify-center px-4 py-2 md:px-5 md:py-2.5 bg-[#09090b]/90 backdrop-blur-sm border border-[#39FF14]/20 rounded-lg shadow-lg">
              <span className="text-white font-extrabold text-xs md:text-sm tracking-wide">
                DJW Pickleball Factory
              </span>
            </div>
            {/* Bottom contact bar mask - iOS safe area adapted */}
            <div 
              className="absolute bottom-0 left-0 w-full z-10 pointer-events-auto bg-[#09090b] border-t border-white/5 flex items-center justify-center"
              style={{ 
                height: 'calc(90px + env(safe-area-inset-bottom))',
                paddingBottom: 'env(safe-area-inset-bottom)'
              }}
            >
              <button 
                onClick={whatsapp}
                className="px-6 py-3 md:px-12 md:py-4 bg-[#39FF14] text-black rounded-full font-black text-sm md:text-base uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.2)] hover:bg-white hover:-translate-y-1 transition-all duration-300 w-[85%] md:w-auto"
              >
                Schedule A Live Video Call
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── All Unfiltered Production Images (Masonry Grid) ── */}
      <section className="py-12 md:py-20 px-4 bg-[#0d0d10] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Search className="w-8 h-8 text-neon" />
                <h2 className="text-2xl md:text-4xl font-black uppercase">Unfiltered Production Gallery</h2>
              </div>
              <p className="text-gray-500">Real photos from our Yiwu factory floor. No stock images.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-neon/10 px-4 py-2 rounded-lg border border-neon/20">
              <ShieldCheck className="w-5 h-5 text-neon" />
              <span className="text-neon font-bold text-sm">100% Verified Source</span>
            </div>
          </div>

          {/* Masonry Layout for all 34 images */}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {FACTORY_IMAGES.map((src, i) => (
              <motion.div 
                key={src}
                onClick={() => setSelectedImage(src)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                transition={{ delay: (i % 10) * 0.05 }}
                className="relative rounded-xl overflow-hidden border border-white/5 group bg-black break-inside-avoid cursor-pointer"
              >
                <Image 
                  src={src} 
                  alt={`Factory Production Line ${i + 1}`} 
                  width={600}
                  height={800}
                  className="w-full h-auto object-cover group-hover:scale-105 group-hover:brightness-110 transition-all duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 pointer-events-none">
                  <span className="text-neon text-[10px] font-black uppercase tracking-wider mb-1">Verified</span>
                  <span className="text-white text-xs font-medium">Production Floor Cam</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold mb-6">Still not convinced?</h3>
            <button 
              onClick={whatsapp}
              className="px-10 py-4 bg-white text-black rounded-full font-black uppercase tracking-wider hover:bg-neon transition-colors duration-300"
            >
              Request a Live WhatsApp Tour
            </button>
          </div>
        </div>
      </section>

      {/* ── Image Lightbox Modal ── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-[110]"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative max-w-5xl w-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[65vh] flex justify-center">
                <Image
                  src={selectedImage}
                  alt="Factory Large View"
                  fill
                  className="object-contain rounded-xl shadow-2xl border border-white/10"
                />
              </div>
              
              <div className="mt-4 md:mt-8 flex flex-col items-center gap-3 md:gap-5 bg-[#0d0d10] border border-white/10 px-4 py-5 md:px-8 md:py-6 rounded-2xl md:rounded-3xl shadow-[0_0_50px_rgba(57,255,20,0.05)] w-full md:w-auto">
                <p className="text-neon text-xs md:text-sm tracking-widest uppercase font-bold flex items-center gap-1.5 md:gap-2">
                  <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" /> Verified Production Footage
                </p>
                <button
                  onClick={whatsapp}
                  className="flex items-center justify-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 bg-[#39FF14] text-black rounded-full font-black text-sm md:text-xl uppercase tracking-wider shadow-[0_0_30px_rgba(57,255,20,0.3)] hover:scale-105 hover:bg-white transition-all duration-300 w-full md:w-auto"
                >
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                  Get Wholesale Quote
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}