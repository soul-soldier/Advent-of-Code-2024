import * as fs from 'fs';

type Rule = [number, number];

const splitByLine = (input: string): string[] => input
    .trim()
    .replace(/\r/g, '')
    .split('\n')

const readInputFile = (filePath: string): number[][] => {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lineToNumbers = (line: string) => line.trim().split(",").map(Number)
    const lines: number[][] = splitByLine(data).map(lineToNumbers);
    return lines;
}

const readRules = (filePath: string): string[] => {
    const data = fs.readFileSync(filePath, 'utf-8');
    const rules: string[] = splitByLine(data);
    return rules;
}

const parseRules = (rules: string[]): Rule[] => {
    return rules.map(rule => {
        const [X, Y] = rule.split('|').map(Number);
        return [X, Y];
    });
}

const verifyLine = (line: number[], rules: Rule[]): boolean => {
    const positions = new Map<number, number>(line.map((num, index) => [num, index]));

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

const verifyLines = (lines: number[][], rules: string[]): boolean[] => lines.map(line => verifyLine(line, parseRules(rules)));
const getValidLines = (lines: number[][], rules: string[]): number[][] => lines.filter(line => verifyLine(line, parseRules(rules)));
const sumOfMedians = (lines: number[][]): number => lines.map(getMedian).reduce((sum, median) => sum + median, 0);

const printValidityResults = (lines: number[][], results: boolean[]) => {
    const formattedLines = lines.map((line, index) => ({ line: line.join(','), valid: results[index] ? "Valid" : "Invalid" }));
    console.table(formattedLines);
}

type GraphResult = {
    graph: Map<number, Set<number>>;
    inDegree: Map<number, number>;
};

//build topological graph according to the given rules
const buildGraph = (rules: Rule[]): GraphResult => {
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

const topologicalSort = (graph: Map<number, Set<number>>, inDegree: Map<number, number>): number[] => {
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
    const positionMap = new Map<number, number>(sortedOrder.map((num, index) => [num, index]));
    return [...line].sort((a, b) => (positionMap.get(a) ?? Infinity) - (positionMap.get(b) ?? Infinity));
}

const getMedian = (numbers: number[]): number => numbers[Math.floor(numbers.length / 2)]

const sortInvalidLinesAndCalculateSum = (lines: number[][], rules: string[]): number => {
    const parsedRules = parseRules(rules);

    // Step 1: Filter invalid lines
    const invalidLines = lines.filter(line => !verifyLine(line, parsedRules));

    // Step 2: Sort invalid lines
    const sortedInvalidLines = invalidLines.map(line => sortLine(line, parsedRules));

    // Step 3: Sum middle numbers from the sorted invalid lines
    const sumMiddleNumbers = sumOfMedians(sortedInvalidLines);

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

const solvePart1 = (input: { rules: string, input: string }) => {
    const inputlines = readInputFile(input.input);
    const stringRules = readRules(input.rules);
    const results = verifyLines(inputlines, stringRules);
    printValidityResults(inputlines, results);
    const sumSimpleInput = sumOfMedians(getValidLines(inputlines, stringRules));
    console.log("Sum simple input: " + sumSimpleInput);
}

const solvePart2 = (input: { rules: string, input: string }) => {
    const inputlines = readInputFile(input.input);
    const stringRules = readRules(input.rules);
    const sumMiddleNumbers = sortInvalidLinesAndCalculateSum(inputlines, stringRules);
    console.log("Sum of middle numbers from sorted invalid lines: " + sumMiddleNumbers);
}

const main = () => {
    const simpleRulesFile = 'RulesSimple.txt';
    const simpleInputFile = 'InputDay5Simple.txt';
    const simpleInput = { rules: simpleRulesFile, input: simpleInputFile };
    const rulesFile = 'Rules.txt';
    const inputFile = 'InputDay5.txt';
    const input = { rules: rulesFile, input: inputFile };

    const currentInput = simpleInput
    solvePart1(currentInput);
    solvePart2(currentInput);
};

main();