import tablature from 'tablature'
import loading from 'indicatrix'
import { c } from 'erte'
import { confirm } from 'reloquent'
import { snapshots, unregisterSnapshotRepo, req, registerS3Repo } from '../../lib'
import { inspect } from 'util'

export const snapshotStatus = async (url, repo, name) => {
  const n = c(`${repo}/${name}`, 'yellow')
  const p = req(`${url}/_snapshot/${repo}/${name}/_status`, {
    spec: {
      timeout: 5000,
    },
  })
  try {
    const { 'snapshots': _snapshots } = await loading(`Getting ${n} snapshot status`, p)
    console.log(inspect(_snapshots, { colors: true, depth: Infinity }))
  } catch (err) {
    if (err.type != 'snapshot_missing_exception') throw err
    console.log('Snapshot %s does not exist.', n)
    const y = await confirm('Create snapshot')
    if (!y) throw err
    const { 'snapshot': snapshot } = await loading('Creating snapshot', req(`${url}/_snapshot/${repo}/${name}`, {
      spec: {
        method: 'PUT',
        timeout: 5000,
      },
      query: {
        'wait_for_completion': true,
      },
    }))
    console.log(inspect(snapshot, { colors: true }))
  }
}

export const unregisterRepo = async (url, name) => {
  const y = await confirm(`Are you sure you want to unregister ${c(name, 'yellow')} backup repository`)
  if (!y) return
  const res = await loading(`Unregistering ${c(name, 'yellow')} snapshot repository`, unregisterSnapshotRepo(url, name))
  console.log('Successfully unregistered %s', c(name, 'yellow'))
}

export default class Client {
  constructor(url, timeout = 5000) {
    this.url = url
    this.timeout = timeout
  }
  async listRepos() {
    const snaps = await loading(
      'Fetching snapshot repositories',
      snapshots(this.url),
    )
    printRepos(snaps)
  }
  async deleteSnapshot(repo, name) {
    const n = c(repo, 'yellow') + '/' + c(name, 'yellow')
    const y = await confirm(`Are you sure you want to delete ${n} snapshot`)
    if (!y) return
    const res = await loading(`Deleting ${n} snapshot`, this.req(`_snapshot/${repo}/${name}`, {
      method: 'DELETE',
    }))
    console.log(res)
    // console.log('Successfully deleted %s', c(name, 'yellow'))
  }
  async req(endpoint, spec = {}, query, data) {
    return await req(`${this.url}/${endpoint}`, {
      spec: {
        ...spec,
        timeout: this.timeout,
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
    const { snapshots: _snapshots } = await loading(`Getting ${n} repository snapshots`, p1)
    console.log()
    printSnapshots(_snapshots)
    // console.log('Successfully unregistered %s', c(name, 'yellow'))
  }
  async restore(repo, name) {
    const n = c(repo, 'yellow')
    const y = await confirm(`Are you sure you want to restore ${n} snapshot`)
    if (!y) return
    const p = this.req(`_snapshot/${repo}/${name}/_restore`, {
      method: 'POST',
    }, { 'wait_for_completion': true })
    const res = await loading(`Restoring ${n} snapshot`, p)
    console.log(res)
  }
  async snapshot(repo, name) {
    const n = c(repo, 'yellow') + c('/', 'magenta') + c(name, 'yellow')
    const y = await confirm(`Continue with ${n} snapshot`)
    if (!y) return
    const { 'snapshot': snapshot } = await loading(`Creating snapshot ${n}`, this.req(`_snapshot/${repo}/${name}`, {
      method: 'PUT',
    },
    {
      'wait_for_completion': true,
    }))
    printSnapshots(snapshot)
  }
}

export const s3 = async (url, name, bucket) => {
  if (!bucket) throw new Error('Bucket name is required (use --bucket).')
  const res = await loading(`Registering ${c(name, 'yellow')} snapshot repository`, registerS3Repo(url, name, bucket))
  console.log('Successfully registered %s', c(name, 'yellow'))
}

const printRepos = (snaps) => {
  if (!Object.keys(snaps).length) return console.log('No registered snapshot repositories.')

  const d = Object.entries(snaps).map(([key, { type, settings }]) => {
    const sets = Object.entries(settings).map(([k, v]) => {
      return `${c(k, 'green')}: ${v}`
    }).join('\n')
    return { key, type, settings: sets }
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
      d.indices = d.indices.join('\n')
      d.start_time = new Date(d.start_time).toLocaleString()
      d.end_time = new Date(d.end_time).toLocaleString()
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