import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";


// Static page — built once and cached indefinitely
export const revalidate = false;

export const metadata: Metadata = {
  title: "Privacy Policy | DJW Pickleball",
  description: "Privacy Policy and data collection practices for DJW Pickleball Factory.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar forceSolid={true} />
      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-8 uppercase tracking-tight">
          Privacy <span className="text-neon">Policy</span>
        </h1>
        
        <div className="prose prose-invert prose-neon max-w-none text-gray-300">
          <p className="text-sm text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              When you visit our website, place an order, or contact us, we may collect the following information:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Personal Information:</strong> Name, email address, phone number, and shipping address.</li>
              <li><strong>Payment Information:</strong> Processed securely through PayPal. We do not store your credit card numbers on our servers.</li>
              <li><strong>Usage Data:</strong> IP address, browser type, and interactions with our website to improve our services.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use the collected information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>To process and fulfill your wholesale and retail orders.</li>
              <li>To communicate with you regarding order updates, shipping (e.g., Yanwen tracking), and customer support.</li>
              <li>To improve our website, product offerings, and customer experience.</li>
              <li>To comply with legal obligations and prevent fraud.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Sharing and Third Parties</h2>
            <p className="mb-4">
              We respect your privacy and do not sell your personal information. We only share necessary data with trusted third parties essential for our operations:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Payment Processors:</strong> PayPal (for processing transactions).</li>
              <li><strong>Shipping Providers:</strong> Logistics companies like Yanwen to deliver your orders.</li>
              <li><strong>Analytics:</strong> Tools like Facebook Pixel to understand website traffic.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
            <p className="mb-4">
              We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-[#111] border border-white/10 p-6 rounded-xl mt-4">
              <p><strong>Email:</strong> buydiscoball@gmail.com</p>
              <p><strong>WhatsApp:</strong> +86 186 6668 0913</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
