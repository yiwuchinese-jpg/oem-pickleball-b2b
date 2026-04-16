"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import { trackCTAClick, trackWhatsAppOpen } from "@/lib/analytics";

export default function WhatsAppPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    // Only show if the user hasn't dismissed it in this session
    if (hasDismissed) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [hasDismissed]);

  const handleClose = () => {
    setIsVisible(false);
    setHasDismissed(true);
  };

  const handleCTA = () => {
    const text = encodeURIComponent("Hi, I want to get wholesale pricing for pickleballs.");
    trackCTAClick("WhatsAppPopup_10s_CTA");
    trackWhatsAppOpen("WhatsAppPopup_10s_CTA");
    window.open(`https://wa.me/8618666680913?text=${text}`, "_blank");
    handleClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50, x: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50, x: 20 }}
          transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
          className="fixed bottom-6 right-6 z-[100] max-w-sm w-[calc(100%-3rem)] md:w-[380px]"
        >
          <div className="bg-background/95 backdrop-blur-xl border border-neon/40 p-6 rounded-2xl shadow-[0_10px_50px_rgba(57,255,20,0.2)] relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon/10 to-transparent opacity-60" />
            
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20"
              aria-label="Close popup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <div className="bg-neon/15 p-3 rounded-full border border-neon/30 shrink-0">
                  <MessageCircle className="w-6 h-6 text-neon" />
                </div>
                <div className="pt-1">
                  <h3 className="text-white font-black tracking-tight text-[1.1rem] mb-1.5 leading-snug">
                    Need Wholesale Pricing?
                  </h3>
                  <p className="text-gray-300 text-sm mb-5 leading-relaxed font-medium">
                    Chat directly with our factory experts for custom OEM quotes and bulk discounts.
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleCTA}
                className="w-full bg-[#25D366] text-white font-bold py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2.5 text-base"
              >
                <MessageCircle className="w-6 h-6" />
                Chat on WhatsApp
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
