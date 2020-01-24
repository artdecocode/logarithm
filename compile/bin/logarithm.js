#!/usr/bin/env node
             
const path = require('path');
const url = require('url');
const util = require('util');
const querystring = require('querystring');
const https = require('https');
const http = require('http');
const os = require('os');
const zlib = require('zlib');
const stream = require('stream');
const readline = require('readline');
const fs = require('fs');             
const aa = (a, b, c, d = !1, f = !1) => {
  const e = c ? new RegExp(`^-(${c}|-${b})$`) : new RegExp(`^--${b}$`);
  b = a.findIndex(g => e.test(g));
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
  f && (d = parseInt(d, 10));
  return {value:d, index:b, length:2};
}, ba = a => {
  const b = [];
  for (let c = 0; c < a.length; c++) {
    const d = a[c];
    if (d.startsWith("-")) {
      break;
    }
    b.push(d);
  }
  return b;
}, q = a => Object.keys(a).reduce((b, c) => {
  const d = a[c];
  if ("string" == typeof d) {
    return b[`-${d}`] = "", b;
  }
  c = d.command ? c : `--${c}`;
  d.short && (c = `${c}, -${d.short}`);
  let f = d.description;
  d.default && (f = `${f}\nDefault: ${d.default}.`);
  b[c] = f;
  return b;
}, {});
const t = {url:{description:"The ElasticSearch URL.\nIf protocol is not given, `http` is assumed.", command:!0}, stats:{description:"Display statistics by indices.", boolean:!0, short:"s"}, templates:{description:"List all index templates.", boolean:!0, short:"T"}, "delete":{description:"Delete an index, snapshot or pipeline.\nUsed with the relevant flag.", boolean:!0, short:"d"}, index:{description:"Select an index for operations.", short:"i"}, pipeline:{description:"Create a pipeline with `User-Agent`\nand `GeoIp` plugins.", 
short:"p"}, pipelines:{description:"Display installed pipelines.", boolean:!0, short:"P"}, snapshots:{description:"List registered snapshot repositories.", boolean:!0, short:"S"}, help:{description:"Print the help information and exit.", boolean:!0, short:"h"}, version:{description:"Show the version's number and exit.", boolean:!0, short:"v"}}, u = {post:{description:"Send post request with data from the file."}, path:{description:"The path to send a request to.", short:"p"}}, w = {"repository-s3":{description:"Create a new `s3` snapshot repo with this name.", 
short:"s3"}, bucket:{description:"The bucket name for the `s3` snapshot repository."}, repo:{description:"The name of the repo.", short:"r"}, snapshot:{description:"The name of the snapshot.", short:"s"}, restore:{description:"Restore this snapshot.", boolean:!0}, status:{description:"Fetch the status.", boolean:!0}}, A = {template:{description:"Create an index template for storing\nlog data in the `{template}-*` index.", short:"t"}, shards:{description:"The number of shards for index template.", 
number:!0, default:"1", short:"s"}, replicas:{description:"The number of replicas for index template.", number:!0, short:"r"}}, B = function(a = {}, b = process.argv) {
  let [, , ...c] = b;
  const d = ba(c);
  c = c.slice(d.length);
  a = Object.entries(a).reduce((g, [h, l]) => {
    g[h] = "string" == typeof l ? {short:l} : l;
    return g;
  }, {});
  const f = [];
  a = Object.entries(a).reduce((g, [h, l]) => {
    let k;
    try {
      const n = l.short, p = l.boolean, r = l.number, v = l.command, m = l.multiple;
      if (v && m && d.length) {
        k = d;
      } else {
        if (v && d.length) {
          k = d[0];
        } else {
          const x = aa(c, h, n, p, r);
          ({value:k} = x);
          const y = x.index, z = x.length;
          void 0 !== y && z && f.push({index:y, length:z});
        }
      }
    } catch (n) {
      return g;
    }
    return void 0 === k ? g : {...g, [h]:k};
  }, {});
  let e = c;
  f.forEach(({index:g, length:h}) => {
    Array.from({length:h}).forEach((l, k) => {
      e[g + k] = null;
    });
  });
  e = e.filter(g => null !== g);
  Object.assign(a, {s:e});
  return a;
}({...t, ...u, ...w, ...A}), C = B.url, ca = B.stats, da = B.templates, D = B["delete"], E = B.index, F = B.pipeline, ea = B.pipelines, G = B.snapshots, fa = B.help, ka = B.version, H = B.post, la = B.path, I = B["repository-s3"], ma = B.bucket, J = B.repo, K = B.snapshot, na = B.restore, L = B.status, M = B.template, N = B.shards || 1, O = B.replicas || 0;
async function P(a, b) {
  const {interval:c = 250, writable:d = process.stdout} = {};
  b = "function" == typeof b ? b() : b;
  const f = d.write.bind(d);
  var e = process.env.o;
  if (e && "0" != e) {
    return f(`${a}<INDICATRIX_PLACEHOLDER>`), await b;
  }
  let g = 1, h = `${a}${".".repeat(g)}`;
  f(h);
  e = setInterval(() => {
    g = (g + 1) % 4;
    h = `${a}${".".repeat(g)}`;
    f(`\r${" ".repeat(a.length + 3)}\r`);
    f(h);
  }, c);
  try {
    return await b;
  } finally {
    clearInterval(e), f(`\r${" ".repeat(a.length + 3)}\r`);
  }
}
;/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
const oa = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, pa = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function Q(a, b) {
  return (b = oa[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function R(a, b) {
  return (b = pa[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;function S(a = {usage:{}}) {
  const {usage:b = {}, description:c, line:d, example:f} = a;
  a = Object.keys(b);
  const e = Object.values(b), [g] = a.reduce(([k = 0, n = 0], p) => {
    const r = b[p].split("\n").reduce((v, m) => m.length > v ? m.length : v, 0);
    r > n && (n = r);
    p.length > k && (k = p.length);
    return [k, n];
  }, []), h = (k, n) => {
    n = " ".repeat(n - k.length);
    return `${k}${n}`;
  };
  a = a.reduce((k, n, p) => {
    p = e[p].split("\n");
    n = h(n, g);
    const [r, ...v] = p;
    n = `${n}\t${r}`;
    const m = h("", g);
    p = v.map(x => `${m}\t${x}`);
    return [...k, n, ...p];
  }, []).map(k => `\t${k}`);
  const l = [c, `  ${d || ""}`].filter(k => k ? k.trim() : k).join("\n\n");
  a = `${l ? `${l}\n` : ""}
${a.join("\n")}
`;
  return f ? `${a}
  Example:

    ${f}
` : a;
}
;const qa = https.request;
const ra = http.request;
const sa = util.debuglog, T = util.inspect;
const ta = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, ua = (a, b = !1) => ta(a, 2 + (b ? 1 : 0)), va = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const wa = os.homedir;
const xa = /\s+at.*(?:\(|\s)(.*)\)?/, ya = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, za = wa(), Aa = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), f = new RegExp(ya.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(e => {
    e = e.match(xa);
    if (null === e || !e[1]) {
      return !0;
    }
    e = e[1];
    return e.includes(".app/Contents/Resources/electron.asar") || e.includes(".app/Contents/Resources/default_app.asar") ? !1 : !f.test(e);
  }).filter(e => e.trim()).map(e => b ? e.replace(xa, (g, h) => g.replace(h, h.replace(za, "~"))) : e).join("\n");
};
function Ba(a, b, c = !1) {
  return function(d) {
    var f = va(arguments), {stack:e} = Error();
    const g = ta(e, 2, !0), h = (e = d instanceof Error) ? d.message : d;
    f = [`Error: ${h}`, ...null !== f && a === f || c ? [b] : [g, b]].join("\n");
    f = Aa(f);
    return Object.assign(e ? d : Error(), {message:h, stack:f});
  };
}
;function U(a) {
  var {stack:b} = Error();
  const c = va(arguments);
  b = ua(b, a);
  return Ba(c, b, a);
}
;const Ca = url.parse;
const Da = stream.Writable;
const Ea = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class Fa extends Da {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...d} = a || {}, {c:f = U(!0), proxyError:e} = a || {}, g = (h, l) => f(l);
    super(d);
    this.g = [];
    this.i = new Promise((h, l) => {
      this.on("finish", () => {
        let k;
        k = b ? Buffer.concat(this.g) : this.g.join("");
        h(k);
        this.g = [];
      });
      this.once("error", k => {
        if (-1 == k.stack.indexOf("\n")) {
          g`${k}`;
        } else {
          const n = Aa(k.stack);
          k.stack = n;
          e && g`${k}`;
        }
        l(k);
      });
      c && Ea(this, c).pipe(this);
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
const Ga = async(a, b = {}) => {
  ({f:a} = new Fa({rs:a, ...b, c:U(!0)}));
  return await a;
};
const Ha = zlib.createGunzip;
const Ia = (a, b, c = {}) => {
  const {justHeaders:d, binary:f, c:e = U(!0)} = c;
  let g, h, l, k, n = 0, p = 0;
  c = (new Promise((r, v) => {
    g = a(b, async m => {
      ({headers:h} = m);
      l = {statusMessage:m.statusMessage, statusCode:m.statusCode};
      if (d) {
        m.destroy();
      } else {
        var x = "gzip" == m.headers["content-encoding"];
        m.on("data", y => n += y.byteLength);
        m = x ? m.pipe(Ha()) : m;
        k = await Ga(m, {binary:f});
        p = k.length;
      }
      r();
    }).on("error", m => {
      m = e(m);
      v(m);
    }).on("timeout", () => {
      g.abort();
    });
  })).then(() => ({body:k, headers:h, ...l, j:n, byteLength:p, h:null}));
  return {a:g, f:c};
};
const Ja = (a = {}) => Object.keys(a).reduce((b, c) => {
  const d = a[c];
  c = `${encodeURIComponent(c)}=${encodeURIComponent(d)}`;
  return [...b, c];
}, []).join("&").replace(/%20/g, "+"), Ka = async(a, b, {data:c, justHeaders:d, binary:f, c:e = U(!0)}) => {
  const {a:g, f:h} = Ia(a, b, {justHeaders:d, binary:f, c:e});
  g.end(c);
  a = await h;
  if ((a.headers["content-type"] || "").startsWith("application/json") && a.body) {
    try {
      a.h = JSON.parse(a.body);
    } catch (l) {
      throw e = e(l), e.response = a.body, e;
    }
  }
  return a;
};
let V;
try {
  const {version:a, name:b} = require("../package.json");
  V = "@rqt/aqt" == b ? `@rqt/aqt/${a}` : `@rqt/aqt via ${b}/${a}`;
} catch (a) {
  V = "@aqt/rqt";
}
const La = sa("aqt"), Ma = async(a, b = {}) => {
  const {data:c, type:d = "json", headers:f = {"User-Agent":`Mozilla/5.0 (Node.JS) ${V}`}, compress:e = !0, binary:g = !1, justHeaders:h = !1, method:l, timeout:k} = b;
  b = U(!0);
  const {hostname:n, protocol:p, port:r, path:v} = Ca(a), m = "https:" === p ? qa : ra, x = {hostname:n, port:r, path:v, headers:{...f}, timeout:k, method:l};
  if (c) {
    var y = d;
    var z = c;
    switch(y) {
      case "json":
        z = JSON.stringify(z);
        y = "application/json";
        break;
      case "form":
        z = Ja(z), y = "application/x-www-form-urlencoded";
    }
    z = {data:z, contentType:y};
    ({data:y} = z);
    z = z.contentType;
    x.method = l || "POST";
    "Content-Type" in x.headers || (x.headers["Content-Type"] = z);
    "Content-Length" in x.headers || (x.headers["Content-Length"] = Buffer.byteLength(y));
  }
  !e || "Accept-Encoding" in x.headers || (x.headers["Accept-Encoding"] = "gzip, deflate");
  const {body:Ua, headers:Va, byteLength:ha, statusCode:Wa, statusMessage:Xa, j:ia, h:ja} = await Ka(m, x, {data:y, justHeaders:h, binary:g, c:b});
  La("%s %s B%s", a, ha, `${ha != ia ? ` (raw ${ia} B)` : ""}`);
  return {body:ja ? ja : Ua, headers:Va, statusCode:Wa, statusMessage:Xa};
};
const Na = async(a, b = {}) => {
  ({body:a} = await Ma(a, b));
  return a;
}, Oa = async(a, b = {}) => {
  ({body:a} = await Ma(a, b));
  return a;
};
const Pa = querystring.stringify;
const Qa = async a => {
  await W(`${a}/_ingest/pipeline/${F}`, {b:{method:"PUT", timeout:5000}}, {description:"IP Address And UserAgent", processors:[{geoip:{field:"ip"}}, {user_agent:{field:"headers.user-agent"}}]});
}, Ra = async a => await W(`${a}/_ingest/pipeline`, {b:{timeout:5000}}), Sa = async a => await W(`${a}/_template`, {b:{timeout:5000}}), Ta = async a => await W(`${a}/_stats`, {b:{timeout:10000}}), Ya = async a => await W(`${a}/_ingest/pipeline/${F}`, {b:{method:"DELETE", timeout:5000}}), W = async(a, {b, query:c = {}} = {}, d) => {
  const f = U();
  c = Pa(c);
  const {error:e, ...g} = await Na(`${/^https?:\/\//.test(a) ? a : `http://${a}`}${c ? `?${c}` : ""}`, {...b, data:d});
  if (e) {
    throw a = Error("string" == typeof e ? e : e.reason), e.type && (a.type = e.type), f(a);
  }
  return g;
};
const Za = a => ({value:`\x1b[1m${a}\x1b[0m`, length:a.length}), $a = a => a.reduce((b, c) => ({...b, [c]:!0}), {});
function X(a) {
  const {keys:b = [], data:c = [], headings:d = {}, replacements:f = {}, centerValues:e = [], centerHeadings:g = []} = a;
  var [h] = c;
  if (!h) {
    return "";
  }
  const l = $a(e);
  a = $a(g);
  h = Object.keys(h).reduce((p, r) => {
    const v = d[r];
    return {...p, [r]:v ? v.length : r.length};
  }, {});
  const k = c.reduce((p, r) => Object.keys(r).reduce((v, m) => {
    const x = p[m], {length:y} = ab(f, m)(r[m]);
    return {...v, [m]:Math.max(y, x)};
  }, {}), h);
  h = b.reduce((p, r) => ({...p, [r]:d[r] || r}), {});
  const n = b.reduce((p, r) => ({...p, [r]:Za}), {});
  a = bb(b, h, k, n, a);
  h = c.map(p => bb(b, p, k, f, l));
  return [a, ...h].join("\n");
}
const cb = (a, b, c, d) => {
  if (void 0 === a) {
    return " ".repeat(b);
  }
  let f = a;
  if (c) {
    const {value:e, length:g} = c(a);
    f = e;
    a = g;
  } else {
    a = `${a}`.length;
  }
  b -= a;
  if (d) {
    return d = Math.floor(b / 2), b -= d, " ".repeat(d) + f + " ".repeat(b);
  }
  d = " ".repeat(b);
  return `${f}${d}`;
}, ab = (a, b) => (a = a[b]) ? a : c => ({value:c, length:`${c}`.replace(/\033\[.*?m/g, "").length}), bb = (a, b, c, d = {}, f = {}) => {
  let e = 0;
  return a.map(g => {
    const h = c[g];
    if (!h) {
      throw Error(`Unknown field ${g}`);
    }
    var l = b[g];
    const k = ab(d, g), n = f[g], [p, ...r] = `${l}`.split("\n");
    g = cb(p, h, k, n);
    l = "";
    r.length && (l = "\n" + r.map(v => {
      const m = " ".repeat(e);
      v = cb(v, h, k, n);
      return `${m}${v}`;
    }).join("\n"));
    e += h + 2;
    return `${g}${l}`;
  }).join("  ");
};
var db = async a => {
  const b = await P("Fetching the list of pipelines", Ra(a));
  a = Object.keys(b).map(c => {
    const d = b[c];
    return {name:c, description:d.description, processors:d.processors.map(f => Object.keys(f).map(e => `${Q(e, "magenta")}: ${f[e].field}`).join(", ")).join("\n")};
  });
  a = X({keys:["name", "description", "processors"], data:a, headings:{name:"Name", description:"Description", processors:"Processors"}});
  console.log(a);
};
const eb = async(a, b, c) => await W(`${a}/_template/${b}`, {b:{method:"PUT", timeout:5000}}, {...c, index_patterns:[E]}), fb = async a => {
  var {m:b = 1, l:c = 0} = {m:N, l:O};
  const d = `${M}-*`, f = `hits-${M}`;
  a = await W(`${a}/_template/${f}`, {b:{method:"PUT", timeout:5000}}, {settings:{number_of_shards:b, number_of_replicas:c}, version:1, index_patterns:[d]});
  setTimeout(() => {
    console.log("Created %s%s", Q(f, "green"), " template");
    console.log("%s%s indices with %s shard%s and %s replica%s", "for     ", Q(d, "grey"), b, 1 < b ? "s" : "", c, 0 == c || 1 < c ? "s" : "");
  }, 1);
  return a;
}, gb = async a => await W(`${a}/${E}`, {b:{method:"DELETE", timeout:5000}});
const hb = readline.createInterface;
function ib(a, b, c) {
  return setTimeout(() => {
    const d = Error(`${a ? a : "Promise"} has timed out after ${b}ms`);
    d.stack = `Error: ${d.message}`;
    c(d);
  }, b);
}
function jb(a, b) {
  let c;
  const d = new Promise((f, e) => {
    c = ib(a, b, e);
  });
  return {timeout:c, f:d};
}
async function kb(a, b, c) {
  if (!(a instanceof Promise)) {
    throw Error("Promise expected");
  }
  if (!b) {
    throw Error("Timeout must be a number");
  }
  if (0 > b) {
    throw Error("Timeout cannot be negative");
  }
  const {f:d, timeout:f} = jb(c, b);
  try {
    return await Promise.race([a, d]);
  } finally {
    clearTimeout(f);
  }
}
;function lb(a, b = {}) {
  const {timeout:c, password:d = !1, output:f = process.stdout, input:e = process.stdin, ...g} = b;
  b = hb({input:e, output:f, ...g});
  if (d) {
    const l = b.output;
    b._writeToOutput = k => {
      if (["\r\n", "\n", "\r"].includes(k)) {
        return l.write(k);
      }
      k = k.split(a);
      "2" == k.length ? (l.write(a), l.write("*".repeat(k[1].length))) : l.write("*");
    };
  }
  var h = new Promise(b.question.bind(b, a));
  h = c ? kb(h, c, `reloquent: ${a}`) : h;
  b.promise = mb(h, b);
  return b;
}
const mb = async(a, b) => {
  try {
    return await a;
  } finally {
    b.close();
  }
};
async function nb(a, b) {
  if ("object" != typeof a) {
    throw Error("Please give an object with questions");
  }
  return await Object.keys(a).reduce(async(c, d) => {
    c = await c;
    var f = a[d];
    switch(typeof f) {
      case "object":
        f = {...f};
        break;
      case "string":
        f = {text:f};
        break;
      default:
        throw Error("A question must be a string or an object.");
    }
    f.text = `${f.text}${f.text.endsWith("?") ? "" : ":"} `;
    var e;
    if (f.defaultValue) {
      var g = f.defaultValue;
    }
    f.getDefault && (e = await f.getDefault());
    let h = g || "";
    g && e && g != e ? h = `\x1b[90m${g}\x1b[0m` : g && g == e && (h = "");
    g = e || "";
    ({promise:g} = lb(`${f.text}${h ? `[${h}] ` : ""}${g ? `[${g}] ` : ""}`, {timeout:b, password:f.password}));
    e = await g || e || f.defaultValue;
    "function" == typeof f.validation && f.validation(e);
    "function" == typeof f.postProcess && (e = await f.postProcess(e));
    return {...c, [d]:e};
  }, {});
}
;async function Y(a, b = {}) {
  const {defaultYes:c = !0, timeout:d} = b;
  b = a.endsWith("?");
  a = `${b ? a.replace(/\?$/, "") : a} (y/n)${b ? "?" : ""}`;
  ({question:a} = await nb({question:{text:a, defaultValue:c ? "y" : "n"}}, d));
  return "y" == a;
}
;var ob = async a => {
  const b = await P("Fetching the list of templates", Sa(a));
  a = Object.keys(b).map(c => {
    const d = b[c];
    let f = "-", e = "-";
    try {
      f = d.settings.index.number_of_shards;
    } catch (g) {
    }
    try {
      e = d.settings.index.number_of_replicas;
    } catch (g) {
    }
    return {name:c, patterns:d.index_patterns.join("\n"), shards:f, replicas:e};
  });
  a = X({keys:["name", "patterns", "shards", "replicas"], data:a, headings:{name:"Name", patterns:"Patterns", shards:"Shards", replicas:"Replicas"}});
  console.log(a);
};
var qb = async a => {
  const b = await P("Fetching stats", Ta(a));
  a = Object.keys(b.indices).map(c => {
    if (!c.startsWith(".")) {
      var d = b.indices[c].total;
      return {name:c, memory:pb(d.segments.memory_in_bytes), docs:`${d.docs.count}`, size:`${pb(d.store.size_in_bytes)}`};
    }
  }).filter(Boolean);
  a = X({keys:["name", "memory", "docs", "size"], data:a, headings:{name:"Name", memory:"Memory", docs:"Docs", size:"Size"}});
  console.log(a);
};
const pb = a => {
  let b = 0;
  for (; 1023 < a && 3 > b;) {
    b += 1, a /= 1024;
  }
  return `${Math.floor(10 * a) / 10} ${rb[b]}`;
}, rb = ["B", "KB", "MB", "GB"];
async function sb(a) {
  if (!ma) {
    throw Error("Bucket name is required (use --bucket).");
  }
  const b = Q(I, "yellow");
  a = a.put(`_snapshot/${I}`, {}, {type:"s3", settings:{bucket:ma}});
  a = await P(`Registering ${b} snapshot repository`, a);
  console.log("Successfully registered %s", b);
  return a;
}
async function tb(a) {
  const b = Q(J, "yellow");
  await Y(`Are you sure you want to unregister ${b} backup repository`) && (a = a.delete(`_snapshot/${J}`), await P(`Unregistering ${b} snapshot repository`, a), console.log("Successfully unregistered %s", Q(J, "yellow")));
}
function Z(a, b) {
  return Q(a, "yellow") + Q("/", "magenta") + Q(b, "yellow");
}
async function ub(a) {
  var b = Z(J, K);
  a = a.a(`_snapshot/${J}/${K}/_status`);
  ({snapshots:b} = await P(`Getting ${b} snapshot status`, a));
  console.log(T(b, {colors:!0, depth:Infinity}));
}
async function vb(a) {
  a = await P("Fetching snapshot repositories", a.a("_snapshot"));
  wb(a);
}
async function xb(a) {
  const b = Z(J, K);
  if (await Y(`Are you sure you want to delete ${b} snapshot`)) {
    if ({u:a} = await P(`Deleting ${b} snapshot`, a.delete(`_snapshot/${J}/${K}`)), a) {
      console.log("Successfully deleted %s", b);
    } else {
      throw Error("not acknowledged");
    }
  }
}
async function yb(a) {
  var b = Q(J, "yellow");
  a = a.a(`_snapshot/${J}/_status`);
  b = await P(`Getting ${b} repository status`, a);
  console.log(b);
}
async function zb(a) {
  var b = Q(J, "yellow"), c = a.a(`_snapshot/${J}`);
  c = await P(`Getting ${b} repository info`, c);
  wb(c);
  a = a.a(`_snapshot/${J}/_all`);
  ({snapshots:b} = await P(`Getting ${b} repository snapshots`, a));
  console.log();
  Ab(b);
}
async function Bb(a) {
  const b = Z(J, K);
  await Y(`Continue with ${b} snapshot`) && ({snapshot:a} = await P(`Creating snapshot ${b}`, a.put(`_snapshot/${J}/${K}`, {wait_for_completion:!0}, null, {timeout:null})), Ab([a]));
}
class Cb {
  constructor(a, b = 15000) {
    this.url = a;
    this.timeout = b;
  }
  async delete(a, b = {}, c, d) {
    return await this.a(a, {...b, method:"DELETE"}, c, d);
  }
  async put(a, b, c, d = {}) {
    return await this.a(a, {...d, method:"PUT"}, b, c);
  }
  async a(a, b = {}, c, d) {
    return await W(`${this.url}/${a}`, {b:{timeout:this.timeout, ...b}, query:c}, d);
  }
  async status() {
    var a = this.a("_snapshot/_status");
    a = await P("Getting snapshots status", a);
    console.log(a);
  }
  async restore(a, b) {
    var c = Z(a, b);
    await Y(`Are you sure you want to restore ${c} snapshot`) && (a = this.a(`_snapshot/${a}/${b}/_restore`, {method:"POST", timeout:null}, {wait_for_completion:!0}), c = await P(`Restoring ${c} snapshot`, a), console.log(c));
  }
}
const wb = a => {
  Object.keys(a).length ? (a = Object.entries(a).map(([b, {type:c, settings:d}]) => {
    d = Object.entries(d).map(([f, e]) => `${Q(f, "green")}: ${e}`).join("\n");
    return {key:b, type:c, settings:d};
  }), a = X({keys:["key", "type", "settings"], data:a, headings:{key:"Name", type:"Type", settings:"Settings"}}), console.log(a)) : console.log("No registered snapshot repositories.");
}, Ab = a => {
  a = X({keys:["snapshot", "version", "start_time", "end_time", "indices"], data:a.map(b => {
    b.indices = b.indices.join("\n");
    b.start_time = (new Date(b.start_time)).toLocaleString();
    b.end_time = (new Date(b.end_time)).toLocaleString();
    return b;
  }), headings:{snapshot:"Snapshot", version:"Version", start_time:"Start Time", start_end:"End Time", indices:"Indices"}});
  console.log(a);
};
const Db = path.join, Eb = path.parse;
const Fb = fs.readFileSync;
async function Gb(a) {
  if (!la) {
    throw Error("Please pass the path with -p flag.");
  }
  var b = JSON.parse(Fb(H, "utf8"));
  a = `${/^https?:\/\//.test(a) ? a : `http://${a}`}/${la}`;
  console.log(`Posting data to ${a}\n`, T(b, {colors:!0}));
  if (await Y("Continue?")) {
    b = await Oa(a, {method:"POST", data:b});
    if (b.error) {
      throw Error(b.error);
    }
    console.log(b);
  }
}
;if (ka) {
  const a = require("../../package.json");
  console.log(a);
  process.exit();
} else {
  if (fa) {
    {
      const a = S({description:`ElasticSearch utility for creating a pipeline and index templates\nfor logging request using ${R("logarithm", "green")} middleware.`, line:"logarithm <url> [-TPS] [-p pipeline] [-d]", usage:q(t)});
      console.log(a);
      const b = S({description:`${Q("Snapshots", "cyan")}: used to print info, create and restore snapshots.`, line:"logarithm <url> [-r repo] [-s snapshot] [-s3 snapshot --bucket bucket] [--status|-d]", usage:q(w)});
      console.log(b);
      const c = S({description:`${Q("Templates", "red")}: creates a template for an app.`, line:"logarithm <url> -t {app-name} [-s shards] [-r replicas] [-d]", usage:q(A)});
      console.log(c);
      const d = S({description:`${Q("Methods", "blue")}: send data from JSON files.`, line:"logarithm <url> --[post] -p path", usage:q(u)});
      console.log(d);
    }
    process.exit();
  }
}
(async() => {
  try {
    if (!C) {
      throw Error("No ElasticSearch URL.");
    }
    let b = C;
    /:\d+$/.test(b) || (b = `${b}:9200`);
    if (H) {
      return await Gb(b);
    }
    if (ea) {
      return await db(b);
    }
    if (F && D) {
      await Y(`Are you sure you want to delete pipeline ${Q(F, "yellow")}`, {defaultYes:!1}) && (await P(`Removing ${Q(F, "yellow")} pipeline`, Ya(b)), console.log("Pipeline %s removed.", R(F, "red")));
    } else {
      if (F) {
        await P(`Creating a pipeline ${Q(F, "yellow")}`, Qa(b)), console.log("Pipeline %s created.", Q(F, "green"));
      } else {
        if (E && D) {
          await Y(`Are you sure you want to delete index ${Q(E, "yellow")}`, {defaultYes:!1}) && (await P(`Deleting ${Q(E, "yellow")} index`, gb(b)), console.log("Successfully deleted index %s", Q(E, "red")));
        } else {
          if (E && M) {
            const c = require(Db(process.cwd(), M)), {name:d} = Eb(M);
            return await Y(`Create template ${Q(d, "magenta")} for index ${Q(E, "yellow")}\n${T({...c, index_patterns:[E]}, {colors:!0, depth:null, breakLength:20})}`) ? await P(`Creating template on index ${Q(E, "yellow")}`, eb(b, d, c)) : void 0;
          }
          if (M) {
            return await Y(`Create template ${Q(M, "yellow")}-* with ${N} shard${1 < N ? "s" : ""} and ${O} replica${0 == O || 1 < O ? "s" : ""}`) ? await P(`Creating ${Q(M, "yellow")} template`, fb(b)) : void 0;
          }
          if (da) {
            return await ob(b);
          }
          var a = new Cb(b, 5000);
          if (G && L) {
            return await a.status();
          }
          if (J && K && L) {
            return await ub(a);
          }
          if (J && K && D) {
            return await xb(a);
          }
          if (J && K && na) {
            return await a.restore(J, K);
          }
          if (J && K) {
            return await Bb(a);
          }
          if (J && L) {
            return await yb(a);
          }
          if (J && D) {
            return await tb(a);
          }
          if (J) {
            return await zb(a);
          }
          if (G) {
            return await vb(a);
          }
          if (I) {
            return await sb(a);
          }
          if (ca) {
            return await qb(b);
          }
        }
      }
    }
  } catch (b) {
    console.log(process.env.DEBUG ? b.stack : R(b.message, "red"));
  }
})();

