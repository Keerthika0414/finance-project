import { Listener, Request, Response, CallbackReturnType, Server } from "../Curie";
import s from "../server"

@s.hookup("/")
export default class index extends Listener {
  async onGET(req: Request, res: Response) {
    await this.render(res, "index", {})
    return [null, false] as CallbackReturnType
  }
}