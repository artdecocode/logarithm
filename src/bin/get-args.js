import argufy from 'argufy'

const args = argufy({
  'url': { command: true },
  'help': { short: 'h', boolean: true },
  'pipeline': { short: 'p' },
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
 * @type {boolean}
 */
export const _pipeline = args['pipeline']