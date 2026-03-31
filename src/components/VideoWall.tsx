"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function VideoWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const BASE = "https://github.com/yiwuchinese-jpg/oem-pickleball-b2b/releases/download/v1.0-assets";
  const factoryVideos = [
    { id: 1, src: `${BASE}/5.mp4`, title: "Factory Production Line" },
    { id: 2, src: `${BASE}/7.mp4`, title: "Roto-Molding Quality Check" },
    { id: 3, src: `${BASE}/3.mp4`, title: "PPA Pro Tournament Play" },
    { id: 4, src: `${BASE}/4.mp4`, title: "Live Matches & Testing" },
    { id: 5, src: `${BASE}/1.mp4`, title: "Court Dynamics Analysis" },
    { id: 6, src: `${BASE}/2.mp4`, title: "Pro Match Strategy" },
    { id: 7, src: `${BASE}/6.mp4`, title: "Premium Brand Evaluation" },
  ];

  useEffect(() => {
    if (!sectionRef.current || !scrollContainerRef.current) return;

    const ctx = gsap.context(() => {
      // Create a pinned horizontal scroll just like the product gallery
      const scrollWidth = scrollContainerRef.current!.scrollWidth - window.innerWidth;

      if (scrollWidth > 0) {
        gsap.to(scrollContainerRef.current, {
          x: -scrollWidth,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${scrollWidth + 500}`, 
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [factoryVideos]);

  return (
    <div className="relative w-full">
      <section 
        ref={sectionRef} 
        className="bg-[#050505] h-screen overflow-hidden relative border-t border-white/5"
      >
      <div className="absolute top-20 left-10 md:left-24 z-20 pointer-events-none text-white">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500"
        >
          Factory <span className="text-neon">Live</span>.
        </motion.h2>
        <p className="max-w-md text-gray-400 mt-4 text-xl">
          Direct from Yiwu. Watch our 24/7 OEM production line in action. 
        </p>
      </div>

      {/* Horizontal Scrolling Track for Vertical Videos */}
      <div 
        ref={scrollContainerRef}
        className="flex items-center h-full gap-10 px-10 md:px-24 pt-[10vh]"
      >
        {factoryVideos.map((video, idx) => (
          <div 
            key={video.id}
            className={`relative flex-shrink-0 w-[80vw] sm:w-[50vw] md:w-[25vw] max-w-[400px] aspect-[9/16] rounded-3xl overflow-hidden group border border-white/10 hover:border-neon/50 bg-[#09090b] transition-colors duration-500 shadow-xl ${
              idx % 2 === 0 ? "mt-20" : "-mt-20"
            }`}
          >
            {/* The actual video tag ready for when user uploads files */}
            {video.src ? (
               <video 
                 autoPlay 
                 loop 
                 muted 
                 playsInline 
                 preload="none"
                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                 src={video.src} 
               />
            ) : (
               // Placeholder for visual layout testing
               <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
                 <div className="text-center p-4">
                   <div className="w-16 h-16 rounded-full border border-neon/30 border-t-neon animate-spin mx-auto mb-4" />
                   <p className="text-neon/50 text-sm font-mono">[ Wait For Video Upload ]</p>
                 </div>
               </div>
            )}

            {/* Video Label Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black via-black/50 to-transparent">
              <span className="text-neon text-xs font-mono font-bold tracking-widest mb-1 block">
                CAM_0{video.id} // LIVE
              </span>
              <h3 className="text-white text-xl font-bold uppercase">{video.title}</h3>
            </div>
            
            {/* Ambient hover glow */}
            <div className="absolute inset-0 bg-neon/0 group-hover:bg-neon/10 transition-colors pointer-events-none" />
          </div>
        ))}
        
        {/* End of video gallery block */}
        <div className="relative flex-shrink-0 w-[80vw] md:w-[30vw] h-[50vh] flex flex-col justify-center pl-12">
          <h3 className="text-4xl font-black text-white leading-tight">
            Want to see<br/> more details?
          </h3>
          <p className="text-gray-400 mt-4 text-xl">Schedule a live video tour with our sales team.</p>
          <button 
            onClick={() => {
              const text = encodeURIComponent("Hi, I want to book a live factory video tour.");
              window.open(`https://wa.me/8618666680913?text=${text}`, "_blank");
            }}
            className="mt-8 bg-neon text-black px-8 py-4 rounded-full font-bold self-start shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:shadow-[0_0_40px_rgba(57,255,20,0.6)] hover:bg-white transition-all"
          >
            Book Factory Tour
          </button>
        </div>

      </div>
      </section>
    </div>
  );
}
