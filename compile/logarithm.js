#!/usr/bin/env node
             
const https = require('https');
const http = require('http');
const util = require('util');
const url = require('url');
const os = require('os');
const zlib = require('zlib');
const stream = require('stream');
const querystring = require('querystring');             
const u = https.request;
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
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, g = new RegExp(H.source.replace("IGNORED_MODULES", c.join("|")));
  return a.replace(/\\/g, "/").split("\n").filter(d => {
    d = d.match(G);
    if (null === d || !d[1]) {
      return !0;
    }
    d = d[1];
    return d.includes(".app/Contents/Resources/electron.asar") || d.includes(".app/Contents/Resources/default_app.asar") ? !1 : !g.test(d);
  }).filter(d => d.trim()).map(d => b ? d.replace(G, (e, f) => e.replace(f, f.replace(I, "~"))) : d).join("\n");
};
function K(a, b, c = !1) {
  return function(g) {
    var d = B(arguments), {stack:e} = Error();
    const f = z(e, 2, !0), k = (e = g instanceof Error) ? g.message : g;
    d = [`Error: ${k}`, ...null !== d && a === d || c ? [b] : [f, b]].join("\n");
    d = J(d);
    return Object.assign(e ? g : Error(), {message:k, stack:d});
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
    const {binary:b = !1, rs:c = null, ...g} = a || {}, {a:d = L(!0), proxyError:e} = a || {}, f = (k, m) => d(m);
    super(g);
    this.b = [];
    this.g = new Promise((k, m) => {
      this.on("finish", () => {
        let h;
        b ? h = Buffer.concat(this.b) : h = this.b.join("");
        k(h);
        this.b = [];
      });
      this.once("error", h => {
        if (-1 == h.stack.indexOf("\n")) {
          f`${h}`;
        } else {
          const r = J(h.stack);
          h.stack = r;
          e && f`${h}`;
        }
        m(h);
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
  const {justHeaders:g, binary:d, a:e = L(!0)} = c;
  let f, k, m, h, r = 0, v = 0;
  c = (new Promise((t, w) => {
    f = a(b, async l => {
      ({headers:k} = l);
      m = {statusMessage:l.statusMessage, statusCode:l.statusCode};
      if (g) {
        l.destroy();
      } else {
        var n = "gzip" == l.headers["content-encoding"];
        l.on("data", q => r += q.byteLength);
        l = n ? l.pipe(R()) : l;
        h = await Q(l, {binary:d});
        v = h.length;
      }
      t();
    }).on("error", l => {
      l = e(l);
      w(l);
    }).on("timeout", () => {
      f.abort();
    });
  })).then(() => ({body:h, headers:k, ...m, h:r, byteLength:v, f:null}));
  return {req:f, c};
};
const T = (a = {}) => Object.keys(a).reduce((b, c) => {
  const g = a[c];
  c = `${encodeURIComponent(c)}=${encodeURIComponent(g)}`;
  return [...b, c];
}, []).join("&").replace(/%20/g, "+"), U = async(a, b, {data:c, justHeaders:g, binary:d, a:e = L(!0)}) => {
  const {req:f, c:k} = S(a, b, {justHeaders:g, binary:d, a:e});
  f.end(c);
  a = await k;
  if ((a.headers["content-type"] || "").startsWith("application/json") && a.body) {
    try {
      a.f = JSON.parse(a.body);
    } catch (m) {
      throw e = e(m), e.response = a.body, e;
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
  const {data:c, type:g = "json", headers:d = {"User-Agent":`Mozilla/5.0 (Node.JS) ${V}`}, compress:e = !0, binary:f = !1, justHeaders:k = !1, method:m, timeout:h} = b;
  b = L(!0);
  const {hostname:r, protocol:v, port:t, path:w} = M(a), l = "https:" === v ? u : x, n = {hostname:r, port:t, path:w, headers:{...d}, timeout:h, method:m};
  if (c) {
    var q = g;
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
    n.method = m || "POST";
    "Content-Type" in n.headers || (n.headers["Content-Type"] = p);
    "Content-Length" in n.headers || (n.headers["Content-Length"] = Buffer.byteLength(q));
  }
  !e || "Accept-Encoding" in n.headers || (n.headers["Accept-Encoding"] = "gzip, deflate");
  const {body:Y, headers:Z, byteLength:C, statusCode:aa, statusMessage:ba, h:D, f:E} = await U(l, n, {data:q, justHeaders:k, binary:f, a:b});
  W("%s %s B%s", a, C, `${C != D ? ` (raw ${D} B)` : ""}`);
  return {body:E ? E : Y, headers:Z, statusCode:aa, statusMessage:ba};
};
const ca = async(a, b = {}) => {
  ({body:a} = await X(a, b));
  return a;
};
const da = querystring.stringify;
const ea = async(a, {i:b, query:c = {}} = {}, g) => {
  const d = L();
  c = da(c);
  const {error:e, ...f} = await ca(`${/^https?:\/\//.test(a) ? a : `http://${a}`}${c ? `?${c}` : ""}`, {...b, data:g});
  if (e) {
    throw a = Error("string" == typeof e ? e : e.reason), e.type && (a.type = e.type), d(a);
  }
  return f;
};
module.exports = {_logarithm:a => {
  if (!a) {
    throw Error("Options are not given");
  }
  const {app:b, index:c = b, pipeline:g = "info", url:d} = a;
  if (!b) {
    throw Error("The app is not defined");
  }
  return async(e, f) => {
    let k;
    try {
      await f();
    } catch (t) {
      k = t;
    }
    const {request:{ip:m, path:h}, headers:{...r}, status:v} = e;
    e = new Date;
    f = {app:b, ip:m, path:decodeURI(h), headers:{"user-agent":"", ...r, cookie:void 0}, status:v, date:e};
    ea(`${d}/${`${c}-${e.getFullYear()}.${e.getMonth() + 1}`}/_doc`, {i:{method:"POST", timeout:5000}, query:{pipeline:g}}, f).then(() => {
    }).catch(({message:t}) => {
      console.log(`Logarithm ERROR: ${t}`);
    });
    if (k) {
      throw k;
    }
  };
}, _ping:async(a, b = 30000) => {
  ({statusCode:a} = await X(a, {timeout:b, justHeaders:!0, method:"HEAD"}));
  if (200 != a) {
    throw Error(`Server responded with status code ${a}`);
  }
}};


//# sourceMappingURL=logarithm.js.map