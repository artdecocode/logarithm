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
             
const {createInterface:m} = readline;
const p = (a, b, c, d, e) => {
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
}, r = (a) => {
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
const {request:w} = https;
const {request:aa} = http;
const {debuglog:ba} = util;
const x = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : Number.Infinity);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, y = (a) => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:B} = os;
const C = /\s+at.*(?:\(|\s)(.*)\)?/, ca = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, da = B(), ea = (a) => {
  const {C:b = !1, A:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(ca.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter((a) => {
    a = a.match(C);
    if (null === a || !a[1]) {
      return !0;
    }
    a = a[1];
    return a.includes(".app/Contents/Resources/electron.asar") || a.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(a);
  }).filter((a) => "" !== a.trim()).map((a) => b ? a.replace(C, (a, b) => a.replace(b, b.replace(da, "~"))) : a).join("\n");
};
function fa(a, b, c = !1) {
  return function(d) {
    var e = y(arguments), {stack:f} = Error();
    const g = x(f, 2, !0), h = (f = d instanceof Error) ? d.message : d;
    e = [`Error: ${h}`, ...null !== e && a === e || c ? [b] : [g, b]].join("\n");
    e = ea(e);
    return Object.assign(f ? d : Error(), {message:h, stack:e});
  };
}
;function D(a) {
  var {stack:b} = Error();
  const c = y(arguments);
  b = x(b, 2 + (a ? 1 : 0));
  return fa(c, b, a);
}
;const {parse:ha} = url;
const {Writable:ia} = stream;
const E = /\s+at.*(?:\(|\s)(.*)\)?/, ja = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, ka = B(), la = (a) => {
  const {C:b = !1, A:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(ja.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter((a) => {
    a = a.match(E);
    if (null === a || !a[1]) {
      return !0;
    }
    a = a[1];
    return a.includes(".app/Contents/Resources/electron.asar") || a.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(a);
  }).filter((a) => "" !== a.trim()).map((a) => b ? a.replace(E, (a, b) => a.replace(b, b.replace(ka, "~"))) : a).join("\n");
};
const ma = (a, b) => {
  b.once("error", (b) => {
    a.emit("error", b);
  });
  return b;
};
class na extends ia {
  constructor(a) {
    a = void 0 === a ? {} : a;
    var b = Object.assign({}, a);
    void 0 === a.h && D(!0);
    a = (delete b.h, delete b.U, b);
    super(a);
    const {b:c, H:d} = a;
    this.i = [];
    this.s = new Promise((a, b) => {
      this.on("finish", () => {
        let b;
        c ? b = Buffer.concat(this.i) : b = this.i.join("");
        a(b);
        this.i = [];
      });
      this.once("error", (a) => {
        if (-1 != a.stack.indexOf("\n")) {
          const b = la(a.stack);
          a.stack = b;
        }
        b(a);
      });
      d && ma(this, d).pipe(this);
    });
  }
  _write(a, b, c) {
    this.i.push(a);
    c();
  }
  get c() {
    return this.s;
  }
}
const oa = async(a, b) => {
  b = void 0 === b ? {} : b;
  ({c:a} = new na(Object.assign({}, {H:a}, b, {h:D(!0)})));
  return await a;
};
const {createGunzip:pa} = zlib;
const sa = (a, b, c) => {
  c = void 0 === c ? {} : c;
  const {l:d, b:e, h:f = D(!0)} = c;
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
        a = g ? a.pipe(pa()) : a;
        l = await oa(a, {b:e});
        t = l.length;
      }
      c();
    }).on("error", (a) => {
      a = f(a);
      z(a);
    }).on("timeout", () => {
      g.abort();
    });
  })).then(() => Object.assign({}, {body:l, headers:h}, k, {D:q, byteLength:t, o:null}));
  return {G:g, c};
};
const ta = (a = {}) => Object.keys(a).reduce((b, c) => {
  const d = a[c];
  c = `${encodeURIComponent(c)}=${encodeURIComponent(d)}`;
  return [...b, c];
}, []).join("&").replace(/%20/g, "+"), ua = async(a, b, {data:c, l:d, b:e, h:f = D(!0)}) => {
  const {G:g, c:h} = sa(a, b, {l:d, b:e, h:f});
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
const va = ba("aqt"), F = async(a, b) => {
  b = void 0 === b ? {} : b;
  const {data:c, type:d = "json", headers:e = {"User-Agent":"Mozilla/5.0 (Node.js) aqt/1.2.3"}, P:f = !0, b:g = !1, l:h = !1, method:k, timeout:l} = b;
  b = D(!0);
  const {hostname:q, protocol:t, port:u, path:z} = ha(a), qa = "https:" === t ? w : aa, A = {hostname:q, port:u, path:z, headers:Object.assign({}, e), timeout:l, method:k};
  if (c) {
    var v = d;
    var n = c;
    switch(v) {
      case "json":
        n = JSON.stringify(n);
        v = "application/json";
        break;
      case "form":
        n = ta(n), v = "application/x-www-form-urlencoded";
    }
    n = {data:n, contentType:v};
    ({data:v} = n);
    ({contentType:n} = n);
    A.method = k || "POST";
    A.headers["Content-Type"] = n;
    A.headers["Content-Length"] = Buffer.byteLength(v);
  }
  f && (A.headers["Accept-Encoding"] = "gzip, deflate");
  const {body:ra, headers:wa, byteLength:O, statusCode:xa, statusMessage:ya, D:P, o:Q} = await ua(qa, A, {data:v, l:h, b:g, h:b});
  va("%s %s B%s", a, O, `${O != P ? ` (raw ${P} B)` : ""}`);
  return {body:Q ? Q : ra, headers:wa, statusCode:xa, statusMessage:ya};
};
const za = async(a, b) => {
  b = void 0 === b ? {} : b;
  ({body:a} = await F(a, b));
  return a;
}, Aa = async(a, b) => {
  b = void 0 === b ? {} : b;
  ({body:a} = await F(a, b));
  return a;
}, Ba = async(a, b) => {
  b = Object.assign({}, b, {b:!0});
  ({body:a} = await F(a, b));
  return a;
};
class Ca {
  constructor(a) {
    a = void 0 === a ? {} : a;
    const {host:b, headers:c = {}} = a;
    this.host = b;
    this.headers = c;
  }
}
;var Da = {get L() {
  return F;
}, get default() {
  return za;
}, get M() {
  return Ba;
}, get S() {
  return Aa;
}, get K() {
  return Ca;
}};
function Ea(a, b, c) {
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
  b = Fa(c, b);
  return Promise.race([a, b.c]).then(G.bind(null, b.timeout), G.bind(null, b.timeout, null));
}
function Ga(a, b, c) {
  return setTimeout(() => {
    const d = `${"string" === (typeof a).toLowerCase() ? a : "Promise"} has timed out after ${b}ms`, e = Error(d);
    e.stack = `Error: ${d}`;
    c(e);
  }, b);
}
function Fa(a, b) {
  let c;
  const d = new Promise((e, d) => {
    c = Ga(a, b, d);
  });
  return {timeout:c, c:d};
}
function G(a, b, c) {
  clearTimeout(a);
  if (c) {
    throw c;
  }
  return b;
}
;function Ha(a, b) {
  var c = b = void 0 === b ? {} : b, d = Object.assign({}, c);
  b = c.timeout;
  var e = void 0 === c.password ? !1 : c.password;
  const f = void 0 === c.output ? process.stdout : c.output;
  c = void 0 === c.input ? process.stdin : c.input;
  d = (delete d.timeout, delete d.password, delete d.output, delete d.input, d);
  const g = m(Object.assign({}, {input:c, output:f}, d));
  e && (g.i = (b) => {
    if (["\r\n", "\n", "\r"].includes(b)) {
      return g.output.write(b);
    }
    b = b.split(a);
    "2" == b.length ? (g.output.write(a), g.output.write("*".repeat(b[1].length))) : g.output.write("*");
  });
  e = new Promise(g.question.bind(g, a));
  b = b ? Ea(e, b, `reloquent: ${a}`) : e;
  g.c = Ia(b, g);
  return g;
}
const Ia = async(a, b) => {
  try {
    return await a;
  } finally {
    b.close();
  }
};
async function Ja(a, b) {
  if ("object" != typeof a) {
    throw Error("Please give an object with questions");
  }
  return await Object.keys(a).reduce(async(c, d) => {
    c = await c;
    var e = a[d];
    switch(typeof e) {
      case "object":
        e = Object.assign({}, e);
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
    e.w && (f = await e.w());
    let h = g || "";
    g && f && g != f ? h = `\x1b[90m${g}\x1b[0m` : g && g == f && (h = "");
    g = f || "";
    ({c:g} = Ha(`${e.text}${h ? `[${h}] ` : ""}${g ? `[${g}] ` : ""}`, {timeout:b, password:e.password}));
    f = await g || f || e.defaultValue;
    "function" == typeof e.J && e.J(f);
    "function" == typeof e.B && (f = await e.B(f));
    return Object.assign({}, c, {[d]:f});
  }, {});
}
;async function Ka() {
  var a = `Are you sure you want to delete index ${H(I, "yellow")}`;
  const {v:b = !0, timeout:c} = {v:!1}, d = a.endsWith("?");
  a = `${d ? a.replace(/\?$/, "") : a} (y/n)${d ? "?" : ""}`;
  ({question:a} = await Ja({question:{text:a, defaultValue:b ? "y" : "n"}}, c));
  return "y" == a;
}
;const La = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, Ma = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function H(a, b) {
  return (b = La[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function J(a, b) {
  return (b = Ma[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;const Na = (a) => ({value:`\x1b[1m${a}\x1b[0m`, length:a.length}), K = (a) => a.reduce((a, c) => Object.assign({}, a, {[c]:!0}), {});
function L(a) {
  const {keys:b = [], data:c = [], m:d = {}, V:e = {}, O:f = [], N:g = []} = a;
  var [h] = c;
  if (!h) {
    return "";
  }
  const k = K(f);
  a = K(g);
  h = Object.keys(h).reduce((a, b) => {
    const c = d[b];
    return Object.assign({}, a, {[b]:c ? c.length : b.length});
  }, {});
  const l = c.reduce((a, b) => Object.keys(b).reduce((c, d) => {
    const g = a[d], {length:f} = M(e, d)(b[d]);
    return Object.assign({}, c, {[d]:Math.max(f, g)});
  }, {}), h);
  h = b.reduce((a, b) => Object.assign({}, a, {[b]:d[b] || b}), {});
  const q = b.reduce((a, b) => Object.assign({}, a, {[b]:Na}), {});
  a = N(b, h, l, q, a);
  h = c.map((a) => N(b, a, l, e, k));
  return [a, ...h].join("\n");
}
const R = (a, b, c, d) => {
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
}, M = (a, b) => (a = a[b]) ? a : (a) => ({value:a, length:a.replace(/\033\[.*?m/g, "").length}), N = (a, b, c, d, e) => {
  d = void 0 === d ? {} : d;
  e = void 0 === e ? {} : e;
  let f = 0;
  return a.map((a) => {
    const g = c[a];
    if (!g) {
      throw Error(`Unknown field ${a}`);
    }
    const k = M(d, a), l = e[a], [q, ...t] = b[a].split("\n");
    a = R(q, g, k, l);
    let u = "";
    t.length && (u = "\n" + t.map((a) => {
      const b = " ".repeat(f);
      a = R(a, g, k, l);
      return `${b}${a}`;
    }).join("\n"));
    f += g + 2;
    return `${a}${u}`;
  }).join("  ");
};
async function S(a, b) {
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
;function Oa() {
  const {usage:a = {}, description:b, line:c, R:d} = {description:`ElasticSearch utility for creating a pipeline and index templates\nfor logging request using ${J("logarithm", "green")} middleware.`, line:"logarithm $ELASTIC [-TPS] [-t index -sr] [-p|rp pipeline] [-d index]", usage:{"-t, --template name":"Create an index template for storing\nlog data in name-* index.", " -s, --shards":"Number of shards for index template.\nDefault 1.", " -r, --replicas":"Number of replicas for index template.\nDefault 0.", 
  "-T, --templates":"List index templates.", "-S, --stats":"Display statistics by indices.", "-d, --delete name":"Delete an index.", "-P, --pipelines":"Display installed pipelines.", "-p, --pipeline name":"Create a pipeline with User-Agent\nand GeoIp plugins.", "--remove-pipeline":"Removes the pipeline.", "-h, --help":"Show the help message.", "-v, --version":"Show the version information."}};
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
;const {stringify:Pa} = querystring;
const Qa = async() => {
  await T(`${U}/_ingest/pipeline/${V}`, {f:{method:"PUT", timeout:5000}}, {description:"IP Address And UserAgent", processors:[{geoip:{field:"ip"}}, {user_agent:{field:"headers.user-agent"}}]});
}, Ra = async() => await T(`${U}/_ingest/pipeline`, {f:{timeout:5000}}), Sa = async() => await T(`${U}/_template`, {f:{timeout:5000}}), Ta = async() => await T(`${U}/_stats`, {f:{timeout:10000}}), Ua = async() => await T(`${U}/_ingest/pipeline/${W}`, {f:{method:"DELETE", timeout:5000}}), T = async(a, b, c) => {
  var {f:d, query:e = {}} = void 0 === b ? {} : b;
  b = Pa(e);
  a = `${/^https?:\/\//.test(a) ? a : `http://${a}`}${b ? `?${b}` : ""}`;
  return await Da.default(a, Object.assign({}, d, {data:c})).then((a) => {
    var b = Object.assign({}, a);
    a = a.error;
    b = (delete b.error, b);
    if (a) {
      throw Error("string" == typeof a ? a : a.reason);
    }
    return b;
  });
};
var Va = async() => {
  const a = await S("Fetching stats", Ta());
  var b = Object.keys(a.indices).map((b) => {
    if (!b.startsWith(".")) {
      var c = a.indices[b].total;
      return {name:b, memory:X(c.segments.memory_in_bytes), docs:`${c.docs.count}`, size:`${X(c.store.size_in_bytes)}`};
    }
  }).filter(Boolean);
  b = L({keys:["name", "memory", "docs", "size"], data:b, m:{name:"Name", memory:"Memory", docs:"Docs", size:"Size"}});
  console.log(b);
};
const X = (a) => {
  let b = 0;
  for (; 1023 < a && 3 > b;) {
    b += 1, a /= 1024;
  }
  return `${Math.floor(10 * a) / 10} ${Wa[b]}`;
}, Wa = ["B", "KB", "MB", "GB"];
var Xa = async() => {
  const a = await S("Fetching the list of templates", Sa());
  var b = Object.keys(a).map((b) => {
    const c = a[b];
    return {name:b, patterns:c.index_patterns.join("\n"), shards:c.settings.index.number_of_shards, replicas:c.settings.index.number_of_replicas || ""};
  });
  b = L({keys:["name", "patterns", "shards", "replicas"], data:b, m:{name:"Name", patterns:"Patterns", shards:"Shards", replicas:"Replicas"}});
  console.log(b);
};
const Za = () => {
  var a = Ya;
  return Object.keys(a).reduce((b, c) => {
    b[c] = {type:a[c]};
    return b;
  }, {});
}, Ya = {ip:"ip", date:"date"}, bb = async() => {
  var a = U, b = Y, {I:c = 1, F:d = 0} = {I:$a, F:ab};
  const e = `${b}-*`, f = `hits-${b}`;
  b = {properties:Za()};
  a = await T(`${a}/_template/${f}`, {f:{method:"PUT", timeout:5000}}, {settings:{number_of_shards:c, number_of_replicas:d}, version:1, mappings:{hit:b}, index_patterns:[e]});
  setTimeout(() => {
    console.log("Created %s%s", H(f, "red"), " template");
    console.log("%s%s indices with %s shards and %s replicas", "for     ", H(e, "grey"), c, d);
  }, 1);
  return a;
}, cb = async() => await T(`${U}/${I}`, {f:{method:"DELETE", timeout:5000}});
var db = async() => {
  const a = await S("Fetching the list of pipelines", Ra());
  var b = Object.keys(a).map((b) => {
    const c = a[b];
    return {name:b, description:c.description, processors:c.processors.map((a) => Object.keys(a).map((b) => `${H(b, "magenta")}: ${a[b].field}`).join(", ")).join("\n")};
  });
  b = L({keys:["name", "description", "processors"], data:b, m:{name:"Name", description:"Description", processors:"Processors"}});
  console.log(b);
};
const Z = function(a, b) {
  a = void 0 === a ? {} : a;
  b = void 0 === b ? process.argv : b;
  [, , ...b] = b;
  const c = r(b);
  b = b.slice(c.length);
  let d = !c.length;
  return Object.keys(a).reduce((b, f) => {
    var e = Object.assign({}, b);
    b = b.g;
    e = (delete e.g, e);
    if (0 == b.length && d) {
      return Object.assign({}, {g:b}, e);
    }
    const h = a[f];
    let k;
    if ("string" == typeof h) {
      ({value:k, argv:b} = p(b, f, h));
    } else {
      try {
        const {a, j:e, T:g, u, multiple:z} = h;
        u && z && c.length ? (k = c, d = !0) : u && c.length ? (k = c[0], d = !0) : {value:k, argv:b} = p(b, f, a, e, g);
      } catch (l) {
        return Object.assign({}, {g:b}, e);
      }
    }
    return void 0 === k ? Object.assign({}, {g:b}, e) : Object.assign({}, {g:b}, e, {[f]:k});
  }, {g:b});
}({url:{u:!0}, help:{a:"h", j:!0}, template:{a:"t"}, shards:{a:"s", type:"number"}, replicas:{a:"r", type:"number"}, templates:{a:"T", j:!0}, stats:{a:"S", j:!0}, "delete":{a:"d"}, pipeline:{a:"p"}, pipelines:{a:"P", j:!0}, "remove-pipeline":{}, version:{a:"v", j:!0}}), U = Z.url, eb = Z.help, V = Z.pipeline, Y = Z.template, I = Z["delete"], $a = Z.shards, ab = Z.replicas, fb = Z.pipelines, gb = Z.stats, hb = Z.templates, W = Z["remove-pipeline"];
if (Z.version) {
  console.log("1.0.0"), process.exit();
} else {
  if (eb) {
    const a = Oa();
    console.log(a);
    process.exit();
  }
}
(async() => {
  try {
    if (!U) {
      throw Error("No ElasticSearch URL.");
    }
    if (fb) {
      return await db();
    }
    if (V) {
      await S(`Creating a pipeline ${H(V, "yellow")}`, Qa()), console.log("Pipeline %s created.", H(V, "green"));
    } else {
      if (W) {
        await S(`Removing ${H(W, "yellow")} pipeline`, Ua()), console.log("Pipeline %s removed.", J(W, "red"));
      } else {
        if (Y) {
          await S(`Creating ${H(Y, "yellow")} template`, bb());
        } else {
          if (I) {
            await Ka() && (await S(`Deleting ${H(I, "yellow")} index`, cb()), console.log("Successfully deleted index %s", H(I, "red")));
          } else {
            if (hb) {
              return await Xa();
            }
            if (gb) {
              return await Va();
            }
          }
        }
      }
    }
  } catch (a) {
    console.log(process.env.DEBUG ? a.stack : J(a.message, "red"));
  }
})();

