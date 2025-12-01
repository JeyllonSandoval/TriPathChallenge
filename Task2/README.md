# Task 2 - Glimpse of Wonders

Una aplicación web simple que muestra diferentes razas de perros usando la API de Dog CEO.

## Cómo ejecutar el proyecto

### Paso 1: Instalar dependencias

Primero, asegúrate de tener las dependencias instaladas. Desde la carpeta `Task2`, ejecuta:

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

Deberías ver la página principal con una galería de razas de perros.

## Cómo probar

1. **Página principal (index.html):** Muestra una galería con 20 razas de perros aleatorias, en caso de querer modificar esto, file Main.ts linia 36
2. **Página de búsqueda (search.html):** Permite buscar y filtrar razas en una tabla
3. **Página CRUD (crud.html):** Permite gestionar (crear, leer, actualizar, eliminar) razas de perros

Navega entre las páginas usando los botones de navegación en la parte superior.

## Si haces cambios en el código

Si modificas algún archivo `.ts`, recuerda volver a compilar:

```bash
npm run build
```

Y luego recarga la página en el navegador para ver los cambios, aunque la carga deberia de hacerse automatica, pero por si acaso.

