import chalk from "chalk"
import { Executable, ChalkColors } from "../types";


export const log = (text: any, color: keyof ChalkColors) => console.log((chalk[color] as any as Executable<string>)(text))
export const c_log = (text: string) => log(text, "yellowBright")