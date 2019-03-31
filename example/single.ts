import { initApp, database, hookup, use } from "curie-server/dist/@core";
import c, { Server, PostDBridge, Listener, Middleware, c_log, withTime } from "curie-server";

(async () => {
  await initApp(new Server({
    port: 8000
  }))

  @database("postgres://postgres:postgres@127.0.0.1:5432/postgres")
  class Db extends PostDBridge {}

  @hookup("/")
  class IndexListener extends Listener {
    async onGET(req: c.Request, res: c.Response) {
      await this.render(res, "index")
      return [null, false] as c.CallbackReturnType
    }
  }
  @use()
  class Logger extends Middleware {
    // @ts-ignore
    async intercept(req: Request, res: Response) {
      c_log(withTime(`[LOGGER]> ${req.method}: ${req.url || ""}`))
      return [null, true] as c.CallbackReturnType
    }
  }
})()