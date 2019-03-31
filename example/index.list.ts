import c, { Listener } from "curie-server";
import server from "./server"

@server.hookup("/")
export default class extends Listener {
  async onGET(req: c.Request, res: c.Response) {
    this.server.routeParser.render(res, "index")
    return [null, false] as c.CallbackReturnType
  }
}