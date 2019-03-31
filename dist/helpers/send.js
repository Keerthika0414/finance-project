"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const switchDataType = (x) => {
    if (x instanceof Buffer)
        return x.toString("utf-8");
    else if (["object", "bigint", "symbol"].some(a => a === typeof x))
        return JSON.stringify(x);
    return x;
};
exports.send = (res, data, headers = {}) => {
    res.writeHead(200);
    if (!res.headersSent)
        for (const header in headers)
            res.setHeader(header, headers[header]);
    res.write(switchDataType(data), "utf-8");
};
//# sourceMappingURL=send.js.map