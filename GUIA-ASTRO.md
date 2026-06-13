# Guía del proyecto (para aprender Astro)

> Documento de aprendizaje. Cuando ya domines el proyecto, puedes borrar este
> archivo y los comentarios extensos del código.

## 1. Qué es Astro y por qué encaja aquí

Astro es un **generador de sitios estáticos** (SSG): coge tus componentes y, en
el momento del `build`, los convierte en archivos **HTML, CSS y JS planos** que
se suben a un servidor. La web de Limbo no tiene "servidor vivo" respondiendo a
cada visita: es una carpeta de archivos `.html` ya cocinados.

La idea central de Astro es **"cero JavaScript por defecto"**. A diferencia de
React o Vue —donde el navegador descarga el framework y reconstruye la página—,
Astro manda HTML puro. El JavaScript solo aparece donde tú lo pides
explícitamente (los `<script>` del slider, del menú, etc.). Por eso una landing
como esta carga muy rápido.

Esto define una frontera mental que conviene tener clarísima y que repetiré por
todo el código:

- **Tiempo de build (servidor / Node):** lo que está en el *frontmatter* de los
  `.astro` (entre las `---`). Se ejecuta UNA vez, en tu máquina o en Vercel, al
  generar el sitio. Aquí lees datos, llamas a APIs, haces bucles que generan
  HTML. El usuario nunca ve este código.
- **Tiempo de cliente (navegador):** lo que está dentro de `<script>`. Se
  ejecuta en el navegador de cada visitante. Aquí va la interactividad: arrastrar
  el slider, abrir el menú, el visor de fotos.

Si confundes las dos, te llevas sustos del tipo "¿por qué `document` no existe
en el frontmatter?" (porque en build no hay navegador) o "¿por qué mi `fetch` en
el `<script>` se ejecuta en cada visita?" (porque el navegador sí está vivo).

## 2. Estructura de carpetas

```
limbo/
├── astro.config.mjs      Configuración de Astro (aquí enchufamos Tailwind)
├── package.json          Dependencias y comandos (npm run dev / build)
├── tsconfig.json         Config de TypeScript (Astro trae tipos)
│
├── public/               Archivos servidos TAL CUAL, sin procesar.
│   ├── favicon.svg         Una imagen en /public/images/x.png se sirve en
│   └── images/             la URL  /images/x.png  (sin el "public").
│       ├── variedades/   botellas e ilustraciones de la home
│       ├── convocatoria/ obras por año
│       ├── feed/         fotos de reserva del feed de Instagram
│       ├── maestros/, agaves/, proceso/, fotos/  …
│       └── logo-*.png, mexico-dkt.png, whatsapp.png
│
└── src/                  El código que Astro SÍ procesa.
    ├── pages/            ★ RUTAS. Cada archivo = una URL.
    │   ├── index.astro       →  /
    │   ├── nosotros.astro     →  /nosotros
    │   ├── mezcales.astro     →  /mezcales
    │   ├── proceso.astro      →  /proceso
    │   ├── convocatoria.astro →  /convocatoria
    │   └── compra.astro       →  /compra
    │
    ├── layouts/          Plantillas que envuelven páginas (cabecera + pie).
    │   └── Layout.astro      El "marco" común a todas las páginas.
    │
    ├── components/       Piezas reutilizables (no son rutas).
    │   ├── Header.astro      Navegación + logo + menú móvil
    │   ├── Footer.astro      Pie con logo y enlaces
    │   ├── InstaFeed.astro   Rejilla del feed de Instagram
    │   └── FotoSlider.astro  Carrusel automático de fotos
    │
    ├── layouts + components + pages  → todos son archivos .astro
    │
    ├── styles/
    │   └── global.css       Tailwind + tokens de color/tipografía del diseño
    │
    └── lib/
        └── sanity.ts       Cliente del CMS Sanity (de momento sin usar en las
                            páginas; preparado para cuando se conecte el CMS)
```

**La regla de oro de Astro: el enrutado es por carpetas.** No hay que registrar
rutas en ningún sitio. Creas `src/pages/contacto.astro` y automáticamente existe
la URL `/contacto`. Esto se llama *file-based routing*.

## 3. Anatomía de un archivo `.astro`

Un componente Astro tiene dos zonas:

```astro
---
// 1. FRONTMATTER (component script). JavaScript/TypeScript que corre en BUILD.
//    Aquí declaras variables, importas componentes, lees datos.
const titulo = "Hola";
---

<!-- 2. PLANTILLA (template). Es HTML, pero puedes meter {expresiones} de JS. -->
<h1>{titulo}</h1>
```

Las `---` se llaman "code fences" (vallas de código). Lo de arriba es lógica;
lo de abajo es marcado. Para poner un valor de JS en el HTML usas llaves: `{ }`.

### Conceptos que verás repetidos en el código

| Sintaxis | Qué hace |
|---|---|
| `const { x } = Astro.props` | Lee las props que le pasa quien usa el componente |
| `<slot />` | Hueco donde se inyecta el contenido hijo (solo en layouts/componentes) |
| `{lista.map((x) => <li>{x}</li>)}` | Genera HTML repetido a partir de un array |
| `{condicion && <p>…</p>}` | Renderiza algo solo si la condición es cierta |
| `class:list={[...]}` | Helper de Astro para construir clases CSS condicionales |
| `import.meta.env.MI_VAR` | Lee una variable de entorno (.env) |
| `<script>` | JS que se manda al NAVEGADOR (no corre en build) |

## 4. El flujo de una página, de principio a fin

Tomemos `/mezcales` como ejemplo:

1. `src/pages/mezcales.astro` define los datos (maestros, agaves, textos) en su
   frontmatter — esto corre en build.
2. Importa y usa `<Layout title="…">…</Layout>`. El Layout aporta el `<html>`,
   `<head>`, el `<Header>` y el `<Footer>`. El contenido de la página entra por
   el `<slot />` del Layout.
3. Astro renderiza todo a un `dist/mezcales/index.html` estático.
4. Cualquier `<script>` de la página o de sus componentes se empaqueta aparte y
   se enlaza desde ese HTML, para correr en el navegador.

## 5. Tailwind CSS (cómo se aplican los estilos)

No escribimos casi CSS a mano: usamos **clases utilitarias** de Tailwind
directamente en el HTML (`flex`, `px-6`, `text-lg`, `bg-sage`…). Cada clase es
una propiedad CSS. Tailwind v4 se configura en `src/styles/global.css` con el
bloque `@theme`, donde definimos los colores y tipografías del diseño como
"tokens". Al declarar `--color-sage`, Tailwind genera automáticamente las clases
`bg-sage`, `text-sage`, `border-sage`, etc.

Prefijos responsive que verás por todas partes:
- sin prefijo → aplica a TODOS los tamaños (móvil incluido). Tailwind es
  *mobile-first*: lo base es el móvil.
- `sm:` → desde 640px, `md:` → desde 768px, `lg:` → desde 1024px.
- `max-md:` → SOLO por debajo de 768px (lo contrario de `md:`).

Ejemplo real del proyecto: `class="h-32 sm:h-40"` significa "altura 8rem en
móvil, y a partir de 640px, 10rem".

## 6. Comandos

```bash
nvm use 22       # este proyecto necesita Node 22 (hay un .nvmrc)
npm run dev      # servidor de desarrollo con recarga en caliente (localhost:4321)
npm run build    # genera el sitio estático en dist/
npm run preview  # sirve dist/ para ver el resultado final del build
```

## 7. Por dónde seguir leyendo

Orden recomendado para entender el código, de lo simple a lo complejo:

1. `src/pages/compra.astro` — la página más simple, para ver el patrón Layout.
2. `src/layouts/Layout.astro` — props, slot, el "marco" común.
3. `src/components/Footer.astro` y `Header.astro` — props + listas + script.
4. `src/pages/index.astro` — datos en frontmatter y `.map()` para el grid.
5. `src/components/InstaFeed.astro` — un `fetch` en build con plan B.
6. `src/components/FotoSlider.astro` y `convocatoria.astro` — los `<script>`
   de cliente más elaborados (animación, arrastre, bucle infinito).
