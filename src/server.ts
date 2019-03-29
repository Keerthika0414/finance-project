import {Curie} from "./Curie"
import { Request, Response, CallbackReturnType } from "./Curie/types";
import path from "path"
import { PostDBridge } from "./Curie/DBridge";

const s = new Curie.Server({
  routes: path.resolve(__dirname, "../routes"),
  public: path.resolve(__dirname, "../public")
})
const db = new PostDBridge('postgres://postgres:postgres@127.0.0.1:5432/postgres', s)

const l = new (class extends Curie.Listener {
  constructor() {
    super(s, "/")
  }

  async onGET(req: Request, res: Response) {
    await this.render(res, "index", {})
    return [null, false] as CallbackReturnType
  }

})()

s.mix(8000)