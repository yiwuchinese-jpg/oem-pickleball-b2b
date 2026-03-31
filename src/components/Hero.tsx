"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import { ShieldCheck, Truck, MoveRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ballScrollRef = useRef<HTMLDivElement>(null);
  const ballLoadRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  // Desktop burst refs
  const priceRef = useRef<HTMLDivElement>(null);
  const badge1Ref = useRef<HTMLDivElement>(null);
  const badge2Ref = useRef<HTMLDivElement>(null);
  const badge3Ref = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Ball scroll parallax
      gsap.to(ballScrollRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: 200,
        rotation: 120,
      });

      const tl = gsap.timeline({ defaults: { ease: "back.out(1.2)" } });

      // Ball entrance
      tl.fromTo(ballLoadRef.current,
        { scale: 0, rotation: -90 },
        { scale: 1, rotation: 0, duration: 1.2, ease: "power3.out" }
      );

      // Title
      tl.fromTo(titleRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.8"
      );

      // Desktop only: burst tags with large offsets
      if (!mobile) {
        const tagAnimations = [
          { ref: priceRef.current,  x: -390, y: -150 },
          { ref: badge1Ref.current, x:  360, y: -120 },
          { ref: badge2Ref.current, x: -360, y:  140 },
          { ref: badge3Ref.current, x:  340, y:  160 },
        ];
        tagAnimations.forEach(({ ref, x, y }, i) => {
          tl.fromTo(ref,
            { opacity: 0, scale: 0.4, x: 0, y: 0 },
            { opacity: 1, scale: 1, x, y, duration: 1.0, ease: "back.out(1.4)" },
            `-=${i === 0 ? 0.6 : 0.9}`
          );
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full flex flex-col items-center justify-start overflow-hidden bg-background pt-[10vh] pb-[5vh]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-neon)_0%,_transparent_60%)] opacity-10 pointer-events-none" />

      {/* Title */}
      <div ref={titleRef} className="relative z-40 text-center w-full px-4 shrink-0">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight uppercase tracking-tight drop-shadow-2xl">
          Premium Pickleball <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-green-400 drop-shadow-[0_0_20px_rgba(57,255,20,0.4)]">
            Wholesale Direct
          </span>
        </h1>
      </div>

      {/* ── MOBILE LAYOUT ── */}
      {isMobile ? (
        <div className="flex flex-col items-center w-full px-5 mt-6 gap-5">
          {/* Ball */}
          <div ref={ballScrollRef}>
            <div ref={ballLoadRef} className="rounded-full shadow-[0_0_80px_rgba(57,255,20,0.3)] bg-black" style={{ clipPath: "circle(48% at 50% 50%)" }}>
              <Image
                src="/pickleball.png"
                alt="Premium Pickleball"
                width={280}
                height={280}
                className="w-[220px] object-contain filter brightness-110 contrast-125"
                priority
              />
            </div>
          </div>

          {/* Tags grid below ball */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="bg-background/90 border border-neon/50 px-4 py-3 rounded-2xl shadow-[0_0_20px_rgba(57,255,20,0.1)] col-span-2"
            >
              <span className="text-[10px] font-bold text-gray-400 block mb-0.5 uppercase tracking-wider">Factory Price</span>
              <span className="text-3xl font-black text-white">Only $0.20<span className="text-base text-neon">/pc</span></span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
              className="bg-[#0b1120] border border-white/20 px-3 py-3 rounded-2xl flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-neon animate-pulse flex-shrink-0" />
              <span className="text-sm font-bold text-white">MOQ 1000 pcs</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
              className="bg-[#0b1120] border border-white/20 px-3 py-3 rounded-2xl flex items-center gap-2"
            >
              <ShieldCheck className="text-neon w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-bold text-white">China Direct</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
              className="bg-[#0b1120] border border-white/20 px-3 py-3 rounded-2xl flex items-center gap-2 col-span-2"
            >
              <Truck className="text-neon w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-bold text-white">DDP Shipping Available Worldwide</span>
            </motion.div>
          </div>
        </div>
      ) : (
        /* ── DESKTOP LAYOUT ── */
        <div className="relative w-full max-w-7xl flex-1 flex items-center justify-center min-h-[55vh] mt-8 mx-auto px-8">
          {/* Ball */}
          <div ref={ballScrollRef} className="absolute z-20">
            <div ref={ballLoadRef} className="rounded-full shadow-[0_0_100px_rgba(57,255,20,0.3)] bg-black" style={{ clipPath: "circle(48% at 50% 50%)" }}>
              <Image
                src="/pickleball.png"
                alt="Premium Pickleball"
                width={500}
                height={500}
                className="w-[380px] object-contain filter brightness-110 contrast-125"
                priority
              />
            </div>
          </div>

          {/* Factory Price - top left */}
          <div ref={priceRef} className="absolute z-30 top-1/2 left-1/2 -rotate-3" style={{ opacity: 0 }}>
            <div className="bg-background/90 backdrop-blur-xl border border-neon/50 px-8 py-5 rounded-3xl shadow-[0_0_30px_rgba(57,255,20,0.15)]">
              <span className="text-sm font-bold text-gray-400 block mb-1 uppercase tracking-wider">Factory Price</span>
              <span className="text-5xl font-black text-white">Only $0.20<span className="text-xl text-neon">/pc</span></span>
            </div>
          </div>

          {/* MOQ - top right */}
          <div ref={badge1Ref} className="absolute z-30 top-1/2 left-1/2 rotate-3" style={{ opacity: 0 }}>
            <div className="bg-[#0b1120] border border-white/20 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-xl">
              <div className="w-2.5 h-2.5 rounded-full bg-neon animate-pulse" />
              <span className="text-lg font-bold text-white whitespace-nowrap">MOQ 1000 pcs</span>
            </div>
          </div>

          {/* China Direct - bottom left */}
          <div ref={badge2Ref} className="absolute z-30 top-1/2 left-1/2 -rotate-2" style={{ opacity: 0 }}>
            <div className="bg-[#0b1120] border border-white/20 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-xl">
              <ShieldCheck className="text-neon w-6 h-6" />
              <span className="text-lg font-bold text-white whitespace-nowrap">China Direct Wholesaler</span>
            </div>
          </div>

          {/* DDP Shipping - bottom right */}
          <div ref={badge3Ref} className="absolute z-30 top-1/2 left-1/2 rotate-2" style={{ opacity: 0 }}>
            <div className="bg-[#0b1120] border border-white/20 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-xl">
              <Truck className="text-neon w-6 h-6" />
              <span className="text-lg font-bold text-white whitespace-nowrap">DDP Shipping Available</span>
            </div>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: isMobile ? 1.4 : 1.8, duration: 0.8 }}
        className="relative z-40 shrink-0 mt-8 mb-4 px-4"
      >
        <MagneticButton onClick={() => {
          const text = encodeURIComponent("Hi, I saw your pickleball ad, I want to get wholesale pricing...");
          window.open(`https://wa.me/8618666680913?text=${text}`, "_blank");
        }}>
          <div className="flex items-center gap-3 bg-neon text-black px-8 md:px-10 py-4 md:py-5 rounded-full font-black text-lg md:text-xl hover:bg-white transition-colors shadow-[0_0_40px_rgba(57,255,20,0.3)]">
            Get Wholesale Price Now <MoveRight className="w-6 h-6" />
          </div>
        </MagneticButton>
      </motion.div>

    </section>
  );
}
