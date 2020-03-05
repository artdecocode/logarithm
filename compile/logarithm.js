#!/usr/bin/env node
             
const https = require('https');
const http = require('http');
const util = require('util');
const url = require('url');
const os = require('os');
const zlib = require('zlib');
const stream = require('stream');
const querystring = require('querystring');             
const t = https.request;
const x = http.request;
const y = util.debuglog;
const z = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, A = (a, b = !1) => z(a, 2 + (b ? 1 : 0)), B = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const F = os.homedir;
const G = /\s+at.*(?:\(|\s)(.*)\)?/, H = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, I = F(), J = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, f = new RegExp(H.source.replace("IGNORED_MODULES", c.join("|")));
  return a.replace(/\\/g, "/").split("\n").filter(d => {
    d = d.match(G);
    if (null === d || !d[1]) {
      return !0;
    }
    d = d[1];
    return d.includes(".app/Contents/Resources/electron.asar") || d.includes(".app/Contents/Resources/default_app.asar") ? !1 : !f.test(d);
  }).filter(d => d.trim()).map(d => b ? d.replace(G, (e, k) => e.replace(k, k.replace(I, "~"))) : d).join("\n");
};
function K(a, b, c = !1) {
  return function(f) {
    var d = B(arguments), {stack:e} = Error();
    const k = z(e, 2, !0), m = (e = f instanceof Error) ? f.message : f;
    d = [`Error: ${m}`, ...null !== d && a === d || c ? [b] : [k, b]].join("\n");
    d = J(d);
    return Object.assign(e ? f : Error(), {message:m, stack:d});
  };
}
;function L(a) {
  var {stack:b} = Error();
  const c = B(arguments);
  b = A(b, a);
  return K(c, b, a);
}
;const M = url.parse;
const N = stream.Writable;
const O = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class P extends N {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...f} = a || {}, {a:d = L(!0), proxyError:e} = a || {}, k = (m, l) => d(l);
    super(f);
    this.b = [];
    this.g = new Promise((m, l) => {
      this.on("finish", () => {
        let g;
        b ? g = Buffer.concat(this.b) : g = this.b.join("");
        m(g);
        this.b = [];
      });
      this.once("error", g => {
        if (-1 == g.stack.indexOf("\n")) {
          k`${g}`;
        } else {
          const r = J(g.stack);
          g.stack = r;
          e && k`${g}`;
        }
        l(g);
      });
      c && O(this, c).pipe(this);
    });
  }
  _write(a, b, c) {
    this.b.push(a);
    c();
  }
  get c() {
    return this.g;
  }
}
const Q = async(a, b = {}) => {
  ({c:a} = new P({rs:a, ...b, a:L(!0)}));
  return await a;
};
const R = zlib.createGunzip;
const S = (a, b, c = {}) => {
  const {justHeaders:f, binary:d, a:e = L(!0)} = c;
  let k, m, l, g, r = 0, u = 0;
  c = (new Promise((v, w) => {
    k = a(b, async h => {
      ({headers:m} = h);
      l = {statusMessage:h.statusMessage, statusCode:h.statusCode};
      if (f) {
        h.destroy();
      } else {
        var n = "gzip" == h.headers["content-encoding"];
        h.on("data", q => r += q.byteLength);
        h = n ? h.pipe(R()) : h;
        g = await Q(h, {binary:d});
        u = g.length;
      }
      v();
    }).on("error", h => {
      h = e(h);
      w(h);
    }).on("timeout", () => {
      k.abort();
    });
  })).then(() => ({body:g, headers:m, ...l, h:r, byteLength:u, f:null}));
  return {req:k, c};
};
const T = (a = {}) => Object.keys(a).reduce((b, c) => {
  const f = a[c];
  c = `${encodeURIComponent(c)}=${encodeURIComponent(f)}`;
  return [...b, c];
}, []).join("&").replace(/%20/g, "+"), U = async(a, b, {data:c, justHeaders:f, binary:d, a:e = L(!0)}) => {
  const {req:k, c:m} = S(a, b, {justHeaders:f, binary:d, a:e});
  k.end(c);
  a = await m;
  if ((a.headers["content-type"] || "").startsWith("application/json") && a.body) {
    try {
      a.f = JSON.parse(a.body);
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
const W = y("aqt"), X = async(a, b = {}) => {
  const {data:c, type:f = "json", headers:d = {"User-Agent":`Mozilla/5.0 (Node.JS) ${V}`}, compress:e = !0, binary:k = !1, justHeaders:m = !1, method:l, timeout:g} = b;
  b = L(!0);
  const {hostname:r, protocol:u, port:v, path:w} = M(a), h = "https:" === u ? t : x, n = {hostname:r, port:v, path:w, headers:{...d}, timeout:g, method:l};
  if (c) {
    var q = f;
    var p = c;
    switch(q) {
      case "json":
        p = JSON.stringify(p);
        q = "application/json";
        break;
      case "form":
        p = T(p), q = "application/x-www-form-urlencoded";
    }
    p = {data:p, contentType:q};
    ({data:q} = p);
    p = p.contentType;
    n.method = l || "POST";
    "Content-Type" in n.headers || (n.headers["Content-Type"] = p);
    "Content-Length" in n.headers || (n.headers["Content-Length"] = Buffer.byteLength(q));
  }
  !e || "Accept-Encoding" in n.headers || (n.headers["Accept-Encoding"] = "gzip, deflate");
  const {body:Y, headers:Z, byteLength:C, statusCode:aa, statusMessage:ba, h:D, f:E} = await U(h, n, {data:q, justHeaders:m, binary:k, a:b});
  W("%s %s B%s", a, C, `${C != D ? ` (raw ${D} B)` : ""}`);
  return {body:E ? E : Y, headers:Z, statusCode:aa, statusMessage:ba};
};
const ca = async(a, b = {}) => {
  ({body:a} = await X(a, b));
  return a;
};
const da = querystring.stringify;
const ea = async(a, {i:b, query:c = {}} = {}, f) => {
  const d = L();
  c = da(c);
  const {error:e, ...k} = await ca(`${/^https?:\/\//.test(a) ? a : `http://${a}`}${c ? `?${c}` : ""}`, {...b, data:f});
  if (e) {
    throw a = Error("string" == typeof e ? e : e.reason), e.type && (a.type = e.type), d(a);
  }
  return k;
};
const fa = (a, b) => `${a}-${b.getFullYear()}.${b.getMonth() + 1}`;
module.exports = {_logarithm:a => {
  if (!a) {
    throw Error("Options are not given");
  }
  const {app:b, index:c = b, pipeline:f = "info", url:d, timeout:e = 5000, strategy:k = fa} = a;
  if (!b) {
    throw Error("The app is not defined");
  }
  return async(m, l) => {
    let g;
    try {
      await l();
    } catch (h) {
      g = h;
    }
    const {request:{ip:r, path:u}, headers:{...v}, status:w} = m;
    l = new Date;
    m = {app:b, ip:r, path:decodeURI(u), headers:{"user-agent":"", ...v, cookie:void 0}, status:w, date:l};
    l = k(c, l);
    ea(`${d}/${l}/_doc`, {i:{method:"POST", timeout:e}, query:{pipeline:f}}, m).then(() => {
    }).catch(({message:h}) => {
      console.log(`Logarithm ERROR: ${h}`);
    });
    if (g) {
      throw g;
    }
  };
}, _ping:async(a, b = 30000) => {
  ({statusCode:a} = await X(a, {timeout:b, justHeaders:!0, method:"HEAD"}));
  if (200 != a) {
    throw Error(`Server responded with status code ${a}`);
  }
}};


//# sourceMappingURL=logarithm.js.map