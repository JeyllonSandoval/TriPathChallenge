function isSpecialCharacter(element: string | number): boolean {
    return typeof element === 'string' && /[^a-zA-Z0-9]/.test(element);
}

function reverseArrayKeepingSpecialChars(arrayToReverse: (string | number)[]): (string | number)[] {
    const specialPositions = new Map<number, string | number>();

    arrayToReverse.forEach((element, index) => {
        if (isSpecialCharacter(element)) specialPositions.set(index, element);
    });

    const reversed = arrayToReverse.filter(element => !isSpecialCharacter(element)).reverse();

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
