/* ============================================================================
   Ficha de Costo · Consultoría — acceso local.
   Réplica del login de FactiCuba-Datos: solo existe el usuario admin;
   la contraseña se guarda en ESTE equipo (localStorage), como el resto
   del acceso. La primera vez que se entra en un equipo, la contraseña
   escrita queda fijada en ese equipo; después solo abre con ella.
   La sesión también queda guardada en el equipo hasta pulsar «Salir».
   La contraseña NO está escrita en este archivo: vive solo en el
   equipo de quien entra, igual que en las demás páginas.
   ============================================================================ */
(function (raiz) {
'use strict';

const SESSION_KEY = 'fichacosto_session';
const USERS_KEY = 'fichacosto_users';

/* ---------- Lógica pura (probable en Node) ---------- */
/* guardado: contraseña guardada en el equipo, o null si aún no hay. */
function verificarAcceso(usuario, clave, guardado) {
  const u = String(usuario || '').trim();
  const p = String(clave || '');
  if (!u || !p) return { ok: false, error: 'Escriba usuario y contraseña' };
  if (u !== 'admin') return { ok: false, error: 'Solo la cuenta admin está habilitada' };
  if (!guardado) {
    if (p.length < 4) return { ok: false, error: 'La contraseña debe tener 4+ caracteres' };
    return { ok: true, fijar: true };
  }
  if (guardado !== p) return { ok: false, error: 'Contraseña incorrecta' };
  return { ok: true, fijar: false };
}
function validarCambio(actual, nueva, repite, guardado) {
  if (!guardado) return { ok: false, error: 'Este equipo aún no tiene contraseña fijada.' };
  if (actual !== guardado) return { ok: false, error: 'La contraseña actual no es correcta.' };
  if (!nueva || nueva.length < 4) return { ok: false, error: 'La nueva contraseña debe tener 4+ caracteres.' };
  if (nueva !== repite) return { ok: false, error: 'La nueva contraseña no coincide en los dos campos.' };
  return { ok: true };
}

/* ---------- Capa de pantalla (solo corre con DOM) ---------- */
function init() {
  const $ = function (id) { return document.getElementById(id); };
  let toastTimer = null;
  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 3200);
  }
  function loadUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); } catch (e) { return {}; }
  }
  function saveUsers(users) {
    try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch (e) { /* sin almacenamiento */ }
  }
  function showApp(user) {
    $('loginView').style.display = 'none';
    $('appView').style.display = 'block';
    $('userChip').hidden = false;
    $('userNameEl').textContent = user;
    try { localStorage.setItem(SESSION_KEY, user); } catch (e) { /* sin almacenamiento */ }
  }
  function doLogin() {
    const u = $('loginUserInput').value.trim();
    const p = $('loginPassInput').value;
    const users = loadUsers();
    const r = verificarAcceso(u, p, users.admin || null);
    if (!r.ok) return toast(r.error);
    if (r.fijar) {
      users.admin = p;
      saveUsers(users);
      showApp('admin');
      return toast('🔐 Contraseña fijada en este equipo — bienvenido, admin');
    }
    showApp('admin');
    toast('✅ Bienvenido, admin');
  }
  $('loginBtn').addEventListener('click', doLogin);
  $('loginPassInput').addEventListener('keydown', function (e) { if (e.key === 'Enter') doLogin(); });
  $('logoutBtn').addEventListener('click', function () {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) { /* sin almacenamiento */ }
    location.reload();
  });

  /* Cambio de contraseña (solo admin, en este equipo). */
  const modal = $('claveModal');
  function abrirClave() {
    $('claveActual').value = ''; $('claveNueva').value = ''; $('claveRepite').value = '';
    $('claveError').textContent = '';
    modal.style.display = 'flex';
    $('claveActual').focus();
  }
  function cerrarClave() { modal.style.display = 'none'; }
  $('btnClave').addEventListener('click', abrirClave);
  $('claveCerrar').addEventListener('click', cerrarClave);
  modal.addEventListener('click', function (e) { if (e.target === modal) cerrarClave(); });
  $('claveGuardar').addEventListener('click', function () {
    const users = loadUsers();
    const r = validarCambio($('claveActual').value, $('claveNueva').value, $('claveRepite').value, users.admin || null);
    if (!r.ok) { $('claveError').textContent = r.error; return; }
    users.admin = $('claveNueva').value;
    saveUsers(users);
    cerrarClave();
    toast('🔑 Contraseña actualizada');
  });

  /* Sesión previa en este equipo. */
  try {
    const s = localStorage.getItem(SESSION_KEY);
    if (s === 'admin') showApp(s);
    else localStorage.removeItem(SESSION_KEY);
  } catch (e) { /* sin almacenamiento: se pide entrar */ }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}

const API = { verificarAcceso: verificarAcceso, validarCambio: validarCambio, SESSION_KEY: SESSION_KEY, USERS_KEY: USERS_KEY };
if (typeof module !== 'undefined' && module.exports) { module.exports = API; }
raiz.FichaLogin = API;

})(typeof window !== 'undefined' ? window : globalThis);
