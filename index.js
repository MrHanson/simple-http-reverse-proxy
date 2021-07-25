import ini from "ini"
import fs from "fs"
import { createExampleServer, createProxyServer } from './server.js'


const serverIni = ini.parse(fs.readFileSync("./conf/server.ini", "utf-8"))
const { PORT_START, SIZE } = serverIni["example"]
const { IP } = serverIni["proxy"]

const start = async function() {
  const proxiedPortList = []
  for(let i = 1; i <= SIZE; i++) {
    const curPort = PORT_START + i
    await createExampleServer(curPort)
    proxiedPortList.push(`${IP}:${curPort}`)
  }
  await createProxyServer(PORT_START, proxiedPortList)
}
start()
