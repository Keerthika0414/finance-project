"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const isFile = (p) => /\./g.test(p);
exports.getDirs = (dir) => fs_extra_1.default
    .readdirSync(dir)
    .reduce((acc, el) => {
    if (!isFile(el)) {
        const full_path = path_1.default.resolve(dir, el);
        const sub_dirs = exports.getDirs(full_path);
        if (sub_dirs.length === 0)
            acc.push(full_path);
        else
            acc = acc.concat(sub_dirs);
    }
    return acc;
}, []);
//# sourceMappingURL=getDirs.js.map