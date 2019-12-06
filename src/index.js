import { aqt } from 'rqt'
import { req } from './lib'

/**
 * Create a middleware for logging requests.
 * @param {_logarithm.Config} options Options for the program.
 */
const logarithm = (options) => {
  if (!options) throw new Error('Options are not given')
  const {
    app, index = app, pipeline = 'info', url,
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
    const body = {
      'app': app,
      'ip': ip,
      'path': decodeURI(path),
      'headers': {
        'user-agent': null,
        ...headers,
        'cookie': undefined,
      },
      'status': status,
      'date': date,
    }

    const i = getIndex(index, date)
    const u = `${url}/${i}/_doc`
    req(u, {
      spec: {
        method: 'POST',
        timeout: 5000,
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

const getIndex = (index, date) => {
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
 * @typedef {import('../').Middleware} _goa.Middleware
 */
