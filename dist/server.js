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
const http_1 = __importDefault(require("http"));
const cookies_1 = __importDefault(require("cookies"));
const parseQuery_1 = require("./helpers/parseQuery");
const path_1 = __importDefault(require("path"));
const RouteParser_1 = require("./RouteParser");
const loadFiles_1 = require("./helpers/loadFiles");
const send_1 = require("./helpers/send");
const events_1 = require("events");
const withTime_1 = require("./helpers/withTime");
const log_1 = require("./helpers/log");
const parseBody_1 = require("./helpers/parseBody");
class Server extends events_1.EventEmitter {
    constructor(options = {}) {
        super();
        log_1.c_log(withTime_1.withTime("[CURIE]> Init: START"));
        this.server = http_1.default.createServer(this.onRequest.bind(this));
        this.hooks = [];
        this.middleware = [];
        this.files = new Map();
        this.options = Object.assign(Server.DEFAULT_SERVER_OPTIONS, options);
    }
    init(config) {
        return new Promise(res => {
            this.options.public = path_1.default.resolve(config.root, config.public);
            this.options.routes = path_1.default.resolve(config.root, config.routes);
            this.routeParser = new this.options.routeParser(this.options.routes, this);
            this.use = this.use.bind(this);
            Promise.all([this.__InitEvents(), this.__loadFiles()]).then(() => {
                log_1.c_log(withTime_1.withTime("[CURIE]> Init: END"));
                this.mix(this.options.port);
            }).then(() => res(this));
        });
    }
    hookup(path) {
        return (target) => {
            const inst = new target(this, path);
            this.hooks.push(inst);
        };
    }
    use(target) { this.middleware.push(new target(this)); }
    database(cn) {
        return (target) => {
            this.db = new target(cn, this);
        };
    }
    __loadFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const dir of ['/css', '/js', '/']) {
                const res = yield loadFiles_1.loadFilesData(path_1.default.join(this.options.public, dir), dir);
                res.forEach((file, key) => this.files.set(key, file));
            }
        });
    }
    __InitEvents() {
        return __awaiter(this, void 0, void 0, function* () {
            const stdin = process.openStdin();
            stdin.addListener("data", this.inputHandler.bind(this));
            const r = yield (this.routeParser && (this.routeParser.compileAll()));
            if (r && r[0]) {
                console.error(r[0]);
            }
        });
    }
    inputHandler(_d) {
        const d = String(_d).trim();
        if (["rs"].some(x => x === d))
            return;
        (function () {
            function print(txt, ...args) {
                console.dir(txt, Object.assign({ colors: true, depth: 3 }, args));
            }
            try {
                print(eval(d));
            }
            catch (e) {
                print(e);
            }
        }.bind(this)());
    }
    onRequest(__req, __res) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = (__req.url || '').replace(/^\/+/, '/');
            const cs = cookies_1.default(__req, __res);
            const body = yield parseBody_1.parseBody(__req, "JSON");
            const req = Object.assign(__req, {
                query: parseQuery_1.parseQuery(path),
                cookies: cs,
                body
            });
            const res = Object.assign(__res, {
                cookies: cs
            });
            MiddlewareLoop: for (const m of this.middleware) {
                const [err, cont] = yield m.intercept(req, res);
                if (!cont)
                    break;
                err && console.error(err);
            }
            const [err, cont] = this.checkForFile(path, res);
            err && !cont && console.error(err);
            if (!cont)
                return;
            ListenerLoop: for (const l of this.hooks.filter(l => l.__testPath(path))) {
                const [err, cont] = yield l[`on${req.method || "GET"}`](req, res);
                err && console.error(err);
                if (!cont)
                    break;
            }
            return res.end();
        });
    }
    hookupDBridge(database, ...args) {
        if (this.db)
            return [null, false];
        try {
            this.db = new database(...args);
            return [null, true];
        }
        catch (err) {
            return [err, false];
        }
    }
    checkForFile(path, res) {
        const f = this.files.get(path);
        if (!f)
            return [new Error(`File not found: ${path}`), true];
        if (!res.writable)
            return [new Error("Response not writable"), false];
        send_1.send(res, f.buffer, { "Content-Type": f.mime, "charset": "utf-8" });
        res.end();
        return [null, false];
    }
    mix(port) {
        this.server.listen(port, () => {
            log_1.c_log(withTime_1.withTime(`[CURIE]> Listening @${port}`));
        });
    }
}
Server.DEFAULT_SERVER_OPTIONS = {
    routes: "./routes",
    routeParser: RouteParser_1.PugParser,
    public: "./public",
    port: 8000,
    listeners: ["./", "list.[jt]s"],
    middleware: ["./", "mdw.[jt]s"],
    database: '',
    root: path_1.default.dirname(require.main.filename)
};
exports.Server = Server;
//# sourceMappingURL=Server.js.map