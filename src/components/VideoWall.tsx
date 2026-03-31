"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function VideoWall() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
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
    if (mobile) return;

    // Delay so the dynamic-imported component's layout fully settles
    // before GSAP measures scrollWidth
    const timer = setTimeout(() => {
      if (!sectionRef.current || !scrollTrackRef.current) return;

      const scrollWidth =
        scrollTrackRef.current.scrollWidth - window.innerWidth;

      if (scrollWidth <= 0) return;

      const ctx = gsap.context(() => {
        gsap.to(scrollTrackRef.current, {
          x: -scrollWidth,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${scrollWidth}`,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    }, 400); // wait 400ms for layout to settle after dynamic import

    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#050505] border-t border-white/5"
      style={{ height: isMobile ? "auto" : "100vh", overflow: "hidden" }}
    >
      {/* Header — normal flow on mobile, absolute on desktop */}
      <div
        className={
          isMobile
            ? "px-6 pt-12 pb-6"
            : "absolute top-16 left-16 xl:left-24 z-20 pointer-events-none"
        }
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-7xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500"
        >
          Factory <span className="text-neon">Live</span>.
        </motion.h2>
        <p className="max-w-md text-gray-400 mt-3 text-base md:text-xl">
          Direct from Yiwu. Watch our 24/7 OEM production line in action.
        </p>
      </div>

      {/* Scroll track */}
      <div
        ref={scrollTrackRef}
        className={
          isMobile
            ? "flex gap-5 px-6 pb-8 overflow-x-auto snap-x snap-mandatory"
            : "flex items-center h-full gap-10 px-16 xl:px-24 pt-[18vh]"
        }
        style={isMobile ? { scrollbarWidth: "none" } : {}}
      >
        {factoryVideos.map((video, idx) => (
          <div
            key={video.id}
            className={[
              "relative flex-shrink-0 rounded-3xl overflow-hidden",
              "border border-white/10 hover:border-neon/50",
              "bg-[#09090b] transition-colors duration-500 shadow-xl group",
              isMobile
                ? "w-[72vw] snap-center aspect-[9/16]"
                : `w-[22vw] max-w-[340px] aspect-[9/16] ${idx % 2 === 0 ? "mt-16" : "-mt-16"}`,
            ].join(" ")}
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
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10 bg-gradient-to-t from-black via-black/50 to-transparent">
              <span className="text-neon text-xs font-mono font-bold tracking-widest mb-1 block">
                CAM_0{video.id} // LIVE
              </span>
              <h3 className="text-white text-sm md:text-xl font-bold uppercase">
                {video.title}
              </h3>
            </div>
            <div className="absolute inset-0 bg-neon/0 group-hover:bg-neon/10 transition-colors pointer-events-none" />
          </div>
        ))}

        {/* End CTA */}
        <div
          className={
            isMobile
              ? "flex-shrink-0 w-[72vw] snap-center flex flex-col justify-center py-10 px-4"
              : "flex-shrink-0 w-[28vw] max-w-[420px] h-full flex flex-col justify-center pl-8"
          }
        >
          <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">
            Want to see
            <br />
            more details?
          </h3>
          <p className="text-gray-400 mt-4 text-base md:text-xl">
            Schedule a live video tour with our sales team.
          </p>
          <button
            onClick={() => {
              const text = encodeURIComponent(
                "Hi, I want to book a live factory video tour."
              );
              window.open(
                `https://wa.me/8618666680913?text=${text}`,
                "_blank"
              );
            }}
            className="mt-8 bg-neon text-black px-8 py-4 rounded-full font-bold self-start shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:shadow-[0_0_40px_rgba(57,255,20,0.6)] hover:bg-white transition-all whitespace-nowrap"
          >
            Book Factory Tour
          </button>
        </div>
      </div>
    </section>
  );
}
