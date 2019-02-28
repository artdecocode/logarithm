import { resolve } from 'path'
import { debuglog } from 'util'
import core from '@idio/core'

const LOG = debuglog('logarithm')

const FIXTURE = resolve(__dirname, '../fixture')

/**
 * A testing context for the package.
 */
export default class Context {
  async _init() {
    LOG('init context')
  }
  /**
   * @param {import('@idio/core').MiddlewareConfig} conf
   */
  async start(conf) {
    const { app, url } = await core(conf, { port: null })
    this.app = app
    return url
  }
  /**
   * Example method.
   */
  example() {
    return 'OK'
  }
  /**
   * Path to the fixture file.
   */
  get FIXTURE() {
    return resolve(FIXTURE, 'test.txt')
  }
  get SNAPSHOT_DIR() {
    return resolve(__dirname, '../snapshot')
  }
  async _destroy() {
    if (this.app) {
      await this.app.destroy()
    }
    LOG('destroy context')
  }
}

export class Elastic {
  async _init() {
    const { app, url } = await core({
      bodyparser: {
        use: true,
      },
      req: (ctx) => {
        ctx.body = {}
        if (this.d) {
          this.d(ctx.request)
          this.d = null
        }
      },
    }, { port: null })
    this.requests = []
    this.app = app
    this.url = url
  }
  async _destroy() {
    await this.app.destroy()
  }
  async setDefer() {
    return await new Promise(r => {
      this.d = r
    })
  }
}