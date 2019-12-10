#!/usr/bin/env node
import { _url, _pipeline, _version, _help, _pipelines,
  _replicas, _shards, _template, _delete, _templates, _stats, _snapshots,
  _bucket, _repositoryS3, _repo, _snapshot, _restore, _status } from './get-args'
import loading from 'indicatrix'
import { c, b } from 'erte'
import usage from './usage'
import { setupPipeline, deletePipeline } from '../lib'
import listPipelines from './commands/list-pipelines'
import { putHitsTemplate, deleteIndex } from './commands/put-index'
import { confirm } from 'reloquent'
import listTemplates from './commands/list-templates'
import stats from './commands/stats'
import SnapshotsClient from './commands/snapshots'

if (_version) {
  const v = require('../../package.json')
  console.log(v)
  process.exit()
} else if (_help) {
  usage()
  process.exit()
}

(async () => {
  try {
    if (!_url) throw new Error('No ElasticSearch URL.')

    if (_pipelines) return await listPipelines(_url)
    if (_pipeline) {
      await loading(
        `Creating a pipeline ${
          c(_pipeline, 'yellow')
        }`,
        setupPipeline(_url, _pipeline),
      )
      console.log('Pipeline %s created.', c(_pipeline, 'green'))
      return
    }
    if (_pipeline && _delete) {
      await loading(
        `Removing ${
          c(_pipeline, 'yellow')
        } pipeline`,
        deletePipeline(_url, _pipeline),
      )
      console.log('Pipeline %s removed.', b(_pipeline, 'red'))
      return
    }
    if (_template) {
      const y = await confirm(`Create template ${c(_template, 'yellow')}-* with ${_shards} shard${_shards > 1 ? 's' : ''} and ${_replicas} replica${_replicas == 0 ||_replicas > 1 ? 's' : ''}`)
      if (!y) return
      return await loading(
        `Creating ${
          c(_template, 'yellow')
        } template`,
        putHitsTemplate(_url, _template, {
          shards: _shards,
          replicas: _replicas,
        }),
      )
    } else if (_template && _delete) {
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
      return
    }

    if (_templates) return await listTemplates(_url)

    // snapshots
    const snapshots = new SnapshotsClient(_url, 5000)
    if (_snapshots && _status) return await snapshots.status()
    if (_repo && _snapshot && _status) return await snapshots.snapshotStatus(_repo, _snapshot)
    if (_repo && _snapshot && _delete) return await snapshots.deleteSnapshot(_repo, _snapshot)
    if (_repo && _snapshot && _restore) return await snapshots.restore(_repo, _snapshot)
    if (_repo && _snapshot) return await snapshots.snapshot(_repo, _snapshot)
    if (_repo && _status) return await snapshots.repoStatus(_repo)
    if (_repo && _delete) return await snapshots.unregisterRepo(_repo)
    if (_repo) return await snapshots.repo(_repo)
    if (_snapshots) return await snapshots.listRepos()
    if (_repositoryS3) return await snapshots.s3(_repositoryS3, _bucket)

    if (_stats) return await stats(_url)
  } catch (err) {
    console.log(process.env['DEBUG'] ? err.stack : b(err.message, 'red'))
  }
})()