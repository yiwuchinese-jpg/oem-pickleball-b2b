"use client";

import { MessageCircle, Mail } from "lucide-react";
import { trackCTAClick, trackWhatsAppOpen, trackEmailClick } from "@/lib/analytics";

export default function MobileStickyCta() {
  const whatsappUrl = "https://wa.me/8618666680913?text=Hi, I saw your pickleball website, I want to get wholesale pricing...";

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-xl border-t border-white/10 z-[9999] lg:hidden flex gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
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
  );
}
