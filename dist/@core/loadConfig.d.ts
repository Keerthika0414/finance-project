export interface CurieConfig {
    public: string;
    routes: string;
    listeners: [string, string | RegExp];
    middleware: [string, string | RegExp];
    database: string;
    root: string;
    [key: string]: any | any[];
}
export declare const DEFAULT_CURIE_CONFIG: CurieConfig;
export declare const loadConfig: () => CurieConfig;
