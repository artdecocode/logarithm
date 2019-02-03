import tablature from 'tablature'
import loading from 'indicatrix'
import { stats } from '../../lib'

export default async (url) => {
  const stat = await loading(
    'Fetching stats',
    stats(url),
  )
  const d = Object.keys(stat['indices']).map((key) => {
    const v = stat['indices'][key]
    if (key.startsWith('.')) return
    const total = v['total']
    const mem = total['segments']['memory_in_bytes']
    const docs = total['docs']['count']
    const size = total['store']['size_in_bytes']
    return {
      'name': key,
      'memory': hr(mem),
      'docs': `${docs}`,
      'size': `${hr(size)}`,
    }
  }).filter(Boolean)
  const s = tablature({
    keys: ['name', 'memory', 'docs', 'size'],
    data: d,
    headings: {
      'name': 'Name',
      'memory': 'Memory',
      'docs': 'Docs',
      'size': 'Size',
    },
  })
  console.log(s)
}

const hr = (val) => {
  let order = 0
  let c = val
  while(c > 1023 && order < 3) {
    order += 1
    c = c / 1024
  }
  return `${Math.floor(c * 10)/10} ${orders[order]}`
}
const orders = ['B', 'KB', 'MB', 'GB']