# Cómo trabajamos en los laboratorios

Hoy la mayor parte de la tarde trabajaréis **en grupo, en salas de Zoom**: dos laboratorios largos (A y B), con cinco etapas en total. En cada grupo hay personas que programan a diario y personas que no. Está hecho a propósito: cada rol es imprescindible y ninguno exige saber programar, salvo el de piloto.

> Abre esta guía en VSCode y pulsa `Ctrl + Mayús + V` (Mac: `Cmd + Mayús + V`) para verla con formato.

Todo es **HTML, CSS y JavaScript**, sin instalar nada: abre el `index.html` de cada etapa con **Live Server** (clic derecho → *Open with Live Server*).

## Los cuatro roles

| Rol | Quién | Qué hace |
|---|---|---|
| 🧑‍💻 **Piloto** | Alguien que programa (o quien no, con copiloto) | Comparte pantalla en la sala, hace cada cambio en su copia y **explica por qué**. Espera a que todo el grupo lo tenga antes de pasar al siguiente. |
| 🦮 **Persona usuaria** | No hace falta programar | Antes de tocar nada, hace la prueba del **«antes»**. Después de cada cambio, lo prueba en **su** copia **sin ratón** y con el **lector de pantalla**, y dice en voz alta qué oye. Da el «OK» o el «otra vez». |
| 🔎 **Auditoría** | No hace falta programar | Pasa el **comprobador** en su copia y apunta en `hoja-del-grupo.md` cada barrera resuelta, su criterio WCAG y cómo se ha comprobado. |
| 🎙️ **Portavoz y reloj** | No hace falta programar | Lee la guía en voz alta, avisa del tiempo, decide cuándo pasar al reto y presenta el resultado en la puesta en común (1 minuto). |

- **Sois 3:** la persona de auditoría hace también de portavoz.
- **Rotación:** en cada etapa cambiad los roles. En **A1** (casi todo CSS) y en **B3** (cambios pequeños en un solo archivo) pilota **quien no programa**, con quien programa de **copiloto**: el copiloto dicta, pero no toca el teclado.

## La regla del grupo

1. **Todo el mundo edita su propia copia.** El piloto enseña el cambio y los demás lo copian en la suya. Nadie se queda mirando.
2. **Un cambio solo cuenta cuando la persona usuaria lo ha probado** con el teclado o el lector, en su ordenador.
3. **El piloto no pasa a la siguiente barrera** hasta que todo el grupo tiene la anterior.

## Puntos

| Qué | Puntos |
|---|---|
| Cada comprobación superada en el comprobador (en la copia de la auditoría) | 1 |
| Todo el grupo tiene la misma puntuación en su copia | +3 |
| Cada reto completado (hay retos para quien programa y para quien no) | +2 |
| La portavoz presenta en 1 minuto o menos | +1 |

Al terminar cada etapa, la portavoz escribe en el chat general: **«Grupo N · A1 · X/8 + retos»**.

## El comprobador

1. Clic derecho en `comprobador.html` → **Open with Live Server**.
2. Elige la etapa y pulsa **Comprobar**.
3. Verás cada barrera como ✅ **Superada** o ❌ **Pendiente**, con su criterio WCAG y una pista.

El comprobador hace clic y pulsa teclas dentro de tu página para probarla. Solo mira el código: por eso existe la persona usuaria. El teclado y el lector dicen la última palabra.

## Si os atascáis

1. Mirad la **pista** del comprobador y la **chuleta** de la guía.
2. Abrid la solución de la carpeta `soluciones/` y comparad (en VSCode: clic derecho en los dos archivos → «Seleccionar para comparar» y «Comparar con seleccionado»).
3. Pulsad **«Pedir ayuda»** en Zoom y el profesor entra en vuestra sala.

¿La página sale en blanco o un botón no hace nada? `F12` → pestaña **Console**: casi siempre es una comilla invertida (`` ` ``) o una llave sin cerrar. `Ctrl + Z` y otra vez.

## Atajos que vais a necesitar

| Qué | Windows | Mac |
|---|---|---|
| Ver esta guía con formato | `Ctrl + Mayús + V` | `Cmd + Mayús + V` |
| Guardar | `Ctrl + S` | `Cmd + S` |
| Panel Accessibility | `F12` → Elements → Accessibility | `Cmd + Opción + I` |
| Medir un elemento | `F12` → icono de la flecha → pasar por encima | Igual |
| Simular un móvil | `F12` → `Ctrl + Mayús + M` | `F12` → `Cmd + Mayús + M` |
| NVDA: encender / callar | `Ctrl + Alt + N` / `Ctrl` | — |
| VoiceOver: encender / callar | — | `Cmd + F5` / `Ctrl` |
| Lector: siguiente encabezado · formulario | NVDA: `H` · `F` | Rotor: `Ctrl + Opción + U` |
