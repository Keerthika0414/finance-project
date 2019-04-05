import { Server } from "../../Server";

export const database = (connectionURI: string) => {
  const server: Server = global.__curieServer
  return server.database(connectionURI)
}