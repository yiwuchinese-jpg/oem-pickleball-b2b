"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger if it hasn't been already
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Synchronize Lenis scrolling with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Use GSAP's ticker to run Lenis's raf (better performance and avoids rendering sync issues)
    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    // Disable GSAP's lag smoothing to avoid jumps during heavy scroll
    gsap.ticker.lagSmoothing(0);

    // Force ScrollTrigger to refresh after components map their heights
    // Using a microtask delay ensures images and DOM are rendered
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
