import http from "http"
import cookies from 'cookies'
import { Listener } from "./Listener";
import { parseQuery } from "./helpers/parseQuery";
import path from "path"
import { RouteParser, PugParser } from "./RouteParser";
import { Response, CallbackReturnType, ClassConstructor, ConstructorParameters } from "./types";
import { loadFilesData, loadFilesDataResponse } from "./helpers/loadFiles";
import { send } from "./helpers/send";
import { DBridge } from "./DBridge";
import { EventEmitter } from "events";
import { withTime } from "./helpers/withTime";



export interface ServerOptions {
  routes: string,
  routeParser: ClassConstructor<RouteParser>
  public: string
}

const __r = path.resolve(__dirname, "./routes")

export class Server extends EventEmitter {
  server: http.Server
  hooks: Listener[]
  db: DBridge<any, any> | undefined
  options: ServerOptions
  routeParser: RouteParser 
  files: Map<string, loadFilesDataResponse>
  static DEFAULT_SERVER_OPTIONS: ServerOptions = {
    routes: __r,
    routeParser: PugParser,
    public: path.resolve(__dirname, "./public")
  }

  constructor(options: Partial<ServerOptions> = {}) {
    super()
    console.log(withTime("[CURIE]> Init: START"))
    this.server = http.createServer({}, this.onRequest.bind(this))
    this.hooks = []
    this.files = new Map<string, loadFilesDataResponse>()
    this.options = {
      public: options.public || Server.DEFAULT_SERVER_OPTIONS.public,
      routes: options.routes || Server.DEFAULT_SERVER_OPTIONS.routes,
      routeParser: PugParser
    }

    this.routeParser = new this.options.routeParser(this.options.routes, this)

    this.__InitEvents()
    this.__loadFiles()
    .then(() => {
      console.log(withTime("[CURIE]> Init: END"))
    })
  }

  async __loadFiles() {
    for (const dir of ['/css', '/js', '/']) {
      const res = await loadFilesData(path.join(this.options.public, dir), dir)
      res.forEach((file, key) => this.files.set(key, file))
    }
  }

  private __InitEvents() { 
    const stdin = process.openStdin()
    stdin.addListener("data", this.inputHandler.bind(this))

    const [err] = this.routeParser.compileAll()
    if(err) {
      console.error(err)
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

  async onRequest(__req: http.IncomingMessage, __res: http.ServerResponse) {
    const path = (__req.url || '').replace(/^\/+/, '/')
    const cs = cookies(__req, __res)
    const req = Object.assign(__req, {
      query: parseQuery(path),
      cookies: cs
    })

    const res = Object.assign(__res, {
      cookies: cs
    })

    // Try returning a file
    const [err, cont] = this.checkForFile(path, res)
    if(err&&!String(err).match(/file not found/i)) console.error(err)
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

  checkForFile(path: string, res: Response) {
    const f = this.files.get(path)
    if(!f) return [new Error(`File not found: ${path}`), true]
    if (!res.writable) return [new Error("Response not writable"),false]
    send(res, f.buffer, { "Content-Type": f.mime, "charset": "utf-8"})
    res.end()
    return [null, false]
  }

  mix(port: number) {
    this.server.listen(port, () => {
      console.log(withTime(`[CURIE]> Listening @${port}`))
    })
  }
}