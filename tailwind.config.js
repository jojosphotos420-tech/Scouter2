/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      colors: {
        ink: '#0a0a0a',
        fog: '#f0ede8',
        mist: '#d4cfc8',
        slate: '#8a8580',
        amber: {
          scout: '#e8a020',
          glow: '#f5c842',
        },
        terrain: '#1a1814',
      },
      boxShadow: {
        panel: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.4)',
        card: '0 2px 8px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
        pin: '0 4px 20px rgba(232,160,32,0.4)',
      },
    },
  },
  plugins: [],
}
