import React from 'react';
import { Link } from 'react-router-dom';

const ScanLimitReached = () => {
    return (
        <div className="bg-background-light  font-display antialiased min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-[600px] bg-surface-light  rounded-2xl shadow-2xl overflow-hidden border border-gray-200 ">
                <div className="h-2 bg-gradient-to-r from-primary to-[#4a0f96]"></div>

                <div className="p-8 md:p-12 text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="bg-primary/10 p-4 rounded-full">
                            <span className="material-symbols-outlined text-5xl text-primary animate-pulse">
                                block
                            </span>
                        </div>
                    </div>

                    <h1 className="text-3xl font-extrabold text-text-dark  mb-4 leading-tight">
                        QR Scan Limit Reached
                    </h1>

                    <p className="text-lg text-text-subtle  mb-8 max-w-md mx-auto leading-relaxed">
                        The owner of this QR code has reached their monthly scan limit. Please try again later or contact the owner.
                    </p>

                    <div className="space-y-4">
                        <a
                            href="https://switchqr.com"
                            className="inline-flex items-center justify-center w-full rounded-xl bg-primary hover:bg-primary-hover text-white h-14 px-8 text-lg font-bold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
                        >
                            Create Your Own QR Code
                        </a>

                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center w-full rounded-xl bg-gray-100  hover:bg-gray-200 :bg-gray-700 text-text-dark  h-14 px-8 text-lg font-bold transition-all duration-200"
                        >
                            Log In to Your Account
                        </Link>
                    </div>
                </div>

                <div className="bg-gray-50 [#1a1a1a]/50 p-6 border-t border-gray-100  flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-text-subtle  text-sm font-medium">
                        <span>Powered by</span>
                        <img src="/logo.svg" alt="SwitchQR" className="h-5 opacity-80" />
                        <span className="font-bold text-primary">SwitchQR</span>
                    </div>
                    <p className="text-xs text-gray-400 ">
                        Enterprise-grade dynamic QR codes for modern marketing.
                    </p>
                </div>
            </div>

            <div className="mt-8 text-text-subtle  text-sm">
                &copy; {new Date().getFullYear()} SwitchQR. All rights reserved.
            </div>
        </div>
    );
};

export default ScanLimitReached;
