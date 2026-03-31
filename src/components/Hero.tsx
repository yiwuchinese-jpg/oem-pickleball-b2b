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
      // 1. Scroll Parallax (Applied to outer wrapper to prevent timeline conflict)
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

      // 2. Burst Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: "back.out(1.2)" } });
      
      // Start ball from small to normal (Applied to inner wrapper)
      tl.fromTo(ballLoadRef.current, 
        { scale: 0, rotation: -90 }, 
        { scale: 1, rotation: 0, duration: 1.5, ease: "power3.out" }
      );

      // Title drop in
      tl.fromTo(titleRef.current, { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 1 }, "-=1.0");

      // Fly-out Animation Generator 
      // Animate FROM center TO their native absolute positions
      const flyOut = (el: HTMLElement | null, delayOffset: string) => {
        if (!el) return;
        tl.fromTo(el, 
          { x: 0, y: 0, scale: 0, opacity: 0, top: "50%", left: "50%", xPercent: -50, yPercent: -50 }, 
          { x: 0, y: 0, scale: 1, opacity: 1, top: el.dataset.top, left: el.dataset.left, bottom: el.dataset.bottom, right: el.dataset.right, xPercent: 0, yPercent: 0, duration: 1.2 }, 
          delayOffset
        );
      };

      // Ensure they arrive at scattered, safe absolute coordinates
      flyOut(priceRef.current, "-=1.0");
      flyOut(badge1Ref.current, "-=1.1");
      flyOut(badge2Ref.current, "-=1.1");
      flyOut(badge3Ref.current, "-=1.2");

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

        {/* Burst Element 1: Factory Price (Top Left) */}
        <div 
          ref={priceRef} 
          data-top="5%" data-left="2%"
          className="absolute z-30 transform -rotate-3 hover:scale-105 transition-transform"
        >
          <div className="bg-background/90 backdrop-blur-xl border border-neon/50 px-5 md:px-8 py-3 md:py-5 rounded-3xl shadow-[0_0_30px_rgba(57,255,20,0.15)]">
            <span className="text-xs md:text-sm font-bold text-gray-400 block mb-1 uppercase tracking-wider">Factory Price</span>
            <span className="text-2xl md:text-5xl font-black text-white">Only $0.20<span className="text-sm md:text-xl text-neon">/pc</span></span>
          </div>
        </div>

        {/* Burst Element 2: MOQ (Top Right) */}
        <div 
          ref={badge1Ref} 
          data-top="15%" data-left="auto" data-right="2%"
          className="absolute z-30 transform rotate-3 hover:scale-105 transition-transform"
        >
          <div className="bg-[#0b1120] border border-white/20 px-4 md:px-6 py-2 md:py-4 rounded-2xl flex items-center gap-3 shadow-xl">
             <div className="w-2.5 h-2.5 rounded-full bg-neon animate-pulse" />
             <span className="text-sm md:text-lg font-bold text-white whitespace-nowrap">MOQ 1000 pcs</span>
          </div>
        </div>

        {/* Burst Element 3: China Direct (Bottom Left) */}
        <div 
          ref={badge2Ref} 
          data-top="auto" data-bottom="15%" data-left="2%"
          className="absolute z-30 transform -rotate-2 hover:scale-105 transition-transform"
        >
          <div className="bg-[#0b1120] border border-white/20 px-4 md:px-6 py-2 md:py-4 rounded-2xl flex items-center gap-3 shadow-xl">
             <ShieldCheck className="text-neon w-5 h-5 md:w-6 md:h-6" />
             <span className="text-sm md:text-lg font-bold text-white whitespace-nowrap">China Direct Wholesaler</span>
          </div>
        </div>

        {/* Burst Element 4: DDP Shipping (Bottom Right) */}
        <div 
          ref={badge3Ref} 
          data-top="auto" data-bottom="5%" data-left="auto" data-right="2%"
          className="absolute z-30 transform rotate-2 hover:scale-105 transition-transform"
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
