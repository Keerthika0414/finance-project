import { Server, ServerParams } from '../src/Server'
import { DBridge } from '../src/DBridge'
import http from 'http'
import cookies from 'cookies'
import { Chalk } from 'chalk'

declare global {
  namespace NodeJS {
    export interface Global {
      __curieRoot: string
      __curieServer: Server
      __curieDatabase: DBridge<any, any>
      __curieConfig: ServerParams
    }
  }
}

declare interface LooseObject<T = any> {
  [key: string]: T
}

declare interface ChalkColors {
  readonly reset: Chalk
  readonly bold: Chalk
  readonly dim: Chalk
  readonly italic: Chalk
  readonly underline: Chalk
  readonly inverse: Chalk
  readonly hidden: Chalk
  readonly strikethrough: Chalk

  readonly visible: Chalk

  readonly black: Chalk
  readonly red: Chalk
  readonly green: Chalk
  readonly yellow: Chalk
  readonly blue: Chalk
  readonly magenta: Chalk
  readonly cyan: Chalk
  readonly white: Chalk
  readonly gray: Chalk
  readonly grey: Chalk
  readonly blackBright: Chalk
  readonly redBright: Chalk
  readonly greenBright: Chalk
  readonly yellowBright: Chalk
  readonly blueBright: Chalk
  readonly magentaBright: Chalk
  readonly cyanBright: Chalk
  readonly whiteBright: Chalk

  readonly bgBlack: Chalk
  readonly bgRed: Chalk
  readonly bgGreen: Chalk
  readonly bgYellow: Chalk
  readonly bgBlue: Chalk
  readonly bgMagenta: Chalk
  readonly bgCyan: Chalk
  readonly bgWhite: Chalk
  readonly bgBlackBright: Chalk
  readonly bgRedBright: Chalk
  readonly bgGreenBright: Chalk
  readonly bgYellowBright: Chalk
  readonly bgBlueBright: Chalk
  readonly bgMagentaBright: Chalk
  readonly bgCyanBright: Chalk
  readonly bgWhiteBright: Chalk
}

declare type Executable<T> = (arg: LooseObject) => T

declare type ConstructorParameters<T extends ClassConstructor> = T extends new (
  args: infer P
) => any
  ? P
  : never

declare type ClassConstructor<T = any> = new (...args: any[]) => T

declare interface Request extends http.IncomingMessage {
  query: LooseObject<string>
  cookies: cookies
  body: LooseObject
}
declare interface Response extends http.ServerResponse {
  cookies: cookies
}
declare type Cookies = cookies

declare type CallbackReturnType = [Error | null, boolean]

declare type RequestCallback = (
  req: Request,
  res: Response,
  cookies: Cookies
) => CallbackReturnType | undefined
