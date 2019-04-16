import path from "path"
import fs from "fs-extra"
const isFile = (p: string) => /\./g.test(p)
export const getDirs = (dir: string) =>
  fs
    .readdirSync(dir)
    .reduce(
      (acc, el) => {
        if(!isFile(el)) {
          const full_path = path.resolve(dir, el)
          const sub_dirs = getDirs(full_path)
          if(sub_dirs.length === 0) acc.push(full_path)
          else acc= acc.concat(sub_dirs)
        }
        return acc
      },
      [] as any as string[]
    )
