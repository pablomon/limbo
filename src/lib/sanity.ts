// ─────────────────────────────────────────────────────────────────────────────
// Cliente de Sanity (el CMS / gestor de contenidos)
//
// Sanity es donde, en el futuro, el cliente editará textos e imágenes sin tocar
// código. Este archivo prepara la "conexión" con Sanity. De momento las páginas
// tienen el contenido escrito a mano (hardcoded), así que este módulo todavía no
// se usa, pero queda listo para cuando se conecte.
//
// Vive en src/lib/ porque NO es ni una página ni un componente visual: es código
// de apoyo reutilizable. La convención es meter en `lib/` la lógica compartida.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// `import.meta.env` es la forma de Astro/Vite de leer variables de entorno
// (las que pones en el archivo .env). El prefijo PUBLIC_ es importante:
//   - PUBLIC_*  → Astro permite que la variable llegue al navegador.
//   - sin PUBLIC_ → solo existe en build (servidor), nunca se filtra al cliente.
// El ID del proyecto Sanity no es secreto, así que va con PUBLIC_.
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;

// Validación temprana: si falta el ID o tiene caracteres raros, paramos el build
// con un error claro en vez de fallar más tarde de forma confusa.
if (!projectId || !/^[a-z0-9-]+$/.test(projectId)) {
  throw new Error(
    "Missing or invalid PUBLIC_SANITY_PROJECT_ID. Copy .env.example to .env and set your Sanity project ID."
  );
}

// `export` hace que `sanityClient` se pueda importar desde otros archivos.
// Es el objeto con el que pediríamos datos a Sanity (consultas GROQ).
export const sanityClient = createClient({
  projectId,
  // El operador `??` ("nullish coalescing") da un valor por defecto: si la
  // variable del dataset no está definida, usa "production".
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  // useCdn: en producción (PROD) usamos la CDN de Sanity (más rápida, cacheada);
  // en desarrollo no, para ver los cambios de contenido al instante.
  // import.meta.env.PROD es `true` durante `build`, `false` durante `dev`.
  useCdn: import.meta.env.PROD,
});

// Sanity guarda las imágenes como referencias, no como URLs. Este "builder"
// convierte esas referencias en URLs reales, y además permite pedir la imagen
// redimensionada al vuelo. Ejemplo de uso futuro en una página:
//     urlFor(imagen).width(800).url()
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
