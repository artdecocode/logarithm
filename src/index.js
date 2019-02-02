import uniqid from 'uniqid'
import rqt from 'rqt'
import { stringify } from 'querystring'

/**
 * Create a middleware for logging requests.
 * @param {Config} options Options for the program.
 * @param {string} options.app The name of the website application.
 * @param {string} options.url ElasticSearch endpoint URL, e.g., `192.168.0.1:9200`.
 * @param {('http'|'https')} [options.proto="http"] The protocol to use. Default `http`.
 * @param {number} [options.timeout=5000] Timeout for the connection after which an error is shown. Default `5000`.
 * @param {string} [options.type="hit"] The type of the document. Default `hit`.
 * @param {string} [options.pipeline="info"] The pipeline in ElasticSearch, for example to parse GeoIP info and User-Agent. Default `info`.
 * @param {string} [options.index] The name of the index. Defaults to the app name if not specified as well as monthly strategy.
 * @param {('monthly')} [options.strategy="monthly"] How to construct the index name. E.g., the monthly strategy will result in `${index}-${y}.${m}` indexes. Default `monthly`.
 */
const logarithm = (options) => {
  if (!options) throw new Error('Options are not given')
  const {
    app, index = app, pipeline = 'info', url, type = 'hit', proto = 'http',
  } = options
  if (!app) throw new Error('The app is not defined')
  /** @type {import('koa').Middleware} */
  const es = async (ctx, next) => {
    let e; try { await next() } catch (err) { e = err }
    const {
      request: { ip, path },
      headers: {
        cookie, // eslint-disable-line no-unused-vars
        ...headers
      },
      status,
    } = ctx
    const date = new Date()
    const body = {
      app,
      ip,
      path,
      headers,
      status,
      date,
    }

    const id = uniqid()
    const i = getIndex(index, date)
    const query = pipeline ? stringify({ pipeline }) : ''
    const u = `${proto}://${url}/${i}/${type}/${id}/_create?${query}`
    rqt(u, {
      method: 'POST',
      data: body,
      timeout: 5000,
    }).then(({ error }) => {
      if (error) throw new Error(error.reason)
    }).catch(({ message }) => {
      console.log(`Logarithm ERROR: ${message}`)
    })

    if (e) throw e
  }
  return es
}

const getIndex = (index, date) => {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  return `${index}-${y}.${m}`
}

export default logarithm

/* documentary types/index.xml */
/**
 * @typedef {Object} Config Options for the program.
 * @prop {string} app The name of the website application.
 * @prop {string} url ElasticSearch endpoint URL, e.g., `192.168.0.1:9200`.
 * @prop {('http'|'https')} [proto="http"] The protocol to use. Default `http`.
 * @prop {number} [timeout=5000] Timeout for the connection after which an error is shown. Default `5000`.
 * @prop {string} [type="hit"] The type of the document. Default `hit`.
 * @prop {string} [pipeline="info"] The pipeline in ElasticSearch, for example to parse GeoIP info and User-Agent. Default `info`.
 * @prop {string} [index] The name of the index. Defaults to the app name if not specified as well as monthly strategy.
 * @prop {('monthly')} [strategy="monthly"] How to construct the index name. E.g., the monthly strategy will result in `${index}-${y}.${m}` indexes. Default `monthly`.
 */
