import { Server, ServerParams } from "../src/Server";
import { DBridge } from "../src/DBridge";

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