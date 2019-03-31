import { Response } from "../types";
export declare const pipeFile: (path: string, destination: Response) => Promise<[Error | null, boolean]>;
