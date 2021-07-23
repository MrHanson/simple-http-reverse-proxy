import http from 'http'
import reverseProxy from './proxy'
import log from './pkg/utils/log'

export function createExampleServer(port) {
  return new Promise((rs, rj) => {
    const server = http.createServer((req, res) => {
      const chunks = []
      req.on('data', chunk => chunks.push(chunk))
      req.on('end', () => {
        const buf = Buffer.concat(chunks)
        res.end(`${port}: ${req.method} ${req.url} ${buf.toString()}`.trim())
      })
    })

    server.listen(port, () => {
      log('server start at: %s', port)
      rs(server)
    })
    server.on('error', rj)
  })
}

export function createProxyServer(port, proxiedPortList) {
  return new Promise((rs, rj) => {
    const server = http.createServer(reverseProxy({ servers: proxiedPortList }))

    server.listen(port, () => {
      log('reverse proxy server start at: %s', port)
      rs(server)
    })
    server.on('error', rj)
  })
}
