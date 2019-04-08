import { Response, LooseObject, CallbackReturnType, Executable } from "./types";
import pug from "pug"
import path from "path"
import fs from "fs-extra"
import { Server } from "./Server";

export abstract class RouteParser<RouteType = any> {
  path: string
  routes: LooseObject<RouteType>
  server: Server
  public constructor(path: string, server: Server) {
    this.path = path
    this.routes = {} 
    this.server = server
  }
  abstract compile(route: string): CallbackReturnType
  abstract async compileAll(): Promise<CallbackReturnType>
  abstract async render(res: Response, route: string, locals?: LooseObject): Promise<CallbackReturnType>
}

interface PugRoute {
  exec: Executable<string>
  meta: LooseObject<string>
}

export class PugParser extends RouteParser<PugRoute> {
  constructor(path: string, server: Server) {
    super(path, server)
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

  async compileAll() {
    let err = null
    await fs.readdir(this.path)
      .then(names => names.filter(x => /\.pug$/.test(x)))
      .then(filtered => filtered.reduce((acc, x) => {
          const found_name = /^([\w\d-_]+)/g.exec(x)
          const name = found_name 
            ? found_name[0]
            : x
          const file = fs.readFileSync(path.resolve(this.path, x)).toString("utf-8")
          const r = /(\$\w+:\s*.+)/gmi
          const meta_data = file.match(r)

          // Resolving variables available in templates
          const meta = (meta_data||[]).reduce((acc, x) => {
            // Variable name
            const v = (x.match(/\$(\w+)/i) as any as string[])[1]
            // Variable value
            const val = (x.match(/:(.*)/i) as any as string[])[1].trim()
            return Object.assign(acc, {[v]: val})
          }, {})

          return Object.assign(acc, {[name]: {
            exec: pug.compile(file.replace(/\/\/#.*/gim, '')),
            meta
          }} as LooseObject<PugRoute>)
        }, {} as PugRoute))
      .then(xs => this.routes = Object.assign(this.routes, xs))
      .catch(e => err = e)
    return [err, !err] as CallbackReturnType
  }

  async render(res: Response, route: string, locals: LooseObject = {}) {
    const ex = this.routes[route]
    if(ex&&typeof ex.exec === "function") {
      let err = null
      !res.headersSent&&res.setHeader("Content-Type", "text/html")
      for(const v_key in ex.meta) {
        if(v_key in locals) continue
        if(this.server.db) locals[v_key] = await this.server.db.get(ex.meta[v_key])
      }
      res.write(ex.exec(Object.assign(locals, {
        db: this.server.db
      })))
      return [err, !err] as CallbackReturnType
    } 
    throw new Error(`[PugParser]> Route "${route}" not found`)
  }
}