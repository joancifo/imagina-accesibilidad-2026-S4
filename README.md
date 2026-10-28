# Sesión 4 · WCAG 2.2 en la práctica: formularios, pestañas y componentes en HTML y JavaScript

Curso *Accesibilidad Web WCAG 2.2 para Desarrolladores React y Angular* · Imagina Formación · Joan Cifo
Jueves 29 de octubre de 2026 · 15:00 – 18:30

Todo está hecho en **HTML, CSS y JavaScript**, sin frameworks y sin instalar nada. Abre la carpeta `sesion-4` entera en VSCode y abre cada `index.html` con **Live Server**.

## Cómo funciona la sesión

Dos laboratorios largos **por grupos mixtos** (salas de Zoom, con quien programa y quien no) y cuatro roles: piloto, persona usuaria (teclado y lector), auditoría y portavoz.

| Carpeta o archivo | Para qué |
|---|---|
| `laboratorios/00-como-trabajamos.md` | Roles, regla del grupo, puntos y atajos |
| `laboratorios/laboratorio-A.md` · `laboratorio-B.md` | La guía de cada laboratorio: el «antes», las barreras, la chuleta, los retos y el entregable |
| `laboratorios/hoja-del-grupo.md` | La hoja que rellena la auditoría |
| `comprobador.html` | Revisa cada etapa y marca cada barrera como superada o pendiente (ábrelo con Live Server) |
| `soluciones/` | Una solución por etapa |
| `ejemplos/` | Las demos de las diapositivas |
| `comun/estilos.css` | Estilos compartidos del Canal de denuncias |

| Laboratorio | Etapa | Carpeta | Temario | Barreras |
|---|---|---|---|---|
| A · Lo nuevo de WCAG 2.2 | A1 | `labA-1-tareas` | 1.3 · 2.4.11, 2.5.7, 2.5.8 | 8 |
| | A2 | `labA-2-acceso` | 1.3 · 3.3.8, 3.3.7, 3.2.6 | 8 |
| B · Pestañas, formularios y componentes | B1 | `labB-1-pestanas` | 3.11 | 7 |
| | B2 | `labB-2-formulario` | 2.10 – 2.11 · 3.14 – 3.15 | 8 |
| | B3 | `labB-3-componentes` | 3.16 – 3.18 | 8 |

## Verificación

- Comprobador en Chromium: cada etapa da **0** en su punto de partida y el **máximo** con su solución (A1 8/8, A2 8/8, B1 7/7, B2 8/8, B3 8/8).
- axe-core 4.14 (reglas WCAG 2.0 – 2.2 A/AA y buenas prácticas): **0 infracciones** en las cinco soluciones. En los puntos de partida solo detecta **6 de las 39 barreras** (A1: 6, 7 y 8 · B2: 1 · B3: 3 y 8). El resto lo encuentran el teclado, el lector y las personas.
- Probado con teclado real: foco que no se tapa, «Subir» y «Bajar» con Enter, pestañas con flechas, Inicio y Fin, foco al primer error y vuelta a la ayuda al corregir.

## Ejemplos de las diapositivas (`ejemplos/`)

| Archivo | Punto | Qué enseña |
|---|---|---|
| `01-foco-oculto.html` | 2.4.11 | Cabecera y aviso fijos que tapan el foco; `scroll-padding` lo arregla (casilla para activarlo) |
| `02-tamano-objetivo.html` | 2.5.8 | Botones de 16, 24 y 44 px y la excepción del espaciado con el círculo de 24 px |
| `03-navegacion-spa.html` | 3.12 – 3.13 | Navegación de una sola página en JavaScript: título, foco al `h1`, `aria-current` y saltar al contenido |
| `04-repintar-foco.html` | 2.4.3 · 3.16 | Repintar una lista con `innerHTML` destruye el botón con el foco; cómo recordarlo y devolverlo (casilla para comparar) |
