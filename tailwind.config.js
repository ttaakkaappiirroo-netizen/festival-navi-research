/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563eb',
          indigo: '#4f46e5',
          purple: '#7c3aed',
          orange: '#f97316',
          amber: '#f59e0b',
        },
        ink: {
          DEFAULT: '#1e293b',
          soft: '#475569',
          faint: '#94a3b8',
        },
      },
      fontFamily: {
        sans: [
          '"Zen Kaku Gothic New"',
          '"Hiragino Kaku Gothic ProN"',
          '"Noto Sans JP"',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 4px 24px -8px rgba(30, 41, 59, 0.12)',
        'card-hover': '0 12px 40px -12px rgba(30, 41, 59, 0.22)',
        glow: '0 8px 40px -8px rgba(124, 58, 237, 0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      backgroundImage: {
        'brand-gradient':
          'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #f97316 100%)',
        'brand-soft':
          'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(124,58,237,0.08) 50%, rgba(249,115,22,0.08) 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
