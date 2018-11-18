import { makeTestSuite } from 'zoroaster'
import Context from '../context'
import logarithm from '../../src'

const ts = makeTestSuite('test/result', {
  async getResults(input) {
    const res = await logarithm({
      text: input,
    })
    return res
  },
  context: Context,
})

export default ts