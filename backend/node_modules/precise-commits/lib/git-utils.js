"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var find_up_1 = require("find-up");
var path_1 = require("path");
var utils_1 = require("./utils");
function resolveNearestGitDirectoryParent(workingDirectory) {
    var gitDirectoryPath = find_up_1.sync('.git', { cwd: workingDirectory });
    if (!gitDirectoryPath) {
        throw new Error('No .git directory found');
    }
    return path_1.dirname(gitDirectoryPath);
}
exports.resolveNearestGitDirectoryParent = resolveNearestGitDirectoryParent;
function getDiffForFile(gitDirectoryParent, fullPath, base, head) {
    if (base && head) {
        return utils_1.runCommandSync('git', ['diff', '--unified=0', base, head, fullPath], gitDirectoryParent).stdout;
    }
    return utils_1.runCommandSync('git', ['diff', '--unified=0', '--cached', fullPath], gitDirectoryParent).stdout;
}
exports.getDiffForFile = getDiffForFile;
var DIFF_INDEX_FILTER = 'AM';
var SPECIAL_EMPTY_TREE_COMMIT_HASH = '4b825dc642cb6eb9a060e54bf8d69288fbee4904';
function getModifiedFilenames(gitDirectoryParent, base, head) {
    var diffIndexOutput;
    if (base && head) {
        diffIndexOutput = utils_1.runCommandSync('git', [
            'diff',
            '--name-status',
            "--diff-filter=" + DIFF_INDEX_FILTER,
            base,
            head,
        ], gitDirectoryParent).stdout;
    }
    else {
        var head_1 = '';
        try {
            head_1 = utils_1.runCommandSync('git', ['rev-parse', '--verify', 'HEAD'], gitDirectoryParent).stdout.replace('\n', '');
        }
        catch (err) {
            if (err.message.includes("fatal: Needed a single revision")) {
                head_1 = SPECIAL_EMPTY_TREE_COMMIT_HASH;
            }
            else {
                throw err;
            }
        }
        diffIndexOutput = utils_1.runCommandSync('git', [
            'diff-index',
            '--cached',
            '--name-status',
            "--diff-filter=" + DIFF_INDEX_FILTER,
            head_1,
        ], gitDirectoryParent).stdout;
    }
    var allFiles = parseDiffIndexOutput(diffIndexOutput);
    return allFiles.map(function (r) { return r.filename; });
}
exports.getModifiedFilenames = getModifiedFilenames;
function parseDiffIndexOutput(stdout) {
    var lines = stdout.split('\n');
    return lines.filter(Boolean).map(function (line) {
        var parts = line.split('\t');
        return {
            filename: parts[1],
            diffFilterChar: parts[0],
        };
    });
}
