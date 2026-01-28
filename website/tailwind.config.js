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
                "primary-dark": "#5b21b6",
                "primary-light": "#f2ebfc",
                "background-light": "#faf8fb",
                "background-dark": "#171220",
                "surface-light": "#ffffff",
                "surface-dark": "#231b2e",
                "text-main": "#130f1a",
                "text-muted": "#6b5393",
                "text-secondary": "#705393",
                "border-subtle": "#e2e8f0",
            },
            fontFamily: {
                "display": ["Manrope", "sans-serif"],
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "1rem",
                "xl": "1.5rem",
                "2xl": "2rem",
                "full": "9999px"
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(109, 40, 217, 0.05)',
                'card': '0 0 0 1px rgba(227, 222, 233, 0.6), 0 2px 8px rgba(0, 0, 0, 0.04)',
                'mockup': '0 25px 50px -12px rgba(109, 40, 217, 0.15)',
            }
        },
    },
    plugins: [],
}
