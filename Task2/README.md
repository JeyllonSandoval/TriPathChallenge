# Task 2 - Glimpse of Wonders

Aplicación web para mostrar razas de perros usando la API de Dog CEO.

## Instalación

No se requieren dependencias adicionales. El proyecto usa TypeScript que ya está instalado en el proyecto raíz.

## Compilación

Para compilar los archivos TypeScript a JavaScript:

```bash
npm run build
```

O directamente:
```bash
npx tsc
```

Los archivos compilados se generarán en la carpeta `dist/`.

## Ejecución

**IMPORTANTE:** Los módulos ES6 requieren un servidor HTTP. No funciona abriendo el HTML directamente con `file://`.

### Opción 1: Usar http-server (Recomendado)

```bash
npm run dev
```

O instalar y ejecutar manualmente:

```bash
npx http-server . -p 8080 -o
```

### Opción 2: Usar Python

Si tienes Python instalado:

```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

### Opción 3: Usar Node.js (simple-server)

```bash
npx simple-server
```

Luego abre tu navegador en `http://localhost:8080` (o el puerto que se muestre).

## Estructura del Proyecto

```
Task2/
├── API/
│   └── config.ts          # Configuración de la API
├── components/
│   └── DogCard.ts         # Componente de tarjeta de perro
├── dist/                  # Archivos JavaScript compilados
│   ├── API/
│   ├── components/
│   └── main.js
├── index.html             # Página principal
├── main.ts                # Lógica principal
├── style.css              # Estilos CSS
└── tsconfig.json          # Configuración de TypeScript
```

## Funcionalidades

- ✅ Lista todas las razas de perros desde la API
- ✅ Muestra imagen y nombre de cada raza
- ✅ Grid responsive
- ✅ Componente reutilizable DogCard

## Notas

- Los archivos TypeScript se compilan a la carpeta `dist/`
- El HTML está configurado para usar `dist/main.js`
- Después de modificar archivos `.ts`, ejecuta `npm run build` para recompilar

