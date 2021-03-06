import { c as co } from 'erte'
import { req } from '../../lib'

const makeProps = (pp) => {
  const res = Object.keys(pp).reduce((acc, k) => {
    const type = pp[k]
    acc[k] = { 'type': type }
    return acc
  }, {})
  return res
}

export const makeKind = (pp) => {
  const properties = makeProps(pp)
  return { 'properties': properties }
}

// const HIT = { 'ip': 'ip', 'date': 'date' }

export const addTemplate = async (url, name, index, body) => {
  const u = `${url}/_template/${name}`
  const res = await req(u, {
    spec: {
      method: 'PUT',
      timeout: 5000,
    },
  }, {
    ...body,
    'index_patterns': [index],
  })
  return res
}

export const putHitsTemplate = async (url, appName, {
  shards = 1, replicas = 0,
}) => {
  const patterns = `${appName}-*`
  const name = `hits-${appName}`
  // const hit = makeKind(HIT)
  const body = {
    'settings': {
      'number_of_shards': shards,
      'number_of_replicas': replicas,
    },
    'version': 1,
    // 'mappings': { 'hit': hit },
    'index_patterns': [patterns],
  }
  const u = `${url}/_template/${name}`
  const res = await req(u, {
    spec: {
      method: 'PUT',
      timeout: 5000,
    },
  }, body)
  setTimeout(() => {
    console.log('Created %s%s', co(name, 'green'), ' template')
    console.log('%s%s indices with %s shard%s and %s replica%s', 'for     ', co(patterns, 'grey'), shards, shards > 1 ? 's' : '', replicas,replicas == 0 || replicas > 1 ? 's' : '')
  }, 1)

  return res
}

/**
 * @param {string} url
 * @param {string} index
 */
export const deleteIndex = async (url, index) => {
  const u = `${url}/${index}`
  const res = await req(u, {
    spec: {
      method: 'DELETE',
      timeout: 5000,
    },
  })
  return res
}