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
const pg_promise_1 = __importDefault(require("pg-promise"));
const log_1 = require("./helpers/log");
const withTime_1 = require("./helpers/withTime");
class DBridge {
    constructor(db_link, server) {
        server && !server.db && (server.db = this);
    }
    initConnection() {
        return __awaiter(this, void 0, void 0, function* () { return Promise.resolve(); });
    }
    get(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve();
        });
    }
    update(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve();
        });
    }
    delete(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve();
        });
    }
    create(model, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve();
        });
    }
}
exports.DBridge = DBridge;
class PostDBridge extends DBridge {
    constructor(cn, server) {
        super(cn, server);
        this.cache_time = 5 * 60 * 1000;
        const pgp = pg_promise_1.default({
            query(e) {
                log_1.c_log(withTime_1.withTime(`[PostDBridge]> ${e.query}`));
            }
        });
        this.db = pgp(cn);
        this.cache = new Map();
    }
    get(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = this.cache.get(query);
            if (found) {
                const now = new Date();
                if (Math.abs(found.date.getTime() - now.getTime()) < this.cache_time) {
                    return found.data;
                }
            }
            const res = yield this.db.any(query);
            this.cache.set(query, {
                data: res,
                date: new Date()
            });
            return res;
        });
    }
    create(model, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const inst = new model(data);
            const keys = Object.keys(inst);
            const query = `INSERT INTO ${model.name} (${keys.join(',')}) VALUES (${keys.map(x => typeof inst[x] === "string" ? "'" + inst[x] + "'" : inst[x]).join(',')})`;
            yield this.db.any(query).catch(err => {
                log_1.c_log(withTime_1.withTime(`[PostDBridge]> Query "${query}" returned an error: ${err}`));
            });
        });
    }
}
exports.PostDBridge = PostDBridge;
//# sourceMappingURL=DBridge.js.map