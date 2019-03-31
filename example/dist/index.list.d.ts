import c, { Listener } from "curie-server";
export default class extends Listener {
    onGET(req: c.Request, res: c.Response): Promise<[Error | null, boolean]>;
}
