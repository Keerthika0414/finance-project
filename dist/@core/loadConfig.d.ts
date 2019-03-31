export interface CurieConfig {
    server: string;
    public: string;
    routes: string;
    listenres: [string, string];
    middleware: [string, string];
    database: string;
    root: string;
    [key: string]: string | [string, string];
}
export declare const loadConfig: () => CurieConfig;
