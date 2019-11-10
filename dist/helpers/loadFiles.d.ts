/// <reference types="node" />
export interface LoadFilesFDResponse {
    fileDescriptor: number;
    headers: {
        'content-length': number;
        'last-modified': string;
        'content-type': string;
    };
}
export interface loadFilesDataResponse {
    buffer: Buffer;
    mime: string;
}
export declare const loadFilesFD: (dir: string, prefix: string) => Promise<Map<string, LoadFilesFDResponse>>;
export declare const loadFilesData: (dir: string, prefix: string) => Promise<Map<string, loadFilesDataResponse>>;
