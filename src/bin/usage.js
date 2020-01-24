import usually from 'usually'
import { b, c } from 'erte'
import { argsConfig, argsConfigSnapshot, argsConfigTemplates, argsConfigMethod } from './get-args'
import { reduceUsage } from 'argufy'

export default () => {
  const u = usually({
    description: `ElasticSearch utility for creating a pipeline and index templates\nfor logging request using ${b('logarithm', 'green')} middleware.`,
    line: 'logarithm <url> [-TPS] [-p pipeline] [-d]',
    usage: reduceUsage(argsConfig),
  })
  console.log(u)
  const snapshots = usually({
    description: `${c('Snapshots', 'cyan')}: used to print info, create and restore snapshots.`,
    line: 'logarithm <url> [-r repo] [-s snapshot] [-s3 snapshot --bucket bucket] [--status|-d]',
    usage: reduceUsage(argsConfigSnapshot),
  })
  console.log(snapshots)
  const templates = usually({
    description: `${c('Templates', 'red')}: creates a template for an app.`,
    line: 'logarithm <url> -t {app-name} [-s shards] [-r replicas] [-d]',
    usage: reduceUsage(argsConfigTemplates),
  })
  console.log(templates)
  const methods = usually({
    description: `${c('Methods', 'blue')}: send data from JSON files.`,
    line: 'logarithm <url> [--post data.json] -p path',
    usage: reduceUsage(argsConfigMethod),
  })
  console.log(methods)
}