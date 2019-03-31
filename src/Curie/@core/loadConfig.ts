import fs from "fs-extra"
import path from "path"

export interface CurieConfig {
  public: string
  routes: string
  listenres: [string, string]
  middleware: [string, string]
  database: string,
  root: string
  [key: string]: string | [string, string]
}

export const loadConfig = (): CurieConfig => {
  const root = path.dirname((require.main as NodeModule).filename)
  const config = Object.assign(fs.readJSONSync(path.resolve(root, "curie.config.json"), {encoding: "utf-8"}), {root})
  // @ts-ignore
  global.__curieRoot = root
  // @ts-ignore
  global.__curieConfig = config
  return config
}