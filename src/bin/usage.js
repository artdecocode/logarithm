import usually from 'usually'
import { b } from 'erte'

export default () => {
  const u = usually({
    description: `ElasticSearch utility for creating a pipeline and index templates\nfor logging request using ${b('logarithm', 'green')} middleware.`,
    line: 'logarithm $ELASTIC [-TP] [-t index -sr] [-p|rp pipeline] [-d index]',
    usage: {
      '-t, --template name': 'Create an index template for storing\nlog data in name-* index.',
      '-T, --templates': 'List index templates.',
      '-s, --shards': 'Number of shards for index template.\nDefault 1.',
      '-r, --replicas': 'Number of replicas for index template.\nDefault 0.',
      '-d, --delete name': 'Delete an index.',
      '-P, --pipelines': 'Display installed pipelines.',
      '-p, --pipeline name': 'Create a pipeline with User-Agent\nand GeoIp plugins.',
      '-rp name': 'Removes the pipeline.',
      '-h, --help': 'Show the help message.',
      '-v, --version': 'Show the version information.',
    },
  })
  return u
}