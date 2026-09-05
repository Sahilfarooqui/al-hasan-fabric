import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          deep: '#0B3D2E',
          DEFAULT: '#0F5C45',
          light: '#1A7A5C',
          muted: '#E8F5F0',
        },
        gold: {
          DEFAULT: '#C9A227',
          light: '#E8D48B',
          dark: '#A68520',
        },
        cream: {
          DEFAULT: '#FBF7F0',
          dark: '#F3EDE2',
          ivory: '#FFFEF9',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px rgba(11, 61, 46, 0.08)',
        card: '0 2px 16px rgba(11, 61, 46, 0.06)',
      },
    },
  },
  plugins: [],
};
export default config;
