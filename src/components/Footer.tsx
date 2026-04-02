"use client";

import { MessageCircle, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { trackCTAClick, trackWhatsAppOpen, trackEmailClick } from "@/lib/analytics";

export default function Footer() {
  const whatsappUrl = "https://wa.me/8618666680913?text=Hi, I saw your pickleball ad, I want to order...";

  return (
    <>
      <footer id="inquiry" data-track-section="Footer" className="bg-background pt-24 pb-32 lg:pb-12 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
            
            {/* Info */}
            <div>
              <h2 className="text-3xl font-black text-white mb-6">
                GET THE FACTORY PRICE NOW.
                <span className="block text-neon">STOP OVERPAYING.</span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-sm">
                As the leading manufacturer in Yiwu, we supply the fastest growing brands worldwide. Minimum order quantity: 1,000 pcs (Balls). Let's build your brand.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-gray-300">
                  <MapPin className="w-5 h-5 text-neon" /> Yiwu, Zhejiang, China
                </div>
                <div className="flex items-center gap-4 text-gray-300">
                  <Mail className="w-5 h-5 text-neon" /> 
                  <a href="mailto:buydiscoball@gmail.com" className="hover:text-neon transition">buydiscoball@gmail.com</a>
                </div>
              </div>
            </div>

            {/* Direct Contact Forms Simulation */}
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-6">Start WhatsApp Chat</h3>
              <p className="text-gray-400 mb-6">Get a quote usually within <span className="font-bold text-white">5 minutes</span>.</p>
              
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  trackCTAClick("Footer_WhatsApp");
                  trackWhatsAppOpen("Footer_WhatsApp");
                }}
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#20BE59] hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all transform hover:-translate-y-1"
              >
                <MessageCircle className="w-6 h-6" /> WhatsApp Us Now
              </a>
              
              <div className="mt-6 flex items-center justify-between">
                <span className="h-px bg-white/10 flex-1" />
                <span className="px-4 text-gray-500 text-sm font-bold">OR</span>
                <span className="h-px bg-white/10 flex-1" />
              </div>
              
              <a 
                href="mailto:buydiscoball@gmail.com"
                onClick={() => trackEmailClick("Footer_Email")}
                className="w-full flex items-center justify-center gap-3 bg-white/10 text-white py-4 mt-6 rounded-xl font-bold text-lg hover:bg-white/20 transition-colors"
              >
                <Mail className="w-6 h-6 text-gray-300" /> Send Email Inquiry
              </a>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-gray-500 text-xs gap-4">
            <p>© {new Date().getFullYear()} Direct China Pickleball Wholesale. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
              Factory Operating Normal
            </div>
          </div>

        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-xl border-t border-white/10 z-50 lg:hidden flex gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            trackCTAClick("MobileSticky_WhatsApp");
            trackWhatsAppOpen("MobileSticky_WhatsApp");
          }}
          className="flex-1 bg-[#25D366] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
        >
          <MessageCircle className="w-5 h-5" /> Chat WhatsApp
        </a>
        <a 
          href="mailto:buydiscoball@gmail.com"
          onClick={() => trackEmailClick("MobileSticky_Email")}
          className="bg-white/10 text-white p-3.5 rounded-xl flex items-center justify-center border border-white/20"
        >
          <Mail className="w-5 h-5" />
        </a>
      </div>
    </>
  );
}
