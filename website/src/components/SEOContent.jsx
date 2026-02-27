import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQItem = ({ question, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-gray-100 rounded-xl overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
                <span className="text-lg font-bold text-text-main pr-4">{question}</span>
                <span className={`material-symbols-outlined text-primary transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>
            {isOpen && (
                <div className="px-6 pb-6 text-text-muted leading-relaxed">
                    {children}
                </div>
            )}
        </div>
    );
};

const SEOContent = () => {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <h2 className="text-text-main text-3xl md:text-4xl font-bold mb-8">Frequently Asked Questions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">

                    <div className="space-y-4">
                        {/* What Is a Dynamic QR Code? */}
                        <FAQItem question="What Is a Dynamic QR Code?">
                            <p className="mb-3">
                                A dynamic QR code is a scannable barcode that redirects users to a URL you can change at any time. Unlike a static QR code, which permanently encodes a fixed URL into its pattern, a dynamic QR code points to a short redirect link that you manage from a dashboard. This means the physical printed code never changes, but the destination behind it can be updated as often as you need.
                            </p>
                            <p>
                                Businesses prefer dynamic QR codes because they eliminate the cost and delay of reprinting materials every time a campaign changes. A restaurant can switch from a lunch menu to a dinner menu automatically. A retail store can rotate seasonal promotions without replacing shelf signage. Every scan is tracked with real-time analytics, giving you visibility into how many people scanned, where they were, what device they used, and when they engaged. This combination of flexibility, tracking, and cost savings makes dynamic QR codes the standard for any serious QR code marketing strategy.
                            </p>
                        </FAQItem>

                        {/* Why Static QR Codes Leak Revenue */}
                        <FAQItem question="Why Do Static QR Codes Leak Revenue?">
                            <p className="mb-3">
                                Static QR codes cost businesses money in ways that are easy to overlook. Every time a landing page URL changes, a promotion expires, or a menu gets updated, you need to generate a new QR code and reprint every piece of material that carries it. For a restaurant chain with locations across multiple cities, that means thousands of table tents, stickers, and window posters replaced multiple times a year.
                            </p>
                            <p>
                                Beyond reprinting costs, static QR codes provide zero analytics. You have no way of knowing how many people scanned a code, which locations drive the most traffic, or whether your campaign is converting. There is no option to A/B test different landing pages. There is no way to schedule a redirect for a future date. You cannot optimize what you cannot measure. Every static QR code in the field is a missed opportunity to gather data and improve your marketing ROI. A <Link to="/features" className="text-primary font-semibold hover:underline">dynamic QR code generator</Link> like SwitchQR solves all of these problems from a single dashboard.
                            </p>
                        </FAQItem>

                        {/* Key Features */}
                        <FAQItem question="What Are the Key Features of SwitchQR?">
                            <p className="mb-4">
                                SwitchQR is a full-featured dynamic QR code generator designed for teams that need flexibility, control, and data. Whether you manage one location or hundreds, these tools give you complete command over your QR code campaigns without any technical complexity.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">swap_horiz</span>
                                    <span><strong>Change QR destination anytime</strong> — update the URL behind any QR code instantly from your dashboard. No reprinting required.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">schedule</span>
                                    <span><strong>Scheduled redirects by time and date</strong> — set future redirect changes that activate automatically at a specific date and time.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">science</span>
                                    <span><strong>A/B testing for QR campaigns</strong> — split traffic between two destination URLs to test which landing page converts better.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">monitoring</span>
                                    <span><strong>Real-time scan analytics</strong> — track total scans, unique visitors, locations, devices, and engagement trends in real time.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">folder</span>
                                    <span><strong>Campaign folders for organization</strong> — group your QR codes into folders by campaign, location, or team for easy management.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary text-lg mt-0.5">apartment</span>
                                    <span><strong>Multi-location management</strong> — manage separate QR strategies for each branch, store, or venue from one dashboard.</span>
                                </li>
                            </ul>
                        </FAQItem>

                        {/* Use Cases */}
                        <FAQItem question="What Are the Best Use Cases for Dynamic QR Codes?">
                            <div className="space-y-4">
                                <div>
                                    <p className="font-bold text-text-main mb-1">Restaurants</p>
                                    <p>Restaurants use dynamic QR codes on table tents, counter stickers, and window signage to replace printed menus entirely. With SwitchQR, a restaurant can schedule automatic day-parting so the QR code points to a breakfast menu in the morning, a lunch menu at noon, and a dinner menu in the evening. Happy hour promotions activate on schedule without staff involvement. Learn more about <Link to="/industries/restaurants" className="text-primary font-semibold hover:underline">QR Codes for Restaurants</Link>.</p>
                                </div>
                                <div>
                                    <p className="font-bold text-text-main mb-1">Retail Stores</p>
                                    <p>Retail brands place QR codes on product packaging, shelf displays, and shopping bags to drive customers to promotions, loyalty programs, and product pages. A dynamic QR code generator lets retailers rotate seasonal campaigns without changing a single label. Explore <Link to="/industries/retail" className="text-primary font-semibold hover:underline">QR Codes for Retail</Link>.</p>
                                </div>
                                <div>
                                    <p className="font-bold text-text-main mb-1">Gyms and Fitness Studios</p>
                                    <p>Gyms and fitness studios use QR codes on membership flyers, class schedule posters, and welcome kits. A dynamic QR code lets a gym switch from a New Year membership drive to a summer boot camp registration automatically. Scan analytics reveal which locations and marketing materials drive the most sign-ups.</p>
                                </div>
                                <div>
                                    <p className="font-bold text-text-main mb-1">Education and Training Centers</p>
                                    <p>Tutoring centers, test prep companies, and training institutions use QR codes on flyers, partnership materials, and campus posters to drive students to enrollment pages. When admissions cycles change, the QR code destination updates from your dashboard without reprinting a single flyer.</p>
                                </div>
                            </div>
                        </FAQItem>
                        {/* Pricing */}
                        <FAQItem question="How Much Does SwitchQR Cost?">
                            <p>
                                SwitchQR offers flexible pricing plans designed for businesses of every size, from solo entrepreneurs to enterprise teams managing hundreds of QR campaigns across multiple locations. Every plan includes dynamic redirects, real-time analytics, and scheduled switching. Start free and scale as your needs grow. View our full <Link to="/pricing" className="text-primary font-semibold hover:underline">Dynamic QR Code Pricing</Link> page for details.
                            </p>
                        </FAQItem>
                    </div>

                    <div className="space-y-4">
                        {/* Original 4 FAQs */}
                        <FAQItem question="Can I Change My QR Code Destination After Printing?">
                            <p>Yes, that is the core purpose of a dynamic QR code. With SwitchQR, you can change the destination URL of any QR code at any time from your dashboard, even after it has been printed on flyers, posters, packaging, or business cards. The physical QR code stays the same, but the link it redirects to can be updated instantly. This eliminates the need to reprint materials whenever your campaign, menu, or landing page changes.</p>
                        </FAQItem>

                        <FAQItem question="Do Dynamic QR Codes Expire?">
                            <p>No, dynamic QR codes created with SwitchQR do not expire as long as your account is active. The QR code itself is a permanent image that will always scan. The redirect URL behind it remains functional indefinitely. You can change the destination as many times as you need without any expiration. If you downgrade or cancel your plan, your QR codes will continue to redirect to the last saved destination, ensuring your printed materials remain functional.</p>
                        </FAQItem>

                        <FAQItem question="How Do I Track QR Code Scans?">
                            <p>SwitchQR provides built-in real-time analytics for every dynamic QR code you create. From your dashboard, you can view the total number of scans, unique visitors, the geographic location of each scan at the city level, the device type and operating system used, and the time and date of every scan. These analytics help you understand which campaigns are performing, which physical locations generate the most engagement, and how your audience interacts with your QR codes over time.</p>
                        </FAQItem>

                        <FAQItem question="Are Dynamic QR Codes Better for Marketing?">
                            <p>Dynamic QR codes are significantly better for marketing because they give you full control over your campaigns after print. You can A/B test different landing pages by splitting traffic between two URLs, schedule automatic redirects for seasonal promotions, track scan analytics to measure ROI, and update destinations instantly without reprinting. Static QR codes offer none of these capabilities. For any business running print advertising, packaging campaigns, or physical signage, dynamic QR codes are the professional standard.</p>
                        </FAQItem>
                    </div>

                </div>

                {/* Internal Links */}
                <nav className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-semibold">
                    <Link to="/pricing" className="text-primary hover:underline">Dynamic QR Code Pricing</Link>
                    <Link to="/blog" className="text-primary hover:underline">QR Code Marketing Blog</Link>
                    <Link to="/industries/restaurants" className="text-primary hover:underline">QR Codes for Restaurants</Link>
                    <Link to="/industries/retail" className="text-primary hover:underline">QR Codes for Retail</Link>
                    <Link to="/contact" className="text-primary hover:underline">Contact SwitchQR</Link>
                </nav>
            </div>
        </section>
    );
};

export default SEOContent;
