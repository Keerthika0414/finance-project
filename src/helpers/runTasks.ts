import { Server } from "../Server";
import { ChalkColors } from "../types";
import { initLogger } from "./log";
import cp from "child_process"

export function* runTasks(this: Server) {
  
  for(const task of this.options.preRun) {
    const logger = (c: keyof ChalkColors) => initLogger(`Task:${task}`, c)
    
    yield new Promise((res, rej) => {
      const p = cp.exec(task)
      p.stdout&&p.stdout.on("data", logger("cyanBright"))
      p.on("close", res)
      p.on("error", logger("redBright"))
    })
  }
}
  /*
  const promises = this.options.preRun.map((task, i) => {
    const logger = (c: keyof ChalkColors) => initLogger(`Task:${i}`, c)

    return new Promise((res, rej) => {
      const p = cp.exec(task, {
        cwd: process.cwd()
      }, (err, out, stderr) => {
        if(err) rej(stderr || err)
        else res(out)
      })

      if(p.stdout) {
        p.stdout.on("data", logger("cyanBright"))
        p.on("error", logger("redBright"))
      }
    })
  }) 

  let p: Promise<any> = promises[0] || Promise.resolve(null)
  for(let i = 1; i < promises.length; i++) {
    await p.then(() => p = promises[1])
  }
  
  return await p*/
