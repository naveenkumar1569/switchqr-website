
export const industries = {
    events: {
        slug: 'events',
        name: 'Events & Conferences',
        icon: 'festival',
        gradient: 'linear-gradient(135deg, #a5b4fc 0%, #818cf8 100%)',
        hero: {
            eyebrow: 'Events Industry Solution',
            title: 'The "Adaptive Ticket" for Modern Events',
            subtitle: 'One QR code that evolves from registration to live agenda to post-event feedback. No reprinting required.',
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80'
        },
        placement: [
            'Booth banners',
            'Stage screens',
            'Badges',
            'Flyers'
        ],
        flow: {
            before: 'QR links to Agenda / Registration page',
            during: 'Scheduled redirect to Live Session links & Lead forms',
            after: 'Redirects to Feedback Survey & Recordings'
        },
        benefits: {
            title: 'Chef’s Kiss for Event Teams',
            subtitle: 'No reprinting, no rushing to change links manually, and full scan analytics per event.',
            items: [
                {
                    icon: 'edit_square',
                    title: 'Zero Reprinting',
                    description: 'Fix typos or schedule changes instantly. No need to replace physical signage.'
                },
                {
                    icon: 'analytics',
                    title: 'Event Analytics',
                    description: 'Track exactly which sessions are most popular and monitor attendee flow in real-time.'
                },
                {
                    icon: 'folder_open',
                    title: 'Campaign Folders',
                    description: 'Organize every event into its own folder for clean management.'
                }
            ]
        },
        advanced: [
            'A/B test different CTAs ("Book demo" vs "Download brochure")',
            'Campaign folder for each event'
        ],
        feature: {
            type: 'timeline',
            title: 'The Perfect Event Lifecycle',
            subtitle: 'A single asset that serves the entire attendee journey.',
            items: [
                {
                    icon: 'how_to_reg',
                    time: 'Pre-Event',
                    title: 'Registration',
                    description: 'Links to registration & agenda'
                },
                {
                    icon: 'live_tv',
                    time: 'During Event',
                    title: 'Live Access',
                    description: 'Redirects to live streams & speaker bios',
                    active: true
                },
                {
                    icon: 'rate_review',
                    time: 'Post-Event',
                    title: 'Feedback Loop',
                    description: 'Switches to survey & recordings'
                }
            ],
            demo: {
                time: 'Event Day, 09:00 AM',
                url: 'event.com/live-stage',
                image: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://switchqr.com&color=6b26d9'
            }
        },
        testimonial: {
            quote: "This is chef’s kiss for PMMs and event teams. We stopped printing 5 different flyers and just used one smart QR.",
            author: 'Alex Rivera',
            role: 'Head of Event Operations, SaaStr',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces'
        }
    },
    retail: {
        slug: 'retail',
        name: 'Retail & In-Store',
        icon: 'storefront',
        gradient: 'linear-gradient(135deg, #f9a8d4 0%, #f472b6 100%)',
        hero: {
            eyebrow: 'Retail & In-Store Marketing',
            title: 'Dynamic Shelf Talkers',
            subtitle: 'Retail teams can update offers without changing physical materials. Your window display works 24/7.',
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80'
        },
        placement: [
            'Shelf displays',
            'Window posters',
            'Checkout counters'
        ],
        flow: {
            before: 'Regular days → Product info page',
            during: 'Sale days → Discount landing page',
            after: 'Post-sale → Loyalty signup or WhatsApp opt-in'
        },
        benefits: {
            title: 'Geo-Analytics That Make Sense',
            subtitle: 'See which store locations are driving the most engagement and optimize accordingly.',
            items: [
                {
                    icon: 'campaign',
                    title: 'Instant Promos',
                    description: 'Update window displays instantly to match current stock and weekly promotions.'
                },
                {
                    icon: 'location_on',
                    title: 'Location Data',
                    description: 'Compare scan performance between different store branches.'
                },
                {
                    icon: 'loyalty',
                    title: 'Loyalty Growth',
                    description: 'Convert one-time shoppers into repeat customers after the sale ends.'
                }
            ]
        },
        advanced: [
            'A/B test offer types per location',
            'Campaign folders per store or region'
        ],
        feature: {
            type: 'ab_test',
            title: 'Optimize Content with A/B Testing',
            subtitle: 'Stop guessing which offer works best. Split traffic automatically and see the winner.',
            experiment: {
                metric: 'Conversion Rate',
                lift: '+42%',
                variants: [
                    {
                        name: 'Variant A',
                        label: '50% Off',
                        value: '2.4%',
                        color: 'bg-gray-400'
                    },
                    {
                        name: 'Variant B',
                        label: 'Buy 1 Get 1',
                        value: '3.8%',
                        color: 'bg-primary'
                    }
                ]
            }
        },
        testimonial: {
            quote: "Retail teams can update offers without changing physical materials. Also: geo analytics actually makes sense here.",
            author: 'Sarah Chen',
            role: 'CMO, Urban Outfitters',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces'
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
        placement: [
            'Product box',
            'Instruction manual'
        ],
        flow: {
            before: 'Initial phase → Onboarding video',
            during: 'Later → Accessories & Upsell page',
            after: 'Later → Feedback & Review page'
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
        advanced: [
            'A/B test different upsell flows',
            'Track scans by country for logistics insights',
            'Campaigns per product SKU or batch'
        ],
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
            quote: "Packaging lasts months. Your marketing doesn’t. SwitchQR lets packaging evolve digitally.",
            author: 'Marcus Johnson',
            role: 'Product Lead, TechGear',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces'
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
        placement: [
            'Table tents',
            'Menus',
            'Wall posters'
        ],
        flow: {
            before: 'Normal hours → Standard Menu',
            during: 'Happy hours → Special Offers',
            after: 'Special days → Event / Live Music promo'
        },
        benefits: {
            title: 'Automate Your Service',
            subtitle: 'Restaurants actually use this stuff, not just talk about it. Reduce friction for staff.',
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
        advanced: [
            'Campaign per branch',
            'A/B test ordering vs WhatsApp booking'
        ],
        feature: {
            type: 'timeline',
            title: 'The Self-Updating Menu',
            subtitle: 'Set it once and let the schedule run your marketing.',
            items: [
                {
                    icon: 'lunch_dining',
                    time: '11am - 4pm',
                    title: 'Lunch',
                    description: 'Standard Menu'
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
                    description: 'Promotes band schedule'
                }
            ],
            demo: {
                time: 'Daily, 05:00 PM',
                url: 'bistro.com/happy-hour',
                image: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://switchqr.com&color=ea580c'
            }
        },
        testimonial: {
            quote: "Menus change. Offers change. QR shouldn’t. And restaurants actually use this stuff.",
            author: 'Elena Rodriguez',
            role: 'Owner, La Mesa Bistro',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=faces'
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
        placement: [
            'Posters',
            'Flyers',
            'Campus boards'
        ],
        flow: {
            before: 'Before admissions → Brochure download',
            during: 'During admissions → Application page',
            after: 'After intake → Orientation info'
        },
        benefits: {
            title: 'Seamless Student Journey',
            subtitle: 'Guide prospective students from "Interest" to "Enrolled" with one physical touchpoint.',
            items: [
                {
                    icon: 'timeline',
                    title: 'Seasonal Updates',
                    description: 'Change the link when admissions open vs close.'
                },
                {
                    icon: 'call_split',
                    title: 'A/B Testing',
                    description: 'Test messaging: Career focus vs Placement focus.'
                },
                {
                    icon: 'folder_copy',
                    title: 'Course Folders',
                    description: 'Organize campaigns by course or department.'
                }
            ]
        },
        advanced: [
            'A/B test messaging (career vs placement focus)',
            'Campaign folders by course'
        ],
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
            quote: "Education marketing is heavily offline and seasonal. Scheduled redirects perfectly match our admission cycles.",
            author: 'Dr. James Wilson',
            role: 'Dean of Admissions, State Tech',
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces'
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
        placement: [
            'Notice boards',
            'Cafeteria tables',
            'Entry areas'
        ],
        flow: {
            before: 'Default → Internal updates / Intranet',
            during: 'During drives → Surveys or Registrations',
            after: 'After drives → Recap or Policy updates'
        },
        benefits: {
            title: 'Engage Your Workforce',
            subtitle: 'Turn passive notice boards into active communication channels.',
            items: [
                {
                    icon: 'update',
                    title: 'Push Updates',
                    description: 'Broadcast policy changes instantly to everyone.'
                },
                {
                    icon: 'poll',
                    title: 'Feedback',
                    description: 'Run quick pulse surveys during lunch hours.'
                },
                {
                    icon: 'insights',
                    title: 'Participation',
                    description: 'Analytics to see which departments are actually engaged.'
                }
            ]
        },
        advanced: [
            'A/B test engagement flows',
            'Analytics to see participation',
            'Campaigns per department or location'
        ],
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
            quote: "Internal comms are usually ignored. SwitchQR lets us push changing content to the cafeteria tables without reprinting flyers every week.",
            author: 'Linda Martinez',
            role: 'HR Director, OmniCorp',
            image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop&crop=faces'
        }
    }
};
