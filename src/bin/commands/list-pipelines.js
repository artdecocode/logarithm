import tablature from 'tablature'
import loading from 'indicatrix'
import { listPipelines } from '../../lib'
import { c } from 'erte'

export default async (url) => {
  const pipelines = await loading(
    'Fetching the list of pipelines',
    listPipelines(url),
  )
  const d = Object.keys(pipelines).map((key) => {
    const v = pipelines[key]
    return {
      name: key,
      description: v.description,
      processors: v.processors.map((proc) => {
        return Object.keys(proc).map((k) => {
          return `${c(k, 'magenta')}: ${proc[k].field}`
        }).join(', ')
      }).join('\n'),
    }
  })
  const s = tablature({
    keys: ['name', 'description', 'processors'],
    data: d,
    headings: {
      name: 'Name',
      description: 'Description',
      processors: 'Processors',
    },
  })
  console.log(s)
}