const { _logarithm, _ping } = require('./logarithm')

/**
 * @methodType {_logarithm.logarithm}
 */
function logarithm(options) {
  return _logarithm(options)
}

/**
 * @methodType {_logarithm.ping}
 */
function ping(url, timeout) {
  return _ping(url, timeout)
}

module.exports = logarithm
module.exports.ping = ping

/* typal types/index.xml namespace */

/**
 * @typedef {import('@typedefs/goa').Middleware} Middleware
 */
