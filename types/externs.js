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
 * The name of the index. Defaults to the app name if not specified as well as monthly strategy.
 * @type {string|undefined}
 */
_logarithm.Config.prototype.index
/**
 * How to construct the index name. E.g., the monthly strategy will result in `${index}-${y}.${m}` indexes. Default `monthly`.
 * @type {string|undefined}
 */
_logarithm.Config.prototype.strategy
