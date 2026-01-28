import React from 'react';
import { Link, useParams } from 'react-router-dom';

const ComingSoon = () => {
    const { page } = useParams();

    // Format page name from slug (e.g., "help-center" -> "Help Center")
    const pageName = page ? page.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Coming Soon';

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light">
            <div className="text-center max-w-md mx-auto px-6">
                {/* Icon */}
                <div className="size-20 mx-auto mb-8 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-4xl">construction</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-text-main mb-4">
                    {pageName || 'Coming Soon'}
                </h1>

                {/* Description */}
                <p className="text-text-muted text-lg mb-8">
                    We're working hard to bring you this feature. Check back soon for updates!
                </p>

                {/* CTA */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/25 transition-all"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ComingSoon;
