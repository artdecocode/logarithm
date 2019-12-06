## API

The package is available by importing its default function and a named function:

```js
import logarithm, { ping } from 'logarithm'
```

%~%

<typedef name="logarithm">types/api.xml</typedef>

<typedef>types/index.xml</typedef>

%EXAMPLE: example, ../src => logarithm%

%~ width="15"%

```### async ping
[
  ["url", "string"],
  ["timeout", "number"]
]
```

Makes sure that `ElasticSearch` is available for connections. Will throw an error after the timeout (default `30000`).

%~%