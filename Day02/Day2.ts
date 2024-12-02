import { assert } from 'console';
import * as fs from 'fs';

const readInputFile = (filePath: string): number[][] => {
    const data = fs.readFileSync(filePath, 'utf-8');

    const lineToNumbers = (line: string) => line.trim().split(" ").map(Number)

    const lines: number[][] = data
        .trim()
        .split('\n')
        .map(lineToNumbers);

    return lines;
}

const slidingWindow = (line: number[]): number[][] => {
    const result: number[][] = [];

    for (let i = 0; i < line.length - 1; i++) {
        result.push([line[i], line[i + 1]]);
    }

    return result;
}

const isStriclyMonotonous = (line: number[]): boolean => {
    return slidingWindow(line).every(([a, b], _, windows) => a < b === windows[0][0] < windows[0][1]);
}

const hasSafeDifferences = (line: number[]): boolean => {
    return slidingWindow(line).every(([a, b]) => Math.abs(a - b) <= 3 && Math.abs(a - b) >= 1);
}

const isSafeLine = (lines: number[]): boolean => {
    return isStriclyMonotonous(lines) && hasSafeDifferences(lines);
}

const countSafeReports = (lines: number[][]): number => {
    return lines.filter(isSafeLine).length;
}

const removeAtIndex = (line: number[], index: number): number[] => line.slice(0, index).concat(line.slice(index + 1));

const dampeningOptionsFor = (line: number[]): number[][] => {
    return line.map((_, i) => removeAtIndex(line, i));
}

const isSafeLineWDampener = (lines: number[]): boolean => {
    return dampeningOptionsFor(lines).some(isSafeLine);
}

const countSafeReportsWDampener = (lines: number[][]): number => {
    return lines.filter(isSafeLineWDampener).length;
}

const main = () => {
    const simpleExample: number[][] = readInputFile("InputDay2Simple.txt");
    assert(countSafeReports(simpleExample) === 2, "Simple example failed");
    assert(countSafeReportsWDampener(simpleExample) === 4, "Simple example with dampener failed");

    const input: number[][] = readInputFile("InputDay2.txt");
    console.log("Input has", countSafeReports(input), "safe reports");
    console.log("Input has", countSafeReportsWDampener(input), "safe reports with dampener");
}

main();