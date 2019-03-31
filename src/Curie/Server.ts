import http from "http"
import cookies from 'cookies'
import { Listener } from "./Listener";
import { parseQuery } from "./helpers/parseQuery";
import path from "path"
import { RouteParser, PugParser } from "./RouteParser";
import { Response, CallbackReturnType, ClassConstructor, ConstructorParameters, Request } from "./types";
import { loadFilesData, loadFilesDataResponse } from "./helpers/loadFiles";
import { send } from "./helpers/send";
import { DBridge } from "./DBridge";
import { EventEmitter } from "events";
import { withTime } from "./helpers/withTime";
import { c_log } from "./helpers/log";
import { Middleware } from "./Middleware";
import { CurieConfig } from "./@core";
import { LooseObject } from "../../dist/types";


export interface ServerOptions {
  routes: string,
  routeParser: ClassConstructor<RouteParser>
  public: string
  port: number
}


export class Server extends EventEmitter {
  server: http.Server
  hooks: Listener[]
  db: DBridge<any, any> | undefined
  options: ServerOptions
  // It stops the linter from whining about the routerParser being undefined before .init(), which is called immediately
  // @ts-ignore
  routeParser: RouteParser 
  files: Map<string, loadFilesDataResponse>
  middleware: Middleware[]
  static DEFAULT_SERVER_OPTIONS: ServerOptions = {
    routes: path.resolve(__dirname, "./routes"),
    routeParser: PugParser,
    public: path.resolve(__dirname, "./public"),
    port: 8000
  }

  constructor(options: Partial<ServerOptions> = {}) {
    super()
    c_log(withTime("[CURIE]> Init: START"))
    this.server = http.createServer({}, this.onRequest.bind(this))
    this.hooks = []
    this.middleware = []
    this.files = new Map<string, loadFilesDataResponse>()
    this.options = {
      public: "",
      routes: "",
      routeParser: PugParser,
      port: options.port || Server.DEFAULT_SERVER_OPTIONS.port
    }
  }

  init(config: CurieConfig) {
    return new Promise(res => {
      this.options.public = path.resolve(config.root, config.public)
      this.options.routes = path.resolve(config.root, config.routes)

      this.routeParser = new this.options.routeParser(
        this.options.routes,
        this
      )

      this.use = this.use.bind(this)

      Promise.all([this.__InitEvents(), this.__loadFiles()]).then(() => {
        c_log(withTime("[CURIE]> Init: END"))
        this.mix(this.options.port)
      }).then(() => res(this))
    })
  }

  hookup(path: string) {
    return (target: ClassConstructor<Listener>) => {
      const inst = new target(this, path)
      this.hooks.push(inst)
      // return inst
    }
  }

  use(target: ClassConstructor<Middleware>){this.middleware.push(new target())}

  database(cn: string) {
    return (target: ClassConstructor<DBridge<any, any>>) => {
      this.db = new target(cn, this)
    } 
  }

  private async __loadFiles() {
    for (const dir of ['/css', '/js', '/']) {
      const res = await loadFilesData(path.join(this.options.public, dir), dir)
      res.forEach((file, key) => this.files.set(key, file))
    }
  }

  private async __InitEvents() { 
    const stdin = process.openStdin()
    stdin.addListener("data", this.inputHandler.bind(this))

    const r = await (this.routeParser&&(this.routeParser.compileAll()))
    if(r&&r[0]) {
      console.error(r[0])
    }
  }

  private inputHandler(_d: any) {
    const d = String(_d).trim()
    if(["rs"].some(x => x === d)) return
    ;(function() {
      // @ts-ignore
      function print(txt: any, ...args) {
        console.dir(txt, { colors: true, depth: 3, ...args })
      }
      try {
        print(eval(d))
      } catch (e) {
        print(e)
      }
    }.bind(this)())
  }

  private async onRequest(__req: http.IncomingMessage, __res: http.ServerResponse) {
    const path = (__req.url || '').replace(/^\/+/, '/')
    const cs = cookies(__req, __res)
    const req = Object.assign(__req, {
      query: parseQuery(path),
      cookies: cs
    }) as Request

    const res = Object.assign(__res, {
      cookies: cs
    }) as Response

    MiddlewareLoop:
    for(const m of this.middleware) {
      const [err, cont] = await m.intercept(req, res)
      if(!cont) break
      err&&console.error(err) 
    }

    // Try returning a file
    const [err, cont] = this.checkForFile(path, res)
    err&&!cont&&console.error(err)
    if(!cont) return;

    ListenerLoop:
    for(const l of this.hooks.filter(l => l.__testPath(path))) {
      MethodLoop:
      for(const f of ["onGET", "onPOST"]) {
        const [err, cont] = await (l[f](req, res)) as CallbackReturnType
        err&&console.error(err)
        if(!cont) break
      }
    }
    return res.end()
  }

  hookupDBridge(database: ClassConstructor<DBridge<any, any>>, ...args: any[]): CallbackReturnType {
    if(this.db) return [null, false]
    try {
      this.db = new database(...args)
      return [null, true]
    } catch (err) {
      return [err, false]
    }
  }

  private checkForFile(path: string, res: Response) {
    const f = this.files.get(path)
    if(!f) return [new Error(`File not found: ${path}`), true]
    if (!res.writable) return [new Error("Response not writable"),false]
    send(res, f.buffer, { "Content-Type": f.mime, "charset": "utf-8"})
    res.end()
    return [null, false]
  }

  private mix(port: number) {
    this.server.listen(port, () => {
      c_log(withTime(`[CURIE]> Listening @${port}`))
    })
  }
}