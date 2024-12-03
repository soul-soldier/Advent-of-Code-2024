
import { assert } from 'console';
import * as fs from 'fs';
import { get } from 'http';
const readInputFile = (filePath: string): string[] => {
    const inputString = fs.readFileSync(filePath, 'utf-8');

    const lines: string[] = inputString
        .trim()
        .split('\n')
    return lines;
}

const regexPart1 = /mul\((\d{1,3}),(\d{1,3})\)/g;
const regexPart2 = /mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't()\(\)/g;

const getMatches = (line: string): string[] => line.match(new RegExp(regexPart1, 'g')) || [];

const calculateSumOfMultiplications = (input: string): number => {
    let sum = 0;
    let match;

    regexPart1.lastIndex = 0;

    while ((match = regexPart1.exec(input)) !== null) {
        const num1 = parseInt(match[1], 10);
        const num2 = parseInt(match[2], 10);
        //console.log(num1, num2);
        sum += num1 * num2;
        //console.log(`Match found: ${match[0]} => ${num1} * ${num2} = ${num1 * num2}`);
    }

    return sum;
};

const extractValidMatches = (input: string): string => {
    let result = '';
    let match;
    regexPart2.lastIndex = 0;

    while ((match = regexPart2.exec(input)) !== null) {
        result += match[0];
    }

    return result;
};


const main = () => {
    const inputSimple: string[] = readInputFile("InputDay3Simple.txt");
    const inputStringSimple = inputSimple.join("\n");
    const sum1 = calculateSumOfMultiplications(inputStringSimple);
    assert(sum1 === 161, "Simple example failed");
    console.log(sum1);

    /* const input: string[] = readInputFile("InputDay3.txt");
    const inputString = input.join("\n");
    const sum2 = calculateSumOfMultiplications(inputString);
    console.log(sum2); */
    const simpleExample: string = "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))"
    const result = extractValidMatches(simpleExample);
    assert(result === "mul(2,4)don't()mul(5,5)mul(11,8)do()mul(8,5)", "Simple example failed");
    console.log(result);
}

main();