"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function readInputFile(filePath) {
    var data = fs.readFileSync(filePath, 'utf-8');
    var lines = data.split('\n');
    var arr1 = [];
    var arr2 = [];
    lines.forEach(function (line) {
        var numbers = line.split("   ");
        if (numbers.length !== 2) {
            throw new Error('Invalid input');
        }
        arr1.push(parseInt(numbers[0], 10));
        arr2.push(parseInt(numbers[1], 10));
    });
    return [arr1, arr2];
}
function calculateSimilarityScore(arr1, arr2) {
    var similarityScore = 0;
    arr1.forEach(function (num) {
        var amountInArr2 = arr2.filter(function (n) { return n === num; }).length;
        similarityScore += num * amountInArr2;
    });
    return similarityScore;
}
var calculateSumDistance = function (arr1, arr2) {
    var sum = 0;
    var sortedArr1 = __spreadArray([], arr1, true).sort(function (a, b) { return a - b; });
    var sortedArr2 = __spreadArray([], arr2, true).sort(function (a, b) { return a - b; });
    for (var i = 0; i < arr1.length; i++) {
        sum += Math.abs(sortedArr1[i] - sortedArr2[i]);
    }
    return sum;
};
function main() {
    var _a = readInputFile('Input.txt'), arr1 = _a[0], arr2 = _a[1];
    console.log(calculateSumDistance(arr1, arr2));
    console.log(calculateSimilarityScore(arr1, arr2));
}
main();
