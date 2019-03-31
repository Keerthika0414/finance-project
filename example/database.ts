import { PostDBridge } from "curie-server"
import { database } from "curie-server/dist/@core";

@database("postgres://postgres:postgres@127.0.0.1:5432/postgres")
export default class extends PostDBridge {}