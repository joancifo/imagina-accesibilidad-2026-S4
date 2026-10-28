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

// Icono SVG de la biblioteca
function Icono(nombre) {
  return `<svg class="icono" viewBox="0 0 24 24">${ICONOS[nombre]}</svg>`;
}

// Botón de texto
function Boton({ texto, accion, variante = 'secundario' }) {
  return `<div class="boton ${variante}" onclick="${accion}">${texto}</div>`;
}

// Botón que solo lleva un icono
function BotonIcono({ icono, etiqueta, accion }) {
  return `<button type="button" class="boton-icono" onclick="${accion}">${Icono(icono)}</button>`;
}

// Enlace a otra sección
function Enlace({ texto, destino }) {
  return `<a class="enlace" onclick="ir('${destino}')">${texto}</a>`;
}

// Campo de búsqueda
function CampoBusqueda({ id, etiqueta }) {
  return `<input type="search" id="${id}" class="busqueda" placeholder="${etiqueta}" tabindex="1">`;
}

// Tarjeta con título
function Tarjeta({ titulo, contenido }) {
  return `
    <div class="tarjeta">
      <div class="titulo-tarjeta">${titulo}</div>
      ${contenido}
    </div>`;
}

// Interruptor sí / no
function Interruptor({ id, etiqueta, activo = false }) {
  return `
    <div class="interruptor">
      <div class="switch ${activo ? 'activo' : ''}" id="${id}" onclick="alternar(this)"></div>
      <span>${etiqueta}</span>
    </div>`;
}

function alternar(interruptor) {
  interruptor.classList.toggle('activo');
}
