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
const u = (a, b, c, e = !1, d = !1) => {
  const f = c ? new RegExp(`^-(${c}|-${b})`) : new RegExp(`^--${b}`);
  b = a.findIndex(g => f.test(g));
  if (-1 == b) {
    return {argv:a};
  }
  if (e) {
    return {value:!0, argv:[...a.slice(0, b), ...a.slice(b + 1)]};
  }
  e = b + 1;
  c = a[e];
  if (!c || "string" == typeof c && c.startsWith("--")) {
    return {argv:a};
  }
  d && (c = parseInt(c, 10));
  return {value:c, argv:[...a.slice(0, b), ...a.slice(e + 1)]};
}, x = a => {
  const b = [];
  for (let c = 0; c < a.length; c++) {
    const e = a[c];
    if (e.startsWith("-")) {
      break;
    }
    b.push(e);
  }
  return b;
};
const y = function(a = {}, b = process.argv) {
  [, , ...b] = b;
  const c = x(b);
  b = b.slice(c.length);
  let e = !c.length;
  return Object.keys(a).reduce(({b:d, ...f}, g) => {
    if (0 == d.length && e) {
      return {b:d, ...f};
    }
    const k = a[g];
    let l;
    if ("string" == typeof k) {
      ({value:l, argv:d} = u(d, g, k));
    } else {
      try {
        const {short:h, boolean:n, number:m, command:p, multiple:r} = k;
        p && r && c.length ? (l = c, e = !0) : p && c.length ? (l = c[0], e = !0) : {value:l, argv:d} = u(d, g, h, n, m);
      } catch (h) {
        return {b:d, ...f};
      }
    }
    return void 0 === l ? {b:d, ...f} : {b:d, ...f, [g]:l};
  }, {b});
}({url:{command:!0}, help:{short:"h", boolean:!0}, template:{short:"t"}, shards:{short:"s", type:"number"}, replicas:{short:"r", type:"number"}, templates:{short:"T", boolean:!0}, stats:{short:"S", boolean:!0}, "delete":{short:"d"}, pipeline:{short:"p"}, pipelines:{short:"P", boolean:!0}, "remove-pipeline":{}, version:{short:"v", boolean:!0}}), z = y.url, A = y.help, B = y.version, C = y.pipeline, D = y.template, E = y["delete"], aa = y.shards, ba = y.replicas, ca = y.pipelines, da = y.stats, ea = 
y.templates, F = y["remove-pipeline"];
async function G(a, b) {
  const {interval:c = 250, writable:e = process.stdout} = {};
  b = "function" == typeof b ? b() : b;
  const d = e.write.bind(e);
  let f = 1, g = `${a}${".".repeat(f)}`;
  d(g);
  const k = setInterval(() => {
    f = (f + 1) % 4;
    g = `${a}${".".repeat(f)}`;
    d(`\r${" ".repeat(a.length + 3)}\r`);
    d(g);
  }, c);
  try {
    return await b;
  } finally {
    clearInterval(k), d(`\r${" ".repeat(a.length + 3)}\r`);
  }
}
;/*
 diff package https://github.com/kpdecker/jsdiff
 BSD License
 Copyright (c) 2009-2015, Kevin Decker <kpdecker@gmail.com>
*/
const fa = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, ha = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function I(a, b) {
  return (b = fa[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function J(a, b) {
  return (b = ha[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;function ia() {
  const {usage:a = {}, description:b, line:c, example:e} = {description:`ElasticSearch utility for creating a pipeline and index templates\nfor logging request using ${J("logarithm", "green")} middleware.`, line:"logarithm $ELASTIC [-TPS] [-t index -sr] [-p|rp pipeline] [-d index]", usage:{"-t, --template name":"Create an index template for storing\nlog data in name-* index.", " -s, --shards":"Number of shards for index template.\nDefault 1.", " -r, --replicas":"Number of replicas for index template.\nDefault 0.", 
  "-T, --templates":"List index templates.", "-S, --stats":"Display statistics by indices.", "-d, --delete name":"Delete an index.", "-P, --pipelines":"Display installed pipelines.", "-p, --pipeline name":"Create a pipeline with User-Agent\nand GeoIp plugins.", "--remove-pipeline":"Removes the pipeline.", "-h, --help":"Show the help message.", "-v, --version":"Show the version information."}};
  var d = Object.keys(a);
  const f = Object.values(a), [g] = d.reduce(([h = 0, n = 0], m) => {
    const p = a[m].split("\n").reduce((r, q) => q.length > r ? q.length : r, 0);
    p > n && (n = p);
    m.length > h && (h = m.length);
    return [h, n];
  }, []), k = (h, n) => {
    n = " ".repeat(n - h.length);
    return `${h}${n}`;
  };
  d = d.reduce((h, n, m) => {
    m = f[m].split("\n");
    n = k(n, g);
    const [p, ...r] = m;
    n = `${n}\t${p}`;
    const q = k("", g);
    m = r.map(t => `${q}\t${t}`);
    return [...h, n, ...m];
  }, []).map(h => `\t${h}`);
  const l = [b, `  ${c || ""}`].filter(h => h ? h.trim() : h).join("\n\n");
  d = `${l ? `${l}\n` : ""}
${d.join("\n")}
`;
  return e ? `${d}
  Example:

    ${e}
` : d;
}
;const {request:ja} = https;
const {request:ka} = http;
const {debuglog:la} = util;
const K = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, ma = (a, b = !1) => K(a, 2 + (b ? 1 : 0)), L = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:na} = os;
const M = /\s+at.*(?:\(|\s)(.*)\)?/, oa = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, pa = na(), N = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, e = new RegExp(oa.source.replace("IGNORED_MODULES", c.join("|")));
  return a.replace(/\\/g, "/").split("\n").filter(d => {
    d = d.match(M);
    if (null === d || !d[1]) {
      return !0;
    }
    d = d[1];
    return d.includes(".app/Contents/Resources/electron.asar") || d.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(d);
  }).filter(d => d.trim()).map(d => b ? d.replace(M, (f, g) => f.replace(g, g.replace(pa, "~"))) : d).join("\n");
};
function qa(a, b, c = !1) {
  return function(e) {
    var d = L(arguments), {stack:f} = Error();
    const g = K(f, 2, !0), k = (f = e instanceof Error) ? e.message : e;
    d = [`Error: ${k}`, ...null !== d && a === d || c ? [b] : [g, b]].join("\n");
    d = N(d);
    return Object.assign(f ? e : Error(), {message:k, stack:d});
  };
}
;function O(a) {
  var {stack:b} = Error();
  const c = L(arguments);
  b = ma(b, a);
  return qa(c, b, a);
}
;const {parse:ra} = url;
const {Writable:sa} = stream;
const ta = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class ua extends sa {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...e} = a || {}, {c:d = O(!0), proxyError:f} = a || {}, g = (k, l) => d(l);
    super(e);
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
          const n = N(h.stack);
          h.stack = n;
          f && g`${h}`;
        }
        l(h);
      });
      c && ta(this, c).pipe(this);
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
const va = async(a, b = {}) => {
  ({f:a} = new ua({rs:a, ...b, c:O(!0)}));
  return await a;
};
const {createGunzip:wa} = zlib;
const xa = a => {
  ({"content-encoding":a} = a.headers);
  return "gzip" == a;
}, ya = (a, b, c = {}) => {
  const {justHeaders:e, binary:d, c:f = O(!0)} = c;
  let g, k, l, h, n = 0, m = 0;
  c = (new Promise((p, r) => {
    g = a(b, async q => {
      ({headers:k} = q);
      const {statusMessage:t, statusCode:w} = q;
      l = {statusMessage:t, statusCode:w};
      if (e) {
        q.destroy();
      } else {
        var v = xa(q);
        q.on("data", H => n += H.byteLength);
        q = v ? q.pipe(wa()) : q;
        h = await va(q, {binary:d});
        m = h.length;
      }
      p();
    }).on("error", q => {
      q = f(q);
      r(q);
    }).on("timeout", () => {
      g.abort();
    });
  })).then(() => ({body:h, headers:k, ...l, j:n, byteLength:m, h:null}));
  return {m:g, f:c};
};
const za = (a = {}) => Object.keys(a).reduce((b, c) => {
  const e = a[c];
  c = `${encodeURIComponent(c)}=${encodeURIComponent(e)}`;
  return [...b, c];
}, []).join("&").replace(/%20/g, "+"), Aa = async(a, b, {data:c, justHeaders:e, binary:d, c:f = O(!0)}) => {
  const {m:g, f:k} = ya(a, b, {justHeaders:e, binary:d, c:f});
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
let S;
try {
  const {version:a, name:b} = require("../package.json");
  S = "@rqt/aqt" == b ? `@rqt/aqt/${a}` : `@rqt/aqt via ${b}/${a}`;
} catch (a) {
  S = "@aqt/rqt";
}
const Ba = la("aqt"), Fa = async(a, b = {}) => {
  const {data:c, type:e = "json", headers:d = {"User-Agent":`Mozilla/5.0 (Node.JS) ${S}`}, compress:f = !0, binary:g = !1, justHeaders:k = !1, method:l, timeout:h} = b;
  b = O(!0);
  const {hostname:n, protocol:m, port:p, path:r} = ra(a), q = "https:" === m ? ja : ka, t = {hostname:n, port:p, path:r, headers:{...d}, timeout:h, method:l};
  if (c) {
    var w = e;
    var v = c;
    switch(w) {
      case "json":
        v = JSON.stringify(v);
        w = "application/json";
        break;
      case "form":
        v = za(v), w = "application/x-www-form-urlencoded";
    }
    v = {data:v, contentType:w};
    ({data:w} = v);
    ({contentType:v} = v);
    t.method = l || "POST";
    "Content-Type" in t.headers || (t.headers["Content-Type"] = v);
    "Content-Length" in t.headers || (t.headers["Content-Length"] = Buffer.byteLength(w));
  }
  !f || "Accept-Encoding" in t.headers || (t.headers["Accept-Encoding"] = "gzip, deflate");
  const {body:H, headers:Ca, byteLength:P, statusCode:Da, statusMessage:Ea, j:Q, h:R} = await Aa(q, t, {data:w, justHeaders:k, binary:g, c:b});
  Ba("%s %s B%s", a, P, `${P != Q ? ` (raw ${Q} B)` : ""}`);
  return {body:R ? R : H, headers:Ca, statusCode:Da, statusMessage:Ea};
};
const Ga = async(a, b = {}) => {
  ({body:a} = await Fa(a, b));
  return a;
};
const {stringify:Ha} = querystring;
const Ia = async() => {
  await T(`${z}/_ingest/pipeline/${C}`, {a:{method:"PUT", timeout:5000}}, {description:"IP Address And UserAgent", processors:[{geoip:{field:"ip"}}, {user_agent:{field:"headers.user-agent"}}]});
}, Ja = async() => await T(`${z}/_ingest/pipeline`, {a:{timeout:5000}}), Ka = async() => await T(`${z}/_template`, {a:{timeout:5000}}), La = async() => await T(`${z}/_stats`, {a:{timeout:10000}}), Ma = async() => await T(`${z}/_ingest/pipeline/${F}`, {a:{method:"DELETE", timeout:5000}}), T = async(a, {a:b, query:c = {}} = {}, e) => {
  c = Ha(c);
  return await Ga(`${/^https?:\/\//.test(a) ? a : `http://${a}`}${c ? `?${c}` : ""}`, {...b, data:e}).then(({error:d, ...f}) => {
    if (d) {
      throw Error("string" == typeof d ? d : d.reason);
    }
    return f;
  });
};
const Na = a => ({value:`\x1b[1m${a}\x1b[0m`, length:a.length}), U = a => a.reduce((b, c) => ({...b, [c]:!0}), {});
function V(a) {
  const {keys:b = [], data:c = [], headings:e = {}, replacements:d = {}, centerValues:f = [], centerHeadings:g = []} = a;
  var [k] = c;
  if (!k) {
    return "";
  }
  const l = U(f);
  a = U(g);
  k = Object.keys(k).reduce((m, p) => {
    const r = e[p];
    return {...m, [p]:r ? r.length : p.length};
  }, {});
  const h = c.reduce((m, p) => Object.keys(p).reduce((r, q) => {
    const t = m[q], {length:w} = W(d, q)(p[q]);
    return {...r, [q]:Math.max(w, t)};
  }, {}), k);
  k = b.reduce((m, p) => ({...m, [p]:e[p] || p}), {});
  const n = b.reduce((m, p) => ({...m, [p]:Na}), {});
  a = X(b, k, h, n, a);
  k = c.map(m => X(b, m, h, d, l));
  return [a, ...k].join("\n");
}
const Y = (a, b, c, e) => {
  if (void 0 === a) {
    return " ".repeat(b);
  }
  let d = a;
  if (c) {
    const {value:f, length:g} = c(a);
    d = f;
    a = g;
  } else {
    a = `${a}`.length;
  }
  b -= a;
  if (e) {
    return e = Math.floor(b / 2), b -= e, " ".repeat(e) + d + " ".repeat(b);
  }
  e = " ".repeat(b);
  return `${d}${e}`;
}, W = (a, b) => (a = a[b]) ? a : c => ({value:c, length:`${c}`.replace(/\033\[.*?m/g, "").length}), X = (a, b, c, e = {}, d = {}) => {
  let f = 0;
  return a.map(g => {
    const k = c[g];
    if (!k) {
      throw Error(`Unknown field ${g}`);
    }
    var l = b[g];
    const h = W(e, g), n = d[g], [m, ...p] = `${l}`.split("\n");
    g = Y(m, k, h, n);
    l = "";
    p.length && (l = "\n" + p.map(r => {
      const q = " ".repeat(f);
      r = Y(r, k, h, n);
      return `${q}${r}`;
    }).join("\n"));
    f += k + 2;
    return `${g}${l}`;
  }).join("  ");
};
var Oa = async() => {
  const a = await G("Fetching the list of pipelines", Ja());
  var b = Object.keys(a).map(c => {
    const e = a[c];
    return {name:c, description:e.description, processors:e.processors.map(d => Object.keys(d).map(f => `${I(f, "magenta")}: ${d[f].field}`).join(", ")).join("\n")};
  });
  b = V({keys:["name", "description", "processors"], data:b, headings:{name:"Name", description:"Description", processors:"Processors"}});
  console.log(b);
};
const Qa = () => {
  var a = Pa;
  return Object.keys(a).reduce((b, c) => {
    b[c] = {type:a[c]};
    return b;
  }, {});
}, Pa = {ip:"ip", date:"date"}, Ra = async() => {
  var {o:a = 1, l:b = 0} = {o:aa, l:ba};
  const c = `${D}-*`, e = `hits-${D}`;
  var d = {properties:Qa()};
  d = await T(`${z}/_template/${e}`, {a:{method:"PUT", timeout:5000}}, {settings:{number_of_shards:a, number_of_replicas:b}, version:1, mappings:{hit:d}, index_patterns:[c]});
  setTimeout(() => {
    console.log("Created %s%s", I(e, "red"), " template");
    console.log("%s%s indices with %s shards and %s replicas", "for     ", I(c, "grey"), a, b);
  }, 1);
  return d;
}, Sa = async() => await T(`${z}/${E}`, {a:{method:"DELETE", timeout:5000}});
const {createInterface:Ta} = readline;
function Ua(a, b, c) {
  return setTimeout(() => {
    const e = Error(`${a ? a : "Promise"} has timed out after ${b}ms`);
    e.stack = `Error: ${e.message}`;
    c(e);
  }, b);
}
function Va(a, b) {
  let c;
  const e = new Promise((d, f) => {
    c = Ua(a, b, f);
  });
  return {timeout:c, f:e};
}
async function Wa(a, b, c) {
  if (!(a instanceof Promise)) {
    throw Error("Promise expected");
  }
  if (!b) {
    throw Error("Timeout must be a number");
  }
  if (0 > b) {
    throw Error("Timeout cannot be negative");
  }
  const {f:e, timeout:d} = Va(c, b);
  try {
    return await Promise.race([a, e]);
  } finally {
    clearTimeout(d);
  }
}
;function Xa(a, b = {}) {
  const {timeout:c, password:e = !1, output:d = process.stdout, input:f = process.stdin, ...g} = b;
  b = Ta({input:f, output:d, ...g});
  if (e) {
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
  k = c ? Wa(k, c, `reloquent: ${a}`) : k;
  b.promise = Ya(k, b);
  return b;
}
const Ya = async(a, b) => {
  try {
    return await a;
  } finally {
    b.close();
  }
};
async function Za(a, b) {
  if ("object" != typeof a) {
    throw Error("Please give an object with questions");
  }
  return await Object.keys(a).reduce(async(c, e) => {
    c = await c;
    var d = a[e];
    switch(typeof d) {
      case "object":
        d = {...d};
        break;
      case "string":
        d = {text:d};
        break;
      default:
        throw Error("A question must be a string or an object.");
    }
    d.text = `${d.text}${d.text.endsWith("?") ? "" : ":"} `;
    var f;
    if (d.defaultValue) {
      var g = d.defaultValue;
    }
    d.getDefault && (f = await d.getDefault());
    let k = g || "";
    g && f && g != f ? k = `\x1b[90m${g}\x1b[0m` : g && g == f && (k = "");
    g = f || "";
    ({promise:g} = Xa(`${d.text}${k ? `[${k}] ` : ""}${g ? `[${g}] ` : ""}`, {timeout:b, password:d.password}));
    f = await g || f || d.defaultValue;
    "function" == typeof d.validation && d.validation(f);
    "function" == typeof d.postProcess && (f = await d.postProcess(f));
    return {...c, [e]:f};
  }, {});
}
;async function $a() {
  var a = `Are you sure you want to delete index ${I(E, "yellow")}`;
  const {defaultYes:b = !0, timeout:c} = {defaultYes:!1}, e = a.endsWith("?");
  a = `${e ? a.replace(/\?$/, "") : a} (y/n)${e ? "?" : ""}`;
  ({question:a} = await Za({question:{text:a, defaultValue:b ? "y" : "n"}}, c));
  return "y" == a;
}
;var ab = async() => {
  const a = await G("Fetching the list of templates", Ka());
  var b = Object.keys(a).map(c => {
    const e = a[c];
    return {name:c, patterns:e.index_patterns.join("\n"), shards:e.settings.index.number_of_shards, replicas:e.settings.index.number_of_replicas || ""};
  });
  b = V({keys:["name", "patterns", "shards", "replicas"], data:b, headings:{name:"Name", patterns:"Patterns", shards:"Shards", replicas:"Replicas"}});
  console.log(b);
};
var bb = async() => {
  const a = await G("Fetching stats", La());
  var b = Object.keys(a.indices).map(c => {
    if (!c.startsWith(".")) {
      var e = a.indices[c].total;
      return {name:c, memory:Z(e.segments.memory_in_bytes), docs:`${e.docs.count}`, size:`${Z(e.store.size_in_bytes)}`};
    }
  }).filter(Boolean);
  b = V({keys:["name", "memory", "docs", "size"], data:b, headings:{name:"Name", memory:"Memory", docs:"Docs", size:"Size"}});
  console.log(b);
};
const Z = a => {
  let b = 0;
  for (; 1023 < a && 3 > b;) {
    b += 1, a /= 1024;
  }
  return `${Math.floor(10 * a) / 10} ${cb[b]}`;
}, cb = ["B", "KB", "MB", "GB"];
if (B) {
  const a = require("../../package.json");
  console.log(a);
  process.exit();
} else {
  if (A) {
    const a = ia();
    console.log(a);
    process.exit();
  }
}
(async() => {
  try {
    if (!z) {
      throw Error("No ElasticSearch URL.");
    }
    if (ca) {
      return await Oa();
    }
    if (C) {
      await G(`Creating a pipeline ${I(C, "yellow")}`, Ia()), console.log("Pipeline %s created.", I(C, "green"));
    } else {
      if (F) {
        await G(`Removing ${I(F, "yellow")} pipeline`, Ma()), console.log("Pipeline %s removed.", J(F, "red"));
      } else {
        if (D) {
          await G(`Creating ${I(D, "yellow")} template`, Ra());
        } else {
          if (E) {
            await $a() && (await G(`Deleting ${I(E, "yellow")} index`, Sa()), console.log("Successfully deleted index %s", I(E, "red")));
          } else {
            if (ea) {
              return await ab();
            }
            if (da) {
              return await bb();
            }
          }
        }
      }
    }
  } catch (a) {
    console.log(process.env.DEBUG ? a.stack : J(a.message, "red"));
  }
})();

