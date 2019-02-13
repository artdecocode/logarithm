/* yarn example/ */
import core from '@idio/core'
import logarithm, { ping } from '../src'

(async () => {
  await ping(process.env.ELASTIC)

  // setup for idio web-server
  const { url, app } = await core()

  app.use(logarithm({
    app: 'idio.cc',
    url: process.env.ELASTIC,
    index: 'clients',
  }))
  app.use(async (ctx) => {
    ctx.body = 'hello world'
  })
  console.log(url)
})()