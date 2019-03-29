import { LooseObject, ClassConstructor, ConstructorParameters } from "./types";
import _pgp from "pg-promise"
import { Server } from "./Server";
const pgp = _pgp({
  query(e) {
    console.dir(e, {colors: true, depth: 1})
  }
})

interface Response {
  n: number
}

export interface UpdateResponse extends Response {
  // Number of matched elements
  found: number
}
export interface DeleteResponse extends Response {}
export interface CreateResponse extends Response {}

export abstract class DBridge<DBType, QueryType> {
  abstract db: DBType
  constructor(db_link: string, server?: Server) {
    server&&!server.db&&(server.db = this)
  }
  async get(query: QueryType): Promise<LooseObject[] | any> {
    return new Promise(res => res())
  }
  async update(query: QueryType): Promise<UpdateResponse | any> {
    return new Promise(res => res())
  }
  async delete(query: QueryType): Promise<DeleteResponse | any> {
    return new Promise(res => res())
  }
  async create<T extends ClassConstructor>(model: T, data: ConstructorParameters<T>): Promise<CreateResponse | any> {
    return new Promise(res => res())
  }
}

interface CacheItem {
  date: Date,
  data: any
}

export class PostDBridge extends DBridge<_pgp.IDatabase<{}>, string> {
  db: _pgp.IDatabase<{}>
  cache: Map<string, CacheItem>

  constructor(cn: string, server?: Server) {
    super(cn, server)
    this.db = pgp(cn)
    this.cache = new Map()
  }
  async get<T>(query: string) {
    const found = this.cache.get(query)
    if(found) {
      const now = new Date()
      // @ts-ignore
      if(Math.abs(found.date - now) < 5*60*1000) {
        return found.data
      }
    }
    const res: T[] = await this.db.any(query)
    this.cache.set(query, {
      data: res,
      date: new Date()
    })
    return res
  }
}