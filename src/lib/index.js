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

export const snapshots = async (url) => {
  const u = `${url}/_snapshot`
  const res = await req(u, {
    spec: {
      // method: 'DELETE',
      timeout: 5000,
    },
  })
  return res
}

/**
 * Registers an s3 snapshot repo.
 * @param {string} url ElasticSearch URL.
 * @param {string} name The name of the snapshot.
 * @param {string} bucket The bucket name.
 */
export const registerS3Repo = async (url, name, bucket) => {
  const u = `${url}/_snapshot/${name}`
  const res = await req(u, {
    spec: {
      method: 'PUT',
      timeout: 5000,
    },
  }, {
    'type': 's3',
    'settings': {
      'bucket': bucket,
    },
  })
  return res
}

/**
 * Unregisters a snapshot repo.
 * @param {string} url ElasticSearch URL.
 * @param {string} name The name of the snapshot.
 * @param {string} bucket The bucket name.
 */
export const unregisterSnapshotRepo = async (url, name) => {
  const u = `${url}/_snapshot/${name}`
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
    throw E
  }
  return rest
}
