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
const pg_promise_1 = __importDefault(require("pg-promise"));
const log_1 = require("./helpers/log");
const withTime_1 = require("./helpers/withTime");
class DBridge {
    constructor(db_link, server) {
        server && !server.db && (server.db = this);
    }
    get(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(res => res());
        });
    }
    update(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(res => res());
        });
    }
    delete(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(res => res());
        });
    }
    create(model, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(res => res());
        });
    }
}
exports.DBridge = DBridge;
class PostDBridge extends DBridge {
    constructor(cn, server) {
        super(cn, server);
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
                if (Math.abs(found.date - now) < 5 * 60 * 1000) {
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
}
exports.PostDBridge = PostDBridge;
//# sourceMappingURL=DBridge.js.map