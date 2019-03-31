import { Server, Request, Response, CallbackReturnType } from "./";
export declare abstract class Middleware {
    server: Server;
    constructor(server: Server);
    abstract intercept(req: Request, res: Response): Promise<CallbackReturnType>;
}
