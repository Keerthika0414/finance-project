import { loadConfig } from "./loadConfig"
import path from "path"
import { Server } from "../Server"
import fs from "fs-extra"

export const initApp = async (server: Server) => {
  const config = loadConfig()
  // @ts-ignore
  global.__curieServer = await server.init(config)
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
    dir&&ext&&promises.push(
      fs.readdir(path.resolve(config.root, dir)).then(f_names =>
        f_names.reduce(
          (modules, x) => {
            if (new RegExp(`.${ext}$`, "i").test(x))
              modules.push(require(path.resolve(config.root, dir, x)))
            return modules
          }, 
        [] as any[])
      )
    )
  }
  return Promise.all(promises)
}
