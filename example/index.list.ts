import c, { Listener } from "curie-server";
import { hookup } from "curie-server/dist/@core"

@hookup("/")
export default class extends Listener {
  async onGET(req: c.Request, res: c.Response) {
    await this.render(res, "index")
    return [null, false] as c.CallbackReturnType
  }
}