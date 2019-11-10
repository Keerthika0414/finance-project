"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = require("./log");
const child_process_1 = __importDefault(require("child_process"));
function* runTasks() {
    for (const task of this.options.preRun) {
        const logger = (c) => log_1.initLogger(`Task:${task}`, c);
        yield new Promise((res, rej) => {
            const p = child_process_1.default.exec(task);
            p.stdout && p.stdout.on("data", logger("cyanBright"));
            p.on("close", res);
            p.on("error", logger("redBright"));
        });
    }
}
exports.runTasks = runTasks;
//# sourceMappingURL=runTasks.js.map