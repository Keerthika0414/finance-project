import fs from "fs-extra"
import path from "path"

export interface CurieConfig {
  public: string
  routes: string
  listeners: [string, string | RegExp]
  middleware: [string, string | RegExp]
  database: string,
  root: string
  [key: string]: any | any[]
}

export const DEFAULT_CURIE_CONFIG: CurieConfig = {
  public: "./public",
  routes: "./routes",
  database: "",
  listeners: ["./", "list.[jt]s"],
  middleware: ["./", "mdw.[jt]s"],
  root: path.dirname((require.main as NodeModule).filename)
}

export const loadConfig = (): CurieConfig => {
  const root = path.dirname((require.main as NodeModule).filename)
  let config
  try {
    config = Object.assign(fs.readJSONSync(path.resolve(root, "curie.config.json"), {encoding: "utf-8"}), {root})
  } catch (err) {
    config = {root}
  }

  global.__curieRoot = root
  global.__curieConfig = config
  return config
}