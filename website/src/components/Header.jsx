import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { industries } from '../data/industries';

// Hardcoded production URL for marketing site
const CLIENT_APP_URL = 'https://app.switch-qr.com';

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Features', path: '/features' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'Blog', path: '/blog' },
        { name: 'Case Studies', path: '/case-studies' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-background-light/90 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link to="/" className="inline-block">
                    <img src="/logo.svg" alt="SwitchQR" className="h-9" />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {/* Industries Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 text-sm font-semibold text-text-main group-hover:text-primary transition-colors py-2">
                            Industries
                            <span className="material-symbols-outlined text-lg">expand_more</span>
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute top-full left-0 pt-2 w-screen max-w-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 grid grid-cols-2 gap-2 overflow-hidden">
                                {Object.values(industries).map((industry) => (
                                    <Link
                                        key={industry.slug}
                                        to={`/industries/${industry.slug}`}
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group/item"
                                    >
                                        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-colors">
                                            <span className="material-symbols-outlined text-lg">{industry.icon}</span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-text-main">{industry.name}</div>
                                            <div className="text-xs text-text-muted mt-0.5 line-clamp-1">{industry.hero.eyebrow}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-semibold transition-colors ${isActive(link.path)
                                ? 'text-primary'
                                : 'text-text-main hover:text-primary'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* CTA Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <a href={`${CLIENT_APP_URL}/login`} className="rounded-xl h-10 px-5 text-sm font-bold text-text-main hover:bg-gray-100 transition-colors flex items-center">
                        Log In
                    </a>
                    <a href={`${CLIENT_APP_URL}/register`} className="rounded-xl h-10 px-5 bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg shadow-primary/25 transition-all flex items-center">
                        Get Started
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-text-main"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span className="material-symbols-outlined">
                        {mobileMenuOpen ? 'close' : 'menu'}
                    </span>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 h-[calc(100vh-64px)] overflow-y-auto">
                    <nav className="flex flex-col gap-2">
                        {/* Mobile Industries Accordion */}
                        <div>
                            <button
                                onClick={() => setMobileIndustriesOpen(!mobileIndustriesOpen)}
                                className="flex items-center justify-between w-full py-3 text-base font-semibold text-text-main"
                            >
                                Industries
                                <span className={`material-symbols-outlined transition-transform ${mobileIndustriesOpen ? 'rotate-180' : ''}`}>expand_more</span>
                            </button>
                            {mobileIndustriesOpen && (
                                <div className="flex flex-col gap-2 pl-4 pb-2">
                                    {Object.values(industries).map((industry) => (
                                        <Link
                                            key={industry.slug}
                                            to={`/industries/${industry.slug}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center gap-3 py-2 text-sm text-text-muted hover:text-primary"
                                        >
                                            <span className="material-symbols-outlined text-lg">{industry.icon}</span>
                                            {industry.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`text-base font-semibold py-3 border-t border-gray-50 ${isActive(link.path) ? 'text-primary' : 'text-text-main'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="flex flex-col gap-2 pt-6 mt-2 border-t border-gray-100">
                            <a href={`${CLIENT_APP_URL}/login`} className="rounded-xl h-12 px-5 text-base font-bold text-text-main border border-gray-200 flex items-center justify-center">
                                Log In
                            </a>
                            <a href={`${CLIENT_APP_URL}/register`} className="rounded-xl h-12 px-5 bg-primary text-white text-base font-bold flex items-center justify-center">
                                Get Started
                            </a>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
