import argufy from 'argufy'

export const argsConfig = {
  'url': {
    description: 'The ElasticSearch URL.\nIf protocol is not given, `http` is assumed.',
    command: true,
  },
  'template': {
    description: 'Create an index template for storing\nlog data in `name-*` index.',
    short: 't',
  },
  'shards': {
    description: 'Number of shards for index template.',
    default: '1',
    short: 's',
  },
  'replicas': {
    description: 'Number of replicas for index template.',
    short: 'r',
  },
  'templates': {
    description: 'List index templates.',
    boolean: true,
    short: 'T',
  },
  'stats': {
    description: 'Display statistics by indices.',
    boolean: true,
    short: 'S',
  },
  'delete': {
    description: 'Delete an index, snapshot or pipeline.\nUsed with the relevant flag.',
    boolean: true,
    short: 'd',
  },
  'pipeline': {
    description: 'Create a pipeline with `User-Agent`\nand `GeoIp` plugins.',
    short: 'p',
  },
  'pipelines': {
    description: 'Display installed pipelines.',
    boolean: true,
    short: 'P',
  },
  'remove-pipeline': {
    description: 'Removes the pipeline.',
  },
  'help': {
    description: 'Print the help information and exit.',
    boolean: true,
    short: 'h',
  },
  'version': {
    description: 'Show the version\'s number and exit.',
    boolean: true,
    short: 'v',
  },
}
const args = argufy(argsConfig)

/**
 * The ElasticSearch URL.
    If protocol is not given, `http` is assumed.
 */
export const _url = /** @type {string} */ (args['url'])

/**
 * Create an index template for storing
    log data in `name-*` index.
 */
export const _template = /** @type {string} */ (args['template'])

/**
 * Number of shards for index template. Default `1`.
 */
export const _shards = /** @type {string} */ (args['shards'] || '1')

/**
 * Number of replicas for index template. Default `0`.
 */
export const _replicas = /** @type {string} */ (args['replicas'] || '0')

/**
 * List index templates.
 */
export const _templates = /** @type {boolean} */ (args['templates'])

/**
 * Display statistics by indices.
 */
export const _stats = /** @type {boolean} */ (args['stats'])

/**
 * Delete an index, snapshot or pipeline.
    Used with the relevant flag.
 */
export const _delete = /** @type {boolean} */ (args['delete'])

/**
 * Create a pipeline with `User-Agent`
    and `GeoIp` plugins.
 */
export const _pipeline = /** @type {string} */ (args['pipeline'])

/**
 * Display installed pipelines.
 */
export const _pipelines = /** @type {boolean} */ (args['pipelines'])

/**
 * Removes the pipeline.
 */
export const _removePipeline = /** @type {string} */ (args['remove-pipeline'])

/**
 * Print the help information and exit.
 */
export const _help = /** @type {boolean} */ (args['help'])

/**
 * Show the version's number and exit.
 */
export const _version = /** @type {boolean} */ (args['version'])

export const argsConfigSnapshot = {
  'snapshots': {
    description: 'List registered snapshot repositories.',
    boolean: true,
  },
  'repository-s3': {
    description: 'Create a new `s3` snapshot repo with this name.',
    short: 's3',
  },
  'bucket': {
    description: 'The bucket name for the `s3` snapshot repository.',
  },
  'snapshot': {
    description: 'The name of the snapshot, e.g., for deletion.',
  },
}
const argsSnapshot = argufy(argsConfigSnapshot, [process.argv[0], process.argv[1], ...args._argv])

/**
 * List registered snapshot repositories.
 */
export const _snapshots = /** @type {boolean} */ (argsSnapshot['snapshots'])

/**
 * Create a new `s3` snapshot repo with this name.
 */
export const _repositoryS3 = /** @type {string} */ (argsSnapshot['repository-s3'])

/**
 * The bucket name for the `s3` snapshot repository.
 */
export const _bucket = /** @type {string} */ (argsSnapshot['bucket'])

/**
 * The name of the snapshot, e.g., for deletion.
 */
export const _snapshot = /** @type {string} */ (argsSnapshot['snapshot'])

/**
 * The additional arguments passed to the program.
 */
export const _argv = /** @type {!Array<string>} */ (argsSnapshot._argv)