# Task 3 - Memory Game

Un juego de memoria clásico donde debes encontrar todas las parejas de cartas. ¡Pon a prueba tu memoria y trata de completar el juego con la menor cantidad de movimientos y tiempo posible!

## Cómo ejecutar el proyecto

### Paso 1: Instalar dependencias

Primero, asegúrate de tener las dependencias instaladas. Desde la carpeta `Task3`, ejecuta:

```bash
npm install
```

### Paso 2: Compilar el código TypeScript

El código está escrito en TypeScript, así que necesitas compilarlo a JavaScript antes de ejecutarlo:

```bash
npm run build
```

Esto generará los archivos JavaScript en la carpeta `dist/`.

### Paso 3: Iniciar un servidor local

**Importante:** No puedes abrir el archivo HTML directamente en el navegador. Necesitas un servidor local porque el proyecto usa módulos ES6.

Tienes varias opciones:

**Opción más fácil (con Python):**
```bash
python -m http.server 8080
```

**O si prefieres usar Node.js:**
```bash
npx http-server . -p 8080 -o
```

### Paso 4: Abrir en el navegador

Una vez que el servidor esté corriendo, abre tu navegador y ve a:

```
http://localhost:8080
```

¡Ya puedes empezar a jugar!

## Cómo jugar

1. **Selecciona la dificultad:** Elige entre Fácil (4 pares), Medio (8 pares) o Difícil (12 pares) usando el selector en la parte superior.

2. **Haz clic en las cartas:** Haz clic en dos cartas para voltearlas y ver si coinciden.

3. **Encuentra las parejas:** Si las dos cartas coinciden, se quedarán boca arriba. Si no, se voltearán de nuevo.

4. **Completa el juego:** Encuentra todas las parejas para ganar.

5. **Mejora tu puntuación:** La puntuación se calcula según el tiempo que tardes, los movimientos que hagas y la dificultad. ¡Intenta conseguir la mejor puntuación!

6. **Nuevo juego:** Haz clic en el botón "New Game" para empezar una nueva partida.

## Estadísticas del juego

- **Tiempo:** Cuenta cuánto tiempo llevas jugando desde que volteas la primera carta.
- **Movimientos:** Cuenta cada vez que volteas dos cartas.
- **Puntuación:** Se calcula según la dificultad, tiempo y movimientos. Completar rápido y con pocos movimientos te da más puntos.

## Si haces cambios en el código

Si modificas algún archivo `.ts`, recuerda volver a compilar:

```bash
npm run build
```

Y luego recarga la página en el navegador para ver los cambios, aunque la carga deberia de hacerse automatica, pero por si acaso.

