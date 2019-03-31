import { initApp } from "./Curie/@core"
import { Server } from "./Curie";

(async () => {
  await initApp(new Server({
    port: 8000
  }))
})()