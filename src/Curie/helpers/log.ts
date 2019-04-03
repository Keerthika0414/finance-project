import chalk from "chalk"
import { Executable, ChalkColors } from "../types"
import { withTime } from "./withTime";

export const log = (text: any, color: keyof ChalkColors) =>
  console.log(
    ((chalk[color] as any) as Executable<string>)(
      typeof text === "object" ? JSON.stringify(text) : text
    )
  )
export const c_log = (text: string) => log(text, "yellowBright")

export const initLogger = (name: string, color: keyof ChalkColors) => (text: string) => log(withTime(`[${name}]${text}`), color)
