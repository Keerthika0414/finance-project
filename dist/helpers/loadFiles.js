"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const mime_1 = __importDefault(require("mime"));
const fixFilePath_1 = require("./fixFilePath");
exports.loadFilesFD = (dir, prefix) => new Promise((res, rej) => {
    const files = new Map();
    fs_extra_1.default.readdir(dir)
        .then(fnames => fnames.forEach(fname => {
        const filePath = path_1.default.join(dir, fname);
        const fileDescriptor = fs_extra_1.default.openSync(filePath, 'r');
        const stat = fs_extra_1.default.fstatSync(fileDescriptor);
        const contentType = mime_1.default.getType(filePath);
        files.set(`${prefix}/${fname}`, {
            fileDescriptor,
            headers: {
                'content-length': stat.size,
                'last-modified': stat.mtime.toUTCString(),
                'content-type': contentType,
            },
        });
    }))
        .then(() => res(files))
        .catch(rej);
});
exports.loadFilesData = (dir, prefix) => new Promise((res, rej) => {
    const files = new Map();
    fs_extra_1.default.readdir(dir)
        .then(names => names.filter(x => x.match(/\..+$/)))
        .then(fnames => fnames.forEach(fname => {
        const filePath = path_1.default.join(dir, fname);
        const contentType = mime_1.default.getType(filePath);
        let buffer;
        try {
            buffer = fs_extra_1.default.readFileSync(filePath);
        }
        catch (err) {
            return;
        }
        const key = `${prefix !== "/" ? fixFilePath_1.fixFilePath(prefix) : ''}/${fname}`;
        files.set(key, {
            buffer,
            mime: contentType
        });
    }))
        .then(() => res(files))
        .catch(rej);
});
//# sourceMappingURL=loadFiles.js.map