import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Handle both whole numbers and decimals (like 9.4M)
            const isDecimal = end.toString().includes('.');
            const targetNum = parseFloat(end);
            const currentCount = progress * targetNum;

            setCount(isDecimal ? currentCount.toFixed(1) : Math.floor(currentCount));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [isVisible, end, duration]);

    return <span ref={countRef}>{count}{suffix}</span>;
};

const StatsSection = () => {
    const stats = [
        {
            icon: 'qr_code_2',
            value: '312',
            suffix: 'k+',
            label: 'QR codes created'
        },
        {
            icon: 'sensors',
            value: '9.4',
            suffix: 'M+',
            label: 'Scans tracked'
        },
        {
            icon: 'apartment',
            value: '10',
            suffix: 'k+',
            label: 'Active Businesses'
        },
        {
            icon: 'sync',
            value: '2.1',
            suffix: 'M+',
            label: 'Link updates'
        }
    ];

    return (
        <section className="py-20 bg-white border-t border-gray-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="size-16 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/10 transition-colors">
                                <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
                            </div>
                            <div className="text-4xl md:text-5xl font-black text-text-main mb-2 tracking-tight">
                                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className="text-sm font-bold text-text-muted uppercase tracking-widest px-4">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
