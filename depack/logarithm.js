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
const {debuglog:v} = util;
const w = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : Number.Infinity);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, x = (a) => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:y} = os;
const B = /\s+at.*(?:\(|\s)(.*)\)?/, aa = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, ba = y(), ca = (a) => {
  const {w:b = !1, v:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(aa.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter((a) => {
    a = a.match(B);
    if (null === a || !a[1]) {
      return !0;
    }
    a = a[1];
    return a.includes(".app/Contents/Resources/electron.asar") || a.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(a);
  }).filter((a) => "" !== a.trim()).map((a) => b ? a.replace(B, (a, b) => a.replace(b, b.replace(ba, "~"))) : a).join("\n");
};
function da(a, b, c = !1) {
  return function(d) {
    var e = x(arguments), {stack:f} = Error();
    const g = w(f, 2, !0), h = (f = d instanceof Error) ? d.message : d;
    e = [`Error: ${h}`, ...null !== e && a === e || c ? [b] : [g, b]].join("\n");
    e = ca(e);
    return Object.assign(f ? d : Error(), {message:h, stack:e});
  };
}
;function C(a) {
  var {stack:b} = Error();
  const c = x(arguments);
  b = w(b, 2 + (a ? 1 : 0));
  return da(c, b, a);
}
;const {parse:ea} = url;
const {Writable:fa} = stream;
const D = /\s+at.*(?:\(|\s)(.*)\)?/, ha = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, ia = y(), ja = (a) => {
  const {w:b = !1, v:c = ["pirates"]} = {}, d = c.join("|"), e = new RegExp(ha.source.replace("IGNORED_MODULES", d));
  return a.replace(/\\/g, "/").split("\n").filter((a) => {
    a = a.match(D);
    if (null === a || !a[1]) {
      return !0;
    }
    a = a[1];
    return a.includes(".app/Contents/Resources/electron.asar") || a.includes(".app/Contents/Resources/default_app.asar") ? !1 : !e.test(a);
  }).filter((a) => "" !== a.trim()).map((a) => b ? a.replace(D, (a, b) => a.replace(b, b.replace(ia, "~"))) : a).join("\n");
};
const ka = (a, b) => {
  b.once("error", (b) => {
    a.emit("error", b);
  });
  return b;
};
class la extends fa {
  constructor(a) {
    a = void 0 === a ? {} : a;
    var b = Object.assign({}, a);
    void 0 === a.f && C(!0);
    a = (delete b.f, delete b.R, b);
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
          const b = ja(a.stack);
          a.stack = b;
        }
        b(a);
      });
      d && ka(this, d).pipe(this);
    });
  }
  _write(a, b, c) {
    this.h.push(a);
    c();
  }
  get i() {
    return this.s;
  }
}
const ma = async(a, b) => {
  b = void 0 === b ? {} : b;
  ({i:a} = new la(Object.assign({}, {D:a}, b, {f:C(!0)})));
  return await a;
};
const {createGunzip:na} = zlib;
const qa = (a, b, c) => {
  c = void 0 === c ? {} : c;
  const {l:d, b:e, f = C(!0)} = c;
  let g, h, k, l, q = 0, r = 0;
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
        a = g ? a.pipe(na()) : a;
        l = await ma(a, {b:e});
        r = l.length;
      }
      c();
    }).on("error", (a) => {
      a = f(a);
      z(a);
    }).on("timeout", () => {
      g.abort();
    });
  })).then(() => Object.assign({}, {body:l, headers:h}, k, {A:q, byteLength:r, o:null}));
  return {C:g, i:c};
};
const ra = (a = {}) => Object.keys(a).reduce((b, c) => {
  const d = a[c];
  c = `${encodeURIComponent(c)}=${encodeURIComponent(d)}`;
  return [...b, c];
}, []).join("&").replace(/%20/g, "+"), sa = async(a, b, {data:c, l:d, b:e, f = C(!0)}) => {
  const {C:g, i:h} = qa(a, b, {l:d, b:e, f});
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
const ta = v("aqt"), E = async(a, b) => {
  b = void 0 === b ? {} : b;
  const {data:c, type:d = "json", headers:e = {"User-Agent":"Mozilla/5.0 (Node.js) aqt/1.2.3"}, L:f = !0, b:g = !1, l:h = !1, method:k, timeout:l} = b;
  b = C(!0);
  const {hostname:q, protocol:r, port:t, path:z} = ea(a), oa = "https:" === r ? m : p, A = {hostname:q, port:t, path:z, headers:Object.assign({}, e), timeout:l, method:k};
  if (c) {
    var u = d;
    var n = c;
    switch(u) {
      case "json":
        n = JSON.stringify(n);
        u = "application/json";
        break;
      case "form":
        n = ra(n), u = "application/x-www-form-urlencoded";
    }
    n = {data:n, contentType:u};
    ({data:u} = n);
    ({contentType:n} = n);
    A.method = k || "POST";
    A.headers["Content-Type"] = n;
    A.headers["Content-Length"] = Buffer.byteLength(u);
  }
  f && (A.headers["Accept-Encoding"] = "gzip, deflate");
  const {body:pa, headers:ua, byteLength:N, statusCode:va, statusMessage:wa, A:O, o:P} = await sa(oa, A, {data:u, l:h, b:g, f:b});
  ta("%s %s B%s", a, N, `${N != O ? ` (raw ${O} B)` : ""}`);
  return {body:P ? P : pa, headers:ua, statusCode:va, statusMessage:wa};
};
const xa = async(a, b) => {
  b = void 0 === b ? {} : b;
  ({body:a} = await E(a, b));
  return a;
}, ya = async(a, b) => {
  b = void 0 === b ? {} : b;
  ({body:a} = await E(a, b));
  return a;
}, za = async(a, b) => {
  b = Object.assign({}, b, {b:!0});
  ({body:a} = await E(a, b));
  return a;
};
class Aa {
  constructor(a) {
    a = void 0 === a ? {} : a;
    const {host:b, headers:c = {}} = a;
    this.host = b;
    this.headers = c;
  }
}
;var Ba = {get H() {
  return E;
}, get default() {
  return xa;
}, get I() {
  return za;
}, get O() {
  return ya;
}, get G() {
  return Aa;
}};
const F = (a, b, c, d, e) => {
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
}, Ca = (a) => {
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
const Da = (a) => ({value:`\x1b[1m${a}\x1b[0m`, length:a.length}), G = (a) => a.reduce((a, c) => Object.assign({}, a, {[c]:!0}), {});
function H(a) {
  const {keys:b = [], data:c = [], m:d = {}, S:e = {}, K:f = [], J:g = []} = a;
  var [h] = c;
  if (!h) {
    return "";
  }
  const k = G(f);
  a = G(g);
  h = Object.keys(h).reduce((a, b) => {
    const c = d[b];
    return Object.assign({}, a, {[b]:c ? c.length : b.length});
  }, {});
  const l = c.reduce((a, b) => Object.keys(b).reduce((c, d) => {
    const f = a[d], {length:g} = I(e, d)(b[d]);
    return Object.assign({}, c, {[d]:Math.max(g, f)});
  }, {}), h);
  h = b.reduce((a, b) => Object.assign({}, a, {[b]:d[b] || b}), {});
  const q = b.reduce((a, b) => Object.assign({}, a, {[b]:Da}), {});
  a = J(b, h, l, q, a);
  h = c.map((a) => J(b, a, l, e, k));
  return [a, ...h].join("\n");
}
const K = (a, b, c, d) => {
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
}, I = (a, b) => (a = a[b]) ? a : (a) => ({value:a, length:a.replace(/\033\[.*?m/g, "").length}), J = (a, b, c, d, e) => {
  d = void 0 === d ? {} : d;
  e = void 0 === e ? {} : e;
  let f = 0;
  return a.map((a) => {
    const g = c[a];
    if (!g) {
      throw Error(`Unknown field ${a}`);
    }
    const k = I(d, a), l = e[a], [q, ...r] = b[a].split("\n");
    a = K(q, g, k, l);
    let t = "";
    r.length && (t = "\n" + r.map((a) => {
      const b = " ".repeat(f);
      a = K(a, g, k, l);
      return `${b}${a}`;
    }).join("\n"));
    f += g + 2;
    return `${a}${t}`;
  }).join("  ");
};
async function L(a, b) {
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
;const Ea = {black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37, grey:90}, Fa = {black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47};
function M(a, b) {
  return (b = Ea[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
function Q(a, b) {
  return (b = Fa[b]) ? `\x1b[${b}m${a}\x1b[0m` : a;
}
;function R(a, b, c) {
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
  b = Ga(c, b);
  return Promise.race([a, b.i]).then(S.bind(null, b.timeout), S.bind(null, b.timeout, null));
}
function Ha(a, b, c) {
  return setTimeout(() => {
    const d = `${"string" === (typeof a).toLowerCase() ? a : "Promise"} has timed out after ${b}ms`, e = Error(d);
    e.stack = `Error: ${d}`;
    c(e);
  }, b);
}
function Ga(a, b) {
  let c;
  const d = new Promise((d, f) => {
    c = Ha(a, b, f);
  });
  return {timeout:c, i:d};
}
function S(a, b, c) {
  clearTimeout(a);
  if (c) {
    throw c;
  }
  return b;
}
;R && R.h && (R = R.default);
var Ia = {};
function Ja() {
  const {usage:a = {}, description:b, line:c, N:d} = {description:`ElasticSearch utility for creating a pipeline and index templates\nfor logging request using ${Q("logarithm", "green")} middleware.`, line:"logarithm $ELASTIC [-TP] [-t index -sr] [-p|rp pipeline] [-d index]", usage:{"-t, --template name":"Create an index template for storing\nlog data in name-* index.", "-T, --templates":"List index templates.", "-s, --shards":"Number of shards for index template.\nDefault 1.", "-r, --replicas":"Number of replicas for index template.\nDefault 0.", 
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
;const {stringify:Ka} = querystring;
const La = async() => {
  await T(`${U}/_ingest/pipeline/${V}`, {g:{method:"PUT", timeout:5000}}, {description:"IP Address And UserAgent", processors:[{geoip:{field:"ip"}}, {user_agent:{field:"headers.user-agent"}}]});
}, Ma = async() => await T(`${U}/_ingest/pipeline`, {g:{timeout:5000}}), Na = async() => await T(`${U}/_template`, {g:{timeout:5000}}), Oa = async() => await T(`${U}/_ingest/pipeline/${W}`, {g:{method:"DELETE", timeout:5000}}), T = async(a, b, c) => {
  var {g:d, query:e = {}} = void 0 === b ? {} : b;
  b = Ka(e);
  a = `${/^https?:\/\//.test(a) ? a : `http://${a}`}${b ? `?${b}` : ""}`;
  return await Ba.default(a, Object.assign({}, d, {data:c})).then((a) => {
    var b = Object.assign({}, a);
    a = a.error;
    b = (delete b.error, b);
    if (a) {
      throw Error("string" == typeof a ? a : a.reason);
    }
    return b;
  });
};
var Pa = async() => {
  const a = await L("Fetching the list of templates", Na());
  var b = Object.keys(a).map((b) => {
    const c = a[b];
    return {name:b, patterns:c.index_patterns.join("\n"), shards:c.settings.index.number_of_shards, replicas:c.settings.index.number_of_replicas || ""};
  });
  b = H({keys:["name", "patterns", "shards", "replicas"], data:b, m:{name:"Name", patterns:"Patterns", shards:"Shards", replicas:"Replicas"}});
  console.log(b);
};
const Ra = () => {
  var a = Qa;
  return Object.keys(a).reduce((b, c) => {
    b[c] = {type:a[c]};
    return b;
  }, {});
}, Qa = {ip:"ip", date:"date"}, Ua = async() => {
  var a = U, b = X, {F:c = 1, B:d = 0} = {F:Sa, B:Ta};
  const e = `${b}-*`, f = `hits-${b}`;
  b = {properties:Ra()};
  a = await T(`${a}/_template/${f}`, {g:{method:"PUT", timeout:5000}}, {settings:{number_of_shards:c, number_of_replicas:d}, version:1, mappings:{hit:b}, index_patterns:[e]});
  setTimeout(() => {
    console.log("Created %s%s", M(f, "red"), " template");
    console.log("%s%s indices with %s shards and %s replicas", "for     ", M(e, "grey"), c, d);
  }, 1);
  return a;
}, Va = async() => await T(`${U}/${Y}`, {g:{method:"DELETE", timeout:5000}});
var Wa = async() => {
  const a = await L("Fetching the list of pipelines", Ma());
  var b = Object.keys(a).map((b) => {
    const c = a[b];
    return {name:b, description:c.description, processors:c.processors.map((a) => Object.keys(a).map((b) => `${M(b, "magenta")}: ${a[b].field}`).join(", ")).join("\n")};
  });
  b = H({keys:["name", "description", "processors"], data:b, m:{name:"Name", description:"Description", processors:"Processors"}});
  console.log(b);
};
const Z = function(a, b) {
  a = void 0 === a ? {} : a;
  b = void 0 === b ? process.argv : b;
  [, , ...b] = b;
  const c = Ca(b);
  b = b.slice(c.length);
  let d = !c.length;
  return Object.keys(a).reduce((b, f) => {
    var e = Object.assign({}, b);
    b = b.c;
    e = (delete e.c, e);
    if (0 == b.length && d) {
      return Object.assign({}, {c:b}, e);
    }
    const h = a[f];
    let k;
    if ("string" == typeof h) {
      ({value:k, argv:b} = F(b, f, h));
    } else {
      try {
        const {a, j:e, P:g, u:t, multiple:z} = h;
        t && z && c.length ? (k = c, d = !0) : t && c.length ? (k = c[0], d = !0) : {value:k, argv:b} = F(b, f, a, e, g);
      } catch (l) {
        return Object.assign({}, {c:b}, e);
      }
    }
    return void 0 === k ? Object.assign({}, {c:b}, e) : Object.assign({}, {c:b}, e, {[f]:k});
  }, {c:b});
}({url:{u:!0}, help:{a:"h", j:!0}, template:{a:"t"}, templates:{a:"T", j:!0}, "delete":{a:"d"}, shards:{a:"s", type:"number"}, replicas:{a:"r", type:"number"}, pipeline:{a:"p"}, pipelines:{a:"P", j:!0}, "remove-pipeline":{a:"rp"}, version:{a:"v", j:!0}}), U = Z.url, Xa = Z.help, V = Z.pipeline, X = Z.template, Y = Z["delete"], Sa = Z.shards, Ta = Z.replicas, Ya = Z.pipelines, Za = Z.templates, W = Z["remove-pipeline"];
if (Z.version) {
  console.log("1.0.0"), process.exit();
} else {
  if (Xa) {
    const a = Ja();
    console.log(a);
    process.exit();
  }
}
(async() => {
  try {
    if (!U) {
      throw Error("No ElasticSearch URL.");
    }
    if (Ya) {
      return await Wa();
    }
    if (V) {
      await L(`Creating a pipeline ${M(V, "yellow")}`, La()), console.log("Pipeline %s created.", M(V, "green"));
    } else {
      if (W) {
        await L(`Removing ${M(W, "yellow")} pipeline`, Oa()), console.log("Pipeline %s removed.", Q(W, "red"));
      } else {
        if (X) {
          await L(`Creating ${M(X, "yellow")} template`, Ua());
        } else {
          if (Y) {
            await Ia.confirm(`Are you sure you want to delete index ${M(Y, "yellow")}`, {M:!1}) && (await L(`Deleting ${M(Y, "yellow")} index`, Va()), console.log("Successfully deleted index %s", M(Y, "red")));
          } else {
            if (Za) {
              return await Pa();
            }
          }
        }
      }
    }
  } catch (a) {
    console.log(process.env.DEBUG ? a.stack : Q(a.message, "red"));
  }
})();

