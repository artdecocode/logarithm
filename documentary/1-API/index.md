## API

The package is available by importing its default function and a named function:

```js
import logarithm, { ping } from 'logarithm'
```

%~%

```### logarithm => Middleware
[
  ["config", "Config"]
]
```

Sets up the middleware to be used in `Koa` web-server and returns it.

%TYPEDEF types/index.xml%

%EXAMPLE: example/example.js, ../src => logarithm%

%~ width="15"%

```### async ping
[
  ["url", "string"],
  ["timeout", "number"]
]
```

Makes sure that `ElasticSearch` is available for connections. Will throw an error after the timeout (default `30000`).

%~%