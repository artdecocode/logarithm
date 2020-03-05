/**
 * @fileoverview
 * @externs
 */
/* typal types/index.xml externs */
/** @const */
var _logarithm = {}
/**
 * Options for the program.
 * @record
 */
_logarithm.Config
/**
 * The name of the website application.
 * @type {string}
 */
_logarithm.Config.prototype.app
/**
 * ElasticSearch endpoint URL, e.g., `http://192.168.0.1:9200`.
 * @type {string}
 */
_logarithm.Config.prototype.url
/**
 * Timeout for the connection after which an error is shown. Default `5000`.
 * @type {number|undefined}
 */
_logarithm.Config.prototype.timeout
/**
 * The pipeline in ElasticSearch, for example to parse GeoIP info and User-Agent. Default `info`.
 * @type {string|undefined}
 */
_logarithm.Config.prototype.pipeline
/**
 * The name of the index. Defaults to the app name if not specified.
 * @type {string|undefined}
 */
_logarithm.Config.prototype.index
/**
 * How to construct the index name. By default, monthly strategy is used: `${index}-${yyyy}.${mm}`.
 * @type {(function(string,!Date): string)|undefined}
 */
_logarithm.Config.prototype.strategy = function(index, date) {}
/**
 * A record sent to ElasticSearch.
 * @record
 */
_logarithm.Hit
/**
 * The application name from the config.
 * @type {string}
 */
_logarithm.Hit.prototype.app
/**
 * Client IP address.
 * @type {string}
 */
_logarithm.Hit.prototype.ip
/**
 * The decoded request path.
 * @type {string}
 */
_logarithm.Hit.prototype.path
/**
 * The request headers.
 * @type {!Object}
 */
_logarithm.Hit.prototype.headers
/**
 * The status code.
 * @type {number}
 */
_logarithm.Hit.prototype.status
/**
 * The date of the request.
 * @type {!Date}
 */
_logarithm.Hit.prototype.date
/**
 * The method of the request, e.g., `GET` or `POST`.
 * @type {string}
 */
_logarithm.Hit.prototype.method
