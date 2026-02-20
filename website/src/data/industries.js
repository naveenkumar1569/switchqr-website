
export const industries = {
    events: {
        slug: 'events',
        name: 'Events & Conferences',
        icon: 'festival',
        gradient: 'linear-gradient(135deg, #a5b4fc 0%, #818cf8 100%)',
        hero: {
            eyebrow: 'Events Industry Solution',
            title: 'The Adaptive QR Code for Modern Event Operations',
            subtitle: 'Events change constantly — schedules shift, sessions move, and links evolve from registration to live access to post-event follow-ups.',
            description: 'SwitchQR gives event teams a single, permanent QR code that adapts throughout the entire event lifecycle — without ever needing reprints.',
            highlight: 'Update destinations instantly. Reduce printing costs. Ensure attendees always see the latest information.',
            cta: 'Create Event QR',
            secondaryCta: 'View Demo',
            image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1600&h=1200&fit=crop'
        },
        placementSection: {
            title: 'Where Event Teams Use SwitchQR',
            subtitle: 'SwitchQR works across all event touchpoints:',
            items: [
                { icon: 'tv', label: 'Stage screens and presentation displays' },
                { icon: 'storefront', label: 'Booth banners and sponsor signage' },
                { icon: 'badge', label: 'Attendee badges and lanyards' },
                { icon: 'how_to_reg', label: 'Registration desks and welcome areas' },
                { icon: 'news', label: 'Printed flyers, posters, and venue signage' },
                { icon: 'mail', label: 'Email confirmations and event landing pages' }
            ]
        },
        benefits: {
            title: 'Built for Event Teams Managing Real-World Complexity',
            subtitle: 'SwitchQR eliminates the limitations of static QR codes and gives teams complete control.',
            items: [
                {
                    icon: 'history_toggle_off',
                    title: 'Instant Updates Without Reprinting',
                    description: 'Fix errors, update session links, or change destinations instantly — even after materials are printed and deployed. No replacements. No operational delays.'
                },
                {
                    icon: 'monitoring',
                    title: 'Real-Time Event Analytics',
                    description: 'Track scan activity across sessions, booths, and locations. Understand what attendees engage with most and use real data to improve future events.'
                },
                {
                    icon: 'folder_managed',
                    title: 'Organized Event Management',
                    description: 'Group QR codes by event, campaign, or sponsor using structured folders. Maintain clarity and control across multiple events.'
                }
            ]
        },
        advanced: {
            title: 'Advanced Capabilities for Event Teams',
            subtitle: 'SwitchQR enables continuous optimization throughout the event lifecycle.',
            items: [
                { title: 'A/B Testing', description: 'Test different destinations to improve engagement and conversion.' },
                { title: 'Campaign Management', description: 'Organize events into structured campaigns for better reporting.' },
                { title: 'Dynamic Scheduling', description: 'Automatically update redirects based on your event schedule.' }
            ]
        },
        feature: {
            type: 'timeline',
            title: 'One QR Code Across the Entire Event Lifecycle',
            subtitle: 'A single QR code can serve multiple purposes as your event progresses.',
            items: [
                { icon: 'how_to_reg', time: 'Before Event', title: 'Before Event', description: 'Registration, agenda, and event information' },
                { icon: 'live_tv', time: 'During Event', title: 'During Event', description: 'Live streams, session materials, and speaker details', active: true },
                { icon: 'rate_review', time: 'After Event', title: 'After Event', description: 'Feedback surveys, recordings, and follow-ups' }
            ],
            footer: 'The QR code stays the same — only the destination changes.',
            demo: {
                time: 'Event Day, 09:00 AM',
                url: 'event.com/live-stage',
                image: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://switchqr.com&color=6b26d9'
            }
        },

        setup: {
            title: 'Simple Setup in Minutes',
            steps: [
                { title: 'Create your QR code', description: 'Generate a dynamic QR for your event.' },
                { title: 'Set redirect rules', description: 'Define destinations and optional scheduling.' },
                { title: 'Monitor and optimize', description: 'Track scans and update anytime.' }
            ],
            footer: 'No reprints. No delays. No limitations.'
        },
        testimonial: {
            quote: "We replaced multiple static QR codes with a single adaptive QR. It simplified operations and gave us real visibility into engagement.",
            author: 'Alex Rivera',
            role: 'Head of Event Operations',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
        }
    },
    retail: {
        slug: 'retail',
        name: 'Retail Industry',
        icon: 'shopping_basket',
        gradient: 'linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%)',
        hero: {
            eyebrow: 'Retail Industry Solution',
            title: 'Dynamic QR Codes for Modern Retail Operations',
            subtitle: 'Retail promotions change constantly — offers rotate, inventory shifts, and campaigns evolve weekly.',
            description: 'SwitchQR allows retail teams to deploy one permanent QR code that can be updated instantly across stores, displays, and printed materials — without replacing physical signage. Keep in-store marketing accurate, current, and measurable at all times.',
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
            cta: 'Create your first retail QR',
            secondaryCta: 'View live demo',
            highlight: 'One permanent QR. Infinite marketing possibilities.'
        },
        placementSection: {
            title: 'Where Retailers Use SwitchQR',
            subtitle: 'SwitchQR integrates seamlessly across the physical store environment:',
            items: [
                { icon: 'shelves', label: 'Shelf talkers and product displays' },
                { icon: 'vertical_shades_closed', label: 'Window posters and storefront signage' },
                { icon: 'shopping_bag', label: 'Checkout counters and POS areas' },
                { icon: 'package_2', label: 'Packaging inserts and receipts' },
                { icon: 'campaign', label: 'In-store promotional stands' },
                { icon: 'storefront', label: 'Mall kiosks and pop-ups' }
            ],
            footer: 'One QR code continues working even as campaigns change.'
        },
        benefits: {
            title: 'Built for Retail Teams Managing Multiple Locations',
            subtitle: 'SwitchQR removes the operational friction of updating physical retail marketing.',
            items: [
                {
                    icon: 'bolt',
                    title: 'Update Promotions Instantly',
                    description: 'Change offers, product links, or seasonal campaigns instantly — without replacing printed materials. Your signage stays relevant without additional printing or operational overhead.'
                },
                {
                    icon: 'insights',
                    title: 'Store-Level Insights',
                    description: 'Track which store locations, displays, and promotions generate the most engagement. Use real scan data to optimize merchandising and promotional strategy.'
                },
                {
                    icon: 'loyalty',
                    title: 'Convert In-Store Traffic',
                    description: 'Continue engaging customers after they leave the store by redirecting QR codes to loyalty programs, recommendations, or follow-up offers. Extend the value of every in-store interaction.'
                }
            ]
        },
        advanced: {
            title: 'Advanced Capabilities for Retail Operations',
            subtitle: 'SwitchQR enables continuous optimization across stores and campaigns.',
            items: [
                { title: 'A/B Test Promotions', description: 'Test different promotions to identify top-performing offers by location.' },
                { title: 'Regional Control', description: 'Organize campaigns by store, region, or product line for better reporting.' },
                { title: 'Real-Time Tracking', description: 'Track engagement across all locations instantly to see what drives revenue.' }
            ],
            footer: 'Retail teams gain full control without operational disruption.'
        },
        feature: {
            type: 'analytics',
            title: 'Optimize Promotions with Real Data',
            subtitle: 'Test and refine offers based on real customer behavior across locations.',
            stats: [
                { label: 'Total Scans', value: '84.2k', icon: 'qr_code_scanner' },
                { label: 'Highest Lift', value: '+32%', icon: 'trending_up' },
                { label: 'Top Store', value: 'Downtown HQ', icon: 'location_on' }
            ],
            map_data: {
                active_regions: ['North', 'Midwest', 'South'],
                highlight: 'Compare Performance Across Categories'
            }
        },
        lifecycle: {
            title: 'One QR Code That Evolves With Your Store',
            subtitle: 'The QR code remains the same — only the destination updates.',
            items: [
                {
                    icon: 'rocket_launch',
                    title: 'Launch phase',
                    description: 'Product launches and promotional offers'
                },
                {
                    icon: 'campaign',
                    title: 'Active promotion',
                    description: 'Discounts, product information, and conversions'
                },
                {
                    icon: 'loyalty',
                    title: 'Post-promotion',
                    description: 'Loyalty enrollment, future offers, and customer retention'
                }
            ]
        },
        setup: {
            title: 'Simple Setup in Minutes',
            subtitle: 'Get your retail campaigns running in three steps:',
            items: [
                {
                    icon: 'qr_code_2',
                    title: '1. Create your QR code',
                    description: 'Generate a dynamic QR for any retail use case.'
                },
                {
                    icon: 'link',
                    title: '2. Set your destination',
                    description: 'Link to offers, product pages, or loyalty programs.'
                },
                {
                    icon: 'sync',
                    title: '3. Update anytime',
                    description: 'Modify promotions instantly without replacing printed materials.'
                }
            ]
        },
        testimonial: {
            quote: "We deployed QR codes across multiple store displays and were able to update campaigns instantly without replacing signage. It significantly improved our operational efficiency.",
            author: 'Retail Marketing Lead',
            role: 'Enterprise Operations',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
        }
    },
    packaging: {
        slug: 'packaging',
        name: 'Packaging & D2C',
        icon: 'inventory_2',
        gradient: 'linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)',
        hero: {
            eyebrow: 'Product Packaging & D2C Brands',
            title: 'Packaging That Evolves Digitally',
            subtitle: 'Packaging lasts months. Your marketing doesn’t. Update the unboxing experience long after shipping.',
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80'
        },
        placementSection: {
            title: 'Where D2C Brands Use SwitchQR',
            subtitle: 'Connect with customers directly through your packaging:',
            items: [
                { icon: 'package_2', label: 'Primary product box' },
                { icon: 'menu_book', label: 'Instruction manuals' },
                { icon: 'card_giftcard', label: 'Thank you inserts' }
            ]
        },
        benefits: {
            title: 'Post-Purchase Engagement',
            subtitle: 'Turn a static box into an ongoing customer relationship channel.',
            items: [
                {
                    icon: 'smart_display',
                    title: 'Video Manuals',
                    description: 'Replace paper instructions with always-updated video guides.'
                },
                {
                    icon: 'trending_up',
                    title: 'Upsell Flows',
                    description: 'Suggest compatible accessories weeks after they bought the main product.'
                },
                {
                    icon: 'public',
                    title: 'Global Supply Chain',
                    description: 'Track scans by country for logistics insights.'
                }
            ]
        },
        advanced: {
            title: 'Digital Packaging Strategy',
            subtitle: 'Maximize the lifetime value of every customer.',
            items: [
                { title: 'Dynamic Upselling', description: 'Test different upsell flows based on the product life cycle.' },
                { title: 'SKU Intelligence', description: 'Create and track campaigns per product SKU or batch.' },
                { title: 'Batch Scheduling', description: 'Roll out new experiences to specific batches of products.' }
            ]
        },
        feature: {
            type: 'analytics',
            title: 'Supply Chain Intelligence',
            subtitle: 'See exactly where your products are being unboxed around the world in real-time.',
            stats: [
                { label: 'Total Scans', value: '124.5k', icon: 'qr_code_scanner' },
                { label: 'Top Region', value: 'North America', icon: 'public' },
                { label: 'Engagement', value: '3.2m', icon: 'timer' }
            ],
            map_data: {
                active_regions: ['US', 'DE', 'JP', 'UK'],
                highlight: 'Global Distribution'
            }
        },
        testimonial: {
            quote: "Our packaging is now a living channel. We update unboxing videos and accessory offers long after the product has left our warehouse.",
            author: 'Marcus Johnson',
            role: 'Product Lead, TechGear',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
        }
    },
    restaurants: {
        slug: 'restaurants',
        name: 'Restaurants & Cafés',
        icon: 'restaurant',
        gradient: 'linear-gradient(135deg, #fdba74 0%, #fb923c 100%)',
        hero: {
            eyebrow: 'Restaurants & Cafés',
            title: 'Smart Menus & Promotions',
            subtitle: 'Menus change. Offers change. Your QR codes shouldn’t. Automate your day-parting.',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80'
        },
        placementSection: {
            title: 'Where Restaurants Use SwitchQR',
            subtitle: 'Automate your customer touchpoints:',
            items: [
                { icon: 'table_restaurant', label: 'Table tents and stands' },
                { icon: 'restaurant_menu', label: 'Menu boards and flyers' },
                { icon: 'window', label: 'Window posters for takeaway' }
            ]
        },
        benefits: {
            title: 'Automate Your Service',
            subtitle: 'Reduce friction for staff and improve customer experience.',
            items: [
                {
                    icon: 'schedule',
                    title: 'Day-Parting',
                    description: 'Automatically switch from Lunch to Dinner menus.'
                },
                {
                    icon: 'celebration',
                    title: 'Happy Hour',
                    description: 'Trigger special offer pages only during 4-6 PM.'
                },
                {
                    icon: 'store',
                    title: 'Branch Management',
                    description: 'Manage campaigns separately for each location.'
                }
            ]
        },
        advanced: {
            title: 'Enterprise Restaurant Tools',
            subtitle: 'Smart automation for single locations or chains.',
            items: [
                { title: 'Branch Folders', description: 'Organize and manage campaigns separately for every branch.' },
                { title: 'Flow Testing', description: 'A/B test ordering vs WhatsApp booking to see what works best.' },
                { title: 'Timed Redirects', description: 'Set specific schedules for specials and seasonal menus.' }
            ]
        },
        feature: {
            type: 'timeline',
            title: 'The Self-Updating Menu',
            subtitle: 'Set it once and let the schedule run your marketing.',
            items: [
                {
                    icon: 'lunch_dining',
                    time: '11am - 4pm',
                    title: 'Lunch',
                    description: 'Redirects to Standard Menu'
                },
                {
                    icon: 'local_bar',
                    time: '4pm - 7pm',
                    title: 'Happy Hour',
                    description: 'Redirects to 2-for-1 Offers',
                    active: true
                },
                {
                    icon: 'music_note',
                    time: 'Friday Night',
                    title: 'Live Music',
                    description: 'Promotes band schedule and drinks'
                }
            ],
            demo: {
                time: 'Daily, 05:00 PM',
                url: 'bistro.com/happy-hour',
                image: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://switchqr.com&color=ea580c'
            }
        },
        testimonial: {
            quote: "SwitchQR automated our day-parting. Our lunch and dinner menus switch perfectly without any manual effort from the staff.",
            author: 'Elena Rodriguez',
            role: 'Owner, La Mesa Bistro',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop'
        }
    },
    education: {
        slug: 'education',
        name: 'Education & Training',
        icon: 'school',
        gradient: 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)',
        hero: {
            eyebrow: 'Education & Training Institutes',
            title: 'Admissions Funnel from Offline Ads',
            subtitle: 'Education marketing is heavily offline + seasonal. Scheduled redirects are perfect here.',
            image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80'
        },
        placementSection: {
            title: 'Where Education Teams Use SwitchQR',
            subtitle: 'Bridge the gap between campus and digital discovery:',
            items: [
                { icon: 'ads_click', label: 'Posters and brochures' },
                { icon: 'campaign', label: 'Event flyers and admissions ads' },
                { icon: 'domain', label: 'Campus notice boards' }
            ]
        },
        benefits: {
            title: 'Seamless Student Journey',
            subtitle: 'Guide prospective students from "Interest" to "Enrolled" with one physical touchpoint.',
            items: [
                {
                    icon: 'timeline',
                    title: 'Seasonal Updates',
                    description: 'Change the link when admissions open vs close without reprinting brochures.'
                },
                {
                    icon: 'call_split',
                    title: 'A/B Testing',
                    description: 'Test messaging: Career outcomes focus vs Campus life focus.'
                },
                {
                    icon: 'folder_copy',
                    title: 'Course Folders',
                    description: 'Organize campaigns by course or department for better tracking.'
                }
            ]
        },
        advanced: {
            title: 'Admissions Optimization Tools',
            subtitle: 'Smart tools to improve student recruitment efficiency.',
            items: [
                { title: 'Message Testing', description: 'A/B test different calls to action (e.g., Download Brochure vs Apply Now).' },
                { title: 'Departmental Access', description: 'Give individual departments control over their own QR campaigns.' },
                { title: 'Seasonal Automation', description: 'Schedule automatic redirects for application deadlines and orientation.' }
            ]
        },
        feature: {
            type: 'ab_test',
            title: 'Perfect Your Messaging',
            subtitle: 'Unsure if "High Placement Rates" or "Modern Campus" drives more clicks? Test it.',
            experiment: {
                metric: 'Applications Started',
                lift: '+18%',
                variants: [
                    {
                        name: 'Variant A',
                        label: 'Career Focus',
                        value: '12.5%',
                        color: 'bg-primary'
                    },
                    {
                        name: 'Variant B',
                        label: 'Campus Life',
                        value: '10.6%',
                        color: 'bg-gray-400'
                    }
                ]
            }
        },
        testimonial: {
            quote: "Education marketing is heavily seasonal. SwitchQR allows us to update our admissions links across the entire campus instantly as deadlines approach.",
            author: 'Dr. James Wilson',
            role: 'Dean of Admissions, State Tech',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop'
        }
    },
    corporate: {
        slug: 'corporate',
        name: 'Corporate & Internal',
        icon: 'apartment',
        gradient: 'linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 100%)',
        hero: {
            eyebrow: 'Corporate Offices & Internal Ops',
            title: 'Dynamic Workplace Communication',
            subtitle: 'Internal comms are messy. QR lets teams push changing content without reprinting.',
            image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80'
        },
        placementSection: {
            title: 'Where Corporate Teams Use SwitchQR',
            subtitle: 'Modernize internal communication at every office:',
            items: [
                { icon: 'dashboard', label: 'Notice boards and digital signage' },
                { icon: 'coffee', label: 'Cafeteria and breakout tables' },
                { icon: 'sensor_door', label: 'Entry areas and meeting rooms' }
            ]
        },
        benefits: {
            title: 'Engage Your Workforce',
            subtitle: 'Turn passive notice boards into active communication channels.',
            items: [
                {
                    icon: 'update',
                    title: 'Push Updates',
                    description: 'Broadcast policy changes or urgent updates instantly to everyone.'
                },
                {
                    icon: 'poll',
                    title: 'Live Feedback',
                    description: 'Run quick pulse surveys or feedback forms during lunch hours.'
                },
                {
                    icon: 'insights',
                    title: 'Engagement Data',
                    description: 'Analytics to see which departments or floors are actually engaged.'
                }
            ]
        },
        advanced: {
            title: 'Internal Ops Control',
            subtitle: 'Manage workplace communication with enterprise precision.',
            items: [
                { title: 'Department Isolation', description: 'Securely manage campaigns for HR, Sales, or IT separately.' },
                { title: 'Engagement Analytics', description: 'Get detailed reports on internal participation and document views.' },
                { title: 'Regional Overrides', description: 'Schedule content updates for specific office locations or regions.' }
            ]
        },
        feature: {
            type: 'analytics',
            title: 'Internal Engagement Data',
            subtitle: 'Finally understand which departments are actually reading the new policy updates.',
            stats: [
                { label: 'Policy Reads', value: '88%', icon: 'fact_check' },
                { label: 'Most Active', value: 'Sales Team', icon: 'groups' },
                { label: 'Avg Time', value: '4m 12s', icon: 'schedule' }
            ],
            map_data: {
                active_regions: ['HQ', 'Remote', 'Sales Office'],
                highlight: 'Department Breakdown'
            }
        },
        testimonial: {
            quote: "Internal comms are usually ignored. SwitchQR lets us push changing content to cafeteria tables without reprinting flyers every week.",
            author: 'Linda Martinez',
            role: 'HR Director, OmniCorp',
            image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop'
        }
    }
};
