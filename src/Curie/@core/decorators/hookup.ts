import { Server } from "../../Server";

export const hookup = (path: string) => {
  const server: Server = global.__curieServer
  return server.hookup(path)
}