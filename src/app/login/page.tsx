    // components/LoginForm.tsx
    'use client';
    import { useState, useEffect } from 'react';
    import { useRouter } from 'next/navigation';
    import { Lock, Mail, Eye, EyeOff, Loader2, ArrowRight, AlertCircle, BarChart2 } from 'lucide-react';
    import Link from 'next/link';
    import { setCookie } from 'cookies-next';
    import Image from 'next/image';
    import logo from '../../shared/stockflow-high-resolution-logo-grayscale-transparent.png'; // Adjust path as needed
    import { useSearchParams } from 'next/navigation';

    export default function LoginForm() {
        const searchParams = useSearchParams()
        const redirectTo = searchParams.get('from') || '/dashboard'

    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Basic email validation only
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
        }

        try {
        const response = await fetch('https://stockflowbackend-2j27.onrender.com/auth/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed. Please check your credentials.');
        }

        const { accessToken, refreshToken, name, familyName, email: userEmail, role } = await response.json();

        const cookieOptions = {
            maxAge: rememberMe ? 2 * 24 * 60 * 60 : undefined, 
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            httpOnly: false
        };

        // Save all user data in cookies
        setCookie('accessToken', accessToken, cookieOptions);
        setCookie('refreshToken', refreshToken, cookieOptions);
        setCookie('userData', JSON.stringify({
            name,
            familyName,
            email: userEmail,
            role
        }), cookieOptions);


        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push(redirectTo)

        } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again later.');
        console.error('Login error:', err);
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

        {/* StockFlow Logo - You can replace with text if preferred */}
        <div className="absolute top-8 left-8">
           <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
            <BarChart2 className="h-8 w-8 text-amber-400" />
            <Image src={logo} width={200} height={200} alt='stockflow logo'  ></Image>
            </div>
           </Link> 
           
        </div>

        <div className={`w-full max-w-md bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl border border-white/10 transform transition-all duration-700 ${isMounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="p-8">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-light text-white mb-2 animate-fade-in">
                Welcome back
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-4 rounded-full animate-grow"></div>
                <p className="text-white/70 animate-fade-in delay-100">
                Sign in to your StockFlow dashboard
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-lg text-sm animate-fade-in flex items-start backdrop-blur-sm">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{error}</span>
                </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-white/80">
                    Email Address
                </label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white/50 group-focus-within:text-amber-400 transition-colors duration-300" />
                    </div>
                    <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/30 text-white placeholder-white/30 transition-all duration-300 group-hover:border-white/20"
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                    />
                </div>
                </div>

                {/* Password Field - No restrictions */}
                <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-white/80">
                    Password
                </label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/50 group-focus-within:text-amber-400 transition-colors duration-300" />
                    </div>
                    <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/30 text-white placeholder-white/30 transition-all duration-300 group-hover:border-white/20"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    />
                    <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center group"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5 text-white/50 group-hover:text-amber-400 transition-colors duration-300" />
                    ) : (
                        <Eye className="h-5 w-5 text-white/50 group-hover:text-amber-400 transition-colors duration-300" />
                    )}
                    </button>
                </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-amber-400 focus:ring-amber-400/50 bg-white/5 border-white/20 rounded transition cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-white/70 cursor-pointer">
                    Remember me
                    </label>
                </div>

                <div className="text-sm">
                    <Link
                    href="/forgot-password"
                    className="font-medium text-amber-400 hover:text-amber-300 transition-colors duration-300"
                    >
                    Forgot password?
                    </Link>
                </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-base font-medium text-white transition-all duration-500 overflow-hidden relative group ${isLoading ? 'bg-amber-500/50 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-amber-500/30'}`}
                >
                    {isLoading ? (
                    <>
                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                        Signing in...
                    </>
                    ) : (
                    <>
                        <span className="relative z-10">Sign in</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                        <ArrowRight className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 relative z-10" />
                    </>
                    )}
                </button>
                </div>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
                <p className="text-sm text-white/50">
                Don't have an account?{' '}
                <Link
                    href="/contact"
                    className="font-medium text-amber-400 hover:text-amber-300 transition-colors duration-300 inline-flex items-center group"
                >
                        Contact us 
                    <ArrowRight className="ml-1 h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
                </p>
            </div>
            </div>
        </div>

        {/* Animation styles */}
        <style jsx global>{`
            @keyframes float {
            0% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(2deg); }
            100% { transform: translateY(0) rotate(0deg); }
            }
            @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
            }
            @keyframes grow {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
            }
            .animate-float {
            animation: float ease-in-out infinite;
            }
            .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
            }
            .delay-100 {
            animation-delay: 0.1s;
            }
            .animate-grow {
            animation: grow 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
            transform-origin: left center;
            }
        `}</style>
        </div>
    );
    }