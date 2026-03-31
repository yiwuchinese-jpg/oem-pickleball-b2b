import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pickleball-b2b.vercel.app'),
  title: "OEM Pickleball Factory | Direct Wholesale & Custom Paddles",
  description: "Direct China factory for premium USAPA approved pickleball paddles and balls. Roto-molded manufacturing, custom OEM/ODM designs. DDP Shipping worldwide.",
  openGraph: {
    title: "OEM Pickleball Factory | Direct Wholesale",
    description: "Premium USAPA approved pickleball paddles and balls. Direct from China.",
    url: "https://yourdomain.com",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased dark scroll-smooth`}>
      <head>
        {/* Facebook Pixel Initialization */}
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
            fbq('init', 'YOUR_PIXEL_ID'); // TODO: Replace with real Pixel ID
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-neon selection:text-black">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
