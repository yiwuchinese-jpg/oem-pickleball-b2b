"use client";

import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Float, Center, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

function PaddleModel({ url, ...props }: any) {
  const { scene } = useGLTF(url);
  const group = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  // Smooth mouse follow & hover scale
  useFrame((state) => {
    if (!group.current) return;
    
    // Mouse follow
    const targetX = (state.pointer.x * Math.PI) / 4;
    const targetY = (state.pointer.y * Math.PI) / 4;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -targetY, 0.05);

    // Hover scale
    const targetScale = hovered ? 1.1 : 1;
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, targetScale, 0.1));
  });

  return (
    <group 
      ref={group} 
      {...props} 
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = 'pointer';
      }} 
      onPointerOut={(e) => {
        setHover(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

// Preload model
useGLTF.preload('/models/paddle.glb');

export default function Interactive3DShowcase() {
  return (
    <section className="relative py-24 bg-[#09090b] border-y border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-neon)_0%,_transparent_70%)] opacity-[0.03]" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-neon/10 text-neon px-4 py-2 rounded-full border border-neon/20 uppercase text-sm font-bold tracking-wider"
          >
            Next-Gen Technology
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white"
          >
            Interactive <span className="text-neon">3D Paddle View</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Hover your mouse to interact with our 3D model. Experience the exact structure straight from our engineering lab.
          </motion.p>
        </div>

        <div className="w-full h-[500px] md:h-[600px] rounded-3xl border border-white/10 bg-[#111] relative overflow-hidden shadow-[0_0_50px_rgba(57,255,20,0.05)]">
          {/* Overlay UI elements */}
          <div className="absolute top-8 left-8 z-10 pointer-events-none">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white font-bold uppercase tracking-wider text-sm md:text-base">
                <div className="w-2 h-2 rounded-full bg-neon animate-pulse shadow-[0_0_10px_#39FF14]" /> T700 Raw Carbon
              </div>
              <div className="flex items-center gap-3 text-white font-bold uppercase tracking-wider text-sm md:text-base">
                <div className="w-2 h-2 rounded-full bg-neon animate-pulse shadow-[0_0_10px_#39FF14]" /> 16mm Honeycomb Core
              </div>
              <div className="flex items-center gap-3 text-white font-bold uppercase tracking-wider text-sm md:text-base">
                <div className="w-2 h-2 rounded-full bg-neon animate-pulse shadow-[0_0_10px_#39FF14]" /> TPU Edge Guard
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 right-8 z-10 pointer-events-none">
             <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className="text-neon"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
               Move Mouse to Rotate
             </div>
          </div>

          {/* 3D Canvas */}
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={1.5} />
            <spotLight position={[10, 10, 10]} intensity={2} castShadow />
            <spotLight position={[-10, -10, -10]} intensity={1} color="#39FF14" />
            <directionalLight position={[0, 5, -5]} intensity={1} />
            
            <Suspense fallback={
              <Html center>
                <div className="text-neon font-black uppercase tracking-widest animate-pulse whitespace-nowrap bg-black/80 px-6 py-3 rounded-full border border-neon/30">
                  Loading 3D Engine...
                </div>
              </Html>
            }>
              <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <PaddleModel url="/models/paddle.glb" scale={2.5} />
              </Float>
              <Environment preset="city" />
              <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#39FF14" />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  );
}