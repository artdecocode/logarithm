import usually from 'usually'
import { b } from 'erte'

export default () => {
  const u = usually({
    description: `ElasticSearch utility for creating a pipeline and index templates\nfor logging request using ${b('logarithm', 'green')} middleware.`,
    line: 'logarithm $ELASTIC [-TPS] [-t index -sr] [-p|rp pipeline] [-d index]',
    usage: {
      '-t, --template name': 'Create an index template for storing\nlog data in name-* index.',
      ' -s, --shards': 'Number of shards for index template.\nDefault 1.',
      ' -r, --replicas': 'Number of replicas for index template.\nDefault 0.',
      '-T, --templates': 'List index templates.',
      '-S, --stats': 'Display statistics by indices.',
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