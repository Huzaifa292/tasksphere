/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#101426',
          indigo: '#171C35',
          violet: '#7867F7',
          violetHover: '#6553F5',
          softPurple: '#A99BFF',
          cyan: '#54C7E8',
          bg: '#F7F8FC',
          card: '#FFFFFF',
          text: '#24283B',
          muted: '#8990A5',
          border: '#E2E8F0',
          darkBorder: '#232946',
        },
        status: {
          backlog: '#8990A5',
          todo: '#3B82F6',
          inProgress: '#F59E0B',
          inReview: '#8B5CF6',
          done: '#10B981',
          cancelled: '#EF4444',
        },
        priority: {
          low: '#10B981',
          medium: '#3B82F6',
          high: '#F59E0B',
          critical: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
        heading: ['Manrope', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(16, 20, 38, 0.05), 0 1px 2px 0 rgba(16, 20, 38, 0.03)',
        'premium': '0 10px 30px -5px rgba(16, 20, 38, 0.08), 0 4px 6px -2px rgba(16, 20, 38, 0.03)',
        'glow-violet': '0 0 25px -5px rgba(120, 103, 247, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(84, 199, 232, 0.35)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.125rem',
      }
    },
  },
  plugins: [],
}
