"use client";

import { motion } from "framer-motion";
import { Send, FileCheck, Truck } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Send Inquiry",
      desc: "Tell us your required quantity, target price, and if you need any custom logos.",
      icon: Send,
    },
    {
      num: "02",
      title: "Confirm Order",
      desc: "We finalize the OEM details, packaging specs, and lock in the lowest factory price.",
      icon: FileCheck,
    },
    {
      num: "03",
      title: "DDP Delivery",
      desc: "Sit back and relax. We handle all logistics, customs, and taxes straight to your door.",
      icon: Truck,
    },
  ];

  return (
    <section className="py-24 bg-deep-blue relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon/50 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white"
          >
            IMPORTING MADE <span className="text-neon">EASY</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-white/10" />

          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative text-center group"
            >
              <div className="w-24 h-24 mx-auto bg-background border-2 border-white/10 rounded-full flex flex-col items-center justify-center relative z-10 group-hover:border-neon transition-colors duration-300 shadow-xl shadow-black/50">
                <step.icon className="w-8 h-8 text-gray-400 group-hover:text-neon transition-colors" />
                <span className="absolute -top-3 -right-3 text-2xl font-black text-neon/30 group-hover:text-neon transition-colors">
                  {step.num}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mt-8 mb-4">{step.title}</h3>
              <p className="text-gray-400 max-w-sm mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
