(() => {
  var t,
    e,
    s,
    r,
    n = {
      653: (t) => {
        t.exports = {
          CREATED: "games:created",
          START: "games:start",
          USER_ADDED: "games:user_added",
          STATE_UPDATED: "games:state_update",
          HAND_UPDATED: "games:hand_updated",
        };
      },
      569: (t, e, s) => {
        "use strict";
        s.d(e, { j: () => a });
        var r = s(466),
          n = s(653),
          i = s(15);
        let o;
        const a = () => (
            (o = (0, r.io)({ query: { id: i.ze } })),
            o.on(n.STATE_UPDATED, p),
            console.log("Game socket configured"),
            Promise.resolve(o)
          ),
          c = document.querySelector("#card"),
          h =
            (document.querySelector(".player-one-hand"),
            document.querySelector(".player-two-hand"),
            document.querySelector("#community-cards")),
          u = (t, e) => {
            e.forEach(({ suit: e, number: s }, r) => {
              const n = c.content.cloneNode(!0).querySelector(".card");
              n.classList.add(`suit-${e}`),
                n.classList.add(`number-${s}`),
                t.appendChild(n);
            });
          },
          p = ({ game_id: t, flopCards: e, turnCards: s, riverCards: r }) => {
            console.log(n.STATE_UPDATED, {
              game_id: t,
              flopCards: e,
              turnCards: s,
              riverCards: r,
            }),
              console.log("WEB POSITION HERE"),
              (h.innerHTML = ""),
              u(h, e),
              u(h, s),
              u(h, r);
          };
      },
      36: (t, e, s) => {
        "use strict";
        s.a(
          t,
          async (t, e) => {
            try {
              var r = s(569),
                n = s(261),
                i = s(15),
                o = s(120);
              const t = await (0, r.j)(),
                a = await (0, n.j)();
              (0, o.C)(t, a);
              const c = (t) => {
                t.preventDefault();
                const { action: e, method: s } = t.target.attributes;
                return fetch(e.value, { method: s.value }), !1;
              };
              i.uE.addEventListener("submit", c),
                i.kM.addEventListener("submit", c),
                i.rX.addEventListener("submit", c),
                e();
            } catch (t) {
              e(t);
            }
          },
          1,
        );
      },
      15: (t, e, s) => {
        "use strict";
        s.d(e, {
          KX: () => i,
          OP: () => o,
          eO: () => r,
          kM: () => c,
          po: () => u,
          rX: () => h,
          uE: () => a,
          ze: () => n,
        });
        const r = document.querySelector("#room-id").value,
          n = document.querySelector("#game-socket-id").value,
          i = document.querySelector("#user-socket-id").value,
          o = document.querySelector("#card"),
          a = document.querySelector("#check-form"),
          c = document.querySelector("#raise-form"),
          h = document.querySelector("#fold-form"),
          u = document.querySelector("#player1");
      },
      120: (t, e, s) => {
        "use strict";
        s.d(e, { C: () => o });
        var r = s(15);
        const n = { game: !1, user: !1, updated: Date.now() },
          i = () => {
            const { game: t, user: e } = n;
            t && e && fetch(`/games/${r.eO}/ready`, { method: "post" });
          },
          o = (t, e) => {
            console.log("READY CALLED", n),
              t.on("connect", () => {
                (n.game = !0), (n.updated = Date.now()), i();
              }),
              e.on("connect", () => {
                (n.user = !0), (n.updated = Date.now()), i();
              });
          };
      },
      261: (t, e, s) => {
        "use strict";
        s.d(e, { j: () => a });
        var r = s(466),
          n = s(653),
          i = s(15);
        let o;
        const a = () => (
            (o = (0, r.io)({ query: { id: i.KX } })),
            o.on(
              n.HAND_UPDATED,
              ({ current_person_playing: t, hand: e, chip_count: s }) => {
                console.log(n.HAND_UPDATED, {
                  current_person_playing: t,
                  hand: e,
                  chip_count: s,
                }),
                  c(e, s);
              },
            ),
            console.log("User socket configured"),
            Promise.resolve(o)
          ),
          c = (t, e, s) => {
            console.log(
              "UPDATE HAND",
              { cardList: t, chip_count: e, seat: s },
              Array.isArray(t),
            ),
              (i.po.innerHTML = "");
            const r = String(s),
              n = document.createElement("p");
            (n.textContent = `PLAYER ${r} HERE: CHIP_COUNT = ${e}`),
              i.po.appendChild(n),
              t.forEach(({ suit: t, number: e }, s) => {
                const r = i.OP.content.cloneNode(!0).querySelector(".card");
                r.classList.add(`suit-${t}`),
                  r.classList.add(`number-${e}`),
                  i.po.appendChild(r);
              });
          };
      },
      260: (t, e, s) => {
        "use strict";
        function r(t) {
          if (t)
            return (function (t) {
              for (var e in r.prototype) t[e] = r.prototype[e];
              return t;
            })(t);
        }
        s.d(e, { Q: () => r }),
          (r.prototype.on = r.prototype.addEventListener =
            function (t, e) {
              return (
                (this._callbacks = this._callbacks || {}),
                (this._callbacks["$" + t] =
                  this._callbacks["$" + t] || []).push(e),
                this
              );
            }),
          (r.prototype.once = function (t, e) {
            function s() {
              this.off(t, s), e.apply(this, arguments);
            }
            return (s.fn = e), this.on(t, s), this;
          }),
          (r.prototype.off =
            r.prototype.removeListener =
            r.prototype.removeAllListeners =
            r.prototype.removeEventListener =
              function (t, e) {
                if (
                  ((this._callbacks = this._callbacks || {}),
                  0 == arguments.length)
                )
                  return (this._callbacks = {}), this;
                var s,
                  r = this._callbacks["$" + t];
                if (!r) return this;
                if (1 == arguments.length)
                  return delete this._callbacks["$" + t], this;
                for (var n = 0; n < r.length; n++)
                  if ((s = r[n]) === e || s.fn === e) {
                    r.splice(n, 1);
                    break;
                  }
                return 0 === r.length && delete this._callbacks["$" + t], this;
              }),
          (r.prototype.emit = function (t) {
            this._callbacks = this._callbacks || {};
            for (
              var e = new Array(arguments.length - 1),
                s = this._callbacks["$" + t],
                r = 1;
              r < arguments.length;
              r++
            )
              e[r - 1] = arguments[r];
            if (s) {
              r = 0;
              for (var n = (s = s.slice(0)).length; r < n; ++r)
                s[r].apply(this, e);
            }
            return this;
          }),
          (r.prototype.emitReserved = r.prototype.emit),
          (r.prototype.listeners = function (t) {
            return (
              (this._callbacks = this._callbacks || {}),
              this._callbacks["$" + t] || []
            );
          }),
          (r.prototype.hasListeners = function (t) {
            return !!this.listeners(t).length;
          });
      },
      864: (t, e, s) => {
        "use strict";
        s.d(e, { w: () => n });
        let r = !1;
        try {
          r =
            "undefined" != typeof XMLHttpRequest &&
            "withCredentials" in new XMLHttpRequest();
        } catch (t) {}
        const n = r;
      },
      859: (t, e, s) => {
        "use strict";
        function r(t) {
          let e = "";
          for (let s in t)
            t.hasOwnProperty(s) &&
              (e.length && (e += "&"),
              (e += encodeURIComponent(s) + "=" + encodeURIComponent(t[s])));
          return e;
        }
        function n(t) {
          let e = {},
            s = t.split("&");
          for (let t = 0, r = s.length; t < r; t++) {
            let r = s[t].split("=");
            e[decodeURIComponent(r[0])] = decodeURIComponent(r[1]);
          }
          return e;
        }
        s.d(e, { J: () => n, c: () => r });
      },
      333: (t, e, s) => {
        "use strict";
        s.d(e, { Q: () => i });
        const r =
            /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
          n = [
            "source",
            "protocol",
            "authority",
            "userInfo",
            "user",
            "password",
            "host",
            "port",
            "relative",
            "path",
            "directory",
            "file",
            "query",
            "anchor",
          ];
        function i(t) {
          if (t.length > 2e3) throw "URI too long";
          const e = t,
            s = t.indexOf("["),
            i = t.indexOf("]");
          -1 != s &&
            -1 != i &&
            (t =
              t.substring(0, s) +
              t.substring(s, i).replace(/:/g, ";") +
              t.substring(i, t.length));
          let o = r.exec(t || ""),
            a = {},
            c = 14;
          for (; c--; ) a[n[c]] = o[c] || "";
          return (
            -1 != s &&
              -1 != i &&
              ((a.source = e),
              (a.host = a.host
                .substring(1, a.host.length - 1)
                .replace(/;/g, ":")),
              (a.authority = a.authority
                .replace("[", "")
                .replace("]", "")
                .replace(/;/g, ":")),
              (a.ipv6uri = !0)),
            (a.pathNames = (function (t, e) {
              const s = e.replace(/\/{2,9}/g, "/").split("/");
              return (
                ("/" != e.slice(0, 1) && 0 !== e.length) || s.splice(0, 1),
                "/" == e.slice(-1) && s.splice(s.length - 1, 1),
                s
              );
            })(0, a.path)),
            (a.queryKey = (function (t, e) {
              const s = {};
              return (
                e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function (t, e, r) {
                  e && (s[e] = r);
                }),
                s
              );
            })(0, a.query)),
            a
          );
        }
      },
      966: (t, e, s) => {
        "use strict";
        s.d(e, { l: () => u });
        const r =
            "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(
              "",
            ),
          n = 64,
          i = {};
        let o,
          a = 0,
          c = 0;
        function h(t) {
          let e = "";
          do {
            (e = r[t % n] + e), (t = Math.floor(t / n));
          } while (t > 0);
          return e;
        }
        function u() {
          const t = h(+new Date());
          return t !== o ? ((a = 0), (o = t)) : t + "." + h(a++);
        }
        for (; c < n; c++) i[r[c]] = c;
      },
      220: (t, e, s) => {
        "use strict";
        s.d(e, { p: () => r });
        const r =
          "undefined" != typeof self
            ? self
            : "undefined" != typeof window
            ? window
            : Function("return this")();
      },
      393: (t, e, s) => {
        "use strict";
        s.d(e, {
          Qc: () => i.Q,
          Vq: () => n.Vq,
          Y3: () => o.Y3,
          sk: () => r.s,
        });
        var r = s(794),
          n = (s(402), s(234), s(185)),
          i = s(333),
          o = s(892);
        r.s.protocol;
      },
      794: (t, e, s) => {
        "use strict";
        s.d(e, { s: () => u });
        var r = s(234),
          n = s(185),
          i = s(859),
          o = s(333),
          a = s(260),
          c = s(620),
          h = s(892);
        class u extends a.Q {
          constructor(t, e = {}) {
            super(),
              (this.binaryType = h.Xp),
              (this.writeBuffer = []),
              t && "object" == typeof t && ((e = t), (t = null)),
              t
                ? ((t = (0, o.Q)(t)),
                  (e.hostname = t.host),
                  (e.secure = "https" === t.protocol || "wss" === t.protocol),
                  (e.port = t.port),
                  t.query && (e.query = t.query))
                : e.host && (e.hostname = (0, o.Q)(e.host).host),
              (0, n.Vq)(this, e),
              (this.secure =
                null != e.secure
                  ? e.secure
                  : "undefined" != typeof location &&
                    "https:" === location.protocol),
              e.hostname && !e.port && (e.port = this.secure ? "443" : "80"),
              (this.hostname =
                e.hostname ||
                ("undefined" != typeof location
                  ? location.hostname
                  : "localhost")),
              (this.port =
                e.port ||
                ("undefined" != typeof location && location.port
                  ? location.port
                  : this.secure
                  ? "443"
                  : "80")),
              (this.transports = e.transports || [
                "polling",
                "websocket",
                "webtransport",
              ]),
              (this.writeBuffer = []),
              (this.prevBufferLen = 0),
              (this.opts = Object.assign(
                {
                  path: "/engine.io",
                  agent: !1,
                  withCredentials: !1,
                  upgrade: !0,
                  timestampParam: "t",
                  rememberUpgrade: !1,
                  addTrailingSlash: !0,
                  rejectUnauthorized: !0,
                  perMessageDeflate: { threshold: 1024 },
                  transportOptions: {},
                  closeOnBeforeunload: !1,
                },
                e,
              )),
              (this.opts.path =
                this.opts.path.replace(/\/$/, "") +
                (this.opts.addTrailingSlash ? "/" : "")),
              "string" == typeof this.opts.query &&
                (this.opts.query = (0, i.J)(this.opts.query)),
              (this.id = null),
              (this.upgrades = null),
              (this.pingInterval = null),
              (this.pingTimeout = null),
              (this.pingTimeoutTimer = null),
              "function" == typeof addEventListener &&
                (this.opts.closeOnBeforeunload &&
                  ((this.beforeunloadEventListener = () => {
                    this.transport &&
                      (this.transport.removeAllListeners(),
                      this.transport.close());
                  }),
                  addEventListener(
                    "beforeunload",
                    this.beforeunloadEventListener,
                    !1,
                  )),
                "localhost" !== this.hostname &&
                  ((this.offlineEventListener = () => {
                    this.onClose("transport close", {
                      description: "network connection lost",
                    });
                  }),
                  addEventListener("offline", this.offlineEventListener, !1))),
              this.open();
          }
          createTransport(t) {
            const e = Object.assign({}, this.opts.query);
            (e.EIO = c.TF), (e.transport = t), this.id && (e.sid = this.id);
            const s = Object.assign(
              {},
              this.opts,
              {
                query: e,
                socket: this,
                hostname: this.hostname,
                secure: this.secure,
                port: this.port,
              },
              this.opts.transportOptions[t],
            );
            return new r.g[t](s);
          }
          open() {
            let t;
            if (
              this.opts.rememberUpgrade &&
              u.priorWebsocketSuccess &&
              -1 !== this.transports.indexOf("websocket")
            )
              t = "websocket";
            else {
              if (0 === this.transports.length)
                return void this.setTimeoutFn(() => {
                  this.emitReserved("error", "No transports available");
                }, 0);
              t = this.transports[0];
            }
            this.readyState = "opening";
            try {
              t = this.createTransport(t);
            } catch (t) {
              return this.transports.shift(), void this.open();
            }
            t.open(), this.setTransport(t);
          }
          setTransport(t) {
            this.transport && this.transport.removeAllListeners(),
              (this.transport = t),
              t
                .on("drain", this.onDrain.bind(this))
                .on("packet", this.onPacket.bind(this))
                .on("error", this.onError.bind(this))
                .on("close", (t) => this.onClose("transport close", t));
          }
          probe(t) {
            let e = this.createTransport(t),
              s = !1;
            u.priorWebsocketSuccess = !1;
            const r = () => {
              s ||
                (e.send([{ type: "ping", data: "probe" }]),
                e.once("packet", (t) => {
                  if (!s)
                    if ("pong" === t.type && "probe" === t.data) {
                      if (
                        ((this.upgrading = !0),
                        this.emitReserved("upgrading", e),
                        !e)
                      )
                        return;
                      (u.priorWebsocketSuccess = "websocket" === e.name),
                        this.transport.pause(() => {
                          s ||
                            ("closed" !== this.readyState &&
                              (h(),
                              this.setTransport(e),
                              e.send([{ type: "upgrade" }]),
                              this.emitReserved("upgrade", e),
                              (e = null),
                              (this.upgrading = !1),
                              this.flush()));
                        });
                    } else {
                      const t = new Error("probe error");
                      (t.transport = e.name),
                        this.emitReserved("upgradeError", t);
                    }
                }));
            };
            function n() {
              s || ((s = !0), h(), e.close(), (e = null));
            }
            const i = (t) => {
              const s = new Error("probe error: " + t);
              (s.transport = e.name), n(), this.emitReserved("upgradeError", s);
            };
            function o() {
              i("transport closed");
            }
            function a() {
              i("socket closed");
            }
            function c(t) {
              e && t.name !== e.name && n();
            }
            const h = () => {
              e.removeListener("open", r),
                e.removeListener("error", i),
                e.removeListener("close", o),
                this.off("close", a),
                this.off("upgrading", c);
            };
            e.once("open", r),
              e.once("error", i),
              e.once("close", o),
              this.once("close", a),
              this.once("upgrading", c),
              -1 !== this.upgrades.indexOf("webtransport") &&
              "webtransport" !== t
                ? this.setTimeoutFn(() => {
                    s || e.open();
                  }, 200)
                : e.open();
          }
          onOpen() {
            if (
              ((this.readyState = "open"),
              (u.priorWebsocketSuccess = "websocket" === this.transport.name),
              this.emitReserved("open"),
              this.flush(),
              "open" === this.readyState && this.opts.upgrade)
            ) {
              let t = 0;
              const e = this.upgrades.length;
              for (; t < e; t++) this.probe(this.upgrades[t]);
            }
          }
          onPacket(t) {
            if (
              "opening" === this.readyState ||
              "open" === this.readyState ||
              "closing" === this.readyState
            )
              switch (
                (this.emitReserved("packet", t),
                this.emitReserved("heartbeat"),
                this.resetPingTimeout(),
                t.type)
              ) {
                case "open":
                  this.onHandshake(JSON.parse(t.data));
                  break;
                case "ping":
                  this.sendPacket("pong"),
                    this.emitReserved("ping"),
                    this.emitReserved("pong");
                  break;
                case "error":
                  const e = new Error("server error");
                  (e.code = t.data), this.onError(e);
                  break;
                case "message":
                  this.emitReserved("data", t.data),
                    this.emitReserved("message", t.data);
              }
          }
          onHandshake(t) {
            this.emitReserved("handshake", t),
              (this.id = t.sid),
              (this.transport.query.sid = t.sid),
              (this.upgrades = this.filterUpgrades(t.upgrades)),
              (this.pingInterval = t.pingInterval),
              (this.pingTimeout = t.pingTimeout),
              (this.maxPayload = t.maxPayload),
              this.onOpen(),
              "closed" !== this.readyState && this.resetPingTimeout();
          }
          resetPingTimeout() {
            this.clearTimeoutFn(this.pingTimeoutTimer),
              (this.pingTimeoutTimer = this.setTimeoutFn(() => {
                this.onClose("ping timeout");
              }, this.pingInterval + this.pingTimeout)),
              this.opts.autoUnref && this.pingTimeoutTimer.unref();
          }
          onDrain() {
            this.writeBuffer.splice(0, this.prevBufferLen),
              (this.prevBufferLen = 0),
              0 === this.writeBuffer.length
                ? this.emitReserved("drain")
                : this.flush();
          }
          flush() {
            if (
              "closed" !== this.readyState &&
              this.transport.writable &&
              !this.upgrading &&
              this.writeBuffer.length
            ) {
              const t = this.getWritablePackets();
              this.transport.send(t),
                (this.prevBufferLen = t.length),
                this.emitReserved("flush");
            }
          }
          getWritablePackets() {
            if (
              !(
                this.maxPayload &&
                "polling" === this.transport.name &&
                this.writeBuffer.length > 1
              )
            )
              return this.writeBuffer;
            let t = 1;
            for (let e = 0; e < this.writeBuffer.length; e++) {
              const s = this.writeBuffer[e].data;
              if ((s && (t += (0, n.k)(s)), e > 0 && t > this.maxPayload))
                return this.writeBuffer.slice(0, e);
              t += 2;
            }
            return this.writeBuffer;
          }
          write(t, e, s) {
            return this.sendPacket("message", t, e, s), this;
          }
          send(t, e, s) {
            return this.sendPacket("message", t, e, s), this;
          }
          sendPacket(t, e, s, r) {
            if (
              ("function" == typeof e && ((r = e), (e = void 0)),
              "function" == typeof s && ((r = s), (s = null)),
              "closing" === this.readyState || "closed" === this.readyState)
            )
              return;
            (s = s || {}).compress = !1 !== s.compress;
            const n = { type: t, data: e, options: s };
            this.emitReserved("packetCreate", n),
              this.writeBuffer.push(n),
              r && this.once("flush", r),
              this.flush();
          }
          close() {
            const t = () => {
                this.onClose("forced close"), this.transport.close();
              },
              e = () => {
                this.off("upgrade", e), this.off("upgradeError", e), t();
              },
              s = () => {
                this.once("upgrade", e), this.once("upgradeError", e);
              };
            return (
              ("opening" !== this.readyState && "open" !== this.readyState) ||
                ((this.readyState = "closing"),
                this.writeBuffer.length
                  ? this.once("drain", () => {
                      this.upgrading ? s() : t();
                    })
                  : this.upgrading
                  ? s()
                  : t()),
              this
            );
          }
          onError(t) {
            (u.priorWebsocketSuccess = !1),
              this.emitReserved("error", t),
              this.onClose("transport error", t);
          }
          onClose(t, e) {
            ("opening" !== this.readyState &&
              "open" !== this.readyState &&
              "closing" !== this.readyState) ||
              (this.clearTimeoutFn(this.pingTimeoutTimer),
              this.transport.removeAllListeners("close"),
              this.transport.close(),
              this.transport.removeAllListeners(),
              "function" == typeof removeEventListener &&
                (removeEventListener(
                  "beforeunload",
                  this.beforeunloadEventListener,
                  !1,
                ),
                removeEventListener("offline", this.offlineEventListener, !1)),
              (this.readyState = "closed"),
              (this.id = null),
              this.emitReserved("close", t, e),
              (this.writeBuffer = []),
              (this.prevBufferLen = 0));
          }
          filterUpgrades(t) {
            const e = [];
            let s = 0;
            const r = t.length;
            for (; s < r; s++) ~this.transports.indexOf(t[s]) && e.push(t[s]);
            return e;
          }
        }
        u.protocol = c.TF;
      },
      402: (t, e, s) => {
        "use strict";
        s.d(e, { J: () => c });
        var r = s(620),
          n = s(260),
          i = s(185),
          o = s(859);
        class a extends Error {
          constructor(t, e, s) {
            super(t),
              (this.description = e),
              (this.context = s),
              (this.type = "TransportError");
          }
        }
        class c extends n.Q {
          constructor(t) {
            super(),
              (this.writable = !1),
              (0, i.Vq)(this, t),
              (this.opts = t),
              (this.query = t.query),
              (this.socket = t.socket);
          }
          onError(t, e, s) {
            return super.emitReserved("error", new a(t, e, s)), this;
          }
          open() {
            return (this.readyState = "opening"), this.doOpen(), this;
          }
          close() {
            return (
              ("opening" !== this.readyState && "open" !== this.readyState) ||
                (this.doClose(), this.onClose()),
              this
            );
          }
          send(t) {
            "open" === this.readyState && this.write(t);
          }
          onOpen() {
            (this.readyState = "open"),
              (this.writable = !0),
              super.emitReserved("open");
          }
          onData(t) {
            const e = (0, r.Yi)(t, this.socket.binaryType);
            this.onPacket(e);
          }
          onPacket(t) {
            super.emitReserved("packet", t);
          }
          onClose(t) {
            (this.readyState = "closed"), super.emitReserved("close", t);
          }
          pause(t) {}
          createUri(t, e = {}) {
            return (
              t +
              "://" +
              this._hostname() +
              this._port() +
              this.opts.path +
              this._query(e)
            );
          }
          _hostname() {
            const t = this.opts.hostname;
            return -1 === t.indexOf(":") ? t : "[" + t + "]";
          }
          _port() {
            return this.opts.port &&
              ((this.opts.secure && Number(443 !== this.opts.port)) ||
                (!this.opts.secure && 80 !== Number(this.opts.port)))
              ? ":" + this.opts.port
              : "";
          }
          _query(t) {
            const e = (0, o.c)(t);
            return e.length ? "?" + e : "";
          }
        }
      },
      234: (t, e, s) => {
        "use strict";
        s.d(e, { g: () => o });
        var r = s(263),
          n = s(53),
          i = s(926);
        const o = { websocket: n.WS, webtransport: i.WT, polling: r.P };
      },
      263: (t, e, s) => {
        "use strict";
        s.d(e, { P: () => d });
        var r = s(402),
          n = s(966),
          i = s(620),
          o = s(458),
          a = s(260),
          c = s(185),
          h = s(220);
        function u() {}
        const p = null != new o.K({ xdomain: !1 }).responseType;
        class d extends r.J {
          constructor(t) {
            if (
              (super(t), (this.polling = !1), "undefined" != typeof location)
            ) {
              const e = "https:" === location.protocol;
              let s = location.port;
              s || (s = e ? "443" : "80"),
                (this.xd =
                  ("undefined" != typeof location &&
                    t.hostname !== location.hostname) ||
                  s !== t.port);
            }
            const e = t && t.forceBase64;
            (this.supportsBinary = p && !e),
              this.opts.withCredentials && (this.cookieJar = (0, o.n)());
          }
          get name() {
            return "polling";
          }
          doOpen() {
            this.poll();
          }
          pause(t) {
            this.readyState = "pausing";
            const e = () => {
              (this.readyState = "paused"), t();
            };
            if (this.polling || !this.writable) {
              let t = 0;
              this.polling &&
                (t++,
                this.once("pollComplete", function () {
                  --t || e();
                })),
                this.writable ||
                  (t++,
                  this.once("drain", function () {
                    --t || e();
                  }));
            } else e();
          }
          poll() {
            (this.polling = !0), this.doPoll(), this.emitReserved("poll");
          }
          onData(t) {
            (0, i.pH)(t, this.socket.binaryType).forEach((t) => {
              if (
                ("opening" === this.readyState &&
                  "open" === t.type &&
                  this.onOpen(),
                "close" === t.type)
              )
                return (
                  this.onClose({
                    description: "transport closed by the server",
                  }),
                  !1
                );
              this.onPacket(t);
            }),
              "closed" !== this.readyState &&
                ((this.polling = !1),
                this.emitReserved("pollComplete"),
                "open" === this.readyState && this.poll());
          }
          doClose() {
            const t = () => {
              this.write([{ type: "close" }]);
            };
            "open" === this.readyState ? t() : this.once("open", t);
          }
          write(t) {
            (this.writable = !1),
              (0, i.V1)(t, (t) => {
                this.doWrite(t, () => {
                  (this.writable = !0), this.emitReserved("drain");
                });
              });
          }
          uri() {
            const t = this.opts.secure ? "https" : "http",
              e = this.query || {};
            return (
              !1 !== this.opts.timestampRequests &&
                (e[this.opts.timestampParam] = (0, n.l)()),
              this.supportsBinary || e.sid || (e.b64 = 1),
              this.createUri(t, e)
            );
          }
          request(t = {}) {
            return (
              Object.assign(
                t,
                { xd: this.xd, cookieJar: this.cookieJar },
                this.opts,
              ),
              new l(this.uri(), t)
            );
          }
          doWrite(t, e) {
            const s = this.request({ method: "POST", data: t });
            s.on("success", e),
              s.on("error", (t, e) => {
                this.onError("xhr post error", t, e);
              });
          }
          doPoll() {
            const t = this.request();
            t.on("data", this.onData.bind(this)),
              t.on("error", (t, e) => {
                this.onError("xhr poll error", t, e);
              }),
              (this.pollXhr = t);
          }
        }
        class l extends a.Q {
          constructor(t, e) {
            super(),
              (0, c.Vq)(this, e),
              (this.opts = e),
              (this.method = e.method || "GET"),
              (this.uri = t),
              (this.data = void 0 !== e.data ? e.data : null),
              this.create();
          }
          create() {
            var t;
            const e = (0, c.ei)(
              this.opts,
              "agent",
              "pfx",
              "key",
              "passphrase",
              "cert",
              "ca",
              "ciphers",
              "rejectUnauthorized",
              "autoUnref",
            );
            e.xdomain = !!this.opts.xd;
            const s = (this.xhr = new o.K(e));
            try {
              s.open(this.method, this.uri, !0);
              try {
                if (this.opts.extraHeaders) {
                  s.setDisableHeaderCheck && s.setDisableHeaderCheck(!0);
                  for (let t in this.opts.extraHeaders)
                    this.opts.extraHeaders.hasOwnProperty(t) &&
                      s.setRequestHeader(t, this.opts.extraHeaders[t]);
                }
              } catch (t) {}
              if ("POST" === this.method)
                try {
                  s.setRequestHeader(
                    "Content-type",
                    "text/plain;charset=UTF-8",
                  );
                } catch (t) {}
              try {
                s.setRequestHeader("Accept", "*/*");
              } catch (t) {}
              null === (t = this.opts.cookieJar) ||
                void 0 === t ||
                t.addCookies(s),
                "withCredentials" in s &&
                  (s.withCredentials = this.opts.withCredentials),
                this.opts.requestTimeout &&
                  (s.timeout = this.opts.requestTimeout),
                (s.onreadystatechange = () => {
                  var t;
                  3 === s.readyState &&
                    (null === (t = this.opts.cookieJar) ||
                      void 0 === t ||
                      t.parseCookies(s)),
                    4 === s.readyState &&
                      (200 === s.status || 1223 === s.status
                        ? this.onLoad()
                        : this.setTimeoutFn(() => {
                            this.onError(
                              "number" == typeof s.status ? s.status : 0,
                            );
                          }, 0));
                }),
                s.send(this.data);
            } catch (t) {
              return void this.setTimeoutFn(() => {
                this.onError(t);
              }, 0);
            }
            "undefined" != typeof document &&
              ((this.index = l.requestsCount++),
              (l.requests[this.index] = this));
          }
          onError(t) {
            this.emitReserved("error", t, this.xhr), this.cleanup(!0);
          }
          cleanup(t) {
            if (void 0 !== this.xhr && null !== this.xhr) {
              if (((this.xhr.onreadystatechange = u), t))
                try {
                  this.xhr.abort();
                } catch (t) {}
              "undefined" != typeof document && delete l.requests[this.index],
                (this.xhr = null);
            }
          }
          onLoad() {
            const t = this.xhr.responseText;
            null !== t &&
              (this.emitReserved("data", t),
              this.emitReserved("success"),
              this.cleanup());
          }
          abort() {
            this.cleanup();
          }
        }
        if (
          ((l.requestsCount = 0),
          (l.requests = {}),
          "undefined" != typeof document)
        )
          if ("function" == typeof attachEvent) attachEvent("onunload", f);
          else if ("function" == typeof addEventListener) {
            const t = "onpagehide" in h.p ? "pagehide" : "unload";
            addEventListener(t, f, !1);
          }
        function f() {
          for (let t in l.requests)
            l.requests.hasOwnProperty(t) && l.requests[t].abort();
        }
      },
      892: (t, e, s) => {
        "use strict";
        s.d(e, { XY: () => i, Xp: () => a, Y3: () => n, us: () => o });
        var r = s(220);
        const n =
            "function" == typeof Promise && "function" == typeof Promise.resolve
              ? (t) => Promise.resolve().then(t)
              : (t, e) => e(t, 0),
          i = r.p.WebSocket || r.p.MozWebSocket,
          o = !0,
          a = "arraybuffer";
      },
      53: (t, e, s) => {
        "use strict";
        s.d(e, { WS: () => h });
        var r = s(402),
          n = s(966),
          i = s(185),
          o = s(892),
          a = s(620);
        const c =
          "undefined" != typeof navigator &&
          "string" == typeof navigator.product &&
          "reactnative" === navigator.product.toLowerCase();
        class h extends r.J {
          constructor(t) {
            super(t), (this.supportsBinary = !t.forceBase64);
          }
          get name() {
            return "websocket";
          }
          doOpen() {
            if (!this.check()) return;
            const t = this.uri(),
              e = this.opts.protocols,
              s = c
                ? {}
                : (0, i.ei)(
                    this.opts,
                    "agent",
                    "perMessageDeflate",
                    "pfx",
                    "key",
                    "passphrase",
                    "cert",
                    "ca",
                    "ciphers",
                    "rejectUnauthorized",
                    "localAddress",
                    "protocolVersion",
                    "origin",
                    "maxPayload",
                    "family",
                    "checkServerIdentity",
                  );
            this.opts.extraHeaders && (s.headers = this.opts.extraHeaders);
            try {
              this.ws =
                o.us && !c
                  ? e
                    ? new o.XY(t, e)
                    : new o.XY(t)
                  : new o.XY(t, e, s);
            } catch (t) {
              return this.emitReserved("error", t);
            }
            (this.ws.binaryType = this.socket.binaryType),
              this.addEventListeners();
          }
          addEventListeners() {
            (this.ws.onopen = () => {
              this.opts.autoUnref && this.ws._socket.unref(), this.onOpen();
            }),
              (this.ws.onclose = (t) =>
                this.onClose({
                  description: "websocket connection closed",
                  context: t,
                })),
              (this.ws.onmessage = (t) => this.onData(t.data)),
              (this.ws.onerror = (t) => this.onError("websocket error", t));
          }
          write(t) {
            this.writable = !1;
            for (let e = 0; e < t.length; e++) {
              const s = t[e],
                r = e === t.length - 1;
              (0, a.I4)(s, this.supportsBinary, (t) => {
                const e = {};
                !o.us &&
                  (s.options && (e.compress = s.options.compress),
                  this.opts.perMessageDeflate) &&
                  ("string" == typeof t ? Buffer.byteLength(t) : t.length) <
                    this.opts.perMessageDeflate.threshold &&
                  (e.compress = !1);
                try {
                  o.us ? this.ws.send(t) : this.ws.send(t, e);
                } catch (t) {}
                r &&
                  (0, o.Y3)(() => {
                    (this.writable = !0), this.emitReserved("drain");
                  }, this.setTimeoutFn);
              });
            }
          }
          doClose() {
            void 0 !== this.ws && (this.ws.close(), (this.ws = null));
          }
          uri() {
            const t = this.opts.secure ? "wss" : "ws",
              e = this.query || {};
            return (
              this.opts.timestampRequests &&
                (e[this.opts.timestampParam] = (0, n.l)()),
              this.supportsBinary || (e.b64 = 1),
              this.createUri(t, e)
            );
          }
          check() {
            return !!o.XY;
          }
        }
      },
      926: (t, e, s) => {
        "use strict";
        s.d(e, { WT: () => o });
        var r = s(402),
          n = s(892),
          i = s(620);
        class o extends r.J {
          get name() {
            return "webtransport";
          }
          doOpen() {
            "function" == typeof WebTransport &&
              ((this.transport = new WebTransport(
                this.createUri("https"),
                this.opts.transportOptions[this.name],
              )),
              this.transport.closed
                .then(() => {
                  this.onClose();
                })
                .catch((t) => {
                  this.onError("webtransport error", t);
                }),
              this.transport.ready.then(() => {
                this.transport.createBidirectionalStream().then((t) => {
                  const e = (0, i.p4)(
                      Number.MAX_SAFE_INTEGER,
                      this.socket.binaryType,
                    ),
                    s = t.readable.pipeThrough(e).getReader(),
                    r = (0, i._s)();
                  r.readable.pipeTo(t.writable),
                    (this.writer = r.writable.getWriter());
                  const n = () => {
                    s.read()
                      .then(({ done: t, value: e }) => {
                        t || (this.onPacket(e), n());
                      })
                      .catch((t) => {});
                  };
                  n();
                  const o = { type: "open" };
                  this.query.sid && (o.data = `{"sid":"${this.query.sid}"}`),
                    this.writer.write(o).then(() => this.onOpen());
                });
              }));
          }
          write(t) {
            this.writable = !1;
            for (let e = 0; e < t.length; e++) {
              const s = t[e],
                r = e === t.length - 1;
              this.writer.write(s).then(() => {
                r &&
                  (0, n.Y3)(() => {
                    (this.writable = !0), this.emitReserved("drain");
                  }, this.setTimeoutFn);
              });
            }
          }
          doClose() {
            var t;
            null === (t = this.transport) || void 0 === t || t.close();
          }
        }
      },
      458: (t, e, s) => {
        "use strict";
        s.d(e, { K: () => i, n: () => o });
        var r = s(864),
          n = s(220);
        function i(t) {
          const e = t.xdomain;
          try {
            if ("undefined" != typeof XMLHttpRequest && (!e || r.w))
              return new XMLHttpRequest();
          } catch (t) {}
          if (!e)
            try {
              return new n.p[["Active"].concat("Object").join("X")](
                "Microsoft.XMLHTTP",
              );
            } catch (t) {}
        }
        function o() {}
      },
      185: (t, e, s) => {
        "use strict";
        s.d(e, { Vq: () => a, ei: () => n, k: () => h });
        var r = s(220);
        function n(t, ...e) {
          return e.reduce(
            (e, s) => (t.hasOwnProperty(s) && (e[s] = t[s]), e),
            {},
          );
        }
        const i = r.p.setTimeout,
          o = r.p.clearTimeout;
        function a(t, e) {
          e.useNativeTimers
            ? ((t.setTimeoutFn = i.bind(r.p)), (t.clearTimeoutFn = o.bind(r.p)))
            : ((t.setTimeoutFn = r.p.setTimeout.bind(r.p)),
              (t.clearTimeoutFn = r.p.clearTimeout.bind(r.p)));
        }
        const c = 1.33;
        function h(t) {
          return "string" == typeof t
            ? (function (t) {
                let e = 0,
                  s = 0;
                for (let r = 0, n = t.length; r < n; r++)
                  (e = t.charCodeAt(r)),
                    e < 128
                      ? (s += 1)
                      : e < 2048
                      ? (s += 2)
                      : e < 55296 || e >= 57344
                      ? (s += 3)
                      : (r++, (s += 4));
                return s;
              })(t)
            : Math.ceil((t.byteLength || t.size) * c);
        }
      },
      893: (t, e, s) => {
        "use strict";
        s.d(e, { G9: () => n, Uq: () => r, aY: () => i });
        const r = Object.create(null);
        (r.open = "0"),
          (r.close = "1"),
          (r.ping = "2"),
          (r.pong = "3"),
          (r.message = "4"),
          (r.upgrade = "5"),
          (r.noop = "6");
        const n = Object.create(null);
        Object.keys(r).forEach((t) => {
          n[r[t]] = t;
        });
        const i = { type: "error", data: "parser error" };
      },
      435: (t, e, s) => {
        "use strict";
        s.d(e, { J: () => n });
        const r = "undefined" == typeof Uint8Array ? [] : new Uint8Array(256);
        for (let t = 0; t < 64; t++)
          r[
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charCodeAt(
              t,
            )
          ] = t;
        const n = (t) => {
          let e,
            s,
            n,
            i,
            o,
            a = 0.75 * t.length,
            c = t.length,
            h = 0;
          "=" === t[t.length - 1] && (a--, "=" === t[t.length - 2] && a--);
          const u = new ArrayBuffer(a),
            p = new Uint8Array(u);
          for (e = 0; e < c; e += 4)
            (s = r[t.charCodeAt(e)]),
              (n = r[t.charCodeAt(e + 1)]),
              (i = r[t.charCodeAt(e + 2)]),
              (o = r[t.charCodeAt(e + 3)]),
              (p[h++] = (s << 2) | (n >> 4)),
              (p[h++] = ((15 & n) << 4) | (i >> 2)),
              (p[h++] = ((3 & i) << 6) | (63 & o));
          return u;
        };
      },
      928: (t, e, s) => {
        "use strict";
        s.d(e, { Y: () => o });
        var r = s(893),
          n = s(435);
        const i = "function" == typeof ArrayBuffer,
          o = (t, e) => {
            if ("string" != typeof t) return { type: "message", data: c(t, e) };
            const s = t.charAt(0);
            return "b" === s
              ? { type: "message", data: a(t.substring(1), e) }
              : r.G9[s]
              ? t.length > 1
                ? { type: r.G9[s], data: t.substring(1) }
                : { type: r.G9[s] }
              : r.aY;
          },
          a = (t, e) => {
            if (i) {
              const s = (0, n.J)(t);
              return c(s, e);
            }
            return { base64: !0, data: t };
          },
          c = (t, e) =>
            "blob" === e
              ? t instanceof Blob
                ? t
                : new Blob([t])
              : t instanceof ArrayBuffer
              ? t
              : t.buffer;
      },
      395: (t, e, s) => {
        "use strict";
        s.d(e, { I: () => a, O: () => p });
        var r = s(893);
        const n =
            "function" == typeof Blob ||
            ("undefined" != typeof Blob &&
              "[object BlobConstructor]" ===
                Object.prototype.toString.call(Blob)),
          i = "function" == typeof ArrayBuffer,
          o = (t) =>
            "function" == typeof ArrayBuffer.isView
              ? ArrayBuffer.isView(t)
              : t && t.buffer instanceof ArrayBuffer,
          a = ({ type: t, data: e }, s, a) =>
            n && e instanceof Blob
              ? s
                ? a(e)
                : c(e, a)
              : i && (e instanceof ArrayBuffer || o(e))
              ? s
                ? a(e)
                : c(new Blob([e]), a)
              : a(r.Uq[t] + (e || "")),
          c = (t, e) => {
            const s = new FileReader();
            return (
              (s.onload = function () {
                const t = s.result.split(",")[1];
                e("b" + (t || ""));
              }),
              s.readAsDataURL(t)
            );
          };
        function h(t) {
          return t instanceof Uint8Array
            ? t
            : t instanceof ArrayBuffer
            ? new Uint8Array(t)
            : new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
        }
        let u;
        function p(t, e) {
          return n && t.data instanceof Blob
            ? t.data.arrayBuffer().then(h).then(e)
            : i && (t.data instanceof ArrayBuffer || o(t.data))
            ? e(h(t.data))
            : void a(t, !1, (t) => {
                u || (u = new TextEncoder()), e(u.encode(t));
              });
        }
      },
      620: (t, e, s) => {
        "use strict";
        s.d(e, {
          I4: () => r.I,
          TF: () => f,
          V1: () => a,
          Yi: () => n.Y,
          _s: () => h,
          p4: () => l,
          pH: () => c,
        });
        var r = s(395),
          n = s(928),
          i = s(893);
        const o = String.fromCharCode(30),
          a = (t, e) => {
            const s = t.length,
              n = new Array(s);
            let i = 0;
            t.forEach((t, a) => {
              (0, r.I)(t, !1, (t) => {
                (n[a] = t), ++i === s && e(n.join(o));
              });
            });
          },
          c = (t, e) => {
            const s = t.split(o),
              r = [];
            for (let t = 0; t < s.length; t++) {
              const i = (0, n.Y)(s[t], e);
              if ((r.push(i), "error" === i.type)) break;
            }
            return r;
          };
        function h() {
          return new TransformStream({
            transform(t, e) {
              (0, r.O)(t, (s) => {
                const r = s.length;
                let n;
                if (r < 126)
                  (n = new Uint8Array(1)),
                    new DataView(n.buffer).setUint8(0, r);
                else if (r < 65536) {
                  n = new Uint8Array(3);
                  const t = new DataView(n.buffer);
                  t.setUint8(0, 126), t.setUint16(1, r);
                } else {
                  n = new Uint8Array(9);
                  const t = new DataView(n.buffer);
                  t.setUint8(0, 127), t.setBigUint64(1, BigInt(r));
                }
                t.data && "string" != typeof t.data && (n[0] |= 128),
                  e.enqueue(n),
                  e.enqueue(s);
              });
            },
          });
        }
        let u;
        function p(t) {
          return t.reduce((t, e) => t + e.length, 0);
        }
        function d(t, e) {
          if (t[0].length === e) return t.shift();
          const s = new Uint8Array(e);
          let r = 0;
          for (let n = 0; n < e; n++)
            (s[n] = t[0][r++]), r === t[0].length && (t.shift(), (r = 0));
          return t.length && r < t[0].length && (t[0] = t[0].slice(r)), s;
        }
        function l(t, e) {
          u || (u = new TextDecoder());
          const s = [];
          let r = 0,
            o = -1,
            a = !1;
          return new TransformStream({
            transform(c, h) {
              for (s.push(c); ; ) {
                if (0 === r) {
                  if (p(s) < 1) break;
                  const t = d(s, 1);
                  (a = 128 == (128 & t[0])),
                    (o = 127 & t[0]),
                    (r = o < 126 ? 3 : 126 === o ? 1 : 2);
                } else if (1 === r) {
                  if (p(s) < 2) break;
                  const t = d(s, 2);
                  (o = new DataView(t.buffer, t.byteOffset, t.length).getUint16(
                    0,
                  )),
                    (r = 3);
                } else if (2 === r) {
                  if (p(s) < 8) break;
                  const t = d(s, 8),
                    e = new DataView(t.buffer, t.byteOffset, t.length),
                    n = e.getUint32(0);
                  if (n > Math.pow(2, 21) - 1) {
                    h.enqueue(i.aY);
                    break;
                  }
                  (o = n * Math.pow(2, 32) + e.getUint32(4)), (r = 3);
                } else {
                  if (p(s) < o) break;
                  const t = d(s, o);
                  h.enqueue((0, n.Y)(a ? t : u.decode(t), e)), (r = 0);
                }
                if (0 === o || o > t) {
                  h.enqueue(i.aY);
                  break;
                }
              }
            },
          });
        }
        const f = 4;
      },
      187: (t, e, s) => {
        "use strict";
        function r(t) {
          (t = t || {}),
            (this.ms = t.min || 100),
            (this.max = t.max || 1e4),
            (this.factor = t.factor || 2),
            (this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0),
            (this.attempts = 0);
        }
        s.d(e, { V: () => r }),
          (r.prototype.duration = function () {
            var t = this.ms * Math.pow(this.factor, this.attempts++);
            if (this.jitter) {
              var e = Math.random(),
                s = Math.floor(e * this.jitter * t);
              t = 0 == (1 & Math.floor(10 * e)) ? t - s : t + s;
            }
            return 0 | Math.min(t, this.max);
          }),
          (r.prototype.reset = function () {
            this.attempts = 0;
          }),
          (r.prototype.setMin = function (t) {
            this.ms = t;
          }),
          (r.prototype.setMax = function (t) {
            this.max = t;
          }),
          (r.prototype.setJitter = function (t) {
            this.jitter = t;
          });
      },
      466: (t, e, s) => {
        "use strict";
        s.d(e, { io: () => a });
        var r = s(171),
          n = s(360),
          i = s(682);
        s(962);
        const o = {};
        function a(t, e) {
          "object" == typeof t && ((e = t), (t = void 0)), (e = e || {});
          const s = (0, r.H)(t, e.path || "/socket.io"),
            i = s.source,
            a = s.id,
            c = s.path,
            h = o[a] && c in o[a].nsps;
          let u;
          return (
            e.forceNew || e["force new connection"] || !1 === e.multiplex || h
              ? (u = new n.d(i, e))
              : (o[a] || (o[a] = new n.d(i, e)), (u = o[a])),
            s.query && !e.query && (e.query = s.queryKey),
            u.socket(s.path, e)
          );
        }
        Object.assign(a, { Manager: n.d, Socket: i.s, io: a, connect: a });
      },
      360: (t, e, s) => {
        "use strict";
        s.d(e, { d: () => h });
        var r = s(393),
          n = s(682),
          i = s(962),
          o = s(901),
          a = s(187),
          c = s(260);
        class h extends c.Q {
          constructor(t, e) {
            var s;
            super(),
              (this.nsps = {}),
              (this.subs = []),
              t && "object" == typeof t && ((e = t), (t = void 0)),
              ((e = e || {}).path = e.path || "/socket.io"),
              (this.opts = e),
              (0, r.Vq)(this, e),
              this.reconnection(!1 !== e.reconnection),
              this.reconnectionAttempts(e.reconnectionAttempts || 1 / 0),
              this.reconnectionDelay(e.reconnectionDelay || 1e3),
              this.reconnectionDelayMax(e.reconnectionDelayMax || 5e3),
              this.randomizationFactor(
                null !== (s = e.randomizationFactor) && void 0 !== s ? s : 0.5,
              ),
              (this.backoff = new a.V({
                min: this.reconnectionDelay(),
                max: this.reconnectionDelayMax(),
                jitter: this.randomizationFactor(),
              })),
              this.timeout(null == e.timeout ? 2e4 : e.timeout),
              (this._readyState = "closed"),
              (this.uri = t);
            const n = e.parser || i;
            (this.encoder = new n.Encoder()),
              (this.decoder = new n.Decoder()),
              (this._autoConnect = !1 !== e.autoConnect),
              this._autoConnect && this.open();
          }
          reconnection(t) {
            return arguments.length
              ? ((this._reconnection = !!t), this)
              : this._reconnection;
          }
          reconnectionAttempts(t) {
            return void 0 === t
              ? this._reconnectionAttempts
              : ((this._reconnectionAttempts = t), this);
          }
          reconnectionDelay(t) {
            var e;
            return void 0 === t
              ? this._reconnectionDelay
              : ((this._reconnectionDelay = t),
                null === (e = this.backoff) || void 0 === e || e.setMin(t),
                this);
          }
          randomizationFactor(t) {
            var e;
            return void 0 === t
              ? this._randomizationFactor
              : ((this._randomizationFactor = t),
                null === (e = this.backoff) || void 0 === e || e.setJitter(t),
                this);
          }
          reconnectionDelayMax(t) {
            var e;
            return void 0 === t
              ? this._reconnectionDelayMax
              : ((this._reconnectionDelayMax = t),
                null === (e = this.backoff) || void 0 === e || e.setMax(t),
                this);
          }
          timeout(t) {
            return arguments.length
              ? ((this._timeout = t), this)
              : this._timeout;
          }
          maybeReconnectOnOpen() {
            !this._reconnecting &&
              this._reconnection &&
              0 === this.backoff.attempts &&
              this.reconnect();
          }
          open(t) {
            if (~this._readyState.indexOf("open")) return this;
            this.engine = new r.sk(this.uri, this.opts);
            const e = this.engine,
              s = this;
            (this._readyState = "opening"), (this.skipReconnect = !1);
            const n = (0, o.on)(e, "open", function () {
                s.onopen(), t && t();
              }),
              i = (e) => {
                this.cleanup(),
                  (this._readyState = "closed"),
                  this.emitReserved("error", e),
                  t ? t(e) : this.maybeReconnectOnOpen();
              },
              a = (0, o.on)(e, "error", i);
            if (!1 !== this._timeout) {
              const t = this._timeout,
                s = this.setTimeoutFn(() => {
                  n(), i(new Error("timeout")), e.close();
                }, t);
              this.opts.autoUnref && s.unref(),
                this.subs.push(() => {
                  this.clearTimeoutFn(s);
                });
            }
            return this.subs.push(n), this.subs.push(a), this;
          }
          connect(t) {
            return this.open(t);
          }
          onopen() {
            this.cleanup(),
              (this._readyState = "open"),
              this.emitReserved("open");
            const t = this.engine;
            this.subs.push(
              (0, o.on)(t, "ping", this.onping.bind(this)),
              (0, o.on)(t, "data", this.ondata.bind(this)),
              (0, o.on)(t, "error", this.onerror.bind(this)),
              (0, o.on)(t, "close", this.onclose.bind(this)),
              (0, o.on)(this.decoder, "decoded", this.ondecoded.bind(this)),
            );
          }
          onping() {
            this.emitReserved("ping");
          }
          ondata(t) {
            try {
              this.decoder.add(t);
            } catch (t) {
              this.onclose("parse error", t);
            }
          }
          ondecoded(t) {
            (0, r.Y3)(() => {
              this.emitReserved("packet", t);
            }, this.setTimeoutFn);
          }
          onerror(t) {
            this.emitReserved("error", t);
          }
          socket(t, e) {
            let s = this.nsps[t];
            return (
              s
                ? this._autoConnect && !s.active && s.connect()
                : ((s = new n.s(this, t, e)), (this.nsps[t] = s)),
              s
            );
          }
          _destroy(t) {
            const e = Object.keys(this.nsps);
            for (const t of e) if (this.nsps[t].active) return;
            this._close();
          }
          _packet(t) {
            const e = this.encoder.encode(t);
            for (let s = 0; s < e.length; s++)
              this.engine.write(e[s], t.options);
          }
          cleanup() {
            this.subs.forEach((t) => t()),
              (this.subs.length = 0),
              this.decoder.destroy();
          }
          _close() {
            (this.skipReconnect = !0),
              (this._reconnecting = !1),
              this.onclose("forced close"),
              this.engine && this.engine.close();
          }
          disconnect() {
            return this._close();
          }
          onclose(t, e) {
            this.cleanup(),
              this.backoff.reset(),
              (this._readyState = "closed"),
              this.emitReserved("close", t, e),
              this._reconnection && !this.skipReconnect && this.reconnect();
          }
          reconnect() {
            if (this._reconnecting || this.skipReconnect) return this;
            const t = this;
            if (this.backoff.attempts >= this._reconnectionAttempts)
              this.backoff.reset(),
                this.emitReserved("reconnect_failed"),
                (this._reconnecting = !1);
            else {
              const e = this.backoff.duration();
              this._reconnecting = !0;
              const s = this.setTimeoutFn(() => {
                t.skipReconnect ||
                  (this.emitReserved("reconnect_attempt", t.backoff.attempts),
                  t.skipReconnect ||
                    t.open((e) => {
                      e
                        ? ((t._reconnecting = !1),
                          t.reconnect(),
                          this.emitReserved("reconnect_error", e))
                        : t.onreconnect();
                    }));
              }, e);
              this.opts.autoUnref && s.unref(),
                this.subs.push(() => {
                  this.clearTimeoutFn(s);
                });
            }
          }
          onreconnect() {
            const t = this.backoff.attempts;
            (this._reconnecting = !1),
              this.backoff.reset(),
              this.emitReserved("reconnect", t);
          }
        }
      },
      901: (t, e, s) => {
        "use strict";
        function r(t, e, s) {
          return (
            t.on(e, s),
            function () {
              t.off(e, s);
            }
          );
        }
        s.d(e, { on: () => r });
      },
      682: (t, e, s) => {
        "use strict";
        s.d(e, { s: () => a });
        var r = s(962),
          n = s(901),
          i = s(260);
        const o = Object.freeze({
          connect: 1,
          connect_error: 1,
          disconnect: 1,
          disconnecting: 1,
          newListener: 1,
          removeListener: 1,
        });
        class a extends i.Q {
          constructor(t, e, s) {
            super(),
              (this.connected = !1),
              (this.recovered = !1),
              (this.receiveBuffer = []),
              (this.sendBuffer = []),
              (this._queue = []),
              (this._queueSeq = 0),
              (this.ids = 0),
              (this.acks = {}),
              (this.flags = {}),
              (this.io = t),
              (this.nsp = e),
              s && s.auth && (this.auth = s.auth),
              (this._opts = Object.assign({}, s)),
              this.io._autoConnect && this.open();
          }
          get disconnected() {
            return !this.connected;
          }
          subEvents() {
            if (this.subs) return;
            const t = this.io;
            this.subs = [
              (0, n.on)(t, "open", this.onopen.bind(this)),
              (0, n.on)(t, "packet", this.onpacket.bind(this)),
              (0, n.on)(t, "error", this.onerror.bind(this)),
              (0, n.on)(t, "close", this.onclose.bind(this)),
            ];
          }
          get active() {
            return !!this.subs;
          }
          connect() {
            return (
              this.connected ||
                (this.subEvents(),
                this.io._reconnecting || this.io.open(),
                "open" === this.io._readyState && this.onopen()),
              this
            );
          }
          open() {
            return this.connect();
          }
          send(...t) {
            return t.unshift("message"), this.emit.apply(this, t), this;
          }
          emit(t, ...e) {
            if (o.hasOwnProperty(t))
              throw new Error(
                '"' + t.toString() + '" is a reserved event name',
              );
            if (
              (e.unshift(t),
              this._opts.retries &&
                !this.flags.fromQueue &&
                !this.flags.volatile)
            )
              return this._addToQueue(e), this;
            const s = { type: r.PacketType.EVENT, data: e, options: {} };
            if (
              ((s.options.compress = !1 !== this.flags.compress),
              "function" == typeof e[e.length - 1])
            ) {
              const t = this.ids++,
                r = e.pop();
              this._registerAckCallback(t, r), (s.id = t);
            }
            const n =
              this.io.engine &&
              this.io.engine.transport &&
              this.io.engine.transport.writable;
            return (
              (this.flags.volatile && (!n || !this.connected)) ||
                (this.connected
                  ? (this.notifyOutgoingListeners(s), this.packet(s))
                  : this.sendBuffer.push(s)),
              (this.flags = {}),
              this
            );
          }
          _registerAckCallback(t, e) {
            var s;
            const r =
              null !== (s = this.flags.timeout) && void 0 !== s
                ? s
                : this._opts.ackTimeout;
            if (void 0 === r) return void (this.acks[t] = e);
            const n = this.io.setTimeoutFn(() => {
              delete this.acks[t];
              for (let e = 0; e < this.sendBuffer.length; e++)
                this.sendBuffer[e].id === t && this.sendBuffer.splice(e, 1);
              e.call(this, new Error("operation has timed out"));
            }, r);
            this.acks[t] = (...t) => {
              this.io.clearTimeoutFn(n), e.apply(this, [null, ...t]);
            };
          }
          emitWithAck(t, ...e) {
            const s =
              void 0 !== this.flags.timeout || void 0 !== this._opts.ackTimeout;
            return new Promise((r, n) => {
              e.push((t, e) => (s ? (t ? n(t) : r(e)) : r(t))),
                this.emit(t, ...e);
            });
          }
          _addToQueue(t) {
            let e;
            "function" == typeof t[t.length - 1] && (e = t.pop());
            const s = {
              id: this._queueSeq++,
              tryCount: 0,
              pending: !1,
              args: t,
              flags: Object.assign({ fromQueue: !0 }, this.flags),
            };
            t.push((t, ...r) => {
              if (s === this._queue[0])
                return (
                  null !== t
                    ? s.tryCount > this._opts.retries &&
                      (this._queue.shift(), e && e(t))
                    : (this._queue.shift(), e && e(null, ...r)),
                  (s.pending = !1),
                  this._drainQueue()
                );
            }),
              this._queue.push(s),
              this._drainQueue();
          }
          _drainQueue(t = !1) {
            if (!this.connected || 0 === this._queue.length) return;
            const e = this._queue[0];
            (e.pending && !t) ||
              ((e.pending = !0),
              e.tryCount++,
              (this.flags = e.flags),
              this.emit.apply(this, e.args));
          }
          packet(t) {
            (t.nsp = this.nsp), this.io._packet(t);
          }
          onopen() {
            "function" == typeof this.auth
              ? this.auth((t) => {
                  this._sendConnectPacket(t);
                })
              : this._sendConnectPacket(this.auth);
          }
          _sendConnectPacket(t) {
            this.packet({
              type: r.PacketType.CONNECT,
              data: this._pid
                ? Object.assign({ pid: this._pid, offset: this._lastOffset }, t)
                : t,
            });
          }
          onerror(t) {
            this.connected || this.emitReserved("connect_error", t);
          }
          onclose(t, e) {
            (this.connected = !1),
              delete this.id,
              this.emitReserved("disconnect", t, e);
          }
          onpacket(t) {
            if (t.nsp === this.nsp)
              switch (t.type) {
                case r.PacketType.CONNECT:
                  t.data && t.data.sid
                    ? this.onconnect(t.data.sid, t.data.pid)
                    : this.emitReserved(
                        "connect_error",
                        new Error(
                          "It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)",
                        ),
                      );
                  break;
                case r.PacketType.EVENT:
                case r.PacketType.BINARY_EVENT:
                  this.onevent(t);
                  break;
                case r.PacketType.ACK:
                case r.PacketType.BINARY_ACK:
                  this.onack(t);
                  break;
                case r.PacketType.DISCONNECT:
                  this.ondisconnect();
                  break;
                case r.PacketType.CONNECT_ERROR:
                  this.destroy();
                  const e = new Error(t.data.message);
                  (e.data = t.data.data), this.emitReserved("connect_error", e);
              }
          }
          onevent(t) {
            const e = t.data || [];
            null != t.id && e.push(this.ack(t.id)),
              this.connected
                ? this.emitEvent(e)
                : this.receiveBuffer.push(Object.freeze(e));
          }
          emitEvent(t) {
            if (this._anyListeners && this._anyListeners.length) {
              const e = this._anyListeners.slice();
              for (const s of e) s.apply(this, t);
            }
            super.emit.apply(this, t),
              this._pid &&
                t.length &&
                "string" == typeof t[t.length - 1] &&
                (this._lastOffset = t[t.length - 1]);
          }
          ack(t) {
            const e = this;
            let s = !1;
            return function (...n) {
              s ||
                ((s = !0),
                e.packet({ type: r.PacketType.ACK, id: t, data: n }));
            };
          }
          onack(t) {
            const e = this.acks[t.id];
            "function" == typeof e &&
              (e.apply(this, t.data), delete this.acks[t.id]);
          }
          onconnect(t, e) {
            (this.id = t),
              (this.recovered = e && this._pid === e),
              (this._pid = e),
              (this.connected = !0),
              this.emitBuffered(),
              this.emitReserved("connect"),
              this._drainQueue(!0);
          }
          emitBuffered() {
            this.receiveBuffer.forEach((t) => this.emitEvent(t)),
              (this.receiveBuffer = []),
              this.sendBuffer.forEach((t) => {
                this.notifyOutgoingListeners(t), this.packet(t);
              }),
              (this.sendBuffer = []);
          }
          ondisconnect() {
            this.destroy(), this.onclose("io server disconnect");
          }
          destroy() {
            this.subs && (this.subs.forEach((t) => t()), (this.subs = void 0)),
              this.io._destroy(this);
          }
          disconnect() {
            return (
              this.connected && this.packet({ type: r.PacketType.DISCONNECT }),
              this.destroy(),
              this.connected && this.onclose("io client disconnect"),
              this
            );
          }
          close() {
            return this.disconnect();
          }
          compress(t) {
            return (this.flags.compress = t), this;
          }
          get volatile() {
            return (this.flags.volatile = !0), this;
          }
          timeout(t) {
            return (this.flags.timeout = t), this;
          }
          onAny(t) {
            return (
              (this._anyListeners = this._anyListeners || []),
              this._anyListeners.push(t),
              this
            );
          }
          prependAny(t) {
            return (
              (this._anyListeners = this._anyListeners || []),
              this._anyListeners.unshift(t),
              this
            );
          }
          offAny(t) {
            if (!this._anyListeners) return this;
            if (t) {
              const e = this._anyListeners;
              for (let s = 0; s < e.length; s++)
                if (t === e[s]) return e.splice(s, 1), this;
            } else this._anyListeners = [];
            return this;
          }
          listenersAny() {
            return this._anyListeners || [];
          }
          onAnyOutgoing(t) {
            return (
              (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
              this._anyOutgoingListeners.push(t),
              this
            );
          }
          prependAnyOutgoing(t) {
            return (
              (this._anyOutgoingListeners = this._anyOutgoingListeners || []),
              this._anyOutgoingListeners.unshift(t),
              this
            );
          }
          offAnyOutgoing(t) {
            if (!this._anyOutgoingListeners) return this;
            if (t) {
              const e = this._anyOutgoingListeners;
              for (let s = 0; s < e.length; s++)
                if (t === e[s]) return e.splice(s, 1), this;
            } else this._anyOutgoingListeners = [];
            return this;
          }
          listenersAnyOutgoing() {
            return this._anyOutgoingListeners || [];
          }
          notifyOutgoingListeners(t) {
            if (
              this._anyOutgoingListeners &&
              this._anyOutgoingListeners.length
            ) {
              const e = this._anyOutgoingListeners.slice();
              for (const s of e) s.apply(this, t.data);
            }
          }
        }
      },
      171: (t, e, s) => {
        "use strict";
        s.d(e, { H: () => n });
        var r = s(393);
        function n(t, e = "", s) {
          let n = t;
          (s = s || ("undefined" != typeof location && location)),
            null == t && (t = s.protocol + "//" + s.host),
            "string" == typeof t &&
              ("/" === t.charAt(0) &&
                (t = "/" === t.charAt(1) ? s.protocol + t : s.host + t),
              /^(https?|wss?):\/\//.test(t) ||
                (t = void 0 !== s ? s.protocol + "//" + t : "https://" + t),
              (n = (0, r.Qc)(t))),
            n.port ||
              (/^(http|ws)$/.test(n.protocol)
                ? (n.port = "80")
                : /^(http|ws)s$/.test(n.protocol) && (n.port = "443")),
            (n.path = n.path || "/");
          const i = -1 !== n.host.indexOf(":") ? "[" + n.host + "]" : n.host;
          return (
            (n.id = n.protocol + "://" + i + ":" + n.port + e),
            (n.href =
              n.protocol +
              "://" +
              i +
              (s && s.port === n.port ? "" : ":" + n.port)),
            n
          );
        }
      },
      559: (t, e, s) => {
        "use strict";
        s.d(e, { n: () => n, v: () => o });
        var r = s(581);
        function n(t) {
          const e = [],
            s = t.data,
            r = t;
          return (
            (r.data = i(s, e)),
            (r.attachments = e.length),
            { packet: r, buffers: e }
          );
        }
        function i(t, e) {
          if (!t) return t;
          if ((0, r.h)(t)) {
            const s = { _placeholder: !0, num: e.length };
            return e.push(t), s;
          }
          if (Array.isArray(t)) {
            const s = new Array(t.length);
            for (let r = 0; r < t.length; r++) s[r] = i(t[r], e);
            return s;
          }
          if ("object" == typeof t && !(t instanceof Date)) {
            const s = {};
            for (const r in t)
              Object.prototype.hasOwnProperty.call(t, r) && (s[r] = i(t[r], e));
            return s;
          }
          return t;
        }
        function o(t, e) {
          return (t.data = a(t.data, e)), delete t.attachments, t;
        }
        function a(t, e) {
          if (!t) return t;
          if (t && !0 === t._placeholder) {
            if ("number" == typeof t.num && t.num >= 0 && t.num < e.length)
              return e[t.num];
            throw new Error("illegal attachments");
          }
          if (Array.isArray(t))
            for (let s = 0; s < t.length; s++) t[s] = a(t[s], e);
          else if ("object" == typeof t)
            for (const s in t)
              Object.prototype.hasOwnProperty.call(t, s) && (t[s] = a(t[s], e));
          return t;
        }
      },
      962: (t, e, s) => {
        "use strict";
        s.r(e),
          s.d(e, {
            Decoder: () => p,
            Encoder: () => h,
            PacketType: () => c,
            protocol: () => a,
          });
        var r = s(260),
          n = s(559),
          i = s(581);
        const o = [
            "connect",
            "connect_error",
            "disconnect",
            "disconnecting",
            "newListener",
            "removeListener",
          ],
          a = 5;
        var c;
        !(function (t) {
          (t[(t.CONNECT = 0)] = "CONNECT"),
            (t[(t.DISCONNECT = 1)] = "DISCONNECT"),
            (t[(t.EVENT = 2)] = "EVENT"),
            (t[(t.ACK = 3)] = "ACK"),
            (t[(t.CONNECT_ERROR = 4)] = "CONNECT_ERROR"),
            (t[(t.BINARY_EVENT = 5)] = "BINARY_EVENT"),
            (t[(t.BINARY_ACK = 6)] = "BINARY_ACK");
        })(c || (c = {}));
        class h {
          constructor(t) {
            this.replacer = t;
          }
          encode(t) {
            return (t.type !== c.EVENT && t.type !== c.ACK) || !(0, i.O)(t)
              ? [this.encodeAsString(t)]
              : this.encodeAsBinary({
                  type: t.type === c.EVENT ? c.BINARY_EVENT : c.BINARY_ACK,
                  nsp: t.nsp,
                  data: t.data,
                  id: t.id,
                });
          }
          encodeAsString(t) {
            let e = "" + t.type;
            return (
              (t.type !== c.BINARY_EVENT && t.type !== c.BINARY_ACK) ||
                (e += t.attachments + "-"),
              t.nsp && "/" !== t.nsp && (e += t.nsp + ","),
              null != t.id && (e += t.id),
              null != t.data && (e += JSON.stringify(t.data, this.replacer)),
              e
            );
          }
          encodeAsBinary(t) {
            const e = (0, n.n)(t),
              s = this.encodeAsString(e.packet),
              r = e.buffers;
            return r.unshift(s), r;
          }
        }
        function u(t) {
          return "[object Object]" === Object.prototype.toString.call(t);
        }
        class p extends r.Q {
          constructor(t) {
            super(), (this.reviver = t);
          }
          add(t) {
            let e;
            if ("string" == typeof t) {
              if (this.reconstructor)
                throw new Error(
                  "got plaintext data when reconstructing a packet",
                );
              e = this.decodeString(t);
              const s = e.type === c.BINARY_EVENT;
              s || e.type === c.BINARY_ACK
                ? ((e.type = s ? c.EVENT : c.ACK),
                  (this.reconstructor = new d(e)),
                  0 === e.attachments && super.emitReserved("decoded", e))
                : super.emitReserved("decoded", e);
            } else {
              if (!(0, i.h)(t) && !t.base64)
                throw new Error("Unknown type: " + t);
              if (!this.reconstructor)
                throw new Error(
                  "got binary data when not reconstructing a packet",
                );
              (e = this.reconstructor.takeBinaryData(t)),
                e &&
                  ((this.reconstructor = null),
                  super.emitReserved("decoded", e));
            }
          }
          decodeString(t) {
            let e = 0;
            const s = { type: Number(t.charAt(0)) };
            if (void 0 === c[s.type])
              throw new Error("unknown packet type " + s.type);
            if (s.type === c.BINARY_EVENT || s.type === c.BINARY_ACK) {
              const r = e + 1;
              for (; "-" !== t.charAt(++e) && e != t.length; );
              const n = t.substring(r, e);
              if (n != Number(n) || "-" !== t.charAt(e))
                throw new Error("Illegal attachments");
              s.attachments = Number(n);
            }
            if ("/" === t.charAt(e + 1)) {
              const r = e + 1;
              for (; ++e && "," !== t.charAt(e) && e !== t.length; );
              s.nsp = t.substring(r, e);
            } else s.nsp = "/";
            const r = t.charAt(e + 1);
            if ("" !== r && Number(r) == r) {
              const r = e + 1;
              for (; ++e; ) {
                const s = t.charAt(e);
                if (null == s || Number(s) != s) {
                  --e;
                  break;
                }
                if (e === t.length) break;
              }
              s.id = Number(t.substring(r, e + 1));
            }
            if (t.charAt(++e)) {
              const r = this.tryParse(t.substr(e));
              if (!p.isPayloadValid(s.type, r))
                throw new Error("invalid payload");
              s.data = r;
            }
            return s;
          }
          tryParse(t) {
            try {
              return JSON.parse(t, this.reviver);
            } catch (t) {
              return !1;
            }
          }
          static isPayloadValid(t, e) {
            switch (t) {
              case c.CONNECT:
                return u(e);
              case c.DISCONNECT:
                return void 0 === e;
              case c.CONNECT_ERROR:
                return "string" == typeof e || u(e);
              case c.EVENT:
              case c.BINARY_EVENT:
                return (
                  Array.isArray(e) &&
                  ("number" == typeof e[0] ||
                    ("string" == typeof e[0] && -1 === o.indexOf(e[0])))
                );
              case c.ACK:
              case c.BINARY_ACK:
                return Array.isArray(e);
            }
          }
          destroy() {
            this.reconstructor &&
              (this.reconstructor.finishedReconstruction(),
              (this.reconstructor = null));
          }
        }
        class d {
          constructor(t) {
            (this.packet = t), (this.buffers = []), (this.reconPack = t);
          }
          takeBinaryData(t) {
            if (
              (this.buffers.push(t),
              this.buffers.length === this.reconPack.attachments)
            ) {
              const t = (0, n.v)(this.reconPack, this.buffers);
              return this.finishedReconstruction(), t;
            }
            return null;
          }
          finishedReconstruction() {
            (this.reconPack = null), (this.buffers = []);
          }
        }
      },
      581: (t, e, s) => {
        "use strict";
        s.d(e, { O: () => h, h: () => c });
        const r = "function" == typeof ArrayBuffer,
          n = (t) =>
            "function" == typeof ArrayBuffer.isView
              ? ArrayBuffer.isView(t)
              : t.buffer instanceof ArrayBuffer,
          i = Object.prototype.toString,
          o =
            "function" == typeof Blob ||
            ("undefined" != typeof Blob &&
              "[object BlobConstructor]" === i.call(Blob)),
          a =
            "function" == typeof File ||
            ("undefined" != typeof File &&
              "[object FileConstructor]" === i.call(File));
        function c(t) {
          return (
            (r && (t instanceof ArrayBuffer || n(t))) ||
            (o && t instanceof Blob) ||
            (a && t instanceof File)
          );
        }
        function h(t, e) {
          if (!t || "object" != typeof t) return !1;
          if (Array.isArray(t)) {
            for (let e = 0, s = t.length; e < s; e++) if (h(t[e])) return !0;
            return !1;
          }
          if (c(t)) return !0;
          if (
            t.toJSON &&
            "function" == typeof t.toJSON &&
            1 === arguments.length
          )
            return h(t.toJSON(), !0);
          for (const e in t)
            if (Object.prototype.hasOwnProperty.call(t, e) && h(t[e]))
              return !0;
          return !1;
        }
      },
    },
    i = {};
  function o(t) {
    var e = i[t];
    if (void 0 !== e) return e.exports;
    var s = (i[t] = { exports: {} });
    return n[t](s, s.exports, o), s.exports;
  }
  (t =
    "function" == typeof Symbol
      ? Symbol("webpack queues")
      : "__webpack_queues__"),
    (e =
      "function" == typeof Symbol
        ? Symbol("webpack exports")
        : "__webpack_exports__"),
    (s =
      "function" == typeof Symbol
        ? Symbol("webpack error")
        : "__webpack_error__"),
    (r = (t) => {
      t &&
        t.d < 1 &&
        ((t.d = 1),
        t.forEach((t) => t.r--),
        t.forEach((t) => (t.r-- ? t.r++ : t())));
    }),
    (o.a = (n, i, o) => {
      var a;
      o && ((a = []).d = -1);
      var c,
        h,
        u,
        p = new Set(),
        d = n.exports,
        l = new Promise((t, e) => {
          (u = e), (h = t);
        });
      (l[e] = d),
        (l[t] = (t) => (a && t(a), p.forEach(t), l.catch((t) => {}))),
        (n.exports = l),
        i(
          (n) => {
            var i;
            c = ((n) =>
              n.map((n) => {
                if (null !== n && "object" == typeof n) {
                  if (n[t]) return n;
                  if (n.then) {
                    var i = [];
                    (i.d = 0),
                      n.then(
                        (t) => {
                          (o[e] = t), r(i);
                        },
                        (t) => {
                          (o[s] = t), r(i);
                        },
                      );
                    var o = {};
                    return (o[t] = (t) => t(i)), o;
                  }
                }
                var a = {};
                return (a[t] = (t) => {}), (a[e] = n), a;
              }))(n);
            var o = () =>
                c.map((t) => {
                  if (t[s]) throw t[s];
                  return t[e];
                }),
              h = new Promise((e) => {
                (i = () => e(o)).r = 0;
                var s = (t) =>
                  t !== a &&
                  !p.has(t) &&
                  (p.add(t), t && !t.d && (i.r++, t.push(i)));
                c.map((e) => e[t](s));
              });
            return i.r ? h : o();
          },
          (t) => (t ? u((l[s] = t)) : h(d), r(a)),
        ),
        a && a.d < 0 && (a.d = 0);
    }),
    (o.n = (t) => {
      var e = t && t.__esModule ? () => t.default : () => t;
      return o.d(e, { a: e }), e;
    }),
    (o.d = (t, e) => {
      for (var s in e)
        o.o(e, s) &&
          !o.o(t, s) &&
          Object.defineProperty(t, s, { enumerable: !0, get: e[s] });
    }),
    (o.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e)),
    (o.r = (t) => {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(t, "__esModule", { value: !0 });
    }),
    o(36);
})();
