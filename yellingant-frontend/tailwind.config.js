module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
  ],
  safelist: ['font-pangolin'],
  theme: {
    fontFamily: {
      sans: ['Pangolin', 'cursive'],
      pangolin: ['Pangolin', 'cursive'],
      helvetica: ['Helvetica', 'Arial', 'sans-serif'],
      gotham: ['Gotham', 'Arial', 'sans-serif'],
      serif: ['ui-serif', 'Georgia'],
      mono: ['ui-monospace', 'SFMono-Regular'],
    },
    extend: {},
  },
  plugins: [],
};
