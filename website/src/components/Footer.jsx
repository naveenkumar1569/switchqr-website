import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const footerLinks = {
        Product: [
            { name: 'Features', path: '/features' },
            { name: 'Pricing', path: '/pricing' },
            { name: 'API', path: '/coming-soon/api' },
            { name: 'Integrations', path: '/coming-soon/integrations' },
        ],
        Resources: [
            { name: 'Blog', path: '/coming-soon/blog' },
            { name: 'Case Studies', path: '/case-studies' },
            { name: 'Help Center', path: '/coming-soon/help-center' },
            { name: 'QR Generator', path: '/coming-soon/qr-generator' },
        ],
        Company: [
            { name: 'About Us', path: '/about' },
            { name: 'Careers', path: '/careers' },
            { name: 'Legal', path: '/coming-soon/legal' },
            { name: 'Contact', path: '/contact' },
        ],
    };

    return (
        <footer className="bg-white border-t border-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
                    {/* Logo and Description */}
                    <div className="col-span-2 lg:col-span-2 pr-8">
                        <Link to="/" className="inline-block mb-4">
                            <img src="/logo.svg" alt="SwitchQR" className="h-10" />
                        </Link>
                        <p className="text-text-muted text-sm mb-6 max-w-xs">
                            The smartest way to manage QR codes for your business. Dynamic, trackable, and always editable.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://twitter.com/switchqr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                            </a>
                            <a href="https://linkedin.com/company/switchqr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            </a>
                            <a href="https://instagram.com/switchqr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.948-.197-4.347-2.615-6.777-6.976-6.979C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                            </a>
                            <a href="mailto:support@switch-qr.com" className="text-gray-400 hover:text-primary transition-colors ml-2">
                                <span className="material-symbols-outlined text-[20px]">mail</span>
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category} className="flex flex-col gap-3">
                            <h4 className="font-bold text-text-main mb-1">{category}</h4>
                            {links.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-sm text-text-muted hover:text-primary transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">© {new Date().getFullYear()} SwitchQR Inc. All rights reserved.</p>
                    <div className="flex gap-2 items-center text-sm text-gray-400">
                        <Link to="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
                        <span className="text-gray-300">|</span>
                        <Link to="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
                        <span className="text-gray-300">|</span>
                        <Link to="/refund" className="hover:text-gray-600 transition-colors">Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
