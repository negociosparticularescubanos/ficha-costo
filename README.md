# Ficha de Costo · Consultoría y creación de negocios

Aplicación web profesional para servicios de consultoría y creación de
negocios en Cuba: trabajadores por cuenta propia (TCP), MIPYME, PDL y
demás actores económicos.

Un solo dato alimenta tres documentos:

1. **Ficha de costo** — servicios contratados, gastos directos y
   análisis interno (costo de horas, indirectos y margen real).
2. **Factura** — documento formal con los mismos datos, listo para
   imprimir o guardar en PDF.
3. **Informe para el cliente** — propuesta persuasiva que explica cada
   servicio paso a paso, con entregables y base normativa, para que el
   cliente entienda el trabajo que respalda el precio.

Basada en la doctrina de FactiCuba: secciones numeradas, lenguaje
claro, cada dato una sola vez y documento formal imprimible. Lo que
falta queda marcado como [A COMPLETAR]: nunca se inventa.

## Estructura (varios archivos, sin compilación)

```text
index.html    Estructura y pestañas (Ficha / Factura / Informe)
estilos.css   Diseño completo + estilos de impresión
datos.js      Catálogo de servicios, textos y cálculos (sin DOM)
app.js        Estado, pantalla, documentos y guardado local
README.md     Este archivo
HANDOFF-AI.md Traspaso del proyecto entre perfiles de Muse
```

No usa ningún framework ni servicio externo: abre `index.html` y
funciona. Los datos se guardan solo en el navegador (localStorage).

## Publicar en GitHub Pages

El repositorio ya está publicado en:

`https://negociosparticularescubanos.github.io/ficha-costo/`

Si lo vuelve a desplegar desde cero:

1. Suba los archivos a la rama `main` del repositorio.
2. En **Settings → Pages**, elija **Deploy from a branch**,
   rama `main` y carpeta `/ (root)`. Guarde.
3. En un minuto la página estará en la dirección de arriba.

## Uso

1. En **Ficha de costo**, complete los datos del encargo (emisor,
   cliente, forma de gestión, proyecto, número, fecha y validez).
2. Busque servicios en el catálogo y añádalos; cada uno trae su
   explicación paso a paso. Ajuste cantidades, precios y horas.
   Puede añadir líneas libres y gastos directos.
3. Revise el análisis interno: costo de la hora, indirectos,
   descuento y margen real del encargo (no sale en los documentos
   del cliente).
4. En **Factura**, ajuste forma de pago y notas, e imprima o guarde
   en PDF.
5. En **Informe**, revise la propuesta, edite el mensaje final y
   compártala con el cliente (impresa o en PDF).

## Editar el catálogo y los textos

Todo el contenido vive en `datos.js`:

- **Servicios:** lista `SERVICIOS`. Cada uno trae `nombre`,
  `categoria`, `unidad`, `precio`, `horas`, `resumen`, `pasos`,
  `entregables` y `base`. Para añadir uno, copie un objeto y
  cambie los textos. Los precios son bases editables.
- **Textos del informe:** `PORQUE` (por qué contratarnos),
  `PASOS_SIGUIENTES`, `TERMINOS_DEFECTO` y `NOTA_FINAL_DEFECTO`.
- **Actores económicos:** lista `ACTORES`.

Los cálculos (`calcularFicha`, `textoResumenEjecutivo`) son funciones
puras y se pueden probar con Node sin navegador: `datos.js` exporta
por CommonJS cuando existe `module`.

## Notas

- Importes en CUP (pesos cubanos).
- Todo el texto de la aplicación está en español.
- Sin cuentas, sin servidor y sin costo de licencia.
