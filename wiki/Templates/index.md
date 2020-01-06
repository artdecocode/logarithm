Templates are used to assign the structure of created indexes based on the index pattern. They are useful, when indices are created according to date, such as `client.logs-12.20` for December of 2020.

For creating a template from a JSON file, see [Indices](Indices#assign-template) section.

## On This Page

%TOC%

%~%

## Create Template, `-t`

If an index for a particular client, e.g., `client` needs to be created and logs recorded in indices like `client-2019.2`, the template with a number of shards and replicas can be installed depending on the volume of data that the server is going to be receiving. This means that the default of 10 shards and 5 replicas might not be required for a small-volume website, so that a template with just 1 shard and no replicas can be created.

```sh
logarithm 192.168.0.1:9200 -t client [-s 1 -r 0]
```

```fs
Created hits-client2 template
for     client2-* indices with 1 shards and 0 replicas
```