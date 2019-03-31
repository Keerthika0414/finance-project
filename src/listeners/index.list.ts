import { Listener, Request, Response, CallbackReturnType } from "../Curie";
import { hookup } from "../Curie/@core";

@hookup("/")
export default class index extends Listener {
  async onGET(req: Request, res: Response) {
    await this.render(res, "index", {})
    return [null, false] as CallbackReturnType
  }
}