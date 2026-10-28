/*
 * app.js · Monta la bandeja con los componentes de la biblioteca.
 * ⚠ En este laboratorio NO se toca este archivo: los arreglos van en componentes.js.
 *   Así se ve que arreglar un componente arregla todos sus usos.
 */
function avisar(mensaje) {
  const aviso = document.getElementById('aviso');
  aviso.textContent = mensaje;
  setTimeout(() => { aviso.textContent = ''; }, 4000);
}

function ir(destino) {
  avisar('Abriendo: ' + destino);
}

document.getElementById('app').innerHTML = `
  <div class="barra">
    ${CampoBusqueda({ id: 'buscar', etiqueta: 'Buscar denuncia' })}
    ${BotonIcono({ icono: 'filtro', etiqueta: 'Filtrar denuncias', accion: "avisar('Filtros abiertos')" })}
    ${Boton({ texto: 'Nueva denuncia', accion: "avisar('Formulario de denuncia nueva')", variante: 'principal' })}
  </div>

  ${Tarjeta({
    titulo: 'B-121 · Acoso laboral',
    contenido: `
      <p>Recibida el 12/10/2026 · En curso</p>
      <div class="fila">
        ${Boton({ texto: 'Ver detalle', accion: "avisar('Detalle de B-121')" })}
        ${BotonIcono({ icono: 'editar', etiqueta: 'Editar B-121', accion: "avisar('Editando B-121')" })}
        ${BotonIcono({ icono: 'eliminar', etiqueta: 'Eliminar B-121', accion: "avisar('B-121 enviada a la papelera')" })}
      </div>`,
  })}

  ${Tarjeta({
    titulo: 'B-118 · Conflicto de intereses',
    contenido: `
      <p>Recibida el 02/10/2026 · En curso</p>
      <div class="fila">
        ${Boton({ texto: 'Ver detalle', accion: "avisar('Detalle de B-118')" })}
        ${BotonIcono({ icono: 'editar', etiqueta: 'Editar B-118', accion: "avisar('Editando B-118')" })}
        ${BotonIcono({ icono: 'eliminar', etiqueta: 'Eliminar B-118', accion: "avisar('B-118 enviada a la papelera')" })}
      </div>`,
  })}

  ${Tarjeta({
    titulo: 'Preferencias de avisos',
    contenido: `
      ${Interruptor({ id: 'aviso-email', etiqueta: 'Avisarme por email cuando cambie el estado', activo: true })}
      ${Interruptor({ id: 'aviso-resumen', etiqueta: 'Recibir un resumen semanal' })}`,
  })}

  <p class="pie">${Enlace({ texto: 'Política del canal', destino: 'politica' })} · ${Enlace({ texto: 'Preguntas frecuentes', destino: 'preguntas' })}</p>
`;
