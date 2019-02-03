#!/usr/bin/env node
import { _url, _pipeline, _version, _help, _listPipelines, _removePipeline, _replicas, _shards, _template, _delete, _listTemplates, _stats } from './get-args'
import loading from 'indicatrix'
import { c, b } from 'erte'
import { version, nextVersion } from '../../package.json'
import usage from './usage'
import { setupPipeline, deletePipeline } from '../lib'
import listPipelines from './commands/list-pipelines'
import { putHitsTemplate, deleteIndex } from './commands/put-index'
import { confirm } from 'reloquent'
import listTemplates from './commands/list-templates'
import stats from './commands/stats'

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
    if (_listPipelines) {
      return await listPipelines(_url)
    } else if (_pipeline) {
      await loading(
        `Creating a pipeline ${
          c(_pipeline, 'yellow')
        }`,
        setupPipeline(_url, _pipeline),
      )
      console.log('Pipeline %s created.', c(_pipeline, 'green'))
    } else if (_removePipeline) {
      await loading(
        `Removing ${
          c(_removePipeline, 'yellow')
        } pipeline`,
        deletePipeline(_url, _removePipeline),
      )
      console.log('Pipeline %s removed.', b(_removePipeline, 'red'))
    } else if (_template) {
      await loading(
        `Creating ${
          c(_template, 'yellow')
        } template`,
        putHitsTemplate(_url, _template, {
          shards: _shards,
          replicas: _replicas,
        }),
      )
    } else if (_delete) {
      const conf = await confirm(`Are you sure you want to delete index ${c(_delete, 'yellow')}`, {
        defaultYes: false,
      })
      if (!conf) return
      await loading(
        `Deleting ${
          c(_delete, 'yellow')
        } index`,
        deleteIndex(_url, _delete),
      )
      console.log('Successfully deleted index %s', c(_delete, 'red'))
    } else if (_listTemplates) {
      return await listTemplates(_url)
    } else if (_stats) {
      return await stats(_url)
    }
  } catch (err) {
    console.log(process.env['DEBUG'] ? err.stack : b(err.message, 'red'))
  }
})()