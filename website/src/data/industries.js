
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
            image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?w=1200&q=80',
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
        name: 'Product Packaging & D2C Brands',
        icon: 'package_2',
        gradient: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
        hero: {
            eyebrow: 'Packaging & D2C Solution',
            title: 'Turn Product Packaging into a Long-Term Customer Channel',
            subtitle: 'Packaging stays with your customer long after delivery. Your marketing should evolve with it.',
            description: 'SwitchQR enables brands to deploy one permanent QR code on packaging that can be updated anytime — after shipping, after launch, and throughout the product lifecycle. Deliver updated experiences without changing packaging or inventory.',
            image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&q=80',
            cta: 'Create your first packaging QR',
            secondaryCta: 'View live demo',
            highlight: 'Deliver updated experiences without changing packaging or inventory.'
        },
        placementSection: {
            title: 'Where D2C Brands Use SwitchQR',
            subtitle: 'SwitchQR integrates directly into your product packaging ecosystem:',
            items: [
                { icon: 'package_2', label: 'Primary product packaging' },
                { icon: 'menu_book', label: 'Instruction manuals and setup guides' },
                { icon: 'card_giftcard', label: 'Thank-you cards and inserts' },
                { icon: 'verified', label: 'Warranty cards and registration forms' },
                { icon: 'label', label: 'Product labels and outer cartons' }
            ],
            footer: 'One QR code continues working throughout the product’s lifetime.'
        },
        benefits: {
            title: 'Extend Customer Engagement Beyond Delivery',
            subtitle: 'SwitchQR transforms packaging from a static asset into an ongoing engagement channel.',
            items: [
                {
                    icon: 'video_library',
                    title: 'Always-Updated Setup and Video Guides',
                    description: 'Replace printed instructions with digital setup videos, troubleshooting guides, and onboarding flows. Update content anytime without reprinting packaging.'
                },
                {
                    icon: 'trending_up',
                    title: 'Upsell and Cross-Sell After Purchase',
                    description: 'Recommend accessories, upgrades, or complementary products after customers begin using the product. Drive additional revenue from existing customers.'
                },
                {
                    icon: 'public',
                    title: 'Global Visibility Into Product Usage',
                    description: 'Track when and where products are being scanned to understand customer distribution and engagement. Gain real-world insight beyond shipment data.'
                }
            ]
        },
        advanced: {
            title: 'Built for Modern D2C and Product Teams',
            subtitle: 'SwitchQR provides control across the entire product lifecycle.',
            items: [
                { title: 'SKU-Level Control', description: 'Manage campaigns by product, SKU, or batch for precise messaging.' },
                { title: 'Post-Shipment Updates', description: 'Update experiences even after the product has left the warehouse.' },
                { title: 'Agile Campaigns', description: 'Launch new campaigns without waiting for the next packaging print run.' }
            ],
            footer: 'Packaging becomes a flexible digital touchpoint.'
        },
        feature: {
            type: 'analytics',
            title: 'Supply Chain and Product Intelligence',
            subtitle: 'Understand how customers interact with your products after delivery.',
            stats: [
                { label: 'Unboxing Scans', value: '12.5k', icon: 'inventory_2' },
                { label: 'Video Views', value: '8.2k', icon: 'play_circle' },
                { label: 'Registration', value: '64%', icon: 'how_to_reg' }
            ],
            map_data: {
                active_regions: ['USA', 'UK', 'Germany'],
                highlight: 'Track engagement across packaging batches and releases'
            }
        },
        lifecycle: {
            title: 'One QR Code That Evolves With the Product Lifecycle',
            subtitle: 'A single QR code can serve multiple purposes over time.',
            items: [
                {
                    icon: 'rocket_launch',
                    title: 'Launch phase',
                    description: 'Setup guides, onboarding, and registration'
                },
                {
                    icon: 'settings',
                    title: 'Active usage phase',
                    description: 'Tutorials, feature education, and support'
                },
                {
                    icon: 'auto_graph',
                    title: 'Growth phase',
                    description: 'Accessory recommendations and product upgrades'
                }
            ]
        },
        setup: {
            title: 'Simple Setup in Minutes',
            subtitle: 'Get your packaging campaigns running in three steps:',
            items: [
                {
                    icon: 'qr_code_2',
                    title: '1. Create your QR code',
                    description: 'Generate a dynamic QR for your packaging.'
                },
                {
                    icon: 'link',
                    title: '2. Assign your destination',
                    description: 'Link to setup guides, product pages, or campaigns.'
                },
                {
                    icon: 'sync',
                    title: '3. Update anytime',
                    description: 'Modify experiences without changing packaging.'
                }
            ]
        },
        testimonial: {
            quote: "We placed SwitchQR on our packaging and were able to update onboarding videos and accessory offers without changing inventory. It gave us ongoing control after delivery.",
            author: 'Product Operations Lead',
            role: 'D2C Brand Strategy',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces'
        }
    },
    restaurants: {
        slug: 'restaurants',
        name: 'Restaurants & Cafés',
        icon: 'restaurant',
        gradient: 'linear-gradient(135deg, #fdba74 0%, #fb923c 100%)',
        hero: {
            eyebrow: 'Restaurants & Cafés Solution',
            title: 'Smart Menus That Update Automatically',
            subtitle: 'Menus change throughout the day. Your QR codes shouldn’t need to.',
            description: 'SwitchQR allows restaurants and cafés to deploy one permanent QR code that automatically redirects customers to the correct menu, promotion, or ordering page — based on time, campaign, or location. No reprinting. No manual updates. No broken links.',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
            cta: 'Create your first smart menu',
            secondaryCta: 'View live demo',
            highlight: 'No reprinting. No manual updates. No broken links.'
        },
        placementSection: {
            title: 'Where Restaurants Use SwitchQR',
            subtitle: 'SwitchQR integrates seamlessly into existing restaurant touchpoints:',
            items: [
                { icon: 'table_restaurant', label: 'Table tents and table stands' },
                { icon: 'restaurant_menu', label: 'Printed menus and menu boards' },
                { icon: 'window', label: 'Window displays and takeaway posters' },
                { icon: 'store', label: 'Counter displays and ordering areas' },
                { icon: 'auto_awesome', label: 'Flyers and promotional materials' }
            ],
            footer: 'One QR code works across every customer interaction.'
        },
        benefits: {
            title: 'Automate Your Service',
            subtitle: 'Ensure customers always see the correct experience without staff intervention.',
            items: [
                {
                    icon: 'schedule',
                    title: 'Automatic Day-Parting',
                    description: 'Switch between breakfast, lunch, dinner, and late-night menus automatically based on schedule. Eliminate the need to manually update links.'
                },
                {
                    icon: 'celebration',
                    title: 'Timed Promotions and Happy Hours',
                    description: 'Activate special offers only during specific hours or days. Run happy hours, seasonal menus, and limited-time campaigns with precision.'
                },
                {
                    icon: 'location_on',
                    title: 'Manage Multiple Locations Easily',
                    description: 'Assign separate campaigns and rules for each branch while maintaining centralized control. Maintain consistency across your entire operation.'
                }
            ]
        },
        advanced: {
            title: 'Built for Single Locations and Multi-Branch Restaurants',
            subtitle: 'SwitchQR provides the flexibility restaurants need to operate efficiently.',
            items: [
                { title: 'Instant Updates', description: 'Update menus instantly without reprinting physical materials.' },
                { title: 'Scheduled Automation', description: 'Run scheduled promotions automatically based on time of day.' },
                { title: 'Branch Management', description: 'Manage campaigns by branch or location for localized control.' }
            ],
            footer: 'Your physical QR codes remain the same — only the destination updates.'
        },
        feature: {
            type: 'timeline',
            title: 'One QR Code That Adapts Throughout the Day',
            subtitle: 'A single QR code can power your entire service cycle.',
            items: [
                {
                    icon: 'coffee',
                    time: 'Morning',
                    title: 'Breakfast hours',
                    description: 'Redirect to breakfast menu'
                },
                {
                    icon: 'lunch_dining',
                    time: 'Day/Evening',
                    title: 'Lunch and dinner service',
                    description: 'Automatically switch to the appropriate menu',
                    active: true
                },
                {
                    icon: 'local_bar',
                    time: 'Campaign',
                    title: 'Promotional periods',
                    description: 'Activate happy hour, live events, or seasonal offers'
                }
            ],
            demo: {
                time: 'Daily Service',
                url: 'bistro.com/menu',
                image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=400&fit=crop'
            }
        },
        setup: {
            title: 'Simple Setup in Minutes',
            subtitle: 'Get your smart menus running in three steps:',
            items: [
                {
                    icon: 'qr_code_2',
                    title: '1. Create your QR code',
                    description: 'Generate a dynamic QR for menus or promotions.'
                },
                {
                    icon: 'settings',
                    title: '2. Configure schedules',
                    description: 'Define when and where your QR redirects.'
                },
                {
                    icon: 'sync',
                    title: '3. Update anytime',
                    description: 'Modify menus or campaigns instantly without reprinting.'
                }
            ]
        },
        testimonial: {
            quote: "SwitchQR automated our menu switching completely. Our QR codes now redirect customers to the correct menu throughout the day without staff needing to manage anything.",
            author: 'Restaurant Owner',
            role: 'Hospitality Operations',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop'
        }
    },
    education: {
        slug: 'education',
        name: 'Education & Training Institutes',
        icon: 'school',
        gradient: 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)',
        hero: {
            eyebrow: 'Admissions & Enrollment Solution',
            title: 'Turn Every Poster Into an Admissions Funnel',
            subtitle: 'Offline marketing drives student interest. SwitchQR converts that interest into applications—instantly and intelligently.',
            description: 'Convert every physical touchpoint—brochures, posters, and campus signage—into a high-converting digital gateway. Manage seasonal application cycles and optimize messaging without reprinting physical assets.',
            image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=80',
            cta: 'Get started free',
            secondaryCta: 'View demo',
            highlight: 'Convert offline interest into instant applications.'
        },
        placementSection: {
            title: 'Where Institutions Use SwitchQR',
            subtitle: 'Bring static campus materials to life:',
            items: [
                { icon: 'ads_click', label: 'Posters and admission brochures' },
                { icon: 'campaign', label: 'Entrance coaching ads and flyers' },
                { icon: 'domain', label: 'Campus notice boards and kiosks' },
                { icon: 'groups', label: 'Education fairs and outreach events' }
            ],
            footer: 'Every scan becomes a measurable step toward enrollment.'
        },
        benefits: {
            title: 'Convert Interest Into Applications—Seamlessly',
            subtitle: 'Guide students from curiosity to enrollment without friction.',
            items: [
                {
                    icon: 'calendar_today',
                    title: 'Seasonal Admissions Updates',
                    description: 'When applications open, redirect instantly to the application form. When closed, redirect to “Join Next Intake” or “Download Brochure.” No reprinting. No confusion.'
                },
                {
                    icon: 'analytics',
                    title: 'Message Testing for Higher Applications',
                    description: 'Test what drives more conversions: “Download Brochure”, “Apply Now”, or “Check Placement Stats”. SwitchQR automatically identifies the winner.'
                },
                {
                    icon: 'folder_shared',
                    title: 'Course-Level Campaign Organization',
                    description: 'Create separate folders for Engineering, MBA, Medical, or Certification programs. Track which programs attract the most interest.'
                }
            ]
        },
        advanced: {
            title: 'Improve Admissions Efficiency With Smart Automation',
            subtitle: 'Test, optimize, and scale without manual effort.',
            items: [
                { title: 'Message Optimization', description: 'Test admissions messaging across campaigns to improve funnel velocity.' },
                { title: 'Departmental Access', description: 'Give individual departments control over their own QR campaigns.' },
                { title: 'Cycle Scheduling', description: 'Schedule automatic redirects for admission cycles and deadlines.' }
            ],
            footer: 'Scale your enrollment efforts with data-driven precision.'
        },
        feature: {
            type: 'ab_test',
            title: 'Example: Messaging Test Results',
            subtitle: 'Identify high-converting messaging to drive higher application intent.',
            experiment: {
                metric: 'Conversion Rate',
                lift: '+18%',
                variants: [
                    {
                        name: 'Variant A',
                        label: 'Career-focused',
                        value: '12.5%',
                        color: 'bg-primary'
                    },
                    {
                        name: 'Variant B',
                        label: 'Campus life',
                        value: '10.6%',
                        color: 'bg-gray-400'
                    }
                ]
            }
        },
        setup: {
            title: 'Launch in Minutes',
            subtitle: 'Get your admissions funnel running in three steps:',
            items: [
                {
                    icon: 'qr_code_2',
                    title: '1. Create QR code',
                    description: 'Generate a dynamic QR for your institution.'
                },
                {
                    icon: 'swap_horiz',
                    title: '2. Set redirect rules',
                    description: 'Configure schedules for admission cycles.'
                },
                {
                    icon: 'auto_graph',
                    title: '3. Track and optimize',
                    description: 'Monitor performance and update anytime.'
                }
            ]
        },
        testimonial: {
            quote: "SwitchQR lets us update admissions links across campus instantly without reprinting materials. It saves time and improves conversions.",
            author: 'Dean of Admissions',
            role: 'State Technical Institute',
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
