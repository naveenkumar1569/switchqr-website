import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="px-6 md:px-20 lg:px-40 py-16 lg:py-24">
                    <div className="max-w-[1280px] mx-auto">
                        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                                <span className="material-symbols-outlined text-[14px]">history_edu</span>
                                The SwitchQR Story
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6 text-text-main">
                                We Make QR Codes <br /><span className="text-primary italic">Less… Annoying.</span>
                            </h1>
                            <div className="text-lg md:text-xl font-normal text-text-muted max-w-2xl mb-10 leading-relaxed space-y-4">
                                <p>
                                    QR codes are everywhere now. Posters. Menus. Boxes. Badges.
                                    But most tools are stuck in 2015: generate → print → pray the link never changes.
                                </p>
                                <p className="font-medium text-text-main">
                                    We thought that was… not great.
                                </p>
                            </div>
                        </div>
                        <div className="mt-16 rounded-2xl overflow-hidden aspect-[21/9] relative shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            <img
                                alt="Abstract clean purple and white aesthetic workspace"
                                className="w-full h-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFmT7uQ3Sg9nvuhC3T38jdLMm0-mzEFzzww-zPDeu4ggVxwQ2Ro4Zt7caSBtcnPb4PchDp9U8rsO7M6m3otikzccIomUY1E99kmBeTnFMbZvCyBhbvVdEt03KI7AmruX7lTT73fVvh-v_f9X2Y3rBpUxeuzhgF4IYcz-8tueCWqIoHu9zJup3ppEMMXNdpzsfZU2N8-2BcSrHczbwdmNb1cn62XnQNCIhfh45cX_zjqzFWXhTvoscpW_tUy6gAbAgsilkxxgagM-U"
                            />
                        </div>
                    </div>
                </section>

                {/* What We Believe Section */}
                <section className="bg-background-light px-6 md:px-20 lg:px-40 py-20 border-y border-gray-100">
                    <div className="max-w-[1280px] mx-auto">
                        <div className="flex flex-col gap-4 mb-12">
                            <h2 className="text-primary text-sm font-bold uppercase tracking-widest">Our Philosophy</h2>
                            <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-text-main">Strong Opinions, Better Products</h3>
                            <p className="text-text-muted text-lg max-w-2xl">
                                Also, we take bugs personally. Which is unhealthy, but good for you.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <div className="flex flex-col gap-6 rounded-2xl border border-border-subtle bg-white p-8 hover:border-primary transition-colors group shadow-sm hover:shadow-md">
                                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined">sync_alt</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h4 className="text-xl font-bold text-text-main">Flexibility over Fixity</h4>
                                    <p className="text-text-muted leading-relaxed">
                                        Offline marketing deserves the same flexibility as digital. Fixing mistakes shouldn’t require reprinting 5,000 flyers.
                                    </p>
                                </div>
                            </div>
                            {/* Card 2 */}
                            <div className="flex flex-col gap-6 rounded-2xl border border-border-subtle bg-white p-8 hover:border-primary transition-colors group shadow-sm hover:shadow-md">
                                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined">ads_click</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h4 className="text-xl font-bold text-text-main">Strategy over Scanning</h4>
                                    <p className="text-text-muted leading-relaxed">
                                        “Print and forget” is not a strategy. Generally, if you can A/B test a Facebook ad, you should be able to test a poster too.
                                    </p>
                                </div>
                            </div>
                            {/* Card 3 */}
                            <div className="flex flex-col gap-6 rounded-2xl border border-border-subtle bg-white p-8 hover:border-primary transition-colors group shadow-sm hover:shadow-md">
                                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <span className="material-symbols-outlined">analytics</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h4 className="text-xl font-bold text-text-main">Data over Guesswork</h4>
                                    <p className="text-text-muted leading-relaxed">
                                        Marketers deserve to know what actually worked. No crystal balls. Just data and control.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why We Built This Section */}
                <section className="px-6 md:px-20 lg:px-40 py-24">
                    <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 text-text-main">Why We Built This</h2>
                            <div className="space-y-6 text-lg text-text-muted leading-relaxed">
                                <p>
                                    SwitchQR started with a simple question: <span className="text-text-main font-medium">Why are QR codes still static when everything else in marketing is dynamic?</span>
                                </p>
                                <p>
                                    Campaigns change. Offers change. Links break. But the QR code stays frozen like it’s holding a grudge.
                                </p>
                                <p className="font-semibold text-primary text-xl">
                                    Enter SwitchQR: The "Smarter Behavior" engine.
                                </p>
                                <p>
                                    We wanted to build something that lets physical marketing behave more like software:
                                    <span className="block mt-2 font-bold text-text-main">Updateable. Measurable. Improvable.</span>
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-primary/5 rounded-3xl p-8 border border-primary/20">
                                <div className="flex flex-col gap-6">
                                    <div
                                        className="w-full aspect-video bg-cover bg-center rounded-xl shadow-lg"
                                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAZFNAX-ax5B8vNHeTWFmn4u1NMNZBHJlS8s4WJWbW7fApnC-37M39LsOOMsnwaMM4Ml-ObeCLsGDRW_62K0KkAZZVaWZK75Yra9quX0lXIGci1WTCvaRI4hEkHmBrTzP1fUrlhBRYym04Oys7oc9TBr3cyDL9doxlawgwKZs07JB4OObfdPWk-fAhSDgvhOU5uCVTdp20wFTN9rRZFFzsBxxK3a0g4Jm5H0fNrrf_Fv9I3US3AuYfZIC3F6FA6uSZPks2wQzW3jGA")' }}
                                    ></div>
                                    <div className="space-y-3">
                                        <h4 className="text-xl font-bold text-text-main">Same QR. Smarter behavior.</h4>
                                        <p className="text-text-muted text-base leading-relaxed">
                                            Our platform allows you to keep the same physical code while evolving the digital destination behind it indefinitely. Update links in real-time without touching the printer.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute -z-10 -bottom-6 -right-6 size-32 bg-primary/20 rounded-full blur-3xl"></div>
                        </div>
                    </div>
                </section>

                {/* Who This Is For Section */}
                <section className="bg-background-light px-6 md:px-20 lg:px-40 py-20 border-y border-gray-100">
                    <div className="max-w-[1280px] mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main">Who This Is For</h2>
                            <p className="text-text-muted mt-4 text-lg">The bridge-builders and future-proofers.</p>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="p-8 rounded-2xl bg-white flex flex-col items-center text-center gap-4 hover:border-primary border border-transparent transition-all shadow-sm hover:shadow-md">
                                <span className="material-symbols-outlined text-primary text-4xl">event</span>
                                <h5 className="font-bold text-lg text-text-main">Events</h5>
                                <p className="text-sm text-text-muted">Running events? Update schedules & venues on the fly without reprints.</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-white flex flex-col items-center text-center gap-4 hover:border-primary border border-transparent transition-all shadow-sm hover:shadow-md">
                                <span className="material-symbols-outlined text-primary text-4xl">storefront</span>
                                <h5 className="font-bold text-lg text-text-main">Retail</h5>
                                <p className="text-sm text-text-muted">Managing retail promotions? Dynamic menus and inventory landing pages that scale.</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-white flex flex-col items-center text-center gap-4 hover:border-primary border border-transparent transition-all shadow-sm hover:shadow-md">
                                <span className="material-symbols-outlined text-primary text-4xl">local_shipping</span>
                                <h5 className="font-bold text-lg text-text-main">Shipping</h5>
                                <p className="text-sm text-text-muted">Shipping products? Real-time tracking and logistics documentation.</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-white flex flex-col items-center text-center gap-4 hover:border-primary border border-transparent transition-all shadow-sm hover:shadow-md">
                                <span className="material-symbols-outlined text-primary text-4xl">print</span>
                                <h5 className="font-bold text-lg text-text-main">Print</h5>
                                <p className="text-sm text-text-muted">Printing posters or menus? Future-proof your magazines, cards, and billboards.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team/Identity Section */}
                <section className="px-6 md:px-20 lg:px-40 py-24">
                    <div className="max-w-[1280px] mx-auto">
                        <div className="flex flex-col md:flex-row gap-16 items-center">
                            <div className="w-full md:w-1/2">
                                <h2 className="text-3xl font-bold mb-6 text-text-main">Humans Behind the Product</h2>
                                <h3 className="text-xl font-bold text-primary mb-2">Are We a Big Company?</h3>
                                <p className="text-lg text-text-main font-bold mb-6">No.</p>

                                <h3 className="text-xl font-bold text-primary mb-2">Are we obsessed with getting this right?</h3>
                                <p className="text-lg text-text-main font-bold mb-6">Very much yes.</p>

                                <p className="text-lg text-text-muted leading-relaxed mb-6">
                                    SwitchQR is built by people who actually work in marketing and product.
                                    We care about workflows making sense, features solving real problems, and not shipping stuff just because it sounds cool.
                                </p>
                                <p className="text-base text-text-main italic border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-lg">
                                    "We built this to make marketing easier, not to give you new things to complain about."
                                </p>
                            </div>
                            <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
                                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                                    <img
                                        alt="Team member"
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlJqeRHDIbRbz2Me1whWu_EICkDZ0aGpIOxOxq-g3ETheuJmWGmxw00meZta2HpJ6nh7ieicv562hwOtRulX822hbEqazw8CAekJql3RIwqDTaupoTKRLYvF6_YiCChAiPL15JtPhdWzc5U75-2NiWO3u49rabUfv9hW1qpKpiBk1l5YFn1V7Z2Tu5fPU3JVtYDtCtjf2IEpiHRLmHM-VbPuHd4_-EmImnj-E88Wi4RhtyyDh5w0X123lRJqNwU6mqmojdZOvEU28"
                                    />
                                </div>
                                <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mt-8">
                                    <img
                                        alt="Team member"
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVslBAdnrmLQTzuGsce6Nr1UG-QXWKcCX7d36iycx34kZ2MRChajHAtEVpIG1NIdigsd2TXCv7-WkiQBs9SErOVcdM8GJtjUsNkuwcQM8nQaJsjBc_-MBNZ-5RAaOz8E-u8w0HSIk5F5L5LH7n6dbWzBDunx8ilt947mOzyjthRKIrgDVho5EuxkKH2iY5DVKY9F_dRDcilNtPHC0j1uY2PUvJuDQ6LKGxWlL8yd4Wb22UJXI5hc1pgJhOf7QAwxwODqsluJNMkn8"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final Mission Card */}
                <section className="px-6 md:px-20 lg:px-40 pb-24">
                    <div className="max-w-[1280px] mx-auto">
                        <div className="bg-primary rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
                            {/* Decorative background */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none">
                                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
                            </div>
                            <div className="relative z-10 flex flex-col items-center gap-8">
                                <span className="material-symbols-outlined text-white text-6xl opacity-40">format_quote</span>
                                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-2xl">
                                    QR codes are not going away. <br />Static tools should.
                                </h2>
                                <div className="h-px w-20 bg-white/30"></div>
                                <p className="text-white/80 font-medium tracking-widest uppercase text-sm">— Team SwitchQR</p>
                                <p className="text-white/60 text-xs uppercase tracking-wide">
                                    (Yes, there are humans behind this product. Slightly caffeinated ones.)
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AboutUs;
