#!/usr/bin/env node
             
const path = require('path');
const util = require('util');
const querystring = require('querystring');
const https = require('https');
const http = require('http');
const url = require('url');
const os = require('os');
const zlib = require('zlib');
const stream = require('stream');
const readline = require('readline');             
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
}, r = a => Object.keys(a).reduce((b, c) => {
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
short:"p"}, pipelines:{description:"Display installed pipelines.", boolean:!0, short:"P"}, snapshots:{description:"List registered snapshot repositories.", boolean:!0, short:"S"}, help:{description:"Print the help information and exit.", boolean:!0, short:"h"}, version:{description:"Show the version's number and exit.", boolean:!0, short:"v"}}, v = {"repository-s3":{description:"Create a new `s3` snapshot repo with this name.", short:"s3"}, bucket:{description:"The bucket name for the `s3` snapshot repository."}, 
repo:{description:"The name of the repo.", short:"r"}, snapshot:{description:"The name of the snapshot.", short:"s"}, restore:{description:"Restore this snapshot.", boolean:!0}, status:{description:"Fetch the status.", boolean:!0}}, w = {template:{description:"Create an index template for storing\nlog data in the `{template}-*` index.", short:"t"}, shards:{description:"The number of shards for index template.", number:!0, default:"1", short:"s"}, replicas:{description:"The number of replicas for index template.", 
number:!0, short:"r"}}, A = function(a = {}, b = process.argv) {
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
      const n = l.short, p = l.boolean, q = l.number, u = l.command, m = l.multiple;
      if (u && m && d.length) {
        k = d;
      } else {
        if (u && d.length) {
          k = d[0];
        } else {
          const x = aa(c, h, n, p, q);
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
}({...t, ...v, ...w}), B = A.url, ca = A.stats, ha = A.templates, C = A["delete"], D = A.index, E = A.pipeline, ia = A.pipelines, F = A.snapshots, ja = A.help, ka = A.version, G = A["repository-s3"], H = A.bucket, I = A.repo, J = A.snapshot, la = A.restore, K = A.status, L = A.template, M = A.shards || 1, N = A.replicas || 0;
async function O(a, b) {
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
const ma = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, na = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function P(a, b) {
  return (b = ma[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function Q(a, b) {
  return (b = na[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;function R(a = {usage:{}}) {
  const {usage:b = {}, description:c, line:d, example:f} = a;
  a = Object.keys(b);
  const e = Object.values(b), [g] = a.reduce(([k = 0, n = 0], p) => {
    const q = b[p].split("\n").reduce((u, m) => m.length > u ? m.length : u, 0);
    q > n && (n = q);
    p.length > k && (k = p.length);
    return [k, n];
  }, []), h = (k, n) => {
    n = " ".repeat(n - k.length);
    return `${k}${n}`;
  };
  a = a.reduce((k, n, p) => {
    p = e[p].split("\n");
    n = h(n, g);
    const [q, ...u] = p;
    n = `${n}\t${q}`;
    const m = h("", g);
    p = u.map(x => `${m}\t${x}`);
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
;const oa = https.request;
const pa = http.request;
const qa = util.debuglog, S = util.inspect;
const T = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, ra = (a, b = !1) => T(a, 2 + (b ? 1 : 0)), sa = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const ta = os.homedir;
const ua = /\s+at.*(?:\(|\s)(.*)\)?/, va = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, wa = ta(), xa = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, d = c.join("|"), f = new RegExp(va.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter(e => {
    e = e.match(ua);
    if (null === e || !e[1]) {
      return !0;
    }
    e = e[1];
    return e.includes(".app/Contents/Resources/electron.asar") || e.includes(".app/Contents/Resources/default_app.asar") ? !1 : !f.test(e);
  }).filter(e => e.trim()).map(e => b ? e.replace(ua, (g, h) => g.replace(h, h.replace(wa, "~"))) : e).join("\n");
};
function ya(a, b, c = !1) {
  return function(d) {
    var f = sa(arguments), {stack:e} = Error();
    const g = T(e, 2, !0), h = (e = d instanceof Error) ? d.message : d;
    f = [`Error: ${h}`, ...null !== f && a === f || c ? [b] : [g, b]].join("\n");
    f = xa(f);
    return Object.assign(e ? d : Error(), {message:h, stack:f});
  };
}
;function U(a) {
  var {stack:b} = Error();
  const c = sa(arguments);
  b = ra(b, a);
  return ya(c, b, a);
}
;const za = url.parse;
const Aa = stream.Writable;
const Ba = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class Ca extends Aa {
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
          const n = xa(k.stack);
          k.stack = n;
          e && g`${k}`;
        }
        l(k);
      });
      c && Ba(this, c).pipe(this);
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
const Da = async(a, b = {}) => {
  ({f:a} = new Ca({rs:a, ...b, c:U(!0)}));
  return await a;
};
const Ea = zlib.createGunzip;
const Fa = (a, b, c = {}) => {
  const {justHeaders:d, binary:f, c:e = U(!0)} = c;
  let g, h, l, k, n = 0, p = 0;
  c = (new Promise((q, u) => {
    g = a(b, async m => {
      ({headers:h} = m);
      l = {statusMessage:m.statusMessage, statusCode:m.statusCode};
      if (d) {
        m.destroy();
      } else {
        var x = "gzip" == m.headers["content-encoding"];
        m.on("data", y => n += y.byteLength);
        m = x ? m.pipe(Ea()) : m;
        k = await Da(m, {binary:f});
        p = k.length;
      }
      q();
    }).on("error", m => {
      m = e(m);
      u(m);
    }).on("timeout", () => {
      g.abort();
    });
  })).then(() => ({body:k, headers:h, ...l, j:n, byteLength:p, h:null}));
  return {a:g, f:c};
};
const Ga = (a = {}) => Object.keys(a).reduce((b, c) => {
  const d = a[c];
  c = `${encodeURIComponent(c)}=${encodeURIComponent(d)}`;
  return [...b, c];
}, []).join("&").replace(/%20/g, "+"), Ha = async(a, b, {data:c, justHeaders:d, binary:f, c:e = U(!0)}) => {
  const {a:g, f:h} = Fa(a, b, {justHeaders:d, binary:f, c:e});
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
const Ia = qa("aqt"), Ja = async(a, b = {}) => {
  const {data:c, type:d = "json", headers:f = {"User-Agent":`Mozilla/5.0 (Node.JS) ${V}`}, compress:e = !0, binary:g = !1, justHeaders:h = !1, method:l, timeout:k} = b;
  b = U(!0);
  const {hostname:n, protocol:p, port:q, path:u} = za(a), m = "https:" === p ? oa : pa, x = {hostname:n, port:q, path:u, headers:{...f}, timeout:k, method:l};
  if (c) {
    var y = d;
    var z = c;
    switch(y) {
      case "json":
        z = JSON.stringify(z);
        y = "application/json";
        break;
      case "form":
        z = Ga(z), y = "application/x-www-form-urlencoded";
    }
    z = {data:z, contentType:y};
    ({data:y} = z);
    z = z.contentType;
    x.method = l || "POST";
    "Content-Type" in x.headers || (x.headers["Content-Type"] = z);
    "Content-Length" in x.headers || (x.headers["Content-Length"] = Buffer.byteLength(y));
  }
  !e || "Accept-Encoding" in x.headers || (x.headers["Accept-Encoding"] = "gzip, deflate");
  const {body:Qa, headers:Ra, byteLength:da, statusCode:Sa, statusMessage:Ta, j:ea, h:fa} = await Ha(m, x, {data:y, justHeaders:h, binary:g, c:b});
  Ia("%s %s B%s", a, da, `${da != ea ? ` (raw ${ea} B)` : ""}`);
  return {body:fa ? fa : Qa, headers:Ra, statusCode:Sa, statusMessage:Ta};
};
const Ka = async(a, b = {}) => {
  ({body:a} = await Ja(a, b));
  return a;
};
const La = querystring.stringify;
const Ma = async() => {
  await W(`${B}/_ingest/pipeline/${E}`, {b:{method:"PUT", timeout:5000}}, {description:"IP Address And UserAgent", processors:[{geoip:{field:"ip"}}, {user_agent:{field:"headers.user-agent"}}]});
}, Na = async() => await W(`${B}/_ingest/pipeline`, {b:{timeout:5000}}), Oa = async() => await W(`${B}/_template`, {b:{timeout:5000}}), Pa = async() => await W(`${B}/_stats`, {b:{timeout:10000}}), Ua = async() => await W(`${B}/_ingest/pipeline/${E}`, {b:{method:"DELETE", timeout:5000}}), W = async(a, {b, query:c = {}} = {}, d) => {
  const f = U();
  c = La(c);
  const {error:e, ...g} = await Ka(`${/^https?:\/\//.test(a) ? a : `http://${a}`}${c ? `?${c}` : ""}`, {...b, data:d});
  if (e) {
    throw a = Error("string" == typeof e ? e : e.reason), e.type && (a.type = e.type), f(a);
  }
  return g;
};
const Va = a => ({value:`\x1b[1m${a}\x1b[0m`, length:a.length}), Wa = a => a.reduce((b, c) => ({...b, [c]:!0}), {});
function X(a) {
  const {keys:b = [], data:c = [], headings:d = {}, replacements:f = {}, centerValues:e = [], centerHeadings:g = []} = a;
  var [h] = c;
  if (!h) {
    return "";
  }
  const l = Wa(e);
  a = Wa(g);
  h = Object.keys(h).reduce((p, q) => {
    const u = d[q];
    return {...p, [q]:u ? u.length : q.length};
  }, {});
  const k = c.reduce((p, q) => Object.keys(q).reduce((u, m) => {
    const x = p[m], {length:y} = Xa(f, m)(q[m]);
    return {...u, [m]:Math.max(y, x)};
  }, {}), h);
  h = b.reduce((p, q) => ({...p, [q]:d[q] || q}), {});
  const n = b.reduce((p, q) => ({...p, [q]:Va}), {});
  a = Ya(b, h, k, n, a);
  h = c.map(p => Ya(b, p, k, f, l));
  return [a, ...h].join("\n");
}
const Za = (a, b, c, d) => {
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
}, Xa = (a, b) => (a = a[b]) ? a : c => ({value:c, length:`${c}`.replace(/\033\[.*?m/g, "").length}), Ya = (a, b, c, d = {}, f = {}) => {
  let e = 0;
  return a.map(g => {
    const h = c[g];
    if (!h) {
      throw Error(`Unknown field ${g}`);
    }
    var l = b[g];
    const k = Xa(d, g), n = f[g], [p, ...q] = `${l}`.split("\n");
    g = Za(p, h, k, n);
    l = "";
    q.length && (l = "\n" + q.map(u => {
      const m = " ".repeat(e);
      u = Za(u, h, k, n);
      return `${m}${u}`;
    }).join("\n"));
    e += h + 2;
    return `${g}${l}`;
  }).join("  ");
};
var $a = async() => {
  const a = await O("Fetching the list of pipelines", Na());
  var b = Object.keys(a).map(c => {
    const d = a[c];
    return {name:c, description:d.description, processors:d.processors.map(f => Object.keys(f).map(e => `${P(e, "magenta")}: ${f[e].field}`).join(", ")).join("\n")};
  });
  b = X({keys:["name", "description", "processors"], data:b, headings:{name:"Name", description:"Description", processors:"Processors"}});
  console.log(b);
};
const ab = async(a, b) => await W(`${B}/_template/${a}`, {b:{method:"PUT", timeout:5000}}, {...b, index_patterns:[D]}), bb = async() => {
  var {m:a = 1, l:b = 0} = {m:M, l:N};
  const c = `${L}-*`, d = `hits-${L}`, f = await W(`${B}/_template/${d}`, {b:{method:"PUT", timeout:5000}}, {settings:{number_of_shards:a, number_of_replicas:b}, version:1, index_patterns:[c]});
  setTimeout(() => {
    console.log("Created %s%s", P(d, "green"), " template");
    console.log("%s%s indices with %s shard%s and %s replica%s", "for     ", P(c, "grey"), a, 1 < a ? "s" : "", b, 0 == b || 1 < b ? "s" : "");
  }, 1);
  return f;
}, cb = async() => await W(`${B}/${D}`, {b:{method:"DELETE", timeout:5000}});
const db = readline.createInterface;
function eb(a, b, c) {
  return setTimeout(() => {
    const d = Error(`${a ? a : "Promise"} has timed out after ${b}ms`);
    d.stack = `Error: ${d.message}`;
    c(d);
  }, b);
}
function fb(a, b) {
  let c;
  const d = new Promise((f, e) => {
    c = eb(a, b, e);
  });
  return {timeout:c, f:d};
}
async function gb(a, b, c) {
  if (!(a instanceof Promise)) {
    throw Error("Promise expected");
  }
  if (!b) {
    throw Error("Timeout must be a number");
  }
  if (0 > b) {
    throw Error("Timeout cannot be negative");
  }
  const {f:d, timeout:f} = fb(c, b);
  try {
    return await Promise.race([a, d]);
  } finally {
    clearTimeout(f);
  }
}
;function hb(a, b = {}) {
  const {timeout:c, password:d = !1, output:f = process.stdout, input:e = process.stdin, ...g} = b;
  b = db({input:e, output:f, ...g});
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
  h = c ? gb(h, c, `reloquent: ${a}`) : h;
  b.promise = ib(h, b);
  return b;
}
const ib = async(a, b) => {
  try {
    return await a;
  } finally {
    b.close();
  }
};
async function jb(a, b) {
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
    ({promise:g} = hb(`${f.text}${h ? `[${h}] ` : ""}${g ? `[${g}] ` : ""}`, {timeout:b, password:f.password}));
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
  ({question:a} = await jb({question:{text:a, defaultValue:c ? "y" : "n"}}, d));
  return "y" == a;
}
;var kb = async() => {
  const a = await O("Fetching the list of templates", Oa());
  var b = Object.keys(a).map(c => {
    const d = a[c];
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
  b = X({keys:["name", "patterns", "shards", "replicas"], data:b, headings:{name:"Name", patterns:"Patterns", shards:"Shards", replicas:"Replicas"}});
  console.log(b);
};
var mb = async() => {
  const a = await O("Fetching stats", Pa());
  var b = Object.keys(a.indices).map(c => {
    if (!c.startsWith(".")) {
      var d = a.indices[c].total;
      return {name:c, memory:lb(d.segments.memory_in_bytes), docs:`${d.docs.count}`, size:`${lb(d.store.size_in_bytes)}`};
    }
  }).filter(Boolean);
  b = X({keys:["name", "memory", "docs", "size"], data:b, headings:{name:"Name", memory:"Memory", docs:"Docs", size:"Size"}});
  console.log(b);
};
const lb = a => {
  let b = 0;
  for (; 1023 < a && 3 > b;) {
    b += 1, a /= 1024;
  }
  return `${Math.floor(10 * a) / 10} ${nb[b]}`;
}, nb = ["B", "KB", "MB", "GB"];
async function ob(a) {
  if (!H) {
    throw Error("Bucket name is required (use --bucket).");
  }
  const b = P(G, "yellow");
  a = a.put(`_snapshot/${G}`, {}, {type:"s3", settings:{bucket:H}});
  a = await O(`Registering ${b} snapshot repository`, a);
  console.log("Successfully registered %s", b);
  return a;
}
async function pb(a) {
  const b = P(I, "yellow");
  await Y(`Are you sure you want to unregister ${b} backup repository`) && (a = a.delete(`_snapshot/${I}`), await O(`Unregistering ${b} snapshot repository`, a), console.log("Successfully unregistered %s", P(I, "yellow")));
}
function Z(a, b) {
  return P(a, "yellow") + P("/", "magenta") + P(b, "yellow");
}
async function qb(a) {
  var b = Z(I, J);
  a = a.a(`_snapshot/${I}/${J}/_status`);
  ({snapshots:b} = await O(`Getting ${b} snapshot status`, a));
  console.log(S(b, {colors:!0, depth:Infinity}));
}
async function rb(a) {
  a = await O("Fetching snapshot repositories", a.a("_snapshot"));
  sb(a);
}
async function tb(a) {
  const b = Z(I, J);
  if (await Y(`Are you sure you want to delete ${b} snapshot`)) {
    if ({u:a} = await O(`Deleting ${b} snapshot`, a.delete(`_snapshot/${I}/${J}`)), a) {
      console.log("Successfully deleted %s", b);
    } else {
      throw Error("not acknowledged");
    }
  }
}
async function ub(a) {
  var b = P(I, "yellow");
  a = a.a(`_snapshot/${I}/_status`);
  b = await O(`Getting ${b} repository status`, a);
  console.log(b);
}
async function vb(a) {
  var b = P(I, "yellow"), c = a.a(`_snapshot/${I}`);
  c = await O(`Getting ${b} repository info`, c);
  sb(c);
  a = a.a(`_snapshot/${I}/_all`);
  ({snapshots:b} = await O(`Getting ${b} repository snapshots`, a));
  console.log();
  wb(b);
}
async function xb(a) {
  const b = Z(I, J);
  await Y(`Continue with ${b} snapshot`) && ({snapshot:a} = await O(`Creating snapshot ${b}`, a.put(`_snapshot/${I}/${J}`, {wait_for_completion:!0}, null, {timeout:null})), wb([a]));
}
class yb {
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
    a = await O("Getting snapshots status", a);
    console.log(a);
  }
  async restore(a, b) {
    var c = Z(a, b);
    await Y(`Are you sure you want to restore ${c} snapshot`) && (a = this.a(`_snapshot/${a}/${b}/_restore`, {method:"POST", timeout:null}, {wait_for_completion:!0}), c = await O(`Restoring ${c} snapshot`, a), console.log(c));
  }
}
const sb = a => {
  Object.keys(a).length ? (a = Object.entries(a).map(([b, {type:c, settings:d}]) => {
    d = Object.entries(d).map(([f, e]) => `${P(f, "green")}: ${e}`).join("\n");
    return {key:b, type:c, settings:d};
  }), a = X({keys:["key", "type", "settings"], data:a, headings:{key:"Name", type:"Type", settings:"Settings"}}), console.log(a)) : console.log("No registered snapshot repositories.");
}, wb = a => {
  a = X({keys:["snapshot", "version", "start_time", "end_time", "indices"], data:a.map(b => {
    b.indices = b.indices.join("\n");
    b.start_time = (new Date(b.start_time)).toLocaleString();
    b.end_time = (new Date(b.end_time)).toLocaleString();
    return b;
  }), headings:{snapshot:"Snapshot", version:"Version", start_time:"Start Time", start_end:"End Time", indices:"Indices"}});
  console.log(a);
};
const zb = path.join, Ab = path.parse;
if (ka) {
  const a = require("../../package.json");
  console.log(a);
  process.exit();
} else {
  if (ja) {
    {
      const a = R({description:`ElasticSearch utility for creating a pipeline and index templates\nfor logging request using ${Q("logarithm", "green")} middleware.`, line:"logarithm <url> [-TPS] [-p pipeline] [-d]", usage:r(t)});
      console.log(a);
      const b = R({description:`${P("Snapshots", "cyan")}: used to print info, create and restore snapshots.`, line:"logarithm <url> [-r repo] [-s snapshot] [-s3 snapshot --bucket bucket] [--status|-d]", usage:r(v)});
      console.log(b);
      const c = R({description:`${P("Templates", "red")}: creates a template for an app.`, line:"lagarithm <url> -t {app-name} [-s shards] [-r replicas] [-d]", usage:r(w)});
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
      return await $a();
    }
    if (E && C) {
      await Y(`Are you sure you want to delete pipeline ${P(E, "yellow")}`, {defaultYes:!1}) && (await O(`Removing ${P(E, "yellow")} pipeline`, Ua()), console.log("Pipeline %s removed.", Q(E, "red")));
    } else {
      if (E) {
        await O(`Creating a pipeline ${P(E, "yellow")}`, Ma()), console.log("Pipeline %s created.", P(E, "green"));
      } else {
        if (D && C) {
          await Y(`Are you sure you want to delete index ${P(D, "yellow")}`, {defaultYes:!1}) && (await O(`Deleting ${P(D, "yellow")} index`, cb()), console.log("Successfully deleted index %s", P(D, "red")));
        } else {
          if (D && L) {
            const b = require(zb(process.cwd(), L)), {name:c} = Ab(L);
            return await Y(`Create template ${P(c, "magenta")} for index ${P(D, "yellow")}\n${S({...b, index_patterns:[D]}, {colors:!0, depth:null, breakLength:20})}`) ? await O(`Creating template on index ${P(D, "yellow")}`, ab(c, b)) : void 0;
          }
          if (L) {
            return await Y(`Create template ${P(L, "yellow")}-* with ${M} shard${1 < M ? "s" : ""} and ${N} replica${0 == N || 1 < N ? "s" : ""}`) ? await O(`Creating ${P(L, "yellow")} template`, bb()) : void 0;
          }
          if (ha) {
            return await kb();
          }
          var a = new yb(B, 5000);
          if (F && K) {
            return await a.status();
          }
          if (I && J && K) {
            return await qb(a);
          }
          if (I && J && C) {
            return await tb(a);
          }
          if (I && J && la) {
            return await a.restore(I, J);
          }
          if (I && J) {
            return await xb(a);
          }
          if (I && K) {
            return await ub(a);
          }
          if (I && C) {
            return await pb(a);
          }
          if (I) {
            return await vb(a);
          }
          if (F) {
            return await rb(a);
          }
          if (G) {
            return await ob(a);
          }
          if (ca) {
            return await mb();
          }
        }
      }
    }
  } catch (b) {
    console.log(process.env.DEBUG ? b.stack : Q(b.message, "red"));
  }
})();

