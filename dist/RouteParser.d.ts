import { Response, LooseObject, CallbackReturnType, Executable } from "./types";
import { Server } from "./Server";
export declare abstract class RouteParser<RouteType = any> {
    path: string;
    routes: LooseObject<RouteType>;
    server: Server;
    constructor(path: string, server: Server);
    abstract compile(route: string): CallbackReturnType;
    abstract compileAll(): Promise<CallbackReturnType>;
    abstract render(res: Response, route: string, locals?: LooseObject): Promise<CallbackReturnType>;
}
interface PugRoute {
    exec: Executable<string>;
    meta: LooseObject<string>;
}
export declare class PugParser extends RouteParser<PugRoute> {
    constructor(path: string, server: Server);
    compile(route: string): [Error | null, boolean];
    compileAll(): Promise<[Error | null, boolean]>;
    render(res: Response, route: string, locals?: LooseObject): Promise<[Error | null, boolean]>;
}
export {};
