import { deepEqual, equal, ok } from '@zoroaster/assert'
import rqt from 'rqt'
import Context, { Elastic } from '../context'
import logarithm from '../../src'

/** @type {Object.<string, (c: Context, e: Elastic)>} */
const T = {
  context: [Context, Elastic],
  'is a function'() {
    equal(typeof logarithm, 'function')
  },
  async'logs data'({ start }, { url, setDefer }) {
    const app = 'test.com'
    const u = await start({
      log: {
        use: true,
        middlewareConstructor() {
          return logarithm({
            app,
            url,
          })
        },
      },
      req(ctx) {
        ctx.body = {}
      },
    })
    const path = 'путь'
    const uu = `${u}/${encodeURIComponent(path)}`
    const [r] = await Promise.all([setDefer(), rqt(uu)])
    const { body } = r
    equal(body.path, `/${path}`)
    equal(body.status, 200)
    equal(body.app, app)
    ok(!('query' in body))
  },
  async'logs query'({ start }, { url, setDefer }) {
    const app = 'test.com'
    const u = await start({
      log: {
        use: true,
        middlewareConstructor() {
          return logarithm({
            app,
            url,
          })
        },
      },
      req(ctx) {
        ctx.body = {}
      },
    })
    const [r] = await Promise.all([setDefer(), rqt(`${u}/test?hello=world`)])
    const { body } = r
    equal(body.path, '/test')
    deepEqual(body.query, { hello: 'world' })
  },
  async'logs errors'({ start }, { url, setDefer }) {
    const app = 'test.com'
    const u = await start({
      log: {
        use: true,
        middlewareConstructor() {
          return logarithm({
            app,
            url,
          })
        },
      },
      req(ctx) {
        ctx.throw(400, 'error')
      },
    })
    const path = 'test'
    const uu = `${u}/${path}`
    const [r] = await Promise.all([setDefer(), rqt(uu)])
    const { body } = r
    equal(body.path, `/${path}`)
    equal(body.status, 400)
    equal(body.app, app)
  },
  async'logs 404'({ start }, { url, setDefer }) {
    const app = 'test.com'
    const u = await start({
      log: {
        use: true,
        middlewareConstructor() {
          return logarithm({
            app,
            url,
          })
        },
      },
    })
    const [r] = await Promise.all([setDefer(), rqt(u)])
    const { body } = r
    equal(body.path, '/')
    equal(body.status, 404)
    equal(body.app, app)
  },
}

export default T