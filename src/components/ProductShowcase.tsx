"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

export default function ProductShowcase() {
  const containerRef = useRef<HTMLElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Generating pairs for the 21 uploaded products
  const productImages = useMemo(() => Array.from({ length: 21 }, (_, i) => `/products/${i + 1}.png`), []);
  
  // Split into 3 lanes
  const lane1 = productImages.slice(0, 7);
  const lane2 = productImages.slice(7, 14);
  const lane3 = productImages.slice(14, 21);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedImage]);

  const handleWhatsApp = () => {
    const text = encodeURIComponent("Hi, I saw your pickleball photos on the website, I want to order or get more details.");
    window.open(`https://wa.me/8618666680913?text=${text}`, "_blank");
  };

  return (
    <>
      <section 
        ref={containerRef} 
        className="bg-[#050505] min-h-[120vh] relative overflow-hidden py-32 border-t border-white/5"
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes marquee-forward {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          @keyframes marquee-reverse {
            0% { transform: translate3d(-50%, 0, 0); }
            100% { transform: translate3d(0%, 0, 0); }
          }
          .animate-marquee-forward {
            animation: marquee-forward var(--duration) linear infinite;
            will-change: transform;
          }
          .animate-marquee-reverse {
            animation: marquee-reverse var(--duration) linear infinite;
            will-change: transform;
          }
          .animate-marquee-forward:hover, .animate-marquee-reverse:hover {
            animation-play-state: paused;
          }
        `}} />
        <div className="absolute top-20 left-10 md:left-24 z-30 pointer-events-none text-white max-w-2xl">
          <h2 className="text-[10vw] md:text-[6vw] font-black leading-[0.8] tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-neon to-white">
            The Catalog
          </h2>
          <p className="mt-6 text-gray-300 text-lg md:text-xl font-medium tracking-wide">
            21+ custom molds. Click any image to view details and get factory pricing instantly.
          </p>
        </div>

        {/* Infinite Product Marquee Grid */}
        <div className="mt-[20vh] md:mt-[30vh] flex flex-col gap-6 md:gap-10 transform-gpu">
          <MarqueeRow images={lane1} duration={isMobile ? 25 : 40} reverse={false} onSelect={setSelectedImage} />
          <MarqueeRow images={lane2} duration={isMobile ? 30 : 50} reverse={true} onSelect={setSelectedImage} />
          <MarqueeRow images={lane3} duration={isMobile ? 28 : 45} reverse={false} onSelect={setSelectedImage} />
        </div>

        {/* Gradient Vignettes */}
        <div className="absolute inset-y-0 left-0 w-[10vw] bg-gradient-to-r from-[#050505] to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 right-0 w-[10vw] bg-gradient-to-l from-[#050505] to-transparent pointer-events-none z-20" />
        <div className="absolute bottom-0 left-0 w-full h-[20vh] bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-20" />

        {/* Final Call to action bottom centered */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 text-center">
          <h3 className="text-3xl font-black text-white leading-tight uppercase mb-4">
            Need a custom Design?
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

      </section>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close button */}
            <button 
              className="absolute top-6 right-6 md:top-10 md:right-10 text-white/50 hover:text-white transition-colors p-2 bg-white/5 rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>

            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[85vh] flex flex-col items-center bg-white/5 p-4 md:p-8 rounded-[2rem] border border-white/10"
              onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              {/* Image Container */}
              <div className="relative w-full aspect-square md:aspect-video rounded-2xl overflow-hidden bg-white/10 mb-8">
                <Image
                  src={selectedImage}
                  alt="Expanded Product View"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 90vw, 1024px"
                  priority
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                <div className="flex-1">
                  <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight">
                    Interested in this model?
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base mt-2">
                    Send us the photo on WhatsApp to get MOQ and pricing within 5 minutes.
                  </p>
                </div>
                <button 
                  onClick={handleWhatsApp}
                  className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#1ebe5d] transition-transform hover:scale-105 shadow-[0_0_30px_rgba(37,211,102,0.4)]"
                >
                  <MessageCircle className="w-6 h-6" />
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

// Sub-component for each infinite lane
function MarqueeRow({ 
  images, 
  duration, 
  reverse, 
  onSelect 
}: { 
  images: string[], 
  duration: number, 
  reverse: boolean,
  onSelect: (src: string) => void
}) {
  const duplicatedImages = [...images, ...images];

  return (
    <div className="flex w-[200vw] md:w-[200vw] overflow-hidden">
      <div
        className={`flex gap-4 md:gap-8 w-[200%] md:w-[200%] py-2 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee-forward'}`}
        style={{ '--duration': `${duration}s` } as React.CSSProperties}
      >
        {duplicatedImages.map((src, idx) => (
          <div 
            key={idx} 
            onClick={() => onSelect(src)}
            className="relative flex-shrink-0 w-[55vw] md:w-[20vw] max-w-[380px] aspect-[4/3] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group bg-white/5 border border-white/5 hover:border-neon/50 cursor-pointer shadow-xl transition-all duration-300"
          >
            {/* Ambient hover glow */}
            <div className="absolute inset-0 bg-neon/0 group-hover:bg-neon/10 transition-colors duration-500 z-10 pointer-events-none" />
            
            {/* Image Wrapper */}
            <div className="absolute inset-2 md:inset-4 rounded-xl md:rounded-2xl overflow-hidden bg-white">
              <Image
                src={src}
                alt={`Product Model ${idx}`}
                fill
                loading="lazy"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out will-change-transform"
                sizes="(max-width: 768px) 55vw, 20vw"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
