import util from "util"

export default function log(...args) {
  const time = new Date().toLocaleString()
  console.log(time, util.format(...args))
}
