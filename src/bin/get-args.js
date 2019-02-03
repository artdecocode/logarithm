import argufy from 'argufy'

const args = argufy({
  'url': { command: true },
  'help': { short: 'h', boolean: true },
  'template': { short: 't' },
  'templates': { short: 'T', boolean: true },
  'stats': { short: 'S', boolean: true },
  'delete': { short: 'd' },
  'shards': { short: 's', type: 'number' },
  'replicas': { short: 'r', type: 'number' },
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
 * Create index template.
 * @type {string}
 */
export const _template = args['template']
/**
 * Delete index.
 * @type {string}
 */
export const _delete = args['delete']
/**
 * Shards in the index template.
 * @type {string}
 */
export const _shards = args['shards']
/**
 * Replicas in the index template.
 * @type {string}
 */
export const _replicas = args['replicas']
/**
 * List existing pipelines.
 * @type {boolean}
 */
export const _listPipelines = args['pipelines']
/**
 * Shows stats for indices.
 * @type {boolean}
 */
export const _stats = args['stats']
/**
 * List existing templates.
 * @type {boolean}
 */
export const _listTemplates = args['templates']
/**
 * Removes the pipeline.
 * @type {string}
 */
export const _removePipeline = args['remove-pipeline']