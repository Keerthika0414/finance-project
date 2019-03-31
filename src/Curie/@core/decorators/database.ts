import { Server } from "../../Server";

export const database = (connectionURI: string) => {
  // @ts-ignore
  const server: Server = global.__curieServer
  return server.database(connectionURI)
}