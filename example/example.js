/* yarn example/ */
import core from '@idio/core'
import logarithm, { ping } from '../src'

(async () => {
  await ping(process.env.ELASTIC)

  // setup for idio web-server
  const { url, app } = await core({
    logarithm: {
      middlewareConstructor(_, config) {
        const mw = logarithm(config)
        return mw
      },
      config: {
        url: process.env.ELASTIC,
        app: 'idio.cc',
        index: 'clients',
      },
      // use: true,
    },
    async index(ctx) {
      ctx.body = 'hello world'
    },
  })

  // or using standard koa setup
  app.use(logarithm({
    app: 'idio.cc',
    url: process.env.ELASTIC,
    index: 'clients',
  }))
  console.log(url)
})()