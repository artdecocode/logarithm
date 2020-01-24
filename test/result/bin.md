## returns templates
-T

/* response */
{
  "usage.template" : {
    "order" : 0,
    "index_patterns" : [
      "usage-neoluddite.dev-*"
    ],
    "settings" : { },
    "mappings" : {
      "properties" : {
        "app" : {
          "type" : "keyword"
        },
        "date" : {
          "type" : "date"
        },
        "billed" : {
          "type" : "keyword"
        }
      }
    },
    "aliases" : { }
  },
  "hits-neoluddite.dev" : {
    "order" : 0,
    "version" : 1,
    "index_patterns" : [
      "neoluddite.dev-*"
    ],
    "settings" : {
      "index" : {
        "number_of_shards" : "1",
        "number_of_replicas" : "0"
      }
    },
    "mappings" : { },
    "aliases" : { }
  },
  "knedv.ru.yearly" : {
    "order" : 0,
    "index_patterns" : [
      "knedv.ru-2019"
    ],
    "settings" : {
      "index" : {
        "number_of_shards" : "2",
        "number_of_replicas" : "0"
      }
    },
    "mappings" : { },
    "aliases" : { }
  }
}
/**/

/* stdout */
Name                 Patterns                Shards  Replicas
usage.template       usage-neoluddite.dev-*  -       -       
hits-neoluddite.dev  neoluddite.dev-*        1       0       
knedv.ru.yearly      knedv.ru-2019           2       0       
/**/