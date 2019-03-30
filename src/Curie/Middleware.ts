import { Server, Request, Response, CallbackReturnType } from "./";

export abstract class Middleware {
  server: Server
  constructor(server: Server) {
    this.server = server
  }

  abstract async intercept(req: Request, res: Response): Promise<CallbackReturnType>
}