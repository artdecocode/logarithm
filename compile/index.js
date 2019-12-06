const { _logarithm, _ping } = require('./logarithm')

/**
 * Creates a middleware for logging requests in _Koa_/_Goa_ web-server and returns it.
 * @param {_logarithm.Config} options Options for the program.
 * @param {string} options.app The name of the website application.
 * @param {string} options.url ElasticSearch endpoint URL, e.g., `http://192.168.0.1:9200`.
 * @param {number} [options.timeout=5000] Timeout for the connection after which an error is shown. Default `5000`.
 * @param {string} [options.pipeline="info"] The pipeline in ElasticSearch, for example to parse GeoIP info and User-Agent. Default `info`.
 * @param {string} [options.index] The name of the index. Defaults to the app name if not specified as well as monthly strategy.
 * @param {string} [options.strategy="monthly"] How to construct the index name. E.g., the monthly strategy will result in `${index}-${y}.${m}` indexes. Default `monthly`.
 * @return {_goa.Middleware}
 */
function logarithm(options) {
  return _logarithm(options)
}

/**
 * Check that a connection to the _ElasticSearch_ server can be established. Will throw an error after timeout.
 * @param {string} url The ElasticSearch URL.
 * @param {number} timeout The timeout for the request in ms.
 * @return {Promise}
 */
function ping(url, timeout) {
  return _ping(url, timeout)
}

module.exports = logarithm
module.exports.ping = ping

/* typal types/index.xml namespace */
/**
 * @typedef {_logarithm.Config} Config `＠record` Options for the program.
 * @typedef {Object} _logarithm.Config `＠record` Options for the program.
 * @prop {string} app The name of the website application.
 * @prop {string} url ElasticSearch endpoint URL, e.g., `http://192.168.0.1:9200`.
 * @prop {number} [timeout=5000] Timeout for the connection after which an error is shown. Default `5000`.
 * @prop {string} [pipeline="info"] The pipeline in ElasticSearch, for example to parse GeoIP info and User-Agent. Default `info`.
 * @prop {string} [index] The name of the index. Defaults to the app name if not specified as well as monthly strategy.
 * @prop {string} [strategy="monthly"] How to construct the index name. E.g., the monthly strategy will result in `${index}-${y}.${m}` indexes. Default `monthly`.
 */

/**
 * @typedef {import('@typedefs/goa').Middleware} Middleware
 */
