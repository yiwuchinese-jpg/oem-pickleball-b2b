"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

export default function VideoWall() {
  const scrollRef = useRef<HTMLDivElement>(null);

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

  return (
    <section className="bg-[#050505] border-t border-white/5 py-16 md:py-24">
      {/* Header */}
      <div className="px-6 md:px-24 mb-10">
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

      {/* Horizontal scroll track — native CSS, zero JS dependency */}
      <div
        ref={scrollRef}
        className="flex gap-5 md:gap-8 px-6 md:px-24 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6"
        style={{ scrollbarWidth: "none" }}
      >
        {factoryVideos.map((video, idx) => (
          <div
            key={video.id}
            className={`relative flex-shrink-0 snap-center rounded-3xl overflow-hidden border border-white/10 hover:border-neon/50 bg-[#09090b] transition-colors duration-500 shadow-xl group
              w-[72vw] sm:w-[50vw] md:w-[28vw] lg:w-[22vw] aspect-[9/16]
              ${idx % 2 === 0 ? "md:mt-8" : "md:-mt-8"}`}
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
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10 bg-gradient-to-t from-black via-black/50 to-transparent">
              <span className="text-neon text-xs font-mono font-bold tracking-widest mb-1 block">
                CAM_0{video.id} // LIVE
              </span>
              <h3 className="text-white text-base md:text-xl font-bold uppercase">{video.title}</h3>
            </div>
            <div className="absolute inset-0 bg-neon/0 group-hover:bg-neon/10 transition-colors pointer-events-none" />
          </div>
        ))}

        {/* CTA card at the end */}
        <div className="relative flex-shrink-0 w-[72vw] sm:w-[50vw] md:w-[28vw] lg:w-[22vw] flex flex-col justify-center py-8 pl-2 pr-4">
          <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">
            Want to see<br />more details?
          </h3>
          <p className="text-gray-400 mt-4 text-base md:text-lg">
            Schedule a live video tour with our sales team.
          </p>
          <button
            onClick={() => {
              const text = encodeURIComponent("Hi, I want to book a live factory video tour.");
              window.open(`https://wa.me/8618666680913?text=${text}`, "_blank");
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
