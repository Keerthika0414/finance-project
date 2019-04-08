import path from "path"
import { Server, ServerParams } from "../Server"
import fs from "fs-extra"
import { c_log } from "../helpers/log";
import { withTime } from "../helpers/withTime";

export const initApp = async (_config: Partial<ServerParams>) => {
  const config: ServerParams = Object.assign(
    Server.DEFAULT_SERVER_OPTIONS,  
    _config
  );

  config.root = config.root.replace(/(\\)+/gi, "/")
  c_log(withTime(`[Curie]> Config ${JSON.stringify(config, null, 2)}`))
  const server = new Server(config)
  await server.init(config)

  global.__curieServer = server 
  if (config.database)
    global.__curieDatabase = require(path.resolve(
      config.root,
      config.database
    )).default

  for (const [dir, ext] of ["listeners", "middleware"].map(x =>
    (config[x] as any[]).concat(x)
  )) {
    const r = ext instanceof RegExp ? ext : new RegExp(`.${ext}$`, "i")
    if(dir&&ext) {
      await fs.readdir(path.resolve(config.root, dir))
      .then((f_names: string[]) => f_names.forEach(x => {
        if (r.test(x)) require(path.resolve(config.root, dir, x))
      }))
    }
  }
  return server
}
