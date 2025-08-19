/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'caete': {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        'brazil': {
          green: '#009c3b',
          yellow: '#ffdf00',
          blue: '#002776',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-custom': 'pulse 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'bounce-custom': 'bounce 1s ease-in-out',
        'card-flip': 'card-flip 0.6s ease-in-out',
        'summon': 'summon 1s ease-out',
        'attack': 'attack 0.8s ease-in-out',
        'damage': 'damage 0.3s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'card-flip': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        summon: {
          '0%': { 
            transform: 'scale(0) rotate(180deg)',
            opacity: '0'
          },
          '50%': { 
            transform: 'scale(1.2) rotate(90deg)',
            opacity: '0.8'
          },
          '100%': { 
            transform: 'scale(1) rotate(0deg)',
            opacity: '1'
          },
        },
        attack: {
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-20px)' },
          '75%': { transform: 'translateX(20px)' },
          '100%': { transform: 'translateX(0)' },
        },
        damage: {
          '0%': { 
            transform: 'scale(1)',
            filter: 'brightness(1)'
          },
          '50%': { 
            transform: 'scale(1.1)',
            filter: 'brightness(1.5) saturate(2)'
          },
          '100%': { 
            transform: 'scale(1)',
            filter: 'brightness(1)'
          },
        },
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
        '4xl': '1920px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255, 215, 0, 0.5)',
        'glow-lg': '0 0 40px rgba(255, 215, 0, 0.7)',
        'inner-glow': 'inset 0 0 20px rgba(255, 215, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'brazil-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffd700\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}