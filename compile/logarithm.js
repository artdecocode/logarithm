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
  }).filter(d => d.trim()).map(d => b ? d.replace(G, (e, g) => e.replace(g, g.replace(I, "~"))) : d).join("\n");
};
function K(a, b, c = !1) {
  return function(f) {
    var d = B(arguments), {stack:e} = Error();
    const g = z(e, 2, !0), l = (e = f instanceof Error) ? f.message : f;
    d = [`Error: ${l}`, ...null !== d && a === d || c ? [b] : [g, b]].join("\n");
    d = J(d);
    return Object.assign(e ? f : Error(), {message:l, stack:d});
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
    const {binary:b = !1, rs:c = null, ...f} = a || {}, {a:d = L(!0), proxyError:e} = a || {}, g = (l, m) => d(m);
    super(f);
    this.b = [];
    this.g = new Promise((l, m) => {
      this.on("finish", () => {
        let h;
        b ? h = Buffer.concat(this.b) : h = this.b.join("");
        l(h);
        this.b = [];
      });
      this.once("error", h => {
        if (-1 == h.stack.indexOf("\n")) {
          g`${h}`;
        } else {
          const r = J(h.stack);
          h.stack = r;
          e && g`${h}`;
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
  const {justHeaders:f, binary:d, a:e = L(!0)} = c;
  let g, l, m, h, r = 0, u = 0;
  c = (new Promise((w, v) => {
    g = a(b, async k => {
      ({headers:l} = k);
      m = {statusMessage:k.statusMessage, statusCode:k.statusCode};
      if (f) {
        k.destroy();
      } else {
        var n = "gzip" == k.headers["content-encoding"];
        k.on("data", q => r += q.byteLength);
        k = n ? k.pipe(R()) : k;
        h = await Q(k, {binary:d});
        u = h.length;
      }
      w();
    }).on("error", k => {
      k = e(k);
      v(k);
    }).on("timeout", () => {
      g.abort();
    });
  })).then(() => ({body:h, headers:l, ...m, h:r, byteLength:u, f:null}));
  return {req:g, c};
};
const T = (a = {}) => Object.keys(a).reduce((b, c) => {
  const f = a[c];
  c = `${encodeURIComponent(c)}=${encodeURIComponent(f)}`;
  return [...b, c];
}, []).join("&").replace(/%20/g, "+"), U = async(a, b, {data:c, justHeaders:f, binary:d, a:e = L(!0)}) => {
  const {req:g, c:l} = S(a, b, {justHeaders:f, binary:d, a:e});
  g.end(c);
  a = await l;
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
  const {data:c, type:f = "json", headers:d = {"User-Agent":`Mozilla/5.0 (Node.JS) ${V}`}, compress:e = !0, binary:g = !1, justHeaders:l = !1, method:m, timeout:h} = b;
  b = L(!0);
  const {hostname:r, protocol:u, port:w, path:v} = M(a), k = "https:" === u ? t : x, n = {hostname:r, port:w, path:v, headers:{...d}, timeout:h, method:m};
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
    n.method = m || "POST";
    "Content-Type" in n.headers || (n.headers["Content-Type"] = p);
    "Content-Length" in n.headers || (n.headers["Content-Length"] = Buffer.byteLength(q));
  }
  !e || "Accept-Encoding" in n.headers || (n.headers["Accept-Encoding"] = "gzip, deflate");
  const {body:Z, headers:aa, byteLength:C, statusCode:ba, statusMessage:ca, h:D, f:E} = await U(k, n, {data:q, justHeaders:l, binary:g, a:b});
  W("%s %s B%s", a, C, `${C != D ? ` (raw ${D} B)` : ""}`);
  return {body:E ? E : Z, headers:aa, statusCode:ba, statusMessage:ca};
};
const da = async(a, b = {}) => {
  ({body:a} = await X(a, b));
  return a;
};
const ea = querystring.stringify;
const fa = async(a, {i:b, query:c = {}} = {}, f) => {
  const d = L();
  c = ea(c);
  const {error:e, ...g} = await da(`${/^https?:\/\//.test(a) ? a : `http://${a}`}${c ? `?${c}` : ""}`, {...b, data:f});
  if (e) {
    throw a = Error("string" == typeof e ? e : e.reason), e.type && (a.type = e.type), d(a);
  }
  return g;
};
const Y = (a, b) => {
  const {app:c, index:f = c, pipeline:d = "info", url:e, timeout:g = 5000, strategy:l = ha} = b, {request:{ip:m, path:h}, headers:{...r}, method:u, status:w, query:v} = a;
  b = new Date;
  a = {app:c, method:u, ip:m, path:decodeURI(h), headers:{"user-agent":"", ...r, cookie:void 0}, status:w, date:b};
  Object.keys(v).length && (a.query = v);
  b = l(f, b);
  fa(`${e}/${b}/_doc`, {i:{method:"POST", timeout:g}, query:{pipeline:d}}, a).then(() => {
  }).catch(({message:k}) => {
    console.log(`Logarithm ERROR: ${k}`);
  });
}, ha = (a, b) => `${a}-${b.getFullYear()}.${b.getMonth() + 1}`;
module.exports = {_logarithm:a => {
  if (!a) {
    throw Error("Options are not given");
  }
  if (!a.app) {
    throw Error("The app is not defined");
  }
  return async(b, c) => {
    const f = b.onerror;
    let d = !1;
    b.onerror = e => {
      f.call(b, e);
      e && (d = !0, Y(b, a));
    };
    await c();
    d ? console.log("[logarithm] Error has been handled by context but not thrown in middleware chain.") : Y(b, a);
  };
}, _ping:async(a, b = 30000) => {
  ({statusCode:a} = await X(a, {timeout:b, justHeaders:!0, method:"HEAD"}));
  if (200 != a) {
    throw Error(`Server responded with status code ${a}`);
  }
}};


//# sourceMappingURL=logarithm.js.map