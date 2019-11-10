import { LooseObject, ClassConstructor, ConstructorParameters } from "./types";
import _pgp from "pg-promise";
import { Server } from "./Server";
interface Response {
    n: number;
}
export interface UpdateResponse extends Response {
    found: number;
}
export interface DeleteResponse extends Response {
}
export interface CreateResponse extends Response {
}
export declare abstract class DBridge<DBType, QueryType> {
    abstract db: DBType;
    constructor(db_link: string, server?: Server);
    initConnection(): Promise<any>;
    get(query: QueryType): Promise<LooseObject[] | any>;
    update(query: QueryType): Promise<UpdateResponse | any>;
    delete(query: QueryType): Promise<DeleteResponse | any>;
    create<T>(model: ClassConstructor<T>, data: ConstructorParameters<ClassConstructor<T>>): Promise<CreateResponse | any>;
}
interface CacheItem {
    date: Date;
    data: any;
}
export declare class PostDBridge extends DBridge<_pgp.IDatabase<{}>, string> {
    db: _pgp.IDatabase<{}>;
    cache: Map<string, CacheItem>;
    cache_time: number;
    constructor(cn: string, server?: Server);
    get<T>(query: string): Promise<any>;
    create<T extends ClassConstructor>(model: T, data: ConstructorParameters<T>): Promise<CreateResponse | any>;
}
export {};
