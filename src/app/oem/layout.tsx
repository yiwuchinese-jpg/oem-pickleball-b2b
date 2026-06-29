import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OEM Pickleball Paddle Manufacturer | Custom Paddle Factory China",
  description:
    "Custom pickleball paddle OEM/ODM factory. T700/T800 carbon fiber, 16mm thermoforming, custom edge guard & grip design. Low MOQ, DDP shipping worldwide. Get a quote in 24h.",
  alternates: {
    canonical: "https://pickleoem.com/oem",
  },
  openGraph: {
    title: "OEM Pickleball Paddle Manufacturer | Custom Paddle Factory",
    description:
      "Custom pickleball paddle OEM/ODM factory in China. T700/T800 carbon fiber, 16mm thermoforming. Low MOQ, DDP shipping worldwide.",
    url: "https://pickleoem.com/oem",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "OEM Pickleball Paddle Factory" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OEM Pickleball Paddle Manufacturer | Custom Factory",
    description: "Custom pickleball paddle OEM/ODM factory in China. Low MOQ, DDP shipping worldwide.",
    images: ["/og-image.jpg"],
  },
};

export default function OEMLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* SSR SEO content — the OEM page itself is a client-rendered 3D experience whose
          headings/copy don't reach the server HTML. This block gives crawlers a real H1
          and keyword-rich intro. Screen-reader accessible (clip), not display:none. */}
      <section
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "normal",
          border: 0,
        }}
      >
        <h1>OEM Pickleball Paddle Manufacturer — Custom Carbon Paddle Factory in China</h1>
        <p>
          Source pickleball factory in China for OEM and ODM custom paddles and rotomolded
          balls. We build raw T700 carbon and fiberglass faces on 13mm and 16mm polypropylene
          honeycomb cores, in thermoformed unibody or cold-pressed construction, with custom
          surface texture, edge guard, grip, and full private-label branding. Low MOQ,
          golden-sample approval, pre-shipment QC, and DDP shipping worldwide.
        </p>
      </section>
      {children}
    </>
  );
}
