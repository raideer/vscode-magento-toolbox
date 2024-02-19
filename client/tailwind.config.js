/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/webview/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('@githubocto/tailwind-vscode')],
};
