import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import logarithm from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof logarithm, 'function')
  },
  async 'calls package without error'() {
    await logarithm()
  },
  async 'gets a link to the fixture'({ FIXTURE }) {
    const res = await logarithm({
      text: FIXTURE,
    })
    ok(res, FIXTURE)
  },
}

export default T