'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Turnstile } from '@marsidev/react-turnstile';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoginClient({ adminEmail }: { adminEmail?: string }) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
      setError('Please complete the security check.');
      return;
    }
    setLoading(true);
    setError('');

    // Verify Turnstile token on the server to prevent bots
    const verifyRes = await fetch('/api/verify-turnstile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: turnstileToken }),
    });

    if (!verifyRes.ok) {
      setError('Security verification failed. Please try again.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setStep('verify');
    }
    setLoading(false);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });

    if (error) {
      setError(error.message);
    } else {
      // Automatically route admins to the dashboard, normal users to their profile
      if (adminEmail && email.toLowerCase() === adminEmail.toLowerCase()) {
        router.push('/admin/orders');
      } else {
        router.push('/profile');
      }
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar forceSolid={true} />
      <main className="flex-grow flex items-center justify-center pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative">
        {/* Background decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-md w-full bg-[#0b1120] border border-white/10 rounded-3xl shadow-2xl p-8 space-y-8 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl font-black text-white">
              {step === 'email' ? 'Login / Create Account' : 'Enter code'}
            </h2>
            {step === 'verify' && (
              <p className="mt-2 text-sm text-gray-400">
                Sent to <span className="text-white font-medium">{email}</span>
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          {step === 'email' ? (
            <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex justify-center my-4">
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAADLYPdOkVWJBtrsg"}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => setError('Security check failed. Please try again.')}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !turnstileToken}
                className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-neon hover:bg-white focus:outline-none disabled:opacity-50 transition-colors"
              >
                {loading ? 'Sending code...' : 'Continue'}
              </button>
            </form>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleVerify}>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-400 mb-2">Verification code</label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon transition-colors text-center tracking-[0.5em] text-lg font-mono"
                  placeholder="Enter code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.trim())}
                />
              </div>

              <button
                type="submit"
                disabled={loading || code.length === 0}
                className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-neon hover:bg-white focus:outline-none disabled:opacity-50 transition-colors"
              >
                {loading ? 'Verifying...' : 'Submit'}
              </button>

              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  &larr; Sign in with a different email
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
