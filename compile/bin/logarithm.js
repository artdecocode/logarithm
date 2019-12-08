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
const aa = (a, b, c, d = !1, e = !1) => {
  const f = c ? new RegExp(`^-(${c}|-${b})$`) : new RegExp(`^--${b}$`);
  b = a.findIndex(g => f.test(g));
  if (-1 == b) {
    return {argv:a};
  }
  if (d) {
    return {value:!0, index:b, length:1};
  }
  d = a[b + 1];
  if (!d || "string" == typeof d && d.startsWith("--")) {
    return {argv:a};
  }
  e && (d = parseInt(d, 10));
  return {value:d, index:b, length:2};
}, ea = a => {
  const b = [];
  for (let c = 0; c < a.length; c++) {
    const d = a[c];
    if (d.startsWith("-")) {
      break;
    }
    b.push(d);
  }
  return b;
}, r = a => Object.keys(a).reduce((b, c) => {
  const d = a[c];
  if ("string" == typeof d) {
    return b[`-${d}`] = "", b;
  }
  c = d.command ? c : `--${c}`;
  d.short && (c = `${c}, -${d.short}`);
  let e = d.description;
  d.default && (e = `${e}\nDefault: ${d.default}.`);
  b[c] = e;
  return b;
}, {});
const t = {url:{description:"The ElasticSearch URL.\nIf protocol is not given, `http` is assumed.", command:!0}, stats:{description:"Display statistics by indices.", boolean:!0, short:"s"}, templates:{description:"List all index templates.", boolean:!0, short:"T"}, "delete":{description:"Delete an index, snapshot or pipeline.\nUsed with the relevant flag.", boolean:!0, short:"d"}, pipeline:{description:"Create a pipeline with `User-Agent`\nand `GeoIp` plugins.", short:"p"}, pipelines:{description:"Display installed pipelines.", 
boolean:!0, short:"P"}, snapshots:{description:"List registered snapshot repositories.", boolean:!0, short:"S"}, help:{description:"Print the help information and exit.", boolean:!0, short:"h"}, version:{description:"Show the version's number and exit.", boolean:!0, short:"v"}}, v = {"repository-s3":{description:"Create a new `s3` snapshot repo with this name.", short:"s3"}, bucket:{description:"The bucket name for the `s3` snapshot repository."}, repo:{description:"The name of the repo.", short:"r"}, 
snapshot:{description:"The name of the snapshot.", short:"s"}, restore:{description:"Restore this snapshot.", boolean:!0}, status:{description:"Fetch the status.", boolean:!0}}, w = {template:{description:"Create an index template for storing\nlog data in the `{template}-*` index.", short:"t"}, shards:{description:"The number of shards for index template.", number:!0, default:"1", short:"s"}, replicas:{description:"The number of replicas for index template.", number:!0, short:"r"}}, A = function(a = 
{}, b = process.argv) {
  let [, , ...c] = b;
  const d = ea(c);
  c = c.slice(d.length);
  a = Object.entries(a).reduce((g, [k, l]) => {
    g[k] = "string" == typeof l ? {short:l} : l;
    return g;
  }, {});
  const e = [];
  a = Object.entries(a).reduce((g, [k, l]) => {
    let h;
    try {
      const {short:n, boolean:p, number:q, command:u, multiple:m} = l;
      if (u && m && d.length) {
        h = d;
      } else {
        if (u && d.length) {
          h = d[0];
        } else {
          const x = aa(c, k, n, p, q);
          ({value:h} = x);
          const {index:z, length:y} = x;
          void 0 !== z && y && e.push({index:z, length:y});
        }
      }
    } catch (n) {
      return g;
    }
    return void 0 === h ? g : {...g, [k]:h};
  }, {});
  let f = c;
  e.forEach(({index:g, length:k}) => {
    Array.from({length:k}).forEach((l, h) => {
      f[g + h] = null;
    });
  });
  f = f.filter(g => null !== g);
  Object.assign(a, {o:f});
  return a;
}({...t, ...v, ...w}), B = A.url, fa = A.stats, ha = A.templates, C = A["delete"], D = A.pipeline, ia = A.pipelines, E = A.snapshots, ja = A.help, ka = A.version, F = A["repository-s3"], G = A.bucket, H = A.repo, I = A.snapshot, la = A.restore, J = A.status, K = A.template, L = A.shards || 1, M = A.replicas || 0;
async function N(a, b) {
  const {interval:c = 250, writable:d = process.stdout} = {};
  b = "function" == typeof b ? b() : b;
  const e = d.write.bind(d);
  var {INDICATRIX_PLACEHOLDER:f} = process.env;
  if (f && "0" != f) {
    return e(`${a}<INDICATRIX_PLACEHOLDER>`), await b;
  }
  let g = 1, k = `${a}${".".repeat(g)}`;
  e(k);
  f = setInterval(() => {
    g = (g + 1) % 4;
    k = `${a}${".".repeat(g)}`;
    e(`\r${" ".repeat(a.length + 3)}\r`);
    e(k);
  }, c);
  try {
    return await b;
  } finally {
    clearInterval(f), e(`\r${" ".repeat(a.length + 3)}\r`);
  }
}
;/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
const ma = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, na = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function O(a, b) {
  return (b = ma[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function P(a, b) {
  return (b = na[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;function R(a = {usage:{}}) {
  const {usage:b = {}, description:c, line:d, example:e} = a;
  a = Object.keys(b);
  const f = Object.values(b), [g] = a.reduce(([h = 0, n = 0], p) => {
    const q = b[p].split("\n").reduce((u, m) => m.length > u ? m.length : u, 0);
    q > n && (n = q);
    p.length > h && (h = p.length);
    return [h, n];
  }, []), k = (h, n) => {
    n = " ".repeat(n - h.length);
    return `${h}${n}`;
  };
  a = a.reduce((h, n, p) => {
    p = f[p].split("\n");
    n = k(n, g);
    const [q, ...u] = p;
    n = `${n}\t${q}`;
    const m = k("", g);
    p = u.map(x => `${m}\t${x}`);
    return [...h, n, ...p];
  }, []).map(h => `\t${h}`);
  const l = [c, `  ${d || ""}`].filter(h => h ? h.trim() : h).join("\n\n");
  a = `${l ? `${l}\n` : ""}
${a.join("\n")}
`;
  return e ? `${a}
  Example:

    ${e}
` : a;
}
;const {request:oa} = https;
const {request:pa} = http;
const {debuglog:qa, inspect:ra} = util;
const S = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, sa = (a, b = !1) => S(a, 2 + (b ? 1 : 0)), T = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:ta} = os;
const U = /\s+at.*(?:\(|\s)(.*)\)?/, ua = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, va = ta(), wa = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = new RegExp(ua.source.replace("IGNORED_MODULES", c.join("|")));
  return a.replace(/\\/g, "/").split("\n").filter(e => {
    e = e.match(U);
    if (null === e || !e[1]) {
      return !0;
    }
    e = e[1];
    return e.includes(".app/Contents/Resources/electron.asar") || e.includes(".app/Contents/Resources/default_app.asar") ? !1 : !d.test(e);
  }).filter(e => e.trim()).map(e => b ? e.replace(U, (f, g) => f.replace(g, g.replace(va, "~"))) : e).join("\n");
};
function xa(a, b, c = !1) {
  return function(d) {
    var e = T(arguments), {stack:f} = Error();
    const g = S(f, 2, !0), k = (f = d instanceof Error) ? d.message : d;
    e = [`Error: ${k}`, ...null !== e && a === e || c ? [b] : [g, b]].join("\n");
    e = wa(e);
    return Object.assign(f ? d : Error(), {message:k, stack:e});
  };
}
;function V(a) {
  var {stack:b} = Error();
  const c = T(arguments);
  b = sa(b, a);
  return xa(c, b, a);
}
;const {parse:ya} = url;
const {Writable:za} = stream;
const Aa = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class Ba extends za {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...d} = a || {}, {c:e = V(!0), proxyError:f} = a || {}, g = (k, l) => e(l);
    super(d);
    this.g = [];
    this.i = new Promise((k, l) => {
      this.on("finish", () => {
        let h;
        h = b ? Buffer.concat(this.g) : this.g.join("");
        k(h);
        this.g = [];
      });
      this.once("error", h => {
        if (-1 == h.stack.indexOf("\n")) {
          g`${h}`;
        } else {
          const n = wa(h.stack);
          h.stack = n;
          f && g`${h}`;
        }
        l(h);
      });
      c && Aa(this, c).pipe(this);
    });
  }
  _write(a, b, c) {
    this.g.push(a);
    c();
  }
  get f() {
    return this.i;
  }
}
const Ca = async(a, b = {}) => {
  ({f:a} = new Ba({rs:a, ...b, c:V(!0)}));
  return await a;
};
const {createGunzip:Da} = zlib;
const Ea = a => {
  ({"content-encoding":a} = a.headers);
  return "gzip" == a;
}, Fa = (a, b, c = {}) => {
  const {justHeaders:d, binary:e, c:f = V(!0)} = c;
  let g, k, l, h, n = 0, p = 0;
  c = (new Promise((q, u) => {
    g = a(b, async m => {
      ({headers:k} = m);
      const {statusMessage:x, statusCode:z} = m;
      l = {statusMessage:x, statusCode:z};
      if (d) {
        m.destroy();
      } else {
        var y = Ea(m);
        m.on("data", Q => n += Q.byteLength);
        m = y ? m.pipe(Da()) : m;
        h = await Ca(m, {binary:e});
        p = h.length;
      }
      q();
    }).on("error", m => {
      m = f(m);
      u(m);
    }).on("timeout", () => {
      g.abort();
    });
  })).then(() => ({body:h, headers:k, ...l, j:n, byteLength:p, h:null}));
  return {a:g, f:c};
};
const Ga = (a = {}) => Object.keys(a).reduce((b, c) => {
  const d = a[c];
  c = `${encodeURIComponent(c)}=${encodeURIComponent(d)}`;
  return [...b, c];
}, []).join("&").replace(/%20/g, "+"), Ha = async(a, b, {data:c, justHeaders:d, binary:e, c:f = V(!0)}) => {
  const {a:g, f:k} = Fa(a, b, {justHeaders:d, binary:e, c:f});
  g.end(c);
  a = await k;
  ({"content-type":b = ""} = a.headers);
  if ((b = b.startsWith("application/json")) && a.body) {
    try {
      a.h = JSON.parse(a.body);
    } catch (l) {
      throw f = f(l), f.response = a.body, f;
    }
  }
  return a;
};
let W;
try {
  const {version:a, name:b} = require("../package.json");
  W = "@rqt/aqt" == b ? `@rqt/aqt/${a}` : `@rqt/aqt via ${b}/${a}`;
} catch (a) {
  W = "@aqt/rqt";
}
const Ia = qa("aqt"), Ja = async(a, b = {}) => {
  const {data:c, type:d = "json", headers:e = {"User-Agent":`Mozilla/5.0 (Node.JS) ${W}`}, compress:f = !0, binary:g = !1, justHeaders:k = !1, method:l, timeout:h} = b;
  b = V(!0);
  const {hostname:n, protocol:p, port:q, path:u} = ya(a), m = "https:" === p ? oa : pa, x = {hostname:n, port:q, path:u, headers:{...e}, timeout:h, method:l};
  if (c) {
    var z = d;
    var y = c;
    switch(z) {
      case "json":
        y = JSON.stringify(y);
        z = "application/json";
        break;
      case "form":
        y = Ga(y), z = "application/x-www-form-urlencoded";
    }
    y = {data:y, contentType:z};
    ({data:z} = y);
    ({contentType:y} = y);
    x.method = l || "POST";
    "Content-Type" in x.headers || (x.headers["Content-Type"] = y);
    "Content-Length" in x.headers || (x.headers["Content-Length"] = Buffer.byteLength(z));
  }
  !f || "Accept-Encoding" in x.headers || (x.headers["Accept-Encoding"] = "gzip, deflate");
  const {body:Q, headers:Qa, byteLength:ba, statusCode:Ra, statusMessage:Sa, j:ca, h:da} = await Ha(m, x, {data:z, justHeaders:k, binary:g, c:b});
  Ia("%s %s B%s", a, ba, `${ba != ca ? ` (raw ${ca} B)` : ""}`);
  return {body:da ? da : Q, headers:Qa, statusCode:Ra, statusMessage:Sa};
};
const Ka = async(a, b = {}) => {
  ({body:a} = await Ja(a, b));
  return a;
};
const {stringify:La} = querystring;
const Ma = async() => {
  await X(`${B}/_ingest/pipeline/${D}`, {b:{method:"PUT", timeout:5000}}, {description:"IP Address And UserAgent", processors:[{geoip:{field:"ip"}}, {user_agent:{field:"headers.user-agent"}}]});
}, Na = async() => await X(`${B}/_ingest/pipeline`, {b:{timeout:5000}}), Oa = async() => await X(`${B}/_template`, {b:{timeout:5000}}), Pa = async() => await X(`${B}/_stats`, {b:{timeout:10000}}), Ta = async() => await X(`${B}/_ingest/pipeline/${D}`, {b:{method:"DELETE", timeout:5000}}), X = async(a, {b, query:c = {}} = {}, d) => {
  const e = V();
  c = La(c);
  const {error:f, ...g} = await Ka(`${/^https?:\/\//.test(a) ? a : `http://${a}`}${c ? `?${c}` : ""}`, {...b, data:d});
  if (f) {
    throw a = Error("string" == typeof f ? f : f.reason), f.type && (a.type = f.type), e(a);
  }
  return g;
};
const Ua = a => ({value:`\x1b[1m${a}\x1b[0m`, length:a.length}), Va = a => a.reduce((b, c) => ({...b, [c]:!0}), {});
function Y(a) {
  const {keys:b = [], data:c = [], headings:d = {}, replacements:e = {}, centerValues:f = [], centerHeadings:g = []} = a;
  var [k] = c;
  if (!k) {
    return "";
  }
  const l = Va(f);
  a = Va(g);
  k = Object.keys(k).reduce((p, q) => {
    const u = d[q];
    return {...p, [q]:u ? u.length : q.length};
  }, {});
  const h = c.reduce((p, q) => Object.keys(q).reduce((u, m) => {
    const x = p[m], {length:z} = Wa(e, m)(q[m]);
    return {...u, [m]:Math.max(z, x)};
  }, {}), k);
  k = b.reduce((p, q) => ({...p, [q]:d[q] || q}), {});
  const n = b.reduce((p, q) => ({...p, [q]:Ua}), {});
  a = Xa(b, k, h, n, a);
  k = c.map(p => Xa(b, p, h, e, l));
  return [a, ...k].join("\n");
}
const Ya = (a, b, c, d) => {
  if (void 0 === a) {
    return " ".repeat(b);
  }
  let e = a;
  if (c) {
    const {value:f, length:g} = c(a);
    e = f;
    a = g;
  } else {
    a = `${a}`.length;
  }
  b -= a;
  if (d) {
    return d = Math.floor(b / 2), b -= d, " ".repeat(d) + e + " ".repeat(b);
  }
  d = " ".repeat(b);
  return `${e}${d}`;
}, Wa = (a, b) => (a = a[b]) ? a : c => ({value:c, length:`${c}`.replace(/\033\[.*?m/g, "").length}), Xa = (a, b, c, d = {}, e = {}) => {
  let f = 0;
  return a.map(g => {
    const k = c[g];
    if (!k) {
      throw Error(`Unknown field ${g}`);
    }
    var l = b[g];
    const h = Wa(d, g), n = e[g], [p, ...q] = `${l}`.split("\n");
    g = Ya(p, k, h, n);
    l = "";
    q.length && (l = "\n" + q.map(u => {
      const m = " ".repeat(f);
      u = Ya(u, k, h, n);
      return `${m}${u}`;
    }).join("\n"));
    f += k + 2;
    return `${g}${l}`;
  }).join("  ");
};
var Za = async() => {
  const a = await N("Fetching the list of pipelines", Na());
  var b = Object.keys(a).map(c => {
    const d = a[c];
    return {name:c, description:d.description, processors:d.processors.map(e => Object.keys(e).map(f => `${O(f, "magenta")}: ${e[f].field}`).join(", ")).join("\n")};
  });
  b = Y({keys:["name", "description", "processors"], data:b, headings:{name:"Name", description:"Description", processors:"Processors"}});
  console.log(b);
};
const $a = async() => {
  var {m:a = 1, l:b = 0} = {m:L, l:M};
  const c = `${K}-*`, d = `hits-${K}`, e = await X(`${B}/_template/${d}`, {b:{method:"PUT", timeout:5000}}, {settings:{number_of_shards:a, number_of_replicas:b}, version:1, index_patterns:[c]});
  setTimeout(() => {
    console.log("Created %s%s", O(d, "green"), " template");
    console.log("%s%s indices with %s shard%s and %s replica%s", "for     ", O(c, "grey"), a, 1 < a ? "s" : "", b, 0 == b || 1 < b ? "s" : "");
  }, 1);
  return e;
}, ab = async() => await X(`${B}/${C}`, {b:{method:"DELETE", timeout:5000}});
const {createInterface:bb} = readline;
function cb(a, b, c) {
  return setTimeout(() => {
    const d = Error(`${a ? a : "Promise"} has timed out after ${b}ms`);
    d.stack = `Error: ${d.message}`;
    c(d);
  }, b);
}
function db(a, b) {
  let c;
  const d = new Promise((e, f) => {
    c = cb(a, b, f);
  });
  return {timeout:c, f:d};
}
async function eb(a, b, c) {
  if (!(a instanceof Promise)) {
    throw Error("Promise expected");
  }
  if (!b) {
    throw Error("Timeout must be a number");
  }
  if (0 > b) {
    throw Error("Timeout cannot be negative");
  }
  const {f:d, timeout:e} = db(c, b);
  try {
    return await Promise.race([a, d]);
  } finally {
    clearTimeout(e);
  }
}
;function fb(a, b = {}) {
  const {timeout:c, password:d = !1, output:e = process.stdout, input:f = process.stdin, ...g} = b;
  b = bb({input:f, output:e, ...g});
  if (d) {
    const l = b.output;
    b._writeToOutput = h => {
      if (["\r\n", "\n", "\r"].includes(h)) {
        return l.write(h);
      }
      h = h.split(a);
      "2" == h.length ? (l.write(a), l.write("*".repeat(h[1].length))) : l.write("*");
    };
  }
  var k = new Promise(b.question.bind(b, a));
  k = c ? eb(k, c, `reloquent: ${a}`) : k;
  b.promise = gb(k, b);
  return b;
}
const gb = async(a, b) => {
  try {
    return await a;
  } finally {
    b.close();
  }
};
async function hb(a, b) {
  if ("object" != typeof a) {
    throw Error("Please give an object with questions");
  }
  return await Object.keys(a).reduce(async(c, d) => {
    c = await c;
    var e = a[d];
    switch(typeof e) {
      case "object":
        e = {...e};
        break;
      case "string":
        e = {text:e};
        break;
      default:
        throw Error("A question must be a string or an object.");
    }
    e.text = `${e.text}${e.text.endsWith("?") ? "" : ":"} `;
    var f;
    if (e.defaultValue) {
      var g = e.defaultValue;
    }
    e.getDefault && (f = await e.getDefault());
    let k = g || "";
    g && f && g != f ? k = `\x1b[90m${g}\x1b[0m` : g && g == f && (k = "");
    g = f || "";
    ({promise:g} = fb(`${e.text}${k ? `[${k}] ` : ""}${g ? `[${g}] ` : ""}`, {timeout:b, password:e.password}));
    f = await g || f || e.defaultValue;
    "function" == typeof e.validation && e.validation(f);
    "function" == typeof e.postProcess && (f = await e.postProcess(f));
    return {...c, [d]:f};
  }, {});
}
;async function Z(a, b = {}) {
  const {defaultYes:c = !0, timeout:d} = b;
  b = a.endsWith("?");
  a = `${b ? a.replace(/\?$/, "") : a} (y/n)${b ? "?" : ""}`;
  ({question:a} = await hb({question:{text:a, defaultValue:c ? "y" : "n"}}, d));
  return "y" == a;
}
;var ib = async() => {
  const a = await N("Fetching the list of templates", Oa());
  var b = Object.keys(a).map(c => {
    const d = a[c];
    return {name:c, patterns:d.index_patterns.join("\n"), shards:d.settings.index.number_of_shards, replicas:d.settings.index.number_of_replicas || ""};
  });
  b = Y({keys:["name", "patterns", "shards", "replicas"], data:b, headings:{name:"Name", patterns:"Patterns", shards:"Shards", replicas:"Replicas"}});
  console.log(b);
};
var kb = async() => {
  const a = await N("Fetching stats", Pa());
  var b = Object.keys(a.indices).map(c => {
    if (!c.startsWith(".")) {
      var d = a.indices[c].total;
      return {name:c, memory:jb(d.segments.memory_in_bytes), docs:`${d.docs.count}`, size:`${jb(d.store.size_in_bytes)}`};
    }
  }).filter(Boolean);
  b = Y({keys:["name", "memory", "docs", "size"], data:b, headings:{name:"Name", memory:"Memory", docs:"Docs", size:"Size"}});
  console.log(b);
};
const jb = a => {
  let b = 0;
  for (; 1023 < a && 3 > b;) {
    b += 1, a /= 1024;
  }
  return `${Math.floor(10 * a) / 10} ${lb[b]}`;
}, lb = ["B", "KB", "MB", "GB"];
async function mb(a) {
  if (!G) {
    throw Error("Bucket name is required (use --bucket).");
  }
  const b = O(F, "yellow");
  a = a.a(`_snapshot/${F}`, {method:"PUT"}, {}, {type:"s3", settings:{bucket:G}});
  a = await N(`Registering ${b} snapshot repository`, a);
  console.log("Successfully registered %s", b);
  return a;
}
async function nb(a) {
  const b = O(H, "yellow");
  await Z(`Are you sure you want to unregister ${b} backup repository`) && (a = a.a(`_snapshot/${H}`, {method:"DELETE"}), await N(`Unregistering ${b} snapshot repository`, a), console.log("Successfully unregistered %s", O(H, "yellow")));
}
async function ob(a) {
  var b = O(`${H}/${I}`, "yellow");
  a = a.a(`_snapshot/${H}/${I}/_status`);
  ({snapshots:b} = await N(`Getting ${b} snapshot status`, a));
  console.log(ra(b, {colors:!0, depth:Infinity}));
}
async function pb(a) {
  a = await N("Fetching snapshot repositories", a.a("_snapshot"));
  qb(a);
}
async function rb(a) {
  const b = O(H, "yellow") + "/" + O(I, "yellow");
  await Z(`Are you sure you want to delete ${b} snapshot`) && (a = await N(`Deleting ${b} snapshot`, a.a(`_snapshot/${H}/${I}`, {method:"DELETE"})), console.log(a));
}
async function sb(a) {
  var b = O(H, "yellow");
  a = a.a(`_snapshot/${H}/_status`);
  b = await N(`Getting ${b} repository status`, a);
  console.log(b);
}
async function tb(a) {
  var b = O(H, "yellow"), c = a.a(`_snapshot/${H}`);
  c = await N(`Getting ${b} repository info`, c);
  qb(c);
  a = a.a(`_snapshot/${H}/_all`);
  ({s:b} = await N(`Getting ${b} repository snapshots`, a));
  console.log();
  ub(b);
}
async function vb(a) {
  const b = O(H, "yellow") + O("/", "magenta") + O(I, "yellow");
  await Z(`Continue with ${b} snapshot`) && ({snapshot:a} = await N(`Creating snapshot ${b}`, a.a(`_snapshot/${H}/${I}`, {method:"PUT"}, {wait_for_completion:!0})), ub(a));
}
class wb {
  constructor(a, b = 5000) {
    this.url = a;
    this.timeout = b;
  }
  async a(a, b = {}, c, d) {
    return await X(`${this.url}/${a}`, {b:{...b, timeout:this.timeout}, query:c}, d);
  }
  async status() {
    var a = this.a("_snapshot/_status");
    a = await N("Getting snapshots status", a);
    console.log(a);
  }
  async restore(a, b) {
    var c = O(a, "yellow");
    await Z(`Are you sure you want to restore ${c} snapshot`) && (a = this.a(`_snapshot/${a}/${b}/_restore`, {method:"POST"}, {wait_for_completion:!0}), c = await N(`Restoring ${c} snapshot`, a), console.log(c));
  }
}
const qb = a => {
  Object.keys(a).length ? (a = Object.entries(a).map(([b, {type:c, settings:d}]) => {
    d = Object.entries(d).map(([e, f]) => `${O(e, "green")}: ${f}`).join("\n");
    return {key:b, type:c, settings:d};
  }), a = Y({keys:["key", "type", "settings"], data:a, headings:{key:"Name", type:"Type", settings:"Settings"}}), console.log(a)) : console.log("No registered snapshot repositories.");
}, ub = a => {
  a = Y({keys:["snapshot", "version", "start_time", "end_time", "indices"], data:a.map(b => {
    b.indices = b.indices.join("\n");
    b.start_time = (new Date(b.start_time)).toLocaleString();
    b.end_time = (new Date(b.end_time)).toLocaleString();
    return b;
  }), headings:{snapshot:"Snapshot", version:"Version", start_time:"Start Time", start_end:"End Time", indices:"Indices"}});
  console.log(a);
};
if (ka) {
  const a = require("../../package.json");
  console.log(a);
  process.exit();
} else {
  if (ja) {
    {
      const a = R({description:`ElasticSearch utility for creating a pipeline and index templates\nfor logging request using ${P("logarithm", "green")} middleware.`, line:"logarithm <url> [-TPS] [-p pipeline] [-d]", usage:r(t)});
      console.log(a);
      const b = R({description:`${O("Snapshots", "cyan")}: used to print info, create and restore snapshots.`, line:"logarithm <url> [-r repo] [-s snapshot] [-s3 snapshot --bucket bucket] [--status|-d]", usage:r(v)});
      console.log(b);
      const c = R({description:`${O("Templates", "red")}: creates a template for an app.`, line:"lagarithm <url> -t {app-name} [-s shards] [-r replicas] [-d]", usage:r(w)});
      console.log(c);
    }
    process.exit();
  }
}
(async() => {
  try {
    if (!B) {
      throw Error("No ElasticSearch URL.");
    }
    if (ia) {
      return await Za();
    }
    if (D) {
      await N(`Creating a pipeline ${O(D, "yellow")}`, Ma()), console.log("Pipeline %s created.", O(D, "green"));
    } else {
      if (D && C) {
        await N(`Removing ${O(D, "yellow")} pipeline`, Ta()), console.log("Pipeline %s removed.", P(D, "red"));
      } else {
        if (K) {
          return await Z(`Create template ${O(K, "yellow")}-* with ${L} shard${1 < L ? "s" : ""} and ${M} replica${0 == M || 1 < M ? "s" : ""}`) ? await N(`Creating ${O(K, "yellow")} template`, $a()) : void 0;
        }
        if (K && C) {
          if (!await Z(`Are you sure you want to delete index ${O(C, "yellow")}`, {defaultYes:!1})) {
            return;
          }
          await N(`Deleting ${O(C, "yellow")} index`, ab());
          console.log("Successfully deleted index %s", O(C, "red"));
          return;
        }
      }
    }
    if (ha) {
      return await ib();
    }
    if (fa) {
      return await kb();
    }
    const a = new wb(B, 5000);
    if (E && J) {
      return await a.status();
    }
    if (H && I && J) {
      return await ob(a);
    }
    if (H && J) {
      return await sb(a);
    }
    if (H && I && C) {
      return await rb(a);
    }
    if (H && I && la) {
      return await a.restore(H, I);
    }
    if (H && I) {
      return await vb(a);
    }
    if (H && C) {
      return await nb(a);
    }
    if (H) {
      return await tb(a);
    }
    if (E) {
      return await pb(a);
    }
    if (F) {
      return await mb(a);
    }
  } catch (a) {
    console.log(process.env.DEBUG ? a.stack : P(a.message, "red"));
  }
})();

