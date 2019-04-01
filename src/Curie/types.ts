import http from "http"
import cookies from 'cookies'
import { Chalk } from "chalk";

export interface LooseObject<T = any> {
  [key: string]: T
}

export interface ChalkColors {
  readonly reset: Chalk;
	readonly bold: Chalk;
	readonly dim: Chalk;
	readonly italic: Chalk;
	readonly underline: Chalk;
	readonly inverse: Chalk;
	readonly hidden: Chalk;
	readonly strikethrough: Chalk;

	readonly visible: Chalk;

	readonly black: Chalk;
	readonly red: Chalk;
	readonly green: Chalk;
	readonly yellow: Chalk;
	readonly blue: Chalk;
	readonly magenta: Chalk;
	readonly cyan: Chalk;
	readonly white: Chalk;
	readonly gray: Chalk;
	readonly grey: Chalk;
	readonly blackBright: Chalk;
	readonly redBright: Chalk;
	readonly greenBright: Chalk;
	readonly yellowBright: Chalk;
	readonly blueBright: Chalk;
	readonly magentaBright: Chalk;
	readonly cyanBright: Chalk;
	readonly whiteBright: Chalk;

	readonly bgBlack: Chalk;
	readonly bgRed: Chalk;
	readonly bgGreen: Chalk;
	readonly bgYellow: Chalk;
	readonly bgBlue: Chalk;
	readonly bgMagenta: Chalk;
	readonly bgCyan: Chalk;
	readonly bgWhite: Chalk;
	readonly bgBlackBright: Chalk;
	readonly bgRedBright: Chalk;
	readonly bgGreenBright: Chalk;
	readonly bgYellowBright: Chalk;
	readonly bgBlueBright: Chalk;
	readonly bgMagentaBright: Chalk;
	readonly bgCyanBright: Chalk;
	readonly bgWhiteBright: Chalk;
}

export type Executable<T> = (arg: LooseObject) => T

// @ts-ignore
export type ConstructorParameters<T extends new (...args: any[]) => any> = T extends new (...args: infer P) => any ? P : never;

export type ClassConstructor<T = any> = new(...args: any[]) => T

export interface Request extends http.IncomingMessage {
  query: LooseObject<string>
	cookies: cookies
	body: LooseObject
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