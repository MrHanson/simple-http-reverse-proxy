import { createExampleServer, createProxyServer, SIZE, PORT_START, IP } from './server.js'

const start = async function () {
  const proxiedPortList = []
  for (let i = 1; i <= SIZE; i++) {
    const curPort = PORT_START + i
    await createExampleServer(curPort)
    proxiedPortList.push(`${IP}:${curPort}`)
  }
  await createProxyServer(PORT_START, proxiedPortList)
}
start()
