"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var utils_1 = require("./utils");
var git_utils_1 = require("./git-utils");
var ModifiedFile = (function () {
    function ModifiedFile(_a) {
        var fullPath = _a.fullPath, gitDirectoryParent = _a.gitDirectoryParent, base = _a.base, head = _a.head, selectedFormatter = _a.selectedFormatter;
        this.modifiedCharacterRanges = [];
        this.fullPath = fullPath;
        this.gitDirectoryParent = gitDirectoryParent;
        this.base = base;
        this.head = head;
        this.selectedFormatter = selectedFormatter;
        this.resolveFileContents();
        this.resolveFormatterConfig();
    }
    ModifiedFile.prototype.isAlreadyFormatted = function () {
        return this.selectedFormatter.isAlreadyFormatted(this.fileContents, this.formatterConfig);
    };
    ModifiedFile.prototype.hasValidFormattingForCharacterRanges = function () {
        return this.selectedFormatter.checkFormattingOfRanges(this.fileContents, this.formatterConfig, this.modifiedCharacterRanges);
    };
    ModifiedFile.prototype.formatCharacterRangesWithinContents = function () {
        this.formattedFileContents = this.selectedFormatter.formatRanges(this.fileContents, this.formatterConfig, this.modifiedCharacterRanges);
    };
    ModifiedFile.prototype.shouldContentsBeUpdatedOnDisk = function () {
        return this.fileContents !== this.formattedFileContents;
    };
    ModifiedFile.prototype.updateFileOnDisk = function () {
        fs_1.writeFileSync(this.fullPath, this.formattedFileContents);
    };
    ModifiedFile.prototype.calculateModifiedCharacterRanges = function () {
        try {
            var diff = git_utils_1.getDiffForFile(this.gitDirectoryParent, this.fullPath, this.base, this.head);
            var lineChangeData = utils_1.extractLineChangeData(diff);
            this.modifiedCharacterRanges = utils_1.calculateCharacterRangesFromLineChanges(lineChangeData, this.fileContents);
            return { err: null };
        }
        catch (err) {
            return { err: err };
        }
    };
    ModifiedFile.prototype.resolveFileContents = function () {
        this.fileContents = fs_1.readFileSync(this.fullPath, 'utf8');
    };
    ModifiedFile.prototype.resolveFormatterConfig = function () {
        this.formatterConfig = this.selectedFormatter.resolveConfig(this.fullPath);
    };
    return ModifiedFile;
}());
exports.ModifiedFile = ModifiedFile;
