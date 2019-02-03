#!/usr/bin/env node
import { _url, _pipeline, _version, _help } from './get-args'
import loading from 'indicatrix'
import { c, b } from 'erte'
import { version, nextVersion } from '../../package.json'
import usage from './usage'
import { setupPipeline } from '../lib'

if (_version) {
  const v = nextVersion ? nextVersion : version
  console.log(v)
  process.exit()
} else if (_help) {
  const u = usage()
  console.log(u)
  process.exit()
}

(async () => {
  try {
    if (!_url) {
      throw new Error('No ElasticSearch URL.')
    }
    if (_pipeline) {
      await loading(
        `Creating a pipeline ${
          c(_pipeline, 'yellow')
        }`,
        setupPipeline(_url, _pipeline),
      )
      console.log('Pipeline %s created.', c(_pipeline, 'green'))
    }
  } catch (err) {
    console.log(process.env['DEBUG'] ? err.stack : b(err.message, 'red'))
  }
})()