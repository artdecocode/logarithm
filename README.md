# logarithm

[![npm version](https://badge.fury.io/js/logarithm.svg)](https://www.npmjs.com/package/logarithm)

`logarithm` Is A Koa Middleware That Records Logs In _ElasticSearch_. The CLI binary also allows to execute commands on the _ElasticSearch_ instance via the API, such as:

- creating snapshots,
- installing templates,
- _etc_

```sh
yarn add logarithm
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`logarithm(options: !Config): !_goa.Middleware`](#logarithmoptions-config-_goamiddleware)
  * [`Config`](#type-config)
  * [`Hit`](#type-hit)
- [`async ping(url: string, timeout: number): void`](#async-pingurl-stringtimeout-number-void)
- [CLI](#cli)
  * [List Templates, `-T`](#list-templates--t)
  * [Statistics, `-s`](#statistics--s)
- [Copyright & License](#copyright--license)

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

## <code><ins>logarithm</ins>(</code><sub><br/>&nbsp;&nbsp;`options: !Config,`<br/></sub><code>): <i>!_goa.Middleware</i></code>
Creates a middleware for logging requests in _Koa_/_Goa_ web-server and returns it.

 - <kbd><strong>options*</strong></kbd> <em><code><a href="#type-config" title="Options for the program.">!Config</a></code></em>: Options for the middleware.

__<a name="type-config">`Config`</a>__: Options for the program.
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
  <th>Default</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center"><strong>app*</strong></td>
  <td><em>string</em></td>
  <td rowSpan="3">-</td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   The name of the website application.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><strong>url*</strong></td>
  <td><em>string</em></td>
  <td rowSpan="3">-</td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   ElasticSearch endpoint URL, e.g., <code>http://192.168.0.1:9200</code>.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">timeout</td>
  <td><em>number</em></td>
  <td rowSpan="3"><code>5000</code></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Timeout for the connection after which an error is shown.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">pipeline</td>
  <td><em>string</em></td>
  <td rowSpan="3"><code>info</code></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   The pipeline in ElasticSearch, for example to parse GeoIP info and User-Agent.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">index</td>
  <td><em>string</em></td>
  <td rowSpan="3">-</td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   The name of the index. Defaults to the app name if not specified.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">strategy</td>
  <td colSpan="2"><em>(index: string, date: !Date) => string</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td colSpan="2">
   How to construct the index name. By default, monthly strategy is used: <code>${index}-${yyyy}.${mm}</code>.<br/>
   <kbd><strong>index*</strong></kbd> <em><code>string</code></em>: The general name of the index.<br/>
   <kbd><strong>date*</strong></kbd> <em><code>!Date</code></em>: The date of the request.
  </td>
 </tr>
</table>

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

The following data structure is sent to the server:

__<a name="type-hit">`Hit`</a>__: A record sent to ElasticSearch.


|     Name     |       Type       |                    Description                    |
| ------------ | ---------------- | ------------------------------------------------- |
| __app*__     | <em>string</em>  | The application name from the config.             |
| __ip*__      | <em>string</em>  | Client IP address.                                |
| __path*__    | <em>string</em>  | The decoded request path.                         |
| __headers*__ | <em>!Object</em> | The request headers.                              |
| __status*__  | <em>number</em>  | The status code.                                  |
| __date*__    | <em>!Date</em>   | The date of the request.                          |
| __method*__  | <em>string</em>  | The method of the request, e.g., `GET` or `POST`. |

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/2.svg?sanitize=true" width="15">
</a></p>

## <code>async <ins>ping</ins>(</code><sub><br/>&nbsp;&nbsp;`url: string,`<br/>&nbsp;&nbsp;`timeout: number,`<br/></sub><code>): <i>void</i></code>
Check that a connection to the _ElasticSearch_ server can be established. Will throw an error after timeout.

 - <kbd><strong>url*</strong></kbd> <em>`string`</em>: The ElasticSearch URL.
 - <kbd><strong>timeout*</strong></kbd> <em>`number`</em>: The timeout for the request in ms.

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

  logarithm <url> [-TPS] [-p pipeline] [-d]

	url            	The ElasticSearch URL.
	               	If protocol is not given, `http` is assumed.
	--stats, -s    	Display statistics by indices.
	--templates, -T	List all index templates.
	--delete, -d   	Delete an index, snapshot or pipeline.
	               	Used with the relevant flag.
	--index, -i    	Select an index for operations.
	--pipeline, -p 	Create a pipeline with `User-Agent`
	               	and `GeoIp` plugins.
	--pipelines, -P	Display installed pipelines.
	--snapshots, -S	List registered snapshot repositories.
	--help, -h     	Print the help information and exit.
	--version, -v  	Show the version's number and exit.

Snapshots: used to print info, create and restore snapshots.

  logarithm <url> [-r repo] [-s snapshot] [-s3 snapshot --bucket bucket] [--status|-d]

	--repository-s3, -s3	Create a new `s3` snapshot repo with this name.
	--bucket            	The bucket name for the `s3` snapshot repository.
	--repo, -r          	The name of the repo.
	--snapshot, -s      	The name of the snapshot.
	--restore           	Restore this snapshot.
	--status            	Fetch the status.

Templates: creates a template for an app.

  logarithm <url> -t {app-name} [-s shards] [-r replicas] [-d]

	--template, -t	Create an index template for storing
	              	log data in the `{template}-*` index.
	--shards, -s  	The number of shards for index template.
	              	Default: 1.
	--replicas, -r	The number of replicas for index template.

Methods: send data from JSON files.

  logarithm <url> [--post data.json] -p path

	--post    	Send POST request with data from the file.
	--path, -p	The path to send a request to.
```

<kbd>📙 [Read Wiki](../../wiki) For More Documentation</kbd>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/4.svg?sanitize=true" width="15">
</a></p>

### List Templates, `-T`

To see what templates are installed.

```sh
logarithm 192.168.0.1:9200 -T
```

```fs
Name                           Patterns          Shards  Replicas
kibana_index_template:.kibana  .kibana           1
hits-logarithm.page            logarithm.page-*  1       0
hits-clients                   clients-*         1       0
hits-client2                   client2-*         1       0
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/5.svg?sanitize=true" width="15">
</a></p>

### Statistics, `-s`

The stats can be used to monitor created indices.

```sh
logarithm 192.168.0.1:9200 -s
```

```sh
Name                      Memory    Docs  Size
logarithm.page          11.6 KB   1     21.6 KB
logarithm.page-2018.12  60.4 KB   8859  3.3 MB
logarithm.page-2018.11  64.4 KB   116   179.5 KB
logarithm.page-2019.2   151.4 KB  63    279.1 KB
logarithm.page-2019.1   120.7 KB  5747  2.2 MB
```



## Copyright & License

GNU Affero General Public License v3.0

<table>
  <tr>
    <th>
      <a href="https://www.artd.eco">
        <img width="100" src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png"
          alt="Art Deco">
      </a>
    </th>
    <th>© <a href="https://www.artd.eco">Art Deco™</a>   2020</th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>