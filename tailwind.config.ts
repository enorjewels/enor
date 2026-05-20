/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // En or brand palette — locked
        cream:     '#FAF7F2',
        parchment: '#F5EDE8',
        blush:     '#D4A090',
        rose:      '#B85A6A',
        burgundy:  '#7D2035',
        noir:      '#1A0A0D',
        berry:     '#9E7A82',
        bordeaux:  '#2A1218',
        abyss:     '#0F0608',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Times New Roman"', 'serif'],
        sans:  ['"Jost"', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        light:   '300',
        regular: '400',
      },
      fontSize: {
        // Display scale
        'display-2xl': ['clamp(80px,14vw,220px)', { lineHeight: '0.86', letterSpacing: '-0.04em' }],
        'display-xl':  ['clamp(48px,8vw,120px)',  { lineHeight: '0.9',  letterSpacing: '-0.03em' }],
        'display-lg':  ['clamp(36px,5vw,72px)',   { lineHeight: '1.0',  letterSpacing: '-0.02em' }],
        'display-md':  ['42px',                   { lineHeight: '1.1',  letterSpacing: '-0.01em' }],
        'display-sm':  ['32px',                   { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        // UI scale
        'ui-xs':  ['10px', { lineHeight: '1.4', letterSpacing: '0.18em' }],
        'ui-sm':  ['11px', { lineHeight: '1.4', letterSpacing: '0.14em' }],
        'ui-md':  ['12px', { lineHeight: '1.4', letterSpacing: '0.10em' }],
        'ui-lg':  ['13px', { lineHeight: '1.5', letterSpacing: '0.08em' }],
      },
      spacing: {
        nav: '72px',
      },
      backdropBlur: {
        nav: '18px',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      keyframes: {
        pulse: {
          '0%':   { boxShadow: '0 0 0 0 rgba(125,32,53,0.6)' },
          '70%':  { boxShadow: '0 0 0 12px transparent' },
          '100%': { boxShadow: '0 0 0 0 transparent' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drawerIn: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        pulse:    'pulse 2s infinite',
        marquee:  'marquee 28s linear infinite',
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.2,0.7,0.2,1) forwards',
        'drawer-in': 'drawerIn 0.4s cubic-bezier(0.2,0.7,0.2,1) forwards',
      },
    },
  },
  plugins: [],
};

export default config;
