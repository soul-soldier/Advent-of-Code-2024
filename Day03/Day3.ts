
import { assert } from 'console';
import * as fs from 'fs';

const readInputFile = (filePath: string): string => {
    const inputString = fs.readFileSync(filePath, 'utf-8');
    return inputString.trim();
}

const regexPart1 = /mul\((\d{1,3}),(\d{1,3})\)/g;
const regexPart2 = /mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't()\(\)/g;

const extractMatches = (input: string, regex: RegExp): string[] => {
    return Array.from(input.matchAll(regex), match => match[0]);
}

const calculateSumOfMultiplications = (matches: string[]): number =>
    matches.reduce((sum, match) => {
        const matches = match.match(/mul\((\d+),(\d+)\)/);
        if (!matches) return sum;

        const num1 = parseInt(matches[1], 10);
        const num2 = parseInt(matches[2], 10);

        return sum + num1 * num2;
    }, 0);

const extractValidMatches = (input: string): string[] => {
    const validMatches: string[] = [];

    const matches = input.match(regexPart2) || [];
    let currentPrefix: "do" | "dont" | null = null;

    for (const match of matches) {
        if (match === "do()") {
            currentPrefix = "do";
        } else if (match === "don't()") {
            currentPrefix = "dont";
        } else if (match.startsWith("mul")) {
            if (currentPrefix !== "dont") {
                validMatches.push(match);
            }
        }
    }

    return validMatches;
}

const main = () => {
    const inputSimple: string = readInputFile("InputDay3Simple.txt");
    const sumPart1Simple = calculateSumOfMultiplications(extractMatches(inputSimple, regexPart1));
    assert(sumPart1Simple === 161, "Simple example failed");
    console.log("Sum Part 1 simple example: ", sumPart1Simple);

    const input: string = readInputFile("InputDay3.txt");
    const sumPart1 = calculateSumOfMultiplications(extractMatches(input, regexPart1));
    console.log("Sum Part 1               : ", sumPart1);

    const inputSimplePart2: string = "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))"
    const result = extractValidMatches(inputSimplePart2);
    const sumPart2Simple = calculateSumOfMultiplications(result);
    assert(sumPart2Simple === 48, "Simple example failed");
    console.log("Sum Part 2 simple example: ", sumPart2Simple);


    const sumPart2 = calculateSumOfMultiplications(extractValidMatches(input));
    console.log("Sum Part 2               : ", sumPart2);
}
main();