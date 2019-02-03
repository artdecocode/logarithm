#!/usr/bin/env node
const querystring = require('querystring');
const https = require('https');
const http = require('http');
const util = require('util');
const url = require('url');
const os = require('os');
const zlib = require('zlib');
const stream = require('stream');
const readline = require('readline');
'use strict';
const {request:m} = https;
const {request:p} = http;
const {debuglog:aa} = util;
const r = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : Number.Infinity);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, w = (a) => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:x} = os;
const y = /\s+at.*(?:\(|\s)(.*)\)?/, ba = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, ca = x(), da = (a) => {
  const {w:b = !1, v:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(ba.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter((a) => {
    a = a.match(y);
    if (null === a || !a[1]) {
      return !0;
    }
    a = a[1];
    return a.includes(".app/Contents/Resources/electron.asar") || a.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(a);
  }).filter((a) => "" !== a.trim()).map((a) => b ? a.replace(y, (a, b) => a.replace(b, b.replace(ca, "~"))) : a).join("\n");
};
function ea(a, b, c = !1) {
  return function(d) {
    var e = w(arguments), {stack:f} = Error();
    const g = r(f, 2, !0), h = (f = d instanceof Error) ? d.message : d;
    e = [`Error: ${h}`, ...null !== e && a === e || c ? [b] : [g, b]].join("\n");
    e = da(e);
    return Object.assign(f ? d : Error(), {message:h, stack:e});
  };
}
;function B(a) {
  var {stack:b} = Error();
  const c = w(arguments);
  b = r(b, 2 + (a ? 1 : 0));
  return ea(c, b, a);
}
;const {parse:fa} = url;
const {Writable:ha} = stream;
const C = /\s+at.*(?:\(|\s)(.*)\)?/, ia = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, ja = x(), ka = (a) => {
  const {w:b = !1, v:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(ia.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter((a) => {
    a = a.match(C);
    if (null === a || !a[1]) {
      return !0;
    }
    a = a[1];
    return a.includes(".app/Contents/Resources/electron.asar") || a.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(a);
  }).filter((a) => "" !== a.trim()).map((a) => b ? a.replace(C, (a, b) => a.replace(b, b.replace(ja, "~"))) : a).join("\n");
};
const la = (a, b) => {
  b.once("error", (b) => {
    a.emit("error", b);
  });
  return b;
};
class ma extends ha {
  constructor(a) {
    a = void 0 === a ? {} : a;
    var b = Object.assign({}, a);
    void 0 === a.g && B(!0);
    a = (delete b.g, delete b.R, b);
    super(a);
    const {b:c, D:d} = a;
    this.h = [];
    this.s = new Promise((a, b) => {
      this.on("finish", () => {
        let b;
        c ? b = Buffer.concat(this.h) : b = this.h.join("");
        a(b);
        this.h = [];
      });
      this.once("error", (a) => {
        if (-1 != a.stack.indexOf("\n")) {
          const b = ka(a.stack);
          a.stack = b;
        }
        b(a);
      });
      d && la(this, d).pipe(this);
    });
  }
  _write(a, b, c) {
    this.h.push(a);
    c();
  }
  get j() {
    return this.s;
  }
}
const na = async(a, b) => {
  b = void 0 === b ? {} : b;
  ({j:a} = new ma(Object.assign({}, {D:a}, b, {g:B(!0)})));
  return await a;
};
const {createGunzip:oa} = zlib;
const ra = (a, b, c) => {
  c = void 0 === c ? {} : c;
  const {l:d, b:e, g:f = B(!0)} = c;
  let g, h, k, l, q = 0, t = 0;
  c = (new Promise((c, z) => {
    g = a(b, async(a) => {
      ({headers:h} = a);
      const {statusMessage:b, statusCode:f} = a;
      k = {statusMessage:b, statusCode:f};
      if (d) {
        a.destroy();
      } else {
        var g = "gzip" == a.headers["content-encoding"];
        a.on("data", (a) => q += a.byteLength);
        a = g ? a.pipe(oa()) : a;
        l = await na(a, {b:e});
        t = l.length;
      }
      c();
    }).on("error", (a) => {
      a = f(a);
      z(a);
    }).on("timeout", () => {
      g.abort();
    });
  })).then(() => Object.assign({}, {body:l, headers:h}, k, {A:q, byteLength:t, o:null}));
  return {C:g, j:c};
};
const sa = (a = {}) => Object.keys(a).reduce((b, c) => {
  const d = a[c];
  c = `${encodeURIComponent(c)}=${encodeURIComponent(d)}`;
  return [...b, c];
}, []).join("&").replace(/%20/g, "+"), ta = async(a, b, {data:c, l:d, b:e, g:f = B(!0)}) => {
  const {C:g, j:h} = ra(a, b, {l:d, b:e, g:f});
  g.end(c);
  a = await h;
  if (a.headers["content-type"].startsWith("application/json") && a.body) {
    try {
      a.o = JSON.parse(a.body);
    } catch (k) {
      throw f = f(k), f.response = a.body, f;
    }
  }
  return a;
};
const ua = aa("aqt"), D = async(a, b) => {
  b = void 0 === b ? {} : b;
  const {data:c, type:d = "json", headers:e = {"User-Agent":"Mozilla/5.0 (Node.js) aqt/1.2.3"}, L:f = !0, b:g = !1, l:h = !1, method:k, timeout:l} = b;
  b = B(!0);
  const {hostname:q, protocol:t, port:u, path:z} = fa(a), pa = "https:" === t ? m : p, A = {hostname:q, port:u, path:z, headers:Object.assign({}, e), timeout:l, method:k};
  if (c) {
    var v = d;
    var n = c;
    switch(v) {
      case "json":
        n = JSON.stringify(n);
        v = "application/json";
        break;
      case "form":
        n = sa(n), v = "application/x-www-form-urlencoded";
    }
    n = {data:n, contentType:v};
    ({data:v} = n);
    ({contentType:n} = n);
    A.method = k || "POST";
    A.headers["Content-Type"] = n;
    A.headers["Content-Length"] = Buffer.byteLength(v);
  }
  f && (A.headers["Accept-Encoding"] = "gzip, deflate");
  const {body:qa, headers:va, byteLength:O, statusCode:wa, statusMessage:xa, A:P, o:Q} = await ta(pa, A, {data:v, l:h, b:g, g:b});
  ua("%s %s B%s", a, O, `${O != P ? ` (raw ${P} B)` : ""}`);
  return {body:Q ? Q : qa, headers:va, statusCode:wa, statusMessage:xa};
};
const ya = async(a, b) => {
  b = void 0 === b ? {} : b;
  ({body:a} = await D(a, b));
  return a;
}, za = async(a, b) => {
  b = void 0 === b ? {} : b;
  ({body:a} = await D(a, b));
  return a;
}, Aa = async(a, b) => {
  b = Object.assign({}, b, {b:!0});
  ({body:a} = await D(a, b));
  return a;
};
class Ba {
  constructor(a) {
    a = void 0 === a ? {} : a;
    const {host:b, headers:c = {}} = a;
    this.host = b;
    this.headers = c;
  }
}
;var Ca = {get H() {
  return D;
}, get default() {
  return ya;
}, get I() {
  return Aa;
}, get O() {
  return za;
}, get G() {
  return Ba;
}};
const E = (a, b, c, d, e) => {
  d = void 0 === d ? !1 : d;
  e = void 0 === e ? !1 : e;
  const f = new RegExp(`^-(${c}|-${b})`);
  b = a.findIndex((a) => f.test(a));
  if (-1 == b) {
    return {argv:a};
  }
  if (d) {
    return {value:!0, argv:[...a.slice(0, b), ...a.slice(b + 1)]};
  }
  d = b + 1;
  c = a[d];
  if (!c || "string" == typeof c && c.startsWith("--")) {
    return {argv:a};
  }
  e && (c = parseInt(c, 10));
  return {value:c, argv:[...a.slice(0, b), ...a.slice(d + 1)]};
}, Da = (a) => {
  const b = [];
  for (let c = 0; c < a.length; c++) {
    const d = a[c];
    if (d.startsWith("-")) {
      break;
    }
    b.push(d);
  }
  return b;
};
const Ea = (a) => ({value:`\x1b[1m${a}\x1b[0m`, length:a.length}), F = (a) => a.reduce((a, c) => Object.assign({}, a, {[c]:!0}), {});
function G(a) {
  const {keys:b = [], data:c = [], m:d = {}, S:e = {}, K:f = [], J:g = []} = a;
  var [h] = c;
  if (!h) {
    return "";
  }
  const k = F(f);
  a = F(g);
  h = Object.keys(h).reduce((a, b) => {
    const c = d[b];
    return Object.assign({}, a, {[b]:c ? c.length : b.length});
  }, {});
  const l = c.reduce((a, b) => Object.keys(b).reduce((c, d) => {
    const f = a[d], {length:g} = H(e, d)(b[d]);
    return Object.assign({}, c, {[d]:Math.max(g, f)});
  }, {}), h);
  h = b.reduce((a, b) => Object.assign({}, a, {[b]:d[b] || b}), {});
  const q = b.reduce((a, b) => Object.assign({}, a, {[b]:Ea}), {});
  a = I(b, h, l, q, a);
  h = c.map((a) => I(b, a, l, e, k));
  return [a, ...h].join("\n");
}
const J = (a, b, c, d) => {
  if (void 0 === a) {
    return " ".repeat(b);
  }
  let e = a;
  if (c) {
    const {value:b, length:d} = c(a);
    e = b;
    a = d;
  } else {
    a = `${a}`.length;
  }
  b -= a;
  if (d) {
    return d = Math.floor(b / 2), b -= d, " ".repeat(d) + e + " ".repeat(b);
  }
  d = " ".repeat(b);
  return `${e}${d}`;
}, H = (a, b) => (a = a[b]) ? a : (a) => ({value:a, length:a.replace(/\033\[.*?m/g, "").length}), I = (a, b, c, d, e) => {
  d = void 0 === d ? {} : d;
  e = void 0 === e ? {} : e;
  let f = 0;
  return a.map((a) => {
    const g = c[a];
    if (!g) {
      throw Error(`Unknown field ${a}`);
    }
    const k = H(d, a), l = e[a], [q, ...t] = b[a].split("\n");
    a = J(q, g, k, l);
    let u = "";
    t.length && (u = "\n" + t.map((a) => {
      const b = " ".repeat(f);
      a = J(a, g, k, l);
      return `${b}${a}`;
    }).join("\n"));
    f += g + 2;
    return `${a}${u}`;
  }).join("  ");
};
const Fa = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, Ga = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function K(a, b) {
  return (b = Fa[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function L(a, b) {
  return (b = Ga[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;async function M(a, b) {
  const {interval:c = 250, writable:d = process.stdout} = {};
  b = "function" == typeof b ? b() : b;
  const e = d.write.bind(d);
  let f = 1, g = `${a}${".".repeat(f)}`;
  e(g);
  const h = setInterval(() => {
    f = (f + 1) % 4;
    g = `${a}${".".repeat(f)}`;
    e(`\r${" ".repeat(a.length + 3)}\r`);
    e(g);
  }, c);
  try {
    return await b;
  } finally {
    clearInterval(h), e(`\r${" ".repeat(a.length + 3)}\r`);
  }
}
;function N(a, b, c) {
  try {
    if (!(a instanceof Promise)) {
      throw Error("Promise expected");
    }
    if ("number" !== (typeof b).toLowerCase()) {
      throw Error("Timeout must be a number");
    }
    if (0 > b) {
      throw Error("Timeout cannot be negative");
    }
  } catch (d) {
    return Promise.reject(d);
  }
  b = Ha(c, b);
  return Promise.race([a, b.j]).then(R.bind(null, b.timeout), R.bind(null, b.timeout, null));
}
function Ia(a, b, c) {
  return setTimeout(() => {
    const d = `${"string" === (typeof a).toLowerCase() ? a : "Promise"} has timed out after ${b}ms`, e = Error(d);
    e.stack = `Error: ${d}`;
    c(e);
  }, b);
}
function Ha(a, b) {
  let c;
  const d = new Promise((d, f) => {
    c = Ia(a, b, f);
  });
  return {timeout:c, j:d};
}
function R(a, b, c) {
  clearTimeout(a);
  if (c) {
    throw c;
  }
  return b;
}
;N && N.h && (N = N.default);
var Ja = {};
function Ka() {
  const {usage:a = {}, description:b, line:c, N:d} = {description:`ElasticSearch utility for creating a pipeline and index templates\nfor logging request using ${L("logarithm", "green")} middleware.`, line:"logarithm $ELASTIC [-TP] [-t index -sr] [-p|rp pipeline] [-d index]", usage:{"-t, --template name":"Create an index template for storing\nlog data in name-* index.", "-T, --templates":"List index templates.", "-s, --shards":"Number of shards for index template.\nDefault 1.", "-r, --replicas":"Number of replicas for index template.\nDefault 0.", 
  "-d, --delete name":"Delete an index.", "-P, --pipelines":"Display installed pipelines.", "-p, --pipeline name":"Create a pipeline with User-Agent\nand GeoIp plugins.", "-rp name":"Removes the pipeline.", "-h, --help":"Show the help message.", "-v, --version":"Show the version information."}};
  var e = Object.keys(a);
  const f = Object.values(a), [g] = e.reduce(([b = 0, c = 0], d) => {
    const e = a[d].split("\n").reduce((a, b) => b.length > a ? b.length : a, 0);
    e > c && (c = e);
    d.length > b && (b = d.length);
    return [b, c];
  }, []), h = (a, b) => {
    b = " ".repeat(b - a.length);
    return `${a}${b}`;
  };
  e = e.reduce((a, b, c) => {
    c = f[c].split("\n");
    b = h(b, g);
    const [d, ...e] = c;
    b = `${b}\t${d}`;
    const k = h("", g);
    c = e.map((a) => `${k}\t${a}`);
    return [...a, b, ...c];
  }, []).map((a) => `\t${a}`);
  const k = [b, `  ${c || ""}`].filter((a) => a ? a.trim() : a).join("\n\n");
  e = `${k ? `${k}\n` : ""}
  ${e.join("\n")}
  `;
  return d ? `${e}
  Example:
    ${d}
  ` : e;
}
;const {stringify:La} = querystring;
const Ma = async() => {
  await S(`${T}/_ingest/pipeline/${U}`, {c:{method:"PUT", timeout:5000}}, {description:"IP Address And UserAgent", processors:[{geoip:{field:"ip"}}, {user_agent:{field:"headers.user-agent"}}]});
}, Na = async() => await S(`${T}/_ingest/pipeline`, {c:{timeout:5000}}), Oa = async() => await S(`${T}/_template`, {c:{timeout:5000}}), Pa = async() => await S(`${T}/_stats`, {c:{timeout:10000}}), Qa = async() => await S(`${T}/_ingest/pipeline/${V}`, {c:{method:"DELETE", timeout:5000}}), S = async(a, b, c) => {
  var {c:d, query:e = {}} = void 0 === b ? {} : b;
  b = La(e);
  a = `${/^https?:\/\//.test(a) ? a : `http://${a}`}${b ? `?${b}` : ""}`;
  return await Ca.default(a, Object.assign({}, d, {data:c})).then((a) => {
    var b = Object.assign({}, a);
    a = a.error;
    b = (delete b.error, b);
    if (a) {
      throw Error("string" == typeof a ? a : a.reason);
    }
    return b;
  });
};
var Ra = async() => {
  const a = await M("Fetching stats", Pa());
  var b = Object.keys(a.indices).map((b) => {
    if (!b.startsWith(".")) {
      var c = a.indices[b].total;
      return {name:b, memory:W(c.segments.memory_in_bytes), docs:`${c.docs.count}`, size:`${W(c.store.size_in_bytes)}`};
    }
  }).filter(Boolean);
  b = G({keys:["name", "memory", "docs", "size"], data:b, m:{name:"Name", memory:"Memory", docs:"Docs", size:"Size"}});
  console.log(b);
};
const W = (a) => {
  let b = 0;
  for (; 1023 < a && 3 > b;) {
    b += 1, a /= 1024;
  }
  return `${Math.floor(10 * a) / 10} ${Sa[b]}`;
}, Sa = ["B", "KB", "MB", "GB"];
var Ta = async() => {
  const a = await M("Fetching the list of templates", Oa());
  var b = Object.keys(a).map((b) => {
    const c = a[b];
    return {name:b, patterns:c.index_patterns.join("\n"), shards:c.settings.index.number_of_shards, replicas:c.settings.index.number_of_replicas || ""};
  });
  b = G({keys:["name", "patterns", "shards", "replicas"], data:b, m:{name:"Name", patterns:"Patterns", shards:"Shards", replicas:"Replicas"}});
  console.log(b);
};
const Va = () => {
  var a = Ua;
  return Object.keys(a).reduce((b, c) => {
    b[c] = {type:a[c]};
    return b;
  }, {});
}, Ua = {ip:"ip", date:"date"}, Ya = async() => {
  var a = T, b = X, {F:c = 1, B:d = 0} = {F:Wa, B:Xa};
  const e = `${b}-*`, f = `hits-${b}`;
  b = {properties:Va()};
  a = await S(`${a}/_template/${f}`, {c:{method:"PUT", timeout:5000}}, {settings:{number_of_shards:c, number_of_replicas:d}, version:1, mappings:{hit:b}, index_patterns:[e]});
  setTimeout(() => {
    console.log("Created %s%s", K(f, "red"), " template");
    console.log("%s%s indices with %s shards and %s replicas", "for     ", K(e, "grey"), c, d);
  }, 1);
  return a;
}, Za = async() => await S(`${T}/${Y}`, {c:{method:"DELETE", timeout:5000}});
var $a = async() => {
  const a = await M("Fetching the list of pipelines", Na());
  var b = Object.keys(a).map((b) => {
    const c = a[b];
    return {name:b, description:c.description, processors:c.processors.map((a) => Object.keys(a).map((b) => `${K(b, "magenta")}: ${a[b].field}`).join(", ")).join("\n")};
  });
  b = G({keys:["name", "description", "processors"], data:b, m:{name:"Name", description:"Description", processors:"Processors"}});
  console.log(b);
};
const Z = function(a, b) {
  a = void 0 === a ? {} : a;
  b = void 0 === b ? process.argv : b;
  [, , ...b] = b;
  const c = Da(b);
  b = b.slice(c.length);
  let d = !c.length;
  return Object.keys(a).reduce((b, f) => {
    var e = Object.assign({}, b);
    b = b.f;
    e = (delete e.f, e);
    if (0 == b.length && d) {
      return Object.assign({}, {f:b}, e);
    }
    const h = a[f];
    let k;
    if ("string" == typeof h) {
      ({value:k, argv:b} = E(b, f, h));
    } else {
      try {
        const {a, i:e, P:g, u, multiple:z} = h;
        u && z && c.length ? (k = c, d = !0) : u && c.length ? (k = c[0], d = !0) : {value:k, argv:b} = E(b, f, a, e, g);
      } catch (l) {
        return Object.assign({}, {f:b}, e);
      }
    }
    return void 0 === k ? Object.assign({}, {f:b}, e) : Object.assign({}, {f:b}, e, {[f]:k});
  }, {f:b});
}({url:{u:!0}, help:{a:"h", i:!0}, template:{a:"t"}, templates:{a:"T", i:!0}, stats:{a:"S", i:!0}, "delete":{a:"d"}, shards:{a:"s", type:"number"}, replicas:{a:"r", type:"number"}, pipeline:{a:"p"}, pipelines:{a:"P", i:!0}, "remove-pipeline":{a:"rp"}, version:{a:"v", i:!0}}), T = Z.url, ab = Z.help, U = Z.pipeline, X = Z.template, Y = Z["delete"], Wa = Z.shards, Xa = Z.replicas, bb = Z.pipelines, cb = Z.stats, db = Z.templates, V = Z["remove-pipeline"];
if (Z.version) {
  console.log("1.0.0"), process.exit();
} else {
  if (ab) {
    const a = Ka();
    console.log(a);
    process.exit();
  }
}
(async() => {
  try {
    if (!T) {
      throw Error("No ElasticSearch URL.");
    }
    if (bb) {
      return await $a();
    }
    if (U) {
      await M(`Creating a pipeline ${K(U, "yellow")}`, Ma()), console.log("Pipeline %s created.", K(U, "green"));
    } else {
      if (V) {
        await M(`Removing ${K(V, "yellow")} pipeline`, Qa()), console.log("Pipeline %s removed.", L(V, "red"));
      } else {
        if (X) {
          await M(`Creating ${K(X, "yellow")} template`, Ya());
        } else {
          if (Y) {
            await Ja.confirm(`Are you sure you want to delete index ${K(Y, "yellow")}`, {M:!1}) && (await M(`Deleting ${K(Y, "yellow")} index`, Za()), console.log("Successfully deleted index %s", K(Y, "red")));
          } else {
            if (db) {
              return await Ta();
            }
            if (cb) {
              return await Ra();
            }
          }
        }
      }
    }
  } catch (a) {
    console.log(process.env.DEBUG ? a.stack : L(a.message, "red"));
  }
})();

