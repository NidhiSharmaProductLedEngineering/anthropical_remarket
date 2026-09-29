/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif:  ['"Playfair Display"', 'Georgia', 'serif'],
        sans:   ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        cream:    '#F8F4EC',
        terra:    '#B8925A',
        'terra-light': '#EFE5D2',
        'terra-dark':  '#8E6F3E',
        brown:    '#16110D',
        'brown-mid': '#1E1712',
        muted:    '#7A6B5C',
        sage:     '#B8925A',
      },
    },
  },
  plugins: [],
}
