import http from 'http'
import cookies from 'cookies'
import { Listener } from './Listener'
import { parseQuery } from './helpers/parseQuery'
import path from 'path'
import { RouteParser, PugParser } from './RouteParser'
import {
  Response,
  CallbackReturnType,
  ClassConstructor,
  ConstructorParameters,
  Request,
  ChalkColors,
} from './types'
import { loadFilesData, loadFilesDataResponse } from './helpers/loadFiles'
import { send } from './helpers/send'
import { DBridge } from './DBridge'
import { EventEmitter } from 'events'
import { withTime } from './helpers/withTime'
import { c_log, initLogger, log } from './helpers/log'
import { Middleware } from './Middleware'
import { parseBody } from './helpers/parseBody'
import { getDirs } from './helpers/getDirs'
import cp from 'child_process'
import util from 'util'
import { normalizePath } from './helpers/fixFilePath'
import { runTasks } from './helpers/runTasks'
import { URL } from 'url'

const exec = util.promisify(cp.exec)

export interface ServerParams {
  routes: string
  routeParser: ClassConstructor<RouteParser>
  public: string
  port: number
  listeners: [string, string | RegExp]
  middleware: [string, string | RegExp]
  database: string
  root: string
  preRun: string[]
  [key: string]: any | any[]
}

const CLOGGER = initLogger('Curie', 'yellowBright')
const C_ERROR_LOGGER = initLogger('Error', 'bgRedBright')

export class Server extends EventEmitter {
  server: http.Server
  hooks: Listener[]
  db: DBridge<any, any> | undefined
  options: ServerParams
  // It stops the linter from whining about the routerParser being undefined before .init(), which is called immediately after the constructor
  // @ts-ignore
  routeParser: RouteParser
  files: Map<string, loadFilesDataResponse>
  middleware: Middleware[]

  static DEFAULT_SERVER_OPTIONS: ServerParams = {
    routes: './routes',
    routeParser: PugParser,
    public: './public',
    port: 8000,
    listeners: ['./', 'list.[jt]s'],
    middleware: ['./', 'mdw.[jt]s'],
    database: '',
    preRun: [],
    root: path.dirname((require.main as NodeModule).filename),
  }

  constructor(options: Partial<ServerParams> = {}) {
    super()

    this.hooks = []
    this.middleware = []
    this.files = new Map<string, loadFilesDataResponse>()
    this.options = Object.assign(Server.DEFAULT_SERVER_OPTIONS, options)

    CLOGGER('Init: START')
    this.server = http.createServer(this.onRequest.bind(this))
  }

  get ext() {
    return path.extname((process.mainModule as NodeModule).filename)
  }

  private __doPreRunTasks() {
    return runTasks.call(this)
  }

  init(config: ServerParams) {
    return new Promise(async res => {
      this.options.public = path.resolve(config.root, config.public)
      this.options.routes = path.resolve(config.root, config.routes)

      this.routeParser = new this.options.routeParser(this.options.routes, this)

      this.use = this.use.bind(this)

      for (const task of this.__doPreRunTasks()) {
        await task
      }
      await Promise.all([this.__InitEvents(), this.__loadFiles()])
        .then(() => {
          CLOGGER('Init: END')
          this.mix(this.options.port)
        })
        .then(() => res(this))
        .catch(C_ERROR_LOGGER)
    })
  }

  hookup(path: string) {
    return (target: ClassConstructor<Listener>) => {
      const inst = new target(this, path)
      this.hooks.push(inst)
      initLogger('Hook-Up', 'yellowBright')(
        `Initialized the "${path}" listener`
      )
    }
  }

  use(target: ClassConstructor<Middleware>) {
    this.middleware.push(new target(this))
    initLogger('Use', 'yellowBright')(
      `Initialized the "${target.name}" middleware`
    )
  }

  database(cn: string) {
    return (target: ClassConstructor<DBridge<any, any>>) => {
      this.db = new target(cn, this)
      initLogger('Database', 'yellowBright')(
        `Initialized the databse with ${cn}`
      )
    }
  }

  private async __loadFiles() {
    const dirs = getDirs(this.options.public).concat(this.options.public)
    for (const dir of dirs) {
      // (/\w+$/g.exec(dir) || [dir])[0]
      const prefix =
        '/' + normalizePath(path.relative(this.options.public, dir))
      const res = await loadFilesData(dir, prefix)
      res.forEach((file, key) => this.files.set(key, file))
    }
  }

  private async __InitEvents() {
    const stdin = process.openStdin()
    stdin.addListener('data', this.inputHandler.bind(this))

    const r = await (this.routeParser && this.routeParser.compileAll())
    if (r && r[0]) {
      console.error(r[0])
    }
  }

  private inputHandler(_d: any) {
    const d = String(_d).trim()
    if (['rs'].some(x => x === d)) return
    ;(function() {
      function print(txt: any, ...args: any[]) {
        console.dir(txt, { colors: true, depth: 3, ...args })
      }
      try {
        print(eval(d))
      } catch (e) {
        print(e)
      }
    }.bind(this)())
  }

  private async onRequest(
    __req: http.IncomingMessage,
    __res: http.ServerResponse
  ) {
    const path_cleaned = (__req.url || '').replace(/^\/+/, '/')
    const path = path_cleaned.replace(/\?.+$/g, '')
    const cs = cookies(__req, __res)
    const body = await parseBody(__req, 'JSON')

    const req = Object.assign(__req, {
      query: parseQuery(path_cleaned),
      cookies: cs,
      body,
    }) as Request

    const res = Object.assign(__res, {
      cookies: cs,
    }) as Response

    MiddlewareLoop: for (const m of this.middleware) {
      const [err, cont] = await m.intercept(req, res)
      if (!cont) break
      err && console.error(err)
    }

    // Try returning a file
    const [err, cont] = this.checkForFile(path, res)
    err && !cont && C_ERROR_LOGGER(String(err))
    if (!cont) return

    ListenerLoop: for (const l of this.hooks.filter(l => l.__testPath(path))) {
      const [err, cont] = await l[`on${req.method || 'GET'}`](req, res)
      err && console.error(err)
      if (!cont) break
    }

    if (this.hooks.some(h => !h.__testPath(path))) {
      res.setHeader('Content-Type', 'text/html')
      if (this.routeParser.routes['404'])
        await this.routeParser.render(res, '404', { path })
      else
        await res.write(`<h1>Error 404</h1><br/><p>page ${path} not found</p>`)
    }
    return res.end()
  }

  hookupDBridge(
    database: ClassConstructor<DBridge<any, any>>,
    ...args: any[]
  ): CallbackReturnType {
    if (this.db) return [null, false]
    try {
      this.db = new database(...args)
      return [null, true]
    } catch (err) {
      return [err, false]
    }
  }

  private checkForFile(path: string, res: Response) {
    const f = this.files.get(normalizePath(path))
    if (!f) return [new Error(`File not found: ${path}`), true]
    if (!res.writable) return [new Error('Response not writable'), false]
    send(res, f.buffer, { 'Content-Type': f.mime, charset: 'utf-8' })
    res.end()
    return [null, false]
  }

  private mix(port: number) {
    this.server.listen(port, () => {
      CLOGGER(`Listening @${port}`)
    })
  }
}
