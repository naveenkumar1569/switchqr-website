import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { apiPost } from '../utils/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await apiPost('/api/auth/login', { email, password });

            const data = await response.json();

            if (response.ok) {
                login(data.token, data.user);
                navigate('/');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Failed to connect to server');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display antialiased min-h-screen flex flex-col">
            {/* Header for mobile */}
            <header className="flex items-center justify-between px-6 py-4 md:hidden bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800">
                <img src="/logo.svg" alt="SwitchQR" className="h-8" />
            </header>

            <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-[1000px] bg-surface-light dark:bg-surface-dark rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
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
                    <div className="w-full md:w-7/12 flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-surface-light dark:bg-surface-dark">
                        <div className="max-w-md mx-auto w-full">
                            <div className="mb-8 text-center md:text-left">
                                <h2 className="text-3xl font-bold text-text-dark dark:text-white mb-2">Welcome back</h2>
                                <p className="text-text-subtle dark:text-gray-400">Please enter your details to sign in.</p>
                            </div>

                            {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 text-sm">{error}</div>}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-text-dark dark:text-gray-200" htmlFor="email">Email</label>
                                    <input
                                        className="form-input w-full rounded-lg border-gray-300 bg-background-light dark:bg-background-dark dark:border-gray-700 text-text-dark dark:text-white focus:border-primary focus:ring-primary h-12 px-4 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-base transition-colors duration-200"
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
                                        <label className="text-sm font-medium text-text-dark dark:text-gray-200" htmlFor="password">Password</label>
                                    </div>
                                    <input
                                        className="form-input w-full rounded-lg border-gray-300 bg-background-light dark:bg-background-dark dark:border-gray-700 text-text-dark dark:text-white focus:border-primary focus:ring-primary h-12 px-4 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-base transition-colors duration-200"
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

                                <button type="submit" className="w-full flex items-center justify-center rounded-lg bg-primary hover:bg-primary-hover text-white h-12 px-6 text-sm font-bold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg mt-2">
                                    Sign In
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-sm text-text-subtle dark:text-gray-400">
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
