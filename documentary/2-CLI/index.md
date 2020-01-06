## CLI

_Logarithm_ also provides a CLI tool to be able to install index patterns and a pipeline for the use by the middleware API.

```js
logarithm -h
```

%FORK-Dockerfile src/bin/logarithm -h%

%~ width="15"%

<kbd>📙 [Read Wiki](../../wiki) For More Documentation</kbd>

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

%~ width="15"%

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

%~ width="15"%

### Delete Index, `-d`

When an index (or wildcard indices) need to be deleted, the delete option can be used

```sh
logarithm 192.168.0.1:9200 -d clients-2019.2
```

```fs
Are you sure you want to delete index clients-2019.2 (y/n): [n] y
Successfully deleted index clients-2019.2
```

%~ width="15"%

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

%~ width="15"%

### Add Pipeline, `-p`

Creates a new pipeline with `geoip` and `user_agent` processors.

```sh
logarithm 192.168.0.1:9200 -p info2
```

```fs
Pipeline info2 created.
```

%~ width="15"%

### Remove Pipeline, `--remove-pipeline`

Removes the pipeline with the given name.

```sh
logarithm 192.168.0.1:9200 --remove-pipeline info2
```

```fs
Pipeline info2 removed.
```

%~%