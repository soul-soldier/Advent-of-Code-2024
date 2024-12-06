import * as fs from 'fs';

type Rule = [number, number];

const readInputFile = (filePath: string): number[][] => {
    const data = fs.readFileSync(filePath, 'utf-8');

    const lineToNumbers = (line: string) => line.trim().split(",").map(Number)

    const lines: number[][] = data
        .trim()
        .replace(/\r/g, '')
        .split('\n')
        .map(lineToNumbers);
    console.log(lines);
    return lines;
}

const readRules = (filePath: string): string[] => {
    const data = fs.readFileSync(filePath, 'utf-8');
    const rules: string[] = data
        .trim()
        .replace(/\r/g, '')
        .split('\n');
    return rules;
}

const parseRules = (rules: string[]): Rule[] => {
    return rules.map(rule => {
        const [X, Y] = rule.split('|').map(Number);
        return [X, Y];
    });
}

const verifyLine = (line: number[], rules: Rule[]): boolean => {
    const positions = new Map<number, number>();
    line.forEach((num, index) => positions.set(num, index));

    for (const [X, Y] of rules) {
        const posX = positions.get(X);
        const posY = positions.get(Y);

        if (posX === undefined || posY === undefined) continue;

        if (posX >= posY) {
            return false;
        }
    }

    return true;
}

const verifyLines = (lines: number[][], rules: string[]): boolean[] => {
    const parsedRules = parseRules(rules);
    return lines.map(line => verifyLine(line, parsedRules));
}

const getValidLines = (lines: number[][], rules: string[]): number[][] => {
    const parsedRules = parseRules(rules);
    return lines.filter(line => verifyLine(line, parsedRules));
};

const sumOfMiddleNrs = (lines: number[][]): number => {
    let sum: number = 0;

    for (const line of lines) {
        const middleIndex = Math.floor(line.length / 2);
        sum += line[middleIndex];
    }
    return sum;

};

const printValidityResults = (lines: number[][], results: boolean[], padding: number) => {
    console.log("Line                          | Status");
    console.log("--------------------------------------");
    lines.forEach((line, index) => {
        const status = results[index] ? "Valid" : "Invalid";
        console.log(`${line.join(',').padEnd(padding)} | ${status}`);
    });
    console.log("\n");
}

const main = () => {

    const simpleInputlines = readInputFile('InputDay5Simple.txt');
    const stringRulesSimple = readRules('RulesSimple.txt');
    //const rulesSimple = parseRules(stringRulesSimple);
    const resultsSimple = verifyLines(simpleInputlines, stringRulesSimple);
    printValidityResults(simpleInputlines, resultsSimple, 30);
    const sumSimpleInput = sumOfMiddleNrs(getValidLines(simpleInputlines, stringRulesSimple));
    console.log("Sum simple input: " + sumSimpleInput);

    const inputlines = readInputFile('InputDay5.txt');
    const stringRules = readRules('Rules.txt');
    const results = verifyLines(inputlines, stringRules);
    printValidityResults(inputlines, results, 70);
    const sumInput = sumOfMiddleNrs(getValidLines(inputlines, stringRules));
    console.log("Sum input: " + sumInput);
}

main();