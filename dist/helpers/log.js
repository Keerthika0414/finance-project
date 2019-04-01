"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
exports.log = (text, color) => console.log(chalk_1.default[color](typeof text === "object" ? JSON.stringify(text) : text));
exports.c_log = (text) => exports.log(text, "yellowBright");
//# sourceMappingURL=log.js.map