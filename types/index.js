export {}

/* typal types/index.xml namespace */
/**
 * @typedef {_logarithm.Config} Config `＠record` Options for the program.
 * @typedef {Object} _logarithm.Config `＠record` Options for the program.
 * @prop {string} app The name of the website application.
 * @prop {string} url ElasticSearch endpoint URL, e.g., `http://192.168.0.1:9200`.
 * @prop {number} [timeout=5000] Timeout for the connection after which an error is shown. Default `5000`.
 * @prop {string} [type="hit"] The type of the document. Default `hit`.
 * @prop {string} [pipeline="info"] The pipeline in ElasticSearch, for example to parse GeoIP info and User-Agent. Default `info`.
 * @prop {string} [index] The name of the index. Defaults to the app name if not specified as well as monthly strategy.
 * @prop {('monthly')} [strategy="monthly"] How to construct the index name. E.g., the monthly strategy will result in `${index}-${y}.${m}` indexes. Default `monthly`.
 */
