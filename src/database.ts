import { PostDBridge } from "./Curie";
import s from "./server"

@s.database("postgres://postgres:postgres@127.0.0.1:5432/postgres")
export default class database extends PostDBridge {}