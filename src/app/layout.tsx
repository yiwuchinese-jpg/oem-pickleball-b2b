import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import Analytics from "@/components/Analytics";
import "./globals.css";

// 精简字重：只加载实际使用的 4 个字重，减少网络请求
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pickleoem.com'),
  title: "OEM Pickleball Factory | Direct Wholesale & Custom Paddles",
  description: "Direct China factory for premium USAPA approved pickleball paddles and balls. Roto-molded manufacturing, custom OEM/ODM designs. DDP Shipping worldwide.",
  verification: {
    google: "AbaBVHU6Hc0zfIksBzAc3n9932J916u4Zz9eltnEDzM",
  },
  alternates: {
    canonical: "https://pickleoem.com",
  },
  openGraph: {
    title: "OEM Pickleball Factory | Direct Wholesale",
    description: "Premium USAPA approved pickleball paddles and balls. Direct from China.",
    url: "https://pickleoem.com",
    siteName: "Pickleball B2B Supply",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pickleball Wholesale Premium Quality",
      },
    ],
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OEM Pickleball Factory | Direct Wholesale",
    description: "Premium USAPA approved pickleball paddles and balls. Direct from China.",
    images: ["/og-image.jpg"],
  },
};

// Organization JSON-LD 结构化数据
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "OEM Pickleball Factory",
  url: "https://pickleoem.com",
  logo: "https://pickleoem.com/og-image.jpg",
  description: "Direct China factory for premium USAPA approved pickleball paddles and balls.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+86-18666680913",
    contactType: "sales",
    availableLanguage: ["English", "Chinese"],
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Yiwu",
    addressRegion: "Zhejiang",
    addressCountry: "CN",
  },
  sameAs: [
    "https://wa.me/8618666680913",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased dark scroll-smooth`}>
      <head>
        {/* Organization 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* Facebook Pixel — ID: 1461017509091314 */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1461017509091314');
            fbq('track', 'PageView');
          `}
        </Script>
        {/* Pixel noscript fallback（广告拦截或禁用JS时仍可记录落地）*/}
        <noscript>
          {`<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1461017509091314&ev=PageView&noscript=1" />`}
        </noscript>
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-neon selection:text-black">
        {children}
        {/* 滚动深度 & 板块曝光 & 停留时间追踪器（无UI渲染）*/}
        <Analytics />
      </body>
    </html>
  );
}
