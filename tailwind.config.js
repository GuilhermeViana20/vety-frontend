/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Azul bebê — cor primária (400 = #89CFF0)
        brand: {
          50: '#F2FAFE',
          100: '#E1F3FC',
          200: '#C5E8F8',
          300: '#A9DDF4',
          400: '#89CFF0',
          500: '#62B9E3',
          600: '#3F9ECE',
          700: '#2C7CA9',
          800: '#256586',
          900: '#20526C',
        },
        // Verde menta — cor de sucesso
        mint: {
          50: '#F1FBF7',
          100: '#DDF6EC',
          200: '#BDEBD8',
          300: '#97DDC1',
          400: '#6FCBA7',
          500: '#4DB88F',
          600: '#37997A',
          700: '#2C7A62',
        },
        // Cinza chumbo suave — texto e bordas (700 = #4A5568, 50 = fundo gelo #F7F9FC)
        ink: {
          50: '#F7F9FC',
          100: '#EDF1F7',
          200: '#E2E8F0',
          300: '#CBD5E0',
          400: '#A0AEC0',
          500: '#718096',
          600: '#5C6779',
          700: '#4A5568',
          800: '#3B4556',
          900: '#2D3748',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(74,85,104,.05), 0 4px 16px rgba(74,85,104,.07)',
        pop: '0 8px 30px rgba(74,85,104,.14)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
