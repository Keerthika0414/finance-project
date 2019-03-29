import { Response, LooseObject } from "../types";

const switchDataType = <T>(x: T) => {
  if(x instanceof Buffer) return x.toString("utf-8")
  else if(["object", "bigint", "symbol"].some(a => a === typeof x)) return JSON.stringify(x)
  return x
}

export const send = <T>(res: Response, data: T, headers: LooseObject = {}) => {
  res.writeHead(200)
  if (!res.headersSent)
    for(const header in headers) res.setHeader(header, headers[header])
  res.write(switchDataType(data), "utf-8")
}