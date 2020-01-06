import tablature from 'tablature'
import loading from 'indicatrix'
import { listTemplates } from '../../lib'

export default async (url) => {
  const templates = await loading(
    'Fetching the list of templates',
    listTemplates(url),
  )
  const d = Object.keys(templates).map((key) => {
    const v = templates[key]
    let shards = '-', replicas = '-'
    try {
      shards = v['settings']['index']['number_of_shards']
    } catch (err) {
      //
    }
    try {
      replicas = v['settings']['index']['number_of_replicas']
    } catch (err) {
      //
    }
    return {
      'name': key,
      'patterns': v['index_patterns'].join('\n'),
      'shards': shards,
      'replicas': replicas,
    }
  })
  const s = tablature({
    keys: ['name', 'patterns', 'shards', 'replicas'],
    data: d,
    headings: {
      'name': 'Name',
      'patterns': 'Patterns',
      'shards': 'Shards',
      'replicas': 'Replicas',
    },
  })
  console.log(s)
}