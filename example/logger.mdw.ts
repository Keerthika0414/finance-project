import { CallbackReturnType, Middleware, withTime, Request, Response, c_log, log } from "curie-server";
import { use } from "curie-server/dist/@core";

@use()
export default class x extends Middleware {
  // @ts-ignore
  async intercept(req: Request, res: Response) {
    console.dir(this, {colors: true})
    c_log(withTime(`[LOGGER]> ${req.method}: ${req.url || ""}`))
    return [null, true] as CallbackReturnType
  }
}