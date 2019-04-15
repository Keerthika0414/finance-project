import http from "http"
import { CallbackReturnType, Response, LooseObject, Request } from "./types";
import { Server } from "./Server";

const DEFAULT_RETURN_VALUE: CallbackReturnType = [null, true]

export abstract class Listener {
  server: Server
  path: string | RegExp
  [key: string]: any

  constructor(s: Server, path: string | RegExp) {
    this.server = s
    this.path = path
  }
  
  async onGET(
    req?: Request, 
    res?: Response
    ): Promise<CallbackReturnType | undefined> {
      return DEFAULT_RETURN_VALUE
    }
  async onPOST(
    req?: Request, 
    res?: Response
    ): Promise<CallbackReturnType | undefined> {
      return DEFAULT_RETURN_VALUE
    }

  render(res: Response, route: string, locals: LooseObject = {}) {
    if(!res.headersSent)
      return this.server.routeParser.render(res, route, locals)
  }

  __testPath(path: string): boolean {
    if(typeof this.path === "string") {
      return this.path === path
    } 
    return (this.path as RegExp).test(path) 
  }
}