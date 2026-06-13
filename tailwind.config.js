/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        coal: 'var(--coal)',
        bone: 'var(--bone)',
        cream: 'var(--cream)',
        volt: 'var(--volt)',
        voltdim: 'var(--volt-dim)',
        coral: 'var(--coral)',
        smoke: 'var(--smoke)',
        ash: 'var(--ash)',
        red: 'var(--status-red)',
        amber: 'var(--status-amber)',
        green: 'var(--status-green)',
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        slab: '6px 6px 0 0 var(--ink)',
        slabvolt: '6px 6px 0 0 var(--volt)',
        lift: '0 10px 30px -12px rgba(0,0,0,0.45)',
      },
    },
  },
  plugins: [],
}
