#!/usr/bin/env node
import { _url, _pipeline, _version, _help, _pipelines,
  _replicas, _shards, _template, _delete, _templates, _stats, _snapshots,
  _bucket, _repositoryS3, _repo, _snapshot, _restore, _status,
  _post, _path,
  _index } from './get-args'
import loading from 'indicatrix'
import { c, b } from 'erte'
import usage from './usage'
import { setupPipeline, deletePipeline } from '../lib'
import listPipelines from './commands/list-pipelines'
import { putHitsTemplate, deleteIndex, addTemplate } from './commands/put-index'
import { confirm } from 'reloquent'
import listTemplates from './commands/list-templates'
import stats from './commands/stats'
import SnapshotsClient from './commands/snapshots'
import { join, parse } from 'path'
import { parse as parseUrl } from 'url'
import { inspect } from 'util'
import post from './commands/post'

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
    let url = _url
    if (!/:\d+$/.test(url)) url = `${url}:9200`

    if (_post) return await post(url, _post, _path)

    if (_pipelines) return await listPipelines(url)
    if (_pipeline && _delete) {
      const conf = await confirm(`Are you sure you want to delete pipeline ${c(_pipeline, 'yellow')}`, {
        defaultYes: false,
      })
      if (!conf) return
      await loading(
        `Removing ${
          c(_pipeline, 'yellow')
        } pipeline`,
        deletePipeline(url, _pipeline),
      )
      console.log('Pipeline %s removed.', b(_pipeline, 'red'))
      return
    }
    if (_pipeline) {
      await loading(
        `Creating a pipeline ${
          c(_pipeline, 'yellow')
        }`,
        setupPipeline(url, _pipeline),
      )
      console.log('Pipeline %s created.', c(_pipeline, 'green'))
      return
    }
    if (_index && _delete) {
      const conf = await confirm(`Are you sure you want to delete index ${c(_index, 'yellow')}`, {
        defaultYes: false,
      })
      if (!conf) return
      await loading(
        `Deleting ${
          c(_index, 'yellow')
        } index`,
        deleteIndex(url, _index),
      )
      console.log('Successfully deleted index %s', c(_index, 'red'))
      return
    }
    if (_index && _template) {
      const t = require(join(process.cwd(), _template))
      const { name }  = parse(_template)

      const y = await confirm(`Create template ${c(name, 'magenta')} for index ${c(_index, 'yellow')}\n${inspect({
        ...t, 'index_patterns': [_index],
      }, { colors: true, depth: null, breakLength: 20 })}`)
      if (!y) return
      return await loading(
        `Creating template on index ${
          c(_index, 'yellow')}`,
        addTemplate(url, name, _index, t)
      )
    }
    if (_template) {
      const y = await confirm(`Create template ${c(_template, 'yellow')}-* with ${_shards} shard${_shards > 1 ? 's' : ''} and ${_replicas} replica${_replicas == 0 ||_replicas > 1 ? 's' : ''}`)
      if (!y) return
      return await loading(
        `Creating ${
          c(_template, 'yellow')
        } template`,
        putHitsTemplate(url, _template, {
          shards: _shards,
          replicas: _replicas,
        }),
      )
    }

    if (_templates) return await listTemplates(url)

    // snapshots
    const snapshots = new SnapshotsClient(url, 5000)
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

    if (_stats) return await stats(url)
  } catch (err) {
    console.log(process.env['DEBUG'] ? err.stack : b(err.message, 'red'))
  }
})()