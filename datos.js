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
  { id: 'digital', nombre: 'Soluciones digitales' }
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
      'Estrategia de precios y canales de comercialización recomendados, con la ficha de costo como base.',
      'Informe final con conclusiones y recomendaciones de entrada al mercado.'
    ],
    entregables: ['Informe del estudio de mercado con datos citados', 'Cálculo de demanda insatisfecha por segmento', 'Recomendación de precios y canales'],
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
    entregables: ['Ficha de costo por producto o servicio', 'Precio recomendado con su justificación', 'Ficha editable para actualizar precios'],
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
    entregables: ['Proyección financiera a 5 años', 'Estado de resultados y flujo de caja', 'Modelo editable con supuestos declarados'],
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
      'Entrega de la guía de cierre mensual y de los reportes que debe revisar.'
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
    entregables: ['Análisis de sensibilidad en tres escenarios', 'Matriz de riesgos con mitigación', 'Recomendaciones de decisión'],
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
      'Articulación con el Modelo de Ordenamiento Ambiental: zonificación, usos compatibles con la conservación y Tarea Vida.',
      'Participación y gobernanza: CAM, AMPP, consejos populares, entidades y población en la elaboración, implementación y evaluación.',
      'Disposiciones finales: presentación al CAM, elevación a la AMPP y mecanismo de revisión permanente.'
    ],
    entregables: ['Documento de estrategia con los 11 acápites oficiales', 'Plan de acción anual con presupuesto', 'Tablero de indicadores y evaluación'],
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
      'Calendario inicial de publicaciones y guía de mantenimiento.'
    ],
    entregables: ['Perfiles configurados', 'Plantillas de publicación', 'Calendario inicial y guía'],
    base: 'Canales digitales habituales en Cuba; contenido en español.' }
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
