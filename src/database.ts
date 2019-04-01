import { PostDBridge } from "./Curie";
import { database } from "./Curie/@core";

@database("postgres://postgres:postgres@127.0.0.1:5432/postgres")
export default class db extends PostDBridge {
  cache_time = 0
}