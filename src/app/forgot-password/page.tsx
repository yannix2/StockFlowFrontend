// app/forgot-password/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Mail, Loader2, ArrowRight, AlertCircle, CheckCircle, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../shared/stockflow-high-resolution-logo-grayscale-transparent.png';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch('https://stockflowbackend-2j27.onrender.com/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }

      const data = await response.json();
      setMessage(data.message || 'If an account exists, a password reset email has been sent.');
      setIsError(false);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'An error occurred');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-black flex items-center justify-center p-4 transition-opacity duration-700 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Yellow floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-amber-400/10 animate-float"
            style={{
              width: `${Math.random() * 10 + 5}rem`,
              height: `${Math.random() * 10 + 5}rem`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 30 + 20}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Logo - Top Left */}
      <div className="absolute top-8 left-8">
        <div className="flex items-center space-x-2">
          <BarChart2 className="h-8 w-8 text-amber-400" />
          <Image src={logo} width={160} height={40} alt='stockflow logo' />
        </div>
      </div>

      {/* Main container */}
      <div className={`w-full max-w-md bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden shadow-2xl border border-white/10 transform transition-all duration-700 ${isMounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light text-white mb-2">
              Reset Your Password
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-4 rounded-full"></div>
            <p className="text-white/70 text-sm">
              Enter your email to receive a reset link
            </p>
          </div>

          {/* Status message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center ${
              isError ? 'bg-red-500/10 border border-red-500/30 text-red-300' : 
              'bg-green-500/10 border border-green-500/30 text-green-300'
            }`}>
              {isError ? (
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              ) : (
                <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              )}
              <span className="text-sm">{message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-white/80">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/50 group-focus-within:text-amber-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/30 text-white placeholder-white/30"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white flex items-center justify-center ${
                isLoading ? 'bg-amber-500/50 cursor-not-allowed' :
                'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-white/50">
            Remember your password?{' '}
            <Link
              href="/login"
              className="font-medium text-amber-400 hover:text-amber-300 inline-flex items-center group"
            >
              Sign in
              <ArrowRight className="ml-1 h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}