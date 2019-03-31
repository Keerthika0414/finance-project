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
const loadConfig_1 = require("./loadConfig");
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
exports.initApp = () => __awaiter(this, void 0, void 0, function* () {
    const config = loadConfig_1.loadConfig();
    const state = {};
    const server = yield require(path_1.default.resolve(config.root, config.server)).default.init(config);
    require(path_1.default.resolve(config.root, config.database));
    for (const [dir, ext, key] of ["listeners", "middleware"].map(x => config[x].concat(x))) {
        state[key] = yield fs_extra_1.default.readdir(path_1.default.resolve(config.root, dir))
            .then(f_names => f_names.reduce((modules, x) => {
            if (new RegExp(`.${ext}`, "i").test(x))
                modules.push(require(path_1.default.resolve(config.root, dir, x)));
            return modules;
        }, []));
    }
});
//# sourceMappingURL=initApp.js.map