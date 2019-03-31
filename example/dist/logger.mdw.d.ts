import { Middleware, Request, Response } from "curie-server";
export default class x extends Middleware {
    intercept(req: Request, res: Response): Promise<[Error | null, boolean]>;
}
