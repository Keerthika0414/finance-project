import path from "path"
import fs from "fs-extra"

export const getDirs = (dir: string) =>
  fs
    .readdirSync(dir)
    .reduce(
      (acc, el) => (!/\./g.test(el) ? acc.concat(path.resolve(dir, el)) : acc),
      [] as any as string[]
    )
