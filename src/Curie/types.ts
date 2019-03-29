import http from "http"
import cookies from 'cookies'

export interface LooseObject<T = any> {
  [key: string]: T
}

export type ConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;

export type ClassConstructor<T = any> = new(...args: any[]) => T

export interface Request extends http.IncomingMessage {
  query: LooseObject<string>
  cookies: cookies
}
export interface Response extends http.ServerResponse {
  cookies: cookies
}
export type Cookies = cookies

export type CallbackReturnType = [Error | null, boolean]


export type RequestCallback = (
  req: Request,
  res: Response,
  cookies: Cookies) => CallbackReturnType | undefined