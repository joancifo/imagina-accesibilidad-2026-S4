/*
 * componentes.js · Biblioteca de componentes del Canal de denuncias (nuestro mini Design System)
 * Joan Cifo · Imagina Formación
 *
 * Cada componente es una función: recibe unas opciones y devuelve el HTML que hay que pintar.
 * app.js los usa muchas veces. Si un componente tiene una barrera, la tienen TODOS sus usos.
 */

const ICONOS = {
  filtro: '<path d="M4 5h16l-6 7v6l-4 2v-8z" fill="none" stroke="currentColor" stroke-width="2"/>',
  editar: '<path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4" fill="none" stroke="currentColor" stroke-width="2"/>',
  eliminar: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" fill="none" stroke="currentColor" stroke-width="2"/>',
};

// Icono SVG de la biblioteca: siempre decorativo; el nombre lo pone quien lo usa
function Icono(nombre) {
  return `<svg class="icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONOS[nombre]}</svg>`;
}

// Botón de texto
function Boton({ texto, accion, variante = 'secundario' }) {
  return `<button type="button" class="boton ${variante}" onclick="${accion}">${texto}</button>`;
}

// Botón que solo lleva un icono: la etiqueta es obligatoria y es su nombre accesible
function BotonIcono({ icono, etiqueta, accion }) {
  if (!etiqueta) console.error('BotonIcono: falta la etiqueta del icono «' + icono + '»');
  return `<button type="button" class="boton-icono" aria-label="${etiqueta}" onclick="${accion}">${Icono(icono)}</button>`;
}

// Enlace a otra sección
function Enlace({ texto, destino }) {
  return `<a class="enlace" href="#${destino}" onclick="ir('${destino}')">${texto}</a>`;
}

// Campo de búsqueda: etiqueta visible y asociada; sin tabindex positivo
function CampoBusqueda({ id, etiqueta }) {
  return `
    <div class="busqueda">
      <label for="${id}">${etiqueta}</label>
      <input type="search" id="${id}">
    </div>`;
}

// Tarjeta con título
function Tarjeta({ titulo, contenido }) {
  return `
    <section class="tarjeta">
      <h2 class="titulo-tarjeta">${titulo}</h2>
      ${contenido}
    </section>`;
}

// Interruptor sí / no: botón con role="switch"; su estado vive en aria-checked
function Interruptor({ id, etiqueta, activo = false }) {
  return `
    <div class="interruptor">
      <button type="button" class="switch" role="switch" id="${id}" aria-checked="${activo}"
              aria-labelledby="${id}-etiqueta" onclick="alternar(this)"></button>
      <span id="${id}-etiqueta">${etiqueta}</span>
    </div>`;
}

function alternar(interruptor) {
  const activo = interruptor.getAttribute('aria-checked') === 'true';
  interruptor.setAttribute('aria-checked', String(!activo));
}
