import argufy from 'argufy'

export const argsConfig = {
  'url': {
    description: 'The ElasticSearch URL.\nIf protocol is not given, `http` is assumed.',
    command: true,
  },
  'stats': {
    description: 'Display statistics by indices.',
    boolean: true,
    short: 's',
  },
  'templates': {
    description: 'List all index templates.',
    boolean: true,
    short: 'T',
  },
  'delete': {
    description: 'Delete an index, snapshot or pipeline.\nUsed with the relevant flag.',
    boolean: true,
    short: 'd',
  },
  'index': {
    description: 'Select an index for operations.',
    short: 'i',
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
  'snapshots': {
    description: 'List registered snapshot repositories.',
    boolean: true,
    short: 'S',
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

export const argsConfigMethod = {
  'post': {
    description: 'Send post request with data from the file.',
  },
  'path': {
    description: 'The path to send a request to.',
    short: 'p',
  },
}

export const argsConfigSnapshot = {
  'repository-s3': {
    description: 'Create a new `s3` snapshot repo with this name.',
    short: 's3',
  },
  'bucket': {
    description: 'The bucket name for the `s3` snapshot repository.',
  },
  'repo': {
    description: 'The name of the repo.',
    short: 'r',
  },
  'snapshot': {
    description: 'The name of the snapshot.',
    short: 's',
  },
  'restore': {
    description: 'Restore this snapshot.',
    boolean: true,
  },
  'status': {
    description: 'Fetch the status.',
    boolean: true,
  },
}

export const argsConfigTemplates = {
  'template': {
    description: 'Create an index template for storing\nlog data in the `{template}-*` index.',
    short: 't',
  },
  'shards': {
    description: 'The number of shards for index template.',
    number: true,
    default: '1',
    short: 's',
  },
  'replicas': {
    description: 'The number of replicas for index template.',
    number: true,
    short: 'r',
  },
}

const args = argufy({ ...argsConfig, ...argsConfigMethod, ...argsConfigSnapshot, ...argsConfigTemplates })

/**
 * The ElasticSearch URL.
    If protocol is not given, `http` is assumed.
 */
export const _url = /** @type {string} */ (args['url'])

/**
 * Display statistics by indices.
 */
export const _stats = /** @type {boolean} */ (args['stats'])

/**
 * List all index templates.
 */
export const _templates = /** @type {boolean} */ (args['templates'])

/**
 * Delete an index, snapshot or pipeline.
    Used with the relevant flag.
 */
export const _delete = /** @type {boolean} */ (args['delete'])

/**
 * Select an index for operations.
 */
export const _index = /** @type {string} */ (args['index'])

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
 * List registered snapshot repositories.
 */
export const _snapshots = /** @type {boolean} */ (args['snapshots'])

/**
 * Print the help information and exit.
 */
export const _help = /** @type {boolean} */ (args['help'])

/**
 * Show the version's number and exit.
 */
export const _version = /** @type {boolean} */ (args['version'])

/**
 * Send post request with data from the file.
 */
export const _post = /** @type {string} */ (args['post'])

/**
 * The path to send a request to.
 */
export const _path = /** @type {string} */ (args['path'])

/**
 * Create a new `s3` snapshot repo with this name.
 */
export const _repositoryS3 = /** @type {string} */ (args['repository-s3'])

/**
 * The bucket name for the `s3` snapshot repository.
 */
export const _bucket = /** @type {string} */ (args['bucket'])

/**
 * The name of the repo.
 */
export const _repo = /** @type {string} */ (args['repo'])

/**
 * The name of the snapshot.
 */
export const _snapshot = /** @type {string} */ (args['snapshot'])

/**
 * Restore this snapshot.
 */
export const _restore = /** @type {boolean} */ (args['restore'])

/**
 * Fetch the status.
 */
export const _status = /** @type {boolean} */ (args['status'])

/**
 * Create an index template for storing
    log data in the `{template}-*` index.
 */
export const _template = /** @type {string} */ (args['template'])

/**
 * The number of shards for index template. Default `1`.
 */
export const _shards = /** @type {number} */ (args['shards'] || 1)

/**
 * The number of replicas for index template. Default `0`.
 */
export const _replicas = /** @type {number} */ (args['replicas'] || 0)

/**
 * The additional arguments passed to the program.
 */
export const _argv = /** @type {!Array<string>} */ (args._argv)