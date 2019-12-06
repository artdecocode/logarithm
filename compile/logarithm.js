#!/usr/bin/env node
             
const https = require('https');
const http = require('http');
const util = require('util');
const url = require('url');
const os = require('os');
const zlib = require('zlib');
const stream = require('stream');
const querystring = require('querystring');             
const {request:v} = https;
const {request:y} = http;
const {debuglog:z} = util;
const A = (a, b = 0, c = !1) => {
  if (0 === b && !c) {
    return a;
  }
  a = a.split("\n", c ? b + 1 : void 0);
  return c ? a[a.length - 1] : a.slice(b).join("\n");
}, B = (a, b = !1) => A(a, 2 + (b ? 1 : 0)), C = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:G} = os;
const H = /\s+at.*(?:\(|\s)(.*)\)?/, I = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, J = G(), K = a => {
  const {pretty:b = !1, ignoredModules:c = ["pirates"]} = {}, f = new RegExp(I.source.replace("IGNORED_MODULES", c.join("|")));
  return a.replace(/\\/g, "/").split("\n").filter(d => {
    d = d.match(H);
    if (null === d || !d[1]) {
      return !0;
    }
    d = d[1];
    return d.includes(".app/Contents/Resources/electron.asar") || d.includes(".app/Contents/Resources/default_app.asar") ? !1 : !f.test(d);
  }).filter(d => d.trim()).map(d => b ? d.replace(H, (e, g) => e.replace(g, g.replace(J, "~"))) : d).join("\n");
};
function L(a, b, c = !1) {
  return function(f) {
    var d = C(arguments), {stack:e} = Error();
    const g = A(e, 2, !0), k = (e = f instanceof Error) ? f.message : f;
    d = [`Error: ${k}`, ...null !== d && a === d || c ? [b] : [g, b]].join("\n");
    d = K(d);
    return Object.assign(e ? f : Error(), {message:k, stack:d});
  };
}
;function M(a) {
  var {stack:b} = Error();
  const c = C(arguments);
  b = B(b, a);
  return L(c, b, a);
}
;const {parse:N} = url;
const {Writable:O} = stream;
const P = (a, b) => {
  b.once("error", c => {
    a.emit("error", c);
  });
  return b;
};
class Q extends O {
  constructor(a) {
    const {binary:b = !1, rs:c = null, ...f} = a || {}, {a:d = M(!0), proxyError:e} = a || {}, g = (k, m) => d(m);
    super(f);
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
          g`${h}`;
        } else {
          const r = K(h.stack);
          h.stack = r;
          e && g`${h}`;
        }
        m(h);
      });
      c && P(this, c).pipe(this);
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
const R = async(a, b = {}) => {
  ({c:a} = new Q({rs:a, ...b, a:M(!0)}));
  return await a;
};
const {createGunzip:S} = zlib;
const T = a => {
  ({"content-encoding":a} = a.headers);
  return "gzip" == a;
}, U = (a, b, c = {}) => {
  const {justHeaders:f, binary:d, a:e = M(!0)} = c;
  let g, k, m, h, r = 0, u = 0;
  c = (new Promise((t, w) => {
    g = a(b, async l => {
      ({headers:k} = l);
      const {statusMessage:p, statusCode:q} = l;
      m = {statusMessage:p, statusCode:q};
      if (f) {
        l.destroy();
      } else {
        var n = T(l);
        l.on("data", x => r += x.byteLength);
        l = n ? l.pipe(S()) : l;
        h = await R(l, {binary:d});
        u = h.length;
      }
      t();
    }).on("error", l => {
      l = e(l);
      w(l);
    }).on("timeout", () => {
      g.abort();
    });
  })).then(() => ({body:h, headers:k, ...m, h:r, byteLength:u, f:null}));
  return {req:g, c};
};
const V = (a = {}) => Object.keys(a).reduce((b, c) => {
  const f = a[c];
  c = `${encodeURIComponent(c)}=${encodeURIComponent(f)}`;
  return [...b, c];
}, []).join("&").replace(/%20/g, "+"), W = async(a, b, {data:c, justHeaders:f, binary:d, a:e = M(!0)}) => {
  const {req:g, c:k} = U(a, b, {justHeaders:f, binary:d, a:e});
  g.end(c);
  a = await k;
  ({"content-type":b = ""} = a.headers);
  if ((b = b.startsWith("application/json")) && a.body) {
    try {
      a.f = JSON.parse(a.body);
    } catch (m) {
      throw e = e(m), e.response = a.body, e;
    }
  }
  return a;
};
let X;
try {
  const {version:a, name:b} = require("../package.json");
  X = "@rqt/aqt" == b ? `@rqt/aqt/${a}` : `@rqt/aqt via ${b}/${a}`;
} catch (a) {
  X = "@aqt/rqt";
}
const Y = z("aqt"), Z = async(a, b = {}) => {
  const {data:c, type:f = "json", headers:d = {"User-Agent":`Mozilla/5.0 (Node.JS) ${X}`}, compress:e = !0, binary:g = !1, justHeaders:k = !1, method:m, timeout:h} = b;
  b = M(!0);
  const {hostname:r, protocol:u, port:t, path:w} = N(a), l = "https:" === u ? v : y, p = {hostname:r, port:t, path:w, headers:{...d}, timeout:h, method:m};
  if (c) {
    var q = f;
    var n = c;
    switch(q) {
      case "json":
        n = JSON.stringify(n);
        q = "application/json";
        break;
      case "form":
        n = V(n), q = "application/x-www-form-urlencoded";
    }
    n = {data:n, contentType:q};
    ({data:q} = n);
    ({contentType:n} = n);
    p.method = m || "POST";
    "Content-Type" in p.headers || (p.headers["Content-Type"] = n);
    "Content-Length" in p.headers || (p.headers["Content-Length"] = Buffer.byteLength(q));
  }
  !e || "Accept-Encoding" in p.headers || (p.headers["Accept-Encoding"] = "gzip, deflate");
  const {body:x, headers:aa, byteLength:D, statusCode:ba, statusMessage:ca, h:E, f:F} = await W(l, p, {data:q, justHeaders:k, binary:g, a:b});
  Y("%s %s B%s", a, D, `${D != E ? ` (raw ${E} B)` : ""}`);
  return {body:F ? F : x, headers:aa, statusCode:ba, statusMessage:ca};
};
const da = async(a, b = {}) => {
  ({body:a} = await Z(a, b));
  return a;
};
const {stringify:ea} = querystring;
const fa = async(a, {i:b, query:c = {}} = {}, f) => {
  c = ea(c);
  const {error:d, ...e} = await da(`${/^https?:\/\//.test(a) ? a : `http://${a}`}${c ? `?${c}` : ""}`, {...b, data:f});
  if (d) {
    throw Error("string" == typeof d ? d : d.reason);
  }
  return e;
};
module.exports = {_logarithm:a => {
  if (!a) {
    throw Error("Options are not given");
  }
  const {app:b, index:c = b, pipeline:f = "info", url:d} = a;
  if (!b) {
    throw Error("The app is not defined");
  }
  return async(e, g) => {
    let k;
    try {
      await g();
    } catch (t) {
      k = t;
    }
    const {request:{ip:m, path:h}, headers:{...r}, status:u} = e;
    e = new Date;
    g = {app:b, ip:m, path:decodeURI(h), headers:{"user-agent":null, ...r, cookie:void 0}, status:u, date:e};
    fa(`${d}/${`${c}-${e.getFullYear()}.${e.getMonth() + 1}`}/_doc`, {i:{method:"POST", timeout:5000}, query:{pipeline:f}}, g).then(() => {
    }).catch(({message:t}) => {
      console.log(`Logarithm ERROR: ${t}`);
    });
    if (k) {
      throw k;
    }
  };
}, _ping:async(a, b = 30000) => {
  ({statusCode:a} = await Z(a, {timeout:b, justHeaders:!0, method:"HEAD"}));
  if (200 != a) {
    throw Error(`Server responded with status code ${a}`);
  }
}};


//# sourceMappingURL=logarithm.js.map