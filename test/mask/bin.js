import makeTestSuite from '@zoroaster/mask'
// import rqt from 'rqt'
import Context from '../context'
import clearr from 'clearr'
// import logarithm from '../../src'

export default makeTestSuite('test/result/bin', {
  context: Context,
  fork: {
    module: Context.BIN,
    /**
     * @param {string[]}
     * @param {Context} context
     */
    async getArgs(args, { start }) {
      const url = await start({
        get: (ctx) => {
          ctx.body = this.response
        },
      })
      return [url, ...args]
    },
    preprocess: clearr,
  },
  jsonProps: ['response'],
})