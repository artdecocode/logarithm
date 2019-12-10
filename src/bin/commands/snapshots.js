import tablature from 'tablature'
import loading from 'indicatrix'
import { c } from 'erte'
import { confirm } from 'reloquent'
import { req } from '../../lib'
import { inspect } from 'util'

export const snapshotStatus = async (url, repo, name) => {
  // try {

  // } catch (err) {
  //   if (err.type != 'snapshot_missing_exception') throw err
  //   console.log('Snapshot %s does not exist.', n)
  //   const y = await confirm('Create snapshot')
  //   if (!y) throw err
  //   const { 'snapshot': snapshot } = await loading('Creating snapshot', req(`${url}/_snapshot/${repo}/${name}`, {
  //     spec: {
  //       method: 'PUT',
  //       timeout: 5000,
  //     },
  //     query: {
  //       'wait_for_completion': true,
  //     },
  //   }))
  //   console.log(inspect(snapshot, { colors: true }))
  // }
}

export default class Client {
  /**
   * @param {string} url ElasticSearch URL.
   */
  constructor(url, timeout = 15000) {
    this.url = url
    this.timeout = timeout
  }
  /**
   * Registers an s3 snapshot repo.
   * @param {string} name The name of the snapshot.
   * @param {string} bucket The bucket name.
   */
  async s3(name, bucket) {
    if (!bucket) throw new Error('Bucket name is required (use --bucket).')
    const n = c(name, 'yellow')
    const u = `_snapshot/${name}`
    const p = this.put(u, {}, {
      'type': 's3',
      'settings': {
        'bucket': bucket,
      },
    })
    const res = await loading(`Registering ${n} snapshot repository`, p)
    console.log('Successfully registered %s', n)

    return res
  }
  async unregisterRepo(repo) {
    const n = c(repo, 'yellow')
    const y = await confirm(`Are you sure you want to unregister ${n} backup repository`)
    if (!y) return
    const p = this.delete(`_snapshot/${repo}`)
    await loading(`Unregistering ${n} snapshot repository`, p)
    console.log('Successfully unregistered %s', c(repo, 'yellow'))
  }
  async snapshotStatus(repo, name) {
    const n = this.fullName(repo, name)
    const p = this.req(`_snapshot/${repo}/${name}/_status`)
    const { 'snapshots': _snapshots } = await loading(`Getting ${n} snapshot status`, p)
    console.log(inspect(_snapshots, { colors: true, depth: Infinity }))
  }
  async listRepos() {
    const snaps = await loading(
      'Fetching snapshot repositories',
      this.req('_snapshot'),
    )
    printRepos(snaps)
  }
  async deleteSnapshot(repo, name) {
    const n = this.fullName(repo, name)
    const y = await confirm(`Are you sure you want to delete ${n} snapshot`)
    if (!y) return
    const { acknowledged } = await loading(`Deleting ${n} snapshot`, this.delete(`_snapshot/${repo}/${name}`))
    if (acknowledged)
      console.log('Successfully deleted %s', n)
    else throw new Error('not acknowledged')
    // console.log(res)
  }
  async delete(endpoint, spec = {}, query, data) {
    return await this.req(endpoint, { ...spec, method: 'DELETE' }, query, data)
  }
  async put(endpoint, query, data, spec = {}) {
    return await this.req(endpoint, { ...spec, method: 'PUT' }, query, data)
  }
  async req(endpoint, spec = {}, query, data) {
    return await req(`${this.url}/${endpoint}`, {
      spec: {
        timeout: this.timeout,
        ...spec,
      },
      query,
    }, data)
  }
  async repoStatus(repo) {
    const n = c(repo, 'yellow')
    const p = this.req(`_snapshot/${repo}/_status`)
    const res = await loading(`Getting ${n} repository status`, p)
    console.log(res)
  }
  async status() {
    const p = this.req('_snapshot/_status')
    const res = await loading('Getting snapshots status', p)
    console.log(res)
  }
  async repo(repo) {
    const n = c(repo, 'yellow')
    const p = this.req(`_snapshot/${repo}`)
    const res = await loading(`Getting ${n} repository info`, p)
    printRepos(res)

    const p1 = this.req(`_snapshot/${repo}/_all`)
    const { 'snapshots': _snapshots } = await loading(`Getting ${n} repository snapshots`, p1)
    console.log()
    printSnapshots(_snapshots)
    // console.log('Successfully unregistered %s', c(name, 'yellow'))
  }
  async restore(repo, name) {
    const n = this.fullName(repo, name)
    const y = await confirm(`Are you sure you want to restore ${n} snapshot`)
    if (!y) return
    const p = this.req(`_snapshot/${repo}/${name}/_restore`, {
      method: 'POST',
      timeout: null,
    }, { 'wait_for_completion': true })
    const res = await loading(`Restoring ${n} snapshot`, p)
    console.log(res)
  }
  async snapshot(repo, name) {
    const n = this.fullName(repo, name)
    const y = await confirm(`Continue with ${n} snapshot`)
    if (!y) return
    const { 'snapshot': snapshot } = await loading(`Creating snapshot ${n}`, this.put(`_snapshot/${repo}/${name}`, { 'wait_for_completion': true }, null, {
      timeout: null,
    }))
    printSnapshots([snapshot])
  }
  fullName(repo, name) {
    const n = c(repo, 'yellow') + c('/', 'magenta') + c(name, 'yellow')
    return n
  }
}

const printRepos = (snaps) => {
  if (!Object.keys(snaps).length) return console.log('No registered snapshot repositories.')

  const d = Object.entries(snaps).map(([key, { 'type': type, 'settings': settings }]) => {
    const sets = Object.entries(settings).map(([k, v]) => {
      return `${c(k, 'green')}: ${v}`
    }).join('\n')
    return { 'key': key, 'type': type, 'settings': sets }
  })
  const s = tablature({
    keys: ['key', 'type', 'settings'],
    data: d,
    headings: {
      'key': 'Name',
      'type': 'Type',
      'settings': 'Settings',
    },
  })
  console.log(s)
}

const printSnapshots = (data) => {
  const s = tablature({
    keys: ['snapshot', 'version', 'start_time', 'end_time', 'indices'],
    data: data.map((d) => {
      d['indices'] = d['indices'].join('\n')
      d['start_time'] = new Date(d['start_time']).toLocaleString()
      d['end_time'] = new Date(d['end_time']).toLocaleString()
      return d
    }),
    headings: {
      'snapshot': 'Snapshot',
      'version': 'Version',
      'start_time': 'Start Time',
      'start_end': 'End Time',
      'indices': 'Indices',
    },
  })
  console.log(s)
}