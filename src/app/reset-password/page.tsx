    // app/reset-password/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../shared/stockflow-high-resolution-logo-grayscale-transparent.png';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
    hasLength: false,
    matches: false
  });

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const validations = {
      hasUpper: /[A-Z]/.test(newPassword),
      hasLower: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
      hasLength: newPassword.length >= 8,
      matches: newPassword === confirmPassword && newPassword !== ''
    };
    setPasswordValidations(validations);
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setIsError(false);

    if (!token) {
      setMessage('Invalid reset token');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    if (!passwordValidations.matches) {
      setMessage('Passwords do not match');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    if (!passwordValidations.hasUpper || 
        !passwordValidations.hasLower || 
        !passwordValidations.hasNumber || 
        !passwordValidations.hasSpecial) {
      setMessage('Password does not meet requirements');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://stockflowbackend-2j27.onrender.com/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          newPassword 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset failed');
      }

      const data = await response.json();
      setMessage(data.message || 'Password updated successfully!');
      setIsError(false);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'An error occurred');
      setIsError(true);
      console.error('Reset password error:', err);
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
              Create a new strong password
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-white/80">
                New Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/50 group-focus-within:text-amber-400" />
                </div>
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/30 text-white placeholder-white/30"
                  placeholder="Create new password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-white/50 hover:text-amber-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-white/50 hover:text-amber-400" />
                  )}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs text-white/50">
                <div className={`flex items-center ${passwordValidations.hasUpper ? 'text-green-400' : ''}`}>
                  {passwordValidations.hasUpper ? <CheckCircle className="h-3 w-3 mr-1" /> : '• '}
                  Uppercase
                </div>
                <div className={`flex items-center ${passwordValidations.hasLower ? 'text-green-400' : ''}`}>
                  {passwordValidations.hasLower ? <CheckCircle className="h-3 w-3 mr-1" /> : '• '}
                  Lowercase
                </div>
                <div className={`flex items-center ${passwordValidations.hasNumber ? 'text-green-400' : ''}`}>
                  {passwordValidations.hasNumber ? <CheckCircle className="h-3 w-3 mr-1" /> : '• '}
                  Number
                </div>
                <div className={`flex items-center ${passwordValidations.hasSpecial ? 'text-green-400' : ''}`}>
                  {passwordValidations.hasSpecial ? <CheckCircle className="h-3 w-3 mr-1" /> : '• '}
                  Symbol
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/50 group-focus-within:text-amber-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`block w-full pl-10 pr-10 py-2.5 text-sm bg-white/5 border ${
                    passwordValidations.matches && confirmPassword ? 'border-green-500/30' : 'border-white/10'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/30 text-white placeholder-white/30`}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-white/50 hover:text-amber-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-white/50 hover:text-amber-400" />
                  )}
                </button>
              </div>
              {confirmPassword && !passwordValidations.matches && (
                <p className="text-xs text-red-400">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !passwordValidations.matches || !passwordValidations.hasUpper || !passwordValidations.hasLower || !passwordValidations.hasNumber || !passwordValidations.hasSpecial}
              className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white mt-4 ${
                isLoading ? 'bg-amber-500/50 cursor-not-allowed' :
                !passwordValidations.matches || !passwordValidations.hasUpper || !passwordValidations.hasLower || !passwordValidations.hasNumber || !passwordValidations.hasSpecial ? 
                'bg-amber-500/30 cursor-not-allowed' :
                'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4 inline" />
                  Updating...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-white/50">
            Remember your password?{' '}
            <Link
              href="/login"
              className="font-medium text-amber-400 hover:text-amber-300"
            >
              Sign in
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