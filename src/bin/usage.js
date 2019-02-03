import usually from 'usually'
import { b } from 'erte'

export default () => {
  const u = usually({
    description: `ElasticSearch utility for creating a pipeline and indexes for logging request using ${b('logarithm', 'green')} middleware.`,
    line: 'logarithm $ELASTIC [-i clients] [-P] [-p|rp pipeline]',
    usage: {
      '-i, --index': 'Create an index for storing log data.',
      '-P, --pipelines': 'Display installed pipelines.',
      '-p, --pipeline name': 'Create a pipeline with User-Agent\nand GeoIp plugins.',
      '-rp name': 'Removes the pipeline.',
      '-h, --help': 'Show the help message.',
      '-v, --version': 'Show the version information.',
    },
  })
  return u
}