import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";


// Static page — built once and cached indefinitely
export const revalidate = false;

export const metadata: Metadata = {
  title: "Refund Policy | DJW Pickleball",
  description: "Refund and exchange policy for DJW Pickleball Factory.",
  alternates: {
    canonical: "https://pickleoem.com/refund-policy",
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar forceSolid={true} />
      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-8 uppercase tracking-tight">
          Refund <span className="text-neon">Policy</span>
        </h1>
        
        <div className="prose prose-invert prose-neon max-w-none text-gray-300">
          <p className="text-sm text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <p className="text-lg text-white mb-8 border-l-4 border-neon pl-4 py-2 bg-white/5">
            At DJW Pickleball Factory, we take pride in the quality of our products. If you encounter any issues with your order, we are here to help.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">1. Return and Exchange Conditions</h2>
            <p className="mb-4">
              We accept reasonable requests for returns or exchanges. To be eligible, your request must meet the following criteria:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>The item must be defective, damaged upon arrival, or the wrong item was shipped.</li>
              <li>You must contact our customer service team within <strong>14 days</strong> of receiving your order.</li>
              <li>The item must be unused, in its original packaging, and in the same condition that you received it.</li>
            </ul>
            <p className="text-sm text-gray-400 mt-4 italic">
              * Note: Custom OEM orders or personalized items are generally not eligible for returns unless there is a clear manufacturing defect.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">2. How to Request a Refund or Exchange</h2>
            <p className="mb-4">
              Please do not send your purchase back to the manufacturer without prior authorization. To initiate a request:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-4">
              <li>Contact our customer service team via WhatsApp or Email.</li>
              <li>Provide your Order ID and a clear photo or video demonstrating the issue.</li>
              <li>Our team will review your request and, if reasonable, provide you with instructions and a return shipping address.</li>
            </ol>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">3. Processing Refunds</h2>
            <p className="mb-4">
              Once your return is received and inspected, we will notify you of the approval or rejection of your refund. 
              If approved, the refund will be processed automatically to your original method of payment (e.g., PayPal or Credit Card) within a certain amount of days.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">4. Contact Customer Service</h2>
            <p className="mb-4">
              To start your return/exchange process, please reach out to us immediately:
            </p>
            <div className="bg-[#111] border border-white/10 p-6 rounded-xl mt-4 flex flex-col sm:flex-row gap-4 sm:gap-10">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Email</p>
                <a href="mailto:buydiscoball@gmail.com" className="text-white font-bold hover:text-neon transition-colors">buydiscoball@gmail.com</a>
              </div>
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">WhatsApp</p>
                <a href="https://wa.me/8618666680913" target="_blank" rel="noreferrer" className="text-white font-bold hover:text-neon transition-colors">+86 186 6668 0913</a>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
