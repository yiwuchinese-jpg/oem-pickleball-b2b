"use client";

import React, { useRef, Suspense, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, ScrollControls, useScroll, Scroll, ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion, useScroll as useFramerScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ── Reusable CTA Button ──
function CtaButton({ text = "Chat on WhatsApp", className = "" }: { text?: string, className?: string }) {
  return (
    <button className={`pointer-events-auto bg-neon text-black px-6 py-3 md:px-8 md:py-4 rounded-full font-black uppercase tracking-widest text-xs md:text-sm hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(57,255,20,0.3)] ${className}`}>
      {text}
    </button>
  );
}

// ── 1. Rich 3D Paddle with Wireframe Transition ──
function ScrollAnimatedPaddle({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const group = useRef<THREE.Group>(null);
  const wireframeGroup = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const { viewport } = useThree();

  const isMobile = viewport.width < 5;
  const baseScale = isMobile ? 1.0 : 2.5;

  const wireframeScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({
          color: "#39FF14",
          wireframe: true,
          transparent: true,
          opacity: 0,
        });
      }
    });
    return clone;
  }, [scene]);

  useFrame((state, delta) => {
    if (!group.current || !wireframeGroup.current) return;
    
    const offset = scroll.offset;

    let targetRotX = 0;
    let targetRotY = 0;
    const targetRotZ = 0;
    let targetPosX = 0;
    let targetPosY = 0;
    let targetScale = baseScale;
    
    let solidOpacity = 1;
    let wireOpacity = 0;

    // Page 1: Hero (0 - 1/8)
    if (offset < 1/8) {
      const p = offset / (1/8);
      targetRotY = p * Math.PI;
      targetPosX = isMobile ? 0 : p * 1.5;
      targetPosY = isMobile ? 1 : 0; // Move up slightly on mobile
    } 
    // Page 2: Step 1 - Contact & Intent (1/8 - 2/8)
    else if (offset < 2/8) {
      const p = (offset - 1/8) / (1/8);
      targetRotY = Math.PI + p * Math.PI;
      targetRotX = p * (Math.PI / 4);
      targetPosX = isMobile ? 0 : 1.5 - p * 3; 
      targetPosY = isMobile ? 1 : 0;
      targetScale = baseScale + p * 0.5;
    }
    // Page 3: Step 2 - MOQ & Products (2/8 - 3/8)
    else if (offset < 3/8) {
      const p = (offset - 2/8) / (1/8);
      targetRotY = Math.PI * 2 + p * Math.PI;
      targetRotX = Math.PI / 4 - p * (Math.PI / 4);
      targetPosX = isMobile ? 0 : -1.5 + p * 3; 
      targetPosY = isMobile ? 1.5 : 0;
      targetScale = baseScale + 0.5 + p * 1.5; 
      
      solidOpacity = 1 - p;
      wireOpacity = p;
    }
    // Page 4: Step 3 - Send Logo (3/8 - 4/8)
    else if (offset < 4/8) {
      const p = (offset - 3/8) / (1/8);
      targetRotY = Math.PI * 3 + p * Math.PI * 1; 
      targetRotX = 0;
      targetPosX = isMobile ? 0 : 1.5 + p * 1; 
      targetPosY = isMobile ? 2 : 0;
      targetScale = baseScale + 2.0 - p * 2.0; 
      
      solidOpacity = p;
      wireOpacity = 1 - p;
    }
    // Page 5: Step 4 - Digital Proof (4/8 - 5/8)
    else if (offset < 5/8) {
      const p = (offset - 4/8) / (1/8);
      targetRotY = Math.PI * 4 + p * Math.PI * 2; 
      targetPosX = isMobile ? 0 : 2.5 - p * 5; 
      targetPosY = isMobile ? 1.5 : 0;
    }
    // Page 6-8: Fly away
    else {
      const p = (offset - 5/8) / (3/8);
      targetRotY = Math.PI * 6 + p * Math.PI * 4; 
      targetPosY = p * 15; 
      targetScale = baseScale;
    }

    const dampSpeed = 4;
    group.current.rotation.set(
      THREE.MathUtils.damp(group.current.rotation.x, targetRotX, dampSpeed, delta),
      THREE.MathUtils.damp(group.current.rotation.y, targetRotY, dampSpeed, delta),
      THREE.MathUtils.damp(group.current.rotation.z, targetRotZ, dampSpeed, delta)
    );
    group.current.position.set(
      THREE.MathUtils.damp(group.current.position.x, targetPosX, dampSpeed, delta),
      THREE.MathUtils.damp(group.current.position.y, targetPosY, dampSpeed, delta),
      0
    );
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, targetScale, dampSpeed, delta));

    wireframeGroup.current.rotation.copy(group.current.rotation);
    wireframeGroup.current.position.copy(group.current.position);
    wireframeGroup.current.scale.copy(group.current.scale);

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.Material;
        mat.transparent = true;
        mat.opacity = THREE.MathUtils.damp(mat.opacity, solidOpacity, dampSpeed, delta);
      }
    });
    wireframeScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material as THREE.Material;
        mat.opacity = THREE.MathUtils.damp(mat.opacity, wireOpacity, dampSpeed, delta);
      }
    });
  });

  return (
    <>
      <group ref={group}>
        <primitive object={scene} position={[0, 0, 0]} />
      </group>
      <group ref={wireframeGroup}>
        <primitive object={wireframeScene} position={[0, 0, 0]} />
      </group>
    </>
  );
}

useGLTF.preload("/models/paddle.glb");

// ── 2. Dynamic HTML Overlay Content ──
function HtmlContent() {
  return (
    <div className="w-full text-white">
      
      {/* PAGE 1: Hero */}
      <section className="h-screen w-full flex flex-col items-center justify-center px-4 md:px-6 text-center pointer-events-none relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.03, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
        >
          <h1 className="text-[25vw] md:text-[18vw] font-black text-white whitespace-nowrap tracking-tighter">
            YOUR BRAND
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="z-10 flex flex-col items-center mt-12 relative"
        >
          <div className="inline-flex items-center gap-2 md:gap-3 bg-black/60 backdrop-blur-md border border-white/20 px-4 md:px-6 py-2 rounded-full mb-6 md:mb-8 shadow-[0_0_30px_rgba(57,255,20,0.15)]">
            <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
            <span className="text-gray-100 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase">OEM Customization Journey</span>
          </div>
          
          <h1 className="text-[14vw] md:text-[7vw] leading-[1.1] md:leading-none font-black uppercase tracking-tighter text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            From Idea to <br className="md:hidden"/> <span className="text-neon drop-shadow-[0_0_20px_rgba(57,255,20,0.4)]">Reality</span>
          </h1>
          
          <p className="mt-6 md:mt-8 text-base md:text-2xl text-gray-200 max-w-2xl mx-auto font-light tracking-wide drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)]">
            Follow our 4-step process to launch your own pickleball brand. <br className="hidden md:block"/> Direct from factory. No middlemen.
          </p>
          
          <div className="mt-8 pointer-events-auto">
            <CtaButton text="Start The Journey" />
          </div>
        </motion.div>
      </section>

      {/* PAGE 2: Step 1 - Connect */}
      <section className="h-screen w-full flex items-end md:items-center px-4 md:px-24 pb-20 md:pb-0 pointer-events-none">
        <div className="w-full md:w-1/2 relative">
          <div className="absolute -left-4 md:-left-10 -top-10 text-[25vw] md:text-[15vw] font-black text-white/5 uppercase leading-none select-none">01</div>
          <h2 className="text-4xl md:text-7xl font-black uppercase leading-none text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] relative z-10">
            Step 1: <br /> <span className="text-neon drop-shadow-[0_0_20px_rgba(57,255,20,0.4)]">Connect</span>
          </h2>
          <div className="mt-6 md:mt-8 backdrop-blur-xl bg-black/60 p-6 md:p-8 rounded-3xl border border-neon/30 pointer-events-auto shadow-[0_0_40px_rgba(57,255,20,0.15)] relative z-10">
            <h3 className="text-xl md:text-2xl text-white font-bold mb-3 md:mb-4">Tell Us Your Vision</h3>
            <p className="text-sm md:text-xl text-gray-200 leading-relaxed mb-6">
              Reach out via WhatsApp or email. Let our engineers know your target market and performance requirements. We guide you on materials, shapes, and core thickness.
            </p>
            <CtaButton text="Talk to Engineer" />
          </div>
        </div>
      </section>

      {/* PAGE 3: Step 2 - MOQ */}
      <section className="h-screen w-full flex items-end md:items-center justify-end px-4 md:px-24 pb-20 md:pb-0 pointer-events-none">
        <div className="w-full md:w-1/2 text-left md:text-right relative">
          <div className="absolute right-0 md:-right-10 -top-10 text-[25vw] md:text-[15vw] font-black text-white/5 uppercase leading-none select-none">02</div>
          <h2 className="text-4xl md:text-7xl font-black uppercase leading-none text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] relative z-10">
            Step 2: <br /> <span className="text-white">Requirements</span>
          </h2>
          <div className="mt-6 md:mt-8 md:ml-auto backdrop-blur-xl bg-black/60 p-6 md:p-8 rounded-3xl border border-white/20 pointer-events-auto text-left max-w-md shadow-2xl relative z-10">
            <h3 className="text-xl md:text-2xl text-white font-bold mb-3 md:mb-4">Clear & Direct Terms</h3>
            <ul className="space-y-3 md:space-y-4 text-sm md:text-lg text-gray-200 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-neon font-bold mt-1">✓</span>
                <div>
                  <strong className="text-white">Pickleballs:</strong> MOQ starts at exactly 1,000 units for custom branding.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neon font-bold mt-1">✓</span>
                <div>
                  <strong className="text-white">Paddles:</strong> Flexible MOQ depending on mold and material. Let&apos;s discuss your exact needs.
                </div>
              </li>
            </ul>
            <CtaButton text="Confirm MOQ & Pricing" />
          </div>
        </div>
      </section>

      {/* PAGE 4: Step 3 - Send Logo */}
      <section className="h-screen w-full flex items-end md:items-center px-4 md:px-24 pb-20 md:pb-0 relative pointer-events-none">
        <div className="w-full md:w-1/2 z-10 pointer-events-auto relative">
          <div className="absolute -left-4 md:-left-10 -top-10 text-[25vw] md:text-[15vw] font-black text-white/5 uppercase leading-none select-none pointer-events-none">03</div>
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ amount: 0.5 }}
          >
            <h2 className="text-4xl md:text-7xl font-black uppercase text-white leading-[0.9] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
              Step 3: <br/><span className="text-neon drop-shadow-[0_0_20px_rgba(57,255,20,0.4)]">Design</span>
            </h2>
            <div className="mt-6 md:mt-8 backdrop-blur-xl bg-black/60 p-6 md:p-8 rounded-3xl border border-neon/30 shadow-2xl relative z-10">
               <h3 className="text-xl md:text-2xl text-white font-bold mb-3 md:mb-4">Send Us Your Logo</h3>
               <p className="text-sm md:text-xl text-gray-200 leading-relaxed mb-6">
                 Send us your vector files (AI, PDF, SVG). Our design team will apply your artwork to the paddle face, edge guard, and grip tape using precision UV printing.
               </p>
               <CtaButton text="Send Artwork" />
            </div>
          </motion.div>
        </div>

        {/* Dynamic Scanning Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ amount: 0.5 }}
          className="hidden md:flex absolute right-[15%] top-1/2 -translate-y-1/2 w-72 h-96 border border-neon/50 rounded-[2rem] pointer-events-none flex-col items-center justify-center bg-gradient-to-b from-neon/10 to-transparent backdrop-blur-[2px] overflow-hidden"
        >
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute w-full h-[2px] bg-neon shadow-[0_0_20px_#39FF14]" 
          />
          <div className="text-neon font-black tracking-widest uppercase mt-auto mb-6 text-sm bg-black/80 px-4 py-2 rounded-full">
            Awaiting Logo Upload
          </div>
        </motion.div>
      </section>

      {/* PAGE 5: Step 4 - Digital Proof */}
      <section className="h-screen w-full flex items-end md:items-center justify-end px-4 md:px-24 pb-20 md:pb-0 pointer-events-none">
        <div className="w-full md:w-1/2 text-left md:text-right relative">
          <div className="absolute right-0 md:-right-10 -top-10 text-[25vw] md:text-[15vw] font-black text-white/5 uppercase leading-none select-none">04</div>
          <h2 className="text-4xl md:text-7xl font-black uppercase leading-none text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] relative z-10">
            Step 4: <br /> <span className="text-neon drop-shadow-[0_0_20px_rgba(57,255,20,0.4)]">Approval</span>
          </h2>
          <div className="mt-6 md:mt-8 md:ml-auto backdrop-blur-xl bg-black/60 p-6 md:p-8 rounded-3xl border border-white/20 pointer-events-auto text-left max-w-md shadow-2xl relative z-10">
            <h3 className="text-xl md:text-2xl text-white font-bold mb-3 md:mb-4">Review & Confirm</h3>
            <p className="text-sm md:text-xl text-gray-200 leading-relaxed mb-6">
              Before mass production, we provide high-fidelity digital mockups and, upon request, a physical sample. Once approved, we move to rapid manufacturing.
            </p>
            <CtaButton text="Approve Mockups" />
          </div>
        </div>
      </section>

      {/* PAGE 6: Ecosystem */}
      <section className="h-screen w-full flex flex-col items-center justify-center px-4 md:px-24 relative overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-black/80 z-0" />
        <div className="relative z-10 text-center mb-8 md:mb-16 w-full">
          <h2 className="text-4xl md:text-7xl font-black uppercase">We Build <br className="md:hidden"/><span className="text-neon">Ecosystems.</span></h2>
          <p className="mt-4 md:mt-6 text-gray-400 text-sm md:text-xl max-w-2xl mx-auto px-4">It&apos;s not just paddles. We manufacture custom tournament balls, premium bags, and retail-ready bundle boxes.</p>
          <div className="mt-6 pointer-events-auto">
            <CtaButton text="Inquire About Bundles" />
          </div>
        </div>
        
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-6xl pointer-events-auto px-4">
          {[1, 4, 7, 10].map((num, i) => (
            <motion.div 
              key={num}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, type: "spring" }}
              viewport={{ amount: 0.3 }}
              className="group relative aspect-square bg-[#111] rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/5 hover:border-neon/50 transition-all duration-500 md:hover:-translate-y-4"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-neon/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl md:rounded-3xl transition-opacity" />
              <img src={`/products/${num}.png`} alt={`Product ${num}`} className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] md:group-hover:scale-110 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* PAGE 7: Factory Reality */}
      <section className="h-screen w-full flex flex-col items-center justify-center px-4 md:px-24 bg-[#09090b] relative pointer-events-none">
        <div className="absolute inset-0 bg-[url('/factory-real/factory-2.jpeg')] bg-cover bg-center opacity-20 mix-blend-luminosity" />
        <div className="relative z-10 text-center mb-8 md:mb-16">
          <h2 className="text-4xl md:text-7xl font-black uppercase drop-shadow-2xl">Production <br className="md:hidden"/><span className="text-neon">Unleashed.</span></h2>
          <p className="mt-4 md:mt-6 text-gray-300 text-sm md:text-xl max-w-2xl mx-auto drop-shadow-lg px-4">From raw carbon fiber to packed boxes in our Yiwu facility. Quality controlled at every step.</p>
          <div className="mt-6 pointer-events-auto">
            <CtaButton text="Request Factory Video" />
          </div>
        </div>
        
        <div className="relative z-10 flex flex-row overflow-x-auto md:grid md:grid-cols-3 gap-4 md:gap-8 w-full max-w-7xl px-4 pointer-events-auto pb-4 snap-x">
          {[8, 15, 21].map((num, i) => (
            <motion.div 
              key={num}
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.2, type: "spring" }}
              viewport={{ amount: 0.3 }}
              className="relative w-[80vw] md:w-auto flex-shrink-0 aspect-[4/5] rounded-2xl md:rounded-[2rem] overflow-hidden border-4 border-white/10 shadow-2xl group snap-center"
            >
              <img src={`/factory-real/factory-${num}.jpeg`} alt={`Factory ${num}`} className="absolute inset-0 w-full h-full object-cover md:group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                <div className="bg-neon text-black text-[10px] md:text-xs font-black uppercase px-2 md:px-3 py-1 rounded-full inline-block mb-2">Live Cam</div>
                <h3 className="text-white font-bold text-lg md:text-xl">Phase {i+1}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PAGE 8: Final CTA */}
      <section className="h-screen w-full flex flex-col items-center justify-center text-center relative overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#111] to-[#050505] z-0" />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5 }}
          className="relative z-10 space-y-8 md:space-y-12 px-4"
        >
          <h1 className="text-5xl md:text-[10vw] leading-none font-black uppercase tracking-tighter">
            Ready to <br/><span className="text-neon">Launch?</span>
          </h1>
          <p className="text-sm md:text-3xl text-gray-300 max-w-3xl mx-auto font-light">
            You know the process. Let&apos;s get your first batch into production.
          </p>
          <div className="pt-4 md:pt-8 pointer-events-auto">
            <button className="relative group overflow-hidden bg-white text-black font-black uppercase tracking-widest px-10 py-5 md:px-16 md:py-6 rounded-full text-base md:text-2xl transition-all duration-300 shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(57,255,20,0.6)] hover:scale-105">
              <span className="relative z-10 group-hover:text-black transition-colors">Start WhatsApp Chat</span>
              <div className="absolute inset-0 bg-neon translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* FOOTER AREA */}
      <section className="w-full bg-[#050505] pointer-events-auto relative z-50">
        <Footer />
      </section>

    </div>
  );
}

// ── 3. Idle Popup Component ──
function IdlePopup({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} 
            animate={{ scale: 1, y: 0 }} 
            exit={{ scale: 0.9, y: 20 }}
            className="bg-[#09090b] border border-neon/50 p-8 md:p-10 rounded-3xl max-w-md w-full relative shadow-[0_0_80px_rgba(57,255,20,0.2)] text-center"
          >
            <button 
              onClick={onClose} 
              className="absolute top-4 right-5 text-gray-500 hover:text-white text-2xl font-light transition-colors"
            >
              ✕
            </button>
            
            <div className="w-16 h-16 bg-neon/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-neon/20">
              <span className="text-3xl">💬</span>
            </div>
            
            <h3 className="text-3xl font-black uppercase text-white mb-4 tracking-tight">Still <span className="text-neon">Thinking?</span></h3>
            
            <p className="text-gray-300 mb-8 leading-relaxed text-sm md:text-base">
              Don&apos;t let your competitors beat you to the market. Talk to our engineers right now to get a <strong className="text-white">Free OEM Digital Mockup</strong> for your brand.
            </p>
            
            <button 
              onClick={() => {
                window.open('https://wa.me/yourwhatsappnumber', '_blank');
                onClose();
              }}
              className="w-full bg-neon text-black font-black uppercase tracking-widest py-4 rounded-full hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(57,255,20,0.4)]"
            >
              Chat on WhatsApp
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main Page Wrapper ──
export default function ImmersiveOEMPage() {
  const { scrollYProgress } = useFramerScroll();
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    ["#050505", "#0a0a0a", "#050505", "#111111", "#050505", "#09090b"]
  );

  // ── Idle Timer Logic ──
  const [isIdlePopupOpen, setIsIdlePopupOpen] = useState(false);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const resetIdleTimer = () => {
      if (isIdlePopupOpen) return; // Don't reset if already open
      
      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
      }
      
      // Show popup after 10 seconds of inactivity
      idleTimer.current = setTimeout(() => {
        setIsIdlePopupOpen(true);
      }, 10000);
    };

    // Listen to user activity
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('scroll', resetIdleTimer);
    window.addEventListener('touchmove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    
    // Start timer on mount
    resetIdleTimer();

    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('scroll', resetIdleTimer);
      window.removeEventListener('touchmove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [isIdlePopupOpen]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-auto">
        <Navbar />
      </div>

      <motion.main 
        style={{ backgroundColor }}
        className="w-full h-screen overflow-hidden selection:bg-neon selection:text-black transition-colors duration-500"
      >
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} className="w-full h-full touch-none">
          <ambientLight intensity={1.2} />
          <spotLight position={[10, 10, 10]} intensity={3} angle={0.2} penumbra={1} color="#ffffff" />
          <directionalLight position={[-10, -5, -5]} intensity={2} color="#39FF14" />
          <Environment preset="studio" />

          <Suspense fallback={null}>
            <ScrollControls pages={8.8} damping={0.15} distance={1.2}>
              <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
                <ScrollAnimatedPaddle url="/models/paddle.glb" />
              </Float>
              <ContactShadows position={[0, -3.5, 0]} opacity={0.6} scale={15} blur={3} far={5} color="#000000" />

              <Scroll html style={{ width: '100%' }}>
                <HtmlContent />
              </Scroll>
            </ScrollControls>
          </Suspense>
        </Canvas>
      </motion.main>

      <IdlePopup 
        isOpen={isIdlePopupOpen} 
        onClose={() => setIsIdlePopupOpen(false)} 
      />
    </>
  );
}