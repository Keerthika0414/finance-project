import { CallbackReturnType, Response, LooseObject, Request } from "./types";
import { Server } from "./Server";
export declare abstract class Listener {
    server: Server;
    path: string | RegExp;
    [key: string]: any;
    constructor(s: Server, path: string | RegExp);
    onGET(req?: Request, res?: Response): Promise<CallbackReturnType | undefined>;
    onPOST(req?: Request, res?: Response): Promise<CallbackReturnType | undefined>;
    render(res: Response, route: string, locals?: LooseObject): Promise<CallbackReturnType> | undefined;
    __testPath(path: string): boolean;
}
