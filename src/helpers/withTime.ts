const toLength = (x: number, l: number) => x.toString().padStart(l, "0")

export const withTime = (text: string) => {
  const d = new Date()
  
  return `{${toLength(d.getHours(), 2)}:${toLength(d.getMinutes(), 2)}:${toLength(d.getSeconds(),2)}:${toLength(d.getMilliseconds(), 3)}}${text}`
}