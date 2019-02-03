import rqt from 'rqt'
import { stringify } from 'querystring'

/**
 * Sets up the info pipeline for parsing of user-agent and extracting GEOIP info from IP address.
 * @param {string} url The ElasticSearch URL.
 */
export const setupPipeline = async (url, id) => {
  const u = `${url}/_ingest/pipeline/${id}`
  await req(u, {
    spec: {
      method: 'PUT',
      timeout: 5000,
    },
  }, {
    description: 'IP Address And UserAgent',
    processors: [
      { geoip: { field: 'ip' } },
      { user_agent: { field: 'headers.user-agent' } },
    ],
  })
}

/**
 * Make the request.
 * @param {string} url The URL.
 * @param {{ spec: Spec, query: Object.<string, string>}} spec The specification.
 */
export const req = async (url, { spec, query = {} } = {}, body) => {
  const q = stringify(query)
  const p = /^https?:\/\//.test(url) ? url : `http://${url}`
  const u = `${p}${q ? `?${q}` : ''}`
  await rqt(u, {
    ...spec,
    data: body,
  }).then(({ error, ...rest }) => {
    if (error) {
      const e = typeof error == 'string' ? error : error.reason
      throw new Error(e)
    }
    return rest
  })
}

/**
 * @typedef {Object} Spec
 * @prop {string} method
 * @prop {number} timeout
 */