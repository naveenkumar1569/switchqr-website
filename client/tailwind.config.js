/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#6b26d9",
                "primary-hover": "#5e1eb3",
                "primary-dark": "#5b1da8",
                "primary-50": "#f3e8ff",
                "primary-100": "#e9d5ff",
                "primary-200": "#d8b4fe",
                "primary-600": "#7e22ce",
                "secondary": "#8b5cf6",
                "success": "#10b981",
                "error": "#ef4444",
                "warning": "#f59e0b",
                "background-light": "#f7f6f8",
                "background-dark": "#171220",
                "surface-light": "#ffffff",
                "surface-dark": "#2d2438",
                "text-dark": "#140f1a",
                "text-light": "#f3f4f6",
                "text-subtle": "#6e5393",
                "border-light": "#e5e7eb",
                "border-dark": "#374151"
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"],
                "sans": ["Inter", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "2xl": "1rem",
                "full": "9999px"
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                'glow': '0 4px 20px -2px rgba(107, 38, 217, 0.25)',
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
