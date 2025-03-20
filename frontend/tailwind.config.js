/** @type {import('tailwindcss').Config} */
export default {
  content: ["./*.html", "./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        'gaming': ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        'neon': {
          blue: '#00f3ff',
          purple: '#ff00ff',
          green: '#39ff14',
        },
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          'from': { textShadow: '0 0 10px #00f3ff, 0 0 20px #00f3ff, 0 0 30px #00f3ff' },
          'to': { textShadow: '0 0 20px #00f3ff, 0 0 30px #00f3ff, 0 0 40px #00f3ff' },
        },
      },
    },
  },
  plugins: [],
}