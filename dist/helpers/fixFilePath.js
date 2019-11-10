"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixFilePath = (path) => path.replace(/^\/{2,}/, '/');
exports.normalizePath = (path) => path.replace(/(\\|\.?\/)+/g, '/');
//# sourceMappingURL=fixFilePath.js.map