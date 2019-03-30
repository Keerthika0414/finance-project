import { CallbackReturnType, Middleware, withTime, ClassConstructor, Request, Response } from "../Curie";
import s from "../server"
import { c_log } from "../Curie/helpers/log";

@s.use
export default class x extends Middleware {
  // @ts-ignore
  async intercept(req: Request, res: Response) {
    c_log(withTime(`[LOGGER]> ${req.method}: ${req.url || ""}`))
    return [null, true] as CallbackReturnType
  }
}