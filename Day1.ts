import * as fs from 'fs';

function readInputFile(filePath: string): [number[], number[]] {
    const data = fs.readFileSync(filePath, 'utf-8');
    
    const lines = data.split('\n');
    
    const arr1: number[] = [];
    const arr2: number[] = [];
     
    lines.forEach(line => {
        const numbers = line.split("   ");
        if (numbers.length !== 2) {
           throw new Error('Invalid input');
        }
        arr1.push(parseInt(numbers[0], 10));
        arr2.push(parseInt(numbers[1], 10));
    });

    return [arr1, arr2];
}

function calculateSimilarityScore(arr1: number[], arr2: number[]): number {
    let similarityScore: number = 0;
    arr1.forEach(num => {
        const amountInArr2 = arr2.filter(n => n === num).length;
        similarityScore += num * amountInArr2; 
    })

    return similarityScore;
}

const calculateSumDistance = (arr1: number[], arr2: number[]): number =>{
    let sum: number = 0;
    const sortedArr1: number[] = [...arr1].sort((a, b) => a - b);
    const sortedArr2: number[] = [...arr2].sort((a, b) => a - b);

    for (let i = 0; i < arr1.length; i++) {
        sum += Math.abs(sortedArr1[i] - sortedArr2[i]);
    }

    return sum;
}

function main() : void {
    const [arr1, arr2] = readInputFile('InputDay1.txt');
    console.log(calculateSumDistance(arr1, arr2));
    console.log(calculateSimilarityScore(arr1, arr2));
}

main(); 