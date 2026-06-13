// @ts-check
// ↑ Activa el chequeo de tipos de TypeScript dentro de este archivo .js, para
//   que el editor te avise si pasas una opción mal escrita a defineConfig.

import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Este es el archivo de configuración global de Astro. Astro lo lee al arrancar
// (tanto en `npm run dev` como en `npm run build`).
//
// `defineConfig` no "hace" nada en tiempo de ejecución: es solo una función
// identidad que existe para que el editor te dé autocompletado y tipos sobre el
// objeto de configuración. Podrías exportar el objeto pelado, pero así es más cómodo.
//
// https://astro.build/config
export default defineConfig({
  // Astro usa Vite por debajo como empaquetador (el que junta y optimiza el JS
  // y el CSS). Aquí le añadimos el plugin oficial de Tailwind v4: gracias a él,
  // cuando importamos `global.css` (que empieza con `@import 'tailwindcss'`),
  // Tailwind escanea nuestras clases y genera el CSS necesario.
  //
  // En Tailwind v4 ya no hace falta un `tailwind.config.js`: toda la config vive
  // en el propio CSS (ver el bloque @theme en src/styles/global.css).
  vite: {
    plugins: [tailwindcss()],
  },
});
