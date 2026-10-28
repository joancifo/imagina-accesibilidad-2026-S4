/*
 * Comprobador de laboratorios · Sesión 4 · WCAG 2.2, formularios, pestañas y componentes en HTML y JavaScript
 * Joan Cifo · Imagina Formación
 *
 * Solo comprueba lo que se puede comprobar con código. Un cambio cuenta de verdad cuando,
 * además, la persona del grupo que usa el teclado y el lector de pantalla lo ha probado.
 */
(function (global) {
  'use strict';

  // ───────── Utilidades ─────────
  function limpiar(texto) {
    return (texto || '').replace(/\s+/g, ' ').trim();
  }

  function textoAccesible(nodo) {
    if (!nodo) return '';
    if (nodo.nodeType === 3) return nodo.textContent;
    if (nodo.nodeType !== 1) return '';
    if (nodo.getAttribute('aria-hidden') === 'true' || nodo.hidden) return '';
    const etiqueta = nodo.tagName.toLowerCase();
    if (etiqueta === 'svg') {
      const titulo = nodo.querySelector('title');
      return titulo ? titulo.textContent : '';
    }
    if (etiqueta === 'img') return nodo.getAttribute('alt') || '';
    if (etiqueta === 'style' || etiqueta === 'script') return '';
    return Array.from(nodo.childNodes).map(textoAccesible).join('');
  }

  function etiquetasDe(control, doc) {
    const lista = [];
    if (control.labels && control.labels.length) return Array.from(control.labels);
    if (control.id) doc.querySelectorAll('label[for="' + control.id + '"]').forEach((l) => lista.push(l));
    const envolvente = control.closest('label');
    if (envolvente && !lista.includes(envolvente)) lista.push(envolvente);
    return lista;
  }

  function textoDeIds(ids, doc) {
    return limpiar((ids || '').split(/\s+/).filter(Boolean)
      .map((id) => doc.getElementById(id)).filter(Boolean)
      .map((n) => n.textContent).join(' '));
  }

  function nombreAccesible(el, doc) {
    if (!el) return '';
    const porId = textoDeIds(el.getAttribute('aria-labelledby'), doc);
    if (porId) return porId;
    const aria = limpiar(el.getAttribute('aria-label'));
    if (aria) return aria;
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) {
      return limpiar(etiquetasDe(el, doc).map((l) => textoAccesible(l)).join(' '));
    }
    return limpiar(textoAccesible(el));
  }

  function reglasCss(doc) {
    const reglas = [];
    Array.from(doc.styleSheets || []).forEach((hoja) => {
      let lista = [];
      try { lista = Array.from(hoja.cssRules || []); } catch (e) { lista = []; }
      lista.forEach((r) => { if (r.selectorText) reglas.push(r); });
    });
    return reglas;
  }

  function grande(el, minimo) {
    const r = el.getBoundingClientRect();
    return r.width >= minimo - 0.5 && r.height >= minimo - 0.5;
  }

  function tecla(win, el, key) {
    const Evento = win.KeyboardEvent || KeyboardEvent;
    el.dispatchEvent(new Evento('keydown', { key, bubbles: true, cancelable: true }));
  }

  function regionViva(doc) {
    return doc.querySelector('[role="status"], [role="alert"], [aria-live="polite"], [aria-live="assertive"]');
  }

  const TOKENS_DIRECCION = ['name', 'given-name', 'family-name', 'street-address', 'address-line1', 'address-line2',
    'postal-code', 'address-level1', 'address-level2'];

  function token(el) {
    return limpiar(el && el.getAttribute('autocomplete')).toLowerCase().split(' ').pop();
  }

  // ───────── Etapa A1 · labA-1-tareas · 8 comprobaciones ─────────
  const A1 = [
    {
      id: '1', titulo: 'La cabecera fija no tapa el elemento con el foco', criterio: '2.4.11 Foco no oculto (mínimo) (AA) · nuevo en 2.2',
      pista: 'html { scroll-padding-top: 80px; } (la cabecera mide 64 px: deja un poco de margen)',
      prueba: (doc, win) => {
        const cabecera = doc.querySelector('.cabecera');
        const valor = parseFloat(win.getComputedStyle(doc.documentElement).getPropertyValue('scroll-padding-top')) || 0;
        return Boolean(cabecera) && valor >= cabecera.offsetHeight;
      },
    },
    {
      id: '2', titulo: 'El aviso de cookies no tapa el elemento con el foco', criterio: '2.4.11 Foco no oculto (mínimo) (AA) · nuevo en 2.2',
      pista: 'Añade a la misma regla scroll-padding-bottom: 104px; (el aviso mide 88 px). No borres el aviso: se trata de convivir con él.',
      prueba: (doc, win) => {
        const aviso = doc.querySelector('.cookies');
        if (!aviso) return false;
        if (win.getComputedStyle(aviso).position !== 'fixed') return true;
        const valor = parseFloat(win.getComputedStyle(doc.documentElement).getPropertyValue('scroll-padding-bottom')) || 0;
        return valor >= aviso.offsetHeight;
      },
    },
    {
      id: '3', titulo: 'Cada tarea tiene botones «Subir» y «Bajar»', criterio: '2.5.7 Movimientos de arrastre (AA) · nuevo en 2.2',
      pista: 'En tareaHTML(): <button type="button" class="mover subir" onclick="moverConBoton(${i}, -1)" aria-label="Subir: ${tarea}">Subir</button> y lo mismo con «Bajar» y 1.',
      prueba: (doc) => {
        const tareas = Array.from(doc.querySelectorAll('#tareas > li'));
        return tareas.length > 0 && tareas.every((li) => {
          const nombres = Array.from(li.querySelectorAll('button')).map((b) => nombreAccesible(b, doc));
          return nombres.some((n) => n.startsWith('Subir')) && nombres.some((n) => n.startsWith('Bajar'));
        });
      },
    },
    {
      id: '4', titulo: '«Bajar» mueve la tarea y el foco la acompaña', criterio: '2.5.7 Movimientos de arrastre (AA) · 2.4.3 Orden del foco (A)',
      pista: 'moverConBoton(i, paso): calcula destino = i + paso, llama a mover(i, destino) y después da el foco al mismo botón en su nueva posición: lista.querySelectorAll(\'.tarea\')[destino].querySelector(\'.bajar\').focus()',
      fase: 'accion',
      prueba: (doc) => {
        const titulo = (li) => limpiar(li && li.querySelector('.titulo-tarea') && li.querySelector('.titulo-tarea').textContent);
        let tareas = Array.from(doc.querySelectorAll('#tareas > li'));
        if (tareas.length < 2) return false;
        const [t0, t1] = [titulo(tareas[0]), titulo(tareas[1])];
        const bajar = Array.from(tareas[0].querySelectorAll('button')).find((b) => nombreAccesible(b, doc).startsWith('Bajar'));
        if (!bajar) return false;
        bajar.click();
        tareas = Array.from(doc.querySelectorAll('#tareas > li'));
        const activo = doc.activeElement;
        return titulo(tareas[0]) === t1 && titulo(tareas[1]) === t0 &&
          Boolean(activo) && tareas[1].contains(activo) && nombreAccesible(activo, doc).startsWith('Bajar');
      },
    },
    {
      id: '5', titulo: 'El cambio de posición se anuncia', criterio: '4.1.3 Mensajes de estado (AA)',
      pista: 'Una región <p id="anuncio" class="sr-only" role="status"></p> en el HTML (vacía, desde el principio) y en mover(): document.getElementById(\'anuncio\').textContent = `«${tarea}» ahora es la tarea ${hasta + 1} de ${tareas.length}.`',
      fase: 'accion',
      prueba: (doc, win, ctx) => Boolean(ctx.region && ctx.regionVacia && ctx.region.isConnected && limpiar(ctx.region.textContent)),
    },
    {
      id: '6', titulo: 'Los botones de editar y eliminar miden 24 × 24 px como mínimo', criterio: '2.5.8 Tamaño del objetivo (mínimo) (AA) · nuevo en 2.2',
      pista: '.editar, .eliminar { width: 32px; height: 32px; padding: 6px; } · sus svg a 20 px · y más aire entre ellos: .iconos { gap: 8px; }',
      prueba: (doc) => {
        const botones = Array.from(doc.querySelectorAll('#tareas .editar, #tareas .eliminar'));
        return botones.length > 0 && botones.every((b) => grande(b, 24));
      },
    },
    {
      id: '7', titulo: 'Los botones de icono dicen qué hacen y sobre qué tarea', criterio: '4.1.2 Nombre, función, valor (A) · 2.4.6 (AA)',
      pista: '<button … class="editar" aria-label="Editar: ${tarea}">, <button … class="eliminar" aria-label="Eliminar: ${tarea}"> y en los dos iconos <svg … aria-hidden="true" focusable="false">',
      prueba: (doc) => {
        const tareas = Array.from(doc.querySelectorAll('#tareas > li'));
        return tareas.length > 0 && tareas.every((li) => {
          const titulo = limpiar(li.querySelector('.titulo-tarea') && li.querySelector('.titulo-tarea').textContent);
          return Boolean(titulo) && [['.editar', 'Editar'], ['.eliminar', 'Eliminar']].every(([sel, verbo]) => {
            const nombre = nombreAccesible(li.querySelector(sel), doc);
            return nombre.startsWith(verbo) && nombre.includes(titulo);
          });
        });
      },
    },
    {
      id: '8', titulo: 'Los números de página miden 24 × 24 px como mínimo', criterio: '2.5.8 Tamaño del objetivo (mínimo) (AA) · nuevo en 2.2',
      pista: '.paginacion a { display: inline-flex; align-items: center; justify-content: center; min-width: 32px; min-height: 32px; }',
      prueba: (doc) => {
        const enlaces = Array.from(doc.querySelectorAll('.paginacion a'));
        return enlaces.length > 0 && enlaces.every((a) => grande(a, 24));
      },
    },
  ];

  // ───────── Etapa A2 · labA-2-acceso · 8 comprobaciones ─────────
  const A2 = [
    {
      id: '1', titulo: 'El usuario se puede autocompletar', criterio: '3.3.8 Autenticación accesible (mínima) (AA) · 1.3.5 (AA)',
      pista: '<input type="text" id="usuario" name="usuario" autocomplete="username">',
      prueba: (doc) => token(doc.getElementById('usuario')) === 'username',
    },
    {
      id: '2', titulo: 'El gestor de contraseñas reconoce la contraseña', criterio: '3.3.8 Autenticación accesible (mínima) (AA) · nuevo en 2.2',
      pista: '<input type="password" id="clave" name="clave" autocomplete="current-password">',
      prueba: (doc) => token(doc.getElementById('clave')) === 'current-password',
    },
    {
      id: '3', titulo: 'Se puede pegar la contraseña', criterio: '3.3.8 Autenticación accesible (mínima) (AA) · nuevo en 2.2',
      pista: 'Quita onpaste="return false" del campo de la contraseña.',
      prueba: (doc, win) => {
        const clave = doc.getElementById('clave');
        if (!clave || clave.hasAttribute('onpaste')) return false;
        const Evento = win.Event || Event;
        const evento = new Evento('paste', { bubbles: true, cancelable: true });
        clave.dispatchEvent(evento);
        return !evento.defaultPrevented;
      },
    },
    {
      id: '4', titulo: 'No hay que resolver ninguna prueba cognitiva', criterio: '3.3.8 Autenticación accesible (mínima) (AA) · nuevo en 2.2',
      pista: 'Borra el bloque <div class="campo captcha">…</div>: escribir una palabra al revés es una prueba cognitiva. Si hiciera falta frenar robots, hay alternativas invisibles (limitar intentos, un segundo factor).',
      prueba: (doc) => !doc.querySelector('#captcha, [name="captcha"]') &&
        !Array.from(doc.querySelectorAll('label')).some((l) => /al rev[eé]s/i.test(l.textContent)),
    },
    {
      id: '5', titulo: '«Mostrar contraseña» enseña la contraseña y dice si está pulsado', criterio: '3.3.8 (técnica recomendada) · 4.1.2 Nombre, función, valor (A)',
      pista: '<button type="button" class="secundario" id="ver-clave" aria-pressed="false" aria-controls="clave" onclick="alternarClave(this)">Mostrar contraseña</button> y una función que cambie clave.type y aria-pressed.',
      fase: 'accion',
      prueba: (doc) => {
        const paso = doc.getElementById('paso-1') || doc;
        const boton = Array.from(paso.querySelectorAll('button')).find((b) => nombreAccesible(b, doc).startsWith('Mostrar'));
        const clave = doc.getElementById('clave');
        if (!boton || !clave || boton.getAttribute('aria-pressed') !== 'false') return false;
        boton.click();
        const ok = clave.type === 'text' && boton.getAttribute('aria-pressed') === 'true';
        boton.click();
        return ok && clave.type === 'password' && boton.getAttribute('aria-pressed') === 'false';
      },
    },
    {
      id: '6', titulo: 'La dirección de envío se puede autocompletar', criterio: '1.3.5 Identificar el propósito de la entrada (AA)',
      pista: 'autocomplete="name", "street-address", "postal-code" y "address-level2" (la ciudad) en los cuatro campos del paso 2.',
      prueba: (doc) => {
        const campos = Array.from(doc.querySelectorAll('#paso-2 input[type="text"]'));
        const tokens = campos.map(token);
        return campos.length === 4 && tokens.every((t) => TOKENS_DIRECCION.includes(t)) &&
          tokens.includes('postal-code') && (tokens.includes('street-address') || tokens.includes('address-line1'));
      },
    },
    {
      id: '7', titulo: 'En el paso 3 no hay que volver a escribir la dirección', criterio: '3.3.7 Entrada redundante (A) · nuevo en 2.2',
      pista: 'Una casilla <input type="checkbox" id="misma-direccion" onchange="copiarEnvio(this.checked)"> con su <label>«Usar la misma dirección que la de envío»</label>, y copiarEnvio() que copie los cuatro valores del paso 2.',
      fase: 'accion',
      prueba: (doc) => {
        const casilla = Array.from(doc.querySelectorAll('#paso-3 input[type="checkbox"]'))
          .find((c) => /misma/i.test(nombreAccesible(c, doc)));
        const envio = Array.from(doc.querySelectorAll('#paso-2 input[type="text"]'));
        const notif = Array.from(doc.querySelectorAll('#paso-3 input[type="text"]'));
        if (!casilla || envio.length !== 4 || notif.length !== 4) return false;
        const valores = ['Ana López García', 'Calle Mayor 1, 2.º B', '28013', 'Madrid'];
        envio.forEach((c, i) => { c.value = valores[i]; });
        notif.forEach((c) => { c.value = ''; });
        if (casilla.checked) casilla.click();
        casilla.click();
        return notif.every((c, i) => c.value === valores[i]);
      },
    },
    {
      id: '8', titulo: 'La ayuda está siempre en el mismo sitio', criterio: '3.2.6 Ayuda consistente (A) · nuevo en 2.2',
      pista: 'Quita los tres enlaces de ayuda de los pasos («¿Necesitas ayuda?», «Ayuda» y «Contacta con soporte») y pon uno solo en la cabecera: <a href="#ayuda">¿Necesitas ayuda?</a>',
      prueba: (doc) => {
        const enlaces = Array.from(doc.querySelectorAll('a')).filter((a) => /ayuda|soporte|contacta/i.test(a.textContent));
        return enlaces.length === 1 && !enlaces[0].closest('.paso');
      },
    },
  ];

  // ───────── Etapa B1 · labB-1-pestanas · 7 comprobaciones ─────────
  const pestanasDe = (doc) => Array.from(doc.querySelectorAll('[role="tab"]'));
  const seleccionada = (doc) => pestanasDe(doc).filter((p) => p.getAttribute('aria-selected') === 'true');

  const B1 = [
    {
      id: '1', titulo: 'Hay una lista de pestañas con nombre', criterio: '4.1.2 Nombre, función, valor (A) · 1.3.1 (A)',
      pista: '<div class="pestanas" role="tablist" aria-label="Filtrar denuncias por estado">',
      prueba: (doc) => {
        const lista = doc.querySelector('[role="tablist"]');
        return Boolean(lista) && Boolean(nombreAccesible(lista, doc).length && (lista.getAttribute('aria-label') || lista.getAttribute('aria-labelledby')));
      },
    },
    {
      id: '2', titulo: 'Cada pestaña es un botón con role="tab"', criterio: '2.1.1 Teclado (A) · 4.1.2 (A)',
      pista: '<button type="button" class="pestana" role="tab" id="pestana-0" onclick="seleccionar(0)">Pendientes (2)</button> (y lo mismo con 1 y 2)',
      prueba: (doc) => {
        const pestanas = pestanasDe(doc);
        return pestanas.length === 3 && pestanas.every((p) => p.tagName === 'BUTTON');
      },
    },
    {
      id: '3', titulo: 'aria-selected dice cuál está seleccionada y cambia al hacer clic', criterio: '4.1.2 Nombre, función, valor (A)',
      pista: 'En seleccionar(i): pestana.setAttribute(\'aria-selected\', String(i === j)); y en el HTML, aria-selected="true" en la primera y "false" en las demás.',
      fase: 'accion',
      prueba: (doc) => {
        const pestanas = pestanasDe(doc);
        if (pestanas.length !== 3 || seleccionada(doc).length !== 1) return false;
        pestanas[1].click();
        const sel = seleccionada(doc);
        return sel.length === 1 && sel[0] === pestanas[1] &&
          pestanas.filter((p) => p !== pestanas[1]).every((p) => p.getAttribute('aria-selected') === 'false');
      },
    },
    {
      id: '4', titulo: 'El panel está unido a su pestaña', criterio: '1.3.1 Información y relaciones (A) · 4.1.2 (A)',
      pista: 'Cada pestaña con aria-controls="panel"; el panel con role="tabpanel" y aria-labelledby con el id de la pestaña seleccionada (actualízalo en seleccionar).',
      prueba: (doc) => {
        const panel = doc.querySelector('[role="tabpanel"]');
        const pestanas = pestanasDe(doc);
        const sel = seleccionada(doc)[0];
        return Boolean(panel && panel.id && sel && sel.id) &&
          pestanas.length > 0 && pestanas.every((p) => p.getAttribute('aria-controls') === panel.id) &&
          panel.getAttribute('aria-labelledby') === sel.id;
      },
    },
    {
      id: '5', titulo: 'Las pestañas son una sola parada de Tab (roving tabindex)', criterio: '2.4.3 Orden del foco (A) · 2.1.1 (A)',
      pista: 'tabindex="0" en la seleccionada y tabindex="-1" en las demás; en seleccionar(i): pestana.tabIndex = i === j ? 0 : -1;',
      prueba: (doc) => {
        const pestanas = pestanasDe(doc);
        const sel = seleccionada(doc);
        return pestanas.length === 3 && sel.length === 1 && sel[0].tabIndex === 0 &&
          pestanas.filter((p) => p !== sel[0]).every((p) => p.tabIndex === -1);
      },
    },
    {
      id: '6', titulo: 'Las flechas cambian de pestaña (con vuelta) y llevan el foco', criterio: '2.1.1 Teclado (A) · patrón «Tabs» de la APG',
      pista: 'onkeydown="alPulsarTecla(event, 0)" en cada pestaña. En alPulsarTecla: ArrowRight → la siguiente (de la última, a la primera); ArrowLeft → la anterior; después seleccionar(destino) y pestanas[destino].focus().',
      fase: 'accion',
      prueba: (doc, win) => {
        const p = pestanasDe(doc);
        if (p.length !== 3) return false;
        p[2].click();
        p[2].focus();
        tecla(win, p[2], 'ArrowRight');
        const vuelta = seleccionada(doc)[0] === p[0] && doc.activeElement === p[0];
        tecla(win, p[0], 'ArrowLeft');
        return vuelta && seleccionada(doc)[0] === p[2] && doc.activeElement === p[2];
      },
    },
    {
      id: '7', titulo: 'Inicio y Fin van a la primera y a la última pestaña', criterio: '2.1.1 Teclado (A) · patrón «Tabs» de la APG',
      pista: 'En alPulsarTecla: if (evento.key === \'Home\') destino = 0; if (evento.key === \'End\') destino = ultima; y evento.preventDefault() para que la página no se desplace.',
      fase: 'accion',
      prueba: (doc, win) => {
        const p = pestanasDe(doc);
        if (p.length !== 3) return false;
        p[1].click();
        p[1].focus();
        tecla(win, p[1], 'Home');
        const inicio = seleccionada(doc)[0] === p[0] && doc.activeElement === p[0];
        tecla(win, p[0], 'End');
        return inicio && seleccionada(doc)[0] === p[2] && doc.activeElement === p[2];
      },
    },
  ];

  // ───────── Etapa B2 · labB-2-formulario · 8 comprobaciones ─────────
  const OBLIGATORIOS = ['nombre', 'email', 'telefono', 'departamento', 'acepto'];
  const B2 = [
    {
      id: '1', titulo: 'Cada campo tiene su etiqueta visible y asociada', criterio: '1.3.1 (A) · 3.3.2 Etiquetas o instrucciones (A) · 4.1.2 (A)',
      pista: '<label for="nombre">Nombre y apellidos <span aria-hidden="true">*</span></label> encima de cada campo (el placeholder no es una etiqueta). La casilla: <label for="acepto">…</label> en lugar del <span>.',
      prueba: (doc) => OBLIGATORIOS.every((id) => {
        const campo = doc.getElementById(id);
        return campo && limpiar(etiquetasDe(campo, doc).map((l) => textoAccesible(l)).join(' ')).length > 1;
      }),
    },
    {
      id: '2', titulo: 'Lo obligatorio no se indica solo con color', criterio: '1.4.1 Uso del color (A) · 3.3.2 (A)',
      pista: 'required en los cinco campos y, al principio del formulario, <p>Los campos marcados con asterisco (*) son obligatorios.</p>',
      prueba: (doc) => {
        const formulario = doc.getElementById('identificate');
        return Boolean(formulario) && /obligatori/i.test(formulario.textContent) && OBLIGATORIOS.every((id) => {
          const c = doc.getElementById(id);
          return c && (c.required || c.getAttribute('aria-required') === 'true');
        });
      },
    },
    {
      id: '3', titulo: 'Nombre, email y teléfono se pueden autocompletar', criterio: '1.3.5 Identificar el propósito de la entrada (AA)',
      pista: 'autocomplete="name", autocomplete="email" y autocomplete="tel"',
      prueba: (doc) => token(doc.getElementById('nombre')) === 'name' && token(doc.getElementById('email')) === 'email' &&
        token(doc.getElementById('telefono')) === 'tel',
    },
    {
      id: '4', titulo: 'La ayuda del teléfono está asociada al campo', criterio: '1.3.1 (A) · 3.3.2 (A)',
      pista: '<input type="tel" id="telefono" … aria-describedby="ayuda-telefono">',
      prueba: (doc) => /9 d[ií]gitos/.test(textoDeIds(doc.getElementById('telefono') && doc.getElementById('telefono').getAttribute('aria-describedby'), doc)),
    },
    {
      id: '5', titulo: '«Siguiente» nunca está desactivado', criterio: '3.3.1 Identificación de errores (A)',
      pista: 'Quita disabled del botón y borra la función revisar() y sus dos addEventListener: los errores se explican al pulsar.',
      prueba: (doc) => {
        const boton = doc.querySelector('#identificate [type="submit"]');
        return Boolean(boton) && !boton.disabled && boton.getAttribute('aria-disabled') !== 'true';
      },
    },
    {
      id: '6', titulo: 'Al enviar vacío, cada campo dice que no es válido y por qué', criterio: '3.3.1 Identificación de errores (A) · 3.3.3 Sugerencias ante errores (AA)',
      pista: 'En el submit, para cada campo mal: aria-invalid="true" y un <p id="error-nombre" class="error"> con el mensaje, unido con aria-describedby (en el teléfono: "ayuda-telefono error-telefono"). Mira mostrarError() en la chuleta.',
      fase: 'envio',
      prueba: (doc) => ['nombre', 'email', 'telefono'].every((id) => {
        const campo = doc.getElementById(id);
        if (!campo || campo.getAttribute('aria-invalid') !== 'true') return false;
        const descripcion = textoDeIds(campo.getAttribute('aria-describedby'), doc);
        const ayuda = id === 'telefono' ? textoDeIds('ayuda-telefono', doc) : '';
        return descripcion.length > ayuda.length + 5;
      }),
    },
    {
      id: '7', titulo: 'Al enviar vacío, el foco va al primer campo con error', criterio: '3.3.1 (A) · 2.4.3 Orden del foco (A)',
      pista: 'Guarda el primer campo con error y, al final del submit: if (primero) { primero.focus(); return; }',
      fase: 'envio',
      prueba: (doc) => doc.activeElement === doc.getElementById('nombre'),
    },
    {
      id: '8', titulo: 'El éxito se anuncia en una región que ya existía', criterio: '4.1.3 Mensajes de estado (AA)',
      pista: 'Cambia <div id="zona-exito"></div> por <p id="resultado" class="exito" role="status"></p> y, si todo está bien: resultado.textContent = \'Datos guardados. Ya puedes pasar al paso 2.\';',
      fase: 'final',
      prueba: (doc, win, ctx) => {
        if (!ctx.region || !ctx.regionVacia) return false;
        const valores = { nombre: 'Ana López García', email: 'ana@empresa.com', telefono: '612345678' };
        Object.keys(valores).forEach((id) => { const c = doc.getElementById(id); if (c) c.value = valores[id]; });
        const dpto = doc.getElementById('departamento');
        if (dpto) dpto.selectedIndex = 1;
        const acepto = doc.getElementById('acepto');
        if (acepto) acepto.checked = true;
        const Evento = win.Event || Event;
        ['nombre', 'email', 'telefono', 'departamento', 'acepto'].forEach((id) => {
          const c = doc.getElementById(id);
          if (c) { c.dispatchEvent(new Evento('input', { bubbles: true })); c.dispatchEvent(new Evento('change', { bubbles: true })); }
        });
        doc.getElementById('identificate').dispatchEvent(new Evento('submit', { bubbles: true, cancelable: true }));
        return ctx.region.isConnected && limpiar(ctx.region.textContent).length > 0;
      },
    },
  ];

  // ───────── Etapa B3 · labB-3-componentes · 8 comprobaciones ─────────
  const B3 = [
    {
      id: '1', titulo: 'Boton() pinta un <button> de verdad', criterio: '2.1.1 Teclado (A) · 4.1.2 (A)',
      pista: 'return `<button type="button" class="boton ${variante}" onclick="${accion}">${texto}</button>`;',
      prueba: (doc) => {
        const botones = Array.from(doc.querySelectorAll('#app .boton'));
        return botones.length >= 3 && botones.every((b) => b.tagName === 'BUTTON');
      },
    },
    {
      id: '2', titulo: 'Enlace() pinta un enlace con href', criterio: '2.1.1 Teclado (A) · 4.1.2 (A)',
      pista: 'return `<a class="enlace" href="#${destino}" onclick="ir(\'${destino}\')">${texto}</a>`;',
      prueba: (doc) => {
        const enlaces = Array.from(doc.querySelectorAll('#app .enlace'));
        return enlaces.length >= 2 && enlaces.every((a) => a.tagName === 'A' && limpiar(a.getAttribute('href')).length > 0);
      },
    },
    {
      id: '3', titulo: 'BotonIcono() usa la etiqueta como nombre accesible', criterio: '4.1.2 Nombre, función, valor (A) · 1.1.1 (A)',
      pista: 'BotonIcono ya recibe «etiqueta», pero no la usa: añade aria-label="${etiqueta}" al <button>.',
      prueba: (doc) => {
        const botones = Array.from(doc.querySelectorAll('#app .boton-icono'));
        return botones.length >= 5 && botones.every((b) => nombreAccesible(b, doc).length > 2);
      },
    },
    {
      id: '4', titulo: 'Los iconos son decorativos para el lector', criterio: '1.1.1 Contenido no textual (A)',
      pista: 'En Icono(): <svg class="icono" viewBox="0 0 24 24" aria-hidden="true" focusable="false">',
      prueba: (doc) => {
        const iconos = Array.from(doc.querySelectorAll('#app svg.icono'));
        return iconos.length > 0 && iconos.every((s) => s.getAttribute('aria-hidden') === 'true');
      },
    },
    {
      id: '5', titulo: 'El buscador tiene una etiqueta de verdad', criterio: '1.3.1 (A) · 3.3.2 (A) · 4.1.2 (A)',
      pista: 'En CampoBusqueda(): <div class="busqueda"><label for="${id}">${etiqueta}</label><input type="search" id="${id}"></div> (sin placeholder como etiqueta).',
      prueba: (doc) => {
        const campo = doc.getElementById('buscar');
        return Boolean(campo) && limpiar(etiquetasDe(campo, doc).map((l) => textoAccesible(l)).join(' ')).length > 2;
      },
    },
    {
      id: '6', titulo: 'Cada tarjeta tiene un encabezado de verdad', criterio: '1.3.1 Información y relaciones (A) · 2.4.6 (AA)',
      pista: 'En Tarjeta(): <section class="tarjeta"><h2 class="titulo-tarjeta">${titulo}</h2>…</section>',
      prueba: (doc) => {
        const tarjetas = Array.from(doc.querySelectorAll('#app .tarjeta'));
        return tarjetas.length >= 3 && tarjetas.every((t) => {
          const h = t.querySelector('h2, h3, h4, [role="heading"]');
          return h && limpiar(h.textContent).length > 0;
        });
      },
    },
    {
      id: '7', titulo: 'El interruptor es un botón role="switch" que anuncia su estado', criterio: '4.1.2 Nombre, función, valor (A) · 2.1.1 (A)',
      pista: '<button type="button" class="switch" role="switch" id="${id}" aria-checked="${activo}" aria-labelledby="${id}-etiqueta" onclick="alternar(this)"></button><span id="${id}-etiqueta">${etiqueta}</span> y alternar() cambia aria-checked.',
      fase: 'accion',
      prueba: (doc) => {
        const interruptores = Array.from(doc.querySelectorAll('#app .interruptor'));
        return interruptores.length >= 2 && interruptores.every((caja) => {
          const s = caja.querySelector('[role="switch"]');
          if (!s || !(s.tagName === 'BUTTON' || s.tabIndex >= 0)) return false;
          const antes = s.getAttribute('aria-checked');
          if (!['true', 'false'].includes(antes) || !nombreAccesible(s, doc)) return false;
          s.click();
          const despues = s.getAttribute('aria-checked');
          s.click();
          return despues === (antes === 'true' ? 'false' : 'true');
        });
      },
    },
    {
      id: '8', titulo: 'Sin tabindex positivo y sin quitar el foco visible', criterio: '2.4.3 Orden del foco (A) · 2.4.7 Foco visible (AA)',
      pista: 'Quita tabindex="1" de CampoBusqueda y borra la regla .boton-icono:focus { outline: none; } de componentes.css.',
      prueba: (doc) => {
        const positivo = Array.from(doc.querySelectorAll('[tabindex]')).some((el) => parseInt(el.getAttribute('tabindex'), 10) > 0);
        const sinFoco = reglasCss(doc).some((r) => /:focus/.test(r.selectorText) &&
          (r.style.outlineStyle === 'none' || /^(none|0(px)?)$/.test(limpiar(r.style.outline)) || r.style.outlineWidth === '0px'));
        return !positivo && !sinFoco;
      },
    },
  ];

  const ETAPAS = {
    A1: { pagina: 'labA-1-tareas/index.html', nombre: 'A1 · Lo nuevo de WCAG 2.2: foco, arrastre y tamaño (labA-1-tareas)', lista: A1 },
    A2: { pagina: 'labA-2-acceso/index.html', nombre: 'A2 · Lo nuevo de WCAG 2.2: acceso, ayuda y entrada redundante (labA-2-acceso)', lista: A2 },
    B1: { pagina: 'labB-1-pestanas/index.html', nombre: 'B1 · Pestañas en JavaScript (labB-1-pestanas)', lista: B1 },
    B2: { pagina: 'labB-2-formulario/index.html', nombre: 'B2 · Formulario «Identifícate» (labB-2-formulario)', lista: B2 },
    B3: { pagina: 'labB-3-componentes/index.html', nombre: 'B3 · Biblioteca de componentes (labB-3-componentes)', lista: B3 },
  };

  function enviarVacio(doc, win) {
    const formulario = doc.querySelector('form');
    if (!formulario) return;
    const Evento = win.Event || Event;
    formulario.dispatchEvent(new Evento('submit', { bubbles: true, cancelable: true }));
  }

  /**
   * Ejecuta las comprobaciones de una etapa sobre su página ya cargada.
   * Devuelve [{ id, titulo, criterio, pista, ok }]
   */
  function ejecutar(doc, win, etapa) {
    const lista = ETAPAS[etapa].lista;
    const ctx = {};
    const region = regionViva(doc);
    ctx.region = region;
    ctx.regionVacia = Boolean(region) && limpiar(region.textContent) === '';
    const resultado = {};
    const corre = (c) => {
      let ok = false;
      try { ok = Boolean(c.prueba(doc, win, ctx)); } catch (e) { ok = false; }
      resultado[c.id] = ok;
    };
    // 1.º lo estático, 2.º las acciones (clics y teclas), 3.º el envío vacío y 4.º el envío completo
    lista.filter((c) => !c.fase).forEach(corre);
    lista.filter((c) => c.fase === 'accion').forEach(corre);
    if (lista.some((c) => c.fase === 'envio')) {
      enviarVacio(doc, win);
      lista.filter((c) => c.fase === 'envio').forEach(corre);
    }
    lista.filter((c) => c.fase === 'final').forEach(corre);
    return lista.map((c) => ({ id: c.id, titulo: c.titulo, criterio: c.criterio, pista: c.pista, ok: resultado[c.id] }));
  }

  global.Comprobador = { ETAPAS, ejecutar };
})(typeof window !== 'undefined' ? window : globalThis);
