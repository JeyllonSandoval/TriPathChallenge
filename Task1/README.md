# Task 1 - Algoritmo de Inversión de Arrays

Algoritmo en TypeScript que invierte un array manteniendo los caracteres especiales en sus posiciones originales.

## ¿Qué hace?

Este algoritmo toma un array que contiene letras, números y caracteres especiales, y lo invierte de manera que:
- Las letras y números se invierten en orden
- Los caracteres especiales se mantienen en sus posiciones originales

**Ejemplo:**
- **Input:** `['n', 2, '&', 'a', 'l', 9, '$', 'q', '*', 47, 'i', 'a', 'j', 'b', 'z', '%', 8]`
- **Output:** `[8, 'z', '&', 'b', 'j', 'a', '$', 'i', '*', 47, 'q', 9, 'l', 'a', 2, '%', 'n']`

Como puedes ver, los caracteres especiales (`&`, `$`, `*`, `%`) se mantienen en las mismas posiciones, mientras que las letras y números se invierten.

## Cómo ejecutar

### Paso 1: Compilar TypeScript

Desde la carpeta raíz del proyecto (donde está el `tsconfig.json`), compila el código:

```bash
npx tsc Task1/main.ts
```

O si prefieres compilar todo el proyecto:

```bash
npx tsc
```

Esto generará un archivo `main.js` en la carpeta `Task1/`.

### Paso 2: Ejecutar con Node.js

Una vez compilado, ejecuta el archivo JavaScript:

```bash
node Task1/main.js
```

Deberías ver en la consola:
- El array de entrada (Input)
- El resultado del algoritmo (Output)
- El resultado esperado (Expected)
- Si el resultado coincide con lo esperado (Match: true/false)

## Cómo funciona

1. **Identifica caracteres especiales:** Recorre el array y guarda las posiciones de todos los caracteres especiales (cualquier cosa que no sea letra o número).

2. **Filtra y revierte:** Filtra todos los caracteres especiales y revierte el array resultante.

3. **Reconstruye:** Vuelve a construir el array original, pero con los caracteres especiales en sus posiciones originales y las letras/números en orden inverso.

## Si haces cambios

Si modificas el archivo `main.ts`, simplemente vuelve a compilar y ejecutar:

```bash
npx tsc Task1/main.ts
node Task1/main.js
```
