/* yarn example/ */
import core from '@idio/core'
import logarithm, { ping } from '../src'

(async () => {
  await ping(process.env.ELASTIC)

  // setup for idio web-server
  const { url, app } = await core({
    async index(ctx) {
      ctx.body = 'hello world'
    },
  })

  app.use(logarithm({
    app: 'idio.cc',
    url: process.env.ELASTIC,
    index: 'clients',
  }))
  console.log(url)
})()