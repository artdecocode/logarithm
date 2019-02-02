/* yarn example/ */
import core from '@idio/core'
import logarithm from '../src'

(async () => {
  const { url } = await core({
    logarithm: {
      middlewareConstructor(app, config) {
        const mw = logarithm(config)
        return mw
      },
      config: {
        url: process.env.ELASTIC,
        app: 'logarithm',
        index: 'clients',
      },
      use: true,
    },
    async index(ctx) {
      ctx.body = 'hello world'
    },
  })
  console.log(url)
})()