"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path_1 = require("path");
var prettier_1 = require("prettier");
var ignore = require('ignore');
var DiffMatchPatch = require('diff-match-patch');
var dmp = new DiffMatchPatch();
var PRETTIER_SUPPORTED_FILE_EXTENSIONS = [];
prettier_1.getSupportInfo().languages.forEach(function (language) {
    PRETTIER_SUPPORTED_FILE_EXTENSIONS = PRETTIER_SUPPORTED_FILE_EXTENSIONS.concat(language.extensions);
});
exports.preciseFormatterPrettier = {
    resolveConfig: function (modifiedFilePath) {
        return __assign({}, prettier_1.resolveConfig.sync(modifiedFilePath, {
            useCache: false,
        }), { filepath: modifiedFilePath });
    },
    isAlreadyFormatted: function (fileContents, config) {
        return prettier_1.check(fileContents, __assign({}, config));
    },
    checkFormattingOfRanges: function (fileContents, config, characterRanges) {
        var formattedContents = fileContents;
        return characterRanges.every(function (characterRange) {
            return prettier_1.check(formattedContents, __assign({}, config, {
                rangeStart: characterRange.rangeStart,
                rangeEnd: characterRange.rangeEnd,
            }));
        });
    },
    formatRanges: function (fileContents, config, characterRanges) {
        var patches = [];
        characterRanges.forEach(function (characterRange) {
            var diffs = dmp.diff_main(fileContents, prettier_1.format(fileContents, __assign({}, config, {
                rangeStart: characterRange.rangeStart,
                rangeEnd: characterRange.rangeEnd,
            })));
            patches = patches.concat(dmp.patch_make(fileContents, diffs));
        });
        var formattedContents = dmp.patch_apply(patches, fileContents)[0];
        return formattedContents;
    },
    generateIgnoreFilePredicate: function (workingDirectory) {
        var prettierIgnoreFilePath = path_1.join(workingDirectory, '.prettierignore');
        if (!fs.existsSync(prettierIgnoreFilePath)) {
            return function () { return true; };
        }
        var prettierIgnoreFileContents = fs.readFileSync(prettierIgnoreFilePath, 'utf8');
        return ignore()
            .add(prettierIgnoreFileContents)
            .createFilter();
    },
    hasSupportedFileExtension: function (filename) {
        var fileExtension = path_1.extname(filename);
        return PRETTIER_SUPPORTED_FILE_EXTENSIONS.includes(fileExtension);
    },
};
