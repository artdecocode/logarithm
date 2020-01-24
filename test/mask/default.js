import makeTestSuite from '@zoroaster/mask'
import rqt from 'rqt'
import Context, { Elastic } from '../context'
import logarithm from '../../src'

export default makeTestSuite('test/result', {
  /**
   * @param {Context} c
   * @param {Elastic} e
   */
  async getResults({ start }, { url, setDefer }) {
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
    const uu = `${u}/${encodeURIComponent(this.input)}`
    const [r] = await Promise.all([setDefer(), rqt(uu)])
    const { body } = r
    delete body.date
    delete body.headers.host
    return body
  },
  jsonProps: ['expected'],
  context: [Context, Elastic],
})