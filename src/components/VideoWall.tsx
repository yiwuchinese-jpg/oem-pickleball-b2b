"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function VideoWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

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
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

    // Only use GSAP pin on desktop — mobile uses native CSS scroll
    if (mobile || !sectionRef.current || !scrollContainerRef.current) return;

    const ctx = gsap.context(() => {
      // Wait one tick for layout to settle before measuring
      ScrollTrigger.refresh();
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
            invalidateOnRefresh: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full">
      <section
        ref={sectionRef}
        className="bg-[#050505] border-t border-white/5"
        style={{ minHeight: isMobile ? "auto" : "100vh", overflow: isMobile ? "visible" : "hidden" }}
      >
        <div className="pt-16 pb-8 px-6 md:absolute md:top-20 md:left-24 md:z-20 md:pointer-events-none text-white">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-7xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500"
          >
            Factory <span className="text-neon">Live</span>.
          </motion.h2>
          <p className="max-w-md text-gray-400 mt-4 text-base md:text-xl">
            Direct from Yiwu. Watch our 24/7 OEM production line in action.
          </p>
        </div>

        {/* Mobile: native horizontal scroll. Desktop: GSAP-driven horizontal pan */}
        <div
          ref={scrollContainerRef}
          className={
            isMobile
              ? "flex gap-5 px-6 pb-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              : "flex items-center h-full gap-10 px-10 md:px-24 pt-[10vh]"
          }
          style={isMobile ? {} : { height: "100vh", paddingTop: "20vh" }}
        >
          {factoryVideos.map((video, idx) => (
            <div
              key={video.id}
              className={`relative flex-shrink-0 rounded-3xl overflow-hidden group border border-white/10 hover:border-neon/50 bg-[#09090b] transition-colors duration-500 shadow-xl snap-center ${
                isMobile
                  ? "w-[72vw] aspect-[9/16]"
                  : `w-[25vw] max-w-[360px] aspect-[9/16] ${idx % 2 === 0 ? "mt-20" : "-mt-20"}`
              }`}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                className="absolute inset-0 w-full h-full object-cover"
                src={video.src}
              />
              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-black via-black/50 to-transparent">
                <span className="text-neon text-xs font-mono font-bold tracking-widest mb-1 block">
                  CAM_0{video.id} // LIVE
                </span>
                <h3 className="text-white text-base md:text-xl font-bold uppercase">{video.title}</h3>
              </div>
              <div className="absolute inset-0 bg-neon/0 group-hover:bg-neon/10 transition-colors pointer-events-none" />
            </div>
          ))}

          {/* End CTA card */}
          <div
            className={`relative flex-shrink-0 flex flex-col justify-center ${
              isMobile ? "w-[72vw] py-12 pl-4" : "w-[30vw] h-[50vh] pl-12"
            }`}
          >
            <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">
              Want to see<br />more details?
            </h3>
            <p className="text-gray-400 mt-4 text-base md:text-xl">Schedule a live video tour with our sales team.</p>
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
