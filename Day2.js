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
function main() {
    var lines = readInputFile("InputDay2.txt");
    console.log(countSafeReports(lines));
}
main();
