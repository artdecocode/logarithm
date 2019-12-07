import tablature from 'tablature'
import loading from 'indicatrix'
import { c } from 'erte'
import { confirm } from 'reloquent'
import { snapshots, registerS3, unregisterSnapshotRepo } from '../../lib'

export const unregisterSnapshot = async (url, name) => {
  const y = await confirm(`Are you sure you want to unregister ${c(name, 'yellow')} backup repository`)
  if (!y) return
  const res = await loading(`Unregistering ${c(name, 'yellow')} snapshot repository`, unregisterSnapshotRepo(url, name))
  console.log('Successfully unregistered %s', c(name, 'yellow'))
}

export const s3 = async (url, name, bucket) => {
  if (!bucket) throw new Error('Bucket name is required (use --bucket).')
  const res = await loading(`Registering ${c(name, 'yellow')} snapshot repository`, registerS3(url, name, bucket))
  console.log('Successfully registered %s', c(name, 'yellow'))
}

export default async (url) => {
  const snaps = await loading(
    'Fetching snapshots',
    snapshots(url),
  )
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