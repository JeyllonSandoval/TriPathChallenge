// Task 1
// Verificar si un elemento es un carácter especial
function isSpecialCharacter(element: string | number): boolean {
    return typeof element === 'string' && /[^a-zA-Z0-9]/.test(element);
}

// Invertir un array manteniendo los caracteres especiales en sus posiciones originales
function reverseArrayKeepingSpecialChars(arrayToReverse: (string | number)[]): (string | number)[] {
    // Map para almacenar las posiciones de los caracteres especiales
    const specialPositions = new Map<number, string | number>();

    // Recorrer el array y almacenar las posiciones de los caracteres especiales
    arrayToReverse.forEach((element, index) => {
        if (isSpecialCharacter(element)) specialPositions.set(index, element);
    });

    // Filtrar los caracteres especiales y invertir el array
    const reversed = arrayToReverse.filter(element => !isSpecialCharacter(element)).reverse();

    // Recorrer el array y devolver los caracteres especiales en sus posiciones originales y los caracteres no especiales en orden inverso
    let i = 0;
    return arrayToReverse.map((_, idx): (string | number) =>
        specialPositions.has(idx)
            ? specialPositions.get(idx)!
            : reversed[i++]!
    );
}

const input: (string | number)[] = ['n', 2, '&', 'a', 'l', 9, '$', 'q', '*', 47, 'i', 'a', 'j', 'b', 'z', '%', 8];

const output = reverseArrayKeepingSpecialChars(input);

console.log("Input:", input);
console.log("Output:", output);

const expected: (string | number)[] = [8, 'z', '&', 'b', 'j', 'a', '$', 'i', '*', 47, 'q', 9, 'l', 'a', 2, '%', 'n'];

console.log("Expected:", expected);
console.log("Match:", JSON.stringify(output) === JSON.stringify(expected));
