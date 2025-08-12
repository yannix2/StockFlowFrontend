// app/setup/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff, Loader2, ArrowRight, AlertCircle, CheckCircle, Key, BarChart2 ,Mail} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../../shared/stockflow-high-resolution-logo-grayscale-transparent.png';

export default function SetupPage() {
  const router = useRouter();
  const [setupToken, setSetupToken] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    familyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    cin: '',
    address: '',
    phoneNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
      hasUpper: /[A-Z]/.test(formData.password),
      hasLower: /[a-z]/.test(formData.password),
      hasNumber: /[0-9]/.test(formData.password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
      hasLength: formData.password.length >= 8,
      matches: formData.password === formData.confirmPassword && formData.password !== ''
    };
    setPasswordValidations(validations);
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!passwordValidations.hasUpper || 
        !passwordValidations.hasLower || 
        !passwordValidations.hasNumber || 
        !passwordValidations.hasSpecial) {
      setError('Password does not meet requirements');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://stockflowbackend-2j27.onrender.com/setup/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-setup-token': setupToken
        },
        body: JSON.stringify({
          name: formData.name,
          familyName: formData.familyName,
          email: formData.email,
          password: formData.password,
          cin: formData.cin,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
          role: 'ADMIN'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Setup failed. Please check your token and try again.');
      }

      setSuccess('Admin account created successfully! Redirecting to login...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again later.');
      console.error('Setup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-black flex items-center justify-center p-4 transition-opacity duration-700 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background elements */}
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
          <Key className="h-8 w-8 text-amber-400" />
          <Image src={logo} width={160} height={40} alt='stockflow logo' />
        </div>
      </div>

      {/* Compact form container */}
      <div className={`w-full max-w-md bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden shadow-2xl border border-white/10 transform transition-all duration-700 ${isMounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-light text-white mb-2 animate-fade-in">
              Admin Setup
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-3 rounded-full animate-grow"></div>
            <p className="text-white/70 text-sm animate-fade-in delay-100">
              Create initial admin account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-300 p-3 rounded-lg text-sm flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {/* Setup Token */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-white/80">Setup Token</label>
              <div className="relative group">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-amber-400" />
                <input
                  type="text"
                  value={setupToken}
                  onChange={(e) => setSetupToken(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/30 text-white placeholder-white/30"
                  placeholder="Enter setup token"
                  required
                />
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-white/80">First Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-amber-400" />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/30 text-white"
                    placeholder="First name"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-white/80">Last Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-amber-400" />
                  <input
                    name="familyName"
                    value={formData.familyName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/30 text-white"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-white/80">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-amber-400" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/30 text-white"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-white/80">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-amber-400" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/30 text-white"
                  placeholder="Create password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-white/50 hover:text-amber-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-white/50 hover:text-amber-400" />
                  )}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs text-white/50 mt-1">
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
            <div className="space-y-1">
              <label className="block text-sm font-medium text-white/80">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 group-focus-within:text-amber-400" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2.5 text-sm bg-white/5 border ${passwordValidations.matches && formData.confirmPassword ? 'border-green-500/30' : 'border-white/10'} rounded-lg focus:ring-2 focus:ring-amber-400/50 text-white`}
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-white/50 hover:text-amber-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-white/50 hover:text-amber-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-white/80">CIN</label>
                <input
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-400/50 text-white"
                  placeholder="National ID"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-white/80">Phone (Optional)</label>
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-400/50 text-white"
                  placeholder="+1234567890"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-white/80">Address (Optional)</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-400/50 text-white"
                placeholder="Your address"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !passwordValidations.matches}
              className={`w-full mt-4 py-2.5 rounded-lg text-sm font-medium text-white ${isLoading ? 'bg-amber-500/50' : !passwordValidations.matches ? 'bg-amber-500/30' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'} transition-all duration-300 flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Creating Admin...
                </>
              ) : (
                'Complete Setup'
              )}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-white/50">
            Already have an account?{' '}
            <Link href="/login" className="text-amber-400 hover:text-amber-300">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes grow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-grow {
          animation: grow 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </div>
  );
}