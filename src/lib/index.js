import rqt from 'rqt'
import { stringify } from 'querystring'
import erotic from 'erotic'

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
    'description': 'IP Address And UserAgent',
    'processors': [
      { 'geoip': { 'field': 'ip' } },
      { 'user_agent': { 'field': 'headers.user-agent' } },
    ],
  })
}

export const listPipelines = async (url) => {
  const u = `${url}/_ingest/pipeline`
  const res = await req(u, {
    spec: {
      timeout: 5000,
    },
  })
  return res
}
export const listTemplates = async (url) => {
  const u = `${url}/_template`
  const res = await req(u, {
    spec: {
      timeout: 5000,
    },
  })
  return res
}
export const stats = async (url) => {
  const u = `${url}/_stats`
  const res = await req(u, {
    spec: {
      timeout: 10000,
    },
  })
  return res
}

export const deletePipeline = async (url, id) => {
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
 * @param {{ spec: { method: (string|undefined), timeout: (number|undefined) }, query: (!Object<string, string>|undefined)}} [spec] The specification.
 * @param {!Object} [body]
 */
export const req = async (url, { spec, query = {} } = {}, body = undefined) => {
  const er = erotic()
  const q = stringify(query)
  const p = /^https?:\/\//.test(url) ? url : `http://${url}`
  const u = `${p}${q ? `?${q}` : ''}`
  const { 'error': error, ...rest } = await rqt(u, {
    ...spec,
    data: body,
  })
  if (error) {
    const e = typeof error == 'string' ? error : error['reason']
    const E = new Error(e)
    if (error['type']) E.type = error['type']
    throw er(E)
  }
  return rest
}
