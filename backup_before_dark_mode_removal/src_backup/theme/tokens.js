/**
 * SwitchQR Design System Tokens
 * Centralized design values for consistency across the app
 */

export const tokens = {
    // Typography Scale
    typography: {
        // Font families
        fontFamily: {
            display: 'Inter, system-ui, -apple-system, sans-serif',
            mono: 'ui-monospace, monospace',
        },

        // Font sizes (responsive with clamp)
        fontSize: {
            xs: '0.75rem',      // 12px
            sm: '0.875rem',     // 14px
            base: '1rem',       // 16px
            lg: '1.125rem',     // 18px
            xl: '1.25rem',      // 20px
            '2xl': '1.5rem',    // 24px
            '3xl': '1.875rem',  // 30px
            '4xl': '2.25rem',   // 36px
            '5xl': '3rem',      // 48px
        },

        // Font weights
        fontWeight: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extrabold: 800,
            black: 900,
        },

        // Line heights
        lineHeight: {
            tight: 1.25,
            normal: 1.5,
            relaxed: 1.75,
        },
    },

    // Spacing Scale (4px base)
    spacing: {
        0: '0',
        1: '0.25rem',   // 4px
        2: '0.5rem',    // 8px
        3: '0.75rem',   // 12px
        4: '1rem',      // 16px
        5: '1.25rem',   // 20px
        6: '1.5rem',    // 24px
        8: '2rem',      // 32px
        10: '2.5rem',   // 40px
        12: '3rem',     // 48px
        16: '4rem',     // 64px
        20: '5rem',     // 80px
        24: '6rem',     // 96px
    },

    // Border Radius Scale
    radius: {
        none: '0',
        sm: '0.25rem',    // 4px
        md: '0.5rem',     // 8px
        lg: '0.75rem',    // 12px
        xl: '1rem',       // 16px
        '2xl': '1.5rem',  // 24px
        full: '9999px',
    },

    // Shadow Scale
    shadow: {
        none: 'none',
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    },

    // Z-Index Scale
    zIndex: {
        base: 0,
        dropdown: 1000,
        sticky: 1100,
        fixed: 1200,
        modalBackdrop: 1300,
        modal: 1400,
        popover: 1500,
        tooltip: 1600,
        toast: 1700,
    },

    // Color Tokens (Semantic)
    colors: {
        // Primary brand color
        primary: {
            DEFAULT: '#7c3aed',      // violet-600
            light: '#a78bfa',        // violet-400
            dark: '#5b21b6',         // violet-700
            hover: '#6d28d9',        // violet-700
        },

        // Semantic colors
        success: {
            DEFAULT: '#16a34a',      // green-600
            light: '#22c55e',        // green-500
            bg: '#f0fdf4',          // green-50
            bgDark: 'rgba(34, 197, 94, 0.1)',
            border: '#bbf7d0',      // green-200
            borderDark: 'rgba(34, 197, 94, 0.3)',
        },

        warning: {
            DEFAULT: '#d97706',      // amber-600
            light: '#f59e0b',        // amber-500
            bg: '#fffbeb',          // amber-50
            bgDark: 'rgba(245, 158, 11, 0.1)',
            border: '#fde68a',      // amber-200
            borderDark: 'rgba(245, 158, 11, 0.3)',
        },

        error: {
            DEFAULT: '#dc2626',      // red-600
            light: '#ef4444',        // red-500
            bg: '#fef2f2',          // red-50
            bgDark: 'rgba(239, 68, 68, 0.1)',
            border: '#fecaca',      // red-200
            borderDark: 'rgba(239, 68, 68, 0.3)',
        },

        info: {
            DEFAULT: '#2563eb',      // blue-600
            light: '#3b82f6',        // blue-500
            bg: '#eff6ff',          // blue-50
            bgDark: 'rgba(59, 130, 246, 0.1)',
            border: '#bfdbfe',      // blue-200
            borderDark: 'rgba(59, 130, 246, 0.3)',
        },

        // Neutral grays
        gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
        },

        // Surface colors
        surface: {
            light: '#ffffff',
            dark: '#1e1b26',
        },

        // Background colors
        background: {
            light: '#f9fafb',        // gray-50
            dark: '#0f0d15',
        },

        // Text colors
        text: {
            dark: '#111827',         // gray-900
            light: '#f9fafb',        // gray-50
            subtle: '#6b7280',       // gray-500
        },
    },

    // Transition durations
    transition: {
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
    },

    // Breakpoints (for reference)
    breakpoints: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },
};

export default tokens;
