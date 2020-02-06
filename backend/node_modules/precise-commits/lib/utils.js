"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var execa = require("execa");
exports.NO_LINE_CHANGE_DATA_ERROR = 'No line change data could be detected';
function extractLineChangeData(diffData) {
    var lineChanges = diffData.match(/@@.*@@/g);
    if (!lineChanges) {
        throw new Error(exports.NO_LINE_CHANGE_DATA_ERROR);
    }
    var lineChangeData = {
        removals: [],
        additions: [],
    };
    lineChanges.forEach(function (lineChange) {
        var d = lineChange.match(/(@@ )(-\d+,?\d*)( )(\+\d+,?\d*)( @@)/);
        if (!d) {
            throw new Error('The detected line change data could be not be parsed');
        }
        var _a = d[2].split(','), removalStartLine = _a[0], _b = _a[1], noOfLinesRemoved = _b === void 0 ? 1 : _b;
        var _c = d[4].split(','), additionStartLine = _c[0], _d = _c[1], noOfLinesAdded = _d === void 0 ? 1 : _d;
        if (noOfLinesRemoved > 0) {
            lineChangeData.removals.push({
                start: +removalStartLine.replace('-', ''),
                noOfLines: +noOfLinesRemoved,
            });
        }
        if (noOfLinesAdded > 0) {
            lineChangeData.additions.push({
                start: +additionStartLine.replace('+', ''),
                noOfLines: +noOfLinesAdded,
            });
        }
    });
    return lineChangeData;
}
exports.extractLineChangeData = extractLineChangeData;
function getTextBeforeLineIndex(linesInFile, index) {
    return linesInFile.slice(0, index).join('\n');
}
function calculateCharacterRangesFromLineChanges(lineChangeData, fileContents) {
    var linesInFile = fileContents.split('\n');
    return lineChangeData.additions.map(function (added) {
        var startLineNumberIndex = added.start - 1;
        var textBeforeStartOfStartLine = getTextBeforeLineIndex(linesInFile, startLineNumberIndex);
        var rangeStart = textBeforeStartOfStartLine.length;
        var endLineNumberIndex = startLineNumberIndex + added.noOfLines - 1;
        var textBeforeEndOfEndLine = getTextBeforeLineIndex(linesInFile, endLineNumberIndex + 1);
        var rangeEnd = textBeforeEndOfEndLine.length;
        return {
            rangeStart: rangeStart,
            rangeEnd: rangeEnd,
        };
    });
}
exports.calculateCharacterRangesFromLineChanges = calculateCharacterRangesFromLineChanges;
function runCommandSync(command, args, workingDirectory) {
    if (workingDirectory === void 0) { workingDirectory = process.cwd(); }
    return execa.sync(command, args, { cwd: workingDirectory });
}
exports.runCommandSync = runCommandSync;
function generateFilesWhitelistPredicate(filesWhitelist) {
    if (!filesWhitelist) {
        return function () { return true; };
    }
    return function (file) { return filesWhitelist.includes(file); };
}
exports.generateFilesWhitelistPredicate = generateFilesWhitelistPredicate;
