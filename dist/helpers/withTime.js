"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toLength = (x, l) => x.toString().padStart(l, "0");
exports.withTime = (text) => {
    const d = new Date();
    return `{${toLength(d.getHours(), 2)}:${toLength(d.getMinutes(), 2)}:${toLength(d.getSeconds(), 2)}:${toLength(d.getMilliseconds(), 3)}}${text}`;
};
//# sourceMappingURL=withTime.js.map