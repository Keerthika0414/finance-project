import { initApp, hookup, Listener, Response, Request, CallbackReturnType, PostDBridge, database } from "./src"

(async () => {
  await initApp({
    database: "",
    middleware: ["./", "mdw.[tj]s"],
    listeners: ["./", "list.[tj]s"],
    routes: "./routes",
    public: "./public",
    port: 8000,
    preRun: [
      "echo Hello",
      "hello"
    ]
  })

  @database("postgres://postgres:postgres@127.0.0.1:5432/postgres")
  class Db extends PostDBridge {}

  @hookup("/")
  class IndexListener extends Listener {
    async onGET(req: Request, res: Response) {
      await this.render(res, "index")
      return [null, false] as CallbackReturnType
    }
  }
})()