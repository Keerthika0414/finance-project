import http from "http"
import cookies from 'cookies'
import { CallbackReturnType, Response, LooseObject, RequestCallback } from "./types";
import { Server } from "./Server";

const DEFAULT_RETURN_VALUE: CallbackReturnType = [null, true]

export class Listener {
  server: Server
  path: string | RegExp
  [key: string]: any

  constructor(s: Server, path: string | RegExp) {
    this.server = s
    this.path = path

    this.server.hooks.push(this)
  }
  
  async onGET(
    req: http.IncomingMessage, 
    res: http.ServerResponse
    ): Promise<CallbackReturnType | undefined> {
      return DEFAULT_RETURN_VALUE
    }
  async onPOST(
    req: http.IncomingMessage, 
    res: http.ServerResponse
    ): Promise<CallbackReturnType | undefined> {
      return DEFAULT_RETURN_VALUE
    }

  render(res: Response, route: string, locals: LooseObject) {
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