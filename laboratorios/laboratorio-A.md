# Laboratorio A · Lo nuevo de WCAG 2.2

**50 minutos · dos etapas · 16 barreras · temario 1.3 (diferencias entre WCAG 2.1 y 2.2), 2.12 – 2.13 y 3.10**

WCAG 2.2 añadió nueve criterios. Seis son de nivel A o AA, los que exige la normativa. Hoy los vais a arreglar todos en dos pantallas del Canal de denuncias, hechas en HTML y JavaScript.

| Etapa | Carpeta | Criterios nuevos | Barreras | Minutos |
|---|---|---|---|---|
| A1 | `labA-1-tareas` | 2.4.11 Foco no oculto · 2.5.7 Movimientos de arrastre · 2.5.8 Tamaño del objetivo | 8 | 0 – 24 |
| A2 | `labA-2-acceso` | 3.3.8 Autenticación accesible · 3.3.7 Entrada redundante · 3.2.6 Ayuda consistente | 8 | 24 – 50 |

Cada etapa, igual: **rotar roles → el «antes» → arreglar barrera a barrera → comprobador → el «después» → puntos en el chat.**

---

## Etapa A1 · Mis tareas de revisión (`labA-1-tareas/index.html`)

Una lista de tareas que se ordena arrastrando, con una cabecera fija arriba y un aviso de cookies fijo abajo.

### 1. El «antes» (persona usuaria · 4 minutos)

1. Haz la ventana del navegador **baja** (que no quepa toda la página).
2. Pulsa `Tab` hasta el final y después `Mayús + Tab` hasta el principio. ¿Hay momentos en los que **no ves dónde está el foco**? Apunta cuáles.
3. Intenta mover la tarea «Cerrar el expediente B-097» al primer puesto **sin ratón**. ¿Puedes?
4. Pasa el ratón sobre la papelera y el lápiz de una tarea. ¿Les darías con el dedo en un móvil? (`F12` → `Ctrl + Mayús + M`).
5. Con el lector: ¿qué dice al llegar a la papelera?

### 2. Las barreras

| # | Barrera | Criterio WCAG |
|---|---|---|
| 1 | La cabecera fija tapa el foco | 2.4.11 Foco no oculto (mínimo) · AA · nuevo |
| 2 | El aviso de cookies tapa el foco | 2.4.11 Foco no oculto (mínimo) · AA · nuevo |
| 3 | Solo se puede reordenar arrastrando | 2.5.7 Movimientos de arrastre · AA · nuevo |
| 4 | Al mover, el foco se pierde | 2.5.7 · 2.4.3 Orden del foco · A |
| 5 | El movimiento no se anuncia | 4.1.3 Mensajes de estado · AA |
| 6 | Botones de 16 × 16 px, pegados | 2.5.8 Tamaño del objetivo (mínimo) · AA · nuevo |
| 7 | Botones de icono sin nombre | 4.1.2 Nombre, función, valor · A |
| 8 | Números de página diminutos y pegados | 2.5.8 Tamaño del objetivo (mínimo) · AA · nuevo |

**Orden recomendado:** primero 1, 2, 6 y 8 (solo CSS: pilota quien no programa) y después 3, 4, 5 y 7 (JavaScript: quien programa de copiloto).

### 3. Chuleta

```css
/* 1 y 2 · El navegador deja este margen al desplazarse hasta el foco */
html { scroll-padding-top: 80px; scroll-padding-bottom: 104px; }

/* 6 · 24 × 24 px como mínimo (aquí 32) y aire entre los dos botones */
.iconos { display: flex; gap: 8px; }
.editar, .eliminar { width: 32px; height: 32px; padding: 6px; border: 0; border-radius: 6px; background: transparent; cursor: pointer; }
.editar svg, .eliminar svg { width: 20px; height: 20px; display: block; }

/* 8 · Números de página */
.paginacion ul { gap: 8px; }
.paginacion a { display: inline-flex; align-items: center; justify-content: center; min-width: 32px; min-height: 32px; }
```

```html
<!-- 5 · Debajo de <ul id="tareas">: la región existe desde el principio -->
<p id="anuncio" class="sr-only" role="status"></p>
```

```js
// 3 y 7 · Dentro de tareaHTML(), en lugar de los dos botones de icono:
<button type="button" class="mover subir" onclick="moverConBoton(${i}, -1)" aria-label="Subir: ${tarea}">Subir</button>
<button type="button" class="mover bajar" onclick="moverConBoton(${i}, 1)" aria-label="Bajar: ${tarea}">Bajar</button>
<span class="iconos">
  <button type="button" class="editar" onclick="editar(${i})" aria-label="Editar: ${tarea}">${ICONO_LAPIZ}</button>
  <button type="button" class="eliminar" onclick="eliminar(${i})" aria-label="Eliminar: ${tarea}">${ICONO_PAPELERA}</button>
</span>
// …y en los dos iconos: <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">

// 4 · Mover con un botón: el foco acompaña a la tarea
function moverConBoton(i, paso) {
  const destino = i + paso;
  if (destino < 0 || destino >= tareas.length) {
    anunciar(`«${tareas[i]}» ya es la ${paso < 0 ? 'primera' : 'última'} tarea.`);
    return;
  }
  mover(i, destino);
  lista.querySelectorAll('.tarea')[destino].querySelector(paso < 0 ? '.subir' : '.bajar').focus();
}

// 5 · Anunciar (y llamar a anunciar al final de mover)
function anunciar(mensaje) {
  document.getElementById('anuncio').textContent = mensaje;
}
// en mover(), después de pintar():
anunciar(`«${tarea}» ahora es la tarea ${hasta + 1} de ${tareas.length}.`);
```

¿Y los botones «Subir» y «Bajar» tienen estilo? Copiad esta regla: `.mover { min-width: 32px; min-height: 32px; background: #fff; color: #0622bc; border: 1px solid #0622bc; border-radius: 6px; padding: 2px 10px; cursor: pointer; font-size: 14px; }`

### 4. Retos (+2 cada uno)

- **Para quien no programa:** con `F12` y la flecha de inspeccionar, medid los botones antes y después. Apuntad las medidas en la hoja.
- **Para quien programa:** al **eliminar** una tarea el foco se pierde (se va al principio de la página). Haced que vaya al «Eliminar» de la tarea que ocupa su lugar, o al `h1` si no quedan tareas (pista: `tabindex="-1"` en el `h1`).
- **Pro:** medid los dos botones del aviso de cookies. ¿Cumplen 2.5.8 por tamaño, por la excepción del espaciado o no cumplen? Razonadlo con el círculo de 24 px.

### 5. El «después» y los puntos

La persona usuaria repite las cinco pruebas del «antes». La portavoz escribe en el chat: **«Grupo N · A1 · X/8 + retos»**.

---

## Etapa A2 · Pide el certificado de tu denuncia (`labA-2-acceso/index.html`)

Un proceso de tres pasos: identificarse, dirección de envío y dirección para las notificaciones.

### 1. El «antes» (persona usuaria · 4 minutos)

1. ¿Puedes **pegar** una contraseña en el campo «Contraseña»? (copia cualquier texto y `Ctrl + V`).
2. ¿El navegador te ofrece rellenar el usuario o la dirección?
3. Lee la «prueba anti-robots». ¿Qué pasaría si tuvieras dislexia o usaras un lector de pantalla?
4. Pasa por los tres pasos. ¿Dónde está la ayuda en cada uno? ¿Siempre en el mismo sitio?
5. En el paso 3, ¿cuántas cosas tienes que volver a escribir?

### 2. Las barreras

| # | Barrera | Criterio WCAG |
|---|---|---|
| 1 | El usuario no se puede autocompletar | 3.3.8 Autenticación accesible (mínima) · AA · nuevo · y 1.3.5 |
| 2 | El gestor de contraseñas no reconoce la contraseña | 3.3.8 · AA · nuevo |
| 3 | No se puede pegar la contraseña | 3.3.8 · AA · nuevo |
| 4 | Hay que resolver una prueba cognitiva (escribir al revés) | 3.3.8 · AA · nuevo |
| 5 | No hay forma de ver lo que escribes en la contraseña | 3.3.8 (técnica recomendada) · 4.1.2 |
| 6 | La dirección de envío no se puede autocompletar | 1.3.5 Identificar el propósito de la entrada · AA |
| 7 | En el paso 3 hay que volver a escribir la dirección | 3.3.7 Entrada redundante · A · nuevo |
| 8 | La ayuda cambia de sitio y de nombre en cada paso | 3.2.6 Ayuda consistente · A · nuevo |

### 3. Chuleta

```html
<!-- 8 · En la cabecera, una sola vez (y borrad los tres enlaces de ayuda de los pasos) -->
<a href="#ayuda">¿Necesitas ayuda?</a>

<!-- 1, 2, 3 y 5 · Paso 1 (y borrad el bloque <div class="campo captcha">: barrera 4) -->
<input type="text" id="usuario" name="usuario" autocomplete="username">
<input type="password" id="clave" name="clave" autocomplete="current-password">
<button type="button" class="secundario" id="ver-clave" aria-pressed="false" aria-controls="clave"
        onclick="alternarClave(this)">Mostrar contraseña</button>

<!-- 6 · Paso 2: un autocomplete en cada campo -->
autocomplete="name" · autocomplete="street-address" · autocomplete="postal-code" · autocomplete="address-level2"

<!-- 7 · Paso 3, antes de los campos -->
<div class="campo-check">
  <input type="checkbox" id="misma-direccion" onchange="copiarEnvio(this.checked)">
  <label for="misma-direccion">Usar la misma dirección que la de envío</label>
</div>
```

```js
function alternarClave(boton) {
  const clave = document.getElementById('clave');
  const visible = boton.getAttribute('aria-pressed') === 'true';
  clave.type = visible ? 'password' : 'text';
  boton.setAttribute('aria-pressed', String(!visible));
}

function copiarEnvio(copiar) {
  ['nombre', 'direccion', 'cp', 'ciudad'].forEach((campo) => {
    document.getElementById('notif-' + campo).value = copiar ? document.getElementById('envio-' + campo).value : '';
  });
}
```

### 4. Retos (+2 cada uno)

- **Para quien no programa:** con la solución puesta, guardad una contraseña en el gestor del navegador y volved a entrar. ¿Os la ofrece? Apuntad qué hace cada navegador del grupo.
- **Para quien programa:** al pasar de paso, el foco va al título del paso. Escuchad con el lector qué dice y decidid si haría falta anunciar también «Paso 2 de 3».
- **Pro:** si con la casilla marcada la persona vuelve al paso 2 y cambia la dirección, la del paso 3 se queda antigua. Arregladlo (o desmarcad la casilla y avisad).

### 5. El «después» y los puntos

La persona usuaria repite las cinco pruebas. La portavoz escribe en el chat: **«Grupo N · A2 · X/8 + retos»** y prepara 1 minuto para la puesta en común: **¿qué barrera de las 16 os parece que más gente sufre cada día?**
