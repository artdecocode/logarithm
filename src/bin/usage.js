import usually from 'usually'

export default () => {
  const u = usually({
    description: 'ElasticSearch utility for creating a pipeline and indexes for logging request using logarithm middleware.',
    line: 'logarithm $ELASTIC -i clients',
    usage: {
      '-i, --index': 'Create an index for storing log data',
      '-h, --help': 'Show the help message',
      '-v, --version': 'Show the version information',
    },
  })
  return u
}