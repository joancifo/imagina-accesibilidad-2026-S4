# Laboratorio B · Pestañas, formularios y componentes en JavaScript

**65 minutos · tres etapas · 23 barreras · temario 2.10 – 2.11 y 3.11 – 3.18, en HTML y JavaScript**

| Etapa | Carpeta | Qué arregláis | Barreras | Minutos |
|---|---|---|---|---|
| B1 | `labB-1-pestanas` | Pestañas «Pendientes · En curso · Cerradas» con el teclado de la APG | 7 | 0 – 20 |
| B2 | `labB-2-formulario` | Formulario «Identifícate»: etiquetas, errores, foco y éxito | 8 | 20 – 42 |
| B3 | `labB-3-componentes` | Biblioteca de componentes + validación funcional antes y después | 8 | 42 – 65 |

Cada etapa, igual: **rotar roles → el «antes» → arreglar barrera a barrera → comprobador → el «después» → puntos en el chat.**

---

## Etapa B1 · Mis denuncias, con pestañas (`labB-1-pestanas/index.html`)

### 1. El «antes» (persona usuaria · 3 minutos)

1. Con `Tab`, ¿llegas a las pestañas? ¿Puedes cambiar a «Cerradas» sin ratón?
2. Con el lector, ¿qué dice al llegar a «Pendientes»? ¿Sabes que es una pestaña y que está seleccionada?

### 2. Las barreras

| # | Barrera | Criterio WCAG |
|---|---|---|
| 1 | El grupo de pestañas no es una lista de pestañas ni tiene nombre | 4.1.2 · 1.3.1 · A |
| 2 | Las pestañas son `div`: no reciben el foco ni dicen qué son | 2.1.1 Teclado · 4.1.2 · A |
| 3 | La seleccionada solo se distingue por el color | 4.1.2 Nombre, función, valor · A |
| 4 | El panel no está unido a su pestaña | 1.3.1 Información y relaciones · A |
| 5 | Sin roving tabindex: no son una sola parada de Tab | 2.4.3 Orden del foco · A |
| 6 | Las flechas no hacen nada | 2.1.1 Teclado · A (patrón Tabs de la APG) |
| 7 | Inicio y Fin no hacen nada | 2.1.1 Teclado · A (patrón Tabs de la APG) |

### 3. Chuleta

```html
<div class="pestanas" role="tablist" aria-label="Filtrar denuncias por estado">
  <button type="button" class="pestana" role="tab" id="pestana-0" aria-controls="panel"
          aria-selected="true" tabindex="0"
          onclick="seleccionar(0)" onkeydown="alPulsarTecla(event, 0)">Pendientes (2)</button>
  <!-- igual con id="pestana-1" (En curso) y id="pestana-2" (Cerradas): aria-selected="false" y tabindex="-1" -->
</div>
<div class="panel" id="panel" role="tabpanel" aria-labelledby="pestana-0"></div>
```

```css
/* El estilo de la seleccionada sale del mismo atributo que oye el lector */
.pestana[aria-selected="true"] { color: #0725d0; border-bottom-color: #0725d0; font-weight: 700; }
```

```js
function seleccionar(i) {
  pestanas.forEach((pestana, j) => {
    pestana.setAttribute('aria-selected', String(i === j));
    pestana.tabIndex = i === j ? 0 : -1;             // roving tabindex
  });
  panel.setAttribute('aria-labelledby', pestanas[i].id);
  panel.innerHTML = /* …lo que ya había… */;
}

function alPulsarTecla(evento, i) {
  const ultima = pestanas.length - 1;
  let destino = null;
  if (evento.key === 'ArrowRight') destino = i === ultima ? 0 : i + 1;
  if (evento.key === 'ArrowLeft') destino = i === 0 ? ultima : i - 1;
  if (evento.key === 'Home') destino = 0;
  if (evento.key === 'End') destino = ultima;
  if (destino === null) return;       // Tab y las demás teclas siguen su camino
  evento.preventDefault();
  seleccionar(destino);
  pestanas[destino].focus();
}
```

### 4. Retos (+2 cada uno)

- **Para quien no programa:** apuntad la frase exacta que dice el lector en «En curso» antes y después.
- **Para quien programa:** añadid una cuarta pestaña, «Archivadas (1)», con su lista. ¿Habéis tenido que tocar `alPulsarTecla`? (No debería: usa `pestanas.length`).
- **Pro:** con `dir="rtl"` (árabe, hebreo) las flechas van al revés. Haced que `alPulsarTecla` lo tenga en cuenta con `getComputedStyle(…).direction`.

**Chat:** «Grupo N · B1 · X/7 + retos».

---

## Etapa B2 · Identifícate (`labB-2-formulario/index.html`)

### 1. El «antes» (persona usuaria · 3 minutos)

1. Con el lector, recorre los campos con `Tab`. ¿Qué dice en cada uno? ¿Y si ya has escrito algo?
2. Intenta pulsar «Siguiente» sin rellenar nada. ¿Qué pasa? ¿Sabes qué falta?

### 2. Las barreras

| # | Barrera | Criterio WCAG |
|---|---|---|
| 1 | Campos sin etiqueta (placeholder, `div` y `span`) | 1.3.1 · 3.3.2 Etiquetas o instrucciones · 4.1.2 · A |
| 2 | Lo obligatorio solo se ve por el color rojo | 1.4.1 Uso del color · 3.3.2 · A |
| 3 | Nombre, email y teléfono no se pueden autocompletar | 1.3.5 Identificar el propósito de la entrada · AA |
| 4 | La ayuda del teléfono no está asociada | 1.3.1 · 3.3.2 · A |
| 5 | «Siguiente» está desactivado hasta que todo está bien | 3.3.1 Identificación de errores · A |
| 6 | Los errores no se anuncian ni explican qué hacer | 3.3.1 · A · 3.3.3 Sugerencias ante errores · AA |
| 7 | El foco no va al primer error | 3.3.1 · 2.4.3 Orden del foco · A |
| 8 | El éxito aparece en una caja que se crea con el mensaje | 4.1.3 Mensajes de estado · AA |

### 3. Chuleta

```html
<p class="nota">Los campos marcados con asterisco (*) son obligatorios.</p>

<label for="nombre">Nombre y apellidos <span aria-hidden="true">*</span></label>
<input type="text" id="nombre" required autocomplete="name">

<label for="telefono">Teléfono <span aria-hidden="true">*</span></label>
<p class="ayuda" id="ayuda-telefono">9 dígitos, sin espacios…</p>
<input type="tel" id="telefono" required autocomplete="tel" inputmode="numeric"
       aria-describedby="ayuda-telefono" data-ayuda="ayuda-telefono">

<!-- La casilla: <label for="acepto"> en lugar del <span> -->
<button type="submit" class="principal" id="enviar">Siguiente</button>   <!-- sin disabled -->
<p id="resultado" class="exito" role="status"></p>                     <!-- en lugar de zona-exito -->
```

```js
// El contrato del campo, escrito UNA vez: lo usan los cinco campos
function mostrarError(campo) {
  let error = document.getElementById('error-' + campo.id);
  if (!error) {
    error = document.createElement('p');
    error.id = 'error-' + campo.id;
    error.className = 'error';
    campo.closest('.campo').append(error);
  }
  error.textContent = '⚠ ' + MENSAJES[campo.id];       // «Escribe 9 dígitos… Ejemplo: 612345678.»
  campo.setAttribute('aria-invalid', 'true');
  describir(campo, true);                                // aria-describedby = ayuda + error
}

formulario.addEventListener('submit', (e) => {
  e.preventDefault();
  let primero = null;
  campos.forEach((campo) => {
    if (esValido(campo)) limpiarError(campo);
    else { mostrarError(campo); if (!primero) primero = campo; }
  });
  if (primero) { primero.focus(); return; }
  resultado.textContent = 'Datos guardados. Ya puedes pasar al paso 2.';
});
```

El resto (`MENSAJES`, `describir`, `limpiarError` y el aviso al corregir) está en `soluciones/labB-2-formulario/index.html`: copiadlo y leedlo juntos.

### 4. Retos (+2 cada uno)

- **Para quien no programa:** reescribid en la hoja los cinco mensajes de error para que digan **qué hacer** y den un **ejemplo**.
- **Para quien programa:** en lugar de llevar el foco al primer error, mostrad un **resumen de errores** al principio del formulario con un enlace a cada campo (es la reserva R4).
- **Pro:** el email `ana@empresa` (sin punto) ¿debería ser válido? Discutidlo y decidid qué mensaje mostrar.

**Chat:** «Grupo N · B2 · X/8 + retos».

---

## Etapa B3 · La biblioteca de componentes (`labB-3-componentes/`)

La bandeja la pintan siete componentes de `componentes.js`. **Solo se tocan `componentes.js` y `componentes.css`; `app.js` no se toca.** Pilota quien no programa, con copiloto.

### 1. La validación funcional del «antes» (persona usuaria · 7 minutos)

Sin ratón y con el lector. La auditoría apunta ✅ o ❌ y qué pasa en la hoja:

| # | Prueba |
|---|---|
| 1 | `Tab` desde el principio: orden lógico y foco siempre visible |
| 2 | Enlaces: se alcanzan con `Tab` y se abren con `Enter` |
| 3 | Campos: el lector dice el nombre (también con texto escrito) |
| 4 | Botones de icono: el lector dice qué hacen y sobre qué |
| 5 | Botones: funcionan con `Enter` y con `Espacio` |
| 6 | Interruptores: se anuncia si están activados |
| 7 | Encabezados (tecla `H`): la estructura tiene sentido |
| 8 | Mensajes: cada aviso se anuncia |
| 9 | **Nueva · 2.5.3:** el lector dice la misma palabra que se ve en cada botón |
| 10 | **Nueva · 2.1.4:** fuera de un campo, escribir letras sueltas no dispara nada |

### 2. Las barreras (los anti-patrones)

| # | Componente | Anti-patrón | Criterio WCAG |
|---|---|---|---|
| 1 | `Boton` | Un `div` con `onclick` | 2.1.1 · 4.1.2 · A |
| 2 | `Enlace` | Un `a` sin `href` | 2.1.1 · 4.1.2 · A |
| 3 | `BotonIcono` | Recibe la etiqueta… y no la usa | 4.1.2 · 1.1.1 · A |
| 4 | `Icono` | El `svg` no está oculto al lector | 1.1.1 Contenido no textual · A |
| 5 | `CampoBusqueda` | El placeholder hace de etiqueta | 1.3.1 · 3.3.2 · 4.1.2 · A |
| 6 | `Tarjeta` | El título es un `div` en negrita | 1.3.1 · A · 2.4.6 · AA |
| 7 | `Interruptor` | Un `div` que cambia de color | 4.1.2 · 2.1.1 · A |
| 8 | `CampoBusqueda` y CSS | `tabindex="1"` y `outline: none` | 2.4.3 · A · 2.4.7 Foco visible · AA |

### 3. Chuleta (cada línea sustituye al `return` del componente)

```js
// 1 · Boton
return `<button type="button" class="boton ${variante}" onclick="${accion}">${texto}</button>`;
// 2 · Enlace
return `<a class="enlace" href="#${destino}" onclick="ir('${destino}')">${texto}</a>`;
// 3 · BotonIcono
return `<button type="button" class="boton-icono" aria-label="${etiqueta}" onclick="${accion}">${Icono(icono)}</button>`;
// 4 · Icono
return `<svg class="icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONOS[nombre]}</svg>`;
// 5 y 8 · CampoBusqueda (sin placeholder y sin tabindex)
return `<div class="busqueda"><label for="${id}">${etiqueta}</label><input type="search" id="${id}"></div>`;
// 6 · Tarjeta
return `<section class="tarjeta"><h2 class="titulo-tarjeta">${titulo}</h2>${contenido}</section>`;
// 7 · Interruptor
return `<div class="interruptor">
  <button type="button" class="switch" role="switch" id="${id}" aria-checked="${activo}"
          aria-labelledby="${id}-etiqueta" onclick="alternar(this)"></button>
  <span id="${id}-etiqueta">${etiqueta}</span>
</div>`;
// …y alternar():
const activo = interruptor.getAttribute('aria-checked') === 'true';
interruptor.setAttribute('aria-checked', String(!activo));
```

```css
/* 8 · Borrad esta regla de componentes.css */
.boton-icono:focus { outline: none; }
/* 7 · Cambiad .switch.activo por el atributo */
.switch[aria-checked="true"] { background: #0725d0; }
.switch[aria-checked="true"]::after { left: 23px; }
/* 5 · Que la etiqueta se vea encima del campo */
.busqueda label { display: block; font-weight: 600; margin-bottom: 4px; }
```

### 4. El «después» y el entregable

La persona usuaria repite las 10 pruebas; la auditoría completa la columna «después» de la hoja.

### 5. Retos (+2 cada uno)

- **Para quien no programa:** contad cuántos elementos de la página ha arreglado cada cambio (por ejemplo, `BotonIcono` → 5 botones).
- **Para quien programa:** que `BotonIcono` avise en la consola si alguien lo usa **sin etiqueta** (`console.error`). Es lo que en TypeScript sería una propiedad obligatoria.
- **Pro:** escribid el **contrato** de `Interruptor` en la hoja: nombre, rol, estado, teclado y foco.

**Chat:** «Grupo N · B3 · X/8 + retos» y, para la puesta en común, **un anti-patrón de B3 que hayáis visto en un proyecto real**.
