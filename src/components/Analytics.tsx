"use client";

/**
 * Analytics 组件 — 无 UI 纯追踪器
 * 自动追踪：滚动深度 / 关键板块曝光 / 页面停留时间
 * 挂载在 layout.tsx body 最底部
 */

import { useEffect } from "react";
import {
  trackScrollDepth,
  trackSectionView,
  trackTimeOnPage,
} from "@/lib/analytics";

export default function Analytics() {
  useEffect(() => {
    // ─── 1. 滚动深度追踪 ────────────────────────────────────────────────────
    const depthsFired = new Set<number>();

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const pct = Math.round((scrolled / docHeight) * 100);

      ([25, 50, 75, 100] as const).forEach((threshold) => {
        if (pct >= threshold && !depthsFired.has(threshold)) {
          depthsFired.add(threshold);
          trackScrollDepth(threshold);
        }
      });
    };

    // 节流：每300ms最多触发一次
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    const throttledScroll = () => {
      if (scrollTimer) return;
      scrollTimer = setTimeout(() => {
        handleScroll();
        scrollTimer = null;
      }, 300);
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });

    // ─── 2. 关键板块曝光追踪 ────────────────────────────────────────────────
    // 对应页面中用 data-track-section 属性标记的板块
    const sectionsFired = new Set<string>();

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const name =
              (entry.target as HTMLElement).dataset.trackSection ?? "unknown";
            if (!sectionsFired.has(name)) {
              sectionsFired.add(name);
              trackSectionView(name);
            }
          }
        });
      },
      { threshold: 0.3 } // 板块露出 30% 才算"被看见"
    );

    // 找所有带 data-track-section 的元素开始观察
    const sections = document.querySelectorAll("[data-track-section]");
    sections.forEach((el) => sectionObserver.observe(el));

    // ─── 3. 页面停留时间追踪 ────────────────────────────────────────────────
    const t10 = setTimeout(() => trackTimeOnPage(10), 10_000);
    const t30 = setTimeout(() => trackTimeOnPage(30), 30_000);
    const t60 = setTimeout(() => trackTimeOnPage(60), 60_000);

    // ─── 清理 ───────────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      sectionObserver.disconnect();
      clearTimeout(t10);
      clearTimeout(t30);
      clearTimeout(t60);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, []);

  // 不渲染任何 DOM
  return null;
}
