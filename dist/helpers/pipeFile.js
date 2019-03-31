"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const switchMIME_1 = require("./switchMIME");
exports.pipeFile = (path, destination) => new Promise((res, rej) => {
    if (destination.writable && !destination.headersSent) {
        const s = fs_extra_1.default.createReadStream(path);
        s.on("open", () => {
            destination.writeHead(200);
            destination.setHeader("Content-Type", switchMIME_1.switchMIME(path));
        });
        s.on("close", () => {
            destination.end();
            res([null, true]);
        });
        s.on("error", rej);
        s.pipe(destination, { end: true });
    }
    else {
        rej(new Error("[pipeFile]> Response already sent"));
    }
});
//# sourceMappingURL=pipeFile.js.map