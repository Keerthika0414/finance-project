export const fixFilePath = (path: string) => path.replace(/^\/{2,}/, '/')
export const normalizePath = (path: string) => path.replace(/(\\|\.?\/)+/g, '/')