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
- `README.md` — descripción, despliegue y cómo editar el catálogo.

## Estado

- 2026-11-15: primera versión creada por el perfil nuevo de Muse
  (Mailen) por orden de Leonardo, y publicada en GitHub Pages en
  `https://negociosparticularescubanos.github.io/ficha-costo/`.
  Catálogo de 23 servicios en 5 categorías, con pasos, entregables y
  base normativa. Precios base editables en CUP.
- Reglas del proyecto: todo en español; importes en CUP; nada se
  publica sin la autorización expresa de Leonardo; GitHub es la
  fuente de verdad (leer la versión en GitHub antes de publicar);
  verificar en vivo todo resultado antes de darlo por terminado.
