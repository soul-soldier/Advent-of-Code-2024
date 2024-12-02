import * as fs from 'fs';

function readInputFile(filePath: string): number[][] {
    const data = fs.readFileSync(filePath, 'utf-8');
    
    const lines: number[][] = data
    .trim()
    .split('\n')
    .map(line => line.trim().split(" ").map(Number));

    return lines;
}

const checkLineOrder = (line: number[]): string => {
    const isAscending = line.every((val, idx, arr) => idx === 0 || arr[idx - 1] <= val);
    const isDescending = line.every((val, idx, arr) => idx === 0 || arr[idx - 1] >= val);

    if (isAscending) return "Ascending";
    if (isDescending) return "Descending";
    return "Unordered";
}

const countSafeReports = (lines: number[][]): number => {
    let count: number = 0;

   for (const line of lines) {

    const lineOrder: string = checkLineOrder(line);
    if (lineOrder === "Unordered") continue;
    let isValid = true;

    for (let j = 0; j < line.length - 1; j++) {
        const diff = Math.abs(line[j] - line[j + 1]);
        if (diff < 1 || diff > 3) {
            isValid = false;
            break;
        }
    }
    
    if (isValid) {
        count++;
    }
   }

   return count;
}

function main() : void {
   const lines: number[][] = readInputFile("InputDay2.txt");
   console.log(countSafeReports(lines));
}

main();