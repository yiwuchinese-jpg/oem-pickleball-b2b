"use client";

import React from 'react';
import NextLink from 'next/link';
import { motion } from 'framer-motion';
import { Video, ArrowRight, ShieldCheck } from 'lucide-react';

export default function VirtualTourBanner() {
  return (
    <section className="py-20 px-4 bg-[#09090b] relative overflow-hidden border-y border-white/5">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-neon)_0%,_transparent_70%)] opacity-[0.03]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(57,255,20,0.05)] overflow-hidden">
          
          {/* Left Content */}
          <div className="flex-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-neon/10 text-neon px-4 py-2 rounded-full border border-neon/20"
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="font-bold text-sm uppercase tracking-wider">100% Verified Source</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white"
            >
              Step Inside Our <br />
              <span className="text-neon">360° VR Factory</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-lg leading-relaxed max-w-xl"
            >
              Stop guessing if you're dealing with a middleman. Take a virtual walk through our Yiwu production floor, view our official business license, and see our unfiltered manufacturing process.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="pt-4"
            >
              <NextLink 
                href="/factory-tour"
                className="inline-flex items-center gap-3 bg-neon text-black font-black px-8 py-4 rounded-full uppercase tracking-wider hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(57,255,20,0.3)]"
              >
                <Video className="w-6 h-6" />
                Start Virtual Tour <ArrowRight className="w-5 h-5" />
              </NextLink>
            </motion.div>
          </div>

          {/* Right Visual/Preview */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full relative"
          >
            <NextLink href="/factory-tour" className="block relative aspect-video rounded-2xl overflow-hidden group border border-white/10 bg-black">
              <img 
                src="/factory-real/factory-5.jpeg" 
                alt="VR Factory Preview" 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-neon/50 group-hover:scale-110 group-hover:bg-neon/20 transition-all duration-300 shadow-[0_0_30px_rgba(57,255,20,0.3)]">
                  <Video className="w-8 h-8 text-neon group-hover:text-white" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-white font-bold text-sm tracking-widest uppercase drop-shadow-md">Click to enter 360° View</p>
              </div>
            </NextLink>
          </motion.div>

        </div>
      </div>
    </section>
  );
}