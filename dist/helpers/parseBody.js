"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const querystring_1 = __importDefault(require("querystring"));
exports.parseBody = (req, outputType = 'string' || 'JSON') => new Promise((resolve, rej) => {
    let body = '';
    req.on("data", c => {
        body += c;
    })
        .on("end", () => {
        resolve(querystring_1.default.parse(body));
    })
        .on("error", rej);
});
//# sourceMappingURL=parseBody.js.map