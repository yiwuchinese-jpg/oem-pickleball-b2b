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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            aria-label="Close popup backdrop"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            className="relative w-full max-w-2xl bg-[#050505] border border-neon/40 p-8 md:p-14 rounded-3xl md:rounded-[2.5rem] shadow-[0_0_100px_rgba(57,255,20,0.2)] overflow-hidden text-center flex flex-col items-center"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon/10 via-transparent to-transparent opacity-60 pointer-events-none" />
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-neon/20 blur-[100px] rounded-full pointer-events-none" />
            
            {/* Top Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all z-20"
              aria-label="Close popup"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative z-10 flex flex-col items-center w-full">
              {/* Icon */}
              <div className="bg-neon/10 p-5 rounded-full border border-neon/30 mb-6 flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-neon" />
              </div>

              {/* Text Content */}
              <h2 className="text-white font-black tracking-tight text-3xl md:text-5xl mb-4 leading-tight">
                Need <span className="text-neon">Wholesale</span> Pricing?
              </h2>
              <p className="text-gray-300 text-base md:text-lg mb-10 leading-relaxed font-medium max-w-lg mx-auto">
                Stop guessing. Chat directly with our factory experts to get instant quotes, MOQ details, and custom OEM sample arrangements.
              </p>
              
              {/* Action Buttons */}
              <div className="w-full max-w-sm flex flex-col items-center gap-4">
                <button
                  onClick={handleCTA}
                  className="w-full bg-[#25D366] text-white font-bold py-4 px-6 rounded-2xl shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:shadow-[0_0_50px_rgba(37,211,102,0.6)] transform hover:scale-[1.03] transition-all duration-300 flex items-center justify-center gap-3 text-lg"
                >
                  <MessageCircle className="w-7 h-7" />
                  Chat on WhatsApp Now
                </button>
                
                {/* Easy 'No thanks' link */}
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-300 text-sm font-semibold transition-colors mt-2 underline underline-offset-4 decoration-transparent hover:decoration-gray-500"
                >
                  No thanks, I'm just browsing
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
