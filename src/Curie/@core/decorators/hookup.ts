import { Server } from "../../Server";

export const hookup = (path: string) => {
  // @ts-ignore
  const server: Server = global.__curieServer
  return server.hookup(path)
}