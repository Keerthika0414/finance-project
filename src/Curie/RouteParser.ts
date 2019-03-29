import { Response, LooseObject, CallbackReturnType } from "./types";
import pug from "pug"
import path from "path"
import fs from "fs-extra"

type Executable<T> = (arg: LooseObject) => T

export abstract class RouteParser {
  path: string
  routes: LooseObject<Executable<string>>
  public constructor(path: string) {
    this.path = path
    this.routes = {} 
  }
  abstract compile(route: string): CallbackReturnType
  abstract compileAll(): CallbackReturnType
  abstract render(res: Response, route: string, locals: LooseObject): CallbackReturnType
}

export class PugParser extends RouteParser {
  constructor(path: string) {
    super(path)
  }

  compile(route: string) {
    try {
      this.routes = Object.assign(this.routes, {
        [route]: pug.compile(path.resolve(), {
          basedir: this.path
        })
      })

      return [null, true] as CallbackReturnType
    } catch (err) {
      return [err, false] as CallbackReturnType
    }
  }

  compileAll() {
    let err = null
    const out = fs.readdir(this.path)
      .then(names => names.filter(x => /\.pug$/.test(x)))
      .then(filtered => filtered.reduce(
        (acc, x) => {
          const m = /^([\w\d-_]+)/g.exec(x)
          const n = m 
            ? m[0]
            : x
          return Object.assign(acc, {[n]: pug.compileFile(path.resolve(this.path, x))})
        },{}))
      .catch(e => err = e)

    out.then(xs => this.routes = Object.assign(this.routes, xs))
      .catch(e => err = e)
    return [err, !err] as CallbackReturnType
  }

  render(res: Response, route: string, locals: LooseObject) {
    const ex = this.routes[route]
    if(ex) {
      let err = null
      res.setHeader("Content-Type", "text/html")
      res.write(ex(locals), e => {
        err = e
      })
      return [err, !err] as CallbackReturnType
    } else {
      throw new Error(`[PugParser]> Route "${route}" not found`)
    }
  }
}