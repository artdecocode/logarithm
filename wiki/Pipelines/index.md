Pipelines are processing plugins that can modify data as it comes in. A number of plugins can be enabled for a pipeline, but _Logarithm_ is recommended to be used with `info` pipeline, that consists of GeoIP processor and User-Agent parser.

## On This Page
%TOC%

%~%

## Pipelines, `-P`

Shows existing pipelines.

```console
user:~$ logarithm es.local:9200 -P
```

<fork>
  src/bin/logarithm neoluddite.dev:9200 -P
</fork>

%~%

## Add Pipeline, `-p`

Creates a new pipeline with `geoip` and `user_agent` processors.

```console
user:~$ logarithm es.local:9200 -p info2
```

<fork>
  src/bin/logarithm neoluddite.dev:9200 -p info2
</fork>

%~%

## Remove Pipeline, `-d`

Removes the pipeline with the given name.

```console
user:~$ logarithm es.local:9200 -p info2 -d
```

<fork>
  <answer regex="Are you sure">y</answer>
  src/bin/logarithm neoluddite.dev:9200 -p info2 -d
</fork>
