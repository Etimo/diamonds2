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
var path_1 = require("path");
var git_utils_1 = require("./git-utils");
var utils_1 = require("./utils");
var modified_file_1 = require("./modified-file");
var prettier_1 = require("./precise-formatters/prettier");
function main(workingDirectory, additionalOptions, callbacks) {
    if (callbacks === void 0) { callbacks = {
        onInit: function () { },
        onModifiedFilesDetected: function () { },
        onBegunProcessingFile: function () { },
        onFinishedProcessingFile: function () { },
        onError: function () { },
        onComplete: function () { },
    }; }
    try {
        var options_1 = __assign({
            filesWhitelist: null,
            base: null,
            head: null,
            checkOnly: false,
            formatter: 'prettier',
        }, additionalOptions);
        if (options_1.formatter !== 'prettier') {
            throw new Error("The only supported value for \"formatter\" option is \"prettier\"");
        }
        var selectedFormatter_1 = prettier_1.preciseFormatterPrettier;
        callbacks.onInit(workingDirectory);
        var gitDirectoryParent_1 = git_utils_1.resolveNearestGitDirectoryParent(workingDirectory);
        var modifiedFilenames = git_utils_1.getModifiedFilenames(gitDirectoryParent_1, options_1.base, options_1.head)
            .filter(selectedFormatter_1.hasSupportedFileExtension)
            .filter(utils_1.generateFilesWhitelistPredicate(options_1.filesWhitelist))
            .filter(selectedFormatter_1.generateIgnoreFilePredicate(workingDirectory));
        var totalFiles_1 = modifiedFilenames.length;
        callbacks.onModifiedFilesDetected(modifiedFilenames);
        modifiedFilenames.forEach(function (filename, index) {
            callbacks.onBegunProcessingFile(filename, index, totalFiles_1);
            var modifiedFile = new modified_file_1.ModifiedFile({
                fullPath: path_1.join(gitDirectoryParent_1, filename),
                gitDirectoryParent: gitDirectoryParent_1,
                base: options_1.base,
                head: options_1.head,
                selectedFormatter: selectedFormatter_1,
            });
            if (modifiedFile.isAlreadyFormatted()) {
                return callbacks.onFinishedProcessingFile(filename, index, 'NOT_UPDATED');
            }
            var err = modifiedFile.calculateModifiedCharacterRanges().err;
            if (err) {
                if (err.message === utils_1.NO_LINE_CHANGE_DATA_ERROR) {
                    return callbacks.onFinishedProcessingFile(filename, index, 'NOT_UPDATED');
                }
                throw err;
            }
            if (options_1.checkOnly) {
                if (!modifiedFile.hasValidFormattingForCharacterRanges()) {
                    return callbacks.onFinishedProcessingFile(filename, index, 'INVALID_FORMATTING');
                }
                else {
                    return callbacks.onFinishedProcessingFile(filename, index, 'NOT_UPDATED');
                }
            }
            modifiedFile.formatCharacterRangesWithinContents();
            if (!modifiedFile.shouldContentsBeUpdatedOnDisk()) {
                return callbacks.onFinishedProcessingFile(filename, index, 'NOT_UPDATED');
            }
            modifiedFile.updateFileOnDisk();
            return callbacks.onFinishedProcessingFile(filename, index, 'UPDATED');
        });
        callbacks.onComplete(totalFiles_1);
    }
    catch (err) {
        callbacks.onError(err);
    }
}
exports.main = main;
