import { PostDBridge, initApp, database } from "curie-server";
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
})()