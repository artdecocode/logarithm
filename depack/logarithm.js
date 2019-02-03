#!/usr/bin/env node
const querystring = require('querystring');
const https = require('https');
const http = require('http');
const util = require('util');
const url = require('url');
const os = require('os');
const zlib = require('zlib');
const stream = require('stream');
'use strict';
const {Writable:t} = stream;
const {request:u} = https;
const {request:x} = http;
const {debuglog:y} = util;
const z = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : Number.Infinity);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, A = (a) => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:B} = os;
const C = /\s+at.*(?:\(|\s)(.*)\)?/, D = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, E = B(), F = (a) => {
  const {w:b = !1, v:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(D.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter((a) => {
    a = a.match(C);
    if (null === a || !a[1]) {
      return !0;
    }
    a = a[1];
    return a.includes(".app/Contents/Resources/electron.asar") || a.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(a);
  }).filter((a) => "" !== a.trim()).map((a) => b ? a.replace(C, (a, b) => a.replace(b, b.replace(E, "~"))) : a).join("\n");
};
function G(a, b, c = !1) {
  return function(d) {
    var e = A(arguments), {stack:f} = Error();
    const g = z(f, 2, !0), h = (f = d instanceof Error) ? d.message : d;
    e = [`Error: ${h}`, ...null !== e && a === e || c ? [b] : [g, b]].join("\n");
    e = F(e);
    return Object.assign(f ? d : Error(), {message:h, stack:e});
  };
}
;function H(a) {
  var {stack:b} = Error();
  const c = A(arguments);
  b = z(b, 2 + (a ? 1 : 0));
  return G(c, b, a);
}
;const {parse:aa} = url;
const I = /\s+at.*(?:\(|\s)(.*)\)?/, ba = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, ca = B(), da = (a) => {
  const {w:b = !1, v:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(ba.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter((a) => {
    a = a.match(I);
    if (null === a || !a[1]) {
      return !0;
    }
    a = a[1];
    return a.includes(".app/Contents/Resources/electron.asar") || a.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(a);
  }).filter((a) => "" !== a.trim()).map((a) => b ? a.replace(I, (a, b) => a.replace(b, b.replace(ca, "~"))) : a).join("\n");
};
const ea = (a, b) => {
  b.once("error", (b) => {
    a.emit("error", b);
  });
  return b;
};
class fa extends t {
  constructor(a) {
    a = void 0 === a ? {} : a;
    var b = Object.assign({}, a);
    void 0 === a.c && H(!0);
    a = (delete b.c, delete b.N, b);
    super(a);
    const {a:c, C:d} = a;
    this.g = [];
    this.o = new Promise((a, b) => {
      this.on("finish", () => {
        let b;
        c ? b = Buffer.concat(this.g) : b = this.g.join("");
        a(b);
        this.g = [];
      });
      this.once("error", (a) => {
        if (-1 != a.stack.indexOf("\n")) {
          const b = da(a.stack);
          a.stack = b;
        }
        b(a);
      });
      d && ea(this, d).pipe(this);
    });
  }
  _write(a, b, c) {
    this.g.push(a);
    c();
  }
  get j() {
    return this.o;
  }
}
const ha = async(a, b) => {
  b = void 0 === b ? {} : b;
  ({j:a} = new fa(Object.assign({}, {C:a}, b, {c:H(!0)})));
  return await a;
};
const {createGunzip:ia} = zlib;
const la = (a, b, c) => {
  c = void 0 === c ? {} : c;
  const {h:d, a:e, c:f = H(!0)} = c;
  let g, h, k, l, n = 0, p = 0;
  c = (new Promise((c, v) => {
    g = a(b, async(a) => {
      ({headers:h} = a);
      const {statusMessage:b, statusCode:f} = a;
      k = {statusMessage:b, statusCode:f};
      if (d) {
        a.destroy();
      } else {
        var g = "gzip" == a.headers["content-encoding"];
        a.on("data", (a) => n += a.byteLength);
        a = g ? a.pipe(ia()) : a;
        l = await ha(a, {a:e});
        p = l.length;
      }
      c();
    }).on("error", (a) => {
      a = f(a);
      v(a);
    }).on("timeout", () => {
      g.abort();
    });
  })).then(() => Object.assign({}, {body:l, headers:h}, k, {A:n, byteLength:p, m:null}));
  return {B:g, j:c};
};
const ma = (a = {}) => Object.keys(a).reduce((b, c) => {
  const d = a[c];
  c = `${encodeURIComponent(c)}=${encodeURIComponent(d)}`;
  return [...b, c];
}, []).join("&").replace(/%20/g, "+"), na = async(a, b, {data:c, h:d, a:e, c:f = H(!0)}) => {
  const {B:g, j:h} = la(a, b, {h:d, a:e, c:f});
  g.end(c);
  a = await h;
  if (a.headers["content-type"].startsWith("application/json") && a.body) {
    try {
      a.m = JSON.parse(a.body);
    } catch (k) {
      throw f = f(k), f.response = a.body, f;
    }
  }
  return a;
};
const oa = y("aqt"), J = async(a, b) => {
  b = void 0 === b ? {} : b;
  const {data:c, type:d = "json", headers:e = {"User-Agent":"Mozilla/5.0 (Node.js) aqt/1.2.3"}, J:f = !0, a:g = !1, h = !1, method:k, timeout:l} = b;
  b = H(!0);
  const {hostname:n, protocol:p, port:q, path:v} = aa(a), ja = "https:" === p ? u : x, w = {hostname:n, port:q, path:v, headers:Object.assign({}, e), timeout:l, method:k};
  if (c) {
    var r = d;
    var m = c;
    switch(r) {
      case "json":
        m = JSON.stringify(m);
        r = "application/json";
        break;
      case "form":
        m = ma(m), r = "application/x-www-form-urlencoded";
    }
    m = {data:m, contentType:r};
    ({data:r} = m);
    ({contentType:m} = m);
    w.method = k || "POST";
    w.headers["Content-Type"] = m;
    w.headers["Content-Length"] = Buffer.byteLength(r);
  }
  f && (w.headers["Accept-Encoding"] = "gzip, deflate");
  const {body:ka, headers:pa, byteLength:K, statusCode:qa, statusMessage:ra, A:L, m:M} = await na(ja, w, {data:r, h, a:g, c:b});
  oa("%s %s B%s", a, K, `${K != L ? ` (raw ${L} B)` : ""}`);
  return {body:M ? M : ka, headers:pa, statusCode:qa, statusMessage:ra};
};
const sa = async(a, b) => {
  b = void 0 === b ? {} : b;
  ({body:a} = await J(a, b));
  return a;
}, ta = async(a, b) => {
  b = void 0 === b ? {} : b;
  ({body:a} = await J(a, b));
  return a;
}, ua = async(a, b) => {
  b = Object.assign({}, b, {a:!0});
  ({body:a} = await J(a, b));
  return a;
};
class va {
  constructor(a) {
    a = void 0 === a ? {} : a;
    const {host:b, headers:c = {}} = a;
    this.host = b;
    this.headers = c;
  }
}
;var wa = {get F() {
  return J;
}, get default() {
  return sa;
}, get G() {
  return ua;
}, get L() {
  return ta;
}, get D() {
  return va;
}};
const N = (a, b, c, d, e) => {
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
}, xa = (a) => {
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
const ya = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, za = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function O(a, b) {
  return (b = ya[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function P(a, b) {
  return (b = za[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;const Aa = (a) => ({value:`\x1b[1m${a}\x1b[0m`, length:a.length}), Q = (a) => a.reduce((a, c) => Object.assign({}, a, {[c]:!0}), {});
function Ba(a) {
  const {keys:b = [], data:c = [], u:d = {}, O:e = {}, I:f = [], H:g = []} = a;
  var [h] = c;
  if (!h) {
    return "";
  }
  const k = Q(f);
  a = Q(g);
  h = Object.keys(h).reduce((a, b) => {
    const c = d[b];
    return Object.assign({}, a, {[b]:c ? c.length : b.length});
  }, {});
  const l = c.reduce((a, b) => Object.keys(b).reduce((c, d) => {
    const f = a[d], {length:g} = R(e, d)(b[d]);
    return Object.assign({}, c, {[d]:Math.max(g, f)});
  }, {}), h);
  h = b.reduce((a, b) => Object.assign({}, a, {[b]:d[b] || b}), {});
  const n = b.reduce((a, b) => Object.assign({}, a, {[b]:Aa}), {});
  a = S(b, h, l, n, a);
  h = c.map((a) => S(b, a, l, e, k));
  return [a, ...h].join("\n");
}
const T = (a, b, c, d) => {
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
}, R = (a, b) => (a = a[b]) ? a : (a) => ({value:a, length:a.replace(/\033\[.*?m/g, "").length}), S = (a, b, c, d, e) => {
  d = void 0 === d ? {} : d;
  e = void 0 === e ? {} : e;
  let f = 0;
  return a.map((a) => {
    const g = c[a];
    if (!g) {
      throw Error(`Unknown field ${a}`);
    }
    const k = R(d, a), l = e[a], [n, ...p] = b[a].split("\n");
    a = T(n, g, k, l);
    let q = "";
    p.length && (q = "\n" + p.map((a) => {
      const b = " ".repeat(f);
      a = T(a, g, k, l);
      return `${b}${a}`;
    }).join("\n"));
    f += g + 2;
    return `${a}${q}`;
  }).join("  ");
};
async function U(a, b) {
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
;function Ca() {
  const {usage:a = {}, description:b, line:c, K:d} = {description:`ElasticSearch utility for creating a pipeline and indexes for logging request using ${P("logarithm", "green")} middleware.`, line:"logarithm $ELASTIC [-i clients] [-P] [-p|rp pipeline]", usage:{"-i, --index":"Create an index for storing log data.", "-P, --pipelines":"Display installed pipelines.", "-p, --pipeline name":"Create a pipeline with User-Agent\nand GeoIp plugins.", "-rp name":"Removes the pipeline.", "-h, --help":"Show the help message.", 
  "-v, --version":"Show the version information."}};
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
;const {stringify:Da} = querystring;
const Ea = async() => {
  await V(`${W}/_ingest/pipeline/${X}`, {l:{method:"PUT", timeout:5000}}, {description:"IP Address And UserAgent", processors:[{geoip:{field:"ip"}}, {user_agent:{field:"headers.user-agent"}}]});
}, Fa = async() => await V(`${W}/_ingest/pipeline`, {l:{timeout:5000}}), Ga = async() => await V(`${W}/_ingest/pipeline/${Y}`, {l:{method:"DELETE", timeout:5000}}), V = async(a, b, c) => {
  var {l:d, query:e = {}} = void 0 === b ? {} : b;
  b = Da(e);
  a = `${/^https?:\/\//.test(a) ? a : `http://${a}`}${b ? `?${b}` : ""}`;
  return await wa.default(a, Object.assign({}, d, {data:c})).then((a) => {
    var b = Object.assign({}, a);
    a = a.error;
    b = (delete b.error, b);
    if (a) {
      throw Error("string" == typeof a ? a : a.reason);
    }
    return b;
  });
};
var Ha = async() => {
  const a = await U("Fetching the list of pipelines", Fa());
  var b = Object.keys(a).map((b) => {
    const c = a[b];
    return {name:b, description:c.description, processors:c.processors.map((a) => Object.keys(a).map((b) => `${O(b, "magenta")}: ${a[b].field}`).join(", ")).join("\n")};
  });
  b = Ba({keys:["name", "description", "processors"], data:b, u:{name:"Name", description:"Description", processors:"Processors"}});
  console.log(b);
};
const Z = function(a, b) {
  a = void 0 === a ? {} : a;
  b = void 0 === b ? process.argv : b;
  [, , ...b] = b;
  const c = xa(b);
  b = b.slice(c.length);
  let d = !c.length;
  return Object.keys(a).reduce((b, f) => {
    var e = Object.assign({}, b);
    b = b.b;
    e = (delete e.b, e);
    if (0 == b.length && d) {
      return Object.assign({}, {b}, e);
    }
    const h = a[f];
    let k;
    if ("string" == typeof h) {
      ({value:k, argv:b} = N(b, f, h));
    } else {
      try {
        const {f:a, i:e, M:g, s:q, multiple:v} = h;
        q && v && c.length ? (k = c, d = !0) : q && c.length ? (k = c[0], d = !0) : {value:k, argv:b} = N(b, f, a, e, g);
      } catch (l) {
        return Object.assign({}, {b}, e);
      }
    }
    return void 0 === k ? Object.assign({}, {b}, e) : Object.assign({}, {b}, e, {[f]:k});
  }, {b});
}({url:{s:!0}, help:{f:"h", i:!0}, pipeline:{f:"p"}, pipelines:{f:"P", i:!0}, "remove-pipeline":{f:"rp"}, version:{f:"v", i:!0}}), W = Z.url, Ia = Z.help, X = Z.pipeline, Ja = Z.pipelines, Y = Z["remove-pipeline"];
if (Z.version) {
  console.log("1.0.0"), process.exit();
} else {
  if (Ia) {
    const a = Ca();
    console.log(a);
    process.exit();
  }
}
(async() => {
  try {
    if (!W) {
      throw Error("No ElasticSearch URL.");
    }
    if (Ja) {
      return await Ha();
    }
    X ? (await U(`Creating a pipeline ${O(X, "yellow")}`, Ea()), console.log("Pipeline %s created.", O(X, "green"))) : Y && (await U(`Removing ${O(Y, "yellow")} pipeline `, Ga()), console.log("Pipeline %s removed.", P(Y, "red")));
  } catch (a) {
    console.log(process.env.DEBUG ? a.stack : P(a.message, "red"));
  }
})();

