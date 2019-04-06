import { initApp, database } from "curie-server/dist/@core";
import { PostDBridge } from "curie-server";

(async () => {
  const s = await initApp({
    middleware: ["./", "mdw.[tj]s"],
    listeners: ["./", "list.[tj]s"],
    database: '' 
  })

  @database("postgres://postgres:postgres@127.0.0.1:5432/postgres")
  class x extends PostDBridge {
    cache_time = 50000
  }
})()