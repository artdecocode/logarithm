import { equal } from 'zoroaster/assert'
import rqt from 'rqt'
import Context, { Elastic } from '../context'
import logarithm from '../../src'

/** @type {Object.<string, (c: Context, e: Elastic)>} */
const T = {
  context: [Context, Elastic],
  'is a function'() {
    equal(typeof logarithm, 'function')
  },
  async '!logs the data'({ start }, { url, setDefer }) {
    const u = await start({
      log: {
        use: true,
        middlewareConstructor() {
          return logarithm({
            app: 'test.com',
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
  },
}

export default T