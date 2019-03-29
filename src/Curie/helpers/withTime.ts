export const withTime = (text: string) => {
  const d = new Date()
  return `{${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}}${text}`
}