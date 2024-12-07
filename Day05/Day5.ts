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

type GraphResult = {
    graph: Map<number, Set<number>>;
    inDegree: Map<number, number>;
};

//build topological graph according to the given rules
function buildGraph(rules: Rule[]): GraphResult {
    const graph = new Map<number, Set<number>>();
    const inDegree = new Map<number, number>();

    // iterate over rules and add nodes accordingly
    rules.forEach(([X, Y]) => {
        if (!graph.has(X)) graph.set(X, new Set());
        if (!graph.has(Y)) graph.set(Y, new Set());

        graph.get(X)!.add(Y);
        inDegree.set(Y, (inDegree.get(Y) || 0) + 1);
        if (!inDegree.has(X)) inDegree.set(X, 0);
    });

    return { graph, inDegree };
}

function topologicalSort(graph: Map<number, Set<number>>, inDegree: Map<number, number>): number[] {
    const queue: number[] = [];
    const result: number[] = [];

    // initialize the queue with nodes that have no in-edges
    inDegree.forEach((degree, node) => {
        if (degree === 0) {
            queue.push(node);
        };

    });

    while (queue.length > 0) {
        const current = queue.shift()!;
        result.push(current);

        // neighbors of the current node
        const neighbors = graph.get(current);
        neighbors?.forEach((neighbor) => {
            inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
            if (inDegree.get(neighbor) === 0) {
                queue.push(neighbor);
            }
        });
    }

    return result;
}

function sortLine(line: number[], rules: Rule[]): number[] {
    const { graph, inDegree } = buildGraph(filterRules(rules, line));
    const sortedOrder = topologicalSort(graph, inDegree);
    const positionMap = new Map<number, number>();
    sortedOrder.forEach((num, index) => positionMap.set(num, index));
    console.log("Position Map: ", positionMap);
    return [...line].sort((a, b) => (positionMap.get(a) ?? Infinity) - (positionMap.get(b) ?? Infinity));
}

function sortInvalidLines(lines: number[][], rules: string[]): number[][] {
    const parsedRules = parseRules(rules);
    return lines.filter(line => !verifyLine(line, parsedRules)).map(line => sortLine(line, parsedRules));
}

function sortInvalidLinesAndCalculateSum(lines: number[][], rules: string[]): number {
    const parsedRules = parseRules(rules);

    // Step 1: Filter invalid lines
    const invalidLines = lines.filter(line => !verifyLine(line, parsedRules));

    // Step 2: Sort invalid lines
    const sortedInvalidLines = invalidLines.map(line => sortLine(line, parsedRules));

    // Step 3: Sum middle numbers from the sorted invalid lines
    const sumMiddleNumbers = sortedInvalidLines.reduce((sum, line) => {
        const middleIndex = Math.floor(line.length / 2);
        return sum + line[middleIndex];
    }, 0);

    return sumMiddleNumbers;
}

const findNodesWithoutInEdges = (rules: number[][]): number[] => {
    let firstNumbers = rules.map(rule => rule[0]);
    let secondNumbers = rules.map(rule => rule[1]);
    return firstNumbers.filter(first => !secondNumbers.includes(first));
}

const filterRules = (rules: Rule[], line: number[]): Rule[] => {
    return rules.filter(rule => line.includes(rule[0]) && line.includes(rule[1]));
}

const solvePart1 = () => {
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

const main = () => {
    //solvePart1();

    const simpleInputlines = readInputFile('InputDay5Simple.txt');
    const stringRulesSimple = readRules('RulesSimple.txt');

    const sortedLines = sortInvalidLines(simpleInputlines, stringRulesSimple);
    simpleInputlines.forEach((line, index) => {
        if (verifyLine(line, parseRules(stringRulesSimple)) === false) {
            {
                console.log(`Original Line: ${line}`);
                console.log(`Sorted Line:   ${sortedLines[index]}`);
            }
        }
    });

    const sortedSum = sumOfMiddleNrs(sortedLines);
    console.log("Sum input: " + sortedSum);


    const inputlines = readInputFile('InputDay5.txt');
    const stringRules = readRules('Rules.txt');
    const sortedLines2 = sortInvalidLines(inputlines, stringRules);
    const parsedRules = parseRules(stringRules);
    inputlines.filter(line => !verifyLine(line, parsedRules)).forEach((line, index) => {
        console.log(`Original Line: ${line}`);
        console.log(`Sorted Line:   ${sortedLines2[index]}`);
    });
    const sortedSum2 = sumOfMiddleNrs(sortedLines2);
    console.log("Sum input: " + sortedSum2);

    const sumMiddleNumbers = sortInvalidLinesAndCalculateSum(inputlines, stringRules);

    console.log("Sum of middle numbers from sorted invalid lines: " + sumMiddleNumbers);

    console.log(findNodesWithoutInEdges(parsedRules));

};

main();