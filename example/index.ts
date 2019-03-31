import { initApp } from "curie-server/dist/@core"
import { Server, PostDBridge } from "curie-server";

(async () => {
  const server = new Server({
    port: 8000,
  })
  await initApp(server) 
  server.hookupDBridge(PostDBridge, "postgres://postgres:postgres@127.0.0.1:5432/postgres")
})()