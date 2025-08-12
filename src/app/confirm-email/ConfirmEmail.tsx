// app/confirm-email/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader2, MailCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../shared/stockflow-high-resolution-logo-grayscale-transparent.png';
import { BarChart2 } from 'lucide-react';

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const verifyEmail = async () => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token found');
      return;
    }

    setStatus('loading');
    setMessage('Verifying your email...');

    try {
      const response = await fetch(`https://stockflowbackend-2j27.onrender.com/auth/verify-email?token=${token}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Email verification failed');
      }

      const data = await response.json();
      setStatus('success');
      setMessage(data.message || 'Email verified successfully!');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'An error occurred during verification');
      console.error('Verification error:', err);
    }
  };

  useEffect(() => {
    // Auto-verify when page loads if token exists
    if (token) {
      verifyEmail();
    }
  }, [token]);

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

      {/* Logo with Key icon - Top Left */}
      <div className="absolute top-6 left-6">
        <div className="flex items-center space-x-2">
         
          <BarChart2 className="h-8 w-8 text-amber-400" />
          <Image src={logo} width={160} height={40} alt='stockflow logo' />
        </div>
      </div>

      {/* Main content container */}
      <div className={`w-full max-w-md bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden shadow-2xl border border-white/10 transform transition-all duration-700 ${isMounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="p-8 text-center">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <MailCheck className="h-12 w-12 text-amber-400" />
            </div>
            <h1 className="text-2xl font-light text-white mb-2">
              Email Verification
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-4 rounded-full"></div>
            <p className="text-white/70 text-sm">
              {token ? 'Verifying your email address' : 'Email verification token missing'}
            </p>
          </div>

          {/* Status message */}
          <div className={`mb-6 p-4 rounded-lg ${
            status === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-300' :
            status === 'error' ? 'bg-red-500/10 border border-red-500/30 text-red-300' :
            'bg-white/5 border border-white/10 text-white'
          }`}>
            <div className="flex items-center justify-center space-x-2">
              {status === 'loading' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : status === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : status === 'error' ? (
                <AlertCircle className="h-5 w-5" />
              ) : null}
              <span>{message || 'Processing your request...'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {status === 'error' && (
              <button
                onClick={verifyEmail}
                className="w-full py-2.5 px-4 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg hover:bg-amber-500/20 transition-colors duration-300 flex items-center justify-center"
              >
                Try Again
              </button>
            )}

            {status === 'success' && (
              <Link
                href="/login"
                className="block w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 text-center"
              >
                Proceed to Login
              </Link>
            )}

            {!token && (
              <Link
                href="/"
                className="block w-full py-2.5 px-4 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors duration-300 text-center"
              >
                Return Home
              </Link>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-xs text-white/50">
            Need help? <Link href="/contact" className="text-amber-400 hover:text-amber-300">Contact support</Link>
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