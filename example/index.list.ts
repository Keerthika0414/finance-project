import c, { Listener, hookup } from "curie-server";

@hookup("/")
export default class extends Listener {
  async onGET(req: c.Request, res: c.Response) {
    await this.render(res, "index")
    return [null, false] as c.CallbackReturnType
  }
}