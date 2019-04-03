import { CurieConfig, loadConfig, DEFAULT_CURIE_CONFIG } from "./loadConfig"
import path from "path"
import { Server, ServerOptions } from "../Server"
import fs from "fs-extra"
import { c_log } from "../helpers/log";
import { withTime } from "../helpers/withTime";

export const initApp = async (_config: Partial<CurieConfig & ServerOptions>) => {
  const config: CurieConfig & Partial<ServerOptions> = Object.assign(
    Server.DEFAULT_SERVER_OPTIONS, 
    DEFAULT_CURIE_CONFIG, 
    loadConfig(),
    _config
  );
  c_log(withTime(`[Curie]> Config ${JSON.stringify(config, null, 2)}`))
  const server = new Server(config)
  await server.init(config)
  // @ts-ignore
  global.__curieServer = server
  if (config.database)
    // @ts-ignore
    global.__curieDatabase = require(path.resolve(
      config.root,
      config.database
    )).default

  const promises: Promise<any>[] = []
  for (const [dir, ext, key] of ["listeners", "middleware"].map(x =>
    (config[x] as any[]).concat(x)
  )) {
    const r = ext instanceof RegExp ? ext : new RegExp(`.${ext}$`, "i")
    dir&&ext&&promises.push(
      fs.readdir(path.resolve(config.root, dir)).then(f_names =>
        f_names.reduce(
          (modules, x) => {
            if (r.test(x)) modules.push(require(path.resolve(config.root, dir, x)))
            return modules
          }, 
        [] as any[])
      )
    )
  }
  return server
}
