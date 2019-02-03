# logarithm

[![npm version](https://badge.fury.io/js/logarithm.svg)](https://npmjs.org/package/logarithm)

`logarithm` Is A Koa Middleware That Records Logs In _ElasticSearch_.

```sh
yarn add -E logarithm
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
  * [`logarithm(config: Config): Middleware`](#logarithmconfig-config-middleware)
    * [`Config`](#type-config)
  * [`async ping(url: string, timeout: number)`](#async-pingurl-stringtimeout-number-void)
- [CLI](#cli)
- [Copyright](#copyright)

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/0.svg?sanitize=true"></a></p>

## API

The package is available by importing its default function and a named function:

```js
import logarithm, { ping } from 'logarithm'
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/1.svg?sanitize=true"></a></p>

### `logarithm(`<br/>&nbsp;&nbsp;`config: Config,`<br/>`): Middleware`

Sets up the middleware to be used in `Koa` web-server and returns it.

__<a name="type-config">`Config`</a>__: Options for the program.

|   Name   |     Type      |                                               Description                                                |  Default  |
| -------- | ------------- | -------------------------------------------------------------------------------------------------------- | --------- |
| __app*__ | _string_      | The name of the website application.                                                                     | -         |
| __url*__ | _string_      | ElasticSearch endpoint URL, e.g., `http://192.168.0.1:9200`.                                             | -         |
| timeout  | _number_      | Timeout for the connection after which an error is shown.                                                | `5000`    |
| type     | _string_      | The type of the document.                                                                                | `hit`     |
| pipeline | _string_      | The pipeline in ElasticSearch, for example to parse GeoIP info and User-Agent.                           | `info`    |
| index    | _string_      | The name of the index. Defaults to the app name if not specified as well as monthly strategy.            | -         |
| strategy | _('monthly')_ | How to construct the index name. E.g., the monthly strategy will result in `${index}-${y}.${m}` indexes. | `monthly` |

```js
/* yarn example/ */
import core from '@idio/core'
import logarithm, { ping } from 'logarithm'

(async () => {
  await ping(process.env.ELASTIC)

  const { url } = await core({
    logarithm: {
      middlewareConstructor(app, config) {
        const mw = logarithm(config)
        return mw
      },
      config: {
        url: process.env.ELASTIC,
        app: 'idio.cc',
        index: 'clients',
      },
      use: true,
    },
    async index(ctx) {
      ctx.body = 'hello world'
    },
  })
  console.log(url)
})()
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/2.svg?sanitize=true" width="15"></a></p>

### `async ping(`<br/>&nbsp;&nbsp;`url: string,`<br/>&nbsp;&nbsp;`timeout: number,`<br/>`): void`

Makes sure that `ElasticSearch` is available for connections. Will throw an error after the timeout (default `30000`).

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/3.svg?sanitize=true"></a></p>

## CLI

_Logarithm_ also provides a CLI tool to be able to install index patterns and a pipeline for the use by the middleware API.

```js
logarithm -h
```

```fs
ElasticSearch utility for creating a pipeline and index templates
for logging request using [42mlogarithm[0m middleware.

  logarithm $ELASTIC [-TP] [-t index -sr] [-p|rp pipeline] [-d index]

  	-t, --template name	Create an index template for storing
	                   	log data in name-* index.
	-T, --templates    	List index templates.
	-s, --shards       	Number of shards for index template.
	                   	Default 1.
	-r, --replicas     	Number of replicas for index template.
	                   	Default 0.
	-d, --delete name  	Delete an index.
	-P, --pipelines    	Display installed pipelines.
	-p, --pipeline name	Create a pipeline with User-Agent
	                   	and GeoIp plugins.
	-rp name           	Removes the pipeline.
	-h, --help         	Show the help message.
	-v, --version      	Show the version information.
```

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/4.svg?sanitize=true"></a></p>

## Copyright

<table>
  <tr>
    <th>
      <a href="https://artd.eco">
        <img src="https://raw.githubusercontent.com/wrote/wrote/master/images/artdeco.png" alt="Art Deco" />
      </a>
    </th>
    <th>
      © <a href="https://artd.eco">Art Deco</a>  
      2019
    </th>
    <th>
      <a href="https://www.technation.sucks" title="Tech Nation Visa">
        <img src="https://raw.githubusercontent.com/artdecoweb/www.technation.sucks/master/anim.gif" alt="Tech Nation Visa" />
      </a>
    </th>
    <th>
      <a href="https://www.technation.sucks">Tech Nation Visa Sucks</a>
    </th>
  </tr>
</table>

<p align="center"><a href="#table-of-contents"><img src=".documentary/section-breaks/-1.svg?sanitize=true"></a></p>