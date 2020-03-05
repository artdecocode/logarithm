import { aqt } from 'rqt'
import { req } from './lib'

/**
 * Create a middleware for logging requests.
 * @param {_logarithm.Config} options Options for the program.
 */
const logarithm = (options) => {
  if (!options) throw new Error('Options are not given')
  const {
    app, index = app, pipeline = 'info', url, timeout = 5000,
    strategy = monthly,
  } = options
  if (!app) throw new Error('The app is not defined')

  /** @type {!_goa.Middleware} */
  const es = async (ctx, next) => {
    let e; try { await next() } catch (err) { e = err }
    const {
      request: { ip, path },
      headers: {
        // closure compiler bug
        // cookie, // eslint-disable-line no-unused-vars
        ...headers
      },
      status,
    } = ctx
    const date = new Date()
    /** @type {!_logarithm.Hit} */
    const body = {
      app,
      ip,
      path: decodeURI(path),
      headers: {
        'user-agent': '',
        ...headers,
        'cookie': undefined,
      },
      status,
      date,
    }

    const i = strategy(index, date)
    const u = `${url}/${i}/_doc`
    // todo: batch
    req(u, {
      spec: {
        method: 'POST',
        timeout,
      },
      query: { pipeline },
    }, body).then(() => {
      // process.stdout.write('.')
    }).catch(({ message }) => {
      console.log(`Logarithm ERROR: ${message}`)
    })

    if (e) throw e
  }
  return es
}

/**
 * Check that a connection to the server can be established.
 * @param {string} url The ElasticSearch URL.
 * @param {number} [timeout=30000] The timeout for the request in ms. Default `30000`.
 */
export const ping = async (url, timeout = 30000) => {
  const { statusCode } = await aqt(url, { timeout, justHeaders: true, method: 'HEAD' })
  if (statusCode != 200) throw new Error(`Server responded with status code ${statusCode}`)
}

/**
 * Returns an index name by months.
 * @param {string} index The name of the index.
 * @param {!Date} date The date of the request.
 */
const monthly = (index, date) => {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  return `${index}-${y}.${m}`
}

export default logarithm

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../').Config} _logarithm.Config
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../').Hit} _logarithm.Hit
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../').Middleware} _goa.Middleware
 */
