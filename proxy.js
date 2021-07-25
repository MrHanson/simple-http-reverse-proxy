import http from 'http'
import assert from 'assert'
import log from './pkg/utils/log.js'

/**
 * interface Options {
 *   servers: Array
 *
 * }
 *
 * @param {Options} options
 */
export default function reverseProxy(options) {
  assert(Array.isArray(options.servers), 'options.servers must be array')
  assert(options.servers.length > 0, "options.servers can't be empty")

  const servers = options.servers.map(str => {
    const [hostname, port] = str.split(':')
    return { hostname, port: port || '80' }
  })

  let ti = 0
  function getTarget() {
    const t = servers[ti]
    ti++
    if (ti >= servers.length) {
      ti = 0
    }
    return t
  }

  function bindError(req, res, id) {
    return function (err) {
      const msg = String(err.stack || err)
      log('[%s] error happened: %s', id, msg)
      if (!res.headersSent) {
        res.writeHead(500, { 'content-type': 'text/plain' })
      }
      res.end(msg)
    }
  }

  return function proxy(req, res) {
    const target = getTarget()
    const info = {
      ...target,
      method: req.method,
      path: req.url,
      headers: req.headers,
    }

    const id = `${req.method} ${req.url} => ${target.hostname}:${target.port}`
    log('[%s] proxied request', id)

    const req2 = http.request(info, res2 => {
      res2.on('error', bindError(req, res, id))
      res.writeHead(res2.statusCode, res2.headers)
      res2.pipe(res)
    })
    req.pipe(req2)
    req2.on('error', bindError(req, res, id))
  }
}
