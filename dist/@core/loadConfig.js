"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
exports.DEFAULT_CURIE_CONFIG = {
    public: "./public",
    routes: "./routes",
    database: "",
    listeners: ["./", "list.[jt]s"],
    middleware: ["./", "mdw.[jt]s"],
    root: path_1.default.dirname(require.main.filename)
};
exports.loadConfig = () => {
    const root = path_1.default.dirname(require.main.filename);
    let config;
    try {
        config = Object.assign(fs_extra_1.default.readJSONSync(path_1.default.resolve(root, "curie.config.json"), { encoding: "utf-8" }), { root });
    }
    catch (err) {
        config = { root };
    }
    global.__curieRoot = root;
    global.__curieConfig = config;
    return config;
};
//# sourceMappingURL=loadConfig.js.map