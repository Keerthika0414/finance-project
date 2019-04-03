import { Listener, Request, Response, CallbackReturnType, c_log, LooseObject } from "../Curie";
import { hookup } from "../Curie/@core";

@hookup("/")
export default class index extends Listener {
  async onPOST(req: Request, res: Response) {
    c_log(JSON.stringify(req.body))
    const { author, body } = req.body

    class messages {
      author: string
      body: string
      date: string
      constructor({author, body, date}: LooseObject) {
        this.author = author
        this.body = body
        this.date = date
      }
    }

    if(author&&body&&this.server.db) {
      await this.server.db.create(messages, {
        author,
        body,
        date: new Date().toISOString().slice(0, 10)
      } as any)
      // await this.server.db.get(`INSERT INTO messages (author, body, date) VALUES ('${author}', '${body}', '${new Date().toISOString().slice(0, 10)}')`.replace('"', "'"))
    }
    await this.render(res, "index", {})
    return [null, false] as CallbackReturnType
  }

  async onGET(req: Request, res: Response) {
    await this.render(res, "index", {})
    return [null, false] as CallbackReturnType
  }
}