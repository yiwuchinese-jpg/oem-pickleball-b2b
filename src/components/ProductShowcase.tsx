"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductShowcase() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const productImages = useMemo(
    () => Array.from({ length: 21 }, (_, i) => `/products/${i + 1}.png`),
    []
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = selectedIdx !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedIdx]);

  const handleWhatsApp = (idx: number) => {
    const text = encodeURIComponent(
      `Hi, I'm interested in product #${idx + 1} from your website. Can I get MOQ and pricing?`
    );
    window.open(`https://wa.me/8618666680913?text=${text}`, "_blank");
  };

  const goPrev = () =>
    setSelectedIdx((i) => (i !== null ? (i - 1 + productImages.length) % productImages.length : 0));
  const goNext = () =>
    setSelectedIdx((i) => (i !== null ? (i + 1) % productImages.length : 0));

  // Split into 3 lanes for desktop marquee
  const lane1 = productImages.slice(0, 7);
  const lane2 = productImages.slice(7, 14);
  const lane3 = productImages.slice(14, 21);

  return (
    <>
      <section className="bg-[#050505] relative border-t border-white/5 overflow-hidden">
        {/* Header */}
        <div className="relative z-10 pt-16 pb-8 px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[13vw] md:text-[6vw] font-black leading-none tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-neon to-white">
              The Catalog
            </h2>
            <p className="mt-3 text-gray-400 text-base md:text-lg max-w-lg">
              21+ custom molds. Tap any product to view details and get factory pricing.
            </p>
          </motion.div>
        </div>

        {/* ── MOBILE: 2-column tap grid ── */}
        {isMobile ? (
          <div className="px-4 pb-10 grid grid-cols-2 gap-3">
            {productImages.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-white/10 active:scale-95 transition-transform"
              >
                <Image
                  src={src}
                  alt={`Product ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="45vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 active:bg-black/20 transition-colors" />
              </button>
            ))}
          </div>
        ) : (
          /* ── DESKTOP: CSS Marquee 3 rows ── */
          <>
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes mq-fwd {
                from { transform: translateX(0); }
                to   { transform: translateX(-50%); }
              }
              @keyframes mq-rev {
                from { transform: translateX(-50%); }
                to   { transform: translateX(0); }
              }
              .mq-fwd { animation: mq-fwd var(--dur) linear infinite; }
              .mq-rev { animation: mq-rev var(--dur) linear infinite; }
              .mq-fwd:hover, .mq-rev:hover { animation-play-state: paused; }
            `}} />

            <div className="pb-16 flex flex-col gap-6 pointer-events-none">
              {[
                { lane: lane1, dur: 40, rev: false },
                { lane: lane2, dur: 50, rev: true  },
                { lane: lane3, dur: 45, rev: false },
              ].map(({ lane, dur, rev }, ri) => (
                <div key={ri} className="overflow-hidden pointer-events-auto">
                  <div
                    className={`flex gap-6 w-max ${rev ? "mq-rev" : "mq-fwd"}`}
                    style={{ "--dur": `${dur}s` } as React.CSSProperties}
                  >
                    {[...lane, ...lane].map((src, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedIdx(productImages.indexOf(src))}
                        className="relative flex-shrink-0 w-[22vw] max-w-[340px] aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-white/10 hover:border-neon/60 hover:shadow-[0_0_30px_rgba(57,255,20,0.15)] transition-all duration-300 group"
                      >
                        <Image
                          src={src}
                          alt={`Product`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="22vw"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-neon/0 group-hover:bg-neon/5 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="text-center pb-16 relative z-10">
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase mb-4">
                Need a Custom Design?
              </h3>
              <button
                onClick={() => {
                  const text = encodeURIComponent("Hi, I need a custom pickleball design, sending you my tech pack...");
                  window.open(`https://wa.me/8618666680913?text=${text}`, "_blank");
                }}
                className="bg-neon text-black px-8 py-4 rounded-full font-bold shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:shadow-[0_0_40px_rgba(57,255,20,0.6)] transition-all uppercase tracking-widest text-sm"
              >
                Send Us Your Tech Pack
              </button>
            </div>
          </>
        )}

        {/* Mobile CTA */}
        {isMobile && (
          <div className="text-center px-6 pb-12">
            <button
              onClick={() => {
                const text = encodeURIComponent("Hi, I need a custom pickleball design, sending you my tech pack...");
                window.open(`https://wa.me/8618666680913?text=${text}`, "_blank");
              }}
              className="w-full bg-neon text-black py-4 rounded-2xl font-bold text-base shadow-[0_0_20px_rgba(57,255,20,0.3)]"
            >
              💬 Send Us Your Tech Pack
            </button>
          </div>
        )}
      </section>

      {/* ── Lightbox Modal ── */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
            onClick={() => setSelectedIdx(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              className="relative w-full max-w-2xl bg-[#111] rounded-3xl border border-white/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                onClick={() => setSelectedIdx(null)}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image */}
              <div className="relative aspect-square bg-white">
                <Image
                  src={productImages[selectedIdx]}
                  alt={`Product ${selectedIdx + 1}`}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 95vw, 672px"
                  priority
                />

                {/* Prev / Next arrows */}
                <button
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Page indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-black/50 font-bold bg-black/10 px-2 py-0.5 rounded-full">
                  {selectedIdx + 1} / {productImages.length}
                </div>
              </div>

              {/* CTA */}
              <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black text-white">Interested in this model?</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    WhatsApp us for MOQ & pricing — reply in 5 min.
                  </p>
                </div>
                <button
                  onClick={() => handleWhatsApp(selectedIdx)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-[#1ebe5d] transition-colors shadow-[0_0_20px_rgba(37,211,102,0.3)] shrink-0"
                >
                  <MessageCircle className="w-5 h-5" />
                  Ask via WhatsApp
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
