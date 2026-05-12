"use client";

import { useState, useEffect } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ShoppingBag, User } from "lucide-react";
import { trackCTAClick, trackWhatsAppOpen } from "@/lib/analytics";
import { useCart } from "@/lib/cart-context";
import { createClient } from "@/utils/supabase/client";

type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
  megaMenu?: { label: string; href: string; image: string; description: string }[];
};

const NAV_LINKS: NavItem[] = [
  { 
    label: "Products", 
    href: "/products",
    megaMenu: [
      { label: "Paddles", href: "/products?category=PADDLE", image: "/products/1.png", description: "Tournament-grade carbon fiber & composite paddles for every play style." },
      { label: "Balls", href: "/products?category=BALL", image: "/products/15.png", description: "USAPA-approved outdoor & indoor balls built for Philippine courts." },
      { label: "Accessories", href: "/products?category=ACCESSORIES", image: "/products/8.png", description: "Paddle covers, replacement grips & court essentials." },
    ]
  },
  { label: "OEM & Custom", href: "/oem" },
  {
    label: "Our Factory",
    children: [
      { label: "Verify Factory", href: "/factory-tour" },
      { label: "About Factory", href: "/about" },
    ],
  },
  { label: "Blog", href: "/blog" }
];

export default function Navbar({ forceSolid = false }: { forceSolid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<Record<string, any> | null>(null);
  const pathname = usePathname();
  const { openCart, totalItems } = useCart();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    // Check auth state
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Close menu on route change
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleCTA = () => {
    const text = encodeURIComponent("Hi, I want to get wholesale pricing for pickleballs.");
    trackCTAClick("Navbar_CTA");
    trackWhatsAppOpen("Navbar_CTA");
    window.open(`https://wa.me/8618666680913?text=${text}`, "_blank");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-300 ${
          scrolled || menuOpen || forceSolid
            ? "bg-background/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.2)] border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <NextLink href="/" className="flex-shrink-0 flex items-center gap-2">
              <img
                src="/logo-white.png"
                alt="DJW Pickleball"
                className="h-8 md:h-14 w-auto"
              />
              <span className="text-white font-black text-sm md:text-2xl tracking-tighter mt-1">
                <span className="text-neon">DJW</span> Pickleball
              </span>
            </NextLink>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => (
                link.children || link.megaMenu ? (
                  <div
                    key={link.label}
                    className="relative group px-2 py-2 xl:px-3"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center gap-1 text-[13px] xl:text-sm font-semibold text-gray-400 hover:text-white transition-colors duration-200">
                      {link.label}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180 text-neon' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === link.label && link.children && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 top-full mt-2 w-48 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-2"
                        >
                          {link.children.map((child) => (
                            <NextLink
                              key={child.href}
                              href={child.href}
                              className={`block px-4 py-2 text-sm transition-colors hover:bg-white/5 ${
                                pathname === child.href ? "text-neon" : "text-gray-300 hover:text-white"
                              }`}
                            >
                              {child.label}
                            </NextLink>
                          ))}
                        </motion.div>
                      )}
                      
                      {activeDropdown === link.label && link.megaMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute -left-32 top-full mt-2 w-[1000px] bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6"
                        >
                          <div className="text-center mb-6 pb-4 border-b border-white/10">
                            <p className="text-xs text-neon font-bold uppercase tracking-[0.2em]">Shop by Category</p>
                            <p className="text-sm text-gray-500 mt-1">Find the perfect gear for your game</p>
                          </div>
                          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                            {link.megaMenu.map((item) => (
                              <NextLink key={item.label} href={item.href} className="group flex flex-col items-center">
                                <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden mb-3 border border-white/10">
                                  <img src={item.image} alt={item.label} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="bg-neon text-black font-bold text-xs px-4 py-2 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300">Shop Now →</span>
                                  </div>
                                </div>
                                <span className="text-white font-bold text-sm uppercase tracking-wider group-hover:text-neon transition-colors">{item.label}</span>
                                <span className="text-gray-500 text-[11px] text-center mt-1.5 leading-relaxed px-2">{item.description}</span>
                              </NextLink>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <NextLink
                    key={link.href}
                    href={link.href!}
                    className={`relative px-2 py-2 xl:px-3 rounded-lg text-[13px] xl:text-sm font-semibold transition-colors duration-200 group ${
                      pathname === link.href
                        ? "text-neon"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {link.label}
                    {pathname === link.href && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-neon/10 rounded-lg border border-neon/20"
                      />
                    )}
                  </NextLink>
                )
              ))}
            </div>

            {/* Right: CTA + Hamburger */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative group cursor-pointer py-4 hidden md:block">
                <User className="h-6 w-6 text-white hover:text-[#B1F041] transition-colors" />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white text-black rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-2">
                    {user ? (
                      <>
                        <NextLink href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md font-medium">Profile</NextLink>
                        <button onClick={() => supabase.auth.signOut()} className="block w-full text-left px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-md">Sign out</button>
                      </>
                    ) : (
                      <>
                        <NextLink href="/login" className="block px-4 py-2 text-sm text-[#7A0026] hover:bg-gray-100 rounded-md font-medium">Login</NextLink>
                        <NextLink href="/login" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-md">Create account</NextLink>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Profile icon */}
              <NextLink href={user ? "/profile" : "/login"} className="md:hidden p-2 text-gray-400 hover:text-white transition-colors active:scale-90">
                <User className="w-6 h-6" />
              </NextLink>

              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative p-2.5 text-gray-400 hover:text-white transition-colors active:scale-90"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-neon text-black text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={handleCTA}
                className="bg-neon text-black font-bold px-3 py-2 md:px-6 md:py-2.5 rounded-full hover:bg-neon-hover transition-colors shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:shadow-[0_0_25px_rgba(57,255,20,0.6)] transform hover:scale-105 duration-200 text-xs md:text-base whitespace-nowrap"
              >
                <span className="sm:hidden">Quote</span>
                <span className="hidden sm:inline">Get Wholesale Price</span>
              </button>

              {/* Hamburger (mobile) */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors active:scale-90"
                aria-label="Toggle navigation menu"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-[60] bg-background/98 backdrop-blur-xl border-b border-white/10 lg:hidden h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {link.children || link.megaMenu ? (
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                        className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-base font-bold transition-colors text-gray-300 hover:bg-white/5 hover:text-white"
                      >
                        {link.label}
                        <ChevronDown className={`w-5 h-5 transition-transform ${activeDropdown === link.label ? 'rotate-180 text-neon' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === link.label && link.children && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex flex-col gap-1 pl-4 overflow-hidden"
                          >
                            {link.children.map((child) => (
                              <NextLink
                                key={child.href}
                                href={child.href}
                                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                                  pathname === child.href
                                    ? "bg-neon/10 text-neon border border-neon/20"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}
                              >
                                {child.label}
                                <span className="text-gray-600">→</span>
                              </NextLink>
                            ))}
                          </motion.div>
                        )}
                        {activeDropdown === link.label && link.megaMenu && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex flex-col gap-1 pl-4 overflow-hidden"
                          >
                            {link.megaMenu.map((child) => (
                              <NextLink
                                key={child.href}
                                href={child.href}
                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-colors group hover:bg-white/5"
                              >
                                <div className="w-10 h-10 rounded-lg bg-white/10 overflow-hidden flex-shrink-0 border border-white/10">
                                  <img src={child.image} alt={child.label} className="object-cover w-full h-full" />
                                </div>
                                <div className="flex-1">
                                  <span className="text-sm font-bold text-white group-hover:text-neon transition-colors">{child.label}</span>
                                  <p className="text-[11px] text-gray-500 mt-0.5">{child.description}</p>
                                </div>
                                <span className="text-gray-600 group-hover:text-neon transition-colors">→</span>
                              </NextLink>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <NextLink
                      href={link.href!}
                      className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-base font-bold transition-colors ${
                        pathname === link.href
                          ? "bg-neon/10 text-neon border border-neon/20"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {link.label}
                      <span className="text-gray-600">→</span>
                    </NextLink>
                  )}
                </motion.div>
              ))}

              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3">
                {user ? (
                  <NextLink href="/profile" className="w-full flex items-center justify-center gap-2 bg-white/10 text-white font-bold py-4 rounded-xl text-base border border-white/10 active:scale-[0.98]">
                    <User className="w-5 h-5" /> My Profile
                  </NextLink>
                ) : (
                  <NextLink href="/login" className="w-full flex items-center justify-center gap-2 bg-white/10 text-white font-bold py-4 rounded-xl text-base border border-white/10 active:scale-[0.98]">
                    <User className="w-5 h-5" /> Sign In
                  </NextLink>
                )}
                <button
                  onClick={handleCTA}
                  className="w-full bg-neon text-black font-bold py-4 rounded-xl text-base shadow-[0_0_20px_rgba(57,255,20,0.3)] active:scale-[0.98]"
                >
                  WhatsApp for Wholesale Price
                </button>
                <a
                  href="mailto:buydiscoball@gmail.com"
                  className="w-full bg-white/5 text-white font-bold py-3.5 rounded-xl text-base text-center border border-white/10"
                >
                  ✉️ Send Email Inquiry
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
