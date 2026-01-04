/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",  // Agrega ,css para escanear archivos CSS
  ],
  theme: {
    extend: {
      colors: {
        'mc-red': '#d93b3a',      // Rojo principal (carrocería de McQueen)
        'mc-orange': '#eb793d',    // Naranja (rayos y detalles energéticos)
        'mc-light-blue': '#c5e4e6',// Azul claro (fondo limpio, como cielo en Cars)
        'mc-gray': '#756a7a',      // Gris púrpura (para borders y textos secundarios)
        'mc-dark': '#2b2622',      // Negro oscuro (para acentos y textos principales)
      },
      fontFamily:{
        momo: ['Momo Trust Display']
      }
    },
  },
  plugins: [],
}

