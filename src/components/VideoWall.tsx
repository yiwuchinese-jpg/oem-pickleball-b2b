"use client";

import { motion } from "framer-motion";

const factoryVideos = [
  { id: 1, src: "/videos/5.mp4", title: "Factory Production Line" },
  { id: 2, src: "/videos/7.mp4", title: "Roto-Molding Quality Check" },
  { id: 3, src: "/videos/3.mp4", title: "PPA Pro Tournament Play" },
  { id: 4, src: "/videos/4.mp4", title: "Live Matches & Testing" },
  { id: 5, src: "/videos/1.mp4", title: "Court Dynamics Analysis" },
  { id: 6, src: "/videos/2.mp4", title: "Pro Match Strategy" },
  { id: 7, src: "/videos/6.mp4", title: "Premium Brand Evaluation" },
];

// Double the array for seamless infinite loop
const doubled = [...factoryVideos, ...factoryVideos];

export default function VideoWall() {
  return (
    <section
      className="bg-[#050505] border-t border-white/5 py-16 overflow-hidden"
      data-track-section="VideoWall"
    >
      {/* Header */}
      <div className="px-6 md:px-16 mb-10">
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

      {/* Marquee strip — hover to pause */}
      <div
        className="flex gap-6 w-max"
        style={{
          animation: "marquee-video 40s linear infinite",
          touchAction: "pan-y",  /* ← 纵向触摸穿透给页面滚动 */
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.animationPlayState = "running";
        }}
      >
        {doubled.map((video, idx) => (
          <div
            key={idx}
            className={[
              "relative flex-shrink-0 rounded-3xl overflow-hidden",
              "border border-white/10 hover:border-neon/50",
              "bg-[#09090b] transition-colors duration-500 shadow-xl group",
              // Alternate tall/short for staggered look
              idx % 2 === 0
                ? "w-[220px] md:w-[280px] h-[380px] md:h-[480px]"
                : "w-[220px] md:w-[280px] h-[310px] md:h-[400px] mt-12",
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
            {/* Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-10 bg-gradient-to-t from-black via-black/40 to-transparent">
              <span className="text-neon text-[10px] font-mono font-bold tracking-widest mb-1 block">
                CAM_0{video.id} // LIVE
              </span>
              <h3 className="text-white text-xs md:text-sm font-bold uppercase leading-tight">
                {video.title}
              </h3>
            </div>
            <div className="absolute inset-0 bg-neon/0 group-hover:bg-neon/5 transition-colors pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-6 md:px-16 mt-12">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-white">Want a live factory tour?</h3>
          <p className="text-gray-400 text-sm mt-1">Schedule a video call with our sales team.</p>
        </div>
        <button
          id="videowall-cta-whatsapp"
          onClick={() => {
            const text = encodeURIComponent("Hi, I want to book a live factory video tour.");
            window.open(`https://wa.me/8618666680913?text=${text}`, "_blank");
          }}
          className="flex-shrink-0 bg-neon text-black px-7 py-3 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(57,255,20,0.4)] hover:bg-white hover:shadow-[0_0_40px_rgba(57,255,20,0.6)] transition-all whitespace-nowrap"
        >
          Book Factory Tour
        </button>
      </div>
    </section>
  );
}
