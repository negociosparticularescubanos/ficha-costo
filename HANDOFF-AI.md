# HANDOFF-AI — Ficha de Costo · Consultoría

> ORDEN PERMANENTE DE LEONARDO: cada cambio en este proyecto deja este
> handoff actualizado, para que su otro perfil de Muse sepa lo que se
> hizo. El otro perfil debe hacer siempre lo mismo: dejar un handoff
> por cada cambio, hasta que Leonardo encuentre la manera de que ambos
> perfiles se comuniquen entre sí. Los perfiles no pueden hablar
> directamente; el handoff es el puente.

## Qué es

Aplicación web (varios archivos, sin compilación) para servicios de
consultoría y creación de negocios en Cuba: TCP, MIPYME, PDL y demás
actores económicos. Un solo dato alimenta tres documentos: ficha de
costo (con análisis interno), factura e informe persuasivo para el
cliente. Basada en la doctrina UX de FactiCuba (secciones numeradas,
lenguaje claro, cada dato una sola vez, documento formal imprimible,
[A COMPLETAR] cuando falta un dato: nunca se inventa).

## Archivos

- `index.html` — estructura y pestañas (Ficha / Factura / Informe).
- `estilos.css` — diseño completo + impresión (solo el documento activo).
- `datos.js` — catálogo de 23 servicios, textos del informe y cálculos
  puros (exporta por CommonJS para pruebas en Node).
- `app.js` — estado único, pantalla, documentos y guardado local.
- `login.js` — acceso local, réplica del login de FactiCuba-Datos
  (solo usuario admin; contraseña guardada en el equipo; sesión en
  localStorage; cambio de contraseña en el equipo).
- `README.md` — descripción, despliegue y cómo editar el catálogo.

## Estado

- 2026-11-15: primera versión creada por el perfil nuevo de Muse
  (Mailen) por orden de Leonardo, y publicada en GitHub Pages en
  `https://negociosparticularescubanos.github.io/ficha-costo/`.
  Catálogo de 23 servicios en 5 categorías, con pasos, entregables y
  base normativa. Precios base editables en CUP.
- 2026-11-15 (noche): login añadido por orden de Leonardo, réplica
  del de FactiCuba-Datos: solo usuario admin, contraseña guardada en
  el equipo (la primera vez queda fijada), sesión en localStorage,
  botones Salir y Contraseña en el encabezado. La contraseña no está
  escrita en el código: vive solo en cada equipo, igual que en las
  demás páginas.
- 2026-11-15 (noche): bases normativas actualizadas al marco
  vigente por orden de Leonardo («usa la ley más nueva», la misma
  orden que para la plantilla Plan EDM). La página ya citaba el
  Decreto 174/2026 y no tenía citas derogadas; el cambio nombra
  la Resolución 70/2026 del MEP (guías metodológicas vigentes)
  en 4 bases y en un texto del informe, y añade la Resolución
  118/2026 del BCC (cuando aplica a PDL) a la base del
  expediente de crédito. Precios, pasos y entregables intactos.
  `datos.js` subió a ?v=3 para forzar la copia fresca.
- Reglas del proyecto: todo en español; importes en CUP; nada se
  publica sin la autorización expresa de Leonardo; GitHub es la
  fuente de verdad (leer la versión en GitHub antes de publicar);
  verificar en vivo todo resultado antes de darlo por terminado.
