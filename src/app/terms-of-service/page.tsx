import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";


// Static page — built once and cached indefinitely
export const revalidate = false;

export const metadata: Metadata = {
  title: "Terms of Service | DJW Pickleball",
  description: "Terms of Service and usage conditions for DJW Pickleball Factory.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar forceSolid={true} />
      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-8 uppercase tracking-tight">
          Terms of <span className="text-neon">Service</span>
        </h1>
        
        <div className="prose prose-invert prose-neon max-w-none text-gray-300">
          <p className="text-sm text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">1. Overview</h2>
            <p className="mb-4">
              Welcome to DJW Pickleball Factory. By visiting our website and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">2. Online Store Terms</h2>
            <p className="mb-4">
              By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">3. Products and Pricing</h2>
            <p className="mb-4">
              Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
            </p>
            <p className="mb-4">
              We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">4. Accuracy of Billing and Account Information</h2>
            <p className="mb-4">
              We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. You agree to provide current, complete and accurate purchase and account information for all purchases made at our store.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">5. Governing Law</h2>
            <p className="mb-4">
              These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of China and applicable international trade laws.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">6. Contact Information</h2>
            <p className="mb-4">
              Questions about the Terms of Service should be sent to us at:
            </p>
            <div className="bg-[#111] border border-white/10 p-6 rounded-xl mt-4">
              <p><strong>DJW Pickleball Factory</strong></p>
              <p>Yiwu, Zhejiang, China</p>
              <p><strong>Email:</strong> buydiscoball@gmail.com</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
