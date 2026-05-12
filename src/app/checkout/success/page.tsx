"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="bg-[#0b1120] border border-white/10 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl">
      <CheckCircle className="w-20 h-20 text-neon mx-auto mb-6" />
      <h1 className="text-3xl font-black text-white mb-4">Payment Successful!</h1>
      <p className="text-gray-400 mb-6">
        Thank you for your order. We've received your payment and are processing your items.
      </p>
      
      {orderId && (
        <div className="bg-white/5 rounded-xl p-4 mb-8 text-sm border border-white/5">
          <span className="text-gray-500">Order Reference:</span>
          <p className="text-white font-mono mt-1 text-lg">{orderId}</p>
        </div>
      )}

      <p className="text-sm text-gray-500 mb-8">
        An order confirmation has been sent to your email address. You can track your order status and shipping updates in your account profile.
      </p>

      <div className="space-y-4">
        <Link 
          href="/profile" 
          className="block w-full bg-neon text-black font-bold px-8 py-4 rounded-xl hover:bg-white transition-colors"
        >
          View My Orders
        </Link>
        <Link 
          href="/products" 
          className="block w-full bg-transparent border border-white/20 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar forceSolid={true} />
      <main className="flex-grow flex flex-col items-center justify-center p-4 pt-32 pb-16 relative">
        {/* Background decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon/10 rounded-full blur-[120px] pointer-events-none" />
        
        <Suspense fallback={<div className="text-white">Loading order details...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
