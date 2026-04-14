"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// 17 张已压缩的实拍图，分组到三行
const ROW_1 = [1, 5, 8, 12, 14, 3, 10].map((n) => `/gallery/gallery_${n}.jpg`);
const ROW_2 = [2, 6, 9, 13, 15, 4, 11].map((n) => `/gallery/gallery_${n}.jpg`);
const ROW_3 = [7, 16, 17, 1, 5, 8, 12].map((n) => `/gallery/gallery_${n}.jpg`);

// 每行 label 文字
const BADGES = [
  { label: "Factory Production", color: "text-neon" },
  { label: "Shipping & Orders", color: "text-blue-400" },
  { label: "Real Customer Photos", color: "text-amber-400" },
];

interface MarqueeRowProps {
  images: string[];
  reverse?: boolean;
  speed?: number; // seconds per full cycle
  height?: string;
}

function MarqueeRow({ images, reverse = false, speed = 30, height = "h-52" }: MarqueeRowProps) {
  // 复制两遍实现无缝循环
  const doubled = [...images, ...images];
  const direction = reverse ? "reverse" : "normal";

  return (
    <div className="overflow-hidden relative w-full">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-[#09090b] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-[#09090b] to-transparent pointer-events-none" />

      <div
        className="flex gap-4"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: direction,
          width: "max-content",
          touchAction: "pan-y",  /* ← 让纵向触摸穿透给页面滚动 */
        }}
      >
        {doubled.map((src, idx) => (
          <div
            key={idx}
            className={`relative flex-shrink-0 ${height} aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 hover:border-neon/40 transition-all duration-300 group shadow-lg`}
          >
            <Image
              src={src}
              alt={`Factory photo ${idx + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 40vw, 20vw"
              loading="lazy"
            />
            {/* subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PhotoGallery() {
  return (
    <section
      className="relative w-full py-20 bg-[#050505] overflow-hidden border-t border-white/5"
      data-track-section="PhotoGallery"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(57,255,20,0.04)_0%,_transparent_70%)] pointer-events-none" />

      {/* Section header */}
      <div className="relative z-10 text-center px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-mono font-bold text-neon tracking-[0.25em] uppercase mb-4 border border-neon/30 px-4 py-1.5 rounded-full bg-neon/5">
            Real Factory · Real Orders · Real Clients
          </span>
          <h2 className="text-4xl md:text-6xl font-black uppercase text-white leading-tight">
            See It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-green-400">
              For Yourself
            </span>
          </h2>
          <p className="mt-4 text-gray-400 text-base md:text-lg max-w-xl mx-auto">
            Hundreds of real shipments. Verified factory. These are our actual production photos — not stock images.
          </p>
        </motion.div>
      </div>

      {/* Three animated rows */}
      <div className="flex flex-col gap-5">
        {/* Row 1 — badge + marquee */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-6 mb-1">
            <div className="w-2 h-2 rounded-full bg-neon animate-pulse" />
            <span className={`text-xs font-bold uppercase tracking-widest ${BADGES[0].color}`}>{BADGES[0].label}</span>
          </div>
          <MarqueeRow images={ROW_1} speed={35} height="h-40 md:h-64" />
        </div>

        {/* Row 2 — reverse direction */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-6 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className={`text-xs font-bold uppercase tracking-widest ${BADGES[1].color}`}>{BADGES[1].label}</span>
          </div>
          <MarqueeRow images={ROW_2} reverse speed={28} height="h-40 md:h-64" />
        </div>

        {/* Row 3 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-6 mb-1">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className={`text-xs font-bold uppercase tracking-widest ${BADGES[2].color}`}>{BADGES[2].label}</span>
          </div>
          <MarqueeRow images={ROW_3} speed={40} height="h-40 md:h-64" />
        </div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative z-10 text-center mt-14 px-6"
      >
        <p className="text-gray-400 text-sm md:text-base mb-5">
          Want to verify quality yourself? Request a free sample pack.
        </p>
        <button
          id="gallery-cta-whatsapp"
          onClick={() => {
            const text = encodeURIComponent("Hi, I saw your factory photos, can I request a sample before ordering?");
            window.open(`https://wa.me/8618666680913?text=${text}`, "_blank");
          }}
          className="inline-flex items-center gap-2 bg-neon text-black px-8 py-4 rounded-full font-bold text-base hover:bg-white transition-colors shadow-[0_0_30px_rgba(57,255,20,0.3)] hover:shadow-[0_0_50px_rgba(57,255,20,0.5)]"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Request Sample Pack
        </button>
      </motion.div>
    </section>
  );
}
