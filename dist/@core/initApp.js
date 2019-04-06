"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const Server_1 = require("../Server");
const fs_extra_1 = __importDefault(require("fs-extra"));
const log_1 = require("../helpers/log");
const withTime_1 = require("../helpers/withTime");
exports.initApp = (_config) => __awaiter(this, void 0, void 0, function* () {
    const config = Object.assign(Server_1.Server.DEFAULT_SERVER_OPTIONS, _config);
    config.root = config.root.replace(/(\\)+/gi, "/");
    log_1.c_log(withTime_1.withTime(`[Curie]> Config ${JSON.stringify(config, null, 2)}`));
    const server = new Server_1.Server(config);
    yield server.init(config);
    global.__curieServer = server;
    if (config.database)
        global.__curieDatabase = require(path_1.default.resolve(config.root, config.database)).default;
    for (const [dir, ext] of ["listeners", "middleware"].map(x => config[x].concat(x))) {
        const r = ext instanceof RegExp ? ext : new RegExp(`.${ext}$`, "i");
        if (dir && ext) {
            yield fs_extra_1.default.readdir(path_1.default.resolve(config.root, dir))
                .then((f_names) => f_names.forEach(x => {
                if (r.test(x))
                    require(path_1.default.resolve(config.root, dir, x));
            }));
        }
    }
    return server;
});
//# sourceMappingURL=initApp.js.map