/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#d4af37',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)'],
        cormorant: ['var(--font-cormorant)'],
        montserrat: ['var(--font-montserrat)'],
      },
    },
  },
  plugins: [],
};
