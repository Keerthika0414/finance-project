"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pug_1 = __importDefault(require("pug"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
class RouteParser {
    constructor(path, server) {
        this.path = path;
        this.routes = {};
        this.server = server;
    }
}
exports.RouteParser = RouteParser;
class PugParser extends RouteParser {
    constructor(path, server) {
        super(path, server);
    }
    compile(route) {
        try {
            this.routes = Object.assign(this.routes, {
                [route]: pug_1.default.compile(path_1.default.resolve(), {
                    basedir: this.path
                })
            });
            return [null, true];
        }
        catch (err) {
            return [err, false];
        }
    }
    compileAll() {
        return __awaiter(this, void 0, void 0, function* () {
            let err = null;
            yield fs_extra_1.default.readdir(this.path)
                .then(names => names.filter(x => /\.pug$/.test(x)))
                .then(filtered => filtered.reduce((acc, x) => {
                const found_name = /^([\w\d-_]+)/g.exec(x);
                const name = found_name
                    ? found_name[0]
                    : x;
                const file = fs_extra_1.default.readFileSync(path_1.default.resolve(this.path, x)).toString("utf-8");
                const r = /(\$\w+:\s*.+)/gmi;
                const meta_data = file.match(r);
                const meta = (meta_data || []).reduce((acc, x) => {
                    const v = x.match(/\$(\w+)/i)[1];
                    const val = x.match(/:(.*)/i)[1].trim();
                    return Object.assign(acc, { [v]: val });
                }, {});
                return Object.assign(acc, { [name]: {
                        exec: pug_1.default.compile(file.replace(/\/\/#.*/gim, '')),
                        meta
                    } });
            }, {}))
                .then(xs => this.routes = Object.assign(this.routes, xs))
                .catch(e => err = e);
            return [err, !err];
        });
    }
    render(res, route, locals = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const ex = this.routes[route];
            if (ex && typeof ex.exec === "function") {
                let err = null;
                !res.headersSent && res.setHeader("Content-Type", "text/html");
                for (const v_key in ex.meta) {
                    if (v_key in locals)
                        continue;
                    if (this.server.db)
                        locals[v_key] = yield this.server.db.get(ex.meta[v_key]);
                }
                res.write(ex.exec(Object.assign(locals, {
                    db: this.server.db
                })));
                return [err, !err];
            }
            throw new Error(`[PugParser]> Route "${route}" not found`);
        });
    }
}
exports.PugParser = PugParser;
//# sourceMappingURL=RouteParser.js.map