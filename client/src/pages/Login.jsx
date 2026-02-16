import React, { useState } from 'react';
// Trigger commit after repo reconnection v2
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { apiPost } from '../utils/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (err) {
            setError(err.message || 'Google sign-in failed');
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setError('');
        setLoading(true);
        try {
            const response = await apiPost('/api/auth/login', { email, password });

            const data = await response.json();

            if (response.ok) {
                login(data.token, data.user);
                navigate('/');
            } else {
                setError(data.error || 'Login failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light  font-display antialiased min-h-screen flex flex-col">
            {/* Header for mobile */}
            <header className="flex items-center justify-between px-6 py-4 md:hidden bg-surface-light  border-b border-gray-200 ">
                <img src="/logo.svg" alt="SwitchQR" className="h-8" />
            </header>

            <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-[1000px] bg-surface-light  rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                    {/* Left Side: Brand Panel */}
                    <div className="relative hidden md:flex md:w-5/12 flex-col justify-between p-12 bg-gradient-to-br from-primary to-[#4a0f96] text-white">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                        <div className="relative z-10">
                            <img src="/logo.svg" alt="SwitchQR" className="h-10 brightness-0 invert" />
                        </div>

                        <div className="relative z-10 mt-auto mb-12">
                            <h1 className="text-3xl font-bold leading-tight mb-4">Manage dynamic QR codes with ease.</h1>
                            <p className="text-white/80 text-base font-normal leading-relaxed">Create, track, and update your QR codes instantly without reprinting. Enterprise-grade reliability for your marketing campaigns.</p>
                        </div>

                        <div className="relative z-10 flex items-center gap-4 text-sm text-white/60">
                            <div className="flex -space-x-2">
                                {/* Avatars */}
                                <img src="/avatar1.png" alt="User" className="w-8 h-8 rounded-full border-2 border-primary object-cover" />
                                <img src="/avatar2.png" alt="User" className="w-8 h-8 rounded-full border-2 border-primary object-cover" />
                                <img src="/avatar3.png" alt="User" className="w-8 h-8 rounded-full border-2 border-primary object-cover" />
                            </div>
                            <span>Trusted by 10,000+ teams</span>
                        </div>
                    </div>

                    {/* Right Side: Login Form */}
                    <div className="w-full md:w-7/12 flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-surface-light ">
                        <div className="max-w-md mx-auto w-full">
                            <div className="mb-8 text-center md:text-left">
                                <h2 className="text-3xl font-bold text-text-dark  mb-2">Welcome back</h2>
                                <p className="text-text-subtle ">Please enter your details to sign in.</p>
                            </div>

                            {error && <div className="mb-4 p-3 bg-red-50  text-red-600  rounded-lg border border-red-200  text-sm">{error}</div>}

                            {/* Google Sign-in Button */}
                            <button
                                onClick={handleGoogleSignIn}
                                type="button"
                                className="w-full flex items-center justify-center gap-3 rounded-lg border-2 border-gray-300  bg-white  hover:bg-gray-50 :bg-gray-700 text-gray-700  h-12 px-6 text-sm font-bold transition-all duration-200 mb-6"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </button>

                            {/* Divider */}
                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300 "></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-surface-light  text-text-subtle ">Or continue with email</span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-text-dark " htmlFor="email">Email</label>
                                    <input
                                        className="form-input w-full rounded-lg border-gray-300 bg-background-light   text-text-dark  focus:border-primary focus:ring-primary h-12 px-4 placeholder:text-gray-400 :text-gray-500 text-base transition-colors duration-200"
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-text-dark " htmlFor="password">Password</label>
                                    </div>
                                    <input
                                        className="form-input w-full rounded-lg border-gray-300 bg-background-light   text-text-dark  focus:border-primary focus:ring-primary h-12 px-4 placeholder:text-gray-400 :text-gray-500 text-base transition-colors duration-200"
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <div className="flex justify-end mt-1">
                                        <a href="#" className="text-sm font-medium text-primary hover:text-primary-hover hover:underline">Forgot password?</a>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex items-center justify-center rounded-lg bg-primary hover:bg-primary-hover text-white h-12 px-6 text-sm font-bold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-sm text-text-subtle ">
                                    Don't have an account? <Link to="/register" className="font-bold text-primary hover:text-primary-hover hover:underline">Sign up</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
