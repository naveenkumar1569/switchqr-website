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
            { name: 'Contact', path: '/coming-soon/contact' },
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
                            <Link to="/coming-soon/social" className="text-gray-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">language</span>
                            </Link>
                            <a href="mailto:hello@switchqr.com" className="text-gray-400 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">mail</span>
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
