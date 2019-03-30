import { LooseObject } from "../types";
import { loadConfig } from "./loadConfig";
import path from "path"
import { Server } from "../Server";
import fs from "fs-extra"

export const initApp = async () => {
  const config = loadConfig()
  const state = {} as LooseObject

  const server: Server = await require(path.resolve(config.root, config.server)).default.init(config)
  // load the database
  require(path.resolve(config.root, config.database));

  for(const [dir, ext, key] of ["listeners", "middleware"].map(x => (config[x] as any[]).concat(x))) {
    state[key] = await fs.readdir(path.resolve(config.root, dir))
      .then(f_names => f_names.reduce((modules, x) => {
        if(new RegExp(`.${ext}`, "i").test(x)) modules.push(require(path.resolve(config.root, dir, x)))
        return modules
      }, [] as any[]))
  }
}