## Post

Post requests are sent with `--post` flag.

%EXAMPLE: wiki/Methods/post.json%

The example below will merge monthly indices into a yearly one by using the JSON file above.

```sh
logarithm elastic.co -i clients-2019 --post reindex.json -p _reindex
```