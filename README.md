# logarithm

[![npm version](https://badge.fury.io/js/logarithm.svg)](https://www.npmjs.com/package/logarithm)

`logarithm` Is A Koa Middleware That Records Logs In _ElasticSearch_.

```sh
yarn add -E logarithm
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`logarithm(options: Config): void`](#logarithmoptions-config-void)
  * [`Config`](#type-config)
  * [`async ping(url: string, timeout: number)`](#async-pingurl-stringtimeout-number-void)
- [CLI](#cli)
  * [Create Template, `-t`](#create-template--t)
  * [List Templates, `-T`](#list-templates--t)
  * [Statistics, `-S`](#statistics--s)
  * [Delete Index, `-d`](#delete-index--d)
  * [Pipelines, `-P`](#pipelines--p)
  * [Add Pipeline, `-p`](#add-pipeline--p)
  * [Remove Pipeline, `--remove-pipeline`](#remove-pipeline---remove-pipeline)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/0.svg?sanitize=true">
</a></p>

## API

The package is available by importing its default function and a named function:

```js
import logarithm, { ping } from 'logarithm'
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/1.svg?sanitize=true">
</a></p>

## <code><ins>logarithm</ins>(</code><sub><br/>&nbsp;&nbsp;`options: Config,`<br/></sub><code>): <i>void</i></code>
Creates a middleware for logging requests in _Koa_/_Goa_ web-server and returns it.

 - <kbd><strong>options*</strong></kbd> <em><code><a href="#type-config" title="Options for the program.">Config</a></code></em>: Options for the middleware.

__<a name="type-config">`Config`</a>__: Options for the program.


|   Name   |        Type        |                                               Description                                                |  Default  |
| -------- | ------------------ | -------------------------------------------------------------------------------------------------------- | --------- |
| __app*__ | <em>string</em>    | The name of the website application.                                                                     | -         |
| __url*__ | <em>string</em>    | ElasticSearch endpoint URL, e.g., `http://192.168.0.1:9200`.                                             | -         |
| timeout  | <em>number</em>    | Timeout for the connection after which an error is shown.                                                | `5000`    |
| type     | <em>string</em>    | The type of the document.                                                                                | `hit`     |
| pipeline | <em>string</em>    | The pipeline in ElasticSearch, for example to parse GeoIP info and User-Agent.                           | `info`    |
| index    | <em>string</em>    | The name of the index. Defaults to the app name if not specified as well as monthly strategy.            | -         |
| strategy | <em>'monthly'</em> | How to construct the index name. E.g., the monthly strategy will result in `${index}-${y}.${m}` indexes. | `monthly` |

```js
/* yarn example/ */
import core from '@idio/idio'
import logarithm, { ping } from 'logarithm'

(async () => {
  await ping(process.env.ELASTIC)

  // setup for idio web-server
  const { url, app } = await core()

  app.use(logarithm({
    app: 'idio.cc',
    url: process.env.ELASTIC,
    index: 'clients',
  }))
  app.use(async (ctx) => {
    ctx.body = 'hello world'
  })
  console.log(url)
})()
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/2.svg?sanitize=true" width="15">
</a></p>

### <code>async <ins>ping</ins>(</code><sub><br/>&nbsp;&nbsp;`url: string,`<br/>&nbsp;&nbsp;`timeout: number,`<br/></sub><code>): <i>void</i></code>

Makes sure that `ElasticSearch` is available for connections. Will throw an error after the timeout (default `30000`).

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/3.svg?sanitize=true">
</a></p>

## CLI

_Logarithm_ also provides a CLI tool to be able to install index patterns and a pipeline for the use by the middleware API.

```js
logarithm -h
```

```Dockerfile
ElasticSearch utility for creating a pipeline and index templates
for logging request using logarithm middleware.

  logarithm $ELASTIC [-TPS] [-t index -sr] [-p|rp pipeline] [-d index]

	-t, --template name	Create an index template for storing
	                   	log data in name-* index.
	 -s, --shards      	Number of shards for index template.
	                   	Default 1.
	 -r, --replicas    	Number of replicas for index template.
	                   	Default 0.
	-T, --templates    	List index templates.
	-S, --stats        	Display statistics by indices.
	-d, --delete name  	Delete an index.
	-P, --pipelines    	Display installed pipelines.
	-p, --pipeline name	Create a pipeline with User-Agent
	                   	and GeoIp plugins.
	--remove-pipeline  	Removes the pipeline.
	-h, --help         	Show the help message.
	-v, --version      	Show the version information.
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/4.svg?sanitize=true" width="15">
</a></p>

### Create Template, `-t`

If an index for a particular client, e.g., `client` needs to be created and logs recorded in indices like `client-2019.2`, the template with a number of shards and replicas can be installed depending on the volume of data that the server is going to be receiving. This means that the default of 10 shards and 5 replicas might not be required for a small-volume website, so that a template with just 1 shard and no replicas can be created.

```sh
logarithm 192.168.0.1:9200 -t client [-s 1 -r 0]
```

```fs
Created hits-client2 template
for     client2-* indices with 1 shards and 0 replicas
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/5.svg?sanitize=true" width="15">
</a></p>

### List Templates, `-T`

To see what templates are installed.

```sh
logarithm 192.168.0.1:9200 -T
```

```fs
Name                           Patterns            Shards  Replicas
kibana_index_template:.kibana  .kibana             1
hits-technation.sucks          technation.sucks-*  1       0
hits-clients                   clients-*           1       0
hits-client2                   client2-*           1       0
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/6.svg?sanitize=true" width="15">
</a></p>

### Statistics, `-S`

The stats can be used to monitor created indices.

```sh
logarithm 192.168.0.1:9200 -S
```

```sh
Name                      Memory    Docs  Size
technation.sucks          11.6 KB   1     21.6 KB
technation.sucks-2018.12  60.4 KB   8859  3.3 MB
technation.sucks-2018.11  64.4 KB   116   179.5 KB
technation.sucks-2019.2   151.4 KB  63    279.1 KB
technation.sucks-2019.1   120.7 KB  5747  2.2 MB
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/7.svg?sanitize=true" width="15">
</a></p>

### Delete Index, `-d`

When an index (or wildcard indices) need to be deleted, the delete option can be used

```sh
logarithm 192.168.0.1:9200 -d clients-2019.2
```

```fs
Are you sure you want to delete index clients-2019.2 (y/n): [n] y
Successfully deleted index clients-2019.2
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/8.svg?sanitize=true" width="15">
</a></p>

### Pipelines, `-P`

Shows existing pipelines.

```sh
logarithm 192.168.0.1:9200 -P
```

```fs
Name  Description               Processors
info  IP Address And UserAgent  geoip: ip
                                user_agent: headers.user-agent
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/9.svg?sanitize=true" width="15">
</a></p>

### Add Pipeline, `-p`

Creates a new pipeline with `geoip` and `user_agent` processors.

```sh
logarithm 192.168.0.1:9200 -p info2
```

```fs
Pipeline info2 created.
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/10.svg?sanitize=true" width="15">
</a></p>

### Remove Pipeline, `--remove-pipeline`

Removes the pipeline with the given name.

```sh
logarithm 192.168.0.1:9200 --remove-pipeline info2
```

```fs
Pipeline info2 removed.
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/11.svg?sanitize=true">
</a></p>

## Copyright

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img width="100" src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png"
          alt="Art Deco">
      </a>
    </th>
    <th>© <a href="https://artd.eco">Art Deco</a>   2019</th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img width="100" src="https://raw.githubusercontent.com/idiocc/cookies/master/wiki/arch4.jpg"
          alt="Tech Nation Visa">
      </a>
    </th>
    <th><a href="https://www.technation.sucks">Tech Nation Visa Sucks</a></th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>