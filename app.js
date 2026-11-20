/* ============================================================================
   Ficha de Costo · Consultoría — capa de pantalla.
   Estado único: cada dato se escribe una vez y alimenta la ficha, la
   factura y el informe. Guardado automático en localStorage.
   ============================================================================ */
(function () {
'use strict';
const D = window.FichaDatos;
const LS_KEY = 'fichaCostoConsultoria.v1';
/* ---------- Respaldo en la nube (Supabase) ----------
   El catálogo sigue en datos.js; lo que viaja a la nube es el estado
   de la ficha (respaldo por usuario, como el resto de las apps). */
const SUPA_URL = 'https://uczlkdzvzbqgzzlhcmro.supabase.co';
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjemxrZHp2emJxZ3p6bGhjbXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUxMzU2ODAsImV4cCI6MjExMDcxMTY4MH0.3xwFjVbL-Usa9hohxU0u__alXH8ZsdsJhH5CWllkH1M';
const SUPA_REST = SUPA_URL + '/rest/v1/fichas';
let nubeOk = false;
let nubeTimer = null;
function nubeUsuario() {
  try { return localStorage.getItem('fichacosto_session') || 'admin'; } catch (e) { return 'admin'; }
}
function nubePintar() {
  const d = $('nubeDot'); const t = $('nubeTxt');
  if (d) d.style.background = nubeOk ? '#22c55e' : '#ef4444';
  if (t) t.textContent = nubeOk ? 'Nube: conectado' : 'Nube: sin conexión';
}
function nubeSalud() {
  return fetch(SUPA_REST + '?select=id&limit=1', { headers: { apikey: SUPA_ANON, Authorization: 'Bearer ' + SUPA_ANON } })
    .then(function (r) { nubeOk = r.ok; nubePintar(); })
    .catch(function () { nubeOk = false; nubePintar(); });
}
function nubeProgramar() {
  clearTimeout(nubeTimer);
  nubeTimer = setTimeout(nubeEnviar, 2500);
}
function nubeEnviar() {
  return fetch(SUPA_REST + '?on_conflict=usuario', {
    method: 'POST',
    headers: { apikey: SUPA_ANON, Authorization: 'Bearer ' + SUPA_ANON, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ usuario: nubeUsuario(), estado: estado, fecha_guardado: new Date().toISOString() })
  }).then(function (r) { nubeOk = r.ok; nubePintar(); })
    .catch(function () { nubeOk = false; nubePintar(); });
}
function nubeRestaurar() {
  fetch(SUPA_REST + '?usuario=eq.' + encodeURIComponent(nubeUsuario()) + '&select=estado,fecha_guardado', { headers: { apikey: SUPA_ANON, Authorization: 'Bearer ' + SUPA_ANON } })
    .then(function (r) { if (!r.ok) throw new Error('sin respuesta'); return r.json(); })
    .then(function (filas) {
      if (!filas || !filas.length || !filas[0].estado) { window.alert('Todavía no hay ningún respaldo en la nube para este usuario.'); return; }
      const f = filas[0];
      if (!window.confirm('Se restaurará la ficha guardada en la nube' + (f.fecha_guardado ? ' el ' + String(f.fecha_guardado).slice(0, 10) : '') + '. Lo que haya en este equipo se reemplazará. ¿Continuar?')) return;
      const base = estadoInicial();
      Object.keys(base).forEach(function (k) { if (f.estado[k] !== undefined) base[k] = f.estado[k]; });
      if (!Array.isArray(base.lineas)) base.lineas = [];
      if (!Array.isArray(base.gastos) || !base.gastos.length) base.gastos = [{ concepto: '', monto: '' }];
      estado = base;
      guardar();
      pintarCampos(); pintarChips(); pintarCatalogo(); pintarLineas(); pintarGastos();
      activarTab(estado.tab || 'ficha'); recalcular();
      window.alert('✅ Ficha restaurada desde la nube.');
    })
    .catch(function () { window.alert('No se pudo leer la nube. Revisa la conexión e inténtalo de nuevo.'); });
}
const $ = function (id) { return document.getElementById(id); };

function hoyISO() {
  const f = new Date();
  return f.getFullYear() + '-' + String(f.getMonth() + 1).padStart(2, '0') + '-' + String(f.getDate()).padStart(2, '0');
}
function estadoInicial() {
  return {
    emisorNombre: 'FRANWE S.U.R.L.', emisorDetalle: '',
    clienteNombre: '', actor: '', clienteContacto: '', proyecto: '',
    lineaEdm: '', programaEdm: '',
    numero: 'FC-' + new Date().getFullYear() + '-001', fecha: hoyISO(), validez: 30,
    lineas: [], gastos: [{ concepto: '', monto: '' }],
    costoHora: 350, indirectosPct: 15, descuento: 0,
    formaPago: '50% al inicio y 50% a la entrega de los documentos finales', notasFactura: '',
    notaFinal: D.NOTA_FINAL_DEFECTO,
    tab: 'ficha', catFiltro: 'todas', busca: ''
  };
}
function cargarEstado() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return estadoInicial();
    const s = JSON.parse(raw);
    const base = estadoInicial();
    Object.keys(base).forEach(function (k) { if (s[k] !== undefined) base[k] = s[k]; });
    if (!Array.isArray(base.lineas)) base.lineas = [];
    if (!Array.isArray(base.gastos) || !base.gastos.length) base.gastos = [{ concepto: '', monto: '' }];
    return base;
  } catch (e) { return estadoInicial(); }
}
let estado = cargarEstado();
let guardarTimer = null;
function guardar() {
  clearTimeout(guardarTimer);
  guardarTimer = setTimeout(function () {
    try { localStorage.setItem(LS_KEY, JSON.stringify(estado)); } catch (e) { /* sin almacenamiento: la app sigue */ }
  }, 250);
  nubeProgramar();
}
function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function falta(etiqueta) { return '<span class="pendiente">[A COMPLETAR: ' + esc(etiqueta) + ']</span>'; }
function fechaLarga(iso) {
  try {
    const d = new Date(String(iso) + 'T00:00:00');
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (e) { return ''; }
}

/* ---------- Pestañas ---------- */
function activarTab(nombre) {
  estado.tab = nombre;
  document.querySelectorAll('.tab-btn').forEach(function (b) {
    const on = b.getAttribute('data-tab') === nombre;
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.toggle('activo', p.id === 'panel-' + nombre); });
  guardar();
}
document.querySelectorAll('.tab-btn').forEach(function (b) {
  b.addEventListener('click', function () { activarTab(b.getAttribute('data-tab')); });
});
$('btnIrFactura').addEventListener('click', function () { activarTab('factura'); window.scrollTo({ top: 0 }); });
$('btnIrInforme').addEventListener('click', function () { activarTab('informe'); window.scrollTo({ top: 0 }); });

/* ---------- Catálogo ---------- */
function pintarChips() {
  const box = $('chipsCat');
  box.innerHTML = '';
  const todas = [{ id: 'todas', nombre: 'Todos' }].concat(D.CATEGORIAS);
  todas.forEach(function (c) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip-cat';
    b.textContent = c.nombre;
    b.setAttribute('aria-pressed', estado.catFiltro === c.id ? 'true' : 'false');
    b.addEventListener('click', function () { estado.catFiltro = c.id; pintarChips(); pintarCatalogo(); guardar(); });
    box.appendChild(b);
  });
}
function pintarCatalogo() {
  const lista = D.buscarServicios(estado.busca, estado.catFiltro);
  const box = $('listaCatalogo');
  if (!lista.length) {
    box.innerHTML = '<p class="note">Sin servicios para esa búsqueda. Pruebe otra palabra o añada una línea libre abajo.</p>';
    return;
  }
  box.innerHTML = lista.map(function (s) {
    const cat = (D.CATEGORIAS.filter(function (c) { return c.id === s.categoria; })[0] || {}).nombre || '';
    const pasos = s.pasos.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('');
    const ents = s.entregables.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('');
    return '<div class="serv-card">'
      + '<h3>' + esc(s.nombre) + '</h3>'
      + '<div class="meta">' + esc(cat) + ' · por ' + esc(s.unidad) + ' · ' + esc(s.horas) + ' horas estimadas</div>'
      + '<p>' + esc(s.resumen) + '</p>'
      + '<details><summary>Ver qué se hace paso a paso y qué se entrega</summary>'
      + '<ol>' + pasos + '</ol>'
      + '<p style="margin:6px 0 0"><strong>Entregables:</strong></p><ul>' + ents + '</ul>'
      + '<p class="note" style="margin:6px 0 0">Base: ' + esc(s.base) + '</p>'
      + '</details>'
      + '<div class="serv-foot"><span class="serv-precio">' + D.fmt(s.precio) + ' CUP <span class="note">/ ' + esc(s.unidad) + ' · editable</span></span>'
      + '<button type="button" class="btn btn-navy btn-sm" data-add="' + esc(s.id) + '">+ Añadir a la ficha</button></div>'
      + '</div>';
  }).join('');
  box.querySelectorAll('[data-add]').forEach(function (b) {
    b.addEventListener('click', function () {
      const s = D.servicioPorId(b.getAttribute('data-add'));
      if (!s) return;
      estado.lineas.push({ servicioId: s.id, nombre: s.nombre, detalle: s.resumen, cantidad: 1, precio: s.precio, horas: s.horas });
      pintarLineas(); recalcular();
      document.getElementById('tbodyLineas').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}
$('buscaServicio').addEventListener('input', function (e) { estado.busca = e.target.value; pintarCatalogo(); guardar(); });

/* ---------- Líneas de servicios ---------- */
function pintarLineas() {
  const tb = $('tbodyLineas');
  if (!estado.lineas.length) {
    tb.innerHTML = '<tr><td colspan="6" class="note" style="padding:14px 8px">Sin servicios todavía. Añada desde el catálogo de arriba o con «Añadir línea libre».</td></tr>';
    return;
  }
  tb.innerHTML = estado.lineas.map(function (l, i) {
    const imp = D.num(l.cantidad) * D.num(l.precio);
    return '<tr data-i="' + i + '">'
      + '<td><input class="inp" data-campo="nombre" value="' + esc(l.nombre) + '" placeholder="Servicio" style="font-weight:600">'
      + '<input class="inp" data-campo="detalle" value="' + esc(l.detalle) + '" placeholder="Detalle breve (sale en la factura y el informe)" style="margin-top:4px;font-size:12.5px;color:#6b7280"></td>'
      + '<td><input class="inp inp-num" data-campo="cantidad" type="number" min="0" step="any" value="' + esc(l.cantidad) + '"></td>'
      + '<td><input class="inp inp-num" data-campo="precio" type="number" min="0" step="any" value="' + esc(l.precio) + '"></td>'
      + '<td class="num" style="font-weight:700;padding-right:10px">' + D.fmt(imp) + '</td>'
      + '<td><input class="inp inp-num" data-campo="horas" type="number" min="0" step="any" value="' + esc(l.horas) + '"></td>'
      + '<td><button type="button" class="row-del" data-del title="Eliminar línea">×</button></td></tr>';
  }).join('');
}
$('tbodyLineas').addEventListener('input', function (ev) {
  const inp = ev.target.closest('input');
  if (!inp) return;
  const tr = inp.closest('tr');
  const i = parseInt(tr.getAttribute('data-i'), 10);
  const campo = inp.getAttribute('data-campo');
  if (!['nombre', 'detalle', 'cantidad', 'precio', 'horas'].includes(campo)) return;
  estado.lineas[i][campo] = inp.value;
  if (campo === 'cantidad' || campo === 'precio') {
    tr.querySelectorAll('td')[3].textContent = D.fmt(D.num(estado.lineas[i].cantidad) * D.num(estado.lineas[i].precio));
  }
  recalcular();
});
$('tbodyLineas').addEventListener('click', function (ev) {
  const btn = ev.target.closest('[data-del]');
  if (!btn) return;
  const i = parseInt(btn.closest('tr').getAttribute('data-i'), 10);
  estado.lineas.splice(i, 1);
  pintarLineas(); recalcular();
});
$('btnAddLinea').addEventListener('click', function () {
  estado.lineas.push({ servicioId: '', nombre: '', detalle: '', cantidad: 1, precio: '', horas: '' });
  pintarLineas(); recalcular();
});

/* ---------- Gastos directos ---------- */
function pintarGastos() {
  $('tbodyGastos').innerHTML = estado.gastos.map(function (g, i) {
    return '<tr data-i="' + i + '">'
      + '<td><input class="inp" data-campo="concepto" value="' + esc(g.concepto) + '" placeholder="Ej.: Transporte al municipio"></td>'
      + '<td><input class="inp inp-num" data-campo="monto" type="number" min="0" step="any" value="' + esc(g.monto) + '"></td>'
      + '<td><button type="button" class="row-del" data-del title="Eliminar gasto">×</button></td></tr>';
  }).join('');
}
$('tbodyGastos').addEventListener('input', function (ev) {
  const inp = ev.target.closest('input');
  if (!inp) return;
  const i = parseInt(inp.closest('tr').getAttribute('data-i'), 10);
  estado.gastos[i][inp.getAttribute('data-campo')] = inp.value;
  recalcular();
});
$('tbodyGastos').addEventListener('click', function (ev) {
  const btn = ev.target.closest('[data-del]');
  if (!btn) return;
  estado.gastos.splice(parseInt(btn.closest('tr').getAttribute('data-i'), 10), 1);
  if (!estado.gastos.length) estado.gastos.push({ concepto: '', monto: '' });
  pintarGastos(); recalcular();
});
$('btnAddGasto').addEventListener('click', function () { estado.gastos.push({ concepto: '', monto: '' }); pintarGastos(); recalcular(); });

/* ---------- Campos simples ---------- */
function enlazar(id, clave, esNumero) {
  $(id).addEventListener('input', function (e) {
    estado[clave] = esNumero ? e.target.value : e.target.value;
    recalcular();
  });
  $(id).addEventListener('change', function (e) { estado[clave] = e.target.value; recalcular(); });
}
['emisorNombre', 'emisorDetalle', 'clienteNombre', 'clienteContacto', 'proyecto', 'numero', 'fecha', 'formaPago', 'notasFactura'].forEach(function (id) { enlazar(id, id); });
['validez', 'costoHora', 'indirectosPct', 'descuento'].forEach(function (id) { enlazar(id, id, true); });
$('clienteActor').addEventListener('change', function (e) { estado.actor = e.target.value; recalcular(); });
$('lineaEdm').addEventListener('change', function (e) { estado.lineaEdm = e.target.value; recalcular(); });
$('programaEdm').addEventListener('change', function (e) { estado.programaEdm = e.target.value; recalcular(); });
$('notaFinal').addEventListener('input', function (e) { estado.notaFinal = e.target.value; recalcular(); });
function pintarCampos() {
  $('emisorNombre').value = estado.emisorNombre;
  $('emisorDetalle').value = estado.emisorDetalle;
  $('clienteNombre').value = estado.clienteNombre;
  $('clienteContacto').value = estado.clienteContacto;
  $('proyecto').value = estado.proyecto;
  $('numero').value = estado.numero;
  $('fecha').value = estado.fecha;
  $('validez').value = estado.validez;
  $('costoHora').value = estado.costoHora;
  $('indirectosPct').value = estado.indirectosPct;
  $('descuento').value = estado.descuento;
  $('formaPago').value = estado.formaPago;
  $('notasFactura').value = estado.notasFactura;
  $('notaFinal').value = estado.notaFinal;
  $('buscaServicio').value = estado.busca;
  const sel = $('clienteActor');
  sel.innerHTML = '<option value="">Seleccione…</option>' + D.ACTORES.map(function (a) {
    return '<option value="' + esc(a.id) + '"' + (estado.actor === a.id ? ' selected' : '') + '>' + esc(a.nombre) + '</option>';
  }).join('');
  const selL = $('lineaEdm');
  selL.innerHTML = '<option value="">Sin alineación</option>' + D.LINEAS_EDM.map(function (l) {
    return '<option value="' + esc(l.id) + '"' + (estado.lineaEdm === l.id ? ' selected' : '') + '>' + esc(l.nombre) + '</option>';
  }).join('');
  const selP = $('programaEdm');
  selP.innerHTML = '<option value="">Sin programa</option>' + D.PROGRAMAS_EDM.map(function (p) {
    return '<option value="' + esc(p.id) + '"' + (estado.programaEdm === p.id ? ' selected' : '') + '>' + esc(p.nombre) + '</option>';
  }).join('');
}

/* ---------- Recálculo + documentos ---------- */
function lineasConServicio(totales) {
  return totales.lineas.map(function (l) {
    return { linea: l, servicio: l.servicioId ? D.servicioPorId(l.servicioId) : null };
  });
}
/* Alineación del encargo con la EDM: línea y/o programa, o cadena vacía
   si no se eligió ninguna (la alineación es opcional y no se marca
   como pendiente: no todo encargo responde a una línea estratégica). */
function textoAlineacion() {
  const partes = [D.lineaEdmNombre(estado.lineaEdm), D.programaEdmNombre(estado.programaEdm)].filter(function (x) { return x; });
  return partes.join(' · ');
}
function renderFactura(totales) {
  const cliente = estado.clienteNombre.trim() ? esc(estado.clienteNombre.trim()) : falta('nombre del cliente');
  const actor = D.actorNombre(estado.actor) ? esc(D.actorNombre(estado.actor)) : falta('forma de gestión');
  const filas = lineasConServicio(totales).map(function (x, i) {
    const l = x.linea;
    const det = l.detalle ? '<div style="font-size:12.5px;color:#6b7280">' + esc(l.detalle) + '</div>' : '';
    return '<tr><td>' + (i + 1) + '</td><td><strong>' + esc(l.nombre || 'Servicio') + '</strong>' + det + '</td><td class="num">' + esc(l.cantidad) + '</td><td class="num">' + D.fmt(l.precio) + '</td><td class="num">' + D.fmt(l.importe) + '</td></tr>';
  }).join('');
  const filasG = totales.gastos.filter(function (g) { return g.concepto.trim() || g.monto > 0; }).map(function (g) {
    return '<tr><td></td><td><strong>' + esc(g.concepto) + '</strong><div style="font-size:12.5px;color:#6b7280">Gasto directo del encargo</div></td><td class="num">1</td><td class="num">' + D.fmt(g.monto) + '</td><td class="num">' + D.fmt(g.monto) + '</td></tr>';
  }).join('');
  $('docFactura').innerHTML =
    '<div class="doc-head"><div class="emisor"><h3>' + esc(estado.emisorNombre.trim() || 'Emisor') + '</h3>'
    + (estado.emisorDetalle.trim() ? '<p>' + esc(estado.emisorDetalle.trim()) + '</p>' : '')
    + '<p>Consultoría y creación de negocios · Cuba</p></div>'
    + '<div class="doc-titulo"><h2>Factura</h2><p>Nº ' + (estado.numero.trim() ? esc(estado.numero.trim()) : falta('número')) + '</p><p>Fecha: ' + esc(fechaLarga(estado.fecha) || '—') + '</p><p>Validez: ' + esc(D.num(estado.validez) || 30) + ' días</p></div></div>'
    + '<div class="doc-dos-col"><div class="doc-bloque"><h4>Facturar a</h4><p><strong>' + cliente + '</strong></p><p>' + actor + '</p>' + (estado.clienteContacto.trim() ? '<p>' + esc(estado.clienteContacto.trim()) + '</p>' : '') + '</div>'
    + '<div class="doc-bloque"><h4>Proyecto</h4><p>' + (estado.proyecto.trim() ? esc(estado.proyecto.trim()) : falta('nombre del proyecto')) + '</p>' + (textoAlineacion() ? '<p>' + esc(textoAlineacion()) + '</p>' : '') + '<p>Forma de pago: ' + esc(estado.formaPago.trim() || 'A convenir') + '</p></div></div>'
    + '<table class="doc-tabla"><thead><tr><th style="width:34px">#</th><th>Descripción</th><th class="num" style="width:56px">Cant.</th><th class="num" style="width:110px">Precio unit.</th><th class="num" style="width:120px">Importe (CUP)</th></tr></thead><tbody>'
    + (filas || '<tr><td colspan="5">Sin servicios. Añada servicios en la pestaña «Ficha de costo».</td></tr>') + filasG + '</tbody></table>'
    + '<table class="doc-tabla" style="max-width:340px;margin-left:auto"><tbody>'
    + '<tr><td>Subtotal de servicios</td><td class="num">' + D.fmt(totales.subtotalServicios) + '</td></tr>'
    + '<tr><td>Gastos directos</td><td class="num">' + D.fmt(totales.totalGastos) + '</td></tr>'
    + (totales.descuentoMonto > 0 ? '<tr><td>Descuento (' + D.fmt(estado.descuento) + ' %)</td><td class="num">−' + D.fmt(totales.descuentoMonto) + '</td></tr>' : '')
    + '<tr class="total"><td>Total a pagar (CUP)</td><td class="num">' + D.fmt(totales.total) + '</td></tr>'
    + '</tbody></table>'
    + '<div class="doc-nota"><strong>Notas.</strong> ' + esc(D.TERMINOS_DEFECTO) + (estado.notasFactura.trim() ? '<br>' + esc(estado.notasFactura.trim()) : '') + '</div>'
    + '<div class="firma"><div><div class="linea">Por el prestador del servicio</div></div><div><div class="linea">Conforme el cliente</div></div></div>';
}
function renderInforme(totales) {
  const cliente = estado.clienteNombre.trim() ? esc(estado.clienteNombre.trim()) : falta('nombre del cliente');
  const proyecto = estado.proyecto.trim() ? esc(estado.proyecto.trim()) : falta('nombre del proyecto');
  const actor = D.actorNombre(estado.actor) ? esc(D.actorNombre(estado.actor)) : falta('forma de gestión');
  const bloques = lineasConServicio(totales).map(function (x) {
    const l = x.linea, s = x.servicio;
    let inner = '<h4>' + esc(l.nombre || 'Servicio') + ' <span class="precio">· ' + D.fmt(l.importe) + ' CUP</span></h4>';
    inner += '<p>' + esc(l.detalle || (s ? s.resumen : '')) + '</p>';
    if (s) {
      inner += '<p style="margin:8px 0 0"><strong>Qué se hace, paso a paso:</strong></p><ol>' + s.pasos.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ol>';
      inner += '<div class="ent"><strong>Qué recibe usted:</strong> ' + esc(s.entregables.join('; ')) + '.</div>';
      inner += '<div class="base">Base: ' + esc(s.base) + '</div>';
    } else if (l.detalle) {
      inner += '<div class="ent">El detalle de este servicio se acuerda directamente con el cliente antes de iniciar.</div>';
    }
    return '<div class="inf-servicio">' + inner + '</div>';
  }).join('');
  const filasInv = totales.lineas.map(function (l) {
    return '<tr><td>' + esc(l.nombre || 'Servicio') + '</td><td class="num">' + esc(l.cantidad) + '</td><td class="num">' + D.fmt(l.precio) + '</td><td class="num">' + D.fmt(l.importe) + '</td></tr>';
  }).join('');
  const filasG = totales.gastos.filter(function (g) { return g.concepto.trim() || g.monto > 0; }).map(function (g) {
    return '<tr><td>' + esc(g.concepto) + ' (gasto directo)</td><td class="num">1</td><td class="num">' + D.fmt(g.monto) + '</td><td class="num">' + D.fmt(g.monto) + '</td></tr>';
  }).join('');
  $('docInforme').innerHTML =
    '<div class="inf-portada"><div class="kicker">Propuesta de servicios · ' + esc(estado.emisorNombre.trim() || 'Consultoría') + '</div>'
    + '<h2>Informe y propuesta: ' + proyecto + '</h2>'
    + '<p>Cliente: <strong>' + cliente + '</strong> · ' + actor + '</p>'
    + '<p>Fecha: ' + esc(fechaLarga(estado.fecha) || '—') + ' · Propuesta Nº ' + (estado.numero.trim() ? esc(estado.numero.trim()) : falta('número')) + ' · Validez: ' + esc(D.num(estado.validez) || 30) + ' días</p></div>'
    + '<div class="inf-sec"><h3>Resumen ejecutivo</h3><p>' + esc(D.textoResumenEjecutivo(estado, totales)) + '</p></div>'
    + (textoAlineacion() ? '<div class="inf-sec"><h3>Alineación con la Estrategia de Desarrollo Municipal</h3><p>Este encargo responde a la Estrategia de Desarrollo Municipal 2026-2030 (' + esc(textoAlineacion()) + '). Los servicios contratados se diseñan y se presentan en ese marco, para que el proyecto encaje en las prioridades del municipio y en su evaluación ante el CAM.</p></div>' : '')
    + '<div class="inf-sec"><h3>Qué incluye el encargo, servicio por servicio</h3>'
    + (bloques || '<p>Añada servicios en la pestaña «Ficha de costo» para generar esta sección.</p>') + '</div>'
    + '<div class="inf-sec"><h3>Inversión total</h3>'
    + '<table class="doc-tabla"><thead><tr><th>Concepto</th><th class="num">Cant.</th><th class="num">Precio unit.</th><th class="num">Importe (CUP)</th></tr></thead><tbody>' + filasInv + filasG + '</tbody></table>'
    + '<table class="doc-tabla" style="max-width:340px;margin-left:auto"><tbody>'
    + '<tr><td>Subtotal</td><td class="num">' + D.fmt(totales.subtotal) + '</td></tr>'
    + (totales.descuentoMonto > 0 ? '<tr><td>Descuento (' + D.fmt(estado.descuento) + ' %)</td><td class="num">−' + D.fmt(totales.descuentoMonto) + '</td></tr>' : '')
    + '<tr class="total"><td>Inversión total (CUP)</td><td class="num">' + D.fmt(totales.total) + '</td></tr>'
    + '</tbody></table></div>'
    + '<div class="inf-sec"><h3>Por qué contratarnos</h3><ul>' + D.PORQUE.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></div>'
    + '<div class="inf-sec"><h3>Próximos pasos</h3><ol>' + D.PASOS_SIGUIENTES.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ol></div>'
    + '<div class="inf-sec"><h3>Condiciones</h3><p>' + esc(D.TERMINOS_DEFECTO) + '</p></div>'
    + '<div class="inf-cita">' + esc(estado.notaFinal.trim() || D.NOTA_FINAL_DEFECTO) + '</div>'
    + '<div class="firma"><div><div class="linea">Por el prestador del servicio</div></div><div><div class="linea">Conforme el cliente</div></div></div>';
}
function buildPrintFicha(totales) {
  const filas = totales.lineas.map(function (l, i) {
    return '<tr><td>' + (i + 1) + '</td><td><strong>' + esc(l.nombre || 'Servicio') + '</strong>' + (l.detalle ? '<div style="font-size:12px;color:#555">' + esc(l.detalle) + '</div>' : '') + '</td><td class="num">' + esc(l.cantidad) + '</td><td class="num">' + D.fmt(l.precio) + '</td><td class="num">' + D.fmt(l.importe) + '</td><td class="num">' + esc(l.horas) + '</td></tr>';
  }).join('');
  const filasG = totales.gastos.filter(function (g) { return g.concepto.trim() || g.monto > 0; }).map(function (g) {
    return '<tr><td>' + esc(g.concepto) + '</td><td class="num">' + D.fmt(g.monto) + '</td></tr>';
  }).join('');
  $('printFicha').innerHTML =
    '<div class="doc-head"><div class="emisor"><h3>' + esc(estado.emisorNombre.trim() || 'Emisor') + '</h3><p>Consultoría y creación de negocios · Cuba</p></div>'
    + '<div class="doc-titulo"><h2>Ficha de costo</h2><p>Nº ' + (estado.numero.trim() ? esc(estado.numero.trim()) : falta('número')) + '</p><p>Fecha: ' + esc(fechaLarga(estado.fecha) || '—') + '</p></div></div>'
    + '<p>Cliente: <strong>' + (estado.clienteNombre.trim() ? esc(estado.clienteNombre.trim()) : falta('nombre del cliente')) + '</strong> · Proyecto: ' + (estado.proyecto.trim() ? esc(estado.proyecto.trim()) : falta('nombre del proyecto')) + '</p>'
    + (textoAlineacion() ? '<p>Alineación EDM: ' + esc(textoAlineacion()) + '</p>' : '')
    + '<table class="doc-tabla"><thead><tr><th>#</th><th>Servicio</th><th class="num">Cant.</th><th class="num">Precio unit.</th><th class="num">Importe (CUP)</th><th class="num">Horas</th></tr></thead><tbody>' + (filas || '<tr><td colspan="6">Sin servicios.</td></tr>') + '</tbody></table>'
    + (filasG ? '<table class="doc-tabla"><thead><tr><th>Gasto directo</th><th class="num">Monto (CUP)</th></tr></thead><tbody>' + filasG + '</tbody></table>' : '')
    + '<table class="doc-tabla" style="max-width:360px;margin-left:auto"><tbody>'
    + '<tr><td>Servicios</td><td class="num">' + D.fmt(totales.subtotalServicios) + '</td></tr>'
    + '<tr><td>Gastos directos</td><td class="num">' + D.fmt(totales.totalGastos) + '</td></tr>'
    + '<tr><td>Subtotal</td><td class="num">' + D.fmt(totales.subtotal) + '</td></tr>'
    + (totales.descuentoMonto > 0 ? '<tr><td>Descuento</td><td class="num">−' + D.fmt(totales.descuentoMonto) + '</td></tr>' : '')
    + '<tr class="total"><td>Total (CUP)</td><td class="num">' + D.fmt(totales.total) + '</td></tr>'
    + '</tbody></table>'
    + '<div class="doc-nota"><strong>Uso interno.</strong> Horas estimadas: ' + D.fmt(totales.horasTotales) + ' · Costo de horas: ' + D.fmt(totales.costoHoras) + ' CUP · Costo total interno: ' + D.fmt(totales.costoTotal) + ' CUP · Margen estimado: ' + D.fmt(totales.margen) + ' CUP (' + D.fmt(totales.margenPct) + ' %).</div>';
}
function recalcular() {
  const totales = D.calcularFicha(estado);
  $('rSubServicios').textContent = D.fmt(totales.subtotalServicios);
  $('rGastos').textContent = D.fmt(totales.totalGastos);
  $('rSubtotal').textContent = D.fmt(totales.subtotal);
  $('rDescuento').textContent = D.fmt(totales.descuentoMonto);
  $('rHoras').textContent = D.fmt(totales.horasTotales);
  $('rCostoHoras').textContent = D.fmt(totales.costoHoras);
  $('rCostoTotal').textContent = D.fmt(totales.costoTotal);
  $('rMargen').textContent = D.fmt(totales.margen);
  $('rMargenPct').textContent = D.fmt(totales.margenPct) + ' %';
  $('rTotal').textContent = D.fmt(totales.total);
  $('rTotalNota').textContent = totales.lineas.length + ' servicio(s) · validez ' + (D.num(estado.validez) || 30) + ' días · importes en CUP';
  renderFactura(totales);
  renderInforme(totales);
  guardar();
}

/* ---------- Impresión ---------- */
$('btnPrintFicha').addEventListener('click', function () { buildPrintFicha(D.calcularFicha(estado)); window.print(); });
$('btnPrintFactura').addEventListener('click', function () { window.print(); });
$('btnPrintInforme').addEventListener('click', function () { window.print(); });
window.addEventListener('beforeprint', function () { buildPrintFicha(D.calcularFicha(estado)); recalcular(); });

/* ---------- Nueva ficha ---------- */
$('btnNueva').addEventListener('click', function () {
  if (!window.confirm('Se borrará la ficha actual y se empezará una nueva. ¿Continuar?')) return;
  const tab = estado.tab;
  estado = estadoInicial();
  estado.tab = tab;
  pintarCampos(); pintarChips(); pintarCatalogo(); pintarLineas(); pintarGastos(); recalcular();
});

/* ---------- Inicio ---------- */
const btnNube = $('btnNubeRestaurar');
if (btnNube) btnNube.addEventListener('click', nubeRestaurar);
nubeSalud();
setInterval(nubeSalud, 120000);
pintarCampos();
pintarChips();
pintarCatalogo();
pintarLineas();
pintarGastos();
activarTab(estado.tab || 'ficha');
recalcular();
})();
