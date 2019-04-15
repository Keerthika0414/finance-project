import { PostDBridge, initApp, database, TSCompiler, useCompiler } from "curie-server";
import { resolve } from "path";

(async () => {
  const s = await initApp({
    middleware: ["./", "mdw.[tj]s"],
    listeners: ["./", "list.[tj]s"]
  })

  @database("postgres://postgres:postgres@127.0.0.1:5432/postgres")
  class x extends PostDBridge {
    cache_time = 50000
  }

  @useCompiler(/\.ts$/gi, resolve(__dirname, "tsconfig.build.json"))
  class c extends TSCompiler {}
})()