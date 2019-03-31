import http from "http";
import { Listener } from "./Listener";
import { RouteParser } from "./RouteParser";
import { CallbackReturnType, ClassConstructor } from "./types";
import { loadFilesDataResponse } from "./helpers/loadFiles";
import { DBridge } from "./DBridge";
import { EventEmitter } from "events";
import { Middleware } from "./Middleware";
import { CurieConfig } from "./@core";
export interface ServerOptions {
    routes: string;
    routeParser: ClassConstructor<RouteParser>;
    public: string;
    port: number;
}
export declare class Server extends EventEmitter {
    server: http.Server;
    hooks: Listener[];
    db: DBridge<any, any> | undefined;
    options: ServerOptions;
    routeParser: RouteParser;
    files: Map<string, loadFilesDataResponse>;
    middleware: Middleware[];
    static DEFAULT_SERVER_OPTIONS: ServerOptions;
    constructor(options?: Partial<ServerOptions>);
    init(config: CurieConfig): Promise<{}>;
    hookup(path: string): (target: ClassConstructor<Listener>) => void;
    use(target: ClassConstructor<Middleware>): void;
    database(cn: string): (target: ClassConstructor<DBridge<any, any>>) => void;
    private __loadFiles;
    private __InitEvents;
    private inputHandler;
    private onRequest;
    hookupDBridge(database: ClassConstructor<DBridge<any, any>>, ...args: any[]): CallbackReturnType;
    private checkForFile;
    private mix;
}
