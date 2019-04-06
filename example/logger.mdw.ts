import { CallbackReturnType, Middleware, Request, Response, initLogger } from "curie-server";
import { use } from "curie-server/dist/@core";

const log = initLogger("Logger", "whiteBright")

@use()
export default class x extends Middleware {
  async intercept(req: Request, res: Response) {
    log(`${req.method}: ${req.url || ""}`)
    return [null, true] as CallbackReturnType
  }
}