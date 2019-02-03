import argufy from 'argufy'

const args = argufy({
  'url': { command: true },
  'help': { short: 'h', boolean: true },
  'pipeline': { short: 'p' },
  'pipelines': { short: 'P', boolean: true },
  'remove-pipeline': { short: 'rp' },
  'version': { short: 'v', boolean: true },
})

/**
 * ElasticSearch URL.
 * @type {string}
 */
export const _url = args['url']
/**
 * Show help.
 * @type {boolean}
 */
export const _help = args['help']
/**
 * Show version.
 * @type {boolean}
 */
export const _version = args['version']
/**
 * Add pipeline.
 * @type {string}
 */
export const _pipeline = args['pipeline']
/**
 * List existing pipelines.
 * @type {string}
 */
export const _listPipelines = args['pipelines']
/**
 * List existing pipelines.
 * @type {string}
 */
export const _removePipeline = args['remove-pipeline']