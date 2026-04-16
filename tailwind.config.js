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
        cream:    '#F5F0EA',
        terra:    '#C4663A',
        'terra-light': '#F5DDD3',
        'terra-dark':  '#A34E28',
        brown:    '#2C1A0E',
        'brown-mid': '#3D2510',
        muted:    '#7A6055',
        sage:     '#4E7A5E',
      },
    },
  },
  plugins: [],
}
