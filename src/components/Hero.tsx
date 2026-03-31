"use client";

import { useEffect, useRef } from "react";
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

  // Content refs for burst effect
  const priceRef = useRef<HTMLDivElement>(null);
  const badge1Ref = useRef<HTMLDivElement>(null);
  const badge2Ref = useRef<HTMLDivElement>(null);
  const badge3Ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Scroll Parallax on the ball
      gsap.to(ballScrollRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: 350,
        rotation: 180,
      });

      // 2. Burst Entrance Timeline — all transform-based (no layout repaints)
      const tl = gsap.timeline({ defaults: { ease: "back.out(1.2)" } });

      // Ball scales in
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

      // Tags: we use translateX/Y from center — pure GPU path, zero layout thrash
      const tagAnimations = [
        { ref: priceRef.current, x: -220, y: -120 },
        { ref: badge1Ref.current, x: 200, y: -80 },
        { ref: badge2Ref.current, x: -200, y: 100 },
        { ref: badge3Ref.current, x: 180, y: 120 },
      ];

      tagAnimations.forEach(({ ref, x, y }, i) => {
        tl.fromTo(ref,
          { opacity: 0, scale: 0.4, x: 0, y: 0 },
          { opacity: 1, scale: 1, x, y, duration: 1.0, ease: "back.out(1.4)" },
          `-=${i === 0 ? 0.6 : 0.9}`
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);


  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[100vh] w-full flex flex-col items-center justify-start overflow-hidden bg-background pt-[12vh] pb-[5vh]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-neon)_0%,_transparent_60%)] opacity-10 pointer-events-none" />

      {/* Top Title Group - Placed completely above safe zone */}
      <div ref={titleRef} className="relative z-40 text-center w-full px-4 shrink-0">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight uppercase tracking-tight drop-shadow-2xl">
          Premium Pickleball <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-green-400 drop-shadow-[0_0_20px_rgba(57,255,20,0.4)]">
            Wholesale Direct
          </span>
        </h1>
      </div>

      {/* Hero Interaction Area (Relative constraint box for absolute flying tags) */}
      <div className="relative w-full max-w-7xl flex-1 flex items-center justify-center min-h-[50vh] mt-4 md:mt-8 mx-auto px-2 md:px-8">

        {/* Center Ball */}
        <div ref={ballScrollRef} className="absolute z-20">
          <div ref={ballLoadRef} className="rounded-full shadow-[0_0_100px_rgba(57,255,20,0.3)] bg-black" style={{ clipPath: "circle(48% at 50% 50%)" }}>
            <Image
              src="/pickleball.png"
              alt="Premium Pickleball"
              width={500}
              height={500}
              className="w-[200px] md:w-[380px] object-contain filter brightness-110 contrast-125"
              priority
            />
          </div>
        </div>

        {/* Burst Element 1: Factory Price */}
        <div
          ref={priceRef}
          className="absolute z-30 top-1/2 left-1/2 transform -rotate-3 hover:scale-105 transition-transform"
          style={{ opacity: 0 }}
        >
          <div className="bg-background/90 backdrop-blur-xl border border-neon/50 px-5 md:px-8 py-3 md:py-5 rounded-3xl shadow-[0_0_30px_rgba(57,255,20,0.15)]">
            <span className="text-xs md:text-sm font-bold text-gray-400 block mb-1 uppercase tracking-wider">Factory Price</span>
            <span className="text-2xl md:text-5xl font-black text-white">Only $0.20<span className="text-sm md:text-xl text-neon">/pc</span></span>
          </div>
        </div>

        {/* Burst Element 2: MOQ */}
        <div
          ref={badge1Ref}
          className="absolute z-30 top-1/2 left-1/2 transform rotate-3 hover:scale-105 transition-transform"
          style={{ opacity: 0 }}
        >
          <div className="bg-[#0b1120] border border-white/20 px-4 md:px-6 py-2 md:py-4 rounded-2xl flex items-center gap-3 shadow-xl">
             <div className="w-2.5 h-2.5 rounded-full bg-neon animate-pulse" />
             <span className="text-sm md:text-lg font-bold text-white whitespace-nowrap">MOQ 1000 pcs</span>
          </div>
        </div>

        {/* Burst Element 3: China Direct */}
        <div
          ref={badge2Ref}
          className="absolute z-30 top-1/2 left-1/2 transform -rotate-2 hover:scale-105 transition-transform"
          style={{ opacity: 0 }}
        >
          <div className="bg-[#0b1120] border border-white/20 px-4 md:px-6 py-2 md:py-4 rounded-2xl flex items-center gap-3 shadow-xl">
             <ShieldCheck className="text-neon w-5 h-5 md:w-6 md:h-6" />
             <span className="text-sm md:text-lg font-bold text-white whitespace-nowrap">China Direct Wholesaler</span>
          </div>
        </div>

        {/* Burst Element 4: DDP Shipping */}
        <div
          ref={badge3Ref}
          className="absolute z-30 top-1/2 left-1/2 transform rotate-2 hover:scale-105 transition-transform"
          style={{ opacity: 0 }}
        >
          <div className="bg-[#0b1120] border border-white/20 px-4 md:px-6 py-2 md:py-4 rounded-2xl flex items-center gap-3 shadow-xl">
             <Truck className="text-neon w-5 h-5 md:w-6 md:h-6" />
             <span className="text-sm md:text-lg font-bold text-white whitespace-nowrap">DDP Shipping Available</span>
          </div>
        </div>

      </div>

      {/* CTA Button at very bottom strictly */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
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
