import http from "http";
export declare const parseBody: <T>(req: http.IncomingMessage, outputType?: string) => Promise<T>;
