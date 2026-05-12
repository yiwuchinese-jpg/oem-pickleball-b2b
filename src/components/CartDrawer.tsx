"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { items, isOpen: isCartOpen, closeCart, updateQty, removeItem, totalPrice } = useCart();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [swipeOffset, setSwipeOffset] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const totalFormatted = (totalPrice / 100).toFixed(2);

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  const getDrawerVariants = () => {
    return {
      hidden: { x: "100%" },
      visible: { x: swipeOffset },
      exit: { x: "100%" },
    };
  };

  return (
    <AnimatePresence mode="wait">
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
          />

          <motion.div
            ref={drawerRef}
            initial={getDrawerVariants().hidden}
            animate={getDrawerVariants().visible}
            exit={getDrawerVariants().exit}
            transition={{ type: "spring", damping: 28, stiffness: 250 }}
            drag={typeof window !== 'undefined' && window.innerWidth < 640 ? "x" : false}
            dragConstraints={{ left: 0, right: 200 }}
            dragElastic={0.3}
            onDragStart={(_, info) => setTouchStart(info.point.x)}
            onDrag={(_, info) => {
              const offset = Math.max(0, info.point.x - touchStart);
              setSwipeOffset(offset);
            }}
            onDragEnd={() => {
              if (swipeOffset > 100) {
                closeCart();
              }
              setSwipeOffset(0);
            }}
            className={`fixed z-[101] flex flex-col bg-[#0d0d10] border-white/10 shadow-2xl
              top-0 right-0 h-full w-full sm:w-[420px] border-l
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 sm:p-6 border-b border-white/10">
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-neon" />
                Your Cart
                {items.length > 0 && (
                  <span className="text-sm font-bold text-gray-400">({items.length})</span>
                )}
              </h2>
              <button
                onClick={closeCart}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white active:scale-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 sm:p-6 space-y-4 overscroll-contain">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-60 pb-20">
                  <ShoppingBag className="w-20 h-20 mb-6 text-gray-500" />
                  <p className="text-xl font-bold text-white mb-2">Your cart is empty</p>
                  <p className="text-sm text-gray-400 max-w-[200px]">Add some products to start wholesale checkout.</p>
                  <button 
                    onClick={closeCart}
                    className="mt-8 px-8 py-3 bg-neon/10 text-neon rounded-full font-bold border border-neon/20 hover:bg-neon/20 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.sku.id} className="flex gap-3 sm:gap-4 bg-white/5 p-3 sm:p-3 rounded-2xl border border-white/5 active:bg-white/[0.08] transition-colors">
                    <div className="relative w-[72px] h-[72px] sm:w-20 sm:h-20 bg-white rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={item.sku.image_url || "/products/1.png"}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-1">
                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-sm font-bold text-white truncate">{item.product.title}</h3>
                          <p className="text-[11px] text-gray-400 mt-0.5 truncate">{item.sku.sku_code}</p>
                        </div>
                        <button 
                          onClick={() => removeItem(item.sku.id)}
                          className="p-1.5 text-gray-500 hover:text-red-400 transition-colors active:scale-90"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-neon font-bold text-sm">₱{(item.sku.price_cents * item.quantity / 100).toFixed(2)}</span>
                        
                        <div className="flex items-center gap-3 bg-black/60 rounded-lg px-2.5 py-1.5 border border-white/10">
                          <button 
                            onClick={() => updateQty(item.sku.id, item.quantity - 1)}
                            className="text-gray-400 hover:text-white active:scale-90 p-0.5"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold w-5 text-center text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQty(item.sku.id, item.quantity + 1)}
                            className="text-gray-400 hover:text-white active:scale-90 p-0.5"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="px-5 py-4 sm:p-6 border-t border-white/10 bg-black/60 backdrop-blur-md">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400 font-medium text-sm">Subtotal</span>
                  <span className="text-xl sm:text-2xl font-black text-white">₱{totalFormatted}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 bg-neon text-black py-4 rounded-2xl font-black text-base sm:text-lg hover:bg-white transition-colors shadow-[0_0_20px_rgba(57,255,20,0.2)] active:scale-[0.98]"
                >
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-center text-xs text-gray-500 mt-3">
                  Taxes and shipping calculated at checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
