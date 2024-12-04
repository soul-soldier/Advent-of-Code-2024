import * as fs from 'fs';

const readInput = (input: string): string[][] => {
    const inputString = fs.readFileSync(input, 'utf-8');
    return convertTo2DArray(inputString);
}

const convertTo2DArray = (input: string): string[][] => {
    const result: string[][] = input
        .trim()
        .replace(/\r/g, '')
        .split('\n')
        .map(line => line.split(""));

    return result;
}

const getDirections = (): [number, number][] => [
    [0, 1],   // right 0
    [0, -1],  // left  1
    [1, 0],   // down  2
    [-1, 0],  // up    4
    [1, 1],   // diagonal down-right 5
    [1, -1],  // diagonal down-left  6
    [-1, 1],  // diagonal up-right   7
    [-1, -1], // diagonal up-left    8
];

const moveInDirection = (row: number, col: number, direction: [number, number]): [number, number] => {
    const [rowMovement, colMovement] = direction;
    return [row + rowMovement, col + colMovement];
};

const isValidCell = (row: number, col: number, grid: string[][]): boolean => {
    return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
};

const findAllMatches = (grid: string[][], word: string): { start: [number, number], direction: [number, number] }[] => {
    const directions = getDirections();
    const matches: { start: [number, number], direction: [number, number] }[] = [];

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            for (const direction of directions) {
                let [currentRow, currentCol] = [row, col];
                let found = true;

                for (const char of word) {
                    if (!isValidCell(currentRow, currentCol, grid) || grid[currentRow][currentCol] !== char) {
                        found = false;
                        break;
                    }
                    [currentRow, currentCol] = moveInDirection(currentRow, currentCol, direction);
                }
                if (found) {
                    matches.push({ start: [row, col], direction });
                }
            }
        }
    }

    return matches;
};

const main = () => {
    const simpleWordSearch: string[][] = readInput("InputDay4Simple.txt");
    const matchesSimpleWordSearch = findAllMatches(simpleWordSearch, "XMAS");
    console.log(matchesSimpleWordSearch.length);

    const wordSearch: string[][] = readInput("InputDay4.txt");
    const matches = findAllMatches(wordSearch, "XMAS");
    console.log(matches.length);
}

main();