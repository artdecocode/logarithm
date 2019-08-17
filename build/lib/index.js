const rqt = require('rqt');
const { stringify } = require('querystring');

/**
 * Sets up the info pipeline for parsing of user-agent and extracting GEOIP info from IP address.
 * @param {string} url The ElasticSearch URL.
 */
const setupPipeline = async (url, id) => {
  const u = `${url}/_ingest/pipeline/${id}`
  await req(u, {
    spec: {
      method: 'PUT',
      timeout: 5000,
    },
  }, {
    'description': 'IP Address And UserAgent',
    'processors': [
      { 'geoip': { 'field': 'ip' } },
      { 'user_agent': { 'field': 'headers.user-agent' } },
    ],
  })
}

const listPipelines = async (url) => {
  const u = `${url}/_ingest/pipeline`
  const res = await req(u, {
    spec: {
      timeout: 5000,
    },
  })
  return res
}
const listTemplates = async (url) => {
  const u = `${url}/_template`
  const res = await req(u, {
    spec: {
      timeout: 5000,
    },
  })
  return res
}
const stats = async (url) => {
  const u = `${url}/_stats`
  const res = await req(u, {
    spec: {
      timeout: 10000,
    },
  })
  return res
}

const deletePipeline = async (url, id) => {
  const u = `${url}/_ingest/pipeline/${id}`
  const res = await req(u, {
    spec: {
      method: 'DELETE',
      timeout: 5000,
    },
  })
  return res
}

/**
 * Make the request.
 * @param {string} url The URL.
 * @param {{ spec: Spec, query: Object.<string, string>}} spec The specification.
 */
const req = async (url, { spec, query = {} } = {}, body) => {
  const q = stringify(query)
  const p = /^https?:\/\//.test(url) ? url : `http://${url}`
  const u = `${p}${q ? `?${q}` : ''}`
  const res = await rqt(u, {
    ...spec,
    data: body,
  }).then(({ 'error': error, ...rest }) => {
    if (error) {
      const e = typeof error == 'string' ? error : error['reason']
      throw new Error(e)
    }
    return rest
  })
  return res
}

/**
 * @typedef {Object} Spec
 * @prop {string} method
 * @prop {number} timeout
 */

module.exports.setupPipeline = setupPipeline
module.exports.listPipelines = listPipelines
module.exports.listTemplates = listTemplates
module.exports.stats = stats
module.exports.deletePipeline = deletePipeline
module.exports.req = req