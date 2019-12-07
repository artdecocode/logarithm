import usually from 'usually'
import { b } from 'erte'
import { argsConfig, argsConfigSnapshot } from './get-args'
import { reduceUsage } from 'argufy'

export default () => {
  const u = usually({
    description: `ElasticSearch utility for creating a pipeline and index templates\nfor logging request using ${b('logarithm', 'green')} middleware.`,
    line: 'logarithm url [-TPS] [-t index -sr] [-p|rp pipeline] [-s3] [-d index]',
    usage: reduceUsage(argsConfig),
  })
  console.log(u)
  const snapshots = usually({
    usage: reduceUsage(argsConfigSnapshot),
  })
  console.log(snapshots)
}