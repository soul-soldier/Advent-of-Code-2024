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

const findAllMatchesFromStartingPoint = (grid: string[][], word: string, row: number, col: number): { start: [number, number], direction: [number, number] }[] => {
    const directions = getDirections();
    const matches: { start: [number, number], direction: [number, number] }[] = [];
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

    return matches;
}

const findAllMatches = (grid: string[][], word: string): { start: [number, number], direction: [number, number] }[] => {
    const matches: { start: [number, number], direction: [number, number] }[] = [];

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            const matchesForStartingPoint = findAllMatchesFromStartingPoint(grid, word, row, col);
            matches.push(...matchesForStartingPoint);
        }
    }

    return matches;
};

const getValidDiagonalCombinations = (): [[number, number], [number, number]][] => [
    [[1, 1], [-1, -1]], // ↘, ↙
    [[-1, 1], [1, -1]], // ↖, ↗
];

/* const isValidArrowUpRight = (row: number, col: number, grid: string[][], word: string): boolean => {
    for (const char of word) {
        if (!isValidCell(row, col, grid) || grid[row][col] !== char) {
            return false;
        }
        [row, col] = moveInDirection(row, col, [1, -1]);
    }

    return true;
};

const isValidArrowDownRight = (row: number, col: number, grid: string[][], word: string): boolean => {
    for (const char of word) {
        if (!isValidCell(row, col, grid) || grid[row][col] !== char) {
            return false;
        }
        [row, col] = moveInDirection(row, col, [1, 1]);
    }

    return true;
};

const isValidArrowDownLeft = (row: number, col: number, grid: string[][], word: string): boolean => {
    for (const char of word) {
        if (!isValidCell(row, col, grid) || grid[row][col] !== char) {
            return false;
        }
        [row, col] = moveInDirection(row, col, [-1, -1]);
    }

    return true;
};

const isValidArrowUpLeft = (row: number, col: number, grid: string[][], word: string): boolean => {
    for (const char of word) {
        if (!isValidCell(row, col, grid) || grid[row][col] !== char) {
            return false;
        }
        [row, col] = moveInDirection(row, col, [-1, 1]);
    }

    return true;
};

const findCrossMatchForCenter = (grid: string[][], word: string, row: number, col: number): boolean => {
    const combinations = getValidDiagonalCombinations();

    for (const combination of combinations) {
        let [currentRow, currentCol] = [row, col];
        let foundFirstDiagonal = true;
        let foundSecondDiagonal = true;

        // Check first diagonal (e.g., ↘ or ↖)

        if (!isValidCell(currentRow, currentCol, grid) || grid[currentRow][currentCol] !== "A") {
            foundFirstDiagonal = false;
            break;
        }
        if (!isValidArrowDownRight(currentRow, currentCol, grid, word) && !isValidArrowUpLeft(currentRow, currentCol, grid, word)) {
            foundFirstDiagonal = false;
            break;
        }
        let newRow = currentRow + 2;
        if (!isValidCell(newRow, currentCol, grid) || !isValidArrowUpRight(newRow, currentCol, grid, word) && !isValidArrowDownLeft(newRow, currentCol, grid, word)) {
            foundSecondDiagonal = false;
            break;
        }
    }
    return false;
}; */

const isValidArrowUpRight = (row: number, col: number, grid: string[][], word: string): boolean => {
    for (const char of word) {
        if (!isValidCell(row, col, grid) || grid[row][col] !== char) {
            return false;
        }
        [row, col] = moveInDirection(row, col, [1, -1]); // Move top-right (up-right)
    }
    return true;
};

const isValidArrowDownRight = (row: number, col: number, grid: string[][], word: string): boolean => {
    for (const char of word) {
        if (!isValidCell(row, col, grid) || grid[row][col] !== char) {
            return false;
        }
        [row, col] = moveInDirection(row, col, [1, 1]); // Move down-right
    }
    return true;
};

const isValidArrowDownLeft = (row: number, col: number, grid: string[][], word: string): boolean => {
    for (const char of word) {
        if (!isValidCell(row, col, grid) || grid[row][col] !== char) {
            return false;
        }
        [row, col] = moveInDirection(row, col, [-1, -1]); // Move down-left
    }
    return true;
};

const isValidArrowUpLeft = (row: number, col: number, grid: string[][], word: string): boolean => {
    for (const char of word) {
        if (!isValidCell(row, col, grid) || grid[row][col] !== char) {
            return false;
        }
        [row, col] = moveInDirection(row, col, [-1, 1]); // Move up-left
    }
    return true;
};

const findCrossMatchForCenter = (grid: string[][], word: string, row: number, col: number): boolean => {
    // Make sure the center point is valid
    if (grid[row][col] !== "A") { // You may want to generalize the start character
        return false;
    }

    // First diagonal check (e.g., ↘ or ↖)
    let foundFirstDiagonal = false;
    if (isValidArrowDownRight(row, col, grid, word)) {
        foundFirstDiagonal = true;
    } else if (isValidArrowUpLeft(row, col, grid, word)) {
        foundFirstDiagonal = true;
    }

    // If the first diagonal didn't match, return false
    if (!foundFirstDiagonal) {
        return false;
    }

    // Second diagonal check (e.g., ↙ or ↗)
    let foundSecondDiagonal = false;
    let newRow = row + 2; // Adjust to check the second diagonal row
    if (isValidArrowUpRight(newRow, col, grid, word)) {
        foundSecondDiagonal = true;
    } else if (isValidArrowDownLeft(newRow, col, grid, word)) {
        foundSecondDiagonal = true;
    }

    // Return true if both diagonals matched
    return foundSecondDiagonal;
};



const findAllCrossMatches = (grid: string[][], word: string): { start: [number, number] }[] => {
    const matches: { start: [number, number] }[] = [];

    // Loop through possible centers of "X" shapes
    for (let row = 1; row < grid.length - 1; row++) { // Start from row 1 and end at length - 1 to avoid edges
        for (let col = 1; col < grid[0].length - 1; col++) { // Same for columns
            if (findCrossMatchForCenter(grid, word, row, col)) {
                matches.push({ start: [row, col] });
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

    const crossMatchesSimpleWordSearch = findAllCrossMatches(simpleWordSearch, "MAS");
    console.log(crossMatchesSimpleWordSearch.length);

}

main();