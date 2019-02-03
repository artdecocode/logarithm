/* yarn example/ */
import core from '@idio/core'
import logarithm, { ping } from '../src'

(async () => {
  await ping(process.env.ELASTIC)

  const { url } = await core({
    logarithm: {
      middlewareConstructor(app, config) {
        const mw = logarithm(config)
        return mw
      },
      config: {
        url: process.env.ELASTIC,
        app: 'idio.cc',
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