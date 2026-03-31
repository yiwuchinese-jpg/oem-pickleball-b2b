"use client";

import { motion } from "framer-motion";
import { TrendingDown, XCircle, CheckCircle2 } from "lucide-react";

export default function PriceAdvantage() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white">
            THE <span className="text-neon">UNBEATABLE</span> PRICE
          </h2>
          <p className="text-xl text-gray-400 mt-4 max-w-2xl mx-auto">
            Why pay $0.50+ when you can get the exact same quality direct from the source floor?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Competitors */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-red-950/20 border border-red-500/20 rounded-3xl p-8 lg:p-12 relative"
          >
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
              <XCircle className="text-red-500 w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-6">Trading Companies<br/><span className="text-gray-500 text-lg">The Middlemen</span></h3>
            
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 text-gray-300">
                <span className="text-red-500 font-black">-</span> Inflated Prices ($0.50 - $0.80/pc)
              </li>
              <li className="flex gap-3 text-gray-300">
                <span className="text-red-500 font-black">-</span> Slow Communication
              </li>
              <li className="flex gap-3 text-gray-300">
                <span className="text-red-500 font-black">-</span> No Direct Factory Control
              </li>
            </ul>

            <div className="text-5xl font-black text-white/50">
              $0.65<span className="text-xl">avg.</span>
            </div>
          </motion.div>

          {/* Us */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-neon/10 border-2 border-neon/50 rounded-3xl p-8 lg:p-12 relative shadow-[0_0_50px_rgba(57,255,20,0.15)] transform scale-105"
          >
            <div className="absolute -top-5 -right-5 w-14 h-14 bg-neon rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.5)]">
              <CheckCircle2 className="text-black w-8 h-8" />
            </div>
            
            <div className="mb-4 inline-block bg-neon text-black text-sm font-bold px-3 py-1 rounded">
              YIWU DIRECT FACTORY
            </div>
            
            <h3 className="text-3xl font-black text-white mb-6">Our Factory Direct</h3>
            
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 text-white font-medium">
                <CheckCircle2 className="text-neon w-5 h-5 flex-shrink-0" /> Lowest Price Guarantee ($0.20/pc)
              </li>
              <li className="flex gap-3 text-white font-medium">
                <CheckCircle2 className="text-neon w-5 h-5 flex-shrink-0" /> Fast WhatsApp Communication
              </li>
              <li className="flex gap-3 text-white font-medium">
                <CheckCircle2 className="text-neon w-5 h-5 flex-shrink-0" /> Direct OEM Support & Control
              </li>
            </ul>

            <div className="flex items-end gap-3">
              <div className="text-6xl font-black text-neon shadow-neon">
                $0.20
              </div>
              <div className="text-gray-400 font-bold bg-white/5 px-2 py-1 rounded mb-2 flex items-center gap-1">
                <TrendingDown className="w-4 h-4 text-neon" /> 70% LESS
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
