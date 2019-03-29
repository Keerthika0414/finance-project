import { CallbackReturnType, Response } from "../types";
import fs from "fs-extra"
import { switchMIME } from "./switchMIME";

export const pipeFile = (path: string, destination: Response): Promise<CallbackReturnType> => new Promise((res, rej) => {
  if(destination.writable&&!destination.headersSent) {
    const s = fs.createReadStream(path)
    s.on("open", () => {
      destination.writeHead(200)
      destination.setHeader("Content-Type", switchMIME(path))
    })
    s.on("close", () => {
      destination.end()
      res([null, true])
    })
    s.on("error", rej)
    s.pipe(destination, {end: true})
  } else {
    rej(new Error("[pipeFile]> Response already sent"))
  }
  
}) 