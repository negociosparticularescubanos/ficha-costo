/* ============================================================================
   Ficha de Costo · Consultoría — datos y lógica pura (sin acceso al DOM).
   Catálogo de servicios de consultoría y creación de negocios en Cuba:
   TCP, MIPYME, PDL y demás actores económicos (Decreto 174/2026).
   Marco normativo vigente citado en las bases: Decreto 174/2026,
   Resolución 70/2026 del MEP (guías metodológicas), Resolución
   202/2026 del MFP, Resolución 118/2026 del BCC, Ley 148/2022 y
   Ley 181/2025. El Decreto 33/2021 y la Resolución 29/2021
   quedaron derogados (Gaceta Oficial No. 87 de 2026) y no se citan.
   Los precios son BASES EDITABLES: ajústelos a sus tarifas reales.
   Se puede probar en Node: este archivo exporta por CommonJS si existe
   `module`, y en el navegador expone las mismas variables globales.
   ============================================================================ */
(function (raiz) {
'use strict';

/* ---------- Actores económicos (mismos de FactiCuba) ---------- */
const ACTORES = [
  { id: 'tcp', nombre: 'Trabajador por cuenta propia (TCP)' },
  { id: 'mipyme_priv', nombre: 'MIPYME privada' },
  { id: 'mipyme_est', nombre: 'MIPYME estatal' },
  { id: 'cna', nombre: 'Cooperativa no agropecuaria (CNA)' },
  { id: 'cpa_ccs', nombre: 'Cooperativa agropecuaria (CPA / CCS)' },
  { id: 'estatal', nombre: 'Entidad estatal' },
  { id: 'pdl', nombre: 'Proyecto de Desarrollo Local (PDL)' },
  { id: 'otro', nombre: 'Otro actor económico' }
];

const CATEGORIAS = [
  { id: 'estudios', nombre: 'Estudios y proyectos' },
  { id: 'formaliza', nombre: 'Creación y formalización' },
  { id: 'finanzas', nombre: 'Finanzas y banca' },
  { id: 'gestion', nombre: 'Gestión y estrategia' },
  { id: 'digital', nombre: 'Soluciones digitales' },
  { id: 'marca', nombre: 'Marca y comunicación' },
  { id: 'eventos', nombre: 'Eventos y contactos' },
  { id: 'micro', nombre: 'Micro-servicios' },
  { id: 'legal', nombre: 'Apoyo legal' }
];

/* ---------- Líneas y programas de la EDM (semilla: Ciénaga de Zapata
   2026-2030, tomada de los acápites 5 y 6 de la Estrategia). El encargo
   declara a qué línea y programa responde; el informe muestra la
   alineación. Para otro municipio, estas listas se cambian aquí. ---------- */
const LINEAS_EDM = [
  { id: 'l1', nombre: 'Línea 1 · Producción de Alimentos' },
  { id: 'l2', nombre: 'Línea 2 · Conservación y uso sostenible de la Biodiversidad' },
  { id: 'l3', nombre: 'Línea 3 · Formación y gestión de capacidades para el desarrollo local' },
  { id: 'l4', nombre: 'Línea 4 · Energía Renovable' },
  { id: 'l5', nombre: 'Línea 5 · Exportaciones, cooperación internacional e inversión extranjera' },
  { id: 'l6', nombre: 'Línea 6 · Bienestar y Hábitat' }
];
const PROGRAMAS_EDM = [
  { id: 'p1', nombre: 'Educación Ambiental' },
  { id: 'p2', nombre: 'Desarrollo de la Responsabilidad Social «Rafael María de Mendive»' },
  { id: 'p3', nombre: 'Desarrollo de la Responsabilidad Social para el manejo de los desechos sólidos' },
  { id: 'p4', nombre: 'Desarrollo de la Economía Social y Solidaria «Viva mi Barrio»' },
  { id: 'p5', nombre: 'Desarrollo del Turismo Local Sostenible' },
  { id: 'p6', nombre: 'Desarrollo de la producción de alimentos sanos' },
  { id: 'p7', nombre: 'Desarrollo de fuentes renovables de energía' },
  { id: 'p8', nombre: 'Manejo sostenible del APRM' },
  { id: 'p9', nombre: 'Fomento de exportaciones, cooperación internacional e inversión extranjera' }
];

/* ---------- Catálogo de servicios ----------
   Cada servicio trae: resumen, pasos (qué se hace, en orden),
   entregables (qué recibe el cliente) y base (norma o método).
   `horas` = horas profesionales estimadas (para el análisis interno). */
const SERVICIOS = [
  { id: 'est-factibilidad', categoria: 'estudios', nombre: 'Estudio de factibilidad técnico-económica',
    unidad: 'proyecto', precio: 48000, horas: 40,
    resumen: 'Estudio completo en 7 capítulos que demuestra si el negocio es viable y qué cambiar si no lo es, listo para el gobierno municipal y el banco.',
    pasos: [
      'Reunión de levantamiento: objetivos, inversión disponible, capacidad, precios y datos del territorio y del actor económico.',
      'Estudio de mercado con datos reales: demanda, oferta y competencia en el municipio, con cifras de la ONEI y de la Estrategia de Desarrollo Municipal.',
      'Estudio técnico: tamaño, localización, proceso productivo o de servicio, equipamiento, insumos, energía y cronograma de ejecución.',
      'Estudio organizacional, legal y ambiental: plantilla, permisos requeridos y medidas de mitigación según el CITMA.',
      'Estudio económico-financiero: inversión total, financiamiento, ingresos y costos proyectados, estado de resultados y flujo de caja.',
      'Evaluación financiera: VAN, TIR, período de recuperación, relación beneficio-costo y punto de equilibrio, con análisis de sensibilidad en tres escenarios y matriz de riesgos.',
      'Dictamen final y recomendaciones: factible, factible con condiciones o no factible, con el plan concreto de qué cambiar.'
    ],
    entregables: ['Documento del estudio en 7 capítulos, listo para presentar', 'Dictamen de viabilidad con indicadores VAN, TIR, PRI y B/C', 'Plan de mejora con los cambios exactos si el resultado no es favorable'],
    base: 'Decreto 174/2026; Resolución 70/2026 del MEP (guías metodológicas vigentes); Resolución Conjunta 1/2022 MINCEX-MEP; Decreto 327/2014.' },
  { id: 'exp-pdl', categoria: 'estudios', nombre: 'Expediente de Proyecto de Desarrollo Local (PDL)',
    unidad: 'proyecto', precio: 38000, horas: 32,
    resumen: 'Expediente oficial completo del PDL, con sus 16 secciones y la Ficha Única, armado para su aprobación por el Consejo de la Administración Municipal.',
    pasos: [
      'Diagnóstico del territorio y del proyecto: alineación con la Estrategia de Desarrollo Municipal y con las líneas estratégicas vigentes.',
      'Redacción de las 16 secciones oficiales del estudio: titulares, diagnóstico, objetivos, metas, cronograma, empleos, financiamiento, viabilidad e impacto social y ambiental.',
      'Estructura de financiamiento con las 14 fuentes del artículo 43.1 del Decreto 174/2026, incluido el Fondo de Fideicomiso cuando aplica.',
      'Elaboración de la Ficha Única de evaluación y revisión contra la Metodología de Evaluación v4.0.',
      'Revisión conjunta con el cliente y ajustes hasta dejar el expediente cerrado, sin vacíos ni datos sueltos.',
      'Preparación de la presentación: resumen para la defensa ante el CAM y respuestas a las observaciones habituales.'
    ],
    entregables: ['Expediente del PDL en 16 secciones, listo para presentar', 'Ficha Única de evaluación (art. 40)', 'Resumen de defensa ante el CAM'],
    base: 'Decreto 174/2026, arts. 26.2, 40 y 43.1; Metodología de Evaluación de la EDM y los PDL v4.0.' },
  { id: 'plan-negocio', categoria: 'estudios', nombre: 'Plan de negocio y modelo de negocio',
    unidad: 'proyecto', precio: 25000, horas: 20,
    resumen: 'Plan de negocio claro y usable: qué se vende, a quién, cómo se gana dinero y qué hace falta para arrancar, con metas y responsables.',
    pasos: [
      'Taller de definición: propuesta de valor, clientes, canales de venta y fuentes de ingreso.',
      'Análisis del entorno y de la competencia en el territorio.',
      'Modelo de ingresos y costos: precios desde la ficha de costo, punto de equilibrio y metas de venta.',
      'Plan de acción por etapas con responsables, fechas e indicadores de seguimiento.',
      'Revisión final con el cliente y entrega del documento en lenguaje sencillo, listo para explicar con sus propias palabras.'
    ],
    entregables: ['Documento del plan de negocio', 'Modelo de ingresos y costos con punto de equilibrio', 'Plan de acción con metas y responsables'],
    base: 'Metodología del consultor: estructura de proyecto usada en Cuba (resumen, estrategia, resultados, recursos, seguimiento).' },
  { id: 'est-mercado', categoria: 'estudios', nombre: 'Estudio de mercado territorial',
    unidad: 'estudio', precio: 18000, horas: 16,
    resumen: 'Radiografía de la demanda real del municipio: quién compra, cuánto, a qué precio y qué hueco deja la competencia.',
    pasos: [
      'Recogida de datos oficiales: población, empleo, visitantes y producción, desde la ONEI y la EDM del municipio.',
      'Mapeo de la oferta existente: competidores directos e indirectos, precios y saturación del mercado local.',
      'Estimación de la demanda insatisfecha y segmentación: población, turismo, sector estatal y exportación.',
      'Lectura de tendencias y del contexto: qué está cambiando en el sector y en el país y cómo afecta al mercado local.',
      'Estrategia de precios y canales de comercialización recomendados, con la ficha de costo como base.',
      'Informe final con conclusiones y recomendaciones de entrada al mercado.'
    ],
    entregables: ['Informe del estudio de mercado con datos citados', 'Cálculo de demanda insatisfecha por segmento', 'Recomendación de precios y canales', 'Apartado de tendencias y contexto dentro del informe.'],
    base: 'Fuentes obligatorias: ONEI (anuarios nacional y territorial) y Estrategia de Desarrollo Municipal.' },
  { id: 'eval-v4', categoria: 'estudios', nombre: 'Evaluación con Metodología v4.0 y Ficha Única',
    unidad: 'evaluación', precio: 15000, horas: 12,
    resumen: 'Evaluación formal del proyecto o de la estrategia con la Metodología de Evaluación v4.0, con puntajes, brechas y plan de mejora.',
    pasos: [
      'Recogida de la información del proyecto y de sus indicadores.',
      'Aplicación de los criterios de la Metodología v4.0, dimensión por dimensión.',
      'Cálculo de puntajes y construcción de la Ficha Única de evaluación.',
      'Identificación de brechas y redacción del plan de mejora con acciones, responsables y plazos.',
      'Entrega y explicación de los resultados en lenguaje sencillo.'
    ],
    entregables: ['Ficha Única de evaluación completada', 'Informe de brechas y puntajes', 'Plan de mejora priorizado'],
    base: 'Metodología de Evaluación de la Estrategia de Desarrollo Municipal y los PDL v4.0.' },
  { id: 'perfil-proyecto', categoria: 'estudios', nombre: 'Perfil de proyecto (idea de negocio)',
    unidad: 'perfil', precio: 8000, horas: 8,
    resumen: 'Documento breve que ordena la idea: qué es, cuánto hace falta, qué puede dejar y si vale la pena seguir adelante.',
    pasos: [
      'Entrevista para ordenar la idea: producto o servicio, clientes y recursos disponibles.',
      'Estimación inicial de inversión, costos e ingresos con supuestos explícitos.',
      'Primera lectura de viabilidad: puntos fuertes, riesgos visibles y pasos siguientes.',
      'Documento breve listo para decidir y, si aplica, encargar el estudio completo.'
    ],
    entregables: ['Documento del perfil de proyecto', 'Estimación inicial con supuestos declarados', 'Recomendación de pasos siguientes'],
    base: 'Estructura de proyecto usada en Cuba; supuestos siempre explícitos, nunca inventados.' },
  { id: 'crea-tcp', categoria: 'formaliza', nombre: 'Creación de TCP (trámites completos)',
    unidad: 'trámite', precio: 12000, horas: 10,
    resumen: 'Acompañamiento completo para darse de alta como trabajador por cuenta propia: solicitud, actividad, registros y alta tributaria, sin vueltas innecesarias.',
    pasos: [
      'Definición de la actividad autorizada y de la forma de ejercerla, según la normativa vigente.',
      'Preparación y revisión de la documentación y de la solicitud ante la entidad competente.',
      'Gestión de la inscripción en los registros que correspondan.',
      'Alta tributaria ante la ONAT y orientación sobre el vector fiscal y las obligaciones del primer año.',
      'Entrega de la carpeta ordenada con cada documento y explicación de los pasos que siguen.'
    ],
    entregables: ['Carpeta del trámite con la documentación ordenada', 'Alta tributaria orientada y vector fiscal explicado', 'Guía escrita de obligaciones del primer año'],
    base: 'Normativa vigente de trabajo por cuenta propia y obligaciones tributarias ONAT.' },
  { id: 'crea-mipyme', categoria: 'formaliza', nombre: 'Creación de MIPYME privada',
    unidad: 'trámite', precio: 28000, horas: 24,
    resumen: 'Constitución completa de la MIPYME: socios, escritura, objeto social, inscripción, registros y puesta en marcha legal y contable.',
    pasos: [
      'Diseño de la sociedad: socios, aportes, objeto social, domicilio y órganos de dirección.',
      'Preparación de la escritura de constitución y de los estatutos, con revisión de cada cláusula.',
      'Gestión de la inscripción en el Registro Mercantil y en los registros sectoriales que apliquen.',
      'Inscripción tributaria, cuentas bancarias y vector fiscal, con orientación sobre impuestos y contribuciones.',
      'Puesta en marcha: libros, contabilidad inicial, plantilla y contratos básicos.',
      'Carpeta final ordenada y sesión de explicación de las obligaciones de la empresa.'
    ],
    entregables: ['Escritura y estatutos revisados', 'Inscripciones y registros gestionados', 'Carpeta de puesta en marcha con guía de obligaciones'],
    base: 'Decreto-Ley 46/2021 y normativa complementaria de MIPYME; Ley 181/2025 (tributaria).' },
  { id: 'crea-cna', categoria: 'formaliza', nombre: 'Creación de cooperativa (CNA / CPA / CCS)',
    unidad: 'trámite', precio: 28000, horas: 24,
    resumen: 'Constitución de la cooperativa: estatutos, socios, órganos, inscripción y régimen interno, con el expediente completo.',
    pasos: [
      'Definición del tipo de cooperativa, objeto, socios fundadores y aportes.',
      'Redacción de los estatutos y del reglamento interno, con los órganos de dirección y control.',
      'Gestión de la aprobación y de la inscripción en los registros correspondientes.',
      'Régimen tributario y contable de la cooperativa, explicado a los socios.',
      'Entrega de la carpeta completa y sesión de orientación para la asamblea constitutiva.'
    ],
    entregables: ['Estatutos y reglamento interno', 'Expediente de constitución gestionado', 'Guía para la asamblea constitutiva'],
    base: 'Normativa vigente de cooperativas no agropecuarias y agropecuarias.' },
  { id: 'licencias', categoria: 'formaliza', nombre: 'Licencias y permisos (sanitaria, DMOTU, bomberos, ambiental)',
    unidad: 'trámite', precio: 15000, horas: 14,
    resumen: 'Gestión ordenada de los permisos que el negocio necesita para operar: qué pide cada entidad, en qué orden y con qué documentos.',
    pasos: [
      'Mapa de permisos según la actividad y el local: microlocalización, licencia sanitaria, aval de bomberos (APCI) y licencia ambiental cuando aplica.',
      'Preparación de cada expediente con sus planos, memorias y formularios.',
      'Presentación y seguimiento ante cada entidad, con respuesta a observaciones.',
      'Cierre con la carpeta de licencias ordenada y el calendario de renovaciones.'
    ],
    entregables: ['Mapa de permisos de la actividad', 'Expedientes presentados y seguidos', 'Carpeta de licencias con calendario de renovaciones'],
    base: 'DMOTU, MINSAP, APCI (bomberos) y CITMA; normas cubanas (NC) aplicables.' },
  { id: 'alta-onat', categoria: 'formaliza', nombre: 'Inscripción en registros y alta tributaria (ONAT)',
    unidad: 'trámite', precio: 9000, horas: 8,
    resumen: 'Alta tributaria sin errores: vector fiscal correcto, libros y obligaciones claras desde el primer día.',
    pasos: [
      'Determinación del vector fiscal según la forma de gestión y la actividad.',
      'Inscripción y alta ante la ONAT con la documentación completa.',
      'Configuración de libros y registros obligatorios.',
      'Explicación de las obligaciones periódicas: declaraciones, pagos y plazos.'
    ],
    entregables: ['Alta tributaria gestionada', 'Vector fiscal documentado', 'Calendario de obligaciones del primer año'],
    base: 'Ley 181/2025 y normativa de la ONAT; vector fiscal RC-04A cuando aplica.' },
  { id: 'ficha-costo', categoria: 'finanzas', nombre: 'Ficha de costo y formación de precios',
    unidad: 'servicio', precio: 7500, horas: 8,
    resumen: 'Ficha de costo por producto o servicio: materiales, mano de obra y gastos, con el precio calculado y el margen que el negocio necesita.',
    pasos: [
      'Levantamiento de insumos, cantidades y precios reales de compra.',
      'Cálculo de la mano de obra y de los gastos indirectos por unidad.',
      'Construcción de la ficha de costo con merma y costo unitario.',
      'Formación del precio con el margen objetivo y comparación con el mercado.',
      'Entrega de la ficha editable y explicación de cómo actualizarla cuando cambien los precios.'
    ],
    entregables: ['Ficha de costo por producto o servicio', 'Precio recomendado con su justificación', 'Ficha editable para actualizar precios', 'Cuadro de comparación del precio calculado con los precios de la competencia local, con la posición recomendada (igual, por debajo o por encima).'],
    base: 'Formación de precios desde la ficha de costo; listados oficiales de precios (MFP).' },
  { id: 'flujo-caja', categoria: 'finanzas', nombre: 'Flujo de caja y proyecciones financieras (5 años)',
    unidad: 'proyecto', precio: 16000, horas: 16,
    resumen: 'Proyección financiera a 5 años: ingresos, costos, resultados y flujo de caja, con los supuestos escritos y revisables.',
    pasos: [
      'Definición de supuestos: ventas, precios, costos, crecimiento e inflación, todos explícitos.',
      'Proyección de ingresos y costos operativos año por año.',
      'Estado de resultados proyectado con los impuestos vigentes.',
      'Flujo de caja económico y financiero, con el período de recuperación.',
      'Revisión conjunta y entrega del modelo editable con su guía de uso.'
    ],
    entregables: ['Proyección financiera a 5 años', 'Estado de resultados y flujo de caja', 'Modelo editable con supuestos declarados', 'Primera revisión trimestral del modelo incluida: una sesión para actualizar los supuestos con los números reales.'],
    base: 'Guías metodológicas del MEP (Resolución 70/2026), capítulos 5 y 6; parámetros BCC y ONAT vigentes.' },
  { id: 'credito', categoria: 'finanzas', nombre: 'Expediente de crédito bancario (BANDEC / BPA)',
    unidad: 'expediente', precio: 14000, horas: 14,
    resumen: 'Expediente de crédito armado como lo pide el banco: capacidad de pago, garantías, flujo y documentación, sin devoluciones por vacíos.',
    pasos: [
      'Cálculo del préstamo necesario: inversión menos recursos propios.',
      'Análisis de capacidad de pago: cobertura del servicio de la deuda (DSCR) y relación beneficio-costo.',
      'Armado del expediente con la documentación que exige la entidad bancaria.',
      'Revisión contra los criterios del banco y corrección de vacíos antes de presentar.',
      'Acompañamiento en la presentación y respuesta a los requerimientos del banco.'
    ],
    entregables: ['Expediente de crédito completo', 'Análisis de capacidad de pago (DSCR, B/C)', 'Acompañamiento en la presentación'],
    base: 'Requisitos del sistema bancario nacional (BANDEC, BPA, Banco Metropolitano) y del BCC; Resolución 118/2026 del BCC cuando aplica a PDL.' },
  { id: 'contab-inicial', categoria: 'finanzas', nombre: 'Contabilidad inicial y puesta en marcha en Finanzas',
    unidad: 'servicio', precio: 12000, horas: 12,
    resumen: 'Contabilidad lista desde el primer día: plan de cuentas, registros, bancos y reportes, configurada en la aplicación Finanzas.',
    pasos: [
      'Diseño del plan de cuentas según la forma de gestión y la actividad.',
      'Configuración de la aplicación Finanzas: cuentas bancarias, clientes, proveedores y centros de costo.',
      'Carga de saldos iniciales y de los primeros movimientos, con conciliación bancaria.',
      'Capacitación práctica al responsable: registrar, consultar y cerrar el mes.',
      'Entrega de la guía de cierre mensual y de los reportes que debe revisar.',
      'Explicación del servicio de contabilidad continua mensual (servicio aparte) y entrega de su propuesta con precio.'
    ],
    entregables: ['Plan de cuentas configurado', 'Aplicación Finanzas lista con saldos iniciales', 'Guía de cierre mensual y capacitación práctica'],
    base: 'Normas contables empresariales; Resolución 202/2026 MFP cuando aplica a PDL.' },
  { id: 'sensibilidad', categoria: 'finanzas', nombre: 'Análisis de sensibilidad y escenarios',
    unidad: 'análisis', precio: 9000, horas: 8,
    resumen: 'Prueba de resistencia del proyecto: qué pasa si caen las ventas, suben los insumos o se atrasa el arranque, y cómo responder.',
    pasos: [
      'Definición de escenarios pesimista, base y optimista con variaciones explícitas.',
      'Recálculo de VAN y TIR en cada escenario.',
      'Matriz de riesgos con medidas concretas de mitigación y su costo.',
      'Recomendaciones de decisión según la resistencia del proyecto.'
    ],
    entregables: ['Análisis de sensibilidad en tres escenarios', 'Matriz de riesgos con mitigación', 'Recomendaciones de decisión', 'Nota de contexto: qué hechos del entorno (normas, precios clave, competencia) vigilar durante la ejecución del proyecto.'],
    base: 'Guías metodológicas del MEP (Resolución 70/2026), capítulo 6; variaciones habituales del contexto cubano.' },
  { id: 'estrategia', categoria: 'gestion', nombre: 'Estrategia de desarrollo y plan de acción anual',
    unidad: 'proyecto', precio: 20000, horas: 18,
    resumen: 'Estrategia de desarrollo municipal con los 11 acápites oficiales: datos del territorio, misión y visión, DAFO, líneas, programas, políticas por línea, seguimiento, ordenamiento ambiental y gobernanza, lista para ejecutar y evaluar.',
    pasos: [
      'Datos históricos, sociales y económicos: ubicación y territorio, historia y patrimonio, biodiversidad y categorías de protección, estructura político-administrativa y base económica.',
      'Análisis estratégico: misión, visión y valores compartidos del municipio, construidos con los actores del territorio.',
      'Matriz DAFO: debilidades, amenazas, fortalezas y oportunidades, con la participación de los actores locales.',
      'Potenciales endógenos, barreras principales y conflictos identificados en el territorio.',
      'Líneas estratégicas del período, priorizadas con el gobierno municipal.',
      'Programas de la estrategia, con su alcance, sus responsables y su cartera de proyectos.',
      'Políticas públicas locales por línea: objetivos, marco jurídico, lineamientos, metas por plazo, acciones, resultados esperados, responsables y control.',
      'Ciclo de gestión, seguimiento y actualización: tablero de indicadores con línea base, metas intermedias y meta final, y evaluaciones anuales.',
      'Sesión de validación de metas e indicadores con el gobierno municipal antes de cerrar el documento.',
      'Articulación con el Modelo de Ordenamiento Ambiental: zonificación, usos compatibles con la conservación y Tarea Vida.',
      'Participación y gobernanza: CAM, AMPP, consejos populares, entidades y población en la elaboración, implementación y evaluación.',
      'Disposiciones finales: presentación al CAM, elevación a la AMPP y mecanismo de revisión permanente.'
    ],
    entregables: ['Documento de estrategia con los 11 acápites oficiales', 'Plan de acción anual con presupuesto', 'Tablero de indicadores y evaluación', 'Resumen ejecutivo de 2 páginas para directivos.'],
    base: 'Decreto 174/2026 y Resolución 70/2026 del MEP (guías metodológicas para las estrategias de desarrollo municipal).' },
  { id: 'eval-semestral', categoria: 'gestion', nombre: 'Evaluación semestral de PDL ante el CAM',
    unidad: 'evaluación', precio: 12000, horas: 10,
    resumen: 'Evaluación semestral del PDL lista para el Consejo de la Administración Municipal: ejecución, fuentes, resultados y ajustes.',
    pasos: [
      'Recogida de la ejecución del semestre: fuentes de financiamiento, metas y empleos.',
      'Comparación estudio contra realidad, fuente por fuente.',
      'Redacción del informe de evaluación con hallazgos y ajustes propuestos.',
      'Preparación de la presentación ante el CAM.'
    ],
    entregables: ['Informe de evaluación semestral', 'Cuadro estudio contra realidad', 'Resumen para la presentación ante el CAM'],
    base: 'Decreto 174/2026, art. 40.1: evaluación semestral por el CAM.' },
  { id: 'capacitacion', categoria: 'gestion', nombre: 'Capacitación al equipo (jornada)',
    unidad: 'jornada', precio: 6000, horas: 6,
    resumen: 'Jornada de formación práctica para el equipo: finanzas básicas, costos, registros y atención al cliente, con materiales incluidos.',
    pasos: [
      'Diagnóstico rápido de las necesidades del equipo.',
      'Diseño de la jornada con ejercicios sobre los números reales del negocio.',
      'Sesión práctica con materiales y casos del propio negocio.',
      'Material de consulta y recomendaciones de seguimiento.'
    ],
    entregables: ['Jornada de capacitación impartida', 'Materiales y ejercicios del negocio', 'Guía de consulta para el equipo'],
    base: 'Formación por competencias; materiales en lenguaje sencillo.' },
  { id: 'defensa-cam', categoria: 'gestion', nombre: 'Acompañamiento y defensa ante el CAM y el banco',
    unidad: 'servicio', precio: 10000, horas: 10,
    resumen: 'Acompañamiento el día de la defensa: presentación, respuestas a observaciones y seguimiento hasta la aprobación.',
    pasos: [
      'Preparación de la presentación y de las respuestas a las observaciones habituales.',
      'Ensayo de la defensa con el cliente.',
      'Acompañamiento en la sesión ante el CAM o el banco.',
      'Seguimiento de los acuerdos y de los ajustes pedidos hasta el cierre.'
    ],
    entregables: ['Presentación de defensa preparada', 'Acompañamiento en la sesión', 'Seguimiento hasta la aprobación'],
    base: 'Procedimiento de aprobación de proyectos ante el CAM y el banco.' },
  { id: 'web-negocio', categoria: 'digital', nombre: 'Página web profesional del negocio',
    unidad: 'proyecto', precio: 22000, horas: 20,
    resumen: 'Página web del negocio, rápida y pensada para vender: servicios, precios, contacto y presencia seria en internet.',
    pasos: [
      'Definición de contenidos: servicios, precios, historia y contacto del negocio.',
      'Diseño adaptado a móvil y PC, con la imagen del negocio.',
      'Construcción y publicación de la página, con formularios de contacto.',
      'Optimización para buscadores y para compartir en redes: título, descripción e imagen de portada de la página.',
      'Entrega con guía de actualización y acompañamiento inicial.'
    ],
    entregables: ['Página web publicada', 'Diseño adaptado a móvil y PC', 'Guía de actualización'],
    base: 'Publicación en GitHub Pages; sin costos de licencia.' },
  { id: 'app-medida', categoria: 'digital', nombre: 'Aplicación web o Android a la medida',
    unidad: 'proyecto', precio: 45000, horas: 40,
    resumen: 'Aplicación hecha para el negocio: ventas, inventario, reservas o gestión, que funciona en el teléfono y ahorra datos.',
    pasos: [
      'Levantamiento de requerimientos con el cliente: qué debe hacer la aplicación, paso a paso.',
      'Diseño de pantallas y flujos, aprobado por el cliente antes de programar.',
      'Desarrollo, pruebas con datos reales y ajustes.',
      'Publicación, capacitación y acompañamiento inicial.'
    ],
    entregables: ['Aplicación publicada y funcionando', 'Capacitación de uso', 'Acompañamiento inicial'],
    base: 'HTML/JavaScript, Google Sheets y GitHub Pages; compilación Android disponible.' },
  { id: 'identidad-digital', categoria: 'digital', nombre: 'Identidad digital y presencia en redes',
    unidad: 'servicio', precio: 9000, horas: 8,
    resumen: 'Presencia digital ordenada: perfiles, imagen, mensajes y calendario de publicaciones para captar clientes.',
    pasos: [
      'Diagnóstico de la presencia actual y de la competencia.',
      'Definición de imagen, mensajes y canales prioritarios.',
      'Configuración de perfiles y plantillas de publicación.',
      'Diseño de las piezas gráficas iniciales para redes y publicidad, con plantillas editables con la imagen del negocio.',
      'Calendario inicial de publicaciones y guía de mantenimiento.'
    ],
    entregables: ['Perfiles configurados', 'Plantillas de publicación', 'Calendario inicial y guía', 'Paquete inicial de piezas gráficas (plantillas editables).', 'Guía de mensajes: qué decir en cada canal y cómo responder a los clientes.'],
    base: 'Canales digitales habituales en Cuba; contenido en español.' },
  { id: 'evento-llave-mano', categoria: 'eventos', nombre: 'Evento corporativo llave en mano',
    unidad: 'evento', precio: 30000, horas: 24,
    resumen: 'Evento completo organizado de principio a fin: lanzamiento, rueda de negocios, taller, aniversario o encuentro entre empresas, con programa, logística y cierre.',
    pasos: [
      'Definición del objetivo, el público, la fecha y el formato del evento con el cliente.',
      'Programa del evento: agenda, intervenciones, tiempos y responsables.',
      'Coordinación de la logística: local, montaje, sonido, materiales y convocatoria de invitados.',
      'Ejecución el día del evento: recepción, orden del programa y atención a los participantes.',
      'Cierre con informe: asistencia, resultados, fotos y lecciones para el próximo evento.'
    ],
    entregables: ['Programa y agenda del evento', 'Evento ejecutado con su logística coordinada', 'Informe de cierre con asistencia y resultados'],
    base: 'Organización por objetivos: programa, logística, ejecución y cierre con informe. Los gastos de local, comida y terceros no están incluidos en el precio.' },
  { id: 'diag-comunicacion', categoria: 'marca', nombre: 'Diagnóstico de comunicación e imagen',
    unidad: 'diagnóstico', precio: 10000, horas: 8,
    resumen: 'Revisión completa de cómo comunica el negocio: mensajes, canales, imagen y lo que piensan los clientes, con los problemas ordenados por importancia.',
    pasos: [
      'Revisión de todos los mensajes y canales actuales: redes, carteles, papelería, atención al cliente y página web si existe.',
      'Entrevistas cortas con el equipo y con clientes para saber cómo se percibe el negocio.',
      'Diagnóstico de imagen y marca: qué se entiende, qué confunde y qué falta.',
      'Informe con los problemas ordenados por importancia y las correcciones recomendadas.'
    ],
    entregables: ['Informe de diagnóstico de comunicación', 'Lista de problemas ordenados por importancia', 'Recomendaciones de corrección inmediata'],
    base: 'Método de diagnóstico: revisión de mensajes y canales, entrevistas y análisis de la percepción de los clientes.' },
  { id: 'estrategia-comunicacion', categoria: 'marca', nombre: 'Estrategia y plan de comunicación',
    unidad: 'proyecto', precio: 18000, horas: 16,
    resumen: 'Plan de comunicación para todo el año: qué decir, a quién, por qué canal y cuándo, con el posicionamiento de la marca y el plan para responder ante una crisis.',
    pasos: [
      'Definición de públicos, mensajes clave y tono: cómo habla el negocio en cada canal.',
      'Posicionamiento: qué lugar debe ocupar la marca en la mente del cliente y cómo ganar visibilidad frente a la competencia.',
      'Plan de canales y calendario anual: qué se comunica cada mes y con qué objetivo.',
      'Plan de respuesta ante crisis: quién habla, qué se dice y en qué orden cuando surge un problema público.',
      'Indicadores de seguimiento: cómo saber si la comunicación está funcionando.'
    ],
    entregables: ['Documento de estrategia de comunicación', 'Calendario anual de comunicación', 'Plan de respuesta ante crisis'],
    base: 'Método de planificación de comunicación: públicos, mensajes, canales, calendario y medición.' },
  { id: 'campana-comunicacion', categoria: 'marca', nombre: 'Campaña de comunicación y contenido',
    unidad: 'campaña', precio: 15000, horas: 14,
    resumen: 'Campaña completa para un objetivo concreto: lanzar un producto, atraer clientes o dar a conocer el negocio, con contenido listo para publicar y seguimiento de resultados.',
    pasos: [
      'Definición del objetivo de la campaña, el público y el mensaje central.',
      'Plan de contenido: textos, piezas gráficas y calendario de publicación, incluida la comunicación para ferias y eventos cuando aplica.',
      'Producción del contenido y preparación de los canales.',
      'Lanzamiento y seguimiento: publicación, respuesta a los interesados y ajuste sobre la marcha.',
      'Informe de resultados: alcance, respuestas y qué repetir en la próxima campaña.'
    ],
    entregables: ['Plan y calendario de la campaña', 'Contenido listo para publicar (textos y piezas)', 'Informe de resultados de la campaña'],
    base: 'Método de campaña: objetivo, mensaje, contenido, lanzamiento y medición de resultados.' },
  { id: 'marca-completa', categoria: 'marca', nombre: 'Sistema completo de marca',
    unidad: 'proyecto', precio: 25000, horas: 20,
    resumen: 'La marca entera del negocio: nombre comercial, lema, imagen, manual de identidad, papelería y piezas promocionales, lista para usar en todo lo que el negocio muestra.',
    pasos: [
      'Definición del nombre comercial y del lema, con revisión de que no estén en uso por otro negocio del territorio.',
      'Diseño de la imagen: logo, colores, letras y estilo de las piezas.',
      'Manual de identidad sencillo: cómo usar la marca en cada material, qué se permite y qué no.',
      'Papelería y piezas promocionales: tarjetas, membrete, volantes y piezas para redes.',
      'Señalética básica: carteles y letreros del local, con su manual de uso, cuando el negocio tiene local abierto al público.'
    ],
    entregables: ['Nombre comercial y lema definidos', 'Manual de identidad con logo, colores y reglas de uso', 'Papelería, piezas promocionales y señalética básica'],
    base: 'Método de construcción de marca: nombre, imagen, manual y aplicaciones. El registro legal de la marca es un servicio aparte.' },
  { id: 'marca-producto', categoria: 'marca', nombre: 'Marca de un producto',
    unidad: 'producto', precio: 12000, horas: 10,
    resumen: 'Marca propia para un producto: nombre, imagen, etiqueta y presentación, para que el producto se reconozca y se venda solo en el estante o en la foto.',
    pasos: [
      'Definición del nombre del producto y de su promesa: qué lo hace distinto.',
      'Diseño de la imagen del producto: logo, colores y estilo.',
      'Diseño de etiqueta y presentación, con la información que el producto debe mostrar.',
      'Piezas de lanzamiento: fotos y textos para redes y puntos de venta.'
    ],
    entregables: ['Nombre e imagen del producto', 'Etiqueta y presentación diseñadas', 'Piezas de lanzamiento para redes y venta'],
    base: 'Método de marca de producto: nombre, imagen, etiqueta y lanzamiento.' },
  { id: 'informe-contexto', categoria: 'estudios', nombre: 'Informe de contexto y tendencias',
    unidad: 'informe', precio: 15000, horas: 12,
    resumen: 'Informe sobre un tema que el cliente necesita entender: contexto, tendencias, información pública recogida y qué significa para su negocio o su proyecto.',
    pasos: [
      'Definición del tema y de las preguntas que el informe debe responder.',
      'Recogida de información pública: normas, cifras oficiales, prensa y fuentes del sector, todas citadas.',
      'Análisis de tendencias: qué está cambiando y hacia dónde va el sector.',
      'Escenarios: qué puede pasar y cómo afecta al negocio del cliente.',
      'Informe final con conclusiones y recomendaciones claras.'
    ],
    entregables: ['Informe de contexto y tendencias con fuentes citadas', 'Apartado de escenarios y riesgos', 'Recomendaciones para la decisión del cliente'],
    base: 'Fuentes obligatorias: ONEI (anuarios nacional y territorial) y Estrategia de Desarrollo Municipal; toda la información pública va citada.' },
  { id: 'estudio-clima', categoria: 'estudios', nombre: 'Estudio de clima empresarial con encuestas',
    unidad: 'estudio', precio: 20000, horas: 18,
    resumen: 'Encuesta a los negocios de un territorio o sector para medir cómo está el ambiente para hacer negocios: ventas, obstáculos, expectativas y necesidades, con resultados en cifras generales.',
    pasos: [
      'Diseño de la encuesta: preguntas claras sobre ventas, obstáculos, costos y expectativas.',
      'Aplicación de la encuesta a negocios del territorio o del sector, en persona o en línea.',
      'Procesamiento de respuestas y cálculo de resultados en cifras generales.',
      'Informe con hallazgos, comparaciones y recomendaciones para el territorio o el sector.'
    ],
    entregables: ['Encuesta diseñada y aplicada', 'Informe de clima empresarial con cifras generales', 'Recomendaciones a partir de los resultados'],
    base: 'Método de encuesta: cuestionario, muestra del territorio o sector, y resultados publicados solo en cifras generales, sin datos de un negocio en particular.' },
  { id: 'memoria-anual', categoria: 'estudios', nombre: 'Memoria anual de resultados',
    unidad: 'documento', precio: 12000, horas: 10,
    resumen: 'Documento anual que cuenta lo que el negocio o el proyecto logró en el año: cifras, hechos, proyectos y planes, listo para socios, autoridades o clientes.',
    pasos: [
      'Recogida de la información del año: cifras, hechos, proyectos y fotos.',
      'Redacción de la memoria: resultados, actividades, equipo y planes para el año siguiente.',
      'Revisión de cifras con el cliente: nada se publica sin comprobar.',
      'Diseño y entrega del documento final, listo para imprimir o compartir.'
    ],
    entregables: ['Memoria anual redactada y diseñada', 'Cuadro de cifras del año verificadas', 'Versión lista para imprimir y compartir'],
    base: 'Estructura de memoria anual: resultados, cifras, hechos y planes; los datos son los del propio negocio, verificados con el cliente.' },
  { id: 'comercio-exterior', categoria: 'gestion', nombre: 'Primeros pasos para exportar servicios',
    unidad: 'proyecto', precio: 18000, horas: 16,
    resumen: 'Servicio de primeros pasos para vender servicios fuera de Cuba: qué se puede exportar, qué pide el marco vigente, qué documentos hacen falta y por dónde empezar.',
    pasos: [
      'Revisión de los servicios del negocio que se pueden exportar y de su mercado posible.',
      'Mapa de requisitos: qué pide el marco vigente, qué documentos hacen falta y qué entidad interviene.',
      'Estrategia de entrada: clientes objetivo, canales, precios y posicionamiento internacional.',
      'Plan de acción con pasos, responsables y plazos para la primera exportación.'
    ],
    entregables: ['Mapa de requisitos y documentos para exportar', 'Estrategia de entrada a mercados', 'Plan de acción para la primera exportación'],
    base: '[A COMPLETAR: base normativa]' },
  { id: 'mapeo-sectorial', categoria: 'estudios', nombre: 'Mapeo territorial de actores económicos',
    unidad: 'estudio', precio: 25000, horas: 20,
    resumen: 'Mapa vivo de los negocios y actores de un sector o un municipio: encuesta abierta, base de datos y un informe con las cifras generales del sector, para decidir con datos propios.',
    pasos: [
      'Diseño de la encuesta abierta: quiénes son los actores, qué hacen, a quién venden y qué necesitan.',
      'Convocatoria y recogida de respuestas, en línea y en persona.',
      'Base de datos del sector: actores ordenados por eslabón de la cadena (producción, transformación, logística, comercialización, exportación).',
      'Informe con cifras generales: tamaño del sector, ventas por destino, necesidades y oportunidades de conexión.',
      'Entrega de la base y del informe, con la guía para mantener el mapa actualizado.'
    ],
    entregables: ['Encuesta abierta aplicada', 'Base de datos del sector ordenada por eslabón', 'Informe con cifras generales y oportunidades'],
    base: 'Método de mapeo: encuesta abierta, base de datos propia y publicación solo de cifras generales, nunca de datos de un negocio en particular.' },
  { id: 'micro-revision-doc', categoria: 'micro', nombre: 'Revisión de un documento',
    unidad: 'documento', precio: 2500, horas: 2,
    resumen: 'Revisión experta de un documento que el cliente ya tiene: se marcan los errores, los vacíos y lo que falta, con las correcciones recomendadas por escrito.',
    pasos: [
      'Lectura completa del documento contra la norma o el modelo que debe cumplir.',
      'Marcado de errores, vacíos y riesgos, punto por punto.',
      'Entrega de las observaciones por escrito con las correcciones recomendadas.'
    ],
    entregables: ['Documento revisado con observaciones marcadas', 'Lista de correcciones recomendadas'],
    base: 'Revisión contra la norma o el modelo que el documento debe cumplir; las observaciones van por escrito.' },
  { id: 'micro-ficha-producto', categoria: 'micro', nombre: 'Ficha de costo de un solo producto',
    unidad: 'producto', precio: 2000, horas: 2,
    resumen: 'Ficha de costo de un solo producto o servicio: insumos, mano de obra y gastos, con el precio calculado y el margen, en una ficha editable.',
    pasos: [
      'Levantamiento de insumos, cantidades y precios reales de compra del producto.',
      'Cálculo de mano de obra y gastos indirectos por unidad.',
      'Construcción de la ficha con merma, costo unitario y precio recomendado.'
    ],
    entregables: ['Ficha de costo del producto', 'Precio recomendado con su justificación'],
    base: 'Formación de precios desde la ficha de costo; listados oficiales de precios (MFP).' },
  { id: 'micro-logo', categoria: 'micro', nombre: 'Logo sencillo',
    unidad: 'pieza', precio: 3000, horas: 3,
    resumen: 'Logo sencillo para el negocio: una propuesta limpia y usable en tarjetas, redes y carteles, entregada en los formatos que el cliente necesita.',
    pasos: [
      'Entrevista breve: nombre, actividad y estilo que el cliente quiere.',
      'Diseño de la propuesta de logo con sus colores.',
      'Ajuste con el cliente y entrega en los formatos de uso habitual.'
    ],
    entregables: ['Logo en los formatos de uso habitual', 'Guía breve de colores y uso'],
    base: 'Diseño de identidad visual básica; el manual de identidad completo es un servicio aparte.' },
  { id: 'micro-papeleria', categoria: 'micro', nombre: 'Papelería básica del negocio',
    unidad: 'paquete', precio: 3500, horas: 3,
    resumen: 'Paquete de papelería básica con la imagen del negocio: tarjetas de presentación, membrete y volante sencillo, listos para imprimir.',
    pasos: [
      'Definición de los datos y del estilo de las piezas.',
      'Diseño de tarjetas, membrete y volante con la imagen del negocio.',
      'Entrega de los archivos listos para imprimir.'
    ],
    entregables: ['Tarjetas de presentación', 'Membrete y volante listos para imprimir'],
    base: 'Diseño de piezas con la imagen del negocio; la impresión corre por cuenta del cliente.' },
  { id: 'micro-asesoria-hora', categoria: 'micro', nombre: 'Hora de asesoría',
    unidad: 'hora', precio: 1500, horas: 1,
    resumen: 'Una hora de asesoría directa para resolver una duda concreta: un trámite, un precio, una decisión o un documento, con las respuestas por escrito después.',
    pasos: [
      'El cliente plantea su duda concreta antes de la sesión.',
      'Sesión de una hora: respuestas directas y pasos recomendados.',
      'Resumen por escrito con las respuestas y los pasos siguientes.'
    ],
    entregables: ['Sesión de asesoría de una hora', 'Resumen por escrito con pasos siguientes'],
    base: 'Asesoría directa sobre la pregunta del cliente; lo que no se sabe se dice y se marca para verificar.' },
  { id: 'asistencia-legal', categoria: 'legal', nombre: 'Asistencia legal para el negocio',
    unidad: 'servicio', precio: 12000, horas: 10,
    resumen: 'Apoyo legal dentro del paquete de consultoría: revisión de contratos, consultas sobre obligaciones y orientación ante trámites, con un abogado aliado.',
    pasos: [
      'Levantamiento de la necesidad legal: contratos, trámites u obligaciones en duda.',
      'Revisión de los documentos por el abogado aliado.',
      'Informe de orientación con las respuestas y los pasos recomendados, en lenguaje claro.',
      'Acompañamiento en el trámite o la firma, cuando aplica.'
    ],
    entregables: ['Documentos revisados por el abogado aliado', 'Informe de orientación legal en lenguaje claro', 'Acompañamiento en el trámite cuando aplica'],
    base: '[A COMPLETAR: base normativa]' },
  { id: 'proteccion-marca', categoria: 'legal', nombre: 'Protección y registro de marca',
    unidad: 'trámite', precio: 10000, horas: 8,
    resumen: 'Trámite para proteger la marca del negocio: búsqueda de que no esté en uso, preparación de la solicitud de registro y seguimiento hasta su resolución.',
    pasos: [
      'Búsqueda previa: comprobar que la marca no esté registrada ni en uso por otro negocio.',
      'Preparación de la solicitud de registro con los datos y la imagen de la marca.',
      'Presentación y seguimiento del trámite ante la entidad competente.',
      'Entrega del registro y explicación de cómo defender la marca.'
    ],
    entregables: ['Búsqueda previa de la marca', 'Solicitud de registro presentada y seguida', 'Registro entregado con guía de defensa'],
    base: '[A COMPLETAR: base normativa]' },
  { id: 'fondos-cooperacion', categoria: 'finanzas', nombre: 'Solicitud de fondos de cooperación internacional',
    unidad: 'expediente', precio: 20000, horas: 18,
    resumen: 'Expediente para solicitar fondos de cooperación internacional para un proyecto: identificación de la convocatoria, propuesta escrita y presentación con seguimiento.',
    pasos: [
      'Identificación de las convocatorias abiertas que encajan con el proyecto.',
      'Revisión de los requisitos de la convocatoria y de lo que el proyecto debe demostrar.',
      'Redacción de la propuesta: objetivos, resultados, presupuesto y sostenibilidad, en el formato que pide la convocatoria.',
      'Presentación de la solicitud y seguimiento de los requerimientos hasta su resolución.'
    ],
    entregables: ['Mapa de convocatorias que encajan con el proyecto', 'Propuesta escrita en el formato pedido', 'Solicitud presentada con seguimiento'],
    base: 'Decreto 174/2026, art. 43.1: la cooperación internacional es una de las 14 fuentes de financiamiento de los PDL. [A COMPLETAR: convocatorias y requisitos de cada fondo].' },
  { id: 'networking-b2b', categoria: 'eventos', nombre: 'Contactos, proveedores y ruedas de negocios',
    unidad: 'servicio', precio: 12000, horas: 10,
    resumen: 'Conexión del negocio con lo que necesita: búsqueda de proveedores, agenda de contactos y ruedas de negocios con otras empresas del territorio o del sector.',
    pasos: [
      'Levantamiento de lo que el negocio necesita: proveedores, clientes o aliados.',
      'Búsqueda y verificación de contactos en el territorio y en la red de clientes.',
      'Organización de reuniones entre empresas (B2B): agenda, presentación y seguimiento.',
      'Informe de contactos con resultados y pasos siguientes.'
    ],
    entregables: ['Lista de contactos verificados', 'Reuniones B2B organizadas', 'Informe de resultados y pasos siguientes'],
    base: 'Método de red de contactos: búsqueda, verificación, reunión y seguimiento. Los datos de otros negocios solo se comparten con su permiso.' },
  { id: 'est-satisfaccion', categoria: 'estudios', nombre: 'Estudio de satisfacción de clientes',
    unidad: 'estudio', precio: 12000, horas: 10,
    resumen: 'Encuesta a los clientes del negocio para saber qué les gusta, qué les molesta y qué cambiarían, con resultados claros y un plan de mejora.',
    pasos: [
      'Diseño de la encuesta: preguntas cortas sobre el producto, el precio, la atención y la experiencia.',
      'Aplicación de la encuesta a los clientes, en persona o en línea.',
      'Procesamiento de respuestas y cálculo de resultados.',
      'Informe con hallazgos y plan de mejora ordenado por importancia.'
    ],
    entregables: ['Encuesta diseñada y aplicada', 'Informe de satisfacción con resultados', 'Plan de mejora ordenado por importancia'],
    base: 'Método de encuesta: cuestionario corto, clientes reales y resultados con cifras.' },
  { id: 'analisis-competidores', categoria: 'estudios', nombre: 'Análisis de competidores',
    unidad: 'análisis', precio: 10000, horas: 8,
    resumen: 'Radiografía de los rivales directos: qué venden, a qué precio, cómo atienden y dónde están sus huecos, para que el negocio sepa dónde ganarles.',
    pasos: [
      'Identificación de los competidores directos e indirectos del territorio.',
      'Levantamiento de su oferta, precios, canales y atención, con observación directa.',
      'Comparación con el negocio del cliente: ventajas, desventajas y huecos del mercado.',
      'Informe con recomendaciones para diferenciarse.'
    ],
    entregables: ['Mapa de competidores con oferta y precios', 'Cuadro de comparación con el negocio', 'Recomendaciones para diferenciarse'],
    base: 'Observación directa de la oferta local y datos de la ONEI y de la Estrategia de Desarrollo Municipal.' },
  { id: 'benchmarking', categoria: 'estudios', nombre: 'Comparación con los mejores del sector (benchmarking)',
    unidad: 'análisis', precio: 14000, horas: 12,
    resumen: 'Comparación del negocio con los mejores de su sector: qué hacen distinto, qué prácticas se pueden copiar y qué metas ponerse para alcanzarlos.',
    pasos: [
      'Selección de los negocios de referencia: los mejores del sector en el territorio o en el país.',
      'Levantamiento de sus prácticas: oferta, precios, atención, canales y organización.',
      'Comparación práctica por práctica con el negocio del cliente.',
      'Plan de mejora con las prácticas a adoptar, en orden de impacto y esfuerzo.'
    ],
    entregables: ['Informe de comparación con los mejores', 'Cuadro de prácticas comparadas', 'Plan de mejora con prácticas a adoptar'],
    base: 'Método de comparación de prácticas: referencias reales, comparación ordenada y plan de mejora.' },
  { id: 'dictamen-financiero', categoria: 'finanzas', nombre: 'Dictamen financiero',
    unidad: 'dictamen', precio: 18000, horas: 16,
    resumen: 'Opinión formal sobre los estados financieros del negocio: si las cifras son correctas, qué riesgos muestran y qué corregir, firmada por quien la norma autoriza.',
    pasos: [
      'Recogida de los estados financieros y de los registros del negocio.',
      'Revisión de cifras, registros y soportes, partida por partida.',
      'Identificación de errores, riesgos y diferencias con la norma.',
      'Redacción del dictamen con la opinión, los hallazgos y las correcciones recomendadas.',
      'Entrega y explicación de los resultados al cliente.'
    ],
    entregables: ['Dictamen financiero firmado', 'Informe de hallazgos y riesgos', 'Lista de correcciones recomendadas'],
    base: 'Normas contables empresariales; [A COMPLETAR: norma y firma autorizada del dictamen].' },
  { id: 'asesoria-impuestos', categoria: 'finanzas', nombre: 'Asesoría de impuestos continua (mensual)',
    unidad: 'mes', precio: 6000, horas: 6,
    resumen: 'Acompañamiento mes a mes en los impuestos: declaraciones revisadas, pagos a tiempo, cambios de norma explicados y dudas resueltas, para no pagar de más ni llegar tarde.',
    pasos: [
      'Revisión mensual de las declaraciones y los pagos antes de su vencimiento.',
      'Alerta de cambios en la norma que afecten al negocio, explicados en lenguaje claro.',
      'Respuesta a las dudas del mes y orientación sobre decisiones con efecto tributario.',
      'Resumen mensual: qué se pagó, qué falta y qué vigilar el mes siguiente.'
    ],
    entregables: ['Declaraciones y pagos revisados cada mes', 'Alertas de cambios de norma explicadas', 'Resumen mensual de la situación tributaria'],
    base: 'Ley 181/2025 y normativa de la ONAT.' },
  { id: 'asesoria-financiera', categoria: 'finanzas', nombre: 'Asesoría financiera continua (mensual)',
    unidad: 'mes', precio: 8000, horas: 8,
    resumen: 'Acompañamiento mes a mes en las finanzas del negocio: revisión de resultados, alertas tempranas y orientación para decidir, con los números reales del negocio.',
    pasos: [
      'Revisión mensual de ingresos, costos, resultados y flujo de caja con los números reales.',
      'Alertas tempranas: desvíos, riesgos y oportunidades del mes.',
      'Orientación para las decisiones del mes: precios, compras, gastos y financiamiento.',
      'Resumen mensual con cifras, hallazgos y recomendaciones.'
    ],
    entregables: ['Revisión financiera mensual', 'Alertas y recomendaciones del mes', 'Resumen mensual con cifras'],
    base: 'Guías metodológicas del MEP (Resolución 70/2026); parámetros BCC y ONAT vigentes.' },
  { id: 'contab-continua', categoria: 'finanzas', nombre: 'Contabilidad continua (mensual)',
    unidad: 'mes', precio: 10000, horas: 10,
    resumen: 'La contabilidad del negocio llevada mes a mes en la aplicación Finanzas: registros al día, conciliación bancaria, cierre mensual y reportes listos para decidir.',
    pasos: [
      'Registro mensual de movimientos: ventas, compras, gastos y bancos.',
      'Conciliación bancaria y revisión de saldos cada mes.',
      'Cierre mensual con sus reportes: resultados, flujo y situación del negocio.',
      'Entrega de los reportes y explicación de lo que muestran, en lenguaje claro.'
    ],
    entregables: ['Contabilidad al día en la aplicación Finanzas', 'Cierre mensual con conciliación bancaria', 'Reportes mensuales explicados'],
    base: 'Normas contables empresariales; Resolución 202/2026 MFP cuando aplica a PDL.' },
  { id: 'riesgo-penal', categoria: 'legal', nombre: 'Prevención de riesgos y delitos en la empresa',
    unidad: 'servicio', precio: 15000, horas: 12,
    resumen: 'Diagnóstico de los riesgos de tipo penal de la empresa: qué puede salir mal, qué responsabilidad tienen los socios y administradores, y qué medidas tomar para prevenirlo.',
    pasos: [
      'Levantamiento de las actividades y decisiones de riesgo de la empresa.',
      'Identificación de los riesgos y de la responsabilidad de socios y administradores.',
      'Medidas de prevención: controles, registros y reglas internas recomendadas.',
      'Guía de prevención para el equipo, en lenguaje claro, con los pasos a seguir ante un problema.'
    ],
    entregables: ['Informe de riesgos identificados', 'Medidas de prevención recomendadas', 'Guía de prevención para el equipo'],
    base: '[A COMPLETAR: base normativa]' },
  { id: 'crea-colectivo-av', categoria: 'formaliza', nombre: 'Creación de colectivo de creación audiovisual',
    unidad: 'trámite', precio: 15000, horas: 14,
    resumen: 'Trámites completos para constituir un colectivo de creación audiovisual: forma, estatutos, inscripción y puesta en marcha, con el expediente ordenado.',
    pasos: [
      'Definición de la forma del colectivo, sus integrantes y su objeto.',
      'Redacción de los estatutos y del reglamento interno.',
      'Gestión de la aprobación y de la inscripción en los registros correspondientes.',
      'Régimen tributario y contable explicado a los integrantes.',
      'Entrega de la carpeta completa y orientación para la puesta en marcha.'
    ],
    entregables: ['Estatutos y reglamento interno', 'Expediente de constitución gestionado', 'Carpeta de puesta en marcha con guía de obligaciones'],
    base: '[A COMPLETAR: base normativa]' },
  { id: 'video-negocio', categoria: 'marca', nombre: 'Video y piezas audiovisuales para el negocio',
    unidad: 'pieza', precio: 18000, horas: 16,
    resumen: 'Video profesional para el negocio: presentación, producto o testimonio, grabado y editado, con versiones cortas para redes y para compartir por WhatsApp.',
    pasos: [
      'Definición del mensaje y del formato: presentación del negocio, producto o historia de cliente.',
      'Guion sencillo y plan de grabación.',
      'Grabación y edición del video principal.',
      'Versiones cortas para redes y WhatsApp, con textos y portada.',
      'Entrega de los archivos y guía de publicación.'
    ],
    entregables: ['Video principal editado', 'Versiones cortas para redes y WhatsApp', 'Guía de publicación'],
    base: 'Producción audiovisual propia: guion, grabación, edición y versiones para redes.' },
  { id: 'estrategia-comercial', categoria: 'gestion', nombre: 'Estrategia comercial',
    unidad: 'proyecto', precio: 16000, horas: 14,
    resumen: 'Estrategia para vender más: clientes objetivo, canales, precios, metas de venta y plan de acción, construida sobre los números reales del negocio.',
    pasos: [
      'Definición de clientes objetivo y de la propuesta de valor.',
      'Canales de venta: dónde vender y cómo llegar a cada cliente.',
      'Estrategia de precios desde la ficha de costo y la comparación con el mercado.',
      'Metas de venta por mes y plan de acción con responsables.',
      'Indicadores de seguimiento para saber si la estrategia funciona.'
    ],
    entregables: ['Documento de estrategia comercial', 'Metas de venta y plan de acción', 'Indicadores de seguimiento'],
    base: 'Método del consultor: clientes, canales, precios y metas de venta, con la ficha de costo como base.' }
];

/* ---------- Textos del informe ---------- */
const PORQUE = [
  'Método probado: cada estudio sigue las guías metodológicas vigentes del MEP (Resolución 70/2026) y la normativa vigente, con datos reales del territorio y fuentes citadas. Nada se inventa.',
  'Documentos que se aprueban: los expedientes se arman como los piden el CAM y el banco, para no perder tiempo en devoluciones por vacíos.',
  'Lenguaje claro: usted entiende todo lo que se hace y puede explicarlo con sus palabras. Si no puede explicarlo, el trabajo no está terminado.',
  'Acompañamiento real: no entregamos un papel y nos vamos; defendemos el proyecto con usted y seguimos hasta la aprobación.',
  'Conocimiento del territorio: trabajamos con los datos de su municipio, su estrategia de desarrollo y su realidad, no con modelos copiados.'
];
const PASOS_SIGUIENTES = [
  'Apruebe esta propuesta y confirme la fecha de inicio.',
  'Entregue la información inicial que le pediremos en una lista clara (datos del negocio, inversión disponible y documentos que ya tenga).',
  'Revisaremos juntos cada avance antes de cerrar el documento final.',
  'Recibirá los entregables listados y el acompañamiento acordado hasta la aprobación.'
];
const TERMINOS_DEFECTO = 'Validez de esta propuesta: 30 días. Forma de pago: 50% al inicio y 50% a la entrega de los documentos finales. Los precios no incluyen tasas, aranceles ni pagos a terceros ante entidades, que corren por cuenta del cliente. Toda la información entregada por el cliente se trata con confidencialidad.';
const NOTA_FINAL_DEFECTO = 'Contratarnos es la decisión segura: usted recibe documentos serios, un método probado y un acompañamiento que sigue hasta que su proyecto esté aprobado y funcionando. El precio de esta propuesta es menor que el costo de un trámite devuelto, un crédito negado o un negocio que arranca a ciegas. Estamos listos para empezar cuando usted lo decida.';

/* ---------- Funciones puras ---------- */
function num(v) {
  const n = parseFloat(String(v == null ? '' : v).replace(/\s/g, '').replace(',', '.'));
  return isNaN(n) || !isFinite(n) ? 0 : n;
}
function fmt(n) {
  const v = num(n);
  const neg = v < 0 ? '-' : '';
  const parts = Math.abs(v).toFixed(2).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return neg + parts.join(',');
}
function servicioPorId(id) {
  for (let i = 0; i < SERVICIOS.length; i++) if (SERVICIOS[i].id === id) return SERVICIOS[i];
  return null;
}
function normalizar(t) {
  return String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
function buscarServicios(texto, categoria) {
  const q = normalizar(texto);
  return SERVICIOS.filter(function (s) {
    if (categoria && categoria !== 'todas' && s.categoria !== categoria) return false;
    if (!q) return true;
    const hay = normalizar(s.nombre + ' ' + s.resumen + ' ' + s.base);
    return q.split(/\s+/).every(function (pal) { return hay.indexOf(pal) > -1; });
  });
}
/* Cálculo de la ficha. Estado: { lineas[], gastos[], descuento, costoHora,
   indirectosPct }. Cada línea: { servicioId, nombre, detalle, cantidad,
   precio, horas }. */
function calcularFicha(estado) {
  const lineas = (estado.lineas || []).map(function (l) {
    const importe = num(l.cantidad) * num(l.precio);
    return { servicioId: l.servicioId || '', nombre: l.nombre || '', detalle: l.detalle || '', cantidad: num(l.cantidad), precio: num(l.precio), horas: num(l.horas), importe: importe };
  });
  const subtotalServicios = lineas.reduce(function (a, l) { return a + l.importe; }, 0);
  const gastos = (estado.gastos || []).map(function (g) { return { concepto: g.concepto || '', monto: num(g.monto) }; });
  const totalGastos = gastos.reduce(function (a, g) { return a + g.monto; }, 0);
  const subtotal = subtotalServicios + totalGastos;
  const descuentoMonto = subtotal * num(estado.descuento) / 100;
  const total = subtotal - descuentoMonto;
  const horasTotales = lineas.reduce(function (a, l) { return a + l.horas * Math.max(l.cantidad, 0); }, 0);
  const costoHoras = horasTotales * num(estado.costoHora);
  const costoDirecto = costoHoras + totalGastos;
  const costoIndirecto = costoDirecto * num(estado.indirectosPct) / 100;
  const costoTotal = costoDirecto + costoIndirecto;
  const margen = total - costoTotal;
  const margenPct = total > 0 ? (margen / total) * 100 : 0;
  return { lineas: lineas, gastos: gastos, subtotalServicios: subtotalServicios, totalGastos: totalGastos, subtotal: subtotal, descuentoMonto: descuentoMonto, total: total, horasTotales: horasTotales, costoHoras: costoHoras, costoDirecto: costoDirecto, costoIndirecto: costoIndirecto, costoTotal: costoTotal, margen: margen, margenPct: margenPct };
}
function actorNombre(id) {
  for (let i = 0; i < ACTORES.length; i++) if (ACTORES[i].id === id) return ACTORES[i].nombre;
  return '';
}
function lineaEdmNombre(id) {
  for (let i = 0; i < LINEAS_EDM.length; i++) if (LINEAS_EDM[i].id === id) return LINEAS_EDM[i].nombre;
  return '';
}
function programaEdmNombre(id) {
  for (let i = 0; i < PROGRAMAS_EDM.length; i++) if (PROGRAMAS_EDM[i].id === id) return PROGRAMAS_EDM[i].nombre;
  return '';
}
/* Resumen ejecutivo del informe. Lo que falta queda marcado [A COMPLETAR],
   como manda la regla del redactor de FactiCuba: nunca se inventa. */
function textoResumenEjecutivo(estado, totales) {
  const cliente = String(estado.clienteNombre || '').trim() || '[A COMPLETAR: nombre del cliente]';
  const proyecto = String(estado.proyecto || '').trim() || '[A COMPLETAR: nombre del proyecto]';
  const actor = actorNombre(estado.actor) || '[A COMPLETAR: forma de gestión]';
  const nombres = totales.lineas.filter(function (l) { return l.nombre; }).map(function (l) { return l.nombre; });
  const lista = nombres.length
    ? (nombres.length === 1 ? nombres[0] : nombres.slice(0, -1).join(', ') + ' y ' + nombres[nombres.length - 1])
    : '[A COMPLETAR: servicios contratados]';
  return 'La presente propuesta se prepara para ' + cliente + ' (' + actor + '), para el proyecto «' + proyecto + '». ' +
    'El encargo comprende: ' + lista + '. ' +
    'Cada servicio se describe en este informe paso a paso, con sus entregables y su base normativa, para que el cliente sepa exactamente qué trabajo respalda cada importe. ' +
    'La inversión total del encargo es de ' + fmt(totales.total) + ' CUP, con vigencia de ' + (num(estado.validez) || 30) + ' días. ' +
    'El trabajo se entrega en documentos listos para presentar ante el gobierno municipal y el banco, en lenguaje claro y con los datos reales del territorio.';
}

/* ---------- Exportación ---------- */
const API = { ACTORES: ACTORES, CATEGORIAS: CATEGORIAS, LINEAS_EDM: LINEAS_EDM, PROGRAMAS_EDM: PROGRAMAS_EDM, SERVICIOS: SERVICIOS, PORQUE: PORQUE, PASOS_SIGUIENTES: PASOS_SIGUIENTES, TERMINOS_DEFECTO: TERMINOS_DEFECTO, NOTA_FINAL_DEFECTO: NOTA_FINAL_DEFECTO, num: num, fmt: fmt, servicioPorId: servicioPorId, normalizar: normalizar, buscarServicios: buscarServicios, calcularFicha: calcularFicha, actorNombre: actorNombre, lineaEdmNombre: lineaEdmNombre, programaEdmNombre: programaEdmNombre, textoResumenEjecutivo: textoResumenEjecutivo };
if (typeof module !== 'undefined' && module.exports) { module.exports = API; }
raiz.FichaDatos = API;

})(typeof window !== 'undefined' ? window : globalThis);
