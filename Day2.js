"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function readInputFile(filePath) {
    var data = fs.readFileSync(filePath, 'utf-8');
    var lines = data
        .trim()
        .split('\n')
        .map(function (line) { return line.trim().split(" ").map(Number); });
    return lines;
}
var checkLineOrder = function (line) {
    var isAscending = line.every(function (val, idx, arr) { return idx === 0 || arr[idx - 1] <= val; });
    var isDescending = line.every(function (val, idx, arr) { return idx === 0 || arr[idx - 1] >= val; });
    if (isAscending)
        return "Ascending";
    if (isDescending)
        return "Descending";
    return "Unordered";
};
var isValidLine = function (line) {
    for (var j = 0; j < line.length - 1; j++) {
        var diff = Math.abs(line[j] - line[j + 1]);
        if (diff < 1 || diff > 3) {
            return false;
        }
    }
    return true;
};
var countSafeReports = function (lines) {
    var count = 0;
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var lineOrder = checkLineOrder(line);
        if (lineOrder === "Unordered")
            continue;
        var isValid = true;
        for (var j = 0; j < line.length - 1; j++) {
            var diff = Math.abs(line[j] - line[j + 1]);
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
};
var countSafeReportsWDampener = function (lines) {
    var count = 0;
    // for testing purposes, can be deleted after
    var lineNumberCount = 1;
    for (var _i = 0, lines_2 = lines; _i < lines_2.length; _i++) {
        var line = lines_2[_i];
        var lineOrder = checkLineOrder(line);
        if (lineOrder !== "Unordered" && isValidLine(line)) {
            count++;
            continue;
        }
        ;
        var isSafeByRemovingOne = false;
        for (var i = 0; i < line.length; i++) {
            var modifiedLine = line.slice(0, i).concat(line.slice(i + 1));
            if (checkLineOrder(modifiedLine) !== "Unordered" && isValidLine(modifiedLine)) {
                isSafeByRemovingOne = true;
                break;
            }
        }
        if (isSafeByRemovingOne) {
            count++;
            console.log("line ".concat(lineNumberCount, " is safe by removing one"));
            lineNumberCount++;
        }
    }
    return count;
};
function main() {
    var simpleExample = readInputFile("InputDay2Simple.txt");
    var input = readInputFile("InputDay2.txt");
    console.log(countSafeReports(input));
    console.log(countSafeReportsWDampener(input));
}
main();
