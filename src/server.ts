import {Curie} from "./Curie"
import { Request, Response, CallbackReturnType } from "./Curie/types";
import path from "path"

const s = new Curie.Server({
  routes: path.resolve(__dirname, "../routes"),
  public: path.resolve(__dirname, "../public")
})
const l = new (class extends Curie.Listener {
  constructor() {
    super(s, "/")
  }

  async onGET(req: Request, res: Response) {
    this.render(res, "index", {})
    return [null, false] as CallbackReturnType
  }

})()

s.mix(8000)