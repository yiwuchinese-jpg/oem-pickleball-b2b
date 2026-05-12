"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, ChevronDown } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { createClient } from "@/utils/supabase/client";

export default function CheckoutClient() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [formValid, setFormValid] = useState(false);

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [saveToAddressBook, setSaveToAddressBook] = useState(false);
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "PH",
    phone: "",
  });

  // Shipping fee removed per request
  const shippingCents = 0;
  const grandTotalCents = Math.round(totalPrice + shippingCents);

  useEffect(() => {
    setIsMounted(true);

    async function fetchUserData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        let newFormData = { ...formData, email: user.email || "" };
        
        // Fetch user's saved addresses from address book
        const { data: addresses } = await supabase
          .from("user_addresses")
          .select("*")
          .eq("user_email", user.email)
          .order("is_default", { ascending: false })
          .order("created_at", { ascending: false });

        if (addresses && addresses.length > 0) {
          setSavedAddresses(addresses);
          const defaultAddress = addresses[0];
          newFormData = {
            ...newFormData,
            firstName: defaultAddress.first_name || "",
            lastName: defaultAddress.last_name || "",
            address: defaultAddress.address || "",
            apartment: defaultAddress.apartment || "",
            city: defaultAddress.city || "",
            state: defaultAddress.state || "",
            zipCode: defaultAddress.zip_code || "",
            country: defaultAddress.country || "PH",
            phone: defaultAddress.phone || "",
          };
        } else {
          // Fallback to fetching from last order if no address book entries
          try {
            const response = await fetch('/api/user/orders');
            if (response.ok) {
              const orders = await response.json();
              if (orders && orders.length > 0 && orders[0].shipping_address) {
                const savedAddress = orders[0].shipping_address;
                newFormData = {
                  ...newFormData,
                  firstName: savedAddress.firstName || "",
                  lastName: savedAddress.lastName || "",
                  address: savedAddress.address || "",
                  apartment: savedAddress.apartment || "",
                  city: savedAddress.city || "",
                  state: savedAddress.state || "",
                  zipCode: savedAddress.zipCode || "",
                  country: savedAddress.country || "PH",
                  phone: savedAddress.phone || "",
                };
              }
            }
          } catch (e) {
            console.error("Error fetching last order address", e);
          }
        }
        
        setFormData(newFormData);
        
        // Re-validate
        const isValid = !!(
          newFormData.email && newFormData.firstName && newFormData.lastName && 
          newFormData.address && newFormData.city && newFormData.state && 
          newFormData.zipCode && newFormData.country && newFormData.phone
        );
        setFormValid(isValid);
      }
    }

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <h1 className="text-3xl font-black mb-4">Your Cart is Empty</h1>
          <p className="text-gray-400 mb-8">Add some products to proceed to checkout.</p>
          <Link href="/products" className="bg-neon text-black font-bold px-8 py-3 rounded-full hover:bg-white transition-colors">
            Return to Shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newData);
    
    // Basic validation check
    const isValid = !!(
      newData.email && newData.firstName && newData.lastName && 
      newData.address && newData.city && newData.state && 
      newData.zipCode && newData.country && newData.phone
    );
    setFormValid(isValid);
  };

  const createOrder = async () => {
    setIsSubmitting(true);
    setPaymentError(null);
    try {
      const response = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.product.id,
            skuId: item.sku.id,
            quantity: item.quantity
          })),
          shippingAddress: formData,
          saveToAddressBook: saveToAddressBook // Instruct backend to save address
        }),
      });

      const orderData = await response.json();
      
      if (orderData.error) {
        throw new Error(orderData.error);
      }
      
      return orderData.id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Create Order Error:", err);
      setPaymentError(err.message || "Could not initiate PayPal checkout");
      setIsSubmitting(false);
      throw err;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onApprove = async (data: any, actions: any) => {
    try {
      // Because we are using the backend to capture the order, 
      // we should NOT call actions.order.capture() on the frontend.
      // Instead, we just pass the orderID to our backend API to do the capture using the Secret Key.
      
      const response = await fetch('/api/checkout/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderID: data.orderID
        })
      });

      if (!response.ok) {
         throw new Error(await response.text());
      }
      
      const captureData = await response.json();
      
      // Clear the local cart (React state + localStorage)
      clearCart();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('djw_cart_v1');
      }

      // Redirect to the success page with the order ID
      router.push(`/checkout/success?order_id=${data.orderID}`);
    } catch (error: any) {
      console.error("PayPal Capture Error Details:", error);
      setPaymentError(`Payment capture failed: ${error?.message || "Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-24 lg:pb-16 px-4">
        <div className="max-w-6xl mx-auto flex flex-col-reverse lg:flex-row gap-12">
          
          {/* Left: Shipping Form */}
          <div className="lg:w-3/5">
            <Link href="/products" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </Link>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white">Contact Information</h2>
            </div>
            
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email address</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors"
                  placeholder="you@company.com"
                />
              </div>

              <div className="flex items-center justify-between mb-6 pt-4 border-t border-white/5">
                <h2 className="text-2xl font-black text-white">Shipping Address</h2>
                {savedAddresses.length > 0 && (
                  <button 
                    type="button"
                    onClick={() => setShowAddressSelector(!showAddressSelector)}
                    className="text-sm font-bold text-neon hover:text-neon/80 transition-colors"
                  >
                    {showAddressSelector ? 'Close Address Book' : 'Use Saved Address'}
                  </button>
                )}
              </div>

              {showAddressSelector && savedAddresses.length > 0 && (
                <div className="bg-[#111] border border-white/10 rounded-2xl p-4 mb-6 max-h-60 overflow-y-auto custom-scrollbar">
                  <div className="space-y-3">
                    {savedAddresses.map(addr => (
                      <div 
                        key={addr.id} 
                        onClick={() => {
                          setFormData({
                            ...formData,
                            firstName: addr.first_name,
                            lastName: addr.last_name,
                            address: addr.address,
                            apartment: addr.apartment || '',
                            city: addr.city,
                            state: addr.state,
                            zipCode: addr.zip_code,
                            country: addr.country,
                            phone: addr.phone
                          });
                          setShowAddressSelector(false);
                        }}
                        className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-neon/50 cursor-pointer transition-colors relative"
                      >
                        {addr.is_default && <span className="absolute top-3 right-3 text-[10px] uppercase font-bold text-neon bg-neon/10 px-2 py-1 rounded-full">Default</span>}
                        <p className="font-bold text-white text-sm">{addr.first_name} {addr.last_name}</p>
                        <p className="text-gray-400 text-xs mt-1">{addr.address} {addr.apartment}</p>
                        <p className="text-gray-400 text-xs">{addr.city}, {addr.state} {addr.zip_code}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">First name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Last name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
                <input 
                  type="text" 
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors"
                  placeholder="Street address or P.O. Box"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Apartment, suite, etc. (optional)</label>
                <input 
                  type="text" 
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                  <input 
                    type="text" 
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">State / Province</label>
                  <input 
                    type="text" 
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">ZIP / Postal Code</label>
                  <input 
                    type="text" 
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Country</label>
                  <select 
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors appearance-none"
                  >
                    <option value="PH">Philippines</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Phone (for delivery)</label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors"
                />
              </div>

              <div className="flex items-center pt-2">
                <input 
                  type="checkbox" 
                  id="saveAddress"
                  checked={saveToAddressBook}
                  onChange={(e) => setSaveToAddressBook(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 text-neon focus:ring-neon bg-white/5"
                />
                <label htmlFor="saveAddress" className="ml-2 text-sm text-gray-400">
                  Save this address to my address book for next time
                </label>
              </div>

              {paymentError && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm mb-4">
                  {paymentError}
                </div>
              )}

              {!formValid ? (
                <div className="w-full bg-white/5 text-gray-500 font-bold py-4 rounded-xl text-center mt-4">
                  Please fill all required shipping details to proceed
                </div>
              ) : (
                <div className="mt-8 pt-4 border-t border-white/10">
                  <div className="mb-4 text-sm text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 p-4 rounded-xl">
                    <p className="font-bold mb-1">Notice: PayPal Only</p>
                    <p>We currently only support PayPal for automated checkout. For other payment methods (e.g., GCash, Bank Transfer), please contact our customer service.</p>
                  </div>
                  <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test", currency: "PHP", commit: true }}>
                    <PayPalButtons 
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={(err) => {
                        console.error(err);
                        setPaymentError("PayPal encountered an error. Please try again.");
                        setIsSubmitting(false);
                      }}
                      onCancel={() => {
                        setIsSubmitting(false);
                      }}
                      style={{ layout: "vertical", color: "gold", shape: "rect" }}
                      disabled={isSubmitting}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
            </form>
          </div>

          {/* Mobile: Toggle Order Summary */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileSummary(!showMobileSummary)}
              className="w-full flex items-center justify-between bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-white font-bold"
            >
              <span>Order Summary (₱{(grandTotalCents / 100).toFixed(2)})</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${showMobileSummary ? 'rotate-180' : ''}`} />
            </button>
            {showMobileSummary && (
              <div className="mt-3 bg-[#111] border border-white/10 rounded-2xl p-4">
                {/* Order Summary content - same as desktop right panel */}
                <div className="space-y-4 mb-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.sku.id} className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 bg-white rounded-lg overflow-hidden relative border border-white/10">
                          <Image
                            src={item.sku.image_url || "/products/1.png"}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center z-10 shadow-sm border border-[#0b1120]">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <h3 className="text-sm font-bold text-white truncate">{item.product.title}</h3>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{item.sku.sku_code}</p>
                      </div>
                      <div className="flex items-center justify-end flex-shrink-0">
                        <span className="text-sm font-bold text-white">₱{((item.sku.price_cents * item.quantity) / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pt-4 border-t border-white/10 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">₱{(totalPrice / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Estimated Shipping</span>
                    <span className="text-white font-medium">{shippingCents === 0 ? "Free" : `₱${(shippingCents / 100).toFixed(2)}`}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 mt-4 border-t border-white/10">
                  <span className="text-base font-medium text-white">Total</span>
                  <span className="text-xl font-black text-neon">₱{(grandTotalCents / 100).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary (Desktop) */}
          <div className="lg:w-2/5">
            <div className="bg-[#0b1120] border border-white/10 rounded-3xl p-6 sticky top-24">
              <h2 className="text-xl font-black text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.sku.id} className="flex gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden relative border border-white/10">
                        <Image
                          src={item.sku.image_url || "/products/1.png"}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center z-10 shadow-sm border border-[#0b1120]">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-sm font-bold text-white line-clamp-2">{item.product.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">{item.sku.sku_code}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex items-center justify-end">
                      <span className="text-sm font-bold text-white">₱{((item.sku.price_cents * item.quantity) / 100).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-white/10 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">₱{(totalPrice / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Estimated Shipping</span>
                  <span className="text-white font-medium">{shippingCents === 0 ? "Free" : `₱${(shippingCents / 100).toFixed(2)}`}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/10">
                <span className="text-lg font-medium text-white">Total</span>
                <div className="text-right">
                  <span className="text-xs text-gray-400 mr-2">PHP</span>
                  <span className="text-3xl font-black text-neon">₱{(grandTotalCents / 100).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5 text-xs text-gray-400">
                <ShieldCheck className="w-5 h-5 text-neon flex-shrink-0" />
                <p>
                  Secure checkout powered by PayPal. Currently only PayPal is supported online. For GCash or Bank Transfer, please contact support. Your payment information is encrypted and never stored on our servers.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}