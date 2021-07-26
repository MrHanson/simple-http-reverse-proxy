import { createExampleServer, createProxyServer, SIZE, PORT_START, IP } from './server.js'
import request from 'supertest'

describe('测试反向代理', function () {
  let proxyServer
  const exampleServers = []
  before(async function () {
    const proxiedPortList = []
    for (let i = 1; i <= SIZE; i++) {
      const curPort = PORT_START + i
      exampleServers.push(await createExampleServer(curPort))
      proxiedPortList.push(`${IP}:${curPort}`)
    }
    proxyServer = createProxyServer(PORT_START, proxiedPortList)
  })

  after(async function () {
    for (server of exampleServers) {
      server.close()
    }
  })

  it('顺序循环返回目标地址', async function () {
    await request.get('/hello').expect(200).expect(`3001: GET /hello`)

    await request.get('/hello').expect(200).expect(`3002: GET /hello`)

    await request.get('/hello').expect(200).expect(`3003: GET /hello`)

    await request.get('/hello').expect(200).expect(`3001: GET /hello`)
  })

  it('支持 POST 请求', async function () {
    await request
      .post('/xyz')
      .send({
        a: 123,
        b: 456,
      })
      .expect(200)
      .expect(`3002: POST /xyz {"a":123,"b":456}`)
  })
})
