import { LooseObject, ClassConstructor } from "./types";

interface Response {
  n: number
}

interface UpdateResponse extends Response {
  // Number of matched elements
  found: number
}
interface DeleteResponse extends Response {}
interface CreateResponse extends Response {}

export abstract class DBridge<DBType, QueryType> {
  abstract db: DBType
  constructor(db_link: string) {}
  abstract get(query: QueryType): LooseObject[]
  abstract update(query: QueryType): UpdateResponse
  abstract delete(query: QueryType): DeleteResponse
  abstract create<T extends ClassConstructor>(model: T, data: ConstructorParameters<T>): CreateResponse
}