import { initApp, database } from "./Curie/@core"
import { PostDBridge } from "./Curie";

(async () => {
  const s = await initApp({
   port: 8000,
   public: "../public",
   routes: "../routes",
   listeners: ["./listeners", "list.[jt]s"],
   middleware: ["./middleware", "mdw.[jt]s"],
   database: ""
  })

  @database("postgres://postgres:postgres@127.0.0.1:5432/postgres")
  class _ extends PostDBridge {
    cache_time = 5000
  }
})()