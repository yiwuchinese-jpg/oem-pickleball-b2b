"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, CheckCircle2, Truck, ShieldCheck, CreditCard, Star } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { Product as DbProduct, ProductSku } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { trackCTAClick, trackWhatsAppOpen } from "@/lib/analytics";

type DbProductWithSkus = DbProduct & { product_skus: ProductSku[] };

type RelatedProduct = {
  id: string;
  title: string;
  slug: string;
  gallery_images: string[] | null;
  product_skus: { price_cents: number; image_url: string }[];
};

export default function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: DbProductWithSkus;
  relatedProducts: RelatedProduct[];
}) {
  const { addItem } = useCart();
  const skus = product.product_skus || [];
  
  const [selectedSku, setSelectedSku] = useState<ProductSku | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Custom Alert Modal State
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: ''
  });

  const showAlert = (title: string, message: string) => {
    setAlertDialog({ isOpen: true, title, message });
  };

  const galleryImages = product.gallery_images && product.gallery_images.length > 0 
    ? product.gallery_images 
    : [skus[0]?.image_url || "/products/1.png"];
    
  const displayImage = selectedSku ? selectedSku.image_url : galleryImages[activeGalleryIndex];

  // Collect all possible unique images to pre-render them in the DOM for true zero-latency switching
  const allImages = Array.from(new Set([
    ...galleryImages,
    ...skus.map(sku => sku.image_url).filter(Boolean)
  ]));

  // Ensure the page scrolls to the absolute top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product.id]);

  if (!skus.length) return null;

  const handleAddToCart = () => {
    if (!selectedSku) {
      showAlert("Missing Variant", "Please select a variant first.");
      return;
    }
    trackCTAClick("add_to_cart");
    addItem(product, selectedSku, quantity);
  };

  const isSoldOut = selectedSku ? selectedSku.stock_quantity <= 0 : false;
  // Assuming database price is now stored correctly in cents of the target currency (PHP)
  const currentPriceCents = selectedSku ? selectedSku.price_cents : (skus[0]?.price_cents || 1999);
  const currentPrice = (currentPriceCents / 100).toFixed(2);
  
  // Calculate mock shipping cost based on weight (e.g., 50 PHP base + 10 PHP per 100g)
  // This will be replaced by your real shipping table later
  const currentWeight = selectedSku ? (selectedSku.weight_grams || 25) : (skus[0]?.weight_grams || 25);
  // User requested fixed 50 RMB shipping cost per item. 1 RMB = 8.874 PHP.
  const shippingCostPhp = 50 * 8.874;

  const Accordion = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="border-b border-gray-200 py-4">
        <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full text-left">
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-gray-600" />
            <span className="font-bold text-gray-900 text-sm">{title}</span>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>
        {isOpen && <div className="mt-3 pl-8 text-sm text-gray-600 leading-relaxed">{children}</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 flex flex-col">
      <Navbar forceSolid={true} />

      <main className="flex-grow pt-24 pb-28 lg:pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb / Back */}
          <Link href="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 bg-white p-6 md:p-12 rounded-3xl shadow-sm border border-gray-100">
            {/* Left: Image Gallery */}
            <div className="lg:w-[45%] flex flex-col gap-4 relative">
              <div className="sticky top-28 flex flex-col gap-4">
                {/* Main Image - Fixed 1:1 Aspect Ratio with white background */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center p-4">
                  {isSoldOut && (
                    <span className="absolute top-4 left-4 z-10 bg-gray-200 text-gray-800 text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wide">
                      Sold out
                    </span>
                  )}
                  {!isSoldOut && product.tag && (
                    <span className="absolute top-4 left-4 z-10 bg-black text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wide">
                      {product.tag}
                    </span>
                  )}
                  <div className="relative w-full h-full">
                    {/* Render ALL images in the DOM, but only show the active one. This forces the browser to decode and paint them in advance, eliminating ANY switching delay */}
                    {allImages.map((imgUrl, idx) => (
                      <img
                        key={idx}
                        src={imgUrl || "/products/1.png"}
                        alt={`${product.title} - view ${idx}`}
                        className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-0 ${
                          displayImage === imgUrl ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                        }`}
                        decoding="sync"
                      />
                    ))}
                  </div>

                  {/* Left / Right Arrows (Mobile Only) */}
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedSku(null);
                          setActiveGalleryIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
                        }}
                        className="absolute left-2 z-20 p-2 bg-white/80 hover:bg-white text-black rounded-full shadow-md backdrop-blur-sm md:hidden flex items-center justify-center transition-transform active:scale-95"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSku(null);
                          setActiveGalleryIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-2 z-20 p-2 bg-white/80 hover:bg-white text-black rounded-full shadow-md backdrop-blur-sm md:hidden flex items-center justify-center transition-transform active:scale-95"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails (Desktop) - Horizontal layout below main image */}
                <div className="hidden md:flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {galleryImages.map((imgUrl, idx) => (
                    <button
                      key={`thumb-${idx}`}
                      onClick={() => {
                        setSelectedSku(null);
                        setActiveGalleryIndex(idx);
                      }}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-white border-2 transition-all ${
                        !selectedSku && activeGalleryIndex === idx ? "border-black shadow-md" : "border-gray-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={imgUrl} alt={`Thumbnail ${idx}`} fill className="object-contain p-1" unoptimized={true} />
                    </button>
                  ))}
                </div>

                {/* Mobile Image Dots */}
                {galleryImages.length > 1 && (
                  <div className="flex md:hidden justify-center gap-1.5 mt-2">
                    {galleryImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedSku(null);
                          setActiveGalleryIndex(idx);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          !selectedSku && activeGalleryIndex === idx
                            ? "bg-gray-800 w-4"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="lg:w-[55%] flex flex-col">
              <div className="mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  DJW FACTORY
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-2 mb-4">{product.title}</h1>
              
                {/* Price */}
              <div className="mb-6">
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ₱{currentPrice}
                  </span>
                </div>
                
                {/* Stock Status */}
                <div className="mt-4 flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isSoldOut ? "bg-gray-400" : "bg-green-500"}`} />
                  <span className="text-sm font-medium text-gray-600">
                    {isSoldOut ? "Out of stock" : "In stock"}
                  </span>
                </div>
              </div>

              <div className="w-full h-px bg-gray-200 my-6" />

              {/* SKU Attributes Selector */}
              {skus.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">
                    Variant: <span className="font-normal text-gray-600">{selectedSku ? (selectedSku.attributes.Variant || Object.values(selectedSku.attributes).join(" ") || selectedSku.sku_code) : "Please select"}</span>
                  </h3>
                  <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {skus.map(sku => {
                      const attrLabels = sku.attributes.Variant || Object.values(sku.attributes).join(" ");
                      return (
                        <button
                          key={sku.id}
                          onClick={() => setSelectedSku(sku)}
                          title={attrLabels || sku.sku_code}
                          className={`flex items-center gap-4 p-2.5 rounded-xl border-2 transition-all text-left ${
                            selectedSku && selectedSku.id === sku.id
                              ? "border-black bg-gray-50"
                              : "border-transparent hover:bg-gray-50"
                          }`}
                        >
                          <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-lg border border-gray-200">
                            <Image src={sku.image_url || "/products/1.png"} alt={attrLabels} fill className="object-contain p-1" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-bold text-gray-800 block truncate">
                              {attrLabels || sku.sku_code}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5 block">
                              ₱{(sku.price_cents / 100).toFixed(2)} • Stock: {sku.stock_quantity}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Delivery Estimate & Shipping */}
              <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-800">
                    Shipping to <strong>Philippines</strong>: Free (DDP Included)
                  </p>
                </div>
                <div className="flex items-center gap-3 pl-8">
                  <p className="text-xs text-green-700 opacity-80">
                    Estimated delivery between <strong>May 09 and May 12</strong>.
                  </p>
                </div>
                <div className="flex items-center gap-3 pl-8 mt-1">
                  <p className="text-xs text-green-700 opacity-80">
                    Package Weight: {currentWeight}g {selectedSku?.attributes?.Dimensions ? `• Dimensions: ${selectedSku.attributes.Dimensions}` : ''}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <div className="flex items-center bg-white border border-gray-300 rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-gray-500 hover:text-black transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium text-gray-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(selectedSku ? selectedSku.stock_quantity : 99, quantity + 1))}
                    className="px-4 py-3 text-gray-500 hover:text-black transition-colors"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  disabled={isSoldOut}
                  className="flex-1 bg-[#003B4A] text-white font-bold py-3 rounded-lg hover:bg-[#002a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSoldOut ? "Sold out" : "Add to cart"}
                </button>
              </div>
              
              {/* Wholesale Notice */}
              <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-3">
                <div className="mt-0.5 text-neon">
                  <Star className="w-5 h-5 fill-neon" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">Looking for bulk orders?</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    If you need to purchase or wholesale high-quality tournament professional balls in bulk, please <button onClick={() => {
                      trackWhatsAppOpen("ProductDetail_Wholesale_CTA");
                      window.open(`https://wa.me/8618666680913?text=${encodeURIComponent("Hi, I saw your products on the site and I want to get wholesale pricing...")}`, '_blank');
                    }} className="font-bold text-black underline hover:text-gray-600 transition-colors">contact customer service</button> for special factory pricing.
                  </p>
                </div>
              </div>
              
              {/* Accordions */}
              <div className="mt-4 border-t border-gray-200">
                <Accordion title="100% Authentic" icon={CheckCircle2}>
                  Shop with confidence — all items are 100% genuine and brand-approved.
                </Accordion>
                <Accordion title="Shipping & Delivery" icon={Truck}>
                  Ships out within 2-4 working days with tracking available.
                </Accordion>
                <Accordion title="Warranty" icon={ShieldCheck}>
                  Check if your product includes a warranty and protect your purchase.
                </Accordion>
                <Accordion title="Payment Options" icon={CreditCard}>
                  Pay securely with PayPal. All transactions are fast, safe, and hassle-free. For GCash or Bank Transfer, please contact our customer service.
                </Accordion>
              </div>
              
            </div>
          </div>

          {/* Description, Reviews, and Recommendations */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Col: Description & Reviews */}
            <div className="lg:col-span-2 space-y-16">
              
              {/* Description Details */}
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Product Details</h2>
                <div className="prose max-w-none text-gray-600 leading-loose">
                  <p>{product.description}</p>
                  
                  {/* Mocked 1688 Long Description Images */}
                  <div className="mt-8 flex flex-col gap-0">
                    <p className="text-sm text-gray-500 italic text-center mb-4">-- Detailed visual description --</p>
                    {product.detail_images && product.detail_images.length > 0 ? (
                      product.detail_images.map((imgUrl, idx) => (
                        <div key={idx} className="relative w-full overflow-hidden leading-none flex">
                           <Image 
                             src={imgUrl} 
                             alt={`Detail ${idx}`} 
                             width={1200}
                             height={1600}
                             className="w-full h-auto object-contain block" 
                             unoptimized={true} 
                           />
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="relative w-full overflow-hidden leading-none flex">
                           <Image src="/gallery/gallery_1.jpg" alt="Detail 1" width={1200} height={1600} className="w-full h-auto object-contain block" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </section>

              {/* Reviews */}
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-gray-900">Customer Reviews</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                    </div>
                    <span className="font-bold text-gray-900">4.9/5</span>
                    <span className="text-gray-500 text-sm">(128 reviews)</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Mock Review 1 */}
                  <div className="border-b border-gray-100 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900">Michael S.</span>
                      <span className="text-sm text-gray-500">2 days ago</span>
                    </div>
                    <div className="flex text-yellow-400 mb-3">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-gray-600">These balls are incredibly durable. The 40-hole outdoor version flies perfectly straight even in windy conditions. Highly recommend for tournament play.</p>
                  </div>
                  
                  {/* Mock Review 2 */}
                  <div className="border-b border-gray-100 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900">Sarah J.</span>
                      <span className="text-sm text-gray-500">1 week ago</span>
                    </div>
                    <div className="flex text-yellow-400 mb-3">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-gray-600">Great visibility with the neon colors. The bounce is very consistent compared to other cheaper brands I&apos;ve tried. Will buy again.</p>
                  </div>
                </div>
                <button className="mt-6 w-full py-3 border-2 border-black text-black font-bold rounded-xl hover:bg-black hover:text-white transition-colors">
                  Write a Review
                </button>
              </section>
            </div>

            {/* Right Col: Recommendations */}
            <div className="lg:col-span-1">
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-28">
                <h2 className="text-xl font-black text-gray-900 mb-6">You May Also Like</h2>
                
                <div className="space-y-6">
                  {relatedProducts.length === 0 ? (
                    <p className="text-sm text-gray-400">No recommendations available.</p>
                  ) : (
                    relatedProducts.map((rel) => {
                      const imgSrc =
                        rel.gallery_images?.[0] ||
                        rel.product_skus?.[0]?.image_url ||
                        "/products/1.png";
                      const priceCents = rel.product_skus?.[0]?.price_cents ?? 0;
                      const priceDisplay = (priceCents / 100).toFixed(2);
                      return (
                        <Link
                          key={rel.id}
                          href={`/products/${rel.slug}`}
                          className="group flex items-center gap-4"
                        >
                          <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                            <Image
                              src={imgSrc}
                              alt={rel.title}
                              fill
                              className="object-contain p-2 group-hover:scale-110 transition-transform"
                              unoptimized={true}
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm group-hover:text-neon transition-colors line-clamp-2">
                              {rel.title}
                            </h4>
                            <p className="text-gray-500 text-sm mt-1">₱{priceDisplay}</p>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Mobile Sticky Add to Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 flex items-center gap-3 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-black text-gray-900">₱{currentPrice}</p>
        </div>
        <div className="flex items-center bg-gray-100 rounded-lg">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-3 text-gray-500 active:text-black active:scale-90 transition-all"
          >
            -
          </button>
          <span className="w-8 text-center font-bold text-gray-900 text-sm">{quantity}</span>
          <button 
            onClick={() => setQuantity(Math.min(selectedSku ? selectedSku.stock_quantity : 99, quantity + 1))}
            className="px-4 py-3 text-gray-500 active:text-black active:scale-90 transition-all"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isSoldOut}
          className="flex-1 bg-[#003B4A] text-white font-bold py-3.5 px-6 rounded-xl hover:bg-[#002a35] active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg"
        >
          {selectedSku ? (isSoldOut ? "Sold out" : "Add to cart") : "Select variant"}
        </button>
      </div>

      {/* Custom Alert Modal */}
      {alertDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-neon"></div>
            <h3 className="text-xl font-bold text-white mb-2">{alertDialog.title}</h3>
            <p className="text-gray-400 mb-8">{alertDialog.message}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setAlertDialog(prev => ({ ...prev, isOpen: false }))}
                className="px-6 py-2.5 rounded-xl bg-neon text-black font-bold hover:bg-neon/90 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}