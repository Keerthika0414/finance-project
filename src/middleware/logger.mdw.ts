import { CallbackReturnType, Middleware, Request, Response, initLogger } from "../Curie";
import { use } from "../Curie/@core";

const logger = initLogger("Logger", "cyanBright")

@use()
export default class x extends Middleware {

  async intercept(req: Request, res: Response) {
    logger(`{${req.method}}: ${req.url}`)
    return [null, true] as CallbackReturnType
  }
}