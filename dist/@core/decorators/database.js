"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = (connectionURI) => {
    const server = global.__curieServer;
    return server.database(connectionURI);
};
//# sourceMappingURL=database.js.map