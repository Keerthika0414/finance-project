import http from "http";
import { CallbackReturnType, Response, LooseObject } from "./types";
import { Server } from "./Server";
export declare abstract class Listener {
    server: Server;
    path: string | RegExp;
    [key: string]: any;
    constructor(s: Server, path: string | RegExp);
    onGET(req: http.IncomingMessage, res: http.ServerResponse): Promise<CallbackReturnType | undefined>;
    onPOST(req: http.IncomingMessage, res: http.ServerResponse): Promise<CallbackReturnType | undefined>;
    render(res: Response, route: string, locals?: LooseObject): Promise<[Error | null, boolean]> | undefined;
    __testPath(path: string): boolean;
}
