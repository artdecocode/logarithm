Indices are "databases" in _ElasticSearch_ that store data for a particular period. Each index will have a number of shards and replicas, while each shard will consume more memory. Therefore, for smaller indices (<1m records), 1 shard with 0 replicas are enough.

Logarithm supports some operations on indices.

%TOC%

%~%

## Delete

An index (or wildcard indices) can be deleted using the `-i {index-pattern-*} -d` command:

```console
user:~$ logarithm es.local:9200 -i clients-2019.2 -d
user:~$ logarithm es.local:9200 -i clients-* -d
```

```fs
Are you sure you want to delete index clients-2019.2 (y/n): [n] y
Successfully deleted index clients-2019.2
```

%~ width="15"%

## Assign Template

A template can be created for an index pattern from a JSON file, e.g., `-i {index-pattern-*} -t index.template.json`. The structure will be read from this file, that can be the following:

```json
{
  "mappings": {
    "properties": {
      "billed": { "type": "keyword" },
      "date": { "type": "date" }
    }
  }
}
```

The name of the template will be deducted from the filename, e.g., `usage.template.json` -> `usage.template`, and the index pattern will be set to the value of the `-i` argument.