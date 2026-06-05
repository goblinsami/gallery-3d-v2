const Ge = (i, t) => {
  const e = document.createElement(i);
  return e.className = t, e;
}, uc = (i, t) => {
  i.dataset.state = t.state;
  const e = i.querySelector(".g3d-sheet__title"), n = i.querySelector(".g3d-sheet__eyebrow"), r = i.querySelector(".g3d-sheet__body"), s = i.querySelector(".g3d-sheet__description");
  n && (n.textContent = t.content?.eyebrow ?? t.item?.type ?? ""), e && (e.textContent = t.content?.title ?? "Gallery3D"), s && (s.textContent = t.content?.description ?? t.content?.body ?? ""), r && (r.hidden = t.state === "collapsed");
}, C_ = (i) => {
  const t = Ge("section", "g3d-sheet"), e = Ge("button", "g3d-sheet__handle"), n = Ge("span", "g3d-sheet__grip"), r = Ge("div", "g3d-sheet__summary"), s = Ge("p", "g3d-sheet__eyebrow"), a = Ge("h2", "g3d-sheet__title"), o = Ge("div", "g3d-sheet__body"), l = Ge("p", "g3d-sheet__description"), c = Ge("div", "g3d-sheet__actions"), h = Ge("button", "g3d-sheet__nav"), u = Ge("button", "g3d-sheet__nav");
  let f = null;
  e.type = "button", e.setAttribute("aria-label", "Toggle content"), h.type = "button", u.type = "button", h.textContent = "Previous", u.textContent = "Next", h.setAttribute("aria-label", "Previous item"), u.setAttribute("aria-label", "Next item"), o.hidden = !0, e.append(n), r.append(s, a), c.append(h, u), o.append(l), t.append(e, r, o, c);
  const d = () => {
    const p = i.getContentSurface().state, A = p === "collapsed" ? "half" : p === "half" ? "full" : "collapsed";
    i.setBottomSheetState(A);
  }, g = () => i.setBottomSheetState("collapsed"), v = () => {
    i.previousItem();
  }, m = () => {
    i.nextItem();
  };
  return e.addEventListener("click", d), r.addEventListener("click", d), t.addEventListener("dblclick", g), h.addEventListener("click", v), u.addEventListener("click", m), f = i.subscribeContentSurface((p) => uc(t, p)), {
    element: t,
    dispose: () => {
      f?.(), e.removeEventListener("click", d), r.removeEventListener("click", d), t.removeEventListener("dblclick", g), h.removeEventListener("click", v), u.removeEventListener("click", m), t.remove();
    }
  };
}, xn = (i, t) => {
  const e = document.createElement(i);
  return e.className = t, e;
}, dc = (i, t) => {
  const e = i.querySelector(".g3d-panel__eyebrow"), n = i.querySelector(".g3d-panel__title"), r = i.querySelector(".g3d-panel__description");
  e && (e.textContent = t.content?.eyebrow ?? t.item?.type ?? ""), n && (n.textContent = t.content?.title ?? "Gallery3D"), r && (r.textContent = t.content?.description ?? t.content?.body ?? "");
}, P_ = (i) => {
  const t = xn("aside", "g3d-panel"), e = xn("div", "g3d-panel__grip"), n = xn("p", "g3d-panel__eyebrow"), r = xn("h2", "g3d-panel__title"), s = xn("p", "g3d-panel__description"), a = xn("div", "g3d-panel__actions"), o = xn("button", "g3d-panel__nav"), l = xn("button", "g3d-panel__nav");
  let c = null;
  o.type = "button", l.type = "button", o.textContent = "Previous", l.textContent = "Next", o.setAttribute("aria-label", "Previous item"), l.setAttribute("aria-label", "Next item"), a.append(o, l), t.append(e, n, r, s, a);
  const h = () => {
    i.previousItem();
  }, u = () => {
    i.nextItem();
  };
  return o.addEventListener("click", h), l.addEventListener("click", u), c = i.subscribeContentSurface((f) => dc(t, f)), {
    element: t,
    dispose: () => {
      c?.(), o.removeEventListener("click", h), l.removeEventListener("click", u), t.remove();
    }
  };
};
class fl {
  entries = /* @__PURE__ */ new Map();
  register(t) {
    if (this.entries.has(t.type))
      throw new Error(`Duplicate registry entry: ${t.type}`);
    this.entries.set(t.type, t);
  }
  get(t) {
    const e = this.entries.get(t);
    if (!e)
      throw new Error(`Missing registry entry: ${t}`);
    return e;
  }
  has(t) {
    return this.entries.has(t);
  }
  values() {
    return Array.from(this.entries.values());
  }
}
const fc = () => new fl(), pc = () => new fl(), mc = 2.4, gc = 1.6, _c = 0.08, fi = (i, t, e) => ({ x: i, y: t, z: e }), pl = (i) => {
  const t = i.appearance.size, e = i.placement.scale ?? 1, s = Math.max(0.2, e * (typeof t == "number" ? t : t === "large" ? 1.48 : t === "small" ? 0.82 : 1));
  return {
    width: mc * s,
    height: gc * s,
    depth: _c
  };
}, Ls = (i, t) => ({
  x: i.x + (t?.x ?? 0),
  y: i.y + (t?.y ?? 0),
  z: i.z + (t?.z ?? 0)
});
class ml {
  type = "corridor";
  layout(t, e = t.layout, n) {
    const r = t.layout.spacing ?? 7, s = t.layout.bounds?.width ?? 5.4, a = t.layout.bounds?.height ?? 3.4, o = 0.08;
    return t.items.map((l, c) => ({
      ...l,
      ...this.placeItem(l, c, r, s, a, o)
    }));
  }
  placeItem(t, e, n, r, s, a) {
    const o = t.placement.side === "right" ? "right" : t.placement.side === "center" ? "center" : "left", l = pl(t), c = -(e + 1) * n, h = Math.min(s - l.height * 0.5 - 0.25, 1.65);
    if (o === "center") {
      const d = Ls(fi(0, h, c), t.placement.offset);
      return {
        index: e,
        position: d,
        rotation: fi(0, 0, 0),
        focusTarget: d,
        bounds: l
      };
    }
    const f = Ls(fi((o === "left" ? -1 : 1) * (r / 2 - a), h, c), t.placement.offset);
    return {
      index: e,
      position: f,
      rotation: fi(0, o === "left" ? Math.PI / 2 : -Math.PI / 2, 0),
      focusTarget: f,
      bounds: l
    };
  }
}
class vc {
  type = "gallery-room";
  layout(t, e = t.layout, n) {
    return t.items.map((r, s) => {
      const a = pl(r), o = s % 3 * 3 - 3, l = -Math.floor(s / 3) * 4, c = Ls(fi(o, 1.6, l), r.placement.offset);
      return {
        ...r,
        index: s,
        position: c,
        rotation: fi(0, 0, 0),
        focusTarget: c,
        bounds: a
      };
    });
  }
}
const xc = 3;
class Mc {
  type = "infinite-corridor";
  corridor = new ml();
  layout(t, e = t.layout, n) {
    const r = this.corridor.layout(t, t.layout, n);
    if (r.length === 0)
      return [];
    const s = t.layout.spacing ?? 7, a = r.length * s;
    return Array.from(
      { length: xc },
      (o, l) => r.map((c) => ({
        ...c,
        id: l === 0 ? c.id : `${c.id}__loop_${l}`,
        index: l * r.length + c.index,
        position: {
          ...c.position,
          z: c.position.z - l * a
        },
        focusTarget: {
          ...c.focusTarget,
          z: c.focusTarget.z - l * a
        }
      }))
    ).flat();
  }
}
const Sc = () => {
  const i = pc();
  return i.register(new ml()), i.register(new Mc()), i.register(new vc()), i;
};
const Ma = "176", yc = 0, Xa = 1, Ec = 2, gl = 1, _l = 2, dn = 3, Rn = 0, Ce = 1, we = 2, bn = 0, mi = 1, zr = 2, qa = 3, Ya = 4, Tc = 5, Hn = 100, Ac = 101, bc = 102, wc = 103, Rc = 104, Cc = 200, Pc = 201, Lc = 202, Dc = 203, Ds = 204, Is = 205, Ic = 206, Uc = 207, Nc = 208, Fc = 209, Oc = 210, Bc = 211, zc = 212, Hc = 213, kc = 214, Us = 0, Ns = 1, Fs = 2, _i = 3, Os = 4, Bs = 5, zs = 6, Hs = 7, vl = 0, Vc = 1, Gc = 2, wn = 0, Wc = 1, Xc = 2, qc = 3, xl = 4, Yc = 5, $c = 6, Zc = 7, Ml = 300, vi = 301, xi = 302, ks = 303, Vs = 304, Wr = 306, Xn = 1e3, Vn = 1001, Gs = 1002, Ue = 1003, Jc = 1004, sr = 1005, ye = 1006, Zr = 1007, Gn = 1008, nn = 1009, Sl = 1010, yl = 1011, Wi = 1012, Sa = 1013, qn = 1014, tn = 1015, ji = 1016, ya = 1017, Ea = 1018, Xi = 1020, El = 35902, Tl = 1021, Al = 1022, $e = 1023, qi = 1026, Yi = 1027, Ta = 1028, Aa = 1029, bl = 1030, ba = 1031, wa = 1033, Dr = 33776, Ir = 33777, Ur = 33778, Nr = 33779, Ws = 35840, Xs = 35841, qs = 35842, Ys = 35843, $s = 36196, Zs = 37492, Js = 37496, Ks = 37808, js = 37809, Qs = 37810, ta = 37811, ea = 37812, na = 37813, ia = 37814, ra = 37815, sa = 37816, aa = 37817, oa = 37818, la = 37819, ca = 37820, ha = 37821, Fr = 36492, ua = 36494, da = 36495, wl = 36283, fa = 36284, pa = 36285, ma = 36286, Kc = 3200, jc = 3201, Rl = 0, Qc = 1, fn = "", Se = "srgb", Mi = "srgb-linear", Hr = "linear", Zt = "srgb", Kn = 7680, $a = 519, th = 512, eh = 513, nh = 514, Cl = 515, ih = 516, rh = 517, sh = 518, ah = 519, Za = 35044, Ja = "300 es", mn = 2e3, kr = 2001;
class Ei {
  /**
   * Adds the given event listener to the given event type.
   *
   * @param {string} type - The type of event to listen to.
   * @param {Function} listener - The function that gets called when the event is fired.
   */
  addEventListener(t, e) {
    this._listeners === void 0 && (this._listeners = {});
    const n = this._listeners;
    n[t] === void 0 && (n[t] = []), n[t].indexOf(e) === -1 && n[t].push(e);
  }
  /**
   * Returns `true` if the given event listener has been added to the given event type.
   *
   * @param {string} type - The type of event.
   * @param {Function} listener - The listener to check.
   * @return {boolean} Whether the given event listener has been added to the given event type.
   */
  hasEventListener(t, e) {
    const n = this._listeners;
    return n === void 0 ? !1 : n[t] !== void 0 && n[t].indexOf(e) !== -1;
  }
  /**
   * Removes the given event listener from the given event type.
   *
   * @param {string} type - The type of event.
   * @param {Function} listener - The listener to remove.
   */
  removeEventListener(t, e) {
    const n = this._listeners;
    if (n === void 0) return;
    const r = n[t];
    if (r !== void 0) {
      const s = r.indexOf(e);
      s !== -1 && r.splice(s, 1);
    }
  }
  /**
   * Dispatches an event object.
   *
   * @param {Object} event - The event that gets fired.
   */
  dispatchEvent(t) {
    const e = this._listeners;
    if (e === void 0) return;
    const n = e[t.type];
    if (n !== void 0) {
      t.target = this;
      const r = n.slice(0);
      for (let s = 0, a = r.length; s < a; s++)
        r[s].call(this, t);
      t.target = null;
    }
  }
}
const xe = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"], Jr = Math.PI / 180, ga = 180 / Math.PI;
function Ti() {
  const i = Math.random() * 4294967295 | 0, t = Math.random() * 4294967295 | 0, e = Math.random() * 4294967295 | 0, n = Math.random() * 4294967295 | 0;
  return (xe[i & 255] + xe[i >> 8 & 255] + xe[i >> 16 & 255] + xe[i >> 24 & 255] + "-" + xe[t & 255] + xe[t >> 8 & 255] + "-" + xe[t >> 16 & 15 | 64] + xe[t >> 24 & 255] + "-" + xe[e & 63 | 128] + xe[e >> 8 & 255] + "-" + xe[e >> 16 & 255] + xe[e >> 24 & 255] + xe[n & 255] + xe[n >> 8 & 255] + xe[n >> 16 & 255] + xe[n >> 24 & 255]).toLowerCase();
}
function Nt(i, t, e) {
  return Math.max(t, Math.min(e, i));
}
function oh(i, t) {
  return (i % t + t) % t;
}
function Kr(i, t, e) {
  return (1 - e) * i + e * t;
}
function Ri(i, t) {
  switch (t.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return i / 4294967295;
    case Uint16Array:
      return i / 65535;
    case Uint8Array:
      return i / 255;
    case Int32Array:
      return Math.max(i / 2147483647, -1);
    case Int16Array:
      return Math.max(i / 32767, -1);
    case Int8Array:
      return Math.max(i / 127, -1);
    default:
      throw new Error("Invalid component type.");
  }
}
function be(i, t) {
  switch (t.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return Math.round(i * 4294967295);
    case Uint16Array:
      return Math.round(i * 65535);
    case Uint8Array:
      return Math.round(i * 255);
    case Int32Array:
      return Math.round(i * 2147483647);
    case Int16Array:
      return Math.round(i * 32767);
    case Int8Array:
      return Math.round(i * 127);
    default:
      throw new Error("Invalid component type.");
  }
}
class mt {
  /**
   * Constructs a new 2D vector.
   *
   * @param {number} [x=0] - The x value of this vector.
   * @param {number} [y=0] - The y value of this vector.
   */
  constructor(t = 0, e = 0) {
    mt.prototype.isVector2 = !0, this.x = t, this.y = e;
  }
  /**
   * Alias for {@link Vector2#x}.
   *
   * @type {number}
   */
  get width() {
    return this.x;
  }
  set width(t) {
    this.x = t;
  }
  /**
   * Alias for {@link Vector2#y}.
   *
   * @type {number}
   */
  get height() {
    return this.y;
  }
  set height(t) {
    this.y = t;
  }
  /**
   * Sets the vector components.
   *
   * @param {number} x - The value of the x component.
   * @param {number} y - The value of the y component.
   * @return {Vector2} A reference to this vector.
   */
  set(t, e) {
    return this.x = t, this.y = e, this;
  }
  /**
   * Sets the vector components to the same value.
   *
   * @param {number} scalar - The value to set for all vector components.
   * @return {Vector2} A reference to this vector.
   */
  setScalar(t) {
    return this.x = t, this.y = t, this;
  }
  /**
   * Sets the vector's x component to the given value
   *
   * @param {number} x - The value to set.
   * @return {Vector2} A reference to this vector.
   */
  setX(t) {
    return this.x = t, this;
  }
  /**
   * Sets the vector's y component to the given value
   *
   * @param {number} y - The value to set.
   * @return {Vector2} A reference to this vector.
   */
  setY(t) {
    return this.y = t, this;
  }
  /**
   * Allows to set a vector component with an index.
   *
   * @param {number} index - The component index. `0` equals to x, `1` equals to y.
   * @param {number} value - The value to set.
   * @return {Vector2} A reference to this vector.
   */
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  /**
   * Returns the value of the vector component which matches the given index.
   *
   * @param {number} index - The component index. `0` equals to x, `1` equals to y.
   * @return {number} A vector component value.
   */
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  /**
   * Returns a new vector with copied values from this instance.
   *
   * @return {Vector2} A clone of this instance.
   */
  clone() {
    return new this.constructor(this.x, this.y);
  }
  /**
   * Copies the values of the given vector to this instance.
   *
   * @param {Vector2} v - The vector to copy.
   * @return {Vector2} A reference to this vector.
   */
  copy(t) {
    return this.x = t.x, this.y = t.y, this;
  }
  /**
   * Adds the given vector to this instance.
   *
   * @param {Vector2} v - The vector to add.
   * @return {Vector2} A reference to this vector.
   */
  add(t) {
    return this.x += t.x, this.y += t.y, this;
  }
  /**
   * Adds the given scalar value to all components of this instance.
   *
   * @param {number} s - The scalar to add.
   * @return {Vector2} A reference to this vector.
   */
  addScalar(t) {
    return this.x += t, this.y += t, this;
  }
  /**
   * Adds the given vectors and stores the result in this instance.
   *
   * @param {Vector2} a - The first vector.
   * @param {Vector2} b - The second vector.
   * @return {Vector2} A reference to this vector.
   */
  addVectors(t, e) {
    return this.x = t.x + e.x, this.y = t.y + e.y, this;
  }
  /**
   * Adds the given vector scaled by the given factor to this instance.
   *
   * @param {Vector2} v - The vector.
   * @param {number} s - The factor that scales `v`.
   * @return {Vector2} A reference to this vector.
   */
  addScaledVector(t, e) {
    return this.x += t.x * e, this.y += t.y * e, this;
  }
  /**
   * Subtracts the given vector from this instance.
   *
   * @param {Vector2} v - The vector to subtract.
   * @return {Vector2} A reference to this vector.
   */
  sub(t) {
    return this.x -= t.x, this.y -= t.y, this;
  }
  /**
   * Subtracts the given scalar value from all components of this instance.
   *
   * @param {number} s - The scalar to subtract.
   * @return {Vector2} A reference to this vector.
   */
  subScalar(t) {
    return this.x -= t, this.y -= t, this;
  }
  /**
   * Subtracts the given vectors and stores the result in this instance.
   *
   * @param {Vector2} a - The first vector.
   * @param {Vector2} b - The second vector.
   * @return {Vector2} A reference to this vector.
   */
  subVectors(t, e) {
    return this.x = t.x - e.x, this.y = t.y - e.y, this;
  }
  /**
   * Multiplies the given vector with this instance.
   *
   * @param {Vector2} v - The vector to multiply.
   * @return {Vector2} A reference to this vector.
   */
  multiply(t) {
    return this.x *= t.x, this.y *= t.y, this;
  }
  /**
   * Multiplies the given scalar value with all components of this instance.
   *
   * @param {number} scalar - The scalar to multiply.
   * @return {Vector2} A reference to this vector.
   */
  multiplyScalar(t) {
    return this.x *= t, this.y *= t, this;
  }
  /**
   * Divides this instance by the given vector.
   *
   * @param {Vector2} v - The vector to divide.
   * @return {Vector2} A reference to this vector.
   */
  divide(t) {
    return this.x /= t.x, this.y /= t.y, this;
  }
  /**
   * Divides this vector by the given scalar.
   *
   * @param {number} scalar - The scalar to divide.
   * @return {Vector2} A reference to this vector.
   */
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  /**
   * Multiplies this vector (with an implicit 1 as the 3rd component) by
   * the given 3x3 matrix.
   *
   * @param {Matrix3} m - The matrix to apply.
   * @return {Vector2} A reference to this vector.
   */
  applyMatrix3(t) {
    const e = this.x, n = this.y, r = t.elements;
    return this.x = r[0] * e + r[3] * n + r[6], this.y = r[1] * e + r[4] * n + r[7], this;
  }
  /**
   * If this vector's x or y value is greater than the given vector's x or y
   * value, replace that value with the corresponding min value.
   *
   * @param {Vector2} v - The vector.
   * @return {Vector2} A reference to this vector.
   */
  min(t) {
    return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this;
  }
  /**
   * If this vector's x or y value is less than the given vector's x or y
   * value, replace that value with the corresponding max value.
   *
   * @param {Vector2} v - The vector.
   * @return {Vector2} A reference to this vector.
   */
  max(t) {
    return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this;
  }
  /**
   * If this vector's x or y value is greater than the max vector's x or y
   * value, it is replaced by the corresponding value.
   * If this vector's x or y value is less than the min vector's x or y value,
   * it is replaced by the corresponding value.
   *
   * @param {Vector2} min - The minimum x and y values.
   * @param {Vector2} max - The maximum x and y values in the desired range.
   * @return {Vector2} A reference to this vector.
   */
  clamp(t, e) {
    return this.x = Nt(this.x, t.x, e.x), this.y = Nt(this.y, t.y, e.y), this;
  }
  /**
   * If this vector's x or y values are greater than the max value, they are
   * replaced by the max value.
   * If this vector's x or y values are less than the min value, they are
   * replaced by the min value.
   *
   * @param {number} minVal - The minimum value the components will be clamped to.
   * @param {number} maxVal - The maximum value the components will be clamped to.
   * @return {Vector2} A reference to this vector.
   */
  clampScalar(t, e) {
    return this.x = Nt(this.x, t, e), this.y = Nt(this.y, t, e), this;
  }
  /**
   * If this vector's length is greater than the max value, it is replaced by
   * the max value.
   * If this vector's length is less than the min value, it is replaced by the
   * min value.
   *
   * @param {number} min - The minimum value the vector length will be clamped to.
   * @param {number} max - The maximum value the vector length will be clamped to.
   * @return {Vector2} A reference to this vector.
   */
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Nt(n, t, e));
  }
  /**
   * The components of this vector are rounded down to the nearest integer value.
   *
   * @return {Vector2} A reference to this vector.
   */
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
  }
  /**
   * The components of this vector are rounded up to the nearest integer value.
   *
   * @return {Vector2} A reference to this vector.
   */
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
  }
  /**
   * The components of this vector are rounded to the nearest integer value
   *
   * @return {Vector2} A reference to this vector.
   */
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
  }
  /**
   * The components of this vector are rounded towards zero (up if negative,
   * down if positive) to an integer value.
   *
   * @return {Vector2} A reference to this vector.
   */
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
  }
  /**
   * Inverts this vector - i.e. sets x = -x and y = -y.
   *
   * @return {Vector2} A reference to this vector.
   */
  negate() {
    return this.x = -this.x, this.y = -this.y, this;
  }
  /**
   * Calculates the dot product of the given vector with this instance.
   *
   * @param {Vector2} v - The vector to compute the dot product with.
   * @return {number} The result of the dot product.
   */
  dot(t) {
    return this.x * t.x + this.y * t.y;
  }
  /**
   * Calculates the cross product of the given vector with this instance.
   *
   * @param {Vector2} v - The vector to compute the cross product with.
   * @return {number} The result of the cross product.
   */
  cross(t) {
    return this.x * t.y - this.y * t.x;
  }
  /**
   * Computes the square of the Euclidean length (straight-line length) from
   * (0, 0) to (x, y). If you are comparing the lengths of vectors, you should
   * compare the length squared instead as it is slightly more efficient to calculate.
   *
   * @return {number} The square length of this vector.
   */
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }
  /**
   * Computes the  Euclidean length (straight-line length) from (0, 0) to (x, y).
   *
   * @return {number} The length of this vector.
   */
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  /**
   * Computes the Manhattan length of this vector.
   *
   * @return {number} The length of this vector.
   */
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y);
  }
  /**
   * Converts this vector to a unit vector - that is, sets it equal to a vector
   * with the same direction as this one, but with a vector length of `1`.
   *
   * @return {Vector2} A reference to this vector.
   */
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  /**
   * Computes the angle in radians of this vector with respect to the positive x-axis.
   *
   * @return {number} The angle in radians.
   */
  angle() {
    return Math.atan2(-this.y, -this.x) + Math.PI;
  }
  /**
   * Returns the angle between the given vector and this instance in radians.
   *
   * @param {Vector2} v - The vector to compute the angle with.
   * @return {number} The angle in radians.
   */
  angleTo(t) {
    const e = Math.sqrt(this.lengthSq() * t.lengthSq());
    if (e === 0) return Math.PI / 2;
    const n = this.dot(t) / e;
    return Math.acos(Nt(n, -1, 1));
  }
  /**
   * Computes the distance from the given vector to this instance.
   *
   * @param {Vector2} v - The vector to compute the distance to.
   * @return {number} The distance.
   */
  distanceTo(t) {
    return Math.sqrt(this.distanceToSquared(t));
  }
  /**
   * Computes the squared distance from the given vector to this instance.
   * If you are just comparing the distance with another distance, you should compare
   * the distance squared instead as it is slightly more efficient to calculate.
   *
   * @param {Vector2} v - The vector to compute the squared distance to.
   * @return {number} The squared distance.
   */
  distanceToSquared(t) {
    const e = this.x - t.x, n = this.y - t.y;
    return e * e + n * n;
  }
  /**
   * Computes the Manhattan distance from the given vector to this instance.
   *
   * @param {Vector2} v - The vector to compute the Manhattan distance to.
   * @return {number} The Manhattan distance.
   */
  manhattanDistanceTo(t) {
    return Math.abs(this.x - t.x) + Math.abs(this.y - t.y);
  }
  /**
   * Sets this vector to a vector with the same direction as this one, but
   * with the specified length.
   *
   * @param {number} length - The new length of this vector.
   * @return {Vector2} A reference to this vector.
   */
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  /**
   * Linearly interpolates between the given vector and this instance, where
   * alpha is the percent distance along the line - alpha = 0 will be this
   * vector, and alpha = 1 will be the given one.
   *
   * @param {Vector2} v - The vector to interpolate towards.
   * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
   * @return {Vector2} A reference to this vector.
   */
  lerp(t, e) {
    return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this;
  }
  /**
   * Linearly interpolates between the given vectors, where alpha is the percent
   * distance along the line - alpha = 0 will be first vector, and alpha = 1 will
   * be the second one. The result is stored in this instance.
   *
   * @param {Vector2} v1 - The first vector.
   * @param {Vector2} v2 - The second vector.
   * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
   * @return {Vector2} A reference to this vector.
   */
  lerpVectors(t, e, n) {
    return this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this;
  }
  /**
   * Returns `true` if this vector is equal with the given one.
   *
   * @param {Vector2} v - The vector to test for equality.
   * @return {boolean} Whether this vector is equal with the given one.
   */
  equals(t) {
    return t.x === this.x && t.y === this.y;
  }
  /**
   * Sets this vector's x value to be `array[ offset ]` and y
   * value to be `array[ offset + 1 ]`.
   *
   * @param {Array<number>} array - An array holding the vector component values.
   * @param {number} [offset=0] - The offset into the array.
   * @return {Vector2} A reference to this vector.
   */
  fromArray(t, e = 0) {
    return this.x = t[e], this.y = t[e + 1], this;
  }
  /**
   * Writes the components of this vector to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number>} [array=[]] - The target array holding the vector components.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number>} The vector components.
   */
  toArray(t = [], e = 0) {
    return t[e] = this.x, t[e + 1] = this.y, t;
  }
  /**
   * Sets the components of this vector from the given buffer attribute.
   *
   * @param {BufferAttribute} attribute - The buffer attribute holding vector data.
   * @param {number} index - The index into the attribute.
   * @return {Vector2} A reference to this vector.
   */
  fromBufferAttribute(t, e) {
    return this.x = t.getX(e), this.y = t.getY(e), this;
  }
  /**
   * Rotates this vector around the given center by the given angle.
   *
   * @param {Vector2} center - The point around which to rotate.
   * @param {number} angle - The angle to rotate, in radians.
   * @return {Vector2} A reference to this vector.
   */
  rotateAround(t, e) {
    const n = Math.cos(e), r = Math.sin(e), s = this.x - t.x, a = this.y - t.y;
    return this.x = s * n - a * r + t.x, this.y = s * r + a * n + t.y, this;
  }
  /**
   * Sets each component of this vector to a pseudo-random value between `0` and
   * `1`, excluding `1`.
   *
   * @return {Vector2} A reference to this vector.
   */
  random() {
    return this.x = Math.random(), this.y = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y;
  }
}
class Lt {
  /**
   * Constructs a new 3x3 matrix. The arguments are supposed to be
   * in row-major order. If no arguments are provided, the constructor
   * initializes the matrix as an identity matrix.
   *
   * @param {number} [n11] - 1-1 matrix element.
   * @param {number} [n12] - 1-2 matrix element.
   * @param {number} [n13] - 1-3 matrix element.
   * @param {number} [n21] - 2-1 matrix element.
   * @param {number} [n22] - 2-2 matrix element.
   * @param {number} [n23] - 2-3 matrix element.
   * @param {number} [n31] - 3-1 matrix element.
   * @param {number} [n32] - 3-2 matrix element.
   * @param {number} [n33] - 3-3 matrix element.
   */
  constructor(t, e, n, r, s, a, o, l, c) {
    Lt.prototype.isMatrix3 = !0, this.elements = [
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ], t !== void 0 && this.set(t, e, n, r, s, a, o, l, c);
  }
  /**
   * Sets the elements of the matrix.The arguments are supposed to be
   * in row-major order.
   *
   * @param {number} [n11] - 1-1 matrix element.
   * @param {number} [n12] - 1-2 matrix element.
   * @param {number} [n13] - 1-3 matrix element.
   * @param {number} [n21] - 2-1 matrix element.
   * @param {number} [n22] - 2-2 matrix element.
   * @param {number} [n23] - 2-3 matrix element.
   * @param {number} [n31] - 3-1 matrix element.
   * @param {number} [n32] - 3-2 matrix element.
   * @param {number} [n33] - 3-3 matrix element.
   * @return {Matrix3} A reference to this matrix.
   */
  set(t, e, n, r, s, a, o, l, c) {
    const h = this.elements;
    return h[0] = t, h[1] = r, h[2] = o, h[3] = e, h[4] = s, h[5] = l, h[6] = n, h[7] = a, h[8] = c, this;
  }
  /**
   * Sets this matrix to the 3x3 identity matrix.
   *
   * @return {Matrix3} A reference to this matrix.
   */
  identity() {
    return this.set(
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Copies the values of the given matrix to this instance.
   *
   * @param {Matrix3} m - The matrix to copy.
   * @return {Matrix3} A reference to this matrix.
   */
  copy(t) {
    const e = this.elements, n = t.elements;
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[8] = n[8], this;
  }
  /**
   * Extracts the basis of this matrix into the three axis vectors provided.
   *
   * @param {Vector3} xAxis - The basis's x axis.
   * @param {Vector3} yAxis - The basis's y axis.
   * @param {Vector3} zAxis - The basis's z axis.
   * @return {Matrix3} A reference to this matrix.
   */
  extractBasis(t, e, n) {
    return t.setFromMatrix3Column(this, 0), e.setFromMatrix3Column(this, 1), n.setFromMatrix3Column(this, 2), this;
  }
  /**
   * Set this matrix to the upper 3x3 matrix of the given 4x4 matrix.
   *
   * @param {Matrix4} m - The 4x4 matrix.
   * @return {Matrix3} A reference to this matrix.
   */
  setFromMatrix4(t) {
    const e = t.elements;
    return this.set(
      e[0],
      e[4],
      e[8],
      e[1],
      e[5],
      e[9],
      e[2],
      e[6],
      e[10]
    ), this;
  }
  /**
   * Post-multiplies this matrix by the given 3x3 matrix.
   *
   * @param {Matrix3} m - The matrix to multiply with.
   * @return {Matrix3} A reference to this matrix.
   */
  multiply(t) {
    return this.multiplyMatrices(this, t);
  }
  /**
   * Pre-multiplies this matrix by the given 3x3 matrix.
   *
   * @param {Matrix3} m - The matrix to multiply with.
   * @return {Matrix3} A reference to this matrix.
   */
  premultiply(t) {
    return this.multiplyMatrices(t, this);
  }
  /**
   * Multiples the given 3x3 matrices and stores the result
   * in this matrix.
   *
   * @param {Matrix3} a - The first matrix.
   * @param {Matrix3} b - The second matrix.
   * @return {Matrix3} A reference to this matrix.
   */
  multiplyMatrices(t, e) {
    const n = t.elements, r = e.elements, s = this.elements, a = n[0], o = n[3], l = n[6], c = n[1], h = n[4], u = n[7], f = n[2], d = n[5], g = n[8], v = r[0], m = r[3], p = r[6], A = r[1], T = r[4], S = r[7], N = r[2], w = r[5], R = r[8];
    return s[0] = a * v + o * A + l * N, s[3] = a * m + o * T + l * w, s[6] = a * p + o * S + l * R, s[1] = c * v + h * A + u * N, s[4] = c * m + h * T + u * w, s[7] = c * p + h * S + u * R, s[2] = f * v + d * A + g * N, s[5] = f * m + d * T + g * w, s[8] = f * p + d * S + g * R, this;
  }
  /**
   * Multiplies every component of the matrix by the given scalar.
   *
   * @param {number} s - The scalar.
   * @return {Matrix3} A reference to this matrix.
   */
  multiplyScalar(t) {
    const e = this.elements;
    return e[0] *= t, e[3] *= t, e[6] *= t, e[1] *= t, e[4] *= t, e[7] *= t, e[2] *= t, e[5] *= t, e[8] *= t, this;
  }
  /**
   * Computes and returns the determinant of this matrix.
   *
   * @return {number} The determinant.
   */
  determinant() {
    const t = this.elements, e = t[0], n = t[1], r = t[2], s = t[3], a = t[4], o = t[5], l = t[6], c = t[7], h = t[8];
    return e * a * h - e * o * c - n * s * h + n * o * l + r * s * c - r * a * l;
  }
  /**
   * Inverts this matrix, using the [analytic method]{@link https://en.wikipedia.org/wiki/Invertible_matrix#Analytic_solution}.
   * You can not invert with a determinant of zero. If you attempt this, the method produces
   * a zero matrix instead.
   *
   * @return {Matrix3} A reference to this matrix.
   */
  invert() {
    const t = this.elements, e = t[0], n = t[1], r = t[2], s = t[3], a = t[4], o = t[5], l = t[6], c = t[7], h = t[8], u = h * a - o * c, f = o * l - h * s, d = c * s - a * l, g = e * u + n * f + r * d;
    if (g === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const v = 1 / g;
    return t[0] = u * v, t[1] = (r * c - h * n) * v, t[2] = (o * n - r * a) * v, t[3] = f * v, t[4] = (h * e - r * l) * v, t[5] = (r * s - o * e) * v, t[6] = d * v, t[7] = (n * l - c * e) * v, t[8] = (a * e - n * s) * v, this;
  }
  /**
   * Transposes this matrix in place.
   *
   * @return {Matrix3} A reference to this matrix.
   */
  transpose() {
    let t;
    const e = this.elements;
    return t = e[1], e[1] = e[3], e[3] = t, t = e[2], e[2] = e[6], e[6] = t, t = e[5], e[5] = e[7], e[7] = t, this;
  }
  /**
   * Computes the normal matrix which is the inverse transpose of the upper
   * left 3x3 portion of the given 4x4 matrix.
   *
   * @param {Matrix4} matrix4 - The 4x4 matrix.
   * @return {Matrix3} A reference to this matrix.
   */
  getNormalMatrix(t) {
    return this.setFromMatrix4(t).invert().transpose();
  }
  /**
   * Transposes this matrix into the supplied array, and returns itself unchanged.
   *
   * @param {Array<number>} r - An array to store the transposed matrix elements.
   * @return {Matrix3} A reference to this matrix.
   */
  transposeIntoArray(t) {
    const e = this.elements;
    return t[0] = e[0], t[1] = e[3], t[2] = e[6], t[3] = e[1], t[4] = e[4], t[5] = e[7], t[6] = e[2], t[7] = e[5], t[8] = e[8], this;
  }
  /**
   * Sets the UV transform matrix from offset, repeat, rotation, and center.
   *
   * @param {number} tx - Offset x.
   * @param {number} ty - Offset y.
   * @param {number} sx - Repeat x.
   * @param {number} sy - Repeat y.
   * @param {number} rotation - Rotation, in radians. Positive values rotate counterclockwise.
   * @param {number} cx - Center x of rotation.
   * @param {number} cy - Center y of rotation
   * @return {Matrix3} A reference to this matrix.
   */
  setUvTransform(t, e, n, r, s, a, o) {
    const l = Math.cos(s), c = Math.sin(s);
    return this.set(
      n * l,
      n * c,
      -n * (l * a + c * o) + a + t,
      -r * c,
      r * l,
      -r * (-c * a + l * o) + o + e,
      0,
      0,
      1
    ), this;
  }
  /**
   * Scales this matrix with the given scalar values.
   *
   * @param {number} sx - The amount to scale in the X axis.
   * @param {number} sy - The amount to scale in the Y axis.
   * @return {Matrix3} A reference to this matrix.
   */
  scale(t, e) {
    return this.premultiply(jr.makeScale(t, e)), this;
  }
  /**
   * Rotates this matrix by the given angle.
   *
   * @param {number} theta - The rotation in radians.
   * @return {Matrix3} A reference to this matrix.
   */
  rotate(t) {
    return this.premultiply(jr.makeRotation(-t)), this;
  }
  /**
   * Translates this matrix by the given scalar values.
   *
   * @param {number} tx - The amount to translate in the X axis.
   * @param {number} ty - The amount to translate in the Y axis.
   * @return {Matrix3} A reference to this matrix.
   */
  translate(t, e) {
    return this.premultiply(jr.makeTranslation(t, e)), this;
  }
  // for 2D Transforms
  /**
   * Sets this matrix as a 2D translation transform.
   *
   * @param {number|Vector2} x - The amount to translate in the X axis or alternatively a translation vector.
   * @param {number} y - The amount to translate in the Y axis.
   * @return {Matrix3} A reference to this matrix.
   */
  makeTranslation(t, e) {
    return t.isVector2 ? this.set(
      1,
      0,
      t.x,
      0,
      1,
      t.y,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      t,
      0,
      1,
      e,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a 2D rotational transformation.
   *
   * @param {number} theta - The rotation in radians.
   * @return {Matrix3} A reference to this matrix.
   */
  makeRotation(t) {
    const e = Math.cos(t), n = Math.sin(t);
    return this.set(
      e,
      -n,
      0,
      n,
      e,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a 2D scale transform.
   *
   * @param {number} x - The amount to scale in the X axis.
   * @param {number} y - The amount to scale in the Y axis.
   * @return {Matrix3} A reference to this matrix.
   */
  makeScale(t, e) {
    return this.set(
      t,
      0,
      0,
      0,
      e,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Returns `true` if this matrix is equal with the given one.
   *
   * @param {Matrix3} matrix - The matrix to test for equality.
   * @return {boolean} Whether this matrix is equal with the given one.
   */
  equals(t) {
    const e = this.elements, n = t.elements;
    for (let r = 0; r < 9; r++)
      if (e[r] !== n[r]) return !1;
    return !0;
  }
  /**
   * Sets the elements of the matrix from the given array.
   *
   * @param {Array<number>} array - The matrix elements in column-major order.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Matrix3} A reference to this matrix.
   */
  fromArray(t, e = 0) {
    for (let n = 0; n < 9; n++)
      this.elements[n] = t[n + e];
    return this;
  }
  /**
   * Writes the elements of this matrix to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number>} [array=[]] - The target array holding the matrix elements in column-major order.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number>} The matrix elements in column-major order.
   */
  toArray(t = [], e = 0) {
    const n = this.elements;
    return t[e] = n[0], t[e + 1] = n[1], t[e + 2] = n[2], t[e + 3] = n[3], t[e + 4] = n[4], t[e + 5] = n[5], t[e + 6] = n[6], t[e + 7] = n[7], t[e + 8] = n[8], t;
  }
  /**
   * Returns a matrix with copied values from this instance.
   *
   * @return {Matrix3} A clone of this instance.
   */
  clone() {
    return new this.constructor().fromArray(this.elements);
  }
}
const jr = /* @__PURE__ */ new Lt();
function Pl(i) {
  for (let t = i.length - 1; t >= 0; --t)
    if (i[t] >= 65535) return !0;
  return !1;
}
function $i(i) {
  return document.createElementNS("http://www.w3.org/1999/xhtml", i);
}
function lh() {
  const i = $i("canvas");
  return i.style.display = "block", i;
}
const Ka = {};
function Or(i) {
  i in Ka || (Ka[i] = !0, console.warn(i));
}
function ch(i, t, e) {
  return new Promise(function(n, r) {
    function s() {
      switch (i.clientWaitSync(t, i.SYNC_FLUSH_COMMANDS_BIT, 0)) {
        case i.WAIT_FAILED:
          r();
          break;
        case i.TIMEOUT_EXPIRED:
          setTimeout(s, e);
          break;
        default:
          n();
      }
    }
    setTimeout(s, e);
  });
}
function hh(i) {
  const t = i.elements;
  t[2] = 0.5 * t[2] + 0.5 * t[3], t[6] = 0.5 * t[6] + 0.5 * t[7], t[10] = 0.5 * t[10] + 0.5 * t[11], t[14] = 0.5 * t[14] + 0.5 * t[15];
}
function uh(i) {
  const t = i.elements;
  t[11] === -1 ? (t[10] = -t[10] - 1, t[14] = -t[14]) : (t[10] = -t[10], t[14] = -t[14] + 1);
}
const ja = /* @__PURE__ */ new Lt().set(
  0.4123908,
  0.3575843,
  0.1804808,
  0.212639,
  0.7151687,
  0.0721923,
  0.0193308,
  0.1191948,
  0.9505322
), Qa = /* @__PURE__ */ new Lt().set(
  3.2409699,
  -1.5373832,
  -0.4986108,
  -0.9692436,
  1.8759675,
  0.0415551,
  0.0556301,
  -0.203977,
  1.0569715
);
function dh() {
  const i = {
    enabled: !0,
    workingColorSpace: Mi,
    /**
     * Implementations of supported color spaces.
     *
     * Required:
     *	- primaries: chromaticity coordinates [ rx ry gx gy bx by ]
     *	- whitePoint: reference white [ x y ]
     *	- transfer: transfer function (pre-defined)
     *	- toXYZ: Matrix3 RGB to XYZ transform
     *	- fromXYZ: Matrix3 XYZ to RGB transform
     *	- luminanceCoefficients: RGB luminance coefficients
     *
     * Optional:
     *  - outputColorSpaceConfig: { drawingBufferColorSpace: ColorSpace }
     *  - workingColorSpaceConfig: { unpackColorSpace: ColorSpace }
     *
     * Reference:
     * - https://www.russellcottrell.com/photo/matrixCalculator.htm
     */
    spaces: {},
    convert: function(r, s, a) {
      return this.enabled === !1 || s === a || !s || !a || (this.spaces[s].transfer === Zt && (r.r = gn(r.r), r.g = gn(r.g), r.b = gn(r.b)), this.spaces[s].primaries !== this.spaces[a].primaries && (r.applyMatrix3(this.spaces[s].toXYZ), r.applyMatrix3(this.spaces[a].fromXYZ)), this.spaces[a].transfer === Zt && (r.r = gi(r.r), r.g = gi(r.g), r.b = gi(r.b))), r;
    },
    fromWorkingColorSpace: function(r, s) {
      return this.convert(r, this.workingColorSpace, s);
    },
    toWorkingColorSpace: function(r, s) {
      return this.convert(r, s, this.workingColorSpace);
    },
    getPrimaries: function(r) {
      return this.spaces[r].primaries;
    },
    getTransfer: function(r) {
      return r === fn ? Hr : this.spaces[r].transfer;
    },
    getLuminanceCoefficients: function(r, s = this.workingColorSpace) {
      return r.fromArray(this.spaces[s].luminanceCoefficients);
    },
    define: function(r) {
      Object.assign(this.spaces, r);
    },
    // Internal APIs
    _getMatrix: function(r, s, a) {
      return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ);
    },
    _getDrawingBufferColorSpace: function(r) {
      return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace;
    },
    _getUnpackColorSpace: function(r = this.workingColorSpace) {
      return this.spaces[r].workingColorSpaceConfig.unpackColorSpace;
    }
  }, t = [0.64, 0.33, 0.3, 0.6, 0.15, 0.06], e = [0.2126, 0.7152, 0.0722], n = [0.3127, 0.329];
  return i.define({
    [Mi]: {
      primaries: t,
      whitePoint: n,
      transfer: Hr,
      toXYZ: ja,
      fromXYZ: Qa,
      luminanceCoefficients: e,
      workingColorSpaceConfig: { unpackColorSpace: Se },
      outputColorSpaceConfig: { drawingBufferColorSpace: Se }
    },
    [Se]: {
      primaries: t,
      whitePoint: n,
      transfer: Zt,
      toXYZ: ja,
      fromXYZ: Qa,
      luminanceCoefficients: e,
      outputColorSpaceConfig: { drawingBufferColorSpace: Se }
    }
  }), i;
}
const Gt = /* @__PURE__ */ dh();
function gn(i) {
  return i < 0.04045 ? i * 0.0773993808 : Math.pow(i * 0.9478672986 + 0.0521327014, 2.4);
}
function gi(i) {
  return i < 31308e-7 ? i * 12.92 : 1.055 * Math.pow(i, 0.41666) - 0.055;
}
let jn;
class fh {
  /**
   * Returns a data URI containing a representation of the given image.
   *
   * @param {(HTMLImageElement|HTMLCanvasElement)} image - The image object.
   * @param {string} [type='image/png'] - Indicates the image format.
   * @return {string} The data URI.
   */
  static getDataURL(t, e = "image/png") {
    if (/^data:/i.test(t.src) || typeof HTMLCanvasElement > "u")
      return t.src;
    let n;
    if (t instanceof HTMLCanvasElement)
      n = t;
    else {
      jn === void 0 && (jn = $i("canvas")), jn.width = t.width, jn.height = t.height;
      const r = jn.getContext("2d");
      t instanceof ImageData ? r.putImageData(t, 0, 0) : r.drawImage(t, 0, 0, t.width, t.height), n = jn;
    }
    return n.toDataURL(e);
  }
  /**
   * Converts the given sRGB image data to linear color space.
   *
   * @param {(HTMLImageElement|HTMLCanvasElement|ImageBitmap|Object)} image - The image object.
   * @return {HTMLCanvasElement|Object} The converted image.
   */
  static sRGBToLinear(t) {
    if (typeof HTMLImageElement < "u" && t instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && t instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && t instanceof ImageBitmap) {
      const e = $i("canvas");
      e.width = t.width, e.height = t.height;
      const n = e.getContext("2d");
      n.drawImage(t, 0, 0, t.width, t.height);
      const r = n.getImageData(0, 0, t.width, t.height), s = r.data;
      for (let a = 0; a < s.length; a++)
        s[a] = gn(s[a] / 255) * 255;
      return n.putImageData(r, 0, 0), e;
    } else if (t.data) {
      const e = t.data.slice(0);
      for (let n = 0; n < e.length; n++)
        e instanceof Uint8Array || e instanceof Uint8ClampedArray ? e[n] = Math.floor(gn(e[n] / 255) * 255) : e[n] = gn(e[n]);
      return {
        data: e,
        width: t.width,
        height: t.height
      };
    } else
      return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), t;
  }
}
let ph = 0;
class Ra {
  /**
   * Constructs a new video texture.
   *
   * @param {any} [data=null] - The data definition of a texture.
   */
  constructor(t = null) {
    this.isSource = !0, Object.defineProperty(this, "id", { value: ph++ }), this.uuid = Ti(), this.data = t, this.dataReady = !0, this.version = 0;
  }
  /**
   * When the property is set to `true`, the engine allocates the memory
   * for the texture (if necessary) and triggers the actual texture upload
   * to the GPU next time the source is used.
   *
   * @type {boolean}
   * @default false
   * @param {boolean} value
   */
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
  /**
   * Serializes the source into JSON.
   *
   * @param {?(Object|string)} meta - An optional value holding meta information about the serialization.
   * @return {Object} A JSON object representing the serialized source.
   * @see {@link ObjectLoader#parse}
   */
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    if (!e && t.images[this.uuid] !== void 0)
      return t.images[this.uuid];
    const n = {
      uuid: this.uuid,
      url: ""
    }, r = this.data;
    if (r !== null) {
      let s;
      if (Array.isArray(r)) {
        s = [];
        for (let a = 0, o = r.length; a < o; a++)
          r[a].isDataTexture ? s.push(Qr(r[a].image)) : s.push(Qr(r[a]));
      } else
        s = Qr(r);
      n.url = s;
    }
    return e || (t.images[this.uuid] = n), n;
  }
}
function Qr(i) {
  return typeof HTMLImageElement < "u" && i instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && i instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && i instanceof ImageBitmap ? fh.getDataURL(i) : i.data ? {
    data: Array.from(i.data),
    width: i.width,
    height: i.height,
    type: i.data.constructor.name
  } : (console.warn("THREE.Texture: Unable to serialize Texture."), {});
}
let mh = 0;
class ge extends Ei {
  /**
   * Constructs a new texture.
   *
   * @param {?Object} [image=Texture.DEFAULT_IMAGE] - The image holding the texture data.
   * @param {number} [mapping=Texture.DEFAULT_MAPPING] - The texture mapping.
   * @param {number} [wrapS=ClampToEdgeWrapping] - The wrapS value.
   * @param {number} [wrapT=ClampToEdgeWrapping] - The wrapT value.
   * @param {number} [magFilter=LinearFilter] - The mag filter value.
   * @param {number} [minFilter=LinearMipmapLinearFilter] - The min filter value.
   * @param {number} [format=RGBAFormat] - The texture format.
   * @param {number} [type=UnsignedByteType] - The texture type.
   * @param {number} [anisotropy=Texture.DEFAULT_ANISOTROPY] - The anisotropy value.
   * @param {string} [colorSpace=NoColorSpace] - The color space.
   */
  constructor(t = ge.DEFAULT_IMAGE, e = ge.DEFAULT_MAPPING, n = Vn, r = Vn, s = ye, a = Gn, o = $e, l = nn, c = ge.DEFAULT_ANISOTROPY, h = fn) {
    super(), this.isTexture = !0, Object.defineProperty(this, "id", { value: mh++ }), this.uuid = Ti(), this.name = "", this.source = new Ra(t), this.mipmaps = [], this.mapping = e, this.channel = 0, this.wrapS = n, this.wrapT = r, this.magFilter = s, this.minFilter = a, this.anisotropy = c, this.format = o, this.internalFormat = null, this.type = l, this.offset = new mt(0, 0), this.repeat = new mt(1, 1), this.center = new mt(0, 0), this.rotation = 0, this.matrixAutoUpdate = !0, this.matrix = new Lt(), this.generateMipmaps = !0, this.premultiplyAlpha = !1, this.flipY = !0, this.unpackAlignment = 4, this.colorSpace = h, this.userData = {}, this.version = 0, this.onUpdate = null, this.renderTarget = null, this.isRenderTargetTexture = !1, this.isTextureArray = !1, this.pmremVersion = 0;
  }
  /**
   * The image object holding the texture data.
   *
   * @type {?Object}
   */
  get image() {
    return this.source.data;
  }
  set image(t = null) {
    this.source.data = t;
  }
  /**
   * Updates the texture transformation matrix from the from the properties {@link Texture#offset},
   * {@link Texture#repeat}, {@link Texture#rotation}, and {@link Texture#center}.
   */
  updateMatrix() {
    this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
  }
  /**
   * Returns a new texture with copied values from this instance.
   *
   * @return {Texture} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
  /**
   * Copies the values of the given texture to this instance.
   *
   * @param {Texture} source - The texture to copy.
   * @return {Texture} A reference to this instance.
   */
  copy(t) {
    return this.name = t.name, this.source = t.source, this.mipmaps = t.mipmaps.slice(0), this.mapping = t.mapping, this.channel = t.channel, this.wrapS = t.wrapS, this.wrapT = t.wrapT, this.magFilter = t.magFilter, this.minFilter = t.minFilter, this.anisotropy = t.anisotropy, this.format = t.format, this.internalFormat = t.internalFormat, this.type = t.type, this.offset.copy(t.offset), this.repeat.copy(t.repeat), this.center.copy(t.center), this.rotation = t.rotation, this.matrixAutoUpdate = t.matrixAutoUpdate, this.matrix.copy(t.matrix), this.generateMipmaps = t.generateMipmaps, this.premultiplyAlpha = t.premultiplyAlpha, this.flipY = t.flipY, this.unpackAlignment = t.unpackAlignment, this.colorSpace = t.colorSpace, this.renderTarget = t.renderTarget, this.isRenderTargetTexture = t.isRenderTargetTexture, this.isTextureArray = t.isTextureArray, this.userData = JSON.parse(JSON.stringify(t.userData)), this.needsUpdate = !0, this;
  }
  /**
   * Serializes the texture into JSON.
   *
   * @param {?(Object|string)} meta - An optional value holding meta information about the serialization.
   * @return {Object} A JSON object representing the serialized texture.
   * @see {@link ObjectLoader#parse}
   */
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    if (!e && t.textures[this.uuid] !== void 0)
      return t.textures[this.uuid];
    const n = {
      metadata: {
        version: 4.6,
        type: "Texture",
        generator: "Texture.toJSON"
      },
      uuid: this.uuid,
      name: this.name,
      image: this.source.toJSON(t).uuid,
      mapping: this.mapping,
      channel: this.channel,
      repeat: [this.repeat.x, this.repeat.y],
      offset: [this.offset.x, this.offset.y],
      center: [this.center.x, this.center.y],
      rotation: this.rotation,
      wrap: [this.wrapS, this.wrapT],
      format: this.format,
      internalFormat: this.internalFormat,
      type: this.type,
      colorSpace: this.colorSpace,
      minFilter: this.minFilter,
      magFilter: this.magFilter,
      anisotropy: this.anisotropy,
      flipY: this.flipY,
      generateMipmaps: this.generateMipmaps,
      premultiplyAlpha: this.premultiplyAlpha,
      unpackAlignment: this.unpackAlignment
    };
    return Object.keys(this.userData).length > 0 && (n.userData = this.userData), e || (t.textures[this.uuid] = n), n;
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever this instance is no longer used in your app.
   *
   * @fires Texture#dispose
   */
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  /**
   * Transforms the given uv vector with the textures uv transformation matrix.
   *
   * @param {Vector2} uv - The uv vector.
   * @return {Vector2} The transformed uv vector.
   */
  transformUv(t) {
    if (this.mapping !== Ml) return t;
    if (t.applyMatrix3(this.matrix), t.x < 0 || t.x > 1)
      switch (this.wrapS) {
        case Xn:
          t.x = t.x - Math.floor(t.x);
          break;
        case Vn:
          t.x = t.x < 0 ? 0 : 1;
          break;
        case Gs:
          Math.abs(Math.floor(t.x) % 2) === 1 ? t.x = Math.ceil(t.x) - t.x : t.x = t.x - Math.floor(t.x);
          break;
      }
    if (t.y < 0 || t.y > 1)
      switch (this.wrapT) {
        case Xn:
          t.y = t.y - Math.floor(t.y);
          break;
        case Vn:
          t.y = t.y < 0 ? 0 : 1;
          break;
        case Gs:
          Math.abs(Math.floor(t.y) % 2) === 1 ? t.y = Math.ceil(t.y) - t.y : t.y = t.y - Math.floor(t.y);
          break;
      }
    return this.flipY && (t.y = 1 - t.y), t;
  }
  /**
   * Setting this property to `true` indicates the engine the texture
   * must be updated in the next render. This triggers a texture upload
   * to the GPU and ensures correct texture parameter configuration.
   *
   * @type {boolean}
   * @default false
   * @param {boolean} value
   */
  set needsUpdate(t) {
    t === !0 && (this.version++, this.source.needsUpdate = !0);
  }
  /**
   * Setting this property to `true` indicates the engine the PMREM
   * must be regenerated.
   *
   * @type {boolean}
   * @default false
   * @param {boolean} value
   */
  set needsPMREMUpdate(t) {
    t === !0 && this.pmremVersion++;
  }
}
ge.DEFAULT_IMAGE = null;
ge.DEFAULT_MAPPING = Ml;
ge.DEFAULT_ANISOTROPY = 1;
class se {
  /**
   * Constructs a new 4D vector.
   *
   * @param {number} [x=0] - The x value of this vector.
   * @param {number} [y=0] - The y value of this vector.
   * @param {number} [z=0] - The z value of this vector.
   * @param {number} [w=1] - The w value of this vector.
   */
  constructor(t = 0, e = 0, n = 0, r = 1) {
    se.prototype.isVector4 = !0, this.x = t, this.y = e, this.z = n, this.w = r;
  }
  /**
   * Alias for {@link Vector4#z}.
   *
   * @type {number}
   */
  get width() {
    return this.z;
  }
  set width(t) {
    this.z = t;
  }
  /**
   * Alias for {@link Vector4#w}.
   *
   * @type {number}
   */
  get height() {
    return this.w;
  }
  set height(t) {
    this.w = t;
  }
  /**
   * Sets the vector components.
   *
   * @param {number} x - The value of the x component.
   * @param {number} y - The value of the y component.
   * @param {number} z - The value of the z component.
   * @param {number} w - The value of the w component.
   * @return {Vector4} A reference to this vector.
   */
  set(t, e, n, r) {
    return this.x = t, this.y = e, this.z = n, this.w = r, this;
  }
  /**
   * Sets the vector components to the same value.
   *
   * @param {number} scalar - The value to set for all vector components.
   * @return {Vector4} A reference to this vector.
   */
  setScalar(t) {
    return this.x = t, this.y = t, this.z = t, this.w = t, this;
  }
  /**
   * Sets the vector's x component to the given value
   *
   * @param {number} x - The value to set.
   * @return {Vector4} A reference to this vector.
   */
  setX(t) {
    return this.x = t, this;
  }
  /**
   * Sets the vector's y component to the given value
   *
   * @param {number} y - The value to set.
   * @return {Vector4} A reference to this vector.
   */
  setY(t) {
    return this.y = t, this;
  }
  /**
   * Sets the vector's z component to the given value
   *
   * @param {number} z - The value to set.
   * @return {Vector4} A reference to this vector.
   */
  setZ(t) {
    return this.z = t, this;
  }
  /**
   * Sets the vector's w component to the given value
   *
   * @param {number} w - The value to set.
   * @return {Vector4} A reference to this vector.
   */
  setW(t) {
    return this.w = t, this;
  }
  /**
   * Allows to set a vector component with an index.
   *
   * @param {number} index - The component index. `0` equals to x, `1` equals to y,
   * `2` equals to z, `3` equals to w.
   * @param {number} value - The value to set.
   * @return {Vector4} A reference to this vector.
   */
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      case 2:
        this.z = e;
        break;
      case 3:
        this.w = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  /**
   * Returns the value of the vector component which matches the given index.
   *
   * @param {number} index - The component index. `0` equals to x, `1` equals to y,
   * `2` equals to z, `3` equals to w.
   * @return {number} A vector component value.
   */
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  /**
   * Returns a new vector with copied values from this instance.
   *
   * @return {Vector4} A clone of this instance.
   */
  clone() {
    return new this.constructor(this.x, this.y, this.z, this.w);
  }
  /**
   * Copies the values of the given vector to this instance.
   *
   * @param {Vector3|Vector4} v - The vector to copy.
   * @return {Vector4} A reference to this vector.
   */
  copy(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this.w = t.w !== void 0 ? t.w : 1, this;
  }
  /**
   * Adds the given vector to this instance.
   *
   * @param {Vector4} v - The vector to add.
   * @return {Vector4} A reference to this vector.
   */
  add(t) {
    return this.x += t.x, this.y += t.y, this.z += t.z, this.w += t.w, this;
  }
  /**
   * Adds the given scalar value to all components of this instance.
   *
   * @param {number} s - The scalar to add.
   * @return {Vector4} A reference to this vector.
   */
  addScalar(t) {
    return this.x += t, this.y += t, this.z += t, this.w += t, this;
  }
  /**
   * Adds the given vectors and stores the result in this instance.
   *
   * @param {Vector4} a - The first vector.
   * @param {Vector4} b - The second vector.
   * @return {Vector4} A reference to this vector.
   */
  addVectors(t, e) {
    return this.x = t.x + e.x, this.y = t.y + e.y, this.z = t.z + e.z, this.w = t.w + e.w, this;
  }
  /**
   * Adds the given vector scaled by the given factor to this instance.
   *
   * @param {Vector4} v - The vector.
   * @param {number} s - The factor that scales `v`.
   * @return {Vector4} A reference to this vector.
   */
  addScaledVector(t, e) {
    return this.x += t.x * e, this.y += t.y * e, this.z += t.z * e, this.w += t.w * e, this;
  }
  /**
   * Subtracts the given vector from this instance.
   *
   * @param {Vector4} v - The vector to subtract.
   * @return {Vector4} A reference to this vector.
   */
  sub(t) {
    return this.x -= t.x, this.y -= t.y, this.z -= t.z, this.w -= t.w, this;
  }
  /**
   * Subtracts the given scalar value from all components of this instance.
   *
   * @param {number} s - The scalar to subtract.
   * @return {Vector4} A reference to this vector.
   */
  subScalar(t) {
    return this.x -= t, this.y -= t, this.z -= t, this.w -= t, this;
  }
  /**
   * Subtracts the given vectors and stores the result in this instance.
   *
   * @param {Vector4} a - The first vector.
   * @param {Vector4} b - The second vector.
   * @return {Vector4} A reference to this vector.
   */
  subVectors(t, e) {
    return this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this.w = t.w - e.w, this;
  }
  /**
   * Multiplies the given vector with this instance.
   *
   * @param {Vector4} v - The vector to multiply.
   * @return {Vector4} A reference to this vector.
   */
  multiply(t) {
    return this.x *= t.x, this.y *= t.y, this.z *= t.z, this.w *= t.w, this;
  }
  /**
   * Multiplies the given scalar value with all components of this instance.
   *
   * @param {number} scalar - The scalar to multiply.
   * @return {Vector4} A reference to this vector.
   */
  multiplyScalar(t) {
    return this.x *= t, this.y *= t, this.z *= t, this.w *= t, this;
  }
  /**
   * Multiplies this vector with the given 4x4 matrix.
   *
   * @param {Matrix4} m - The 4x4 matrix.
   * @return {Vector4} A reference to this vector.
   */
  applyMatrix4(t) {
    const e = this.x, n = this.y, r = this.z, s = this.w, a = t.elements;
    return this.x = a[0] * e + a[4] * n + a[8] * r + a[12] * s, this.y = a[1] * e + a[5] * n + a[9] * r + a[13] * s, this.z = a[2] * e + a[6] * n + a[10] * r + a[14] * s, this.w = a[3] * e + a[7] * n + a[11] * r + a[15] * s, this;
  }
  /**
   * Divides this instance by the given vector.
   *
   * @param {Vector4} v - The vector to divide.
   * @return {Vector4} A reference to this vector.
   */
  divide(t) {
    return this.x /= t.x, this.y /= t.y, this.z /= t.z, this.w /= t.w, this;
  }
  /**
   * Divides this vector by the given scalar.
   *
   * @param {number} scalar - The scalar to divide.
   * @return {Vector4} A reference to this vector.
   */
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  /**
   * Sets the x, y and z components of this
   * vector to the quaternion's axis and w to the angle.
   *
   * @param {Quaternion} q - The Quaternion to set.
   * @return {Vector4} A reference to this vector.
   */
  setAxisAngleFromQuaternion(t) {
    this.w = 2 * Math.acos(t.w);
    const e = Math.sqrt(1 - t.w * t.w);
    return e < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = t.x / e, this.y = t.y / e, this.z = t.z / e), this;
  }
  /**
   * Sets the x, y and z components of this
   * vector to the axis of rotation and w to the angle.
   *
   * @param {Matrix4} m - A 4x4 matrix of which the upper left 3x3 matrix is a pure rotation matrix.
   * @return {Vector4} A reference to this vector.
   */
  setAxisAngleFromRotationMatrix(t) {
    let e, n, r, s;
    const l = t.elements, c = l[0], h = l[4], u = l[8], f = l[1], d = l[5], g = l[9], v = l[2], m = l[6], p = l[10];
    if (Math.abs(h - f) < 0.01 && Math.abs(u - v) < 0.01 && Math.abs(g - m) < 0.01) {
      if (Math.abs(h + f) < 0.1 && Math.abs(u + v) < 0.1 && Math.abs(g + m) < 0.1 && Math.abs(c + d + p - 3) < 0.1)
        return this.set(1, 0, 0, 0), this;
      e = Math.PI;
      const T = (c + 1) / 2, S = (d + 1) / 2, N = (p + 1) / 2, w = (h + f) / 4, R = (u + v) / 4, U = (g + m) / 4;
      return T > S && T > N ? T < 0.01 ? (n = 0, r = 0.707106781, s = 0.707106781) : (n = Math.sqrt(T), r = w / n, s = R / n) : S > N ? S < 0.01 ? (n = 0.707106781, r = 0, s = 0.707106781) : (r = Math.sqrt(S), n = w / r, s = U / r) : N < 0.01 ? (n = 0.707106781, r = 0.707106781, s = 0) : (s = Math.sqrt(N), n = R / s, r = U / s), this.set(n, r, s, e), this;
    }
    let A = Math.sqrt((m - g) * (m - g) + (u - v) * (u - v) + (f - h) * (f - h));
    return Math.abs(A) < 1e-3 && (A = 1), this.x = (m - g) / A, this.y = (u - v) / A, this.z = (f - h) / A, this.w = Math.acos((c + d + p - 1) / 2), this;
  }
  /**
   * Sets the vector components to the position elements of the
   * given transformation matrix.
   *
   * @param {Matrix4} m - The 4x4 matrix.
   * @return {Vector4} A reference to this vector.
   */
  setFromMatrixPosition(t) {
    const e = t.elements;
    return this.x = e[12], this.y = e[13], this.z = e[14], this.w = e[15], this;
  }
  /**
   * If this vector's x, y, z or w value is greater than the given vector's x, y, z or w
   * value, replace that value with the corresponding min value.
   *
   * @param {Vector4} v - The vector.
   * @return {Vector4} A reference to this vector.
   */
  min(t) {
    return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this.z = Math.min(this.z, t.z), this.w = Math.min(this.w, t.w), this;
  }
  /**
   * If this vector's x, y, z or w value is less than the given vector's x, y, z or w
   * value, replace that value with the corresponding max value.
   *
   * @param {Vector4} v - The vector.
   * @return {Vector4} A reference to this vector.
   */
  max(t) {
    return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this.z = Math.max(this.z, t.z), this.w = Math.max(this.w, t.w), this;
  }
  /**
   * If this vector's x, y, z or w value is greater than the max vector's x, y, z or w
   * value, it is replaced by the corresponding value.
   * If this vector's x, y, z or w value is less than the min vector's x, y, z or w value,
   * it is replaced by the corresponding value.
   *
   * @param {Vector4} min - The minimum x, y and z values.
   * @param {Vector4} max - The maximum x, y and z values in the desired range.
   * @return {Vector4} A reference to this vector.
   */
  clamp(t, e) {
    return this.x = Nt(this.x, t.x, e.x), this.y = Nt(this.y, t.y, e.y), this.z = Nt(this.z, t.z, e.z), this.w = Nt(this.w, t.w, e.w), this;
  }
  /**
   * If this vector's x, y, z or w values are greater than the max value, they are
   * replaced by the max value.
   * If this vector's x, y, z or w values are less than the min value, they are
   * replaced by the min value.
   *
   * @param {number} minVal - The minimum value the components will be clamped to.
   * @param {number} maxVal - The maximum value the components will be clamped to.
   * @return {Vector4} A reference to this vector.
   */
  clampScalar(t, e) {
    return this.x = Nt(this.x, t, e), this.y = Nt(this.y, t, e), this.z = Nt(this.z, t, e), this.w = Nt(this.w, t, e), this;
  }
  /**
   * If this vector's length is greater than the max value, it is replaced by
   * the max value.
   * If this vector's length is less than the min value, it is replaced by the
   * min value.
   *
   * @param {number} min - The minimum value the vector length will be clamped to.
   * @param {number} max - The maximum value the vector length will be clamped to.
   * @return {Vector4} A reference to this vector.
   */
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Nt(n, t, e));
  }
  /**
   * The components of this vector are rounded down to the nearest integer value.
   *
   * @return {Vector4} A reference to this vector.
   */
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
  }
  /**
   * The components of this vector are rounded up to the nearest integer value.
   *
   * @return {Vector4} A reference to this vector.
   */
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
  }
  /**
   * The components of this vector are rounded to the nearest integer value
   *
   * @return {Vector4} A reference to this vector.
   */
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
  }
  /**
   * The components of this vector are rounded towards zero (up if negative,
   * down if positive) to an integer value.
   *
   * @return {Vector4} A reference to this vector.
   */
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this;
  }
  /**
   * Inverts this vector - i.e. sets x = -x, y = -y, z = -z, w = -w.
   *
   * @return {Vector4} A reference to this vector.
   */
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
  }
  /**
   * Calculates the dot product of the given vector with this instance.
   *
   * @param {Vector4} v - The vector to compute the dot product with.
   * @return {number} The result of the dot product.
   */
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z + this.w * t.w;
  }
  /**
   * Computes the square of the Euclidean length (straight-line length) from
   * (0, 0, 0, 0) to (x, y, z, w). If you are comparing the lengths of vectors, you should
   * compare the length squared instead as it is slightly more efficient to calculate.
   *
   * @return {number} The square length of this vector.
   */
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }
  /**
   * Computes the  Euclidean length (straight-line length) from (0, 0, 0, 0) to (x, y, z, w).
   *
   * @return {number} The length of this vector.
   */
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  /**
   * Computes the Manhattan length of this vector.
   *
   * @return {number} The length of this vector.
   */
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
  }
  /**
   * Converts this vector to a unit vector - that is, sets it equal to a vector
   * with the same direction as this one, but with a vector length of `1`.
   *
   * @return {Vector4} A reference to this vector.
   */
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  /**
   * Sets this vector to a vector with the same direction as this one, but
   * with the specified length.
   *
   * @param {number} length - The new length of this vector.
   * @return {Vector4} A reference to this vector.
   */
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  /**
   * Linearly interpolates between the given vector and this instance, where
   * alpha is the percent distance along the line - alpha = 0 will be this
   * vector, and alpha = 1 will be the given one.
   *
   * @param {Vector4} v - The vector to interpolate towards.
   * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
   * @return {Vector4} A reference to this vector.
   */
  lerp(t, e) {
    return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this.z += (t.z - this.z) * e, this.w += (t.w - this.w) * e, this;
  }
  /**
   * Linearly interpolates between the given vectors, where alpha is the percent
   * distance along the line - alpha = 0 will be first vector, and alpha = 1 will
   * be the second one. The result is stored in this instance.
   *
   * @param {Vector4} v1 - The first vector.
   * @param {Vector4} v2 - The second vector.
   * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
   * @return {Vector4} A reference to this vector.
   */
  lerpVectors(t, e, n) {
    return this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this.z = t.z + (e.z - t.z) * n, this.w = t.w + (e.w - t.w) * n, this;
  }
  /**
   * Returns `true` if this vector is equal with the given one.
   *
   * @param {Vector4} v - The vector to test for equality.
   * @return {boolean} Whether this vector is equal with the given one.
   */
  equals(t) {
    return t.x === this.x && t.y === this.y && t.z === this.z && t.w === this.w;
  }
  /**
   * Sets this vector's x value to be `array[ offset ]`, y value to be `array[ offset + 1 ]`,
   * z value to be `array[ offset + 2 ]`, w value to be `array[ offset + 3 ]`.
   *
   * @param {Array<number>} array - An array holding the vector component values.
   * @param {number} [offset=0] - The offset into the array.
   * @return {Vector4} A reference to this vector.
   */
  fromArray(t, e = 0) {
    return this.x = t[e], this.y = t[e + 1], this.z = t[e + 2], this.w = t[e + 3], this;
  }
  /**
   * Writes the components of this vector to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number>} [array=[]] - The target array holding the vector components.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number>} The vector components.
   */
  toArray(t = [], e = 0) {
    return t[e] = this.x, t[e + 1] = this.y, t[e + 2] = this.z, t[e + 3] = this.w, t;
  }
  /**
   * Sets the components of this vector from the given buffer attribute.
   *
   * @param {BufferAttribute} attribute - The buffer attribute holding vector data.
   * @param {number} index - The index into the attribute.
   * @return {Vector4} A reference to this vector.
   */
  fromBufferAttribute(t, e) {
    return this.x = t.getX(e), this.y = t.getY(e), this.z = t.getZ(e), this.w = t.getW(e), this;
  }
  /**
   * Sets each component of this vector to a pseudo-random value between `0` and
   * `1`, excluding `1`.
   *
   * @return {Vector4} A reference to this vector.
   */
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z, yield this.w;
  }
}
class gh extends Ei {
  /**
   * Render target options.
   *
   * @typedef {Object} RenderTarget~Options
   * @property {boolean} [generateMipmaps=false] - Whether to generate mipmaps or not.
   * @property {number} [magFilter=LinearFilter] - The mag filter.
   * @property {number} [minFilter=LinearFilter] - The min filter.
   * @property {number} [format=RGBAFormat] - The texture format.
   * @property {number} [type=UnsignedByteType] - The texture type.
   * @property {?string} [internalFormat=null] - The texture's internal format.
   * @property {number} [wrapS=ClampToEdgeWrapping] - The texture's uv wrapping mode.
   * @property {number} [wrapT=ClampToEdgeWrapping] - The texture's uv wrapping mode.
   * @property {number} [anisotropy=1] - The texture's anisotropy value.
   * @property {string} [colorSpace=NoColorSpace] - The texture's color space.
   * @property {boolean} [depthBuffer=true] - Whether to allocate a depth buffer or not.
   * @property {boolean} [stencilBuffer=false] - Whether to allocate a stencil buffer or not.
   * @property {boolean} [resolveDepthBuffer=true] - Whether to resolve the depth buffer or not.
   * @property {boolean} [resolveStencilBuffer=true] - Whether  to resolve the stencil buffer or not.
   * @property {?Texture} [depthTexture=null] - Reference to a depth texture.
   * @property {number} [samples=0] - The MSAA samples count.
   * @property {number} [count=1] - Defines the number of color attachments . Must be at least `1`.
   * @property {boolean} [multiview=false] - Whether this target is used for multiview rendering.
   */
  /**
   * Constructs a new render target.
   *
   * @param {number} [width=1] - The width of the render target.
   * @param {number} [height=1] - The height of the render target.
   * @param {RenderTarget~Options} [options] - The configuration object.
   */
  constructor(t = 1, e = 1, n = {}) {
    super(), this.isRenderTarget = !0, this.width = t, this.height = e, this.depth = n.depth ? n.depth : 1, this.scissor = new se(0, 0, t, e), this.scissorTest = !1, this.viewport = new se(0, 0, t, e);
    const r = { width: t, height: e, depth: this.depth };
    n = Object.assign({
      generateMipmaps: !1,
      internalFormat: null,
      minFilter: ye,
      depthBuffer: !0,
      stencilBuffer: !1,
      resolveDepthBuffer: !0,
      resolveStencilBuffer: !0,
      depthTexture: null,
      samples: 0,
      count: 1,
      multiview: !1
    }, n);
    const s = new ge(r, n.mapping, n.wrapS, n.wrapT, n.magFilter, n.minFilter, n.format, n.type, n.anisotropy, n.colorSpace);
    s.flipY = !1, s.generateMipmaps = n.generateMipmaps, s.internalFormat = n.internalFormat, this.textures = [];
    const a = n.count;
    for (let o = 0; o < a; o++)
      this.textures[o] = s.clone(), this.textures[o].isRenderTargetTexture = !0, this.textures[o].renderTarget = this;
    this.depthBuffer = n.depthBuffer, this.stencilBuffer = n.stencilBuffer, this.resolveDepthBuffer = n.resolveDepthBuffer, this.resolveStencilBuffer = n.resolveStencilBuffer, this._depthTexture = null, this.depthTexture = n.depthTexture, this.samples = n.samples, this.multiview = n.multiview;
  }
  /**
   * The texture representing the default color attachment.
   *
   * @type {Texture}
   */
  get texture() {
    return this.textures[0];
  }
  set texture(t) {
    this.textures[0] = t;
  }
  set depthTexture(t) {
    this._depthTexture !== null && (this._depthTexture.renderTarget = null), t !== null && (t.renderTarget = this), this._depthTexture = t;
  }
  /**
   * Instead of saving the depth in a renderbuffer, a texture
   * can be used instead which is useful for further processing
   * e.g. in context of post-processing.
   *
   * @type {?DepthTexture}
   * @default null
   */
  get depthTexture() {
    return this._depthTexture;
  }
  /**
   * Sets the size of this render target.
   *
   * @param {number} width - The width.
   * @param {number} height - The height.
   * @param {number} [depth=1] - The depth.
   */
  setSize(t, e, n = 1) {
    if (this.width !== t || this.height !== e || this.depth !== n) {
      this.width = t, this.height = e, this.depth = n;
      for (let r = 0, s = this.textures.length; r < s; r++)
        this.textures[r].image.width = t, this.textures[r].image.height = e, this.textures[r].image.depth = n;
      this.dispose();
    }
    this.viewport.set(0, 0, t, e), this.scissor.set(0, 0, t, e);
  }
  /**
   * Returns a new render target with copied values from this instance.
   *
   * @return {RenderTarget} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
  /**
   * Copies the settings of the given render target. This is a structural copy so
   * no resources are shared between render targets after the copy. That includes
   * all MRT textures and the depth texture.
   *
   * @param {RenderTarget} source - The render target to copy.
   * @return {RenderTarget} A reference to this instance.
   */
  copy(t) {
    this.width = t.width, this.height = t.height, this.depth = t.depth, this.scissor.copy(t.scissor), this.scissorTest = t.scissorTest, this.viewport.copy(t.viewport), this.textures.length = 0;
    for (let e = 0, n = t.textures.length; e < n; e++) {
      this.textures[e] = t.textures[e].clone(), this.textures[e].isRenderTargetTexture = !0, this.textures[e].renderTarget = this;
      const r = Object.assign({}, t.textures[e].image);
      this.textures[e].source = new Ra(r);
    }
    return this.depthBuffer = t.depthBuffer, this.stencilBuffer = t.stencilBuffer, this.resolveDepthBuffer = t.resolveDepthBuffer, this.resolveStencilBuffer = t.resolveStencilBuffer, t.depthTexture !== null && (this.depthTexture = t.depthTexture.clone()), this.samples = t.samples, this;
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever this instance is no longer used in your app.
   *
   * @fires RenderTarget#dispose
   */
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
class Yn extends gh {
  /**
   * Constructs a new 3D render target.
   *
   * @param {number} [width=1] - The width of the render target.
   * @param {number} [height=1] - The height of the render target.
   * @param {RenderTarget~Options} [options] - The configuration object.
   */
  constructor(t = 1, e = 1, n = {}) {
    super(t, e, n), this.isWebGLRenderTarget = !0;
  }
}
class Ll extends ge {
  /**
   * Constructs a new data array texture.
   *
   * @param {?TypedArray} [data=null] - The buffer data.
   * @param {number} [width=1] - The width of the texture.
   * @param {number} [height=1] - The height of the texture.
   * @param {number} [depth=1] - The depth of the texture.
   */
  constructor(t = null, e = 1, n = 1, r = 1) {
    super(null), this.isDataArrayTexture = !0, this.image = { data: t, width: e, height: n, depth: r }, this.magFilter = Ue, this.minFilter = Ue, this.wrapR = Vn, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1, this.layerUpdates = /* @__PURE__ */ new Set();
  }
  /**
   * Describes that a specific layer of the texture needs to be updated.
   * Normally when {@link Texture#needsUpdate} is set to `true`, the
   * entire data texture array is sent to the GPU. Marking specific
   * layers will only transmit subsets of all mipmaps associated with a
   * specific depth in the array which is often much more performant.
   *
   * @param {number} layerIndex - The layer index that should be updated.
   */
  addLayerUpdate(t) {
    this.layerUpdates.add(t);
  }
  /**
   * Resets the layer updates registry.
   */
  clearLayerUpdates() {
    this.layerUpdates.clear();
  }
}
class _h extends ge {
  /**
   * Constructs a new data array texture.
   *
   * @param {?TypedArray} [data=null] - The buffer data.
   * @param {number} [width=1] - The width of the texture.
   * @param {number} [height=1] - The height of the texture.
   * @param {number} [depth=1] - The depth of the texture.
   */
  constructor(t = null, e = 1, n = 1, r = 1) {
    super(null), this.isData3DTexture = !0, this.image = { data: t, width: e, height: n, depth: r }, this.magFilter = Ue, this.minFilter = Ue, this.wrapR = Vn, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
  }
}
class Ai {
  /**
   * Constructs a new quaternion.
   *
   * @param {number} [x=0] - The x value of this quaternion.
   * @param {number} [y=0] - The y value of this quaternion.
   * @param {number} [z=0] - The z value of this quaternion.
   * @param {number} [w=1] - The w value of this quaternion.
   */
  constructor(t = 0, e = 0, n = 0, r = 1) {
    this.isQuaternion = !0, this._x = t, this._y = e, this._z = n, this._w = r;
  }
  /**
   * Interpolates between two quaternions via SLERP. This implementation assumes the
   * quaternion data are managed  in flat arrays.
   *
   * @param {Array<number>} dst - The destination array.
   * @param {number} dstOffset - An offset into the destination array.
   * @param {Array<number>} src0 - The source array of the first quaternion.
   * @param {number} srcOffset0 - An offset into the first source array.
   * @param {Array<number>} src1 -  The source array of the second quaternion.
   * @param {number} srcOffset1 - An offset into the second source array.
   * @param {number} t - The interpolation factor in the range `[0,1]`.
   * @see {@link Quaternion#slerp}
   */
  static slerpFlat(t, e, n, r, s, a, o) {
    let l = n[r + 0], c = n[r + 1], h = n[r + 2], u = n[r + 3];
    const f = s[a + 0], d = s[a + 1], g = s[a + 2], v = s[a + 3];
    if (o === 0) {
      t[e + 0] = l, t[e + 1] = c, t[e + 2] = h, t[e + 3] = u;
      return;
    }
    if (o === 1) {
      t[e + 0] = f, t[e + 1] = d, t[e + 2] = g, t[e + 3] = v;
      return;
    }
    if (u !== v || l !== f || c !== d || h !== g) {
      let m = 1 - o;
      const p = l * f + c * d + h * g + u * v, A = p >= 0 ? 1 : -1, T = 1 - p * p;
      if (T > Number.EPSILON) {
        const N = Math.sqrt(T), w = Math.atan2(N, p * A);
        m = Math.sin(m * w) / N, o = Math.sin(o * w) / N;
      }
      const S = o * A;
      if (l = l * m + f * S, c = c * m + d * S, h = h * m + g * S, u = u * m + v * S, m === 1 - o) {
        const N = 1 / Math.sqrt(l * l + c * c + h * h + u * u);
        l *= N, c *= N, h *= N, u *= N;
      }
    }
    t[e] = l, t[e + 1] = c, t[e + 2] = h, t[e + 3] = u;
  }
  /**
   * Multiplies two quaternions. This implementation assumes the quaternion data are managed
   * in flat arrays.
   *
   * @param {Array<number>} dst - The destination array.
   * @param {number} dstOffset - An offset into the destination array.
   * @param {Array<number>} src0 - The source array of the first quaternion.
   * @param {number} srcOffset0 - An offset into the first source array.
   * @param {Array<number>} src1 -  The source array of the second quaternion.
   * @param {number} srcOffset1 - An offset into the second source array.
   * @return {Array<number>} The destination array.
   * @see {@link Quaternion#multiplyQuaternions}.
   */
  static multiplyQuaternionsFlat(t, e, n, r, s, a) {
    const o = n[r], l = n[r + 1], c = n[r + 2], h = n[r + 3], u = s[a], f = s[a + 1], d = s[a + 2], g = s[a + 3];
    return t[e] = o * g + h * u + l * d - c * f, t[e + 1] = l * g + h * f + c * u - o * d, t[e + 2] = c * g + h * d + o * f - l * u, t[e + 3] = h * g - o * u - l * f - c * d, t;
  }
  /**
   * The x value of this quaternion.
   *
   * @type {number}
   * @default 0
   */
  get x() {
    return this._x;
  }
  set x(t) {
    this._x = t, this._onChangeCallback();
  }
  /**
   * The y value of this quaternion.
   *
   * @type {number}
   * @default 0
   */
  get y() {
    return this._y;
  }
  set y(t) {
    this._y = t, this._onChangeCallback();
  }
  /**
   * The z value of this quaternion.
   *
   * @type {number}
   * @default 0
   */
  get z() {
    return this._z;
  }
  set z(t) {
    this._z = t, this._onChangeCallback();
  }
  /**
   * The w value of this quaternion.
   *
   * @type {number}
   * @default 1
   */
  get w() {
    return this._w;
  }
  set w(t) {
    this._w = t, this._onChangeCallback();
  }
  /**
   * Sets the quaternion components.
   *
   * @param {number} x - The x value of this quaternion.
   * @param {number} y - The y value of this quaternion.
   * @param {number} z - The z value of this quaternion.
   * @param {number} w - The w value of this quaternion.
   * @return {Quaternion} A reference to this quaternion.
   */
  set(t, e, n, r) {
    return this._x = t, this._y = e, this._z = n, this._w = r, this._onChangeCallback(), this;
  }
  /**
   * Returns a new quaternion with copied values from this instance.
   *
   * @return {Quaternion} A clone of this instance.
   */
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._w);
  }
  /**
   * Copies the values of the given quaternion to this instance.
   *
   * @param {Quaternion} quaternion - The quaternion to copy.
   * @return {Quaternion} A reference to this quaternion.
   */
  copy(t) {
    return this._x = t.x, this._y = t.y, this._z = t.z, this._w = t.w, this._onChangeCallback(), this;
  }
  /**
   * Sets this quaternion from the rotation specified by the given
   * Euler angles.
   *
   * @param {Euler} euler - The Euler angles.
   * @param {boolean} [update=true] - Whether the internal `onChange` callback should be executed or not.
   * @return {Quaternion} A reference to this quaternion.
   */
  setFromEuler(t, e = !0) {
    const n = t._x, r = t._y, s = t._z, a = t._order, o = Math.cos, l = Math.sin, c = o(n / 2), h = o(r / 2), u = o(s / 2), f = l(n / 2), d = l(r / 2), g = l(s / 2);
    switch (a) {
      case "XYZ":
        this._x = f * h * u + c * d * g, this._y = c * d * u - f * h * g, this._z = c * h * g + f * d * u, this._w = c * h * u - f * d * g;
        break;
      case "YXZ":
        this._x = f * h * u + c * d * g, this._y = c * d * u - f * h * g, this._z = c * h * g - f * d * u, this._w = c * h * u + f * d * g;
        break;
      case "ZXY":
        this._x = f * h * u - c * d * g, this._y = c * d * u + f * h * g, this._z = c * h * g + f * d * u, this._w = c * h * u - f * d * g;
        break;
      case "ZYX":
        this._x = f * h * u - c * d * g, this._y = c * d * u + f * h * g, this._z = c * h * g - f * d * u, this._w = c * h * u + f * d * g;
        break;
      case "YZX":
        this._x = f * h * u + c * d * g, this._y = c * d * u + f * h * g, this._z = c * h * g - f * d * u, this._w = c * h * u - f * d * g;
        break;
      case "XZY":
        this._x = f * h * u - c * d * g, this._y = c * d * u - f * h * g, this._z = c * h * g + f * d * u, this._w = c * h * u + f * d * g;
        break;
      default:
        console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + a);
    }
    return e === !0 && this._onChangeCallback(), this;
  }
  /**
   * Sets this quaternion from the given axis and angle.
   *
   * @param {Vector3} axis - The normalized axis.
   * @param {number} angle - The angle in radians.
   * @return {Quaternion} A reference to this quaternion.
   */
  setFromAxisAngle(t, e) {
    const n = e / 2, r = Math.sin(n);
    return this._x = t.x * r, this._y = t.y * r, this._z = t.z * r, this._w = Math.cos(n), this._onChangeCallback(), this;
  }
  /**
   * Sets this quaternion from the given rotation matrix.
   *
   * @param {Matrix4} m - A 4x4 matrix of which the upper 3x3 of matrix is a pure rotation matrix (i.e. unscaled).
   * @return {Quaternion} A reference to this quaternion.
   */
  setFromRotationMatrix(t) {
    const e = t.elements, n = e[0], r = e[4], s = e[8], a = e[1], o = e[5], l = e[9], c = e[2], h = e[6], u = e[10], f = n + o + u;
    if (f > 0) {
      const d = 0.5 / Math.sqrt(f + 1);
      this._w = 0.25 / d, this._x = (h - l) * d, this._y = (s - c) * d, this._z = (a - r) * d;
    } else if (n > o && n > u) {
      const d = 2 * Math.sqrt(1 + n - o - u);
      this._w = (h - l) / d, this._x = 0.25 * d, this._y = (r + a) / d, this._z = (s + c) / d;
    } else if (o > u) {
      const d = 2 * Math.sqrt(1 + o - n - u);
      this._w = (s - c) / d, this._x = (r + a) / d, this._y = 0.25 * d, this._z = (l + h) / d;
    } else {
      const d = 2 * Math.sqrt(1 + u - n - o);
      this._w = (a - r) / d, this._x = (s + c) / d, this._y = (l + h) / d, this._z = 0.25 * d;
    }
    return this._onChangeCallback(), this;
  }
  /**
   * Sets this quaternion to the rotation required to rotate the direction vector
   * `vFrom` to the direction vector `vTo`.
   *
   * @param {Vector3} vFrom - The first (normalized) direction vector.
   * @param {Vector3} vTo - The second (normalized) direction vector.
   * @return {Quaternion} A reference to this quaternion.
   */
  setFromUnitVectors(t, e) {
    let n = t.dot(e) + 1;
    return n < Number.EPSILON ? (n = 0, Math.abs(t.x) > Math.abs(t.z) ? (this._x = -t.y, this._y = t.x, this._z = 0, this._w = n) : (this._x = 0, this._y = -t.z, this._z = t.y, this._w = n)) : (this._x = t.y * e.z - t.z * e.y, this._y = t.z * e.x - t.x * e.z, this._z = t.x * e.y - t.y * e.x, this._w = n), this.normalize();
  }
  /**
   * Returns the angle between this quaternion and the given one in radians.
   *
   * @param {Quaternion} q - The quaternion to compute the angle with.
   * @return {number} The angle in radians.
   */
  angleTo(t) {
    return 2 * Math.acos(Math.abs(Nt(this.dot(t), -1, 1)));
  }
  /**
   * Rotates this quaternion by a given angular step to the given quaternion.
   * The method ensures that the final quaternion will not overshoot `q`.
   *
   * @param {Quaternion} q - The target quaternion.
   * @param {number} step - The angular step in radians.
   * @return {Quaternion} A reference to this quaternion.
   */
  rotateTowards(t, e) {
    const n = this.angleTo(t);
    if (n === 0) return this;
    const r = Math.min(1, e / n);
    return this.slerp(t, r), this;
  }
  /**
   * Sets this quaternion to the identity quaternion; that is, to the
   * quaternion that represents "no rotation".
   *
   * @return {Quaternion} A reference to this quaternion.
   */
  identity() {
    return this.set(0, 0, 0, 1);
  }
  /**
   * Inverts this quaternion via {@link Quaternion#conjugate}. The
   * quaternion is assumed to have unit length.
   *
   * @return {Quaternion} A reference to this quaternion.
   */
  invert() {
    return this.conjugate();
  }
  /**
   * Returns the rotational conjugate of this quaternion. The conjugate of a
   * quaternion represents the same rotation in the opposite direction about
   * the rotational axis.
   *
   * @return {Quaternion} A reference to this quaternion.
   */
  conjugate() {
    return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this;
  }
  /**
   * Calculates the dot product of this quaternion and the given one.
   *
   * @param {Quaternion} v - The quaternion to compute the dot product with.
   * @return {number} The result of the dot product.
   */
  dot(t) {
    return this._x * t._x + this._y * t._y + this._z * t._z + this._w * t._w;
  }
  /**
   * Computes the squared Euclidean length (straight-line length) of this quaternion,
   * considered as a 4 dimensional vector. This can be useful if you are comparing the
   * lengths of two quaternions, as this is a slightly more efficient calculation than
   * {@link Quaternion#length}.
   *
   * @return {number} The squared Euclidean length.
   */
  lengthSq() {
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }
  /**
   * Computes the Euclidean length (straight-line length) of this quaternion,
   * considered as a 4 dimensional vector.
   *
   * @return {number} The Euclidean length.
   */
  length() {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
  }
  /**
   * Normalizes this quaternion - that is, calculated the quaternion that performs
   * the same rotation as this one, but has a length equal to `1`.
   *
   * @return {Quaternion} A reference to this quaternion.
   */
  normalize() {
    let t = this.length();
    return t === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (t = 1 / t, this._x = this._x * t, this._y = this._y * t, this._z = this._z * t, this._w = this._w * t), this._onChangeCallback(), this;
  }
  /**
   * Multiplies this quaternion by the given one.
   *
   * @param {Quaternion} q - The quaternion.
   * @return {Quaternion} A reference to this quaternion.
   */
  multiply(t) {
    return this.multiplyQuaternions(this, t);
  }
  /**
   * Pre-multiplies this quaternion by the given one.
   *
   * @param {Quaternion} q - The quaternion.
   * @return {Quaternion} A reference to this quaternion.
   */
  premultiply(t) {
    return this.multiplyQuaternions(t, this);
  }
  /**
   * Multiplies the given quaternions and stores the result in this instance.
   *
   * @param {Quaternion} a - The first quaternion.
   * @param {Quaternion} b - The second quaternion.
   * @return {Quaternion} A reference to this quaternion.
   */
  multiplyQuaternions(t, e) {
    const n = t._x, r = t._y, s = t._z, a = t._w, o = e._x, l = e._y, c = e._z, h = e._w;
    return this._x = n * h + a * o + r * c - s * l, this._y = r * h + a * l + s * o - n * c, this._z = s * h + a * c + n * l - r * o, this._w = a * h - n * o - r * l - s * c, this._onChangeCallback(), this;
  }
  /**
   * Performs a spherical linear interpolation between quaternions.
   *
   * @param {Quaternion} qb - The target quaternion.
   * @param {number} t - The interpolation factor in the closed interval `[0, 1]`.
   * @return {Quaternion} A reference to this quaternion.
   */
  slerp(t, e) {
    if (e === 0) return this;
    if (e === 1) return this.copy(t);
    const n = this._x, r = this._y, s = this._z, a = this._w;
    let o = a * t._w + n * t._x + r * t._y + s * t._z;
    if (o < 0 ? (this._w = -t._w, this._x = -t._x, this._y = -t._y, this._z = -t._z, o = -o) : this.copy(t), o >= 1)
      return this._w = a, this._x = n, this._y = r, this._z = s, this;
    const l = 1 - o * o;
    if (l <= Number.EPSILON) {
      const d = 1 - e;
      return this._w = d * a + e * this._w, this._x = d * n + e * this._x, this._y = d * r + e * this._y, this._z = d * s + e * this._z, this.normalize(), this;
    }
    const c = Math.sqrt(l), h = Math.atan2(c, o), u = Math.sin((1 - e) * h) / c, f = Math.sin(e * h) / c;
    return this._w = a * u + this._w * f, this._x = n * u + this._x * f, this._y = r * u + this._y * f, this._z = s * u + this._z * f, this._onChangeCallback(), this;
  }
  /**
   * Performs a spherical linear interpolation between the given quaternions
   * and stores the result in this quaternion.
   *
   * @param {Quaternion} qa - The source quaternion.
   * @param {Quaternion} qb - The target quaternion.
   * @param {number} t - The interpolation factor in the closed interval `[0, 1]`.
   * @return {Quaternion} A reference to this quaternion.
   */
  slerpQuaternions(t, e, n) {
    return this.copy(t).slerp(e, n);
  }
  /**
   * Sets this quaternion to a uniformly random, normalized quaternion.
   *
   * @return {Quaternion} A reference to this quaternion.
   */
  random() {
    const t = 2 * Math.PI * Math.random(), e = 2 * Math.PI * Math.random(), n = Math.random(), r = Math.sqrt(1 - n), s = Math.sqrt(n);
    return this.set(
      r * Math.sin(t),
      r * Math.cos(t),
      s * Math.sin(e),
      s * Math.cos(e)
    );
  }
  /**
   * Returns `true` if this quaternion is equal with the given one.
   *
   * @param {Quaternion} quaternion - The quaternion to test for equality.
   * @return {boolean} Whether this quaternion is equal with the given one.
   */
  equals(t) {
    return t._x === this._x && t._y === this._y && t._z === this._z && t._w === this._w;
  }
  /**
   * Sets this quaternion's components from the given array.
   *
   * @param {Array<number>} array - An array holding the quaternion component values.
   * @param {number} [offset=0] - The offset into the array.
   * @return {Quaternion} A reference to this quaternion.
   */
  fromArray(t, e = 0) {
    return this._x = t[e], this._y = t[e + 1], this._z = t[e + 2], this._w = t[e + 3], this._onChangeCallback(), this;
  }
  /**
   * Writes the components of this quaternion to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number>} [array=[]] - The target array holding the quaternion components.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number>} The quaternion components.
   */
  toArray(t = [], e = 0) {
    return t[e] = this._x, t[e + 1] = this._y, t[e + 2] = this._z, t[e + 3] = this._w, t;
  }
  /**
   * Sets the components of this quaternion from the given buffer attribute.
   *
   * @param {BufferAttribute} attribute - The buffer attribute holding quaternion data.
   * @param {number} index - The index into the attribute.
   * @return {Quaternion} A reference to this quaternion.
   */
  fromBufferAttribute(t, e) {
    return this._x = t.getX(e), this._y = t.getY(e), this._z = t.getZ(e), this._w = t.getW(e), this._onChangeCallback(), this;
  }
  /**
   * This methods defines the serialization result of this class. Returns the
   * numerical elements of this quaternion in an array of format `[x, y, z, w]`.
   *
   * @return {Array<number>} The serialized quaternion.
   */
  toJSON() {
    return this.toArray();
  }
  _onChange(t) {
    return this._onChangeCallback = t, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._w;
  }
}
class I {
  /**
   * Constructs a new 3D vector.
   *
   * @param {number} [x=0] - The x value of this vector.
   * @param {number} [y=0] - The y value of this vector.
   * @param {number} [z=0] - The z value of this vector.
   */
  constructor(t = 0, e = 0, n = 0) {
    I.prototype.isVector3 = !0, this.x = t, this.y = e, this.z = n;
  }
  /**
   * Sets the vector components.
   *
   * @param {number} x - The value of the x component.
   * @param {number} y - The value of the y component.
   * @param {number} z - The value of the z component.
   * @return {Vector3} A reference to this vector.
   */
  set(t, e, n) {
    return n === void 0 && (n = this.z), this.x = t, this.y = e, this.z = n, this;
  }
  /**
   * Sets the vector components to the same value.
   *
   * @param {number} scalar - The value to set for all vector components.
   * @return {Vector3} A reference to this vector.
   */
  setScalar(t) {
    return this.x = t, this.y = t, this.z = t, this;
  }
  /**
   * Sets the vector's x component to the given value
   *
   * @param {number} x - The value to set.
   * @return {Vector3} A reference to this vector.
   */
  setX(t) {
    return this.x = t, this;
  }
  /**
   * Sets the vector's y component to the given value
   *
   * @param {number} y - The value to set.
   * @return {Vector3} A reference to this vector.
   */
  setY(t) {
    return this.y = t, this;
  }
  /**
   * Sets the vector's z component to the given value
   *
   * @param {number} z - The value to set.
   * @return {Vector3} A reference to this vector.
   */
  setZ(t) {
    return this.z = t, this;
  }
  /**
   * Allows to set a vector component with an index.
   *
   * @param {number} index - The component index. `0` equals to x, `1` equals to y, `2` equals to z.
   * @param {number} value - The value to set.
   * @return {Vector3} A reference to this vector.
   */
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      case 2:
        this.z = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  /**
   * Returns the value of the vector component which matches the given index.
   *
   * @param {number} index - The component index. `0` equals to x, `1` equals to y, `2` equals to z.
   * @return {number} A vector component value.
   */
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  /**
   * Returns a new vector with copied values from this instance.
   *
   * @return {Vector3} A clone of this instance.
   */
  clone() {
    return new this.constructor(this.x, this.y, this.z);
  }
  /**
   * Copies the values of the given vector to this instance.
   *
   * @param {Vector3} v - The vector to copy.
   * @return {Vector3} A reference to this vector.
   */
  copy(t) {
    return this.x = t.x, this.y = t.y, this.z = t.z, this;
  }
  /**
   * Adds the given vector to this instance.
   *
   * @param {Vector3} v - The vector to add.
   * @return {Vector3} A reference to this vector.
   */
  add(t) {
    return this.x += t.x, this.y += t.y, this.z += t.z, this;
  }
  /**
   * Adds the given scalar value to all components of this instance.
   *
   * @param {number} s - The scalar to add.
   * @return {Vector3} A reference to this vector.
   */
  addScalar(t) {
    return this.x += t, this.y += t, this.z += t, this;
  }
  /**
   * Adds the given vectors and stores the result in this instance.
   *
   * @param {Vector3} a - The first vector.
   * @param {Vector3} b - The second vector.
   * @return {Vector3} A reference to this vector.
   */
  addVectors(t, e) {
    return this.x = t.x + e.x, this.y = t.y + e.y, this.z = t.z + e.z, this;
  }
  /**
   * Adds the given vector scaled by the given factor to this instance.
   *
   * @param {Vector3|Vector4} v - The vector.
   * @param {number} s - The factor that scales `v`.
   * @return {Vector3} A reference to this vector.
   */
  addScaledVector(t, e) {
    return this.x += t.x * e, this.y += t.y * e, this.z += t.z * e, this;
  }
  /**
   * Subtracts the given vector from this instance.
   *
   * @param {Vector3} v - The vector to subtract.
   * @return {Vector3} A reference to this vector.
   */
  sub(t) {
    return this.x -= t.x, this.y -= t.y, this.z -= t.z, this;
  }
  /**
   * Subtracts the given scalar value from all components of this instance.
   *
   * @param {number} s - The scalar to subtract.
   * @return {Vector3} A reference to this vector.
   */
  subScalar(t) {
    return this.x -= t, this.y -= t, this.z -= t, this;
  }
  /**
   * Subtracts the given vectors and stores the result in this instance.
   *
   * @param {Vector3} a - The first vector.
   * @param {Vector3} b - The second vector.
   * @return {Vector3} A reference to this vector.
   */
  subVectors(t, e) {
    return this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this;
  }
  /**
   * Multiplies the given vector with this instance.
   *
   * @param {Vector3} v - The vector to multiply.
   * @return {Vector3} A reference to this vector.
   */
  multiply(t) {
    return this.x *= t.x, this.y *= t.y, this.z *= t.z, this;
  }
  /**
   * Multiplies the given scalar value with all components of this instance.
   *
   * @param {number} scalar - The scalar to multiply.
   * @return {Vector3} A reference to this vector.
   */
  multiplyScalar(t) {
    return this.x *= t, this.y *= t, this.z *= t, this;
  }
  /**
   * Multiplies the given vectors and stores the result in this instance.
   *
   * @param {Vector3} a - The first vector.
   * @param {Vector3} b - The second vector.
   * @return {Vector3} A reference to this vector.
   */
  multiplyVectors(t, e) {
    return this.x = t.x * e.x, this.y = t.y * e.y, this.z = t.z * e.z, this;
  }
  /**
   * Applies the given Euler rotation to this vector.
   *
   * @param {Euler} euler - The Euler angles.
   * @return {Vector3} A reference to this vector.
   */
  applyEuler(t) {
    return this.applyQuaternion(to.setFromEuler(t));
  }
  /**
   * Applies a rotation specified by an axis and an angle to this vector.
   *
   * @param {Vector3} axis - A normalized vector representing the rotation axis.
   * @param {number} angle - The angle in radians.
   * @return {Vector3} A reference to this vector.
   */
  applyAxisAngle(t, e) {
    return this.applyQuaternion(to.setFromAxisAngle(t, e));
  }
  /**
   * Multiplies this vector with the given 3x3 matrix.
   *
   * @param {Matrix3} m - The 3x3 matrix.
   * @return {Vector3} A reference to this vector.
   */
  applyMatrix3(t) {
    const e = this.x, n = this.y, r = this.z, s = t.elements;
    return this.x = s[0] * e + s[3] * n + s[6] * r, this.y = s[1] * e + s[4] * n + s[7] * r, this.z = s[2] * e + s[5] * n + s[8] * r, this;
  }
  /**
   * Multiplies this vector by the given normal matrix and normalizes
   * the result.
   *
   * @param {Matrix3} m - The normal matrix.
   * @return {Vector3} A reference to this vector.
   */
  applyNormalMatrix(t) {
    return this.applyMatrix3(t).normalize();
  }
  /**
   * Multiplies this vector (with an implicit 1 in the 4th dimension) by m, and
   * divides by perspective.
   *
   * @param {Matrix4} m - The matrix to apply.
   * @return {Vector3} A reference to this vector.
   */
  applyMatrix4(t) {
    const e = this.x, n = this.y, r = this.z, s = t.elements, a = 1 / (s[3] * e + s[7] * n + s[11] * r + s[15]);
    return this.x = (s[0] * e + s[4] * n + s[8] * r + s[12]) * a, this.y = (s[1] * e + s[5] * n + s[9] * r + s[13]) * a, this.z = (s[2] * e + s[6] * n + s[10] * r + s[14]) * a, this;
  }
  /**
   * Applies the given Quaternion to this vector.
   *
   * @param {Quaternion} q - The Quaternion.
   * @return {Vector3} A reference to this vector.
   */
  applyQuaternion(t) {
    const e = this.x, n = this.y, r = this.z, s = t.x, a = t.y, o = t.z, l = t.w, c = 2 * (a * r - o * n), h = 2 * (o * e - s * r), u = 2 * (s * n - a * e);
    return this.x = e + l * c + a * u - o * h, this.y = n + l * h + o * c - s * u, this.z = r + l * u + s * h - a * c, this;
  }
  /**
   * Projects this vector from world space into the camera's normalized
   * device coordinate (NDC) space.
   *
   * @param {Camera} camera - The camera.
   * @return {Vector3} A reference to this vector.
   */
  project(t) {
    return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix);
  }
  /**
   * Unprojects this vector from the camera's normalized device coordinate (NDC)
   * space into world space.
   *
   * @param {Camera} camera - The camera.
   * @return {Vector3} A reference to this vector.
   */
  unproject(t) {
    return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld);
  }
  /**
   * Transforms the direction of this vector by a matrix (the upper left 3 x 3
   * subset of the given 4x4 matrix and then normalizes the result.
   *
   * @param {Matrix4} m - The matrix.
   * @return {Vector3} A reference to this vector.
   */
  transformDirection(t) {
    const e = this.x, n = this.y, r = this.z, s = t.elements;
    return this.x = s[0] * e + s[4] * n + s[8] * r, this.y = s[1] * e + s[5] * n + s[9] * r, this.z = s[2] * e + s[6] * n + s[10] * r, this.normalize();
  }
  /**
   * Divides this instance by the given vector.
   *
   * @param {Vector3} v - The vector to divide.
   * @return {Vector3} A reference to this vector.
   */
  divide(t) {
    return this.x /= t.x, this.y /= t.y, this.z /= t.z, this;
  }
  /**
   * Divides this vector by the given scalar.
   *
   * @param {number} scalar - The scalar to divide.
   * @return {Vector3} A reference to this vector.
   */
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  /**
   * If this vector's x, y or z value is greater than the given vector's x, y or z
   * value, replace that value with the corresponding min value.
   *
   * @param {Vector3} v - The vector.
   * @return {Vector3} A reference to this vector.
   */
  min(t) {
    return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this.z = Math.min(this.z, t.z), this;
  }
  /**
   * If this vector's x, y or z value is less than the given vector's x, y or z
   * value, replace that value with the corresponding max value.
   *
   * @param {Vector3} v - The vector.
   * @return {Vector3} A reference to this vector.
   */
  max(t) {
    return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this.z = Math.max(this.z, t.z), this;
  }
  /**
   * If this vector's x, y or z value is greater than the max vector's x, y or z
   * value, it is replaced by the corresponding value.
   * If this vector's x, y or z value is less than the min vector's x, y or z value,
   * it is replaced by the corresponding value.
   *
   * @param {Vector3} min - The minimum x, y and z values.
   * @param {Vector3} max - The maximum x, y and z values in the desired range.
   * @return {Vector3} A reference to this vector.
   */
  clamp(t, e) {
    return this.x = Nt(this.x, t.x, e.x), this.y = Nt(this.y, t.y, e.y), this.z = Nt(this.z, t.z, e.z), this;
  }
  /**
   * If this vector's x, y or z values are greater than the max value, they are
   * replaced by the max value.
   * If this vector's x, y or z values are less than the min value, they are
   * replaced by the min value.
   *
   * @param {number} minVal - The minimum value the components will be clamped to.
   * @param {number} maxVal - The maximum value the components will be clamped to.
   * @return {Vector3} A reference to this vector.
   */
  clampScalar(t, e) {
    return this.x = Nt(this.x, t, e), this.y = Nt(this.y, t, e), this.z = Nt(this.z, t, e), this;
  }
  /**
   * If this vector's length is greater than the max value, it is replaced by
   * the max value.
   * If this vector's length is less than the min value, it is replaced by the
   * min value.
   *
   * @param {number} min - The minimum value the vector length will be clamped to.
   * @param {number} max - The maximum value the vector length will be clamped to.
   * @return {Vector3} A reference to this vector.
   */
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(Nt(n, t, e));
  }
  /**
   * The components of this vector are rounded down to the nearest integer value.
   *
   * @return {Vector3} A reference to this vector.
   */
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
  }
  /**
   * The components of this vector are rounded up to the nearest integer value.
   *
   * @return {Vector3} A reference to this vector.
   */
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
  }
  /**
   * The components of this vector are rounded to the nearest integer value
   *
   * @return {Vector3} A reference to this vector.
   */
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
  }
  /**
   * The components of this vector are rounded towards zero (up if negative,
   * down if positive) to an integer value.
   *
   * @return {Vector3} A reference to this vector.
   */
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this;
  }
  /**
   * Inverts this vector - i.e. sets x = -x, y = -y and z = -z.
   *
   * @return {Vector3} A reference to this vector.
   */
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
  }
  /**
   * Calculates the dot product of the given vector with this instance.
   *
   * @param {Vector3} v - The vector to compute the dot product with.
   * @return {number} The result of the dot product.
   */
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z;
  }
  // TODO lengthSquared?
  /**
   * Computes the square of the Euclidean length (straight-line length) from
   * (0, 0, 0) to (x, y, z). If you are comparing the lengths of vectors, you should
   * compare the length squared instead as it is slightly more efficient to calculate.
   *
   * @return {number} The square length of this vector.
   */
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  /**
   * Computes the  Euclidean length (straight-line length) from (0, 0, 0) to (x, y, z).
   *
   * @return {number} The length of this vector.
   */
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  /**
   * Computes the Manhattan length of this vector.
   *
   * @return {number} The length of this vector.
   */
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }
  /**
   * Converts this vector to a unit vector - that is, sets it equal to a vector
   * with the same direction as this one, but with a vector length of `1`.
   *
   * @return {Vector3} A reference to this vector.
   */
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  /**
   * Sets this vector to a vector with the same direction as this one, but
   * with the specified length.
   *
   * @param {number} length - The new length of this vector.
   * @return {Vector3} A reference to this vector.
   */
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  /**
   * Linearly interpolates between the given vector and this instance, where
   * alpha is the percent distance along the line - alpha = 0 will be this
   * vector, and alpha = 1 will be the given one.
   *
   * @param {Vector3} v - The vector to interpolate towards.
   * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
   * @return {Vector3} A reference to this vector.
   */
  lerp(t, e) {
    return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this.z += (t.z - this.z) * e, this;
  }
  /**
   * Linearly interpolates between the given vectors, where alpha is the percent
   * distance along the line - alpha = 0 will be first vector, and alpha = 1 will
   * be the second one. The result is stored in this instance.
   *
   * @param {Vector3} v1 - The first vector.
   * @param {Vector3} v2 - The second vector.
   * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
   * @return {Vector3} A reference to this vector.
   */
  lerpVectors(t, e, n) {
    return this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this.z = t.z + (e.z - t.z) * n, this;
  }
  /**
   * Calculates the cross product of the given vector with this instance.
   *
   * @param {Vector3} v - The vector to compute the cross product with.
   * @return {Vector3} The result of the cross product.
   */
  cross(t) {
    return this.crossVectors(this, t);
  }
  /**
   * Calculates the cross product of the given vectors and stores the result
   * in this instance.
   *
   * @param {Vector3} a - The first vector.
   * @param {Vector3} b - The second vector.
   * @return {Vector3} A reference to this vector.
   */
  crossVectors(t, e) {
    const n = t.x, r = t.y, s = t.z, a = e.x, o = e.y, l = e.z;
    return this.x = r * l - s * o, this.y = s * a - n * l, this.z = n * o - r * a, this;
  }
  /**
   * Projects this vector onto the given one.
   *
   * @param {Vector3} v - The vector to project to.
   * @return {Vector3} A reference to this vector.
   */
  projectOnVector(t) {
    const e = t.lengthSq();
    if (e === 0) return this.set(0, 0, 0);
    const n = t.dot(this) / e;
    return this.copy(t).multiplyScalar(n);
  }
  /**
   * Projects this vector onto a plane by subtracting this
   * vector projected onto the plane's normal from this vector.
   *
   * @param {Vector3} planeNormal - The plane normal.
   * @return {Vector3} A reference to this vector.
   */
  projectOnPlane(t) {
    return ts.copy(this).projectOnVector(t), this.sub(ts);
  }
  /**
   * Reflects this vector off a plane orthogonal to the given normal vector.
   *
   * @param {Vector3} normal - The (normalized) normal vector.
   * @return {Vector3} A reference to this vector.
   */
  reflect(t) {
    return this.sub(ts.copy(t).multiplyScalar(2 * this.dot(t)));
  }
  /**
   * Returns the angle between the given vector and this instance in radians.
   *
   * @param {Vector3} v - The vector to compute the angle with.
   * @return {number} The angle in radians.
   */
  angleTo(t) {
    const e = Math.sqrt(this.lengthSq() * t.lengthSq());
    if (e === 0) return Math.PI / 2;
    const n = this.dot(t) / e;
    return Math.acos(Nt(n, -1, 1));
  }
  /**
   * Computes the distance from the given vector to this instance.
   *
   * @param {Vector3} v - The vector to compute the distance to.
   * @return {number} The distance.
   */
  distanceTo(t) {
    return Math.sqrt(this.distanceToSquared(t));
  }
  /**
   * Computes the squared distance from the given vector to this instance.
   * If you are just comparing the distance with another distance, you should compare
   * the distance squared instead as it is slightly more efficient to calculate.
   *
   * @param {Vector3} v - The vector to compute the squared distance to.
   * @return {number} The squared distance.
   */
  distanceToSquared(t) {
    const e = this.x - t.x, n = this.y - t.y, r = this.z - t.z;
    return e * e + n * n + r * r;
  }
  /**
   * Computes the Manhattan distance from the given vector to this instance.
   *
   * @param {Vector3} v - The vector to compute the Manhattan distance to.
   * @return {number} The Manhattan distance.
   */
  manhattanDistanceTo(t) {
    return Math.abs(this.x - t.x) + Math.abs(this.y - t.y) + Math.abs(this.z - t.z);
  }
  /**
   * Sets the vector components from the given spherical coordinates.
   *
   * @param {Spherical} s - The spherical coordinates.
   * @return {Vector3} A reference to this vector.
   */
  setFromSpherical(t) {
    return this.setFromSphericalCoords(t.radius, t.phi, t.theta);
  }
  /**
   * Sets the vector components from the given spherical coordinates.
   *
   * @param {number} radius - The radius.
   * @param {number} phi - The phi angle in radians.
   * @param {number} theta - The theta angle in radians.
   * @return {Vector3} A reference to this vector.
   */
  setFromSphericalCoords(t, e, n) {
    const r = Math.sin(e) * t;
    return this.x = r * Math.sin(n), this.y = Math.cos(e) * t, this.z = r * Math.cos(n), this;
  }
  /**
   * Sets the vector components from the given cylindrical coordinates.
   *
   * @param {Cylindrical} c - The cylindrical coordinates.
   * @return {Vector3} A reference to this vector.
   */
  setFromCylindrical(t) {
    return this.setFromCylindricalCoords(t.radius, t.theta, t.y);
  }
  /**
   * Sets the vector components from the given cylindrical coordinates.
   *
   * @param {number} radius - The radius.
   * @param {number} theta - The theta angle in radians.
   * @param {number} y - The y value.
   * @return {Vector3} A reference to this vector.
   */
  setFromCylindricalCoords(t, e, n) {
    return this.x = t * Math.sin(e), this.y = n, this.z = t * Math.cos(e), this;
  }
  /**
   * Sets the vector components to the position elements of the
   * given transformation matrix.
   *
   * @param {Matrix4} m - The 4x4 matrix.
   * @return {Vector3} A reference to this vector.
   */
  setFromMatrixPosition(t) {
    const e = t.elements;
    return this.x = e[12], this.y = e[13], this.z = e[14], this;
  }
  /**
   * Sets the vector components to the scale elements of the
   * given transformation matrix.
   *
   * @param {Matrix4} m - The 4x4 matrix.
   * @return {Vector3} A reference to this vector.
   */
  setFromMatrixScale(t) {
    const e = this.setFromMatrixColumn(t, 0).length(), n = this.setFromMatrixColumn(t, 1).length(), r = this.setFromMatrixColumn(t, 2).length();
    return this.x = e, this.y = n, this.z = r, this;
  }
  /**
   * Sets the vector components from the specified matrix column.
   *
   * @param {Matrix4} m - The 4x4 matrix.
   * @param {number} index - The column index.
   * @return {Vector3} A reference to this vector.
   */
  setFromMatrixColumn(t, e) {
    return this.fromArray(t.elements, e * 4);
  }
  /**
   * Sets the vector components from the specified matrix column.
   *
   * @param {Matrix3} m - The 3x3 matrix.
   * @param {number} index - The column index.
   * @return {Vector3} A reference to this vector.
   */
  setFromMatrix3Column(t, e) {
    return this.fromArray(t.elements, e * 3);
  }
  /**
   * Sets the vector components from the given Euler angles.
   *
   * @param {Euler} e - The Euler angles to set.
   * @return {Vector3} A reference to this vector.
   */
  setFromEuler(t) {
    return this.x = t._x, this.y = t._y, this.z = t._z, this;
  }
  /**
   * Sets the vector components from the RGB components of the
   * given color.
   *
   * @param {Color} c - The color to set.
   * @return {Vector3} A reference to this vector.
   */
  setFromColor(t) {
    return this.x = t.r, this.y = t.g, this.z = t.b, this;
  }
  /**
   * Returns `true` if this vector is equal with the given one.
   *
   * @param {Vector3} v - The vector to test for equality.
   * @return {boolean} Whether this vector is equal with the given one.
   */
  equals(t) {
    return t.x === this.x && t.y === this.y && t.z === this.z;
  }
  /**
   * Sets this vector's x value to be `array[ offset ]`, y value to be `array[ offset + 1 ]`
   * and z value to be `array[ offset + 2 ]`.
   *
   * @param {Array<number>} array - An array holding the vector component values.
   * @param {number} [offset=0] - The offset into the array.
   * @return {Vector3} A reference to this vector.
   */
  fromArray(t, e = 0) {
    return this.x = t[e], this.y = t[e + 1], this.z = t[e + 2], this;
  }
  /**
   * Writes the components of this vector to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number>} [array=[]] - The target array holding the vector components.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number>} The vector components.
   */
  toArray(t = [], e = 0) {
    return t[e] = this.x, t[e + 1] = this.y, t[e + 2] = this.z, t;
  }
  /**
   * Sets the components of this vector from the given buffer attribute.
   *
   * @param {BufferAttribute} attribute - The buffer attribute holding vector data.
   * @param {number} index - The index into the attribute.
   * @return {Vector3} A reference to this vector.
   */
  fromBufferAttribute(t, e) {
    return this.x = t.getX(e), this.y = t.getY(e), this.z = t.getZ(e), this;
  }
  /**
   * Sets each component of this vector to a pseudo-random value between `0` and
   * `1`, excluding `1`.
   *
   * @return {Vector3} A reference to this vector.
   */
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
  }
  /**
   * Sets this vector to a uniformly random point on a unit sphere.
   *
   * @return {Vector3} A reference to this vector.
   */
  randomDirection() {
    const t = Math.random() * Math.PI * 2, e = Math.random() * 2 - 1, n = Math.sqrt(1 - e * e);
    return this.x = n * Math.cos(t), this.y = e, this.z = n * Math.sin(t), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z;
  }
}
const ts = /* @__PURE__ */ new I(), to = /* @__PURE__ */ new Ai();
class Zn {
  /**
   * Constructs a new bounding box.
   *
   * @param {Vector3} [min=(Infinity,Infinity,Infinity)] - A vector representing the lower boundary of the box.
   * @param {Vector3} [max=(-Infinity,-Infinity,-Infinity)] - A vector representing the upper boundary of the box.
   */
  constructor(t = new I(1 / 0, 1 / 0, 1 / 0), e = new I(-1 / 0, -1 / 0, -1 / 0)) {
    this.isBox3 = !0, this.min = t, this.max = e;
  }
  /**
   * Sets the lower and upper boundaries of this box.
   * Please note that this method only copies the values from the given objects.
   *
   * @param {Vector3} min - The lower boundary of the box.
   * @param {Vector3} max - The upper boundary of the box.
   * @return {Box3} A reference to this bounding box.
   */
  set(t, e) {
    return this.min.copy(t), this.max.copy(e), this;
  }
  /**
   * Sets the upper and lower bounds of this box so it encloses the position data
   * in the given array.
   *
   * @param {Array<number>} array - An array holding 3D position data.
   * @return {Box3} A reference to this bounding box.
   */
  setFromArray(t) {
    this.makeEmpty();
    for (let e = 0, n = t.length; e < n; e += 3)
      this.expandByPoint(We.fromArray(t, e));
    return this;
  }
  /**
   * Sets the upper and lower bounds of this box so it encloses the position data
   * in the given buffer attribute.
   *
   * @param {BufferAttribute} attribute - A buffer attribute holding 3D position data.
   * @return {Box3} A reference to this bounding box.
   */
  setFromBufferAttribute(t) {
    this.makeEmpty();
    for (let e = 0, n = t.count; e < n; e++)
      this.expandByPoint(We.fromBufferAttribute(t, e));
    return this;
  }
  /**
   * Sets the upper and lower bounds of this box so it encloses the position data
   * in the given array.
   *
   * @param {Array<Vector3>} points - An array holding 3D position data as instances of {@link Vector3}.
   * @return {Box3} A reference to this bounding box.
   */
  setFromPoints(t) {
    this.makeEmpty();
    for (let e = 0, n = t.length; e < n; e++)
      this.expandByPoint(t[e]);
    return this;
  }
  /**
   * Centers this box on the given center vector and sets this box's width, height and
   * depth to the given size values.
   *
   * @param {Vector3} center - The center of the box.
   * @param {Vector3} size - The x, y and z dimensions of the box.
   * @return {Box3} A reference to this bounding box.
   */
  setFromCenterAndSize(t, e) {
    const n = We.copy(e).multiplyScalar(0.5);
    return this.min.copy(t).sub(n), this.max.copy(t).add(n), this;
  }
  /**
   * Computes the world-axis-aligned bounding box for the given 3D object
   * (including its children), accounting for the object's, and children's,
   * world transforms. The function may result in a larger box than strictly necessary.
   *
   * @param {Object3D} object - The 3D object to compute the bounding box for.
   * @param {boolean} [precise=false] - If set to `true`, the method computes the smallest
   * world-axis-aligned bounding box at the expense of more computation.
   * @return {Box3} A reference to this bounding box.
   */
  setFromObject(t, e = !1) {
    return this.makeEmpty(), this.expandByObject(t, e);
  }
  /**
   * Returns a new box with copied values from this instance.
   *
   * @return {Box3} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
  /**
   * Copies the values of the given box to this instance.
   *
   * @param {Box3} box - The box to copy.
   * @return {Box3} A reference to this bounding box.
   */
  copy(t) {
    return this.min.copy(t.min), this.max.copy(t.max), this;
  }
  /**
   * Makes this box empty which means in encloses a zero space in 3D.
   *
   * @return {Box3} A reference to this bounding box.
   */
  makeEmpty() {
    return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this;
  }
  /**
   * Returns true if this box includes zero points within its bounds.
   * Note that a box with equal lower and upper bounds still includes one
   * point, the one both bounds share.
   *
   * @return {boolean} Whether this box is empty or not.
   */
  isEmpty() {
    return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  }
  /**
   * Returns the center point of this box.
   *
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The center point.
   */
  getCenter(t) {
    return this.isEmpty() ? t.set(0, 0, 0) : t.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  /**
   * Returns the dimensions of this box.
   *
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The size.
   */
  getSize(t) {
    return this.isEmpty() ? t.set(0, 0, 0) : t.subVectors(this.max, this.min);
  }
  /**
   * Expands the boundaries of this box to include the given point.
   *
   * @param {Vector3} point - The point that should be included by the bounding box.
   * @return {Box3} A reference to this bounding box.
   */
  expandByPoint(t) {
    return this.min.min(t), this.max.max(t), this;
  }
  /**
   * Expands this box equilaterally by the given vector. The width of this
   * box will be expanded by the x component of the vector in both
   * directions. The height of this box will be expanded by the y component of
   * the vector in both directions. The depth of this box will be
   * expanded by the z component of the vector in both directions.
   *
   * @param {Vector3} vector - The vector that should expand the bounding box.
   * @return {Box3} A reference to this bounding box.
   */
  expandByVector(t) {
    return this.min.sub(t), this.max.add(t), this;
  }
  /**
   * Expands each dimension of the box by the given scalar. If negative, the
   * dimensions of the box will be contracted.
   *
   * @param {number} scalar - The scalar value that should expand the bounding box.
   * @return {Box3} A reference to this bounding box.
   */
  expandByScalar(t) {
    return this.min.addScalar(-t), this.max.addScalar(t), this;
  }
  /**
   * Expands the boundaries of this box to include the given 3D object and
   * its children, accounting for the object's, and children's, world
   * transforms. The function may result in a larger box than strictly
   * necessary (unless the precise parameter is set to true).
   *
   * @param {Object3D} object - The 3D object that should expand the bounding box.
   * @param {boolean} precise - If set to `true`, the method expands the bounding box
   * as little as necessary at the expense of more computation.
   * @return {Box3} A reference to this bounding box.
   */
  expandByObject(t, e = !1) {
    t.updateWorldMatrix(!1, !1);
    const n = t.geometry;
    if (n !== void 0) {
      const s = n.getAttribute("position");
      if (e === !0 && s !== void 0 && t.isInstancedMesh !== !0)
        for (let a = 0, o = s.count; a < o; a++)
          t.isMesh === !0 ? t.getVertexPosition(a, We) : We.fromBufferAttribute(s, a), We.applyMatrix4(t.matrixWorld), this.expandByPoint(We);
      else
        t.boundingBox !== void 0 ? (t.boundingBox === null && t.computeBoundingBox(), ar.copy(t.boundingBox)) : (n.boundingBox === null && n.computeBoundingBox(), ar.copy(n.boundingBox)), ar.applyMatrix4(t.matrixWorld), this.union(ar);
    }
    const r = t.children;
    for (let s = 0, a = r.length; s < a; s++)
      this.expandByObject(r[s], e);
    return this;
  }
  /**
   * Returns `true` if the given point lies within or on the boundaries of this box.
   *
   * @param {Vector3} point - The point to test.
   * @return {boolean} Whether the bounding box contains the given point or not.
   */
  containsPoint(t) {
    return t.x >= this.min.x && t.x <= this.max.x && t.y >= this.min.y && t.y <= this.max.y && t.z >= this.min.z && t.z <= this.max.z;
  }
  /**
   * Returns `true` if this bounding box includes the entirety of the given bounding box.
   * If this box and the given one are identical, this function also returns `true`.
   *
   * @param {Box3} box - The bounding box to test.
   * @return {boolean} Whether the bounding box contains the given bounding box or not.
   */
  containsBox(t) {
    return this.min.x <= t.min.x && t.max.x <= this.max.x && this.min.y <= t.min.y && t.max.y <= this.max.y && this.min.z <= t.min.z && t.max.z <= this.max.z;
  }
  /**
   * Returns a point as a proportion of this box's width, height and depth.
   *
   * @param {Vector3} point - A point in 3D space.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} A point as a proportion of this box's width, height and depth.
   */
  getParameter(t, e) {
    return e.set(
      (t.x - this.min.x) / (this.max.x - this.min.x),
      (t.y - this.min.y) / (this.max.y - this.min.y),
      (t.z - this.min.z) / (this.max.z - this.min.z)
    );
  }
  /**
   * Returns `true` if the given bounding box intersects with this bounding box.
   *
   * @param {Box3} box - The bounding box to test.
   * @return {boolean} Whether the given bounding box intersects with this bounding box.
   */
  intersectsBox(t) {
    return t.max.x >= this.min.x && t.min.x <= this.max.x && t.max.y >= this.min.y && t.min.y <= this.max.y && t.max.z >= this.min.z && t.min.z <= this.max.z;
  }
  /**
   * Returns `true` if the given bounding sphere intersects with this bounding box.
   *
   * @param {Sphere} sphere - The bounding sphere to test.
   * @return {boolean} Whether the given bounding sphere intersects with this bounding box.
   */
  intersectsSphere(t) {
    return this.clampPoint(t.center, We), We.distanceToSquared(t.center) <= t.radius * t.radius;
  }
  /**
   * Returns `true` if the given plane intersects with this bounding box.
   *
   * @param {Plane} plane - The plane to test.
   * @return {boolean} Whether the given plane intersects with this bounding box.
   */
  intersectsPlane(t) {
    let e, n;
    return t.normal.x > 0 ? (e = t.normal.x * this.min.x, n = t.normal.x * this.max.x) : (e = t.normal.x * this.max.x, n = t.normal.x * this.min.x), t.normal.y > 0 ? (e += t.normal.y * this.min.y, n += t.normal.y * this.max.y) : (e += t.normal.y * this.max.y, n += t.normal.y * this.min.y), t.normal.z > 0 ? (e += t.normal.z * this.min.z, n += t.normal.z * this.max.z) : (e += t.normal.z * this.max.z, n += t.normal.z * this.min.z), e <= -t.constant && n >= -t.constant;
  }
  /**
   * Returns `true` if the given triangle intersects with this bounding box.
   *
   * @param {Triangle} triangle - The triangle to test.
   * @return {boolean} Whether the given triangle intersects with this bounding box.
   */
  intersectsTriangle(t) {
    if (this.isEmpty())
      return !1;
    this.getCenter(Ci), or.subVectors(this.max, Ci), Qn.subVectors(t.a, Ci), ti.subVectors(t.b, Ci), ei.subVectors(t.c, Ci), Mn.subVectors(ti, Qn), Sn.subVectors(ei, ti), Dn.subVectors(Qn, ei);
    let e = [
      0,
      -Mn.z,
      Mn.y,
      0,
      -Sn.z,
      Sn.y,
      0,
      -Dn.z,
      Dn.y,
      Mn.z,
      0,
      -Mn.x,
      Sn.z,
      0,
      -Sn.x,
      Dn.z,
      0,
      -Dn.x,
      -Mn.y,
      Mn.x,
      0,
      -Sn.y,
      Sn.x,
      0,
      -Dn.y,
      Dn.x,
      0
    ];
    return !es(e, Qn, ti, ei, or) || (e = [1, 0, 0, 0, 1, 0, 0, 0, 1], !es(e, Qn, ti, ei, or)) ? !1 : (lr.crossVectors(Mn, Sn), e = [lr.x, lr.y, lr.z], es(e, Qn, ti, ei, or));
  }
  /**
   * Clamps the given point within the bounds of this box.
   *
   * @param {Vector3} point - The point to clamp.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The clamped point.
   */
  clampPoint(t, e) {
    return e.copy(t).clamp(this.min, this.max);
  }
  /**
   * Returns the euclidean distance from any edge of this box to the specified point. If
   * the given point lies inside of this box, the distance will be `0`.
   *
   * @param {Vector3} point - The point to compute the distance to.
   * @return {number} The euclidean distance.
   */
  distanceToPoint(t) {
    return this.clampPoint(t, We).distanceTo(t);
  }
  /**
   * Returns a bounding sphere that encloses this bounding box.
   *
   * @param {Sphere} target - The target sphere that is used to store the method's result.
   * @return {Sphere} The bounding sphere that encloses this bounding box.
   */
  getBoundingSphere(t) {
    return this.isEmpty() ? t.makeEmpty() : (this.getCenter(t.center), t.radius = this.getSize(We).length() * 0.5), t;
  }
  /**
   * Computes the intersection of this bounding box and the given one, setting the upper
   * bound of this box to the lesser of the two boxes' upper bounds and the
   * lower bound of this box to the greater of the two boxes' lower bounds. If
   * there's no overlap, makes this box empty.
   *
   * @param {Box3} box - The bounding box to intersect with.
   * @return {Box3} A reference to this bounding box.
   */
  intersect(t) {
    return this.min.max(t.min), this.max.min(t.max), this.isEmpty() && this.makeEmpty(), this;
  }
  /**
   * Computes the union of this box and another and the given one, setting the upper
   * bound of this box to the greater of the two boxes' upper bounds and the
   * lower bound of this box to the lesser of the two boxes' lower bounds.
   *
   * @param {Box3} box - The bounding box that will be unioned with this instance.
   * @return {Box3} A reference to this bounding box.
   */
  union(t) {
    return this.min.min(t.min), this.max.max(t.max), this;
  }
  /**
   * Transforms this bounding box by the given 4x4 transformation matrix.
   *
   * @param {Matrix4} matrix - The transformation matrix.
   * @return {Box3} A reference to this bounding box.
   */
  applyMatrix4(t) {
    return this.isEmpty() ? this : (on[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(t), on[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(t), on[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(t), on[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(t), on[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(t), on[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(t), on[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(t), on[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(t), this.setFromPoints(on), this);
  }
  /**
   * Adds the given offset to both the upper and lower bounds of this bounding box,
   * effectively moving it in 3D space.
   *
   * @param {Vector3} offset - The offset that should be used to translate the bounding box.
   * @return {Box3} A reference to this bounding box.
   */
  translate(t) {
    return this.min.add(t), this.max.add(t), this;
  }
  /**
   * Returns `true` if this bounding box is equal with the given one.
   *
   * @param {Box3} box - The box to test for equality.
   * @return {boolean} Whether this bounding box is equal with the given one.
   */
  equals(t) {
    return t.min.equals(this.min) && t.max.equals(this.max);
  }
}
const on = [
  /* @__PURE__ */ new I(),
  /* @__PURE__ */ new I(),
  /* @__PURE__ */ new I(),
  /* @__PURE__ */ new I(),
  /* @__PURE__ */ new I(),
  /* @__PURE__ */ new I(),
  /* @__PURE__ */ new I(),
  /* @__PURE__ */ new I()
], We = /* @__PURE__ */ new I(), ar = /* @__PURE__ */ new Zn(), Qn = /* @__PURE__ */ new I(), ti = /* @__PURE__ */ new I(), ei = /* @__PURE__ */ new I(), Mn = /* @__PURE__ */ new I(), Sn = /* @__PURE__ */ new I(), Dn = /* @__PURE__ */ new I(), Ci = /* @__PURE__ */ new I(), or = /* @__PURE__ */ new I(), lr = /* @__PURE__ */ new I(), In = /* @__PURE__ */ new I();
function es(i, t, e, n, r) {
  for (let s = 0, a = i.length - 3; s <= a; s += 3) {
    In.fromArray(i, s);
    const o = r.x * Math.abs(In.x) + r.y * Math.abs(In.y) + r.z * Math.abs(In.z), l = t.dot(In), c = e.dot(In), h = n.dot(In);
    if (Math.max(-Math.max(l, c, h), Math.min(l, c, h)) > o)
      return !1;
  }
  return !0;
}
const vh = /* @__PURE__ */ new Zn(), Pi = /* @__PURE__ */ new I(), ns = /* @__PURE__ */ new I();
class Qi {
  /**
   * Constructs a new sphere.
   *
   * @param {Vector3} [center=(0,0,0)] - The center of the sphere
   * @param {number} [radius=-1] - The radius of the sphere.
   */
  constructor(t = new I(), e = -1) {
    this.isSphere = !0, this.center = t, this.radius = e;
  }
  /**
   * Sets the sphere's components by copying the given values.
   *
   * @param {Vector3} center - The center.
   * @param {number} radius - The radius.
   * @return {Sphere} A reference to this sphere.
   */
  set(t, e) {
    return this.center.copy(t), this.radius = e, this;
  }
  /**
   * Computes the minimum bounding sphere for list of points.
   * If the optional center point is given, it is used as the sphere's
   * center. Otherwise, the center of the axis-aligned bounding box
   * encompassing the points is calculated.
   *
   * @param {Array<Vector3>} points - A list of points in 3D space.
   * @param {Vector3} [optionalCenter] - The center of the sphere.
   * @return {Sphere} A reference to this sphere.
   */
  setFromPoints(t, e) {
    const n = this.center;
    e !== void 0 ? n.copy(e) : vh.setFromPoints(t).getCenter(n);
    let r = 0;
    for (let s = 0, a = t.length; s < a; s++)
      r = Math.max(r, n.distanceToSquared(t[s]));
    return this.radius = Math.sqrt(r), this;
  }
  /**
   * Copies the values of the given sphere to this instance.
   *
   * @param {Sphere} sphere - The sphere to copy.
   * @return {Sphere} A reference to this sphere.
   */
  copy(t) {
    return this.center.copy(t.center), this.radius = t.radius, this;
  }
  /**
   * Returns `true` if the sphere is empty (the radius set to a negative number).
   *
   * Spheres with a radius of `0` contain only their center point and are not
   * considered to be empty.
   *
   * @return {boolean} Whether this sphere is empty or not.
   */
  isEmpty() {
    return this.radius < 0;
  }
  /**
   * Makes this sphere empty which means in encloses a zero space in 3D.
   *
   * @return {Sphere} A reference to this sphere.
   */
  makeEmpty() {
    return this.center.set(0, 0, 0), this.radius = -1, this;
  }
  /**
   * Returns `true` if this sphere contains the given point inclusive of
   * the surface of the sphere.
   *
   * @param {Vector3} point - The point to check.
   * @return {boolean} Whether this sphere contains the given point or not.
   */
  containsPoint(t) {
    return t.distanceToSquared(this.center) <= this.radius * this.radius;
  }
  /**
   * Returns the closest distance from the boundary of the sphere to the
   * given point. If the sphere contains the point, the distance will
   * be negative.
   *
   * @param {Vector3} point - The point to compute the distance to.
   * @return {number} The distance to the point.
   */
  distanceToPoint(t) {
    return t.distanceTo(this.center) - this.radius;
  }
  /**
   * Returns `true` if this sphere intersects with the given one.
   *
   * @param {Sphere} sphere - The sphere to test.
   * @return {boolean} Whether this sphere intersects with the given one or not.
   */
  intersectsSphere(t) {
    const e = this.radius + t.radius;
    return t.center.distanceToSquared(this.center) <= e * e;
  }
  /**
   * Returns `true` if this sphere intersects with the given box.
   *
   * @param {Box3} box - The box to test.
   * @return {boolean} Whether this sphere intersects with the given box or not.
   */
  intersectsBox(t) {
    return t.intersectsSphere(this);
  }
  /**
   * Returns `true` if this sphere intersects with the given plane.
   *
   * @param {Plane} plane - The plane to test.
   * @return {boolean} Whether this sphere intersects with the given plane or not.
   */
  intersectsPlane(t) {
    return Math.abs(t.distanceToPoint(this.center)) <= this.radius;
  }
  /**
   * Clamps a point within the sphere. If the point is outside the sphere, it
   * will clamp it to the closest point on the edge of the sphere. Points
   * already inside the sphere will not be affected.
   *
   * @param {Vector3} point - The plane to clamp.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The clamped point.
   */
  clampPoint(t, e) {
    const n = this.center.distanceToSquared(t);
    return e.copy(t), n > this.radius * this.radius && (e.sub(this.center).normalize(), e.multiplyScalar(this.radius).add(this.center)), e;
  }
  /**
   * Returns a bounding box that encloses this sphere.
   *
   * @param {Box3} target - The target box that is used to store the method's result.
   * @return {Box3} The bounding box that encloses this sphere.
   */
  getBoundingBox(t) {
    return this.isEmpty() ? (t.makeEmpty(), t) : (t.set(this.center, this.center), t.expandByScalar(this.radius), t);
  }
  /**
   * Transforms this sphere with the given 4x4 transformation matrix.
   *
   * @param {Matrix4} matrix - The transformation matrix.
   * @return {Sphere} A reference to this sphere.
   */
  applyMatrix4(t) {
    return this.center.applyMatrix4(t), this.radius = this.radius * t.getMaxScaleOnAxis(), this;
  }
  /**
   * Translates the sphere's center by the given offset.
   *
   * @param {Vector3} offset - The offset.
   * @return {Sphere} A reference to this sphere.
   */
  translate(t) {
    return this.center.add(t), this;
  }
  /**
   * Expands the boundaries of this sphere to include the given point.
   *
   * @param {Vector3} point - The point to include.
   * @return {Sphere} A reference to this sphere.
   */
  expandByPoint(t) {
    if (this.isEmpty())
      return this.center.copy(t), this.radius = 0, this;
    Pi.subVectors(t, this.center);
    const e = Pi.lengthSq();
    if (e > this.radius * this.radius) {
      const n = Math.sqrt(e), r = (n - this.radius) * 0.5;
      this.center.addScaledVector(Pi, r / n), this.radius += r;
    }
    return this;
  }
  /**
   * Expands this sphere to enclose both the original sphere and the given sphere.
   *
   * @param {Sphere} sphere - The sphere to include.
   * @return {Sphere} A reference to this sphere.
   */
  union(t) {
    return t.isEmpty() ? this : this.isEmpty() ? (this.copy(t), this) : (this.center.equals(t.center) === !0 ? this.radius = Math.max(this.radius, t.radius) : (ns.subVectors(t.center, this.center).setLength(t.radius), this.expandByPoint(Pi.copy(t.center).add(ns)), this.expandByPoint(Pi.copy(t.center).sub(ns))), this);
  }
  /**
   * Returns `true` if this sphere is equal with the given one.
   *
   * @param {Sphere} sphere - The sphere to test for equality.
   * @return {boolean} Whether this bounding sphere is equal with the given one.
   */
  equals(t) {
    return t.center.equals(this.center) && t.radius === this.radius;
  }
  /**
   * Returns a new sphere with copied values from this instance.
   *
   * @return {Sphere} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
}
const ln = /* @__PURE__ */ new I(), is = /* @__PURE__ */ new I(), cr = /* @__PURE__ */ new I(), yn = /* @__PURE__ */ new I(), rs = /* @__PURE__ */ new I(), hr = /* @__PURE__ */ new I(), ss = /* @__PURE__ */ new I();
class xh {
  /**
   * Constructs a new ray.
   *
   * @param {Vector3} [origin=(0,0,0)] - The origin of the ray.
   * @param {Vector3} [direction=(0,0,-1)] - The (normalized) direction of the ray.
   */
  constructor(t = new I(), e = new I(0, 0, -1)) {
    this.origin = t, this.direction = e;
  }
  /**
   * Sets the ray's components by copying the given values.
   *
   * @param {Vector3} origin - The origin.
   * @param {Vector3} direction - The direction.
   * @return {Ray} A reference to this ray.
   */
  set(t, e) {
    return this.origin.copy(t), this.direction.copy(e), this;
  }
  /**
   * Copies the values of the given ray to this instance.
   *
   * @param {Ray} ray - The ray to copy.
   * @return {Ray} A reference to this ray.
   */
  copy(t) {
    return this.origin.copy(t.origin), this.direction.copy(t.direction), this;
  }
  /**
   * Returns a vector that is located at a given distance along this ray.
   *
   * @param {number} t - The distance along the ray to retrieve a position for.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} A position on the ray.
   */
  at(t, e) {
    return e.copy(this.origin).addScaledVector(this.direction, t);
  }
  /**
   * Adjusts the direction of the ray to point at the given vector in world space.
   *
   * @param {Vector3} v - The target position.
   * @return {Ray} A reference to this ray.
   */
  lookAt(t) {
    return this.direction.copy(t).sub(this.origin).normalize(), this;
  }
  /**
   * Shift the origin of this ray along its direction by the given distance.
   *
   * @param {number} t - The distance along the ray to interpolate.
   * @return {Ray} A reference to this ray.
   */
  recast(t) {
    return this.origin.copy(this.at(t, ln)), this;
  }
  /**
   * Returns the point along this ray that is closest to the given point.
   *
   * @param {Vector3} point - A point in 3D space to get the closet location on the ray for.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The closest point on this ray.
   */
  closestPointToPoint(t, e) {
    e.subVectors(t, this.origin);
    const n = e.dot(this.direction);
    return n < 0 ? e.copy(this.origin) : e.copy(this.origin).addScaledVector(this.direction, n);
  }
  /**
   * Returns the distance of the closest approach between this ray and the given point.
   *
   * @param {Vector3} point - A point in 3D space to compute the distance to.
   * @return {number} The distance.
   */
  distanceToPoint(t) {
    return Math.sqrt(this.distanceSqToPoint(t));
  }
  /**
   * Returns the squared distance of the closest approach between this ray and the given point.
   *
   * @param {Vector3} point - A point in 3D space to compute the distance to.
   * @return {number} The squared distance.
   */
  distanceSqToPoint(t) {
    const e = ln.subVectors(t, this.origin).dot(this.direction);
    return e < 0 ? this.origin.distanceToSquared(t) : (ln.copy(this.origin).addScaledVector(this.direction, e), ln.distanceToSquared(t));
  }
  /**
   * Returns the squared distance between this ray and the given line segment.
   *
   * @param {Vector3} v0 - The start point of the line segment.
   * @param {Vector3} v1 - The end point of the line segment.
   * @param {Vector3} [optionalPointOnRay] - When provided, it receives the point on this ray that is closest to the segment.
   * @param {Vector3} [optionalPointOnSegment] - When provided, it receives the point on the line segment that is closest to this ray.
   * @return {number} The squared distance.
   */
  distanceSqToSegment(t, e, n, r) {
    is.copy(t).add(e).multiplyScalar(0.5), cr.copy(e).sub(t).normalize(), yn.copy(this.origin).sub(is);
    const s = t.distanceTo(e) * 0.5, a = -this.direction.dot(cr), o = yn.dot(this.direction), l = -yn.dot(cr), c = yn.lengthSq(), h = Math.abs(1 - a * a);
    let u, f, d, g;
    if (h > 0)
      if (u = a * l - o, f = a * o - l, g = s * h, u >= 0)
        if (f >= -g)
          if (f <= g) {
            const v = 1 / h;
            u *= v, f *= v, d = u * (u + a * f + 2 * o) + f * (a * u + f + 2 * l) + c;
          } else
            f = s, u = Math.max(0, -(a * f + o)), d = -u * u + f * (f + 2 * l) + c;
        else
          f = -s, u = Math.max(0, -(a * f + o)), d = -u * u + f * (f + 2 * l) + c;
      else
        f <= -g ? (u = Math.max(0, -(-a * s + o)), f = u > 0 ? -s : Math.min(Math.max(-s, -l), s), d = -u * u + f * (f + 2 * l) + c) : f <= g ? (u = 0, f = Math.min(Math.max(-s, -l), s), d = f * (f + 2 * l) + c) : (u = Math.max(0, -(a * s + o)), f = u > 0 ? s : Math.min(Math.max(-s, -l), s), d = -u * u + f * (f + 2 * l) + c);
    else
      f = a > 0 ? -s : s, u = Math.max(0, -(a * f + o)), d = -u * u + f * (f + 2 * l) + c;
    return n && n.copy(this.origin).addScaledVector(this.direction, u), r && r.copy(is).addScaledVector(cr, f), d;
  }
  /**
   * Intersects this ray with the given sphere, returning the intersection
   * point or `null` if there is no intersection.
   *
   * @param {Sphere} sphere - The sphere to intersect.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {?Vector3} The intersection point.
   */
  intersectSphere(t, e) {
    ln.subVectors(t.center, this.origin);
    const n = ln.dot(this.direction), r = ln.dot(ln) - n * n, s = t.radius * t.radius;
    if (r > s) return null;
    const a = Math.sqrt(s - r), o = n - a, l = n + a;
    return l < 0 ? null : o < 0 ? this.at(l, e) : this.at(o, e);
  }
  /**
   * Returns `true` if this ray intersects with the given sphere.
   *
   * @param {Sphere} sphere - The sphere to intersect.
   * @return {boolean} Whether this ray intersects with the given sphere or not.
   */
  intersectsSphere(t) {
    return this.distanceSqToPoint(t.center) <= t.radius * t.radius;
  }
  /**
   * Computes the distance from the ray's origin to the given plane. Returns `null` if the ray
   * does not intersect with the plane.
   *
   * @param {Plane} plane - The plane to compute the distance to.
   * @return {?number} Whether this ray intersects with the given sphere or not.
   */
  distanceToPlane(t) {
    const e = t.normal.dot(this.direction);
    if (e === 0)
      return t.distanceToPoint(this.origin) === 0 ? 0 : null;
    const n = -(this.origin.dot(t.normal) + t.constant) / e;
    return n >= 0 ? n : null;
  }
  /**
   * Intersects this ray with the given plane, returning the intersection
   * point or `null` if there is no intersection.
   *
   * @param {Plane} plane - The plane to intersect.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {?Vector3} The intersection point.
   */
  intersectPlane(t, e) {
    const n = this.distanceToPlane(t);
    return n === null ? null : this.at(n, e);
  }
  /**
   * Returns `true` if this ray intersects with the given plane.
   *
   * @param {Plane} plane - The plane to intersect.
   * @return {boolean} Whether this ray intersects with the given plane or not.
   */
  intersectsPlane(t) {
    const e = t.distanceToPoint(this.origin);
    return e === 0 || t.normal.dot(this.direction) * e < 0;
  }
  /**
   * Intersects this ray with the given bounding box, returning the intersection
   * point or `null` if there is no intersection.
   *
   * @param {Box3} box - The box to intersect.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {?Vector3} The intersection point.
   */
  intersectBox(t, e) {
    let n, r, s, a, o, l;
    const c = 1 / this.direction.x, h = 1 / this.direction.y, u = 1 / this.direction.z, f = this.origin;
    return c >= 0 ? (n = (t.min.x - f.x) * c, r = (t.max.x - f.x) * c) : (n = (t.max.x - f.x) * c, r = (t.min.x - f.x) * c), h >= 0 ? (s = (t.min.y - f.y) * h, a = (t.max.y - f.y) * h) : (s = (t.max.y - f.y) * h, a = (t.min.y - f.y) * h), n > a || s > r || ((s > n || isNaN(n)) && (n = s), (a < r || isNaN(r)) && (r = a), u >= 0 ? (o = (t.min.z - f.z) * u, l = (t.max.z - f.z) * u) : (o = (t.max.z - f.z) * u, l = (t.min.z - f.z) * u), n > l || o > r) || ((o > n || n !== n) && (n = o), (l < r || r !== r) && (r = l), r < 0) ? null : this.at(n >= 0 ? n : r, e);
  }
  /**
   * Returns `true` if this ray intersects with the given box.
   *
   * @param {Box3} box - The box to intersect.
   * @return {boolean} Whether this ray intersects with the given box or not.
   */
  intersectsBox(t) {
    return this.intersectBox(t, ln) !== null;
  }
  /**
   * Intersects this ray with the given triangle, returning the intersection
   * point or `null` if there is no intersection.
   *
   * @param {Vector3} a - The first vertex of the triangle.
   * @param {Vector3} b - The second vertex of the triangle.
   * @param {Vector3} c - The third vertex of the triangle.
   * @param {boolean} backfaceCulling - Whether to use backface culling or not.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {?Vector3} The intersection point.
   */
  intersectTriangle(t, e, n, r, s) {
    rs.subVectors(e, t), hr.subVectors(n, t), ss.crossVectors(rs, hr);
    let a = this.direction.dot(ss), o;
    if (a > 0) {
      if (r) return null;
      o = 1;
    } else if (a < 0)
      o = -1, a = -a;
    else
      return null;
    yn.subVectors(this.origin, t);
    const l = o * this.direction.dot(hr.crossVectors(yn, hr));
    if (l < 0)
      return null;
    const c = o * this.direction.dot(rs.cross(yn));
    if (c < 0 || l + c > a)
      return null;
    const h = -o * yn.dot(ss);
    return h < 0 ? null : this.at(h / a, s);
  }
  /**
   * Transforms this ray with the given 4x4 transformation matrix.
   *
   * @param {Matrix4} matrix4 - The transformation matrix.
   * @return {Ray} A reference to this ray.
   */
  applyMatrix4(t) {
    return this.origin.applyMatrix4(t), this.direction.transformDirection(t), this;
  }
  /**
   * Returns `true` if this ray is equal with the given one.
   *
   * @param {Ray} ray - The ray to test for equality.
   * @return {boolean} Whether this ray is equal with the given one.
   */
  equals(t) {
    return t.origin.equals(this.origin) && t.direction.equals(this.direction);
  }
  /**
   * Returns a new ray with copied values from this instance.
   *
   * @return {Ray} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
}
class Wt {
  /**
   * Constructs a new 4x4 matrix. The arguments are supposed to be
   * in row-major order. If no arguments are provided, the constructor
   * initializes the matrix as an identity matrix.
   *
   * @param {number} [n11] - 1-1 matrix element.
   * @param {number} [n12] - 1-2 matrix element.
   * @param {number} [n13] - 1-3 matrix element.
   * @param {number} [n14] - 1-4 matrix element.
   * @param {number} [n21] - 2-1 matrix element.
   * @param {number} [n22] - 2-2 matrix element.
   * @param {number} [n23] - 2-3 matrix element.
   * @param {number} [n24] - 2-4 matrix element.
   * @param {number} [n31] - 3-1 matrix element.
   * @param {number} [n32] - 3-2 matrix element.
   * @param {number} [n33] - 3-3 matrix element.
   * @param {number} [n34] - 3-4 matrix element.
   * @param {number} [n41] - 4-1 matrix element.
   * @param {number} [n42] - 4-2 matrix element.
   * @param {number} [n43] - 4-3 matrix element.
   * @param {number} [n44] - 4-4 matrix element.
   */
  constructor(t, e, n, r, s, a, o, l, c, h, u, f, d, g, v, m) {
    Wt.prototype.isMatrix4 = !0, this.elements = [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ], t !== void 0 && this.set(t, e, n, r, s, a, o, l, c, h, u, f, d, g, v, m);
  }
  /**
   * Sets the elements of the matrix.The arguments are supposed to be
   * in row-major order.
   *
   * @param {number} [n11] - 1-1 matrix element.
   * @param {number} [n12] - 1-2 matrix element.
   * @param {number} [n13] - 1-3 matrix element.
   * @param {number} [n14] - 1-4 matrix element.
   * @param {number} [n21] - 2-1 matrix element.
   * @param {number} [n22] - 2-2 matrix element.
   * @param {number} [n23] - 2-3 matrix element.
   * @param {number} [n24] - 2-4 matrix element.
   * @param {number} [n31] - 3-1 matrix element.
   * @param {number} [n32] - 3-2 matrix element.
   * @param {number} [n33] - 3-3 matrix element.
   * @param {number} [n34] - 3-4 matrix element.
   * @param {number} [n41] - 4-1 matrix element.
   * @param {number} [n42] - 4-2 matrix element.
   * @param {number} [n43] - 4-3 matrix element.
   * @param {number} [n44] - 4-4 matrix element.
   * @return {Matrix4} A reference to this matrix.
   */
  set(t, e, n, r, s, a, o, l, c, h, u, f, d, g, v, m) {
    const p = this.elements;
    return p[0] = t, p[4] = e, p[8] = n, p[12] = r, p[1] = s, p[5] = a, p[9] = o, p[13] = l, p[2] = c, p[6] = h, p[10] = u, p[14] = f, p[3] = d, p[7] = g, p[11] = v, p[15] = m, this;
  }
  /**
   * Sets this matrix to the 4x4 identity matrix.
   *
   * @return {Matrix4} A reference to this matrix.
   */
  identity() {
    return this.set(
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Returns a matrix with copied values from this instance.
   *
   * @return {Matrix4} A clone of this instance.
   */
  clone() {
    return new Wt().fromArray(this.elements);
  }
  /**
   * Copies the values of the given matrix to this instance.
   *
   * @param {Matrix4} m - The matrix to copy.
   * @return {Matrix4} A reference to this matrix.
   */
  copy(t) {
    const e = this.elements, n = t.elements;
    return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[8] = n[8], e[9] = n[9], e[10] = n[10], e[11] = n[11], e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15], this;
  }
  /**
   * Copies the translation component of the given matrix
   * into this matrix's translation component.
   *
   * @param {Matrix4} m - The matrix to copy the translation component.
   * @return {Matrix4} A reference to this matrix.
   */
  copyPosition(t) {
    const e = this.elements, n = t.elements;
    return e[12] = n[12], e[13] = n[13], e[14] = n[14], this;
  }
  /**
   * Set the upper 3x3 elements of this matrix to the values of given 3x3 matrix.
   *
   * @param {Matrix3} m - The 3x3 matrix.
   * @return {Matrix4} A reference to this matrix.
   */
  setFromMatrix3(t) {
    const e = t.elements;
    return this.set(
      e[0],
      e[3],
      e[6],
      0,
      e[1],
      e[4],
      e[7],
      0,
      e[2],
      e[5],
      e[8],
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Extracts the basis of this matrix into the three axis vectors provided.
   *
   * @param {Vector3} xAxis - The basis's x axis.
   * @param {Vector3} yAxis - The basis's y axis.
   * @param {Vector3} zAxis - The basis's z axis.
   * @return {Matrix4} A reference to this matrix.
   */
  extractBasis(t, e, n) {
    return t.setFromMatrixColumn(this, 0), e.setFromMatrixColumn(this, 1), n.setFromMatrixColumn(this, 2), this;
  }
  /**
   * Sets the given basis vectors to this matrix.
   *
   * @param {Vector3} xAxis - The basis's x axis.
   * @param {Vector3} yAxis - The basis's y axis.
   * @param {Vector3} zAxis - The basis's z axis.
   * @return {Matrix4} A reference to this matrix.
   */
  makeBasis(t, e, n) {
    return this.set(
      t.x,
      e.x,
      n.x,
      0,
      t.y,
      e.y,
      n.y,
      0,
      t.z,
      e.z,
      n.z,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Extracts the rotation component of the given matrix
   * into this matrix's rotation component.
   *
   * Note: This method does not support reflection matrices.
   *
   * @param {Matrix4} m - The matrix.
   * @return {Matrix4} A reference to this matrix.
   */
  extractRotation(t) {
    const e = this.elements, n = t.elements, r = 1 / ni.setFromMatrixColumn(t, 0).length(), s = 1 / ni.setFromMatrixColumn(t, 1).length(), a = 1 / ni.setFromMatrixColumn(t, 2).length();
    return e[0] = n[0] * r, e[1] = n[1] * r, e[2] = n[2] * r, e[3] = 0, e[4] = n[4] * s, e[5] = n[5] * s, e[6] = n[6] * s, e[7] = 0, e[8] = n[8] * a, e[9] = n[9] * a, e[10] = n[10] * a, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, this;
  }
  /**
   * Sets the rotation component (the upper left 3x3 matrix) of this matrix to
   * the rotation specified by the given Euler angles. The rest of
   * the matrix is set to the identity. Depending on the {@link Euler#order},
   * there are six possible outcomes. See [this page]{@link https://en.wikipedia.org/wiki/Euler_angles#Rotation_matrix}
   * for a complete list.
   *
   * @param {Euler} euler - The Euler angles.
   * @return {Matrix4} A reference to this matrix.
   */
  makeRotationFromEuler(t) {
    const e = this.elements, n = t.x, r = t.y, s = t.z, a = Math.cos(n), o = Math.sin(n), l = Math.cos(r), c = Math.sin(r), h = Math.cos(s), u = Math.sin(s);
    if (t.order === "XYZ") {
      const f = a * h, d = a * u, g = o * h, v = o * u;
      e[0] = l * h, e[4] = -l * u, e[8] = c, e[1] = d + g * c, e[5] = f - v * c, e[9] = -o * l, e[2] = v - f * c, e[6] = g + d * c, e[10] = a * l;
    } else if (t.order === "YXZ") {
      const f = l * h, d = l * u, g = c * h, v = c * u;
      e[0] = f + v * o, e[4] = g * o - d, e[8] = a * c, e[1] = a * u, e[5] = a * h, e[9] = -o, e[2] = d * o - g, e[6] = v + f * o, e[10] = a * l;
    } else if (t.order === "ZXY") {
      const f = l * h, d = l * u, g = c * h, v = c * u;
      e[0] = f - v * o, e[4] = -a * u, e[8] = g + d * o, e[1] = d + g * o, e[5] = a * h, e[9] = v - f * o, e[2] = -a * c, e[6] = o, e[10] = a * l;
    } else if (t.order === "ZYX") {
      const f = a * h, d = a * u, g = o * h, v = o * u;
      e[0] = l * h, e[4] = g * c - d, e[8] = f * c + v, e[1] = l * u, e[5] = v * c + f, e[9] = d * c - g, e[2] = -c, e[6] = o * l, e[10] = a * l;
    } else if (t.order === "YZX") {
      const f = a * l, d = a * c, g = o * l, v = o * c;
      e[0] = l * h, e[4] = v - f * u, e[8] = g * u + d, e[1] = u, e[5] = a * h, e[9] = -o * h, e[2] = -c * h, e[6] = d * u + g, e[10] = f - v * u;
    } else if (t.order === "XZY") {
      const f = a * l, d = a * c, g = o * l, v = o * c;
      e[0] = l * h, e[4] = -u, e[8] = c * h, e[1] = f * u + v, e[5] = a * h, e[9] = d * u - g, e[2] = g * u - d, e[6] = o * h, e[10] = v * u + f;
    }
    return e[3] = 0, e[7] = 0, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, this;
  }
  /**
   * Sets the rotation component of this matrix to the rotation specified by
   * the given Quaternion as outlined [here]{@link https://en.wikipedia.org/wiki/Rotation_matrix#Quaternion}
   * The rest of the matrix is set to the identity.
   *
   * @param {Quaternion} q - The Quaternion.
   * @return {Matrix4} A reference to this matrix.
   */
  makeRotationFromQuaternion(t) {
    return this.compose(Mh, t, Sh);
  }
  /**
   * Sets the rotation component of the transformation matrix, looking from `eye` towards
   * `target`, and oriented by the up-direction.
   *
   * @param {Vector3} eye - The eye vector.
   * @param {Vector3} target - The target vector.
   * @param {Vector3} up - The up vector.
   * @return {Matrix4} A reference to this matrix.
   */
  lookAt(t, e, n) {
    const r = this.elements;
    return Le.subVectors(t, e), Le.lengthSq() === 0 && (Le.z = 1), Le.normalize(), En.crossVectors(n, Le), En.lengthSq() === 0 && (Math.abs(n.z) === 1 ? Le.x += 1e-4 : Le.z += 1e-4, Le.normalize(), En.crossVectors(n, Le)), En.normalize(), ur.crossVectors(Le, En), r[0] = En.x, r[4] = ur.x, r[8] = Le.x, r[1] = En.y, r[5] = ur.y, r[9] = Le.y, r[2] = En.z, r[6] = ur.z, r[10] = Le.z, this;
  }
  /**
   * Post-multiplies this matrix by the given 4x4 matrix.
   *
   * @param {Matrix4} m - The matrix to multiply with.
   * @return {Matrix4} A reference to this matrix.
   */
  multiply(t) {
    return this.multiplyMatrices(this, t);
  }
  /**
   * Pre-multiplies this matrix by the given 4x4 matrix.
   *
   * @param {Matrix4} m - The matrix to multiply with.
   * @return {Matrix4} A reference to this matrix.
   */
  premultiply(t) {
    return this.multiplyMatrices(t, this);
  }
  /**
   * Multiples the given 4x4 matrices and stores the result
   * in this matrix.
   *
   * @param {Matrix4} a - The first matrix.
   * @param {Matrix4} b - The second matrix.
   * @return {Matrix4} A reference to this matrix.
   */
  multiplyMatrices(t, e) {
    const n = t.elements, r = e.elements, s = this.elements, a = n[0], o = n[4], l = n[8], c = n[12], h = n[1], u = n[5], f = n[9], d = n[13], g = n[2], v = n[6], m = n[10], p = n[14], A = n[3], T = n[7], S = n[11], N = n[15], w = r[0], R = r[4], U = r[8], y = r[12], M = r[1], C = r[5], H = r[9], B = r[13], G = r[2], Z = r[6], W = r[10], Q = r[14], V = r[3], it = r[7], ht = r[11], vt = r[15];
    return s[0] = a * w + o * M + l * G + c * V, s[4] = a * R + o * C + l * Z + c * it, s[8] = a * U + o * H + l * W + c * ht, s[12] = a * y + o * B + l * Q + c * vt, s[1] = h * w + u * M + f * G + d * V, s[5] = h * R + u * C + f * Z + d * it, s[9] = h * U + u * H + f * W + d * ht, s[13] = h * y + u * B + f * Q + d * vt, s[2] = g * w + v * M + m * G + p * V, s[6] = g * R + v * C + m * Z + p * it, s[10] = g * U + v * H + m * W + p * ht, s[14] = g * y + v * B + m * Q + p * vt, s[3] = A * w + T * M + S * G + N * V, s[7] = A * R + T * C + S * Z + N * it, s[11] = A * U + T * H + S * W + N * ht, s[15] = A * y + T * B + S * Q + N * vt, this;
  }
  /**
   * Multiplies every component of the matrix by the given scalar.
   *
   * @param {number} s - The scalar.
   * @return {Matrix4} A reference to this matrix.
   */
  multiplyScalar(t) {
    const e = this.elements;
    return e[0] *= t, e[4] *= t, e[8] *= t, e[12] *= t, e[1] *= t, e[5] *= t, e[9] *= t, e[13] *= t, e[2] *= t, e[6] *= t, e[10] *= t, e[14] *= t, e[3] *= t, e[7] *= t, e[11] *= t, e[15] *= t, this;
  }
  /**
   * Computes and returns the determinant of this matrix.
   *
   * Based on the method outlined [here]{@link http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.html}.
   *
   * @return {number} The determinant.
   */
  determinant() {
    const t = this.elements, e = t[0], n = t[4], r = t[8], s = t[12], a = t[1], o = t[5], l = t[9], c = t[13], h = t[2], u = t[6], f = t[10], d = t[14], g = t[3], v = t[7], m = t[11], p = t[15];
    return g * (+s * l * u - r * c * u - s * o * f + n * c * f + r * o * d - n * l * d) + v * (+e * l * d - e * c * f + s * a * f - r * a * d + r * c * h - s * l * h) + m * (+e * c * u - e * o * d - s * a * u + n * a * d + s * o * h - n * c * h) + p * (-r * o * h - e * l * u + e * o * f + r * a * u - n * a * f + n * l * h);
  }
  /**
   * Transposes this matrix in place.
   *
   * @return {Matrix4} A reference to this matrix.
   */
  transpose() {
    const t = this.elements;
    let e;
    return e = t[1], t[1] = t[4], t[4] = e, e = t[2], t[2] = t[8], t[8] = e, e = t[6], t[6] = t[9], t[9] = e, e = t[3], t[3] = t[12], t[12] = e, e = t[7], t[7] = t[13], t[13] = e, e = t[11], t[11] = t[14], t[14] = e, this;
  }
  /**
   * Sets the position component for this matrix from the given vector,
   * without affecting the rest of the matrix.
   *
   * @param {number|Vector3} x - The x component of the vector or alternatively the vector object.
   * @param {number} y - The y component of the vector.
   * @param {number} z - The z component of the vector.
   * @return {Matrix4} A reference to this matrix.
   */
  setPosition(t, e, n) {
    const r = this.elements;
    return t.isVector3 ? (r[12] = t.x, r[13] = t.y, r[14] = t.z) : (r[12] = t, r[13] = e, r[14] = n), this;
  }
  /**
   * Inverts this matrix, using the [analytic method]{@link https://en.wikipedia.org/wiki/Invertible_matrix#Analytic_solution}.
   * You can not invert with a determinant of zero. If you attempt this, the method produces
   * a zero matrix instead.
   *
   * @return {Matrix4} A reference to this matrix.
   */
  invert() {
    const t = this.elements, e = t[0], n = t[1], r = t[2], s = t[3], a = t[4], o = t[5], l = t[6], c = t[7], h = t[8], u = t[9], f = t[10], d = t[11], g = t[12], v = t[13], m = t[14], p = t[15], A = u * m * c - v * f * c + v * l * d - o * m * d - u * l * p + o * f * p, T = g * f * c - h * m * c - g * l * d + a * m * d + h * l * p - a * f * p, S = h * v * c - g * u * c + g * o * d - a * v * d - h * o * p + a * u * p, N = g * u * l - h * v * l - g * o * f + a * v * f + h * o * m - a * u * m, w = e * A + n * T + r * S + s * N;
    if (w === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const R = 1 / w;
    return t[0] = A * R, t[1] = (v * f * s - u * m * s - v * r * d + n * m * d + u * r * p - n * f * p) * R, t[2] = (o * m * s - v * l * s + v * r * c - n * m * c - o * r * p + n * l * p) * R, t[3] = (u * l * s - o * f * s - u * r * c + n * f * c + o * r * d - n * l * d) * R, t[4] = T * R, t[5] = (h * m * s - g * f * s + g * r * d - e * m * d - h * r * p + e * f * p) * R, t[6] = (g * l * s - a * m * s - g * r * c + e * m * c + a * r * p - e * l * p) * R, t[7] = (a * f * s - h * l * s + h * r * c - e * f * c - a * r * d + e * l * d) * R, t[8] = S * R, t[9] = (g * u * s - h * v * s - g * n * d + e * v * d + h * n * p - e * u * p) * R, t[10] = (a * v * s - g * o * s + g * n * c - e * v * c - a * n * p + e * o * p) * R, t[11] = (h * o * s - a * u * s - h * n * c + e * u * c + a * n * d - e * o * d) * R, t[12] = N * R, t[13] = (h * v * r - g * u * r + g * n * f - e * v * f - h * n * m + e * u * m) * R, t[14] = (g * o * r - a * v * r - g * n * l + e * v * l + a * n * m - e * o * m) * R, t[15] = (a * u * r - h * o * r + h * n * l - e * u * l - a * n * f + e * o * f) * R, this;
  }
  /**
   * Multiplies the columns of this matrix by the given vector.
   *
   * @param {Vector3} v - The scale vector.
   * @return {Matrix4} A reference to this matrix.
   */
  scale(t) {
    const e = this.elements, n = t.x, r = t.y, s = t.z;
    return e[0] *= n, e[4] *= r, e[8] *= s, e[1] *= n, e[5] *= r, e[9] *= s, e[2] *= n, e[6] *= r, e[10] *= s, e[3] *= n, e[7] *= r, e[11] *= s, this;
  }
  /**
   * Gets the maximum scale value of the three axes.
   *
   * @return {number} The maximum scale.
   */
  getMaxScaleOnAxis() {
    const t = this.elements, e = t[0] * t[0] + t[1] * t[1] + t[2] * t[2], n = t[4] * t[4] + t[5] * t[5] + t[6] * t[6], r = t[8] * t[8] + t[9] * t[9] + t[10] * t[10];
    return Math.sqrt(Math.max(e, n, r));
  }
  /**
   * Sets this matrix as a translation transform from the given vector.
   *
   * @param {number|Vector3} x - The amount to translate in the X axis or alternatively a translation vector.
   * @param {number} y - The amount to translate in the Y axis.
   * @param {number} z - The amount to translate in the z axis.
   * @return {Matrix4} A reference to this matrix.
   */
  makeTranslation(t, e, n) {
    return t.isVector3 ? this.set(
      1,
      0,
      0,
      t.x,
      0,
      1,
      0,
      t.y,
      0,
      0,
      1,
      t.z,
      0,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      0,
      t,
      0,
      1,
      0,
      e,
      0,
      0,
      1,
      n,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a rotational transformation around the X axis by
   * the given angle.
   *
   * @param {number} theta - The rotation in radians.
   * @return {Matrix4} A reference to this matrix.
   */
  makeRotationX(t) {
    const e = Math.cos(t), n = Math.sin(t);
    return this.set(
      1,
      0,
      0,
      0,
      0,
      e,
      -n,
      0,
      0,
      n,
      e,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a rotational transformation around the Y axis by
   * the given angle.
   *
   * @param {number} theta - The rotation in radians.
   * @return {Matrix4} A reference to this matrix.
   */
  makeRotationY(t) {
    const e = Math.cos(t), n = Math.sin(t);
    return this.set(
      e,
      0,
      n,
      0,
      0,
      1,
      0,
      0,
      -n,
      0,
      e,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a rotational transformation around the Z axis by
   * the given angle.
   *
   * @param {number} theta - The rotation in radians.
   * @return {Matrix4} A reference to this matrix.
   */
  makeRotationZ(t) {
    const e = Math.cos(t), n = Math.sin(t);
    return this.set(
      e,
      -n,
      0,
      0,
      n,
      e,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a rotational transformation around the given axis by
   * the given angle.
   *
   * This is a somewhat controversial but mathematically sound alternative to
   * rotating via Quaternions. See the discussion [here]{@link https://www.gamedev.net/articles/programming/math-and-physics/do-we-really-need-quaternions-r1199}.
   *
   * @param {Vector3} axis - The normalized rotation axis.
   * @param {number} angle - The rotation in radians.
   * @return {Matrix4} A reference to this matrix.
   */
  makeRotationAxis(t, e) {
    const n = Math.cos(e), r = Math.sin(e), s = 1 - n, a = t.x, o = t.y, l = t.z, c = s * a, h = s * o;
    return this.set(
      c * a + n,
      c * o - r * l,
      c * l + r * o,
      0,
      c * o + r * l,
      h * o + n,
      h * l - r * a,
      0,
      c * l - r * o,
      h * l + r * a,
      s * l * l + n,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a scale transformation.
   *
   * @param {number} x - The amount to scale in the X axis.
   * @param {number} y - The amount to scale in the Y axis.
   * @param {number} z - The amount to scale in the Z axis.
   * @return {Matrix4} A reference to this matrix.
   */
  makeScale(t, e, n) {
    return this.set(
      t,
      0,
      0,
      0,
      0,
      e,
      0,
      0,
      0,
      0,
      n,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a shear transformation.
   *
   * @param {number} xy - The amount to shear X by Y.
   * @param {number} xz - The amount to shear X by Z.
   * @param {number} yx - The amount to shear Y by X.
   * @param {number} yz - The amount to shear Y by Z.
   * @param {number} zx - The amount to shear Z by X.
   * @param {number} zy - The amount to shear Z by Y.
   * @return {Matrix4} A reference to this matrix.
   */
  makeShear(t, e, n, r, s, a) {
    return this.set(
      1,
      n,
      s,
      0,
      t,
      1,
      a,
      0,
      e,
      r,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix to the transformation composed of the given position,
   * rotation (Quaternion) and scale.
   *
   * @param {Vector3} position - The position vector.
   * @param {Quaternion} quaternion - The rotation as a Quaternion.
   * @param {Vector3} scale - The scale vector.
   * @return {Matrix4} A reference to this matrix.
   */
  compose(t, e, n) {
    const r = this.elements, s = e._x, a = e._y, o = e._z, l = e._w, c = s + s, h = a + a, u = o + o, f = s * c, d = s * h, g = s * u, v = a * h, m = a * u, p = o * u, A = l * c, T = l * h, S = l * u, N = n.x, w = n.y, R = n.z;
    return r[0] = (1 - (v + p)) * N, r[1] = (d + S) * N, r[2] = (g - T) * N, r[3] = 0, r[4] = (d - S) * w, r[5] = (1 - (f + p)) * w, r[6] = (m + A) * w, r[7] = 0, r[8] = (g + T) * R, r[9] = (m - A) * R, r[10] = (1 - (f + v)) * R, r[11] = 0, r[12] = t.x, r[13] = t.y, r[14] = t.z, r[15] = 1, this;
  }
  /**
   * Decomposes this matrix into its position, rotation and scale components
   * and provides the result in the given objects.
   *
   * Note: Not all matrices are decomposable in this way. For example, if an
   * object has a non-uniformly scaled parent, then the object's world matrix
   * may not be decomposable, and this method may not be appropriate.
   *
   * @param {Vector3} position - The position vector.
   * @param {Quaternion} quaternion - The rotation as a Quaternion.
   * @param {Vector3} scale - The scale vector.
   * @return {Matrix4} A reference to this matrix.
   */
  decompose(t, e, n) {
    const r = this.elements;
    let s = ni.set(r[0], r[1], r[2]).length();
    const a = ni.set(r[4], r[5], r[6]).length(), o = ni.set(r[8], r[9], r[10]).length();
    this.determinant() < 0 && (s = -s), t.x = r[12], t.y = r[13], t.z = r[14], Xe.copy(this);
    const c = 1 / s, h = 1 / a, u = 1 / o;
    return Xe.elements[0] *= c, Xe.elements[1] *= c, Xe.elements[2] *= c, Xe.elements[4] *= h, Xe.elements[5] *= h, Xe.elements[6] *= h, Xe.elements[8] *= u, Xe.elements[9] *= u, Xe.elements[10] *= u, e.setFromRotationMatrix(Xe), n.x = s, n.y = a, n.z = o, this;
  }
  /**
  	 * Creates a perspective projection matrix. This is used internally by
  	 * {@link PerspectiveCamera#updateProjectionMatrix}.
  
  	 * @param {number} left - Left boundary of the viewing frustum at the near plane.
  	 * @param {number} right - Right boundary of the viewing frustum at the near plane.
  	 * @param {number} top - Top boundary of the viewing frustum at the near plane.
  	 * @param {number} bottom - Bottom boundary of the viewing frustum at the near plane.
  	 * @param {number} near - The distance from the camera to the near plane.
  	 * @param {number} far - The distance from the camera to the far plane.
  	 * @param {(WebGLCoordinateSystem|WebGPUCoordinateSystem)} [coordinateSystem=WebGLCoordinateSystem] - The coordinate system.
  	 * @return {Matrix4} A reference to this matrix.
  	 */
  makePerspective(t, e, n, r, s, a, o = mn) {
    const l = this.elements, c = 2 * s / (e - t), h = 2 * s / (n - r), u = (e + t) / (e - t), f = (n + r) / (n - r);
    let d, g;
    if (o === mn)
      d = -(a + s) / (a - s), g = -2 * a * s / (a - s);
    else if (o === kr)
      d = -a / (a - s), g = -a * s / (a - s);
    else
      throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + o);
    return l[0] = c, l[4] = 0, l[8] = u, l[12] = 0, l[1] = 0, l[5] = h, l[9] = f, l[13] = 0, l[2] = 0, l[6] = 0, l[10] = d, l[14] = g, l[3] = 0, l[7] = 0, l[11] = -1, l[15] = 0, this;
  }
  /**
  	 * Creates a orthographic projection matrix. This is used internally by
  	 * {@link OrthographicCamera#updateProjectionMatrix}.
  
  	 * @param {number} left - Left boundary of the viewing frustum at the near plane.
  	 * @param {number} right - Right boundary of the viewing frustum at the near plane.
  	 * @param {number} top - Top boundary of the viewing frustum at the near plane.
  	 * @param {number} bottom - Bottom boundary of the viewing frustum at the near plane.
  	 * @param {number} near - The distance from the camera to the near plane.
  	 * @param {number} far - The distance from the camera to the far plane.
  	 * @param {(WebGLCoordinateSystem|WebGPUCoordinateSystem)} [coordinateSystem=WebGLCoordinateSystem] - The coordinate system.
  	 * @return {Matrix4} A reference to this matrix.
  	 */
  makeOrthographic(t, e, n, r, s, a, o = mn) {
    const l = this.elements, c = 1 / (e - t), h = 1 / (n - r), u = 1 / (a - s), f = (e + t) * c, d = (n + r) * h;
    let g, v;
    if (o === mn)
      g = (a + s) * u, v = -2 * u;
    else if (o === kr)
      g = s * u, v = -1 * u;
    else
      throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + o);
    return l[0] = 2 * c, l[4] = 0, l[8] = 0, l[12] = -f, l[1] = 0, l[5] = 2 * h, l[9] = 0, l[13] = -d, l[2] = 0, l[6] = 0, l[10] = v, l[14] = -g, l[3] = 0, l[7] = 0, l[11] = 0, l[15] = 1, this;
  }
  /**
   * Returns `true` if this matrix is equal with the given one.
   *
   * @param {Matrix4} matrix - The matrix to test for equality.
   * @return {boolean} Whether this matrix is equal with the given one.
   */
  equals(t) {
    const e = this.elements, n = t.elements;
    for (let r = 0; r < 16; r++)
      if (e[r] !== n[r]) return !1;
    return !0;
  }
  /**
   * Sets the elements of the matrix from the given array.
   *
   * @param {Array<number>} array - The matrix elements in column-major order.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Matrix4} A reference to this matrix.
   */
  fromArray(t, e = 0) {
    for (let n = 0; n < 16; n++)
      this.elements[n] = t[n + e];
    return this;
  }
  /**
   * Writes the elements of this matrix to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number>} [array=[]] - The target array holding the matrix elements in column-major order.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number>} The matrix elements in column-major order.
   */
  toArray(t = [], e = 0) {
    const n = this.elements;
    return t[e] = n[0], t[e + 1] = n[1], t[e + 2] = n[2], t[e + 3] = n[3], t[e + 4] = n[4], t[e + 5] = n[5], t[e + 6] = n[6], t[e + 7] = n[7], t[e + 8] = n[8], t[e + 9] = n[9], t[e + 10] = n[10], t[e + 11] = n[11], t[e + 12] = n[12], t[e + 13] = n[13], t[e + 14] = n[14], t[e + 15] = n[15], t;
  }
}
const ni = /* @__PURE__ */ new I(), Xe = /* @__PURE__ */ new Wt(), Mh = /* @__PURE__ */ new I(0, 0, 0), Sh = /* @__PURE__ */ new I(1, 1, 1), En = /* @__PURE__ */ new I(), ur = /* @__PURE__ */ new I(), Le = /* @__PURE__ */ new I(), eo = /* @__PURE__ */ new Wt(), no = /* @__PURE__ */ new Ai();
class rn {
  /**
   * Constructs a new euler instance.
   *
   * @param {number} [x=0] - The angle of the x axis in radians.
   * @param {number} [y=0] - The angle of the y axis in radians.
   * @param {number} [z=0] - The angle of the z axis in radians.
   * @param {string} [order=Euler.DEFAULT_ORDER] - A string representing the order that the rotations are applied.
   */
  constructor(t = 0, e = 0, n = 0, r = rn.DEFAULT_ORDER) {
    this.isEuler = !0, this._x = t, this._y = e, this._z = n, this._order = r;
  }
  /**
   * The angle of the x axis in radians.
   *
   * @type {number}
   * @default 0
   */
  get x() {
    return this._x;
  }
  set x(t) {
    this._x = t, this._onChangeCallback();
  }
  /**
   * The angle of the y axis in radians.
   *
   * @type {number}
   * @default 0
   */
  get y() {
    return this._y;
  }
  set y(t) {
    this._y = t, this._onChangeCallback();
  }
  /**
   * The angle of the z axis in radians.
   *
   * @type {number}
   * @default 0
   */
  get z() {
    return this._z;
  }
  set z(t) {
    this._z = t, this._onChangeCallback();
  }
  /**
   * A string representing the order that the rotations are applied.
   *
   * @type {string}
   * @default 'XYZ'
   */
  get order() {
    return this._order;
  }
  set order(t) {
    this._order = t, this._onChangeCallback();
  }
  /**
   * Sets the Euler components.
   *
   * @param {number} x - The angle of the x axis in radians.
   * @param {number} y - The angle of the y axis in radians.
   * @param {number} z - The angle of the z axis in radians.
   * @param {string} [order] - A string representing the order that the rotations are applied.
   * @return {Euler} A reference to this Euler instance.
   */
  set(t, e, n, r = this._order) {
    return this._x = t, this._y = e, this._z = n, this._order = r, this._onChangeCallback(), this;
  }
  /**
   * Returns a new Euler instance with copied values from this instance.
   *
   * @return {Euler} A clone of this instance.
   */
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._order);
  }
  /**
   * Copies the values of the given Euler instance to this instance.
   *
   * @param {Euler} euler - The Euler instance to copy.
   * @return {Euler} A reference to this Euler instance.
   */
  copy(t) {
    return this._x = t._x, this._y = t._y, this._z = t._z, this._order = t._order, this._onChangeCallback(), this;
  }
  /**
   * Sets the angles of this Euler instance from a pure rotation matrix.
   *
   * @param {Matrix4} m - A 4x4 matrix of which the upper 3x3 of matrix is a pure rotation matrix (i.e. unscaled).
   * @param {string} [order] - A string representing the order that the rotations are applied.
   * @param {boolean} [update=true] - Whether the internal `onChange` callback should be executed or not.
   * @return {Euler} A reference to this Euler instance.
   */
  setFromRotationMatrix(t, e = this._order, n = !0) {
    const r = t.elements, s = r[0], a = r[4], o = r[8], l = r[1], c = r[5], h = r[9], u = r[2], f = r[6], d = r[10];
    switch (e) {
      case "XYZ":
        this._y = Math.asin(Nt(o, -1, 1)), Math.abs(o) < 0.9999999 ? (this._x = Math.atan2(-h, d), this._z = Math.atan2(-a, s)) : (this._x = Math.atan2(f, c), this._z = 0);
        break;
      case "YXZ":
        this._x = Math.asin(-Nt(h, -1, 1)), Math.abs(h) < 0.9999999 ? (this._y = Math.atan2(o, d), this._z = Math.atan2(l, c)) : (this._y = Math.atan2(-u, s), this._z = 0);
        break;
      case "ZXY":
        this._x = Math.asin(Nt(f, -1, 1)), Math.abs(f) < 0.9999999 ? (this._y = Math.atan2(-u, d), this._z = Math.atan2(-a, c)) : (this._y = 0, this._z = Math.atan2(l, s));
        break;
      case "ZYX":
        this._y = Math.asin(-Nt(u, -1, 1)), Math.abs(u) < 0.9999999 ? (this._x = Math.atan2(f, d), this._z = Math.atan2(l, s)) : (this._x = 0, this._z = Math.atan2(-a, c));
        break;
      case "YZX":
        this._z = Math.asin(Nt(l, -1, 1)), Math.abs(l) < 0.9999999 ? (this._x = Math.atan2(-h, c), this._y = Math.atan2(-u, s)) : (this._x = 0, this._y = Math.atan2(o, d));
        break;
      case "XZY":
        this._z = Math.asin(-Nt(a, -1, 1)), Math.abs(a) < 0.9999999 ? (this._x = Math.atan2(f, c), this._y = Math.atan2(o, s)) : (this._x = Math.atan2(-h, d), this._y = 0);
        break;
      default:
        console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + e);
    }
    return this._order = e, n === !0 && this._onChangeCallback(), this;
  }
  /**
   * Sets the angles of this Euler instance from a normalized quaternion.
   *
   * @param {Quaternion} q - A normalized Quaternion.
   * @param {string} [order] - A string representing the order that the rotations are applied.
   * @param {boolean} [update=true] - Whether the internal `onChange` callback should be executed or not.
   * @return {Euler} A reference to this Euler instance.
   */
  setFromQuaternion(t, e, n) {
    return eo.makeRotationFromQuaternion(t), this.setFromRotationMatrix(eo, e, n);
  }
  /**
   * Sets the angles of this Euler instance from the given vector.
   *
   * @param {Vector3} v - The vector.
   * @param {string} [order] - A string representing the order that the rotations are applied.
   * @return {Euler} A reference to this Euler instance.
   */
  setFromVector3(t, e = this._order) {
    return this.set(t.x, t.y, t.z, e);
  }
  /**
   * Resets the euler angle with a new order by creating a quaternion from this
   * euler angle and then setting this euler angle with the quaternion and the
   * new order.
   *
   * Warning: This discards revolution information.
   *
   * @param {string} [newOrder] - A string representing the new order that the rotations are applied.
   * @return {Euler} A reference to this Euler instance.
   */
  reorder(t) {
    return no.setFromEuler(this), this.setFromQuaternion(no, t);
  }
  /**
   * Returns `true` if this Euler instance is equal with the given one.
   *
   * @param {Euler} euler - The Euler instance to test for equality.
   * @return {boolean} Whether this Euler instance is equal with the given one.
   */
  equals(t) {
    return t._x === this._x && t._y === this._y && t._z === this._z && t._order === this._order;
  }
  /**
   * Sets this Euler instance's components to values from the given array. The first three
   * entries of the array are assign to the x,y and z components. An optional fourth entry
   * defines the Euler order.
   *
   * @param {Array<number,number,number,?string>} array - An array holding the Euler component values.
   * @return {Euler} A reference to this Euler instance.
   */
  fromArray(t) {
    return this._x = t[0], this._y = t[1], this._z = t[2], t[3] !== void 0 && (this._order = t[3]), this._onChangeCallback(), this;
  }
  /**
   * Writes the components of this Euler instance to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number,number,number,string>} [array=[]] - The target array holding the Euler components.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number,number,number,string>} The Euler components.
   */
  toArray(t = [], e = 0) {
    return t[e] = this._x, t[e + 1] = this._y, t[e + 2] = this._z, t[e + 3] = this._order, t;
  }
  _onChange(t) {
    return this._onChangeCallback = t, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._order;
  }
}
rn.DEFAULT_ORDER = "XYZ";
class Dl {
  /**
   * Constructs a new layers instance, with membership
   * initially set to layer `0`.
   */
  constructor() {
    this.mask = 1;
  }
  /**
   * Sets membership to the given layer, and remove membership all other layers.
   *
   * @param {number} layer - The layer to set.
   */
  set(t) {
    this.mask = (1 << t | 0) >>> 0;
  }
  /**
   * Adds membership of the given layer.
   *
   * @param {number} layer - The layer to enable.
   */
  enable(t) {
    this.mask |= 1 << t | 0;
  }
  /**
   * Adds membership to all layers.
   */
  enableAll() {
    this.mask = -1;
  }
  /**
   * Toggles the membership of the given layer.
   *
   * @param {number} layer - The layer to toggle.
   */
  toggle(t) {
    this.mask ^= 1 << t | 0;
  }
  /**
   * Removes membership of the given layer.
   *
   * @param {number} layer - The layer to enable.
   */
  disable(t) {
    this.mask &= ~(1 << t | 0);
  }
  /**
   * Removes the membership from all layers.
   */
  disableAll() {
    this.mask = 0;
  }
  /**
   * Returns `true` if this and the given layers object have at least one
   * layer in common.
   *
   * @param {Layers} layers - The layers to test.
   * @return {boolean } Whether this and the given layers object have at least one layer in common or not.
   */
  test(t) {
    return (this.mask & t.mask) !== 0;
  }
  /**
   * Returns `true` if the given layer is enabled.
   *
   * @param {number} layer - The layer to test.
   * @return {boolean } Whether the given layer is enabled or not.
   */
  isEnabled(t) {
    return (this.mask & (1 << t | 0)) !== 0;
  }
}
let yh = 0;
const io = /* @__PURE__ */ new I(), ii = /* @__PURE__ */ new Ai(), cn = /* @__PURE__ */ new Wt(), dr = /* @__PURE__ */ new I(), Li = /* @__PURE__ */ new I(), Eh = /* @__PURE__ */ new I(), Th = /* @__PURE__ */ new Ai(), ro = /* @__PURE__ */ new I(1, 0, 0), so = /* @__PURE__ */ new I(0, 1, 0), ao = /* @__PURE__ */ new I(0, 0, 1), oo = { type: "added" }, Ah = { type: "removed" }, ri = { type: "childadded", child: null }, as = { type: "childremoved", child: null };
class _e extends Ei {
  /**
   * Constructs a new 3D object.
   */
  constructor() {
    super(), this.isObject3D = !0, Object.defineProperty(this, "id", { value: yh++ }), this.uuid = Ti(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = _e.DEFAULT_UP.clone();
    const t = new I(), e = new rn(), n = new Ai(), r = new I(1, 1, 1);
    function s() {
      n.setFromEuler(e, !1);
    }
    function a() {
      e.setFromQuaternion(n, void 0, !1);
    }
    e._onChange(s), n._onChange(a), Object.defineProperties(this, {
      /**
       * Represents the object's local position.
       *
       * @name Object3D#position
       * @type {Vector3}
       * @default (0,0,0)
       */
      position: {
        configurable: !0,
        enumerable: !0,
        value: t
      },
      /**
       * Represents the object's local rotation as Euler angles, in radians.
       *
       * @name Object3D#rotation
       * @type {Euler}
       * @default (0,0,0)
       */
      rotation: {
        configurable: !0,
        enumerable: !0,
        value: e
      },
      /**
       * Represents the object's local rotation as Quaternions.
       *
       * @name Object3D#quaternion
       * @type {Quaternion}
       */
      quaternion: {
        configurable: !0,
        enumerable: !0,
        value: n
      },
      /**
       * Represents the object's local scale.
       *
       * @name Object3D#scale
       * @type {Vector3}
       * @default (1,1,1)
       */
      scale: {
        configurable: !0,
        enumerable: !0,
        value: r
      },
      /**
       * Represents the object's model-view matrix.
       *
       * @name Object3D#modelViewMatrix
       * @type {Matrix4}
       */
      modelViewMatrix: {
        value: new Wt()
      },
      /**
       * Represents the object's normal matrix.
       *
       * @name Object3D#normalMatrix
       * @type {Matrix3}
       */
      normalMatrix: {
        value: new Lt()
      }
    }), this.matrix = new Wt(), this.matrixWorld = new Wt(), this.matrixAutoUpdate = _e.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = _e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = !1, this.layers = new Dl(), this.visible = !0, this.castShadow = !1, this.receiveShadow = !1, this.frustumCulled = !0, this.renderOrder = 0, this.animations = [], this.customDepthMaterial = void 0, this.customDistanceMaterial = void 0, this.userData = {};
  }
  /**
   * A callback that is executed immediately before a 3D object is rendered to a shadow map.
   *
   * @param {Renderer|WebGLRenderer} renderer - The renderer.
   * @param {Object3D} object - The 3D object.
   * @param {Camera} camera - The camera that is used to render the scene.
   * @param {Camera} shadowCamera - The shadow camera.
   * @param {BufferGeometry} geometry - The 3D object's geometry.
   * @param {Material} depthMaterial - The depth material.
   * @param {Object} group - The geometry group data.
   */
  onBeforeShadow() {
  }
  /**
   * A callback that is executed immediately after a 3D object is rendered to a shadow map.
   *
   * @param {Renderer|WebGLRenderer} renderer - The renderer.
   * @param {Object3D} object - The 3D object.
   * @param {Camera} camera - The camera that is used to render the scene.
   * @param {Camera} shadowCamera - The shadow camera.
   * @param {BufferGeometry} geometry - The 3D object's geometry.
   * @param {Material} depthMaterial - The depth material.
   * @param {Object} group - The geometry group data.
   */
  onAfterShadow() {
  }
  /**
   * A callback that is executed immediately before a 3D object is rendered.
   *
   * @param {Renderer|WebGLRenderer} renderer - The renderer.
   * @param {Object3D} object - The 3D object.
   * @param {Camera} camera - The camera that is used to render the scene.
   * @param {BufferGeometry} geometry - The 3D object's geometry.
   * @param {Material} material - The 3D object's material.
   * @param {Object} group - The geometry group data.
   */
  onBeforeRender() {
  }
  /**
   * A callback that is executed immediately after a 3D object is rendered.
   *
   * @param {Renderer|WebGLRenderer} renderer - The renderer.
   * @param {Object3D} object - The 3D object.
   * @param {Camera} camera - The camera that is used to render the scene.
   * @param {BufferGeometry} geometry - The 3D object's geometry.
   * @param {Material} material - The 3D object's material.
   * @param {Object} group - The geometry group data.
   */
  onAfterRender() {
  }
  /**
   * Applies the given transformation matrix to the object and updates the object's position,
   * rotation and scale.
   *
   * @param {Matrix4} matrix - The transformation matrix.
   */
  applyMatrix4(t) {
    this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(t), this.matrix.decompose(this.position, this.quaternion, this.scale);
  }
  /**
   * Applies a rotation represented by given the quaternion to the 3D object.
   *
   * @param {Quaternion} q - The quaternion.
   * @return {Object3D} A reference to this instance.
   */
  applyQuaternion(t) {
    return this.quaternion.premultiply(t), this;
  }
  /**
   * Sets the given rotation represented as an axis/angle couple to the 3D object.
   *
   * @param {Vector3} axis - The (normalized) axis vector.
   * @param {number} angle - The angle in radians.
   */
  setRotationFromAxisAngle(t, e) {
    this.quaternion.setFromAxisAngle(t, e);
  }
  /**
   * Sets the given rotation represented as Euler angles to the 3D object.
   *
   * @param {Euler} euler - The Euler angles.
   */
  setRotationFromEuler(t) {
    this.quaternion.setFromEuler(t, !0);
  }
  /**
   * Sets the given rotation represented as rotation matrix to the 3D object.
   *
   * @param {Matrix4} m - Although a 4x4 matrix is expected, the upper 3x3 portion must be
   * a pure rotation matrix (i.e, unscaled).
   */
  setRotationFromMatrix(t) {
    this.quaternion.setFromRotationMatrix(t);
  }
  /**
   * Sets the given rotation represented as a Quaternion to the 3D object.
   *
   * @param {Quaternion} q - The Quaternion
   */
  setRotationFromQuaternion(t) {
    this.quaternion.copy(t);
  }
  /**
   * Rotates the 3D object along an axis in local space.
   *
   * @param {Vector3} axis - The (normalized) axis vector.
   * @param {number} angle - The angle in radians.
   * @return {Object3D} A reference to this instance.
   */
  rotateOnAxis(t, e) {
    return ii.setFromAxisAngle(t, e), this.quaternion.multiply(ii), this;
  }
  /**
   * Rotates the 3D object along an axis in world space.
   *
   * @param {Vector3} axis - The (normalized) axis vector.
   * @param {number} angle - The angle in radians.
   * @return {Object3D} A reference to this instance.
   */
  rotateOnWorldAxis(t, e) {
    return ii.setFromAxisAngle(t, e), this.quaternion.premultiply(ii), this;
  }
  /**
   * Rotates the 3D object around its X axis in local space.
   *
   * @param {number} angle - The angle in radians.
   * @return {Object3D} A reference to this instance.
   */
  rotateX(t) {
    return this.rotateOnAxis(ro, t);
  }
  /**
   * Rotates the 3D object around its Y axis in local space.
   *
   * @param {number} angle - The angle in radians.
   * @return {Object3D} A reference to this instance.
   */
  rotateY(t) {
    return this.rotateOnAxis(so, t);
  }
  /**
   * Rotates the 3D object around its Z axis in local space.
   *
   * @param {number} angle - The angle in radians.
   * @return {Object3D} A reference to this instance.
   */
  rotateZ(t) {
    return this.rotateOnAxis(ao, t);
  }
  /**
   * Translate the 3D object by a distance along the given axis in local space.
   *
   * @param {Vector3} axis - The (normalized) axis vector.
   * @param {number} distance - The distance in world units.
   * @return {Object3D} A reference to this instance.
   */
  translateOnAxis(t, e) {
    return io.copy(t).applyQuaternion(this.quaternion), this.position.add(io.multiplyScalar(e)), this;
  }
  /**
   * Translate the 3D object by a distance along its X-axis in local space.
   *
   * @param {number} distance - The distance in world units.
   * @return {Object3D} A reference to this instance.
   */
  translateX(t) {
    return this.translateOnAxis(ro, t);
  }
  /**
   * Translate the 3D object by a distance along its Y-axis in local space.
   *
   * @param {number} distance - The distance in world units.
   * @return {Object3D} A reference to this instance.
   */
  translateY(t) {
    return this.translateOnAxis(so, t);
  }
  /**
   * Translate the 3D object by a distance along its Z-axis in local space.
   *
   * @param {number} distance - The distance in world units.
   * @return {Object3D} A reference to this instance.
   */
  translateZ(t) {
    return this.translateOnAxis(ao, t);
  }
  /**
   * Converts the given vector from this 3D object's local space to world space.
   *
   * @param {Vector3} vector - The vector to convert.
   * @return {Vector3} The converted vector.
   */
  localToWorld(t) {
    return this.updateWorldMatrix(!0, !1), t.applyMatrix4(this.matrixWorld);
  }
  /**
   * Converts the given vector from this 3D object's word space to local space.
   *
   * @param {Vector3} vector - The vector to convert.
   * @return {Vector3} The converted vector.
   */
  worldToLocal(t) {
    return this.updateWorldMatrix(!0, !1), t.applyMatrix4(cn.copy(this.matrixWorld).invert());
  }
  /**
   * Rotates the object to face a point in world space.
   *
   * This method does not support objects having non-uniformly-scaled parent(s).
   *
   * @param {number|Vector3} x - The x coordinate in world space. Alternatively, a vector representing a position in world space
   * @param {number} [y] - The y coordinate in world space.
   * @param {number} [z] - The z coordinate in world space.
   */
  lookAt(t, e, n) {
    t.isVector3 ? dr.copy(t) : dr.set(t, e, n);
    const r = this.parent;
    this.updateWorldMatrix(!0, !1), Li.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? cn.lookAt(Li, dr, this.up) : cn.lookAt(dr, Li, this.up), this.quaternion.setFromRotationMatrix(cn), r && (cn.extractRotation(r.matrixWorld), ii.setFromRotationMatrix(cn), this.quaternion.premultiply(ii.invert()));
  }
  /**
   * Adds the given 3D object as a child to this 3D object. An arbitrary number of
   * objects may be added. Any current parent on an object passed in here will be
   * removed, since an object can have at most one parent.
   *
   * @fires Object3D#added
   * @fires Object3D#childadded
   * @param {Object3D} object - The 3D object to add.
   * @return {Object3D} A reference to this instance.
   */
  add(t) {
    if (arguments.length > 1) {
      for (let e = 0; e < arguments.length; e++)
        this.add(arguments[e]);
      return this;
    }
    return t === this ? (console.error("THREE.Object3D.add: object can't be added as a child of itself.", t), this) : (t && t.isObject3D ? (t.removeFromParent(), t.parent = this, this.children.push(t), t.dispatchEvent(oo), ri.child = t, this.dispatchEvent(ri), ri.child = null) : console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", t), this);
  }
  /**
   * Removes the given 3D object as child from this 3D object.
   * An arbitrary number of objects may be removed.
   *
   * @fires Object3D#removed
   * @fires Object3D#childremoved
   * @param {Object3D} object - The 3D object to remove.
   * @return {Object3D} A reference to this instance.
   */
  remove(t) {
    if (arguments.length > 1) {
      for (let n = 0; n < arguments.length; n++)
        this.remove(arguments[n]);
      return this;
    }
    const e = this.children.indexOf(t);
    return e !== -1 && (t.parent = null, this.children.splice(e, 1), t.dispatchEvent(Ah), as.child = t, this.dispatchEvent(as), as.child = null), this;
  }
  /**
   * Removes this 3D object from its current parent.
   *
   * @fires Object3D#removed
   * @fires Object3D#childremoved
   * @return {Object3D} A reference to this instance.
   */
  removeFromParent() {
    const t = this.parent;
    return t !== null && t.remove(this), this;
  }
  /**
   * Removes all child objects.
   *
   * @fires Object3D#removed
   * @fires Object3D#childremoved
   * @return {Object3D} A reference to this instance.
   */
  clear() {
    return this.remove(...this.children);
  }
  /**
   * Adds the given 3D object as a child of this 3D object, while maintaining the object's world
   * transform. This method does not support scene graphs having non-uniformly-scaled nodes(s).
   *
   * @fires Object3D#added
   * @fires Object3D#childadded
   * @param {Object3D} object - The 3D object to attach.
   * @return {Object3D} A reference to this instance.
   */
  attach(t) {
    return this.updateWorldMatrix(!0, !1), cn.copy(this.matrixWorld).invert(), t.parent !== null && (t.parent.updateWorldMatrix(!0, !1), cn.multiply(t.parent.matrixWorld)), t.applyMatrix4(cn), t.removeFromParent(), t.parent = this, this.children.push(t), t.updateWorldMatrix(!1, !0), t.dispatchEvent(oo), ri.child = t, this.dispatchEvent(ri), ri.child = null, this;
  }
  /**
   * Searches through the 3D object and its children, starting with the 3D object
   * itself, and returns the first with a matching ID.
   *
   * @param {number} id - The id.
   * @return {Object3D|undefined} The found 3D object. Returns `undefined` if no 3D object has been found.
   */
  getObjectById(t) {
    return this.getObjectByProperty("id", t);
  }
  /**
   * Searches through the 3D object and its children, starting with the 3D object
   * itself, and returns the first with a matching name.
   *
   * @param {string} name - The name.
   * @return {Object3D|undefined} The found 3D object. Returns `undefined` if no 3D object has been found.
   */
  getObjectByName(t) {
    return this.getObjectByProperty("name", t);
  }
  /**
   * Searches through the 3D object and its children, starting with the 3D object
   * itself, and returns the first with a matching property value.
   *
   * @param {string} name - The name of the property.
   * @param {any} value - The value.
   * @return {Object3D|undefined} The found 3D object. Returns `undefined` if no 3D object has been found.
   */
  getObjectByProperty(t, e) {
    if (this[t] === e) return this;
    for (let n = 0, r = this.children.length; n < r; n++) {
      const a = this.children[n].getObjectByProperty(t, e);
      if (a !== void 0)
        return a;
    }
  }
  /**
   * Searches through the 3D object and its children, starting with the 3D object
   * itself, and returns all 3D objects with a matching property value.
   *
   * @param {string} name - The name of the property.
   * @param {any} value - The value.
   * @param {Array<Object3D>} result - The method stores the result in this array.
   * @return {Array<Object3D>} The found 3D objects.
   */
  getObjectsByProperty(t, e, n = []) {
    this[t] === e && n.push(this);
    const r = this.children;
    for (let s = 0, a = r.length; s < a; s++)
      r[s].getObjectsByProperty(t, e, n);
    return n;
  }
  /**
   * Returns a vector representing the position of the 3D object in world space.
   *
   * @param {Vector3} target - The target vector the result is stored to.
   * @return {Vector3} The 3D object's position in world space.
   */
  getWorldPosition(t) {
    return this.updateWorldMatrix(!0, !1), t.setFromMatrixPosition(this.matrixWorld);
  }
  /**
   * Returns a Quaternion representing the position of the 3D object in world space.
   *
   * @param {Quaternion} target - The target Quaternion the result is stored to.
   * @return {Quaternion} The 3D object's rotation in world space.
   */
  getWorldQuaternion(t) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(Li, t, Eh), t;
  }
  /**
   * Returns a vector representing the scale of the 3D object in world space.
   *
   * @param {Vector3} target - The target vector the result is stored to.
   * @return {Vector3} The 3D object's scale in world space.
   */
  getWorldScale(t) {
    return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(Li, Th, t), t;
  }
  /**
   * Returns a vector representing the ("look") direction of the 3D object in world space.
   *
   * @param {Vector3} target - The target vector the result is stored to.
   * @return {Vector3} The 3D object's direction in world space.
   */
  getWorldDirection(t) {
    this.updateWorldMatrix(!0, !1);
    const e = this.matrixWorld.elements;
    return t.set(e[8], e[9], e[10]).normalize();
  }
  /**
   * Abstract method to get intersections between a casted ray and this
   * 3D object. Renderable 3D objects such as {@link Mesh}, {@link Line} or {@link Points}
   * implement this method in order to use raycasting.
   *
   * @abstract
   * @param {Raycaster} raycaster - The raycaster.
   * @param {Array<Object>} intersects - An array holding the result of the method.
   */
  raycast() {
  }
  /**
   * Executes the callback on this 3D object and all descendants.
   *
   * Note: Modifying the scene graph inside the callback is discouraged.
   *
   * @param {Function} callback - A callback function that allows to process the current 3D object.
   */
  traverse(t) {
    t(this);
    const e = this.children;
    for (let n = 0, r = e.length; n < r; n++)
      e[n].traverse(t);
  }
  /**
   * Like {@link Object3D#traverse}, but the callback will only be executed for visible 3D objects.
   * Descendants of invisible 3D objects are not traversed.
   *
   * Note: Modifying the scene graph inside the callback is discouraged.
   *
   * @param {Function} callback - A callback function that allows to process the current 3D object.
   */
  traverseVisible(t) {
    if (this.visible === !1) return;
    t(this);
    const e = this.children;
    for (let n = 0, r = e.length; n < r; n++)
      e[n].traverseVisible(t);
  }
  /**
   * Like {@link Object3D#traverse}, but the callback will only be executed for all ancestors.
   *
   * Note: Modifying the scene graph inside the callback is discouraged.
   *
   * @param {Function} callback - A callback function that allows to process the current 3D object.
   */
  traverseAncestors(t) {
    const e = this.parent;
    e !== null && (t(e), e.traverseAncestors(t));
  }
  /**
   * Updates the transformation matrix in local space by computing it from the current
   * position, rotation and scale values.
   */
  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = !0;
  }
  /**
   * Updates the transformation matrix in world space of this 3D objects and its descendants.
   *
   * To ensure correct results, this method also recomputes the 3D object's transformation matrix in
   * local space. The computation of the local and world matrix can be controlled with the
   * {@link Object3D#matrixAutoUpdate} and {@link Object3D#matrixWorldAutoUpdate} flags which are both
   * `true` by default.  Set these flags to `false` if you need more control over the update matrix process.
   *
   * @param {boolean} [force=false] - When set to `true`, a recomputation of world matrices is forced even
   * when {@link Object3D#matrixWorldAutoUpdate} is set to `false`.
   */
  updateMatrixWorld(t) {
    this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || t) && (this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = !1, t = !0);
    const e = this.children;
    for (let n = 0, r = e.length; n < r; n++)
      e[n].updateMatrixWorld(t);
  }
  /**
   * An alternative version of {@link Object3D#updateMatrixWorld} with more control over the
   * update of ancestor and descendant nodes.
   *
   * @param {boolean} [updateParents=false] Whether ancestor nodes should be updated or not.
   * @param {boolean} [updateChildren=false] Whether descendant nodes should be updated or not.
   */
  updateWorldMatrix(t, e) {
    const n = this.parent;
    if (t === !0 && n !== null && n.updateWorldMatrix(!0, !1), this.matrixAutoUpdate && this.updateMatrix(), this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), e === !0) {
      const r = this.children;
      for (let s = 0, a = r.length; s < a; s++)
        r[s].updateWorldMatrix(!1, !0);
    }
  }
  /**
   * Serializes the 3D object into JSON.
   *
   * @param {?(Object|string)} meta - An optional value holding meta information about the serialization.
   * @return {Object} A JSON object representing the serialized 3D object.
   * @see {@link ObjectLoader#parse}
   */
  toJSON(t) {
    const e = t === void 0 || typeof t == "string", n = {};
    e && (t = {
      geometries: {},
      materials: {},
      textures: {},
      images: {},
      shapes: {},
      skeletons: {},
      animations: {},
      nodes: {}
    }, n.metadata = {
      version: 4.6,
      type: "Object",
      generator: "Object3D.toJSON"
    });
    const r = {};
    r.uuid = this.uuid, r.type = this.type, this.name !== "" && (r.name = this.name), this.castShadow === !0 && (r.castShadow = !0), this.receiveShadow === !0 && (r.receiveShadow = !0), this.visible === !1 && (r.visible = !1), this.frustumCulled === !1 && (r.frustumCulled = !1), this.renderOrder !== 0 && (r.renderOrder = this.renderOrder), Object.keys(this.userData).length > 0 && (r.userData = this.userData), r.layers = this.layers.mask, r.matrix = this.matrix.toArray(), r.up = this.up.toArray(), this.matrixAutoUpdate === !1 && (r.matrixAutoUpdate = !1), this.isInstancedMesh && (r.type = "InstancedMesh", r.count = this.count, r.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (r.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (r.type = "BatchedMesh", r.perObjectFrustumCulled = this.perObjectFrustumCulled, r.sortObjects = this.sortObjects, r.drawRanges = this._drawRanges, r.reservedRanges = this._reservedRanges, r.geometryInfo = this._geometryInfo.map((o) => ({
      ...o,
      boundingBox: o.boundingBox ? {
        min: o.boundingBox.min.toArray(),
        max: o.boundingBox.max.toArray()
      } : void 0,
      boundingSphere: o.boundingSphere ? {
        radius: o.boundingSphere.radius,
        center: o.boundingSphere.center.toArray()
      } : void 0
    })), r.instanceInfo = this._instanceInfo.map((o) => ({ ...o })), r.availableInstanceIds = this._availableInstanceIds.slice(), r.availableGeometryIds = this._availableGeometryIds.slice(), r.nextIndexStart = this._nextIndexStart, r.nextVertexStart = this._nextVertexStart, r.geometryCount = this._geometryCount, r.maxInstanceCount = this._maxInstanceCount, r.maxVertexCount = this._maxVertexCount, r.maxIndexCount = this._maxIndexCount, r.geometryInitialized = this._geometryInitialized, r.matricesTexture = this._matricesTexture.toJSON(t), r.indirectTexture = this._indirectTexture.toJSON(t), this._colorsTexture !== null && (r.colorsTexture = this._colorsTexture.toJSON(t)), this.boundingSphere !== null && (r.boundingSphere = {
      center: this.boundingSphere.center.toArray(),
      radius: this.boundingSphere.radius
    }), this.boundingBox !== null && (r.boundingBox = {
      min: this.boundingBox.min.toArray(),
      max: this.boundingBox.max.toArray()
    }));
    function s(o, l) {
      return o[l.uuid] === void 0 && (o[l.uuid] = l.toJSON(t)), l.uuid;
    }
    if (this.isScene)
      this.background && (this.background.isColor ? r.background = this.background.toJSON() : this.background.isTexture && (r.background = this.background.toJSON(t).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== !0 && (r.environment = this.environment.toJSON(t).uuid);
    else if (this.isMesh || this.isLine || this.isPoints) {
      r.geometry = s(t.geometries, this.geometry);
      const o = this.geometry.parameters;
      if (o !== void 0 && o.shapes !== void 0) {
        const l = o.shapes;
        if (Array.isArray(l))
          for (let c = 0, h = l.length; c < h; c++) {
            const u = l[c];
            s(t.shapes, u);
          }
        else
          s(t.shapes, l);
      }
    }
    if (this.isSkinnedMesh && (r.bindMode = this.bindMode, r.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (s(t.skeletons, this.skeleton), r.skeleton = this.skeleton.uuid)), this.material !== void 0)
      if (Array.isArray(this.material)) {
        const o = [];
        for (let l = 0, c = this.material.length; l < c; l++)
          o.push(s(t.materials, this.material[l]));
        r.material = o;
      } else
        r.material = s(t.materials, this.material);
    if (this.children.length > 0) {
      r.children = [];
      for (let o = 0; o < this.children.length; o++)
        r.children.push(this.children[o].toJSON(t).object);
    }
    if (this.animations.length > 0) {
      r.animations = [];
      for (let o = 0; o < this.animations.length; o++) {
        const l = this.animations[o];
        r.animations.push(s(t.animations, l));
      }
    }
    if (e) {
      const o = a(t.geometries), l = a(t.materials), c = a(t.textures), h = a(t.images), u = a(t.shapes), f = a(t.skeletons), d = a(t.animations), g = a(t.nodes);
      o.length > 0 && (n.geometries = o), l.length > 0 && (n.materials = l), c.length > 0 && (n.textures = c), h.length > 0 && (n.images = h), u.length > 0 && (n.shapes = u), f.length > 0 && (n.skeletons = f), d.length > 0 && (n.animations = d), g.length > 0 && (n.nodes = g);
    }
    return n.object = r, n;
    function a(o) {
      const l = [];
      for (const c in o) {
        const h = o[c];
        delete h.metadata, l.push(h);
      }
      return l;
    }
  }
  /**
   * Returns a new 3D object with copied values from this instance.
   *
   * @param {boolean} [recursive=true] - When set to `true`, descendants of the 3D object are also cloned.
   * @return {Object3D} A clone of this instance.
   */
  clone(t) {
    return new this.constructor().copy(this, t);
  }
  /**
   * Copies the values of the given 3D object to this instance.
   *
   * @param {Object3D} source - The 3D object to copy.
   * @param {boolean} [recursive=true] - When set to `true`, descendants of the 3D object are cloned.
   * @return {Object3D} A reference to this instance.
   */
  copy(t, e = !0) {
    if (this.name = t.name, this.up.copy(t.up), this.position.copy(t.position), this.rotation.order = t.rotation.order, this.quaternion.copy(t.quaternion), this.scale.copy(t.scale), this.matrix.copy(t.matrix), this.matrixWorld.copy(t.matrixWorld), this.matrixAutoUpdate = t.matrixAutoUpdate, this.matrixWorldAutoUpdate = t.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = t.matrixWorldNeedsUpdate, this.layers.mask = t.layers.mask, this.visible = t.visible, this.castShadow = t.castShadow, this.receiveShadow = t.receiveShadow, this.frustumCulled = t.frustumCulled, this.renderOrder = t.renderOrder, this.animations = t.animations.slice(), this.userData = JSON.parse(JSON.stringify(t.userData)), e === !0)
      for (let n = 0; n < t.children.length; n++) {
        const r = t.children[n];
        this.add(r.clone());
      }
    return this;
  }
}
_e.DEFAULT_UP = /* @__PURE__ */ new I(0, 1, 0);
_e.DEFAULT_MATRIX_AUTO_UPDATE = !0;
_e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
const qe = /* @__PURE__ */ new I(), hn = /* @__PURE__ */ new I(), os = /* @__PURE__ */ new I(), un = /* @__PURE__ */ new I(), si = /* @__PURE__ */ new I(), ai = /* @__PURE__ */ new I(), lo = /* @__PURE__ */ new I(), ls = /* @__PURE__ */ new I(), cs = /* @__PURE__ */ new I(), hs = /* @__PURE__ */ new I(), us = /* @__PURE__ */ new se(), ds = /* @__PURE__ */ new se(), fs = /* @__PURE__ */ new se();
class Ye {
  /**
   * Constructs a new triangle.
   *
   * @param {Vector3} [a=(0,0,0)] - The first corner of the triangle.
   * @param {Vector3} [b=(0,0,0)] - The second corner of the triangle.
   * @param {Vector3} [c=(0,0,0)] - The third corner of the triangle.
   */
  constructor(t = new I(), e = new I(), n = new I()) {
    this.a = t, this.b = e, this.c = n;
  }
  /**
   * Computes the normal vector of a triangle.
   *
   * @param {Vector3} a - The first corner of the triangle.
   * @param {Vector3} b - The second corner of the triangle.
   * @param {Vector3} c - The third corner of the triangle.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The triangle's normal.
   */
  static getNormal(t, e, n, r) {
    r.subVectors(n, e), qe.subVectors(t, e), r.cross(qe);
    const s = r.lengthSq();
    return s > 0 ? r.multiplyScalar(1 / Math.sqrt(s)) : r.set(0, 0, 0);
  }
  /**
   * Computes a barycentric coordinates from the given vector.
   * Returns `null` if the triangle is degenerate.
   *
   * @param {Vector3} point - A point in 3D space.
   * @param {Vector3} a - The first corner of the triangle.
   * @param {Vector3} b - The second corner of the triangle.
   * @param {Vector3} c - The third corner of the triangle.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {?Vector3} The barycentric coordinates for the given point
   */
  static getBarycoord(t, e, n, r, s) {
    qe.subVectors(r, e), hn.subVectors(n, e), os.subVectors(t, e);
    const a = qe.dot(qe), o = qe.dot(hn), l = qe.dot(os), c = hn.dot(hn), h = hn.dot(os), u = a * c - o * o;
    if (u === 0)
      return s.set(0, 0, 0), null;
    const f = 1 / u, d = (c * l - o * h) * f, g = (a * h - o * l) * f;
    return s.set(1 - d - g, g, d);
  }
  /**
   * Returns `true` if the given point, when projected onto the plane of the
   * triangle, lies within the triangle.
   *
   * @param {Vector3} point - The point in 3D space to test.
   * @param {Vector3} a - The first corner of the triangle.
   * @param {Vector3} b - The second corner of the triangle.
   * @param {Vector3} c - The third corner of the triangle.
   * @return {boolean} Whether the given point, when projected onto the plane of the
   * triangle, lies within the triangle or not.
   */
  static containsPoint(t, e, n, r) {
    return this.getBarycoord(t, e, n, r, un) === null ? !1 : un.x >= 0 && un.y >= 0 && un.x + un.y <= 1;
  }
  /**
   * Computes the value barycentrically interpolated for the given point on the
   * triangle. Returns `null` if the triangle is degenerate.
   *
   * @param {Vector3} point - Position of interpolated point.
   * @param {Vector3} p1 - The first corner of the triangle.
   * @param {Vector3} p2 - The second corner of the triangle.
   * @param {Vector3} p3 - The third corner of the triangle.
   * @param {Vector3} v1 - Value to interpolate of first vertex.
   * @param {Vector3} v2 - Value to interpolate of second vertex.
   * @param {Vector3} v3 - Value to interpolate of third vertex.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {?Vector3} The interpolated value.
   */
  static getInterpolation(t, e, n, r, s, a, o, l) {
    return this.getBarycoord(t, e, n, r, un) === null ? (l.x = 0, l.y = 0, "z" in l && (l.z = 0), "w" in l && (l.w = 0), null) : (l.setScalar(0), l.addScaledVector(s, un.x), l.addScaledVector(a, un.y), l.addScaledVector(o, un.z), l);
  }
  /**
   * Computes the value barycentrically interpolated for the given attribute and indices.
   *
   * @param {BufferAttribute} attr - The attribute to interpolate.
   * @param {number} i1 - Index of first vertex.
   * @param {number} i2 - Index of second vertex.
   * @param {number} i3 - Index of third vertex.
   * @param {Vector3} barycoord - The barycoordinate value to use to interpolate.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The interpolated attribute value.
   */
  static getInterpolatedAttribute(t, e, n, r, s, a) {
    return us.setScalar(0), ds.setScalar(0), fs.setScalar(0), us.fromBufferAttribute(t, e), ds.fromBufferAttribute(t, n), fs.fromBufferAttribute(t, r), a.setScalar(0), a.addScaledVector(us, s.x), a.addScaledVector(ds, s.y), a.addScaledVector(fs, s.z), a;
  }
  /**
   * Returns `true` if the triangle is oriented towards the given direction.
   *
   * @param {Vector3} a - The first corner of the triangle.
   * @param {Vector3} b - The second corner of the triangle.
   * @param {Vector3} c - The third corner of the triangle.
   * @param {Vector3} direction - The (normalized) direction vector.
   * @return {boolean} Whether the triangle is oriented towards the given direction or not.
   */
  static isFrontFacing(t, e, n, r) {
    return qe.subVectors(n, e), hn.subVectors(t, e), qe.cross(hn).dot(r) < 0;
  }
  /**
   * Sets the triangle's vertices by copying the given values.
   *
   * @param {Vector3} a - The first corner of the triangle.
   * @param {Vector3} b - The second corner of the triangle.
   * @param {Vector3} c - The third corner of the triangle.
   * @return {Triangle} A reference to this triangle.
   */
  set(t, e, n) {
    return this.a.copy(t), this.b.copy(e), this.c.copy(n), this;
  }
  /**
   * Sets the triangle's vertices by copying the given array values.
   *
   * @param {Array<Vector3>} points - An array with 3D points.
   * @param {number} i0 - The array index representing the first corner of the triangle.
   * @param {number} i1 - The array index representing the second corner of the triangle.
   * @param {number} i2 - The array index representing the third corner of the triangle.
   * @return {Triangle} A reference to this triangle.
   */
  setFromPointsAndIndices(t, e, n, r) {
    return this.a.copy(t[e]), this.b.copy(t[n]), this.c.copy(t[r]), this;
  }
  /**
   * Sets the triangle's vertices by copying the given attribute values.
   *
   * @param {BufferAttribute} attribute - A buffer attribute with 3D points data.
   * @param {number} i0 - The attribute index representing the first corner of the triangle.
   * @param {number} i1 - The attribute index representing the second corner of the triangle.
   * @param {number} i2 - The attribute index representing the third corner of the triangle.
   * @return {Triangle} A reference to this triangle.
   */
  setFromAttributeAndIndices(t, e, n, r) {
    return this.a.fromBufferAttribute(t, e), this.b.fromBufferAttribute(t, n), this.c.fromBufferAttribute(t, r), this;
  }
  /**
   * Returns a new triangle with copied values from this instance.
   *
   * @return {Triangle} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
  /**
   * Copies the values of the given triangle to this instance.
   *
   * @param {Triangle} triangle - The triangle to copy.
   * @return {Triangle} A reference to this triangle.
   */
  copy(t) {
    return this.a.copy(t.a), this.b.copy(t.b), this.c.copy(t.c), this;
  }
  /**
   * Computes the area of the triangle.
   *
   * @return {number} The triangle's area.
   */
  getArea() {
    return qe.subVectors(this.c, this.b), hn.subVectors(this.a, this.b), qe.cross(hn).length() * 0.5;
  }
  /**
   * Computes the midpoint of the triangle.
   *
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The triangle's midpoint.
   */
  getMidpoint(t) {
    return t.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
  }
  /**
   * Computes the normal of the triangle.
   *
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The triangle's normal.
   */
  getNormal(t) {
    return Ye.getNormal(this.a, this.b, this.c, t);
  }
  /**
   * Computes a plane the triangle lies within.
   *
   * @param {Plane} target - The target vector that is used to store the method's result.
   * @return {Plane} The plane the triangle lies within.
   */
  getPlane(t) {
    return t.setFromCoplanarPoints(this.a, this.b, this.c);
  }
  /**
   * Computes a barycentric coordinates from the given vector.
   * Returns `null` if the triangle is degenerate.
   *
   * @param {Vector3} point - A point in 3D space.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {?Vector3} The barycentric coordinates for the given point
   */
  getBarycoord(t, e) {
    return Ye.getBarycoord(t, this.a, this.b, this.c, e);
  }
  /**
   * Computes the value barycentrically interpolated for the given point on the
   * triangle. Returns `null` if the triangle is degenerate.
   *
   * @param {Vector3} point - Position of interpolated point.
   * @param {Vector3} v1 - Value to interpolate of first vertex.
   * @param {Vector3} v2 - Value to interpolate of second vertex.
   * @param {Vector3} v3 - Value to interpolate of third vertex.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {?Vector3} The interpolated value.
   */
  getInterpolation(t, e, n, r, s) {
    return Ye.getInterpolation(t, this.a, this.b, this.c, e, n, r, s);
  }
  /**
   * Returns `true` if the given point, when projected onto the plane of the
   * triangle, lies within the triangle.
   *
   * @param {Vector3} point - The point in 3D space to test.
   * @return {boolean} Whether the given point, when projected onto the plane of the
   * triangle, lies within the triangle or not.
   */
  containsPoint(t) {
    return Ye.containsPoint(t, this.a, this.b, this.c);
  }
  /**
   * Returns `true` if the triangle is oriented towards the given direction.
   *
   * @param {Vector3} direction - The (normalized) direction vector.
   * @return {boolean} Whether the triangle is oriented towards the given direction or not.
   */
  isFrontFacing(t) {
    return Ye.isFrontFacing(this.a, this.b, this.c, t);
  }
  /**
   * Returns `true` if this triangle intersects with the given box.
   *
   * @param {Box3} box - The box to intersect.
   * @return {boolean} Whether this triangle intersects with the given box or not.
   */
  intersectsBox(t) {
    return t.intersectsTriangle(this);
  }
  /**
   * Returns the closest point on the triangle to the given point.
   *
   * @param {Vector3} p - The point to compute the closest point for.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The closest point on the triangle.
   */
  closestPointToPoint(t, e) {
    const n = this.a, r = this.b, s = this.c;
    let a, o;
    si.subVectors(r, n), ai.subVectors(s, n), ls.subVectors(t, n);
    const l = si.dot(ls), c = ai.dot(ls);
    if (l <= 0 && c <= 0)
      return e.copy(n);
    cs.subVectors(t, r);
    const h = si.dot(cs), u = ai.dot(cs);
    if (h >= 0 && u <= h)
      return e.copy(r);
    const f = l * u - h * c;
    if (f <= 0 && l >= 0 && h <= 0)
      return a = l / (l - h), e.copy(n).addScaledVector(si, a);
    hs.subVectors(t, s);
    const d = si.dot(hs), g = ai.dot(hs);
    if (g >= 0 && d <= g)
      return e.copy(s);
    const v = d * c - l * g;
    if (v <= 0 && c >= 0 && g <= 0)
      return o = c / (c - g), e.copy(n).addScaledVector(ai, o);
    const m = h * g - d * u;
    if (m <= 0 && u - h >= 0 && d - g >= 0)
      return lo.subVectors(s, r), o = (u - h) / (u - h + (d - g)), e.copy(r).addScaledVector(lo, o);
    const p = 1 / (m + v + f);
    return a = v * p, o = f * p, e.copy(n).addScaledVector(si, a).addScaledVector(ai, o);
  }
  /**
   * Returns `true` if this triangle is equal with the given one.
   *
   * @param {Triangle} triangle - The triangle to test for equality.
   * @return {boolean} Whether this triangle is equal with the given one.
   */
  equals(t) {
    return t.a.equals(this.a) && t.b.equals(this.b) && t.c.equals(this.c);
  }
}
const Il = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
}, Tn = { h: 0, s: 0, l: 0 }, fr = { h: 0, s: 0, l: 0 };
function ps(i, t, e) {
  return e < 0 && (e += 1), e > 1 && (e -= 1), e < 1 / 6 ? i + (t - i) * 6 * e : e < 1 / 2 ? t : e < 2 / 3 ? i + (t - i) * 6 * (2 / 3 - e) : i;
}
class Ft {
  /**
   * Constructs a new color.
   *
   * Note that standard method of specifying color in three.js is with a hexadecimal triplet,
   * and that method is used throughout the rest of the documentation.
   *
   * @param {(number|string|Color)} [r] - The red component of the color. If `g` and `b` are
   * not provided, it can be hexadecimal triplet, a CSS-style string or another `Color` instance.
   * @param {number} [g] - The green component.
   * @param {number} [b] - The blue component.
   */
  constructor(t, e, n) {
    return this.isColor = !0, this.r = 1, this.g = 1, this.b = 1, this.set(t, e, n);
  }
  /**
   * Sets the colors's components from the given values.
   *
   * @param {(number|string|Color)} [r] - The red component of the color. If `g` and `b` are
   * not provided, it can be hexadecimal triplet, a CSS-style string or another `Color` instance.
   * @param {number} [g] - The green component.
   * @param {number} [b] - The blue component.
   * @return {Color} A reference to this color.
   */
  set(t, e, n) {
    if (e === void 0 && n === void 0) {
      const r = t;
      r && r.isColor ? this.copy(r) : typeof r == "number" ? this.setHex(r) : typeof r == "string" && this.setStyle(r);
    } else
      this.setRGB(t, e, n);
    return this;
  }
  /**
   * Sets the colors's components to the given scalar value.
   *
   * @param {number} scalar - The scalar value.
   * @return {Color} A reference to this color.
   */
  setScalar(t) {
    return this.r = t, this.g = t, this.b = t, this;
  }
  /**
   * Sets this color from a hexadecimal value.
   *
   * @param {number} hex - The hexadecimal value.
   * @param {string} [colorSpace=SRGBColorSpace] - The color space.
   * @return {Color} A reference to this color.
   */
  setHex(t, e = Se) {
    return t = Math.floor(t), this.r = (t >> 16 & 255) / 255, this.g = (t >> 8 & 255) / 255, this.b = (t & 255) / 255, Gt.toWorkingColorSpace(this, e), this;
  }
  /**
   * Sets this color from RGB values.
   *
   * @param {number} r - Red channel value between `0.0` and `1.0`.
   * @param {number} g - Green channel value between `0.0` and `1.0`.
   * @param {number} b - Blue channel value between `0.0` and `1.0`.
   * @param {string} [colorSpace=ColorManagement.workingColorSpace] - The color space.
   * @return {Color} A reference to this color.
   */
  setRGB(t, e, n, r = Gt.workingColorSpace) {
    return this.r = t, this.g = e, this.b = n, Gt.toWorkingColorSpace(this, r), this;
  }
  /**
   * Sets this color from RGB values.
   *
   * @param {number} h - Hue value between `0.0` and `1.0`.
   * @param {number} s - Saturation value between `0.0` and `1.0`.
   * @param {number} l - Lightness value between `0.0` and `1.0`.
   * @param {string} [colorSpace=ColorManagement.workingColorSpace] - The color space.
   * @return {Color} A reference to this color.
   */
  setHSL(t, e, n, r = Gt.workingColorSpace) {
    if (t = oh(t, 1), e = Nt(e, 0, 1), n = Nt(n, 0, 1), e === 0)
      this.r = this.g = this.b = n;
    else {
      const s = n <= 0.5 ? n * (1 + e) : n + e - n * e, a = 2 * n - s;
      this.r = ps(a, s, t + 1 / 3), this.g = ps(a, s, t), this.b = ps(a, s, t - 1 / 3);
    }
    return Gt.toWorkingColorSpace(this, r), this;
  }
  /**
   * Sets this color from a CSS-style string. For example, `rgb(250, 0,0)`,
   * `rgb(100%, 0%, 0%)`, `hsl(0, 100%, 50%)`, `#ff0000`, `#f00`, or `red` ( or
   * any [X11 color name]{@link https://en.wikipedia.org/wiki/X11_color_names#Color_name_chart} -
   * all 140 color names are supported).
   *
   * @param {string} style - Color as a CSS-style string.
   * @param {string} [colorSpace=SRGBColorSpace] - The color space.
   * @return {Color} A reference to this color.
   */
  setStyle(t, e = Se) {
    function n(s) {
      s !== void 0 && parseFloat(s) < 1 && console.warn("THREE.Color: Alpha component of " + t + " will be ignored.");
    }
    let r;
    if (r = /^(\w+)\(([^\)]*)\)/.exec(t)) {
      let s;
      const a = r[1], o = r[2];
      switch (a) {
        case "rgb":
        case "rgba":
          if (s = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return n(s[4]), this.setRGB(
              Math.min(255, parseInt(s[1], 10)) / 255,
              Math.min(255, parseInt(s[2], 10)) / 255,
              Math.min(255, parseInt(s[3], 10)) / 255,
              e
            );
          if (s = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return n(s[4]), this.setRGB(
              Math.min(100, parseInt(s[1], 10)) / 100,
              Math.min(100, parseInt(s[2], 10)) / 100,
              Math.min(100, parseInt(s[3], 10)) / 100,
              e
            );
          break;
        case "hsl":
        case "hsla":
          if (s = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return n(s[4]), this.setHSL(
              parseFloat(s[1]) / 360,
              parseFloat(s[2]) / 100,
              parseFloat(s[3]) / 100,
              e
            );
          break;
        default:
          console.warn("THREE.Color: Unknown color model " + t);
      }
    } else if (r = /^\#([A-Fa-f\d]+)$/.exec(t)) {
      const s = r[1], a = s.length;
      if (a === 3)
        return this.setRGB(
          parseInt(s.charAt(0), 16) / 15,
          parseInt(s.charAt(1), 16) / 15,
          parseInt(s.charAt(2), 16) / 15,
          e
        );
      if (a === 6)
        return this.setHex(parseInt(s, 16), e);
      console.warn("THREE.Color: Invalid hex color " + t);
    } else if (t && t.length > 0)
      return this.setColorName(t, e);
    return this;
  }
  /**
   * Sets this color from a color name. Faster than {@link Color#setStyle} if
   * you don't need the other CSS-style formats.
   *
   * For convenience, the list of names is exposed in `Color.NAMES` as a hash.
   * ```js
   * Color.NAMES.aliceblue // returns 0xF0F8FF
   * ```
   *
   * @param {string} style - The color name.
   * @param {string} [colorSpace=SRGBColorSpace] - The color space.
   * @return {Color} A reference to this color.
   */
  setColorName(t, e = Se) {
    const n = Il[t.toLowerCase()];
    return n !== void 0 ? this.setHex(n, e) : console.warn("THREE.Color: Unknown color " + t), this;
  }
  /**
   * Returns a new color with copied values from this instance.
   *
   * @return {Color} A clone of this instance.
   */
  clone() {
    return new this.constructor(this.r, this.g, this.b);
  }
  /**
   * Copies the values of the given color to this instance.
   *
   * @param {Color} color - The color to copy.
   * @return {Color} A reference to this color.
   */
  copy(t) {
    return this.r = t.r, this.g = t.g, this.b = t.b, this;
  }
  /**
   * Copies the given color into this color, and then converts this color from
   * `SRGBColorSpace` to `LinearSRGBColorSpace`.
   *
   * @param {Color} color - The color to copy/convert.
   * @return {Color} A reference to this color.
   */
  copySRGBToLinear(t) {
    return this.r = gn(t.r), this.g = gn(t.g), this.b = gn(t.b), this;
  }
  /**
   * Copies the given color into this color, and then converts this color from
   * `LinearSRGBColorSpace` to `SRGBColorSpace`.
   *
   * @param {Color} color - The color to copy/convert.
   * @return {Color} A reference to this color.
   */
  copyLinearToSRGB(t) {
    return this.r = gi(t.r), this.g = gi(t.g), this.b = gi(t.b), this;
  }
  /**
   * Converts this color from `SRGBColorSpace` to `LinearSRGBColorSpace`.
   *
   * @return {Color} A reference to this color.
   */
  convertSRGBToLinear() {
    return this.copySRGBToLinear(this), this;
  }
  /**
   * Converts this color from `LinearSRGBColorSpace` to `SRGBColorSpace`.
   *
   * @return {Color} A reference to this color.
   */
  convertLinearToSRGB() {
    return this.copyLinearToSRGB(this), this;
  }
  /**
   * Returns the hexadecimal value of this color.
   *
   * @param {string} [colorSpace=SRGBColorSpace] - The color space.
   * @return {number} The hexadecimal value.
   */
  getHex(t = Se) {
    return Gt.fromWorkingColorSpace(Me.copy(this), t), Math.round(Nt(Me.r * 255, 0, 255)) * 65536 + Math.round(Nt(Me.g * 255, 0, 255)) * 256 + Math.round(Nt(Me.b * 255, 0, 255));
  }
  /**
   * Returns the hexadecimal value of this color as a string (for example, 'FFFFFF').
   *
   * @param {string} [colorSpace=SRGBColorSpace] - The color space.
   * @return {string} The hexadecimal value as a string.
   */
  getHexString(t = Se) {
    return ("000000" + this.getHex(t).toString(16)).slice(-6);
  }
  /**
   * Converts the colors RGB values into the HSL format and stores them into the
   * given target object.
   *
   * @param {{h:number,s:number,l:number}} target - The target object that is used to store the method's result.
   * @param {string} [colorSpace=ColorManagement.workingColorSpace] - The color space.
   * @return {{h:number,s:number,l:number}} The HSL representation of this color.
   */
  getHSL(t, e = Gt.workingColorSpace) {
    Gt.fromWorkingColorSpace(Me.copy(this), e);
    const n = Me.r, r = Me.g, s = Me.b, a = Math.max(n, r, s), o = Math.min(n, r, s);
    let l, c;
    const h = (o + a) / 2;
    if (o === a)
      l = 0, c = 0;
    else {
      const u = a - o;
      switch (c = h <= 0.5 ? u / (a + o) : u / (2 - a - o), a) {
        case n:
          l = (r - s) / u + (r < s ? 6 : 0);
          break;
        case r:
          l = (s - n) / u + 2;
          break;
        case s:
          l = (n - r) / u + 4;
          break;
      }
      l /= 6;
    }
    return t.h = l, t.s = c, t.l = h, t;
  }
  /**
   * Returns the RGB values of this color and stores them into the given target object.
   *
   * @param {Color} target - The target color that is used to store the method's result.
   * @param {string} [colorSpace=ColorManagement.workingColorSpace] - The color space.
   * @return {Color} The RGB representation of this color.
   */
  getRGB(t, e = Gt.workingColorSpace) {
    return Gt.fromWorkingColorSpace(Me.copy(this), e), t.r = Me.r, t.g = Me.g, t.b = Me.b, t;
  }
  /**
   * Returns the value of this color as a CSS style string. Example: `rgb(255,0,0)`.
   *
   * @param {string} [colorSpace=SRGBColorSpace] - The color space.
   * @return {string} The CSS representation of this color.
   */
  getStyle(t = Se) {
    Gt.fromWorkingColorSpace(Me.copy(this), t);
    const e = Me.r, n = Me.g, r = Me.b;
    return t !== Se ? `color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})` : `rgb(${Math.round(e * 255)},${Math.round(n * 255)},${Math.round(r * 255)})`;
  }
  /**
   * Adds the given HSL values to this color's values.
   * Internally, this converts the color's RGB values to HSL, adds HSL
   * and then converts the color back to RGB.
   *
   * @param {number} h - Hue value between `0.0` and `1.0`.
   * @param {number} s - Saturation value between `0.0` and `1.0`.
   * @param {number} l - Lightness value between `0.0` and `1.0`.
   * @return {Color} A reference to this color.
   */
  offsetHSL(t, e, n) {
    return this.getHSL(Tn), this.setHSL(Tn.h + t, Tn.s + e, Tn.l + n);
  }
  /**
   * Adds the RGB values of the given color to the RGB values of this color.
   *
   * @param {Color} color - The color to add.
   * @return {Color} A reference to this color.
   */
  add(t) {
    return this.r += t.r, this.g += t.g, this.b += t.b, this;
  }
  /**
   * Adds the RGB values of the given colors and stores the result in this instance.
   *
   * @param {Color} color1 - The first color.
   * @param {Color} color2 - The second color.
   * @return {Color} A reference to this color.
   */
  addColors(t, e) {
    return this.r = t.r + e.r, this.g = t.g + e.g, this.b = t.b + e.b, this;
  }
  /**
   * Adds the given scalar value to the RGB values of this color.
   *
   * @param {number} s - The scalar to add.
   * @return {Color} A reference to this color.
   */
  addScalar(t) {
    return this.r += t, this.g += t, this.b += t, this;
  }
  /**
   * Subtracts the RGB values of the given color from the RGB values of this color.
   *
   * @param {Color} color - The color to subtract.
   * @return {Color} A reference to this color.
   */
  sub(t) {
    return this.r = Math.max(0, this.r - t.r), this.g = Math.max(0, this.g - t.g), this.b = Math.max(0, this.b - t.b), this;
  }
  /**
   * Multiplies the RGB values of the given color with the RGB values of this color.
   *
   * @param {Color} color - The color to multiply.
   * @return {Color} A reference to this color.
   */
  multiply(t) {
    return this.r *= t.r, this.g *= t.g, this.b *= t.b, this;
  }
  /**
   * Multiplies the given scalar value with the RGB values of this color.
   *
   * @param {number} s - The scalar to multiply.
   * @return {Color} A reference to this color.
   */
  multiplyScalar(t) {
    return this.r *= t, this.g *= t, this.b *= t, this;
  }
  /**
   * Linearly interpolates this color's RGB values toward the RGB values of the
   * given color. The alpha argument can be thought of as the ratio between
   * the two colors, where `0.0` is this color and `1.0` is the first argument.
   *
   * @param {Color} color - The color to converge on.
   * @param {number} alpha - The interpolation factor in the closed interval `[0,1]`.
   * @return {Color} A reference to this color.
   */
  lerp(t, e) {
    return this.r += (t.r - this.r) * e, this.g += (t.g - this.g) * e, this.b += (t.b - this.b) * e, this;
  }
  /**
   * Linearly interpolates between the given colors and stores the result in this instance.
   * The alpha argument can be thought of as the ratio between the two colors, where `0.0`
   * is the first and `1.0` is the second color.
   *
   * @param {Color} color1 - The first color.
   * @param {Color} color2 - The second color.
   * @param {number} alpha - The interpolation factor in the closed interval `[0,1]`.
   * @return {Color} A reference to this color.
   */
  lerpColors(t, e, n) {
    return this.r = t.r + (e.r - t.r) * n, this.g = t.g + (e.g - t.g) * n, this.b = t.b + (e.b - t.b) * n, this;
  }
  /**
   * Linearly interpolates this color's HSL values toward the HSL values of the
   * given color. It differs from {@link Color#lerp} by not interpolating straight
   * from one color to the other, but instead going through all the hues in between
   * those two colors. The alpha argument can be thought of as the ratio between
   * the two colors, where 0.0 is this color and 1.0 is the first argument.
   *
   * @param {Color} color - The color to converge on.
   * @param {number} alpha - The interpolation factor in the closed interval `[0,1]`.
   * @return {Color} A reference to this color.
   */
  lerpHSL(t, e) {
    this.getHSL(Tn), t.getHSL(fr);
    const n = Kr(Tn.h, fr.h, e), r = Kr(Tn.s, fr.s, e), s = Kr(Tn.l, fr.l, e);
    return this.setHSL(n, r, s), this;
  }
  /**
   * Sets the color's RGB components from the given 3D vector.
   *
   * @param {Vector3} v - The vector to set.
   * @return {Color} A reference to this color.
   */
  setFromVector3(t) {
    return this.r = t.x, this.g = t.y, this.b = t.z, this;
  }
  /**
   * Transforms this color with the given 3x3 matrix.
   *
   * @param {Matrix3} m - The matrix.
   * @return {Color} A reference to this color.
   */
  applyMatrix3(t) {
    const e = this.r, n = this.g, r = this.b, s = t.elements;
    return this.r = s[0] * e + s[3] * n + s[6] * r, this.g = s[1] * e + s[4] * n + s[7] * r, this.b = s[2] * e + s[5] * n + s[8] * r, this;
  }
  /**
   * Returns `true` if this color is equal with the given one.
   *
   * @param {Color} c - The color to test for equality.
   * @return {boolean} Whether this bounding color is equal with the given one.
   */
  equals(t) {
    return t.r === this.r && t.g === this.g && t.b === this.b;
  }
  /**
   * Sets this color's RGB components from the given array.
   *
   * @param {Array<number>} array - An array holding the RGB values.
   * @param {number} [offset=0] - The offset into the array.
   * @return {Color} A reference to this color.
   */
  fromArray(t, e = 0) {
    return this.r = t[e], this.g = t[e + 1], this.b = t[e + 2], this;
  }
  /**
   * Writes the RGB components of this color to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number>} [array=[]] - The target array holding the color components.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number>} The color components.
   */
  toArray(t = [], e = 0) {
    return t[e] = this.r, t[e + 1] = this.g, t[e + 2] = this.b, t;
  }
  /**
   * Sets the components of this color from the given buffer attribute.
   *
   * @param {BufferAttribute} attribute - The buffer attribute holding color data.
   * @param {number} index - The index into the attribute.
   * @return {Color} A reference to this color.
   */
  fromBufferAttribute(t, e) {
    return this.r = t.getX(e), this.g = t.getY(e), this.b = t.getZ(e), this;
  }
  /**
   * This methods defines the serialization result of this class. Returns the color
   * as a hexadecimal value.
   *
   * @return {number} The hexadecimal value.
   */
  toJSON() {
    return this.getHex();
  }
  *[Symbol.iterator]() {
    yield this.r, yield this.g, yield this.b;
  }
}
const Me = /* @__PURE__ */ new Ft();
Ft.NAMES = Il;
let bh = 0;
class tr extends Ei {
  /**
   * Constructs a new material.
   */
  constructor() {
    super(), this.isMaterial = !0, Object.defineProperty(this, "id", { value: bh++ }), this.uuid = Ti(), this.name = "", this.type = "Material", this.blending = mi, this.side = Rn, this.vertexColors = !1, this.opacity = 1, this.transparent = !1, this.alphaHash = !1, this.blendSrc = Ds, this.blendDst = Is, this.blendEquation = Hn, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new Ft(0, 0, 0), this.blendAlpha = 0, this.depthFunc = _i, this.depthTest = !0, this.depthWrite = !0, this.stencilWriteMask = 255, this.stencilFunc = $a, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = Kn, this.stencilZFail = Kn, this.stencilZPass = Kn, this.stencilWrite = !1, this.clippingPlanes = null, this.clipIntersection = !1, this.clipShadows = !1, this.shadowSide = null, this.colorWrite = !0, this.precision = null, this.polygonOffset = !1, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = !1, this.alphaToCoverage = !1, this.premultipliedAlpha = !1, this.forceSinglePass = !1, this.allowOverride = !0, this.visible = !0, this.toneMapped = !0, this.userData = {}, this.version = 0, this._alphaTest = 0;
  }
  /**
   * Sets the alpha value to be used when running an alpha test. The material
   * will not be rendered if the opacity is lower than this value.
   *
   * @type {number}
   * @readonly
   * @default 0
   */
  get alphaTest() {
    return this._alphaTest;
  }
  set alphaTest(t) {
    this._alphaTest > 0 != t > 0 && this.version++, this._alphaTest = t;
  }
  /**
   * An optional callback that is executed immediately before the material is used to render a 3D object.
   *
   * This method can only be used when rendering with {@link WebGLRenderer}.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Scene} scene - The scene.
   * @param {Camera} camera - The camera that is used to render the scene.
   * @param {BufferGeometry} geometry - The 3D object's geometry.
   * @param {Object3D} object - The 3D object.
   * @param {Object} group - The geometry group data.
   */
  onBeforeRender() {
  }
  /**
   * An optional callback that is executed immediately before the shader
   * program is compiled. This function is called with the shader source code
   * as a parameter. Useful for the modification of built-in materials.
   *
   * This method can only be used when rendering with {@link WebGLRenderer}. The
   * recommended approach when customizing materials is to use `WebGPURenderer` with the new
   * Node Material system and [TSL]{@link https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language}.
   *
   * @param {{vertexShader:string,fragmentShader:string,uniforms:Object}} shaderobject - The object holds the uniforms and the vertex and fragment shader source.
   * @param {WebGLRenderer} renderer - A reference to the renderer.
   */
  onBeforeCompile() {
  }
  /**
   * In case {@link Material#onBeforeCompile} is used, this callback can be used to identify
   * values of settings used in `onBeforeCompile()`, so three.js can reuse a cached
   * shader or recompile the shader for this material as needed.
   *
   * This method can only be used when rendering with {@link WebGLRenderer}.
   *
   * @return {string} The custom program cache key.
   */
  customProgramCacheKey() {
    return this.onBeforeCompile.toString();
  }
  /**
   * This method can be used to set default values from parameter objects.
   * It is a generic implementation so it can be used with different types
   * of materials.
   *
   * @param {Object} [values] - The material values to set.
   */
  setValues(t) {
    if (t !== void 0)
      for (const e in t) {
        const n = t[e];
        if (n === void 0) {
          console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);
          continue;
        }
        const r = this[e];
        if (r === void 0) {
          console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);
          continue;
        }
        r && r.isColor ? r.set(n) : r && r.isVector3 && n && n.isVector3 ? r.copy(n) : this[e] = n;
      }
  }
  /**
   * Serializes the material into JSON.
   *
   * @param {?(Object|string)} meta - An optional value holding meta information about the serialization.
   * @return {Object} A JSON object representing the serialized material.
   * @see {@link ObjectLoader#parse}
   */
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    e && (t = {
      textures: {},
      images: {}
    });
    const n = {
      metadata: {
        version: 4.6,
        type: "Material",
        generator: "Material.toJSON"
      }
    };
    n.uuid = this.uuid, n.type = this.type, this.name !== "" && (n.name = this.name), this.color && this.color.isColor && (n.color = this.color.getHex()), this.roughness !== void 0 && (n.roughness = this.roughness), this.metalness !== void 0 && (n.metalness = this.metalness), this.sheen !== void 0 && (n.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (n.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (n.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (n.emissive = this.emissive.getHex()), this.emissiveIntensity !== void 0 && this.emissiveIntensity !== 1 && (n.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (n.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (n.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (n.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (n.shininess = this.shininess), this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (n.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (n.clearcoatMap = this.clearcoatMap.toJSON(t).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(t).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(t).uuid, n.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.dispersion !== void 0 && (n.dispersion = this.dispersion), this.iridescence !== void 0 && (n.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (n.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (n.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (n.iridescenceMap = this.iridescenceMap.toJSON(t).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (n.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(t).uuid), this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (n.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (n.anisotropyMap = this.anisotropyMap.toJSON(t).uuid), this.map && this.map.isTexture && (n.map = this.map.toJSON(t).uuid), this.matcap && this.matcap.isTexture && (n.matcap = this.matcap.toJSON(t).uuid), this.alphaMap && this.alphaMap.isTexture && (n.alphaMap = this.alphaMap.toJSON(t).uuid), this.lightMap && this.lightMap.isTexture && (n.lightMap = this.lightMap.toJSON(t).uuid, n.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (n.aoMap = this.aoMap.toJSON(t).uuid, n.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (n.bumpMap = this.bumpMap.toJSON(t).uuid, n.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (n.normalMap = this.normalMap.toJSON(t).uuid, n.normalMapType = this.normalMapType, n.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (n.displacementMap = this.displacementMap.toJSON(t).uuid, n.displacementScale = this.displacementScale, n.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (n.roughnessMap = this.roughnessMap.toJSON(t).uuid), this.metalnessMap && this.metalnessMap.isTexture && (n.metalnessMap = this.metalnessMap.toJSON(t).uuid), this.emissiveMap && this.emissiveMap.isTexture && (n.emissiveMap = this.emissiveMap.toJSON(t).uuid), this.specularMap && this.specularMap.isTexture && (n.specularMap = this.specularMap.toJSON(t).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (n.specularIntensityMap = this.specularIntensityMap.toJSON(t).uuid), this.specularColorMap && this.specularColorMap.isTexture && (n.specularColorMap = this.specularColorMap.toJSON(t).uuid), this.envMap && this.envMap.isTexture && (n.envMap = this.envMap.toJSON(t).uuid, this.combine !== void 0 && (n.combine = this.combine)), this.envMapRotation !== void 0 && (n.envMapRotation = this.envMapRotation.toArray()), this.envMapIntensity !== void 0 && (n.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (n.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (n.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (n.gradientMap = this.gradientMap.toJSON(t).uuid), this.transmission !== void 0 && (n.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (n.transmissionMap = this.transmissionMap.toJSON(t).uuid), this.thickness !== void 0 && (n.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (n.thicknessMap = this.thicknessMap.toJSON(t).uuid), this.attenuationDistance !== void 0 && this.attenuationDistance !== 1 / 0 && (n.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (n.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (n.size = this.size), this.shadowSide !== null && (n.shadowSide = this.shadowSide), this.sizeAttenuation !== void 0 && (n.sizeAttenuation = this.sizeAttenuation), this.blending !== mi && (n.blending = this.blending), this.side !== Rn && (n.side = this.side), this.vertexColors === !0 && (n.vertexColors = !0), this.opacity < 1 && (n.opacity = this.opacity), this.transparent === !0 && (n.transparent = !0), this.blendSrc !== Ds && (n.blendSrc = this.blendSrc), this.blendDst !== Is && (n.blendDst = this.blendDst), this.blendEquation !== Hn && (n.blendEquation = this.blendEquation), this.blendSrcAlpha !== null && (n.blendSrcAlpha = this.blendSrcAlpha), this.blendDstAlpha !== null && (n.blendDstAlpha = this.blendDstAlpha), this.blendEquationAlpha !== null && (n.blendEquationAlpha = this.blendEquationAlpha), this.blendColor && this.blendColor.isColor && (n.blendColor = this.blendColor.getHex()), this.blendAlpha !== 0 && (n.blendAlpha = this.blendAlpha), this.depthFunc !== _i && (n.depthFunc = this.depthFunc), this.depthTest === !1 && (n.depthTest = this.depthTest), this.depthWrite === !1 && (n.depthWrite = this.depthWrite), this.colorWrite === !1 && (n.colorWrite = this.colorWrite), this.stencilWriteMask !== 255 && (n.stencilWriteMask = this.stencilWriteMask), this.stencilFunc !== $a && (n.stencilFunc = this.stencilFunc), this.stencilRef !== 0 && (n.stencilRef = this.stencilRef), this.stencilFuncMask !== 255 && (n.stencilFuncMask = this.stencilFuncMask), this.stencilFail !== Kn && (n.stencilFail = this.stencilFail), this.stencilZFail !== Kn && (n.stencilZFail = this.stencilZFail), this.stencilZPass !== Kn && (n.stencilZPass = this.stencilZPass), this.stencilWrite === !0 && (n.stencilWrite = this.stencilWrite), this.rotation !== void 0 && this.rotation !== 0 && (n.rotation = this.rotation), this.polygonOffset === !0 && (n.polygonOffset = !0), this.polygonOffsetFactor !== 0 && (n.polygonOffsetFactor = this.polygonOffsetFactor), this.polygonOffsetUnits !== 0 && (n.polygonOffsetUnits = this.polygonOffsetUnits), this.linewidth !== void 0 && this.linewidth !== 1 && (n.linewidth = this.linewidth), this.dashSize !== void 0 && (n.dashSize = this.dashSize), this.gapSize !== void 0 && (n.gapSize = this.gapSize), this.scale !== void 0 && (n.scale = this.scale), this.dithering === !0 && (n.dithering = !0), this.alphaTest > 0 && (n.alphaTest = this.alphaTest), this.alphaHash === !0 && (n.alphaHash = !0), this.alphaToCoverage === !0 && (n.alphaToCoverage = !0), this.premultipliedAlpha === !0 && (n.premultipliedAlpha = !0), this.forceSinglePass === !0 && (n.forceSinglePass = !0), this.wireframe === !0 && (n.wireframe = !0), this.wireframeLinewidth > 1 && (n.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== "round" && (n.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== "round" && (n.wireframeLinejoin = this.wireframeLinejoin), this.flatShading === !0 && (n.flatShading = !0), this.visible === !1 && (n.visible = !1), this.toneMapped === !1 && (n.toneMapped = !1), this.fog === !1 && (n.fog = !1), Object.keys(this.userData).length > 0 && (n.userData = this.userData);
    function r(s) {
      const a = [];
      for (const o in s) {
        const l = s[o];
        delete l.metadata, a.push(l);
      }
      return a;
    }
    if (e) {
      const s = r(t.textures), a = r(t.images);
      s.length > 0 && (n.textures = s), a.length > 0 && (n.images = a);
    }
    return n;
  }
  /**
   * Returns a new material with copied values from this instance.
   *
   * @return {Material} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
  /**
   * Copies the values of the given material to this instance.
   *
   * @param {Material} source - The material to copy.
   * @return {Material} A reference to this instance.
   */
  copy(t) {
    this.name = t.name, this.blending = t.blending, this.side = t.side, this.vertexColors = t.vertexColors, this.opacity = t.opacity, this.transparent = t.transparent, this.blendSrc = t.blendSrc, this.blendDst = t.blendDst, this.blendEquation = t.blendEquation, this.blendSrcAlpha = t.blendSrcAlpha, this.blendDstAlpha = t.blendDstAlpha, this.blendEquationAlpha = t.blendEquationAlpha, this.blendColor.copy(t.blendColor), this.blendAlpha = t.blendAlpha, this.depthFunc = t.depthFunc, this.depthTest = t.depthTest, this.depthWrite = t.depthWrite, this.stencilWriteMask = t.stencilWriteMask, this.stencilFunc = t.stencilFunc, this.stencilRef = t.stencilRef, this.stencilFuncMask = t.stencilFuncMask, this.stencilFail = t.stencilFail, this.stencilZFail = t.stencilZFail, this.stencilZPass = t.stencilZPass, this.stencilWrite = t.stencilWrite;
    const e = t.clippingPlanes;
    let n = null;
    if (e !== null) {
      const r = e.length;
      n = new Array(r);
      for (let s = 0; s !== r; ++s)
        n[s] = e[s].clone();
    }
    return this.clippingPlanes = n, this.clipIntersection = t.clipIntersection, this.clipShadows = t.clipShadows, this.shadowSide = t.shadowSide, this.colorWrite = t.colorWrite, this.precision = t.precision, this.polygonOffset = t.polygonOffset, this.polygonOffsetFactor = t.polygonOffsetFactor, this.polygonOffsetUnits = t.polygonOffsetUnits, this.dithering = t.dithering, this.alphaTest = t.alphaTest, this.alphaHash = t.alphaHash, this.alphaToCoverage = t.alphaToCoverage, this.premultipliedAlpha = t.premultipliedAlpha, this.forceSinglePass = t.forceSinglePass, this.visible = t.visible, this.toneMapped = t.toneMapped, this.userData = JSON.parse(JSON.stringify(t.userData)), this;
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever this instance is no longer used in your app.
   *
   * @fires Material#dispose
   */
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  /**
   * Setting this property to `true` indicates the engine the material
   * needs to be recompiled.
   *
   * @type {boolean}
   * @default false
   * @param {boolean} value
   */
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
}
class Re extends tr {
  /**
   * Constructs a new mesh basic material.
   *
   * @param {Object} [parameters] - An object with one or more properties
   * defining the material's appearance. Any property of the material
   * (including any property from inherited materials) can be passed
   * in here. Color values can be passed any type of value accepted
   * by {@link Color#set}.
   */
  constructor(t) {
    super(), this.isMeshBasicMaterial = !0, this.type = "MeshBasicMaterial", this.color = new Ft(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new rn(), this.combine = vl, this.reflectivity = 1, this.refractionRatio = 0.98, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = !0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.color.copy(t.color), this.map = t.map, this.lightMap = t.lightMap, this.lightMapIntensity = t.lightMapIntensity, this.aoMap = t.aoMap, this.aoMapIntensity = t.aoMapIntensity, this.specularMap = t.specularMap, this.alphaMap = t.alphaMap, this.envMap = t.envMap, this.envMapRotation.copy(t.envMapRotation), this.combine = t.combine, this.reflectivity = t.reflectivity, this.refractionRatio = t.refractionRatio, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.wireframeLinecap = t.wireframeLinecap, this.wireframeLinejoin = t.wireframeLinejoin, this.fog = t.fog, this;
  }
}
const le = /* @__PURE__ */ new I(), pr = /* @__PURE__ */ new mt();
let wh = 0;
class Ze {
  /**
   * Constructs a new buffer attribute.
   *
   * @param {TypedArray} array - The array holding the attribute data.
   * @param {number} itemSize - The item size.
   * @param {boolean} [normalized=false] - Whether the data are normalized or not.
   */
  constructor(t, e, n = !1) {
    if (Array.isArray(t))
      throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
    this.isBufferAttribute = !0, Object.defineProperty(this, "id", { value: wh++ }), this.name = "", this.array = t, this.itemSize = e, this.count = t !== void 0 ? t.length / e : 0, this.normalized = n, this.usage = Za, this.updateRanges = [], this.gpuType = tn, this.version = 0;
  }
  /**
   * A callback function that is executed after the renderer has transferred the attribute
   * array data to the GPU.
   */
  onUploadCallback() {
  }
  /**
   * Flag to indicate that this attribute has changed and should be re-sent to
   * the GPU. Set this to `true` when you modify the value of the array.
   *
   * @type {number}
   * @default false
   * @param {boolean} value
   */
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
  /**
   * Sets the usage of this buffer attribute.
   *
   * @param {(StaticDrawUsage|DynamicDrawUsage|StreamDrawUsage|StaticReadUsage|DynamicReadUsage|StreamReadUsage|StaticCopyUsage|DynamicCopyUsage|StreamCopyUsage)} value - The usage to set.
   * @return {BufferAttribute} A reference to this buffer attribute.
   */
  setUsage(t) {
    return this.usage = t, this;
  }
  /**
   * Adds a range of data in the data array to be updated on the GPU.
   *
   * @param {number} start - Position at which to start update.
   * @param {number} count - The number of components to update.
   */
  addUpdateRange(t, e) {
    this.updateRanges.push({ start: t, count: e });
  }
  /**
   * Clears the update ranges.
   */
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  /**
   * Copies the values of the given buffer attribute to this instance.
   *
   * @param {BufferAttribute} source - The buffer attribute to copy.
   * @return {BufferAttribute} A reference to this instance.
   */
  copy(t) {
    return this.name = t.name, this.array = new t.array.constructor(t.array), this.itemSize = t.itemSize, this.count = t.count, this.normalized = t.normalized, this.usage = t.usage, this.gpuType = t.gpuType, this;
  }
  /**
   * Copies a vector from the given buffer attribute to this one. The start
   * and destination position in the attribute buffers are represented by the
   * given indices.
   *
   * @param {number} index1 - The destination index into this buffer attribute.
   * @param {BufferAttribute} attribute - The buffer attribute to copy from.
   * @param {number} index2 - The source index into the given buffer attribute.
   * @return {BufferAttribute} A reference to this instance.
   */
  copyAt(t, e, n) {
    t *= this.itemSize, n *= e.itemSize;
    for (let r = 0, s = this.itemSize; r < s; r++)
      this.array[t + r] = e.array[n + r];
    return this;
  }
  /**
   * Copies the given array data into this buffer attribute.
   *
   * @param {(TypedArray|Array)} array - The array to copy.
   * @return {BufferAttribute} A reference to this instance.
   */
  copyArray(t) {
    return this.array.set(t), this;
  }
  /**
   * Applies the given 3x3 matrix to the given attribute. Works with
   * item size `2` and `3`.
   *
   * @param {Matrix3} m - The matrix to apply.
   * @return {BufferAttribute} A reference to this instance.
   */
  applyMatrix3(t) {
    if (this.itemSize === 2)
      for (let e = 0, n = this.count; e < n; e++)
        pr.fromBufferAttribute(this, e), pr.applyMatrix3(t), this.setXY(e, pr.x, pr.y);
    else if (this.itemSize === 3)
      for (let e = 0, n = this.count; e < n; e++)
        le.fromBufferAttribute(this, e), le.applyMatrix3(t), this.setXYZ(e, le.x, le.y, le.z);
    return this;
  }
  /**
   * Applies the given 4x4 matrix to the given attribute. Only works with
   * item size `3`.
   *
   * @param {Matrix4} m - The matrix to apply.
   * @return {BufferAttribute} A reference to this instance.
   */
  applyMatrix4(t) {
    for (let e = 0, n = this.count; e < n; e++)
      le.fromBufferAttribute(this, e), le.applyMatrix4(t), this.setXYZ(e, le.x, le.y, le.z);
    return this;
  }
  /**
   * Applies the given 3x3 normal matrix to the given attribute. Only works with
   * item size `3`.
   *
   * @param {Matrix3} m - The normal matrix to apply.
   * @return {BufferAttribute} A reference to this instance.
   */
  applyNormalMatrix(t) {
    for (let e = 0, n = this.count; e < n; e++)
      le.fromBufferAttribute(this, e), le.applyNormalMatrix(t), this.setXYZ(e, le.x, le.y, le.z);
    return this;
  }
  /**
   * Applies the given 4x4 matrix to the given attribute. Only works with
   * item size `3` and with direction vectors.
   *
   * @param {Matrix4} m - The matrix to apply.
   * @return {BufferAttribute} A reference to this instance.
   */
  transformDirection(t) {
    for (let e = 0, n = this.count; e < n; e++)
      le.fromBufferAttribute(this, e), le.transformDirection(t), this.setXYZ(e, le.x, le.y, le.z);
    return this;
  }
  /**
   * Sets the given array data in the buffer attribute.
   *
   * @param {(TypedArray|Array)} value - The array data to set.
   * @param {number} [offset=0] - The offset in this buffer attribute's array.
   * @return {BufferAttribute} A reference to this instance.
   */
  set(t, e = 0) {
    return this.array.set(t, e), this;
  }
  /**
   * Returns the given component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} component - The component index.
   * @return {number} The returned value.
   */
  getComponent(t, e) {
    let n = this.array[t * this.itemSize + e];
    return this.normalized && (n = Ri(n, this.array)), n;
  }
  /**
   * Sets the given value to the given component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} component - The component index.
   * @param {number} value - The value to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setComponent(t, e, n) {
    return this.normalized && (n = be(n, this.array)), this.array[t * this.itemSize + e] = n, this;
  }
  /**
   * Returns the x component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @return {number} The x component.
   */
  getX(t) {
    let e = this.array[t * this.itemSize];
    return this.normalized && (e = Ri(e, this.array)), e;
  }
  /**
   * Sets the x component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} x - The value to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setX(t, e) {
    return this.normalized && (e = be(e, this.array)), this.array[t * this.itemSize] = e, this;
  }
  /**
   * Returns the y component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @return {number} The y component.
   */
  getY(t) {
    let e = this.array[t * this.itemSize + 1];
    return this.normalized && (e = Ri(e, this.array)), e;
  }
  /**
   * Sets the y component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} y - The value to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setY(t, e) {
    return this.normalized && (e = be(e, this.array)), this.array[t * this.itemSize + 1] = e, this;
  }
  /**
   * Returns the z component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @return {number} The z component.
   */
  getZ(t) {
    let e = this.array[t * this.itemSize + 2];
    return this.normalized && (e = Ri(e, this.array)), e;
  }
  /**
   * Sets the z component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} z - The value to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setZ(t, e) {
    return this.normalized && (e = be(e, this.array)), this.array[t * this.itemSize + 2] = e, this;
  }
  /**
   * Returns the w component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @return {number} The w component.
   */
  getW(t) {
    let e = this.array[t * this.itemSize + 3];
    return this.normalized && (e = Ri(e, this.array)), e;
  }
  /**
   * Sets the w component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} w - The value to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setW(t, e) {
    return this.normalized && (e = be(e, this.array)), this.array[t * this.itemSize + 3] = e, this;
  }
  /**
   * Sets the x and y component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} x - The value for the x component to set.
   * @param {number} y - The value for the y component to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setXY(t, e, n) {
    return t *= this.itemSize, this.normalized && (e = be(e, this.array), n = be(n, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this;
  }
  /**
   * Sets the x, y and z component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} x - The value for the x component to set.
   * @param {number} y - The value for the y component to set.
   * @param {number} z - The value for the z component to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setXYZ(t, e, n, r) {
    return t *= this.itemSize, this.normalized && (e = be(e, this.array), n = be(n, this.array), r = be(r, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this.array[t + 2] = r, this;
  }
  /**
   * Sets the x, y, z and w component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} x - The value for the x component to set.
   * @param {number} y - The value for the y component to set.
   * @param {number} z - The value for the z component to set.
   * @param {number} w - The value for the w component to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setXYZW(t, e, n, r, s) {
    return t *= this.itemSize, this.normalized && (e = be(e, this.array), n = be(n, this.array), r = be(r, this.array), s = be(s, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this.array[t + 2] = r, this.array[t + 3] = s, this;
  }
  /**
   * Sets the given callback function that is executed after the Renderer has transferred
   * the attribute array data to the GPU. Can be used to perform clean-up operations after
   * the upload when attribute data are not needed anymore on the CPU side.
   *
   * @param {Function} callback - The `onUpload()` callback.
   * @return {BufferAttribute} A reference to this instance.
   */
  onUpload(t) {
    return this.onUploadCallback = t, this;
  }
  /**
   * Returns a new buffer attribute with copied values from this instance.
   *
   * @return {BufferAttribute} A clone of this instance.
   */
  clone() {
    return new this.constructor(this.array, this.itemSize).copy(this);
  }
  /**
   * Serializes the buffer attribute into JSON.
   *
   * @return {Object} A JSON object representing the serialized buffer attribute.
   */
  toJSON() {
    const t = {
      itemSize: this.itemSize,
      type: this.array.constructor.name,
      array: Array.from(this.array),
      normalized: this.normalized
    };
    return this.name !== "" && (t.name = this.name), this.usage !== Za && (t.usage = this.usage), t;
  }
}
class Ul extends Ze {
  /**
   * Constructs a new buffer attribute.
   *
   * @param {(Array<number>|Uint16Array)} array - The array holding the attribute data.
   * @param {number} itemSize - The item size.
   * @param {boolean} [normalized=false] - Whether the data are normalized or not.
   */
  constructor(t, e, n) {
    super(new Uint16Array(t), e, n);
  }
}
class Nl extends Ze {
  /**
   * Constructs a new buffer attribute.
   *
   * @param {(Array<number>|Uint32Array)} array - The array holding the attribute data.
   * @param {number} itemSize - The item size.
   * @param {boolean} [normalized=false] - Whether the data are normalized or not.
   */
  constructor(t, e, n) {
    super(new Uint32Array(t), e, n);
  }
}
class Ne extends Ze {
  /**
   * Constructs a new buffer attribute.
   *
   * @param {(Array<number>|Float32Array)} array - The array holding the attribute data.
   * @param {number} itemSize - The item size.
   * @param {boolean} [normalized=false] - Whether the data are normalized or not.
   */
  constructor(t, e, n) {
    super(new Float32Array(t), e, n);
  }
}
let Rh = 0;
const ze = /* @__PURE__ */ new Wt(), ms = /* @__PURE__ */ new _e(), oi = /* @__PURE__ */ new I(), De = /* @__PURE__ */ new Zn(), Di = /* @__PURE__ */ new Zn(), de = /* @__PURE__ */ new I();
class vn extends Ei {
  /**
   * Constructs a new geometry.
   */
  constructor() {
    super(), this.isBufferGeometry = !0, Object.defineProperty(this, "id", { value: Rh++ }), this.uuid = Ti(), this.name = "", this.type = "BufferGeometry", this.index = null, this.indirect = null, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = !1, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = { start: 0, count: 1 / 0 }, this.userData = {};
  }
  /**
   * Returns the index of this geometry.
   *
   * @return {?BufferAttribute} The index. Returns `null` if no index is defined.
   */
  getIndex() {
    return this.index;
  }
  /**
   * Sets the given index to this geometry.
   *
   * @param {Array<number>|BufferAttribute} index - The index to set.
   * @return {BufferGeometry} A reference to this instance.
   */
  setIndex(t) {
    return Array.isArray(t) ? this.index = new (Pl(t) ? Nl : Ul)(t, 1) : this.index = t, this;
  }
  /**
   * Sets the given indirect attribute to this geometry.
   *
   * @param {BufferAttribute} indirect - The attribute holding indirect draw calls.
   * @return {BufferGeometry} A reference to this instance.
   */
  setIndirect(t) {
    return this.indirect = t, this;
  }
  /**
   * Returns the indirect attribute of this geometry.
   *
   * @return {?BufferAttribute} The indirect attribute. Returns `null` if no indirect attribute is defined.
   */
  getIndirect() {
    return this.indirect;
  }
  /**
   * Returns the buffer attribute for the given name.
   *
   * @param {string} name - The attribute name.
   * @return {BufferAttribute|InterleavedBufferAttribute|undefined} The buffer attribute.
   * Returns `undefined` if not attribute has been found.
   */
  getAttribute(t) {
    return this.attributes[t];
  }
  /**
   * Sets the given attribute for the given name.
   *
   * @param {string} name - The attribute name.
   * @param {BufferAttribute|InterleavedBufferAttribute} attribute - The attribute to set.
   * @return {BufferGeometry} A reference to this instance.
   */
  setAttribute(t, e) {
    return this.attributes[t] = e, this;
  }
  /**
   * Deletes the attribute for the given name.
   *
   * @param {string} name - The attribute name to delete.
   * @return {BufferGeometry} A reference to this instance.
   */
  deleteAttribute(t) {
    return delete this.attributes[t], this;
  }
  /**
   * Returns `true` if this geometry has an attribute for the given name.
   *
   * @param {string} name - The attribute name.
   * @return {boolean} Whether this geometry has an attribute for the given name or not.
   */
  hasAttribute(t) {
    return this.attributes[t] !== void 0;
  }
  /**
   * Adds a group to this geometry.
   *
   * @param {number} start - The first element in this draw call. That is the first
   * vertex for non-indexed geometry, otherwise the first triangle index.
   * @param {number} count - Specifies how many vertices (or indices) are part of this group.
   * @param {number} [materialIndex=0] - The material array index to use.
   */
  addGroup(t, e, n = 0) {
    this.groups.push({
      start: t,
      count: e,
      materialIndex: n
    });
  }
  /**
   * Clears all groups.
   */
  clearGroups() {
    this.groups = [];
  }
  /**
   * Sets the draw range for this geometry.
   *
   * @param {number} start - The first vertex for non-indexed geometry, otherwise the first triangle index.
   * @param {number} count - For non-indexed BufferGeometry, `count` is the number of vertices to render.
   * For indexed BufferGeometry, `count` is the number of indices to render.
   */
  setDrawRange(t, e) {
    this.drawRange.start = t, this.drawRange.count = e;
  }
  /**
   * Applies the given 4x4 transformation matrix to the geometry.
   *
   * @param {Matrix4} matrix - The matrix to apply.
   * @return {BufferGeometry} A reference to this instance.
   */
  applyMatrix4(t) {
    const e = this.attributes.position;
    e !== void 0 && (e.applyMatrix4(t), e.needsUpdate = !0);
    const n = this.attributes.normal;
    if (n !== void 0) {
      const s = new Lt().getNormalMatrix(t);
      n.applyNormalMatrix(s), n.needsUpdate = !0;
    }
    const r = this.attributes.tangent;
    return r !== void 0 && (r.transformDirection(t), r.needsUpdate = !0), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this;
  }
  /**
   * Applies the rotation represented by the Quaternion to the geometry.
   *
   * @param {Quaternion} q - The Quaternion to apply.
   * @return {BufferGeometry} A reference to this instance.
   */
  applyQuaternion(t) {
    return ze.makeRotationFromQuaternion(t), this.applyMatrix4(ze), this;
  }
  /**
   * Rotates the geometry about the X axis. This is typically done as a one time
   * operation, and not during a loop. Use {@link Object3D#rotation} for typical
   * real-time mesh rotation.
   *
   * @param {number} angle - The angle in radians.
   * @return {BufferGeometry} A reference to this instance.
   */
  rotateX(t) {
    return ze.makeRotationX(t), this.applyMatrix4(ze), this;
  }
  /**
   * Rotates the geometry about the Y axis. This is typically done as a one time
   * operation, and not during a loop. Use {@link Object3D#rotation} for typical
   * real-time mesh rotation.
   *
   * @param {number} angle - The angle in radians.
   * @return {BufferGeometry} A reference to this instance.
   */
  rotateY(t) {
    return ze.makeRotationY(t), this.applyMatrix4(ze), this;
  }
  /**
   * Rotates the geometry about the Z axis. This is typically done as a one time
   * operation, and not during a loop. Use {@link Object3D#rotation} for typical
   * real-time mesh rotation.
   *
   * @param {number} angle - The angle in radians.
   * @return {BufferGeometry} A reference to this instance.
   */
  rotateZ(t) {
    return ze.makeRotationZ(t), this.applyMatrix4(ze), this;
  }
  /**
   * Translates the geometry. This is typically done as a one time
   * operation, and not during a loop. Use {@link Object3D#position} for typical
   * real-time mesh rotation.
   *
   * @param {number} x - The x offset.
   * @param {number} y - The y offset.
   * @param {number} z - The z offset.
   * @return {BufferGeometry} A reference to this instance.
   */
  translate(t, e, n) {
    return ze.makeTranslation(t, e, n), this.applyMatrix4(ze), this;
  }
  /**
   * Scales the geometry. This is typically done as a one time
   * operation, and not during a loop. Use {@link Object3D#scale} for typical
   * real-time mesh rotation.
   *
   * @param {number} x - The x scale.
   * @param {number} y - The y scale.
   * @param {number} z - The z scale.
   * @return {BufferGeometry} A reference to this instance.
   */
  scale(t, e, n) {
    return ze.makeScale(t, e, n), this.applyMatrix4(ze), this;
  }
  /**
   * Rotates the geometry to face a point in 3D space. This is typically done as a one time
   * operation, and not during a loop. Use {@link Object3D#lookAt} for typical
   * real-time mesh rotation.
   *
   * @param {Vector3} vector - The target point.
   * @return {BufferGeometry} A reference to this instance.
   */
  lookAt(t) {
    return ms.lookAt(t), ms.updateMatrix(), this.applyMatrix4(ms.matrix), this;
  }
  /**
   * Center the geometry based on its bounding box.
   *
   * @return {BufferGeometry} A reference to this instance.
   */
  center() {
    return this.computeBoundingBox(), this.boundingBox.getCenter(oi).negate(), this.translate(oi.x, oi.y, oi.z), this;
  }
  /**
   * Defines a geometry by creating a `position` attribute based on the given array of points. The array
   * can hold 2D or 3D vectors. When using two-dimensional data, the `z` coordinate for all vertices is
   * set to `0`.
   *
   * If the method is used with an existing `position` attribute, the vertex data are overwritten with the
   * data from the array. The length of the array must match the vertex count.
   *
   * @param {Array<Vector2>|Array<Vector3>} points - The points.
   * @return {BufferGeometry} A reference to this instance.
   */
  setFromPoints(t) {
    const e = this.getAttribute("position");
    if (e === void 0) {
      const n = [];
      for (let r = 0, s = t.length; r < s; r++) {
        const a = t[r];
        n.push(a.x, a.y, a.z || 0);
      }
      this.setAttribute("position", new Ne(n, 3));
    } else {
      const n = Math.min(t.length, e.count);
      for (let r = 0; r < n; r++) {
        const s = t[r];
        e.setXYZ(r, s.x, s.y, s.z || 0);
      }
      t.length > e.count && console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."), e.needsUpdate = !0;
    }
    return this;
  }
  /**
   * Computes the bounding box of the geometry, and updates the `boundingBox` member.
   * The bounding box is not computed by the engine; it must be computed by your app.
   * You may need to recompute the bounding box if the geometry vertices are modified.
   */
  computeBoundingBox() {
    this.boundingBox === null && (this.boundingBox = new Zn());
    const t = this.attributes.position, e = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this), this.boundingBox.set(
        new I(-1 / 0, -1 / 0, -1 / 0),
        new I(1 / 0, 1 / 0, 1 / 0)
      );
      return;
    }
    if (t !== void 0) {
      if (this.boundingBox.setFromBufferAttribute(t), e)
        for (let n = 0, r = e.length; n < r; n++) {
          const s = e[n];
          De.setFromBufferAttribute(s), this.morphTargetsRelative ? (de.addVectors(this.boundingBox.min, De.min), this.boundingBox.expandByPoint(de), de.addVectors(this.boundingBox.max, De.max), this.boundingBox.expandByPoint(de)) : (this.boundingBox.expandByPoint(De.min), this.boundingBox.expandByPoint(De.max));
        }
    } else
      this.boundingBox.makeEmpty();
    (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
  }
  /**
   * Computes the bounding sphere of the geometry, and updates the `boundingSphere` member.
   * The engine automatically computes the bounding sphere when it is needed, e.g., for ray casting or view frustum culling.
   * You may need to recompute the bounding sphere if the geometry vertices are modified.
   */
  computeBoundingSphere() {
    this.boundingSphere === null && (this.boundingSphere = new Qi());
    const t = this.attributes.position, e = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute) {
      console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this), this.boundingSphere.set(new I(), 1 / 0);
      return;
    }
    if (t) {
      const n = this.boundingSphere.center;
      if (De.setFromBufferAttribute(t), e)
        for (let s = 0, a = e.length; s < a; s++) {
          const o = e[s];
          Di.setFromBufferAttribute(o), this.morphTargetsRelative ? (de.addVectors(De.min, Di.min), De.expandByPoint(de), de.addVectors(De.max, Di.max), De.expandByPoint(de)) : (De.expandByPoint(Di.min), De.expandByPoint(Di.max));
        }
      De.getCenter(n);
      let r = 0;
      for (let s = 0, a = t.count; s < a; s++)
        de.fromBufferAttribute(t, s), r = Math.max(r, n.distanceToSquared(de));
      if (e)
        for (let s = 0, a = e.length; s < a; s++) {
          const o = e[s], l = this.morphTargetsRelative;
          for (let c = 0, h = o.count; c < h; c++)
            de.fromBufferAttribute(o, c), l && (oi.fromBufferAttribute(t, c), de.add(oi)), r = Math.max(r, n.distanceToSquared(de));
        }
      this.boundingSphere.radius = Math.sqrt(r), isNaN(this.boundingSphere.radius) && console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
    }
  }
  /**
   * Calculates and adds a tangent attribute to this geometry.
   *
   * The computation is only supported for indexed geometries and if position, normal, and uv attributes
   * are defined. When using a tangent space normal map, prefer the MikkTSpace algorithm provided by
   * {@link BufferGeometryUtils#computeMikkTSpaceTangents} instead.
   */
  computeTangents() {
    const t = this.index, e = this.attributes;
    if (t === null || e.position === void 0 || e.normal === void 0 || e.uv === void 0) {
      console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
      return;
    }
    const n = e.position, r = e.normal, s = e.uv;
    this.hasAttribute("tangent") === !1 && this.setAttribute("tangent", new Ze(new Float32Array(4 * n.count), 4));
    const a = this.getAttribute("tangent"), o = [], l = [];
    for (let U = 0; U < n.count; U++)
      o[U] = new I(), l[U] = new I();
    const c = new I(), h = new I(), u = new I(), f = new mt(), d = new mt(), g = new mt(), v = new I(), m = new I();
    function p(U, y, M) {
      c.fromBufferAttribute(n, U), h.fromBufferAttribute(n, y), u.fromBufferAttribute(n, M), f.fromBufferAttribute(s, U), d.fromBufferAttribute(s, y), g.fromBufferAttribute(s, M), h.sub(c), u.sub(c), d.sub(f), g.sub(f);
      const C = 1 / (d.x * g.y - g.x * d.y);
      isFinite(C) && (v.copy(h).multiplyScalar(g.y).addScaledVector(u, -d.y).multiplyScalar(C), m.copy(u).multiplyScalar(d.x).addScaledVector(h, -g.x).multiplyScalar(C), o[U].add(v), o[y].add(v), o[M].add(v), l[U].add(m), l[y].add(m), l[M].add(m));
    }
    let A = this.groups;
    A.length === 0 && (A = [{
      start: 0,
      count: t.count
    }]);
    for (let U = 0, y = A.length; U < y; ++U) {
      const M = A[U], C = M.start, H = M.count;
      for (let B = C, G = C + H; B < G; B += 3)
        p(
          t.getX(B + 0),
          t.getX(B + 1),
          t.getX(B + 2)
        );
    }
    const T = new I(), S = new I(), N = new I(), w = new I();
    function R(U) {
      N.fromBufferAttribute(r, U), w.copy(N);
      const y = o[U];
      T.copy(y), T.sub(N.multiplyScalar(N.dot(y))).normalize(), S.crossVectors(w, y);
      const C = S.dot(l[U]) < 0 ? -1 : 1;
      a.setXYZW(U, T.x, T.y, T.z, C);
    }
    for (let U = 0, y = A.length; U < y; ++U) {
      const M = A[U], C = M.start, H = M.count;
      for (let B = C, G = C + H; B < G; B += 3)
        R(t.getX(B + 0)), R(t.getX(B + 1)), R(t.getX(B + 2));
    }
  }
  /**
   * Computes vertex normals for the given vertex data. For indexed geometries, the method sets
   * each vertex normal to be the average of the face normals of the faces that share that vertex.
   * For non-indexed geometries, vertices are not shared, and the method sets each vertex normal
   * to be the same as the face normal.
   */
  computeVertexNormals() {
    const t = this.index, e = this.getAttribute("position");
    if (e !== void 0) {
      let n = this.getAttribute("normal");
      if (n === void 0)
        n = new Ze(new Float32Array(e.count * 3), 3), this.setAttribute("normal", n);
      else
        for (let f = 0, d = n.count; f < d; f++)
          n.setXYZ(f, 0, 0, 0);
      const r = new I(), s = new I(), a = new I(), o = new I(), l = new I(), c = new I(), h = new I(), u = new I();
      if (t)
        for (let f = 0, d = t.count; f < d; f += 3) {
          const g = t.getX(f + 0), v = t.getX(f + 1), m = t.getX(f + 2);
          r.fromBufferAttribute(e, g), s.fromBufferAttribute(e, v), a.fromBufferAttribute(e, m), h.subVectors(a, s), u.subVectors(r, s), h.cross(u), o.fromBufferAttribute(n, g), l.fromBufferAttribute(n, v), c.fromBufferAttribute(n, m), o.add(h), l.add(h), c.add(h), n.setXYZ(g, o.x, o.y, o.z), n.setXYZ(v, l.x, l.y, l.z), n.setXYZ(m, c.x, c.y, c.z);
        }
      else
        for (let f = 0, d = e.count; f < d; f += 3)
          r.fromBufferAttribute(e, f + 0), s.fromBufferAttribute(e, f + 1), a.fromBufferAttribute(e, f + 2), h.subVectors(a, s), u.subVectors(r, s), h.cross(u), n.setXYZ(f + 0, h.x, h.y, h.z), n.setXYZ(f + 1, h.x, h.y, h.z), n.setXYZ(f + 2, h.x, h.y, h.z);
      this.normalizeNormals(), n.needsUpdate = !0;
    }
  }
  /**
   * Ensures every normal vector in a geometry will have a magnitude of `1`. This will
   * correct lighting on the geometry surfaces.
   */
  normalizeNormals() {
    const t = this.attributes.normal;
    for (let e = 0, n = t.count; e < n; e++)
      de.fromBufferAttribute(t, e), de.normalize(), t.setXYZ(e, de.x, de.y, de.z);
  }
  /**
   * Return a new non-index version of this indexed geometry. If the geometry
   * is already non-indexed, the method is a NOOP.
   *
   * @return {BufferGeometry} The non-indexed version of this indexed geometry.
   */
  toNonIndexed() {
    function t(o, l) {
      const c = o.array, h = o.itemSize, u = o.normalized, f = new c.constructor(l.length * h);
      let d = 0, g = 0;
      for (let v = 0, m = l.length; v < m; v++) {
        o.isInterleavedBufferAttribute ? d = l[v] * o.data.stride + o.offset : d = l[v] * h;
        for (let p = 0; p < h; p++)
          f[g++] = c[d++];
      }
      return new Ze(f, h, u);
    }
    if (this.index === null)
      return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
    const e = new vn(), n = this.index.array, r = this.attributes;
    for (const o in r) {
      const l = r[o], c = t(l, n);
      e.setAttribute(o, c);
    }
    const s = this.morphAttributes;
    for (const o in s) {
      const l = [], c = s[o];
      for (let h = 0, u = c.length; h < u; h++) {
        const f = c[h], d = t(f, n);
        l.push(d);
      }
      e.morphAttributes[o] = l;
    }
    e.morphTargetsRelative = this.morphTargetsRelative;
    const a = this.groups;
    for (let o = 0, l = a.length; o < l; o++) {
      const c = a[o];
      e.addGroup(c.start, c.count, c.materialIndex);
    }
    return e;
  }
  /**
   * Serializes the geometry into JSON.
   *
   * @return {Object} A JSON object representing the serialized geometry.
   */
  toJSON() {
    const t = {
      metadata: {
        version: 4.6,
        type: "BufferGeometry",
        generator: "BufferGeometry.toJSON"
      }
    };
    if (t.uuid = this.uuid, t.type = this.type, this.name !== "" && (t.name = this.name), Object.keys(this.userData).length > 0 && (t.userData = this.userData), this.parameters !== void 0) {
      const l = this.parameters;
      for (const c in l)
        l[c] !== void 0 && (t[c] = l[c]);
      return t;
    }
    t.data = { attributes: {} };
    const e = this.index;
    e !== null && (t.data.index = {
      type: e.array.constructor.name,
      array: Array.prototype.slice.call(e.array)
    });
    const n = this.attributes;
    for (const l in n) {
      const c = n[l];
      t.data.attributes[l] = c.toJSON(t.data);
    }
    const r = {};
    let s = !1;
    for (const l in this.morphAttributes) {
      const c = this.morphAttributes[l], h = [];
      for (let u = 0, f = c.length; u < f; u++) {
        const d = c[u];
        h.push(d.toJSON(t.data));
      }
      h.length > 0 && (r[l] = h, s = !0);
    }
    s && (t.data.morphAttributes = r, t.data.morphTargetsRelative = this.morphTargetsRelative);
    const a = this.groups;
    a.length > 0 && (t.data.groups = JSON.parse(JSON.stringify(a)));
    const o = this.boundingSphere;
    return o !== null && (t.data.boundingSphere = {
      center: o.center.toArray(),
      radius: o.radius
    }), t;
  }
  /**
   * Returns a new geometry with copied values from this instance.
   *
   * @return {BufferGeometry} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
  /**
   * Copies the values of the given geometry to this instance.
   *
   * @param {BufferGeometry} source - The geometry to copy.
   * @return {BufferGeometry} A reference to this instance.
   */
  copy(t) {
    this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
    const e = {};
    this.name = t.name;
    const n = t.index;
    n !== null && this.setIndex(n.clone());
    const r = t.attributes;
    for (const c in r) {
      const h = r[c];
      this.setAttribute(c, h.clone(e));
    }
    const s = t.morphAttributes;
    for (const c in s) {
      const h = [], u = s[c];
      for (let f = 0, d = u.length; f < d; f++)
        h.push(u[f].clone(e));
      this.morphAttributes[c] = h;
    }
    this.morphTargetsRelative = t.morphTargetsRelative;
    const a = t.groups;
    for (let c = 0, h = a.length; c < h; c++) {
      const u = a[c];
      this.addGroup(u.start, u.count, u.materialIndex);
    }
    const o = t.boundingBox;
    o !== null && (this.boundingBox = o.clone());
    const l = t.boundingSphere;
    return l !== null && (this.boundingSphere = l.clone()), this.drawRange.start = t.drawRange.start, this.drawRange.count = t.drawRange.count, this.userData = t.userData, this;
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever this instance is no longer used in your app.
   *
   * @fires BufferGeometry#dispose
   */
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
const co = /* @__PURE__ */ new Wt(), Un = /* @__PURE__ */ new xh(), mr = /* @__PURE__ */ new Qi(), ho = /* @__PURE__ */ new I(), gr = /* @__PURE__ */ new I(), _r = /* @__PURE__ */ new I(), vr = /* @__PURE__ */ new I(), gs = /* @__PURE__ */ new I(), xr = /* @__PURE__ */ new I(), uo = /* @__PURE__ */ new I(), Mr = /* @__PURE__ */ new I();
class Kt extends _e {
  /**
   * Constructs a new mesh.
   *
   * @param {BufferGeometry} [geometry] - The mesh geometry.
   * @param {Material|Array<Material>} [material] - The mesh material.
   */
  constructor(t = new vn(), e = new Re()) {
    super(), this.isMesh = !0, this.type = "Mesh", this.geometry = t, this.material = e, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.updateMorphTargets();
  }
  copy(t, e) {
    return super.copy(t, e), t.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = t.morphTargetInfluences.slice()), t.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, t.morphTargetDictionary)), this.material = Array.isArray(t.material) ? t.material.slice() : t.material, this.geometry = t.geometry, this;
  }
  /**
   * Sets the values of {@link Mesh#morphTargetDictionary} and {@link Mesh#morphTargetInfluences}
   * to make sure existing morph targets can influence this 3D object.
   */
  updateMorphTargets() {
    const e = this.geometry.morphAttributes, n = Object.keys(e);
    if (n.length > 0) {
      const r = e[n[0]];
      if (r !== void 0) {
        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
        for (let s = 0, a = r.length; s < a; s++) {
          const o = r[s].name || String(s);
          this.morphTargetInfluences.push(0), this.morphTargetDictionary[o] = s;
        }
      }
    }
  }
  /**
   * Returns the local-space position of the vertex at the given index, taking into
   * account the current animation state of both morph targets and skinning.
   *
   * @param {number} index - The vertex index.
   * @param {Vector3} target - The target object that is used to store the method's result.
   * @return {Vector3} The vertex position in local space.
   */
  getVertexPosition(t, e) {
    const n = this.geometry, r = n.attributes.position, s = n.morphAttributes.position, a = n.morphTargetsRelative;
    e.fromBufferAttribute(r, t);
    const o = this.morphTargetInfluences;
    if (s && o) {
      xr.set(0, 0, 0);
      for (let l = 0, c = s.length; l < c; l++) {
        const h = o[l], u = s[l];
        h !== 0 && (gs.fromBufferAttribute(u, t), a ? xr.addScaledVector(gs, h) : xr.addScaledVector(gs.sub(e), h));
      }
      e.add(xr);
    }
    return e;
  }
  /**
   * Computes intersection points between a casted ray and this line.
   *
   * @param {Raycaster} raycaster - The raycaster.
   * @param {Array<Object>} intersects - The target array that holds the intersection points.
   */
  raycast(t, e) {
    const n = this.geometry, r = this.material, s = this.matrixWorld;
    r !== void 0 && (n.boundingSphere === null && n.computeBoundingSphere(), mr.copy(n.boundingSphere), mr.applyMatrix4(s), Un.copy(t.ray).recast(t.near), !(mr.containsPoint(Un.origin) === !1 && (Un.intersectSphere(mr, ho) === null || Un.origin.distanceToSquared(ho) > (t.far - t.near) ** 2)) && (co.copy(s).invert(), Un.copy(t.ray).applyMatrix4(co), !(n.boundingBox !== null && Un.intersectsBox(n.boundingBox) === !1) && this._computeIntersections(t, e, Un)));
  }
  _computeIntersections(t, e, n) {
    let r;
    const s = this.geometry, a = this.material, o = s.index, l = s.attributes.position, c = s.attributes.uv, h = s.attributes.uv1, u = s.attributes.normal, f = s.groups, d = s.drawRange;
    if (o !== null)
      if (Array.isArray(a))
        for (let g = 0, v = f.length; g < v; g++) {
          const m = f[g], p = a[m.materialIndex], A = Math.max(m.start, d.start), T = Math.min(o.count, Math.min(m.start + m.count, d.start + d.count));
          for (let S = A, N = T; S < N; S += 3) {
            const w = o.getX(S), R = o.getX(S + 1), U = o.getX(S + 2);
            r = Sr(this, p, t, n, c, h, u, w, R, U), r && (r.faceIndex = Math.floor(S / 3), r.face.materialIndex = m.materialIndex, e.push(r));
          }
        }
      else {
        const g = Math.max(0, d.start), v = Math.min(o.count, d.start + d.count);
        for (let m = g, p = v; m < p; m += 3) {
          const A = o.getX(m), T = o.getX(m + 1), S = o.getX(m + 2);
          r = Sr(this, a, t, n, c, h, u, A, T, S), r && (r.faceIndex = Math.floor(m / 3), e.push(r));
        }
      }
    else if (l !== void 0)
      if (Array.isArray(a))
        for (let g = 0, v = f.length; g < v; g++) {
          const m = f[g], p = a[m.materialIndex], A = Math.max(m.start, d.start), T = Math.min(l.count, Math.min(m.start + m.count, d.start + d.count));
          for (let S = A, N = T; S < N; S += 3) {
            const w = S, R = S + 1, U = S + 2;
            r = Sr(this, p, t, n, c, h, u, w, R, U), r && (r.faceIndex = Math.floor(S / 3), r.face.materialIndex = m.materialIndex, e.push(r));
          }
        }
      else {
        const g = Math.max(0, d.start), v = Math.min(l.count, d.start + d.count);
        for (let m = g, p = v; m < p; m += 3) {
          const A = m, T = m + 1, S = m + 2;
          r = Sr(this, a, t, n, c, h, u, A, T, S), r && (r.faceIndex = Math.floor(m / 3), e.push(r));
        }
      }
  }
}
function Ch(i, t, e, n, r, s, a, o) {
  let l;
  if (t.side === Ce ? l = n.intersectTriangle(a, s, r, !0, o) : l = n.intersectTriangle(r, s, a, t.side === Rn, o), l === null) return null;
  Mr.copy(o), Mr.applyMatrix4(i.matrixWorld);
  const c = e.ray.origin.distanceTo(Mr);
  return c < e.near || c > e.far ? null : {
    distance: c,
    point: Mr.clone(),
    object: i
  };
}
function Sr(i, t, e, n, r, s, a, o, l, c) {
  i.getVertexPosition(o, gr), i.getVertexPosition(l, _r), i.getVertexPosition(c, vr);
  const h = Ch(i, t, e, n, gr, _r, vr, uo);
  if (h) {
    const u = new I();
    Ye.getBarycoord(uo, gr, _r, vr, u), r && (h.uv = Ye.getInterpolatedAttribute(r, o, l, c, u, new mt())), s && (h.uv1 = Ye.getInterpolatedAttribute(s, o, l, c, u, new mt())), a && (h.normal = Ye.getInterpolatedAttribute(a, o, l, c, u, new I()), h.normal.dot(n.direction) > 0 && h.normal.multiplyScalar(-1));
    const f = {
      a: o,
      b: l,
      c,
      normal: new I(),
      materialIndex: 0
    };
    Ye.getNormal(gr, _r, vr, f.normal), h.face = f, h.barycoord = u;
  }
  return h;
}
class pe extends vn {
  /**
   * Constructs a new box geometry.
   *
   * @param {number} [width=1] - The width. That is, the length of the edges parallel to the X axis.
   * @param {number} [height=1] - The height. That is, the length of the edges parallel to the Y axis.
   * @param {number} [depth=1] - The depth. That is, the length of the edges parallel to the Z axis.
   * @param {number} [widthSegments=1] - Number of segmented rectangular faces along the width of the sides.
   * @param {number} [heightSegments=1] - Number of segmented rectangular faces along the height of the sides.
   * @param {number} [depthSegments=1] - Number of segmented rectangular faces along the depth of the sides.
   */
  constructor(t = 1, e = 1, n = 1, r = 1, s = 1, a = 1) {
    super(), this.type = "BoxGeometry", this.parameters = {
      width: t,
      height: e,
      depth: n,
      widthSegments: r,
      heightSegments: s,
      depthSegments: a
    };
    const o = this;
    r = Math.floor(r), s = Math.floor(s), a = Math.floor(a);
    const l = [], c = [], h = [], u = [];
    let f = 0, d = 0;
    g("z", "y", "x", -1, -1, n, e, t, a, s, 0), g("z", "y", "x", 1, -1, n, e, -t, a, s, 1), g("x", "z", "y", 1, 1, t, n, e, r, a, 2), g("x", "z", "y", 1, -1, t, n, -e, r, a, 3), g("x", "y", "z", 1, -1, t, e, n, r, s, 4), g("x", "y", "z", -1, -1, t, e, -n, r, s, 5), this.setIndex(l), this.setAttribute("position", new Ne(c, 3)), this.setAttribute("normal", new Ne(h, 3)), this.setAttribute("uv", new Ne(u, 2));
    function g(v, m, p, A, T, S, N, w, R, U, y) {
      const M = S / R, C = N / U, H = S / 2, B = N / 2, G = w / 2, Z = R + 1, W = U + 1;
      let Q = 0, V = 0;
      const it = new I();
      for (let ht = 0; ht < W; ht++) {
        const vt = ht * C - B;
        for (let Ut = 0; Ut < Z; Ut++) {
          const Jt = Ut * M - H;
          it[v] = Jt * A, it[m] = vt * T, it[p] = G, c.push(it.x, it.y, it.z), it[v] = 0, it[m] = 0, it[p] = w > 0 ? 1 : -1, h.push(it.x, it.y, it.z), u.push(Ut / R), u.push(1 - ht / U), Q += 1;
        }
      }
      for (let ht = 0; ht < U; ht++)
        for (let vt = 0; vt < R; vt++) {
          const Ut = f + vt + Z * ht, Jt = f + vt + Z * (ht + 1), q = f + (vt + 1) + Z * (ht + 1), tt = f + (vt + 1) + Z * ht;
          l.push(Ut, Jt, tt), l.push(Jt, q, tt), V += 6;
        }
      o.addGroup(d, V, y), d += V, f += Q;
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  /**
   * Factory method for creating an instance of this class from the given
   * JSON object.
   *
   * @param {Object} data - A JSON object representing the serialized geometry.
   * @return {BoxGeometry} A new instance.
   */
  static fromJSON(t) {
    return new pe(t.width, t.height, t.depth, t.widthSegments, t.heightSegments, t.depthSegments);
  }
}
function Si(i) {
  const t = {};
  for (const e in i) {
    t[e] = {};
    for (const n in i[e]) {
      const r = i[e][n];
      r && (r.isColor || r.isMatrix3 || r.isMatrix4 || r.isVector2 || r.isVector3 || r.isVector4 || r.isTexture || r.isQuaternion) ? r.isRenderTargetTexture ? (console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."), t[e][n] = null) : t[e][n] = r.clone() : Array.isArray(r) ? t[e][n] = r.slice() : t[e][n] = r;
    }
  }
  return t;
}
function Te(i) {
  const t = {};
  for (let e = 0; e < i.length; e++) {
    const n = Si(i[e]);
    for (const r in n)
      t[r] = n[r];
  }
  return t;
}
function Ph(i) {
  const t = [];
  for (let e = 0; e < i.length; e++)
    t.push(i[e].clone());
  return t;
}
function Fl(i) {
  const t = i.getRenderTarget();
  return t === null ? i.outputColorSpace : t.isXRRenderTarget === !0 ? t.texture.colorSpace : Gt.workingColorSpace;
}
const Lh = { clone: Si, merge: Te };
var Dh = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`, Ih = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;
class Cn extends tr {
  /**
   * Constructs a new shader material.
   *
   * @param {Object} [parameters] - An object with one or more properties
   * defining the material's appearance. Any property of the material
   * (including any property from inherited materials) can be passed
   * in here. Color values can be passed any type of value accepted
   * by {@link Color#set}.
   */
  constructor(t) {
    super(), this.isShaderMaterial = !0, this.type = "ShaderMaterial", this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = Dh, this.fragmentShader = Ih, this.linewidth = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.fog = !1, this.lights = !1, this.clipping = !1, this.forceSinglePass = !0, this.extensions = {
      clipCullDistance: !1,
      // set to use vertex shader clipping
      multiDraw: !1
      // set to use vertex shader multi_draw / enable gl_DrawID
    }, this.defaultAttributeValues = {
      color: [1, 1, 1],
      uv: [0, 0],
      uv1: [0, 0]
    }, this.index0AttributeName = void 0, this.uniformsNeedUpdate = !1, this.glslVersion = null, t !== void 0 && this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.fragmentShader = t.fragmentShader, this.vertexShader = t.vertexShader, this.uniforms = Si(t.uniforms), this.uniformsGroups = Ph(t.uniformsGroups), this.defines = Object.assign({}, t.defines), this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.fog = t.fog, this.lights = t.lights, this.clipping = t.clipping, this.extensions = Object.assign({}, t.extensions), this.glslVersion = t.glslVersion, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    e.glslVersion = this.glslVersion, e.uniforms = {};
    for (const r in this.uniforms) {
      const a = this.uniforms[r].value;
      a && a.isTexture ? e.uniforms[r] = {
        type: "t",
        value: a.toJSON(t).uuid
      } : a && a.isColor ? e.uniforms[r] = {
        type: "c",
        value: a.getHex()
      } : a && a.isVector2 ? e.uniforms[r] = {
        type: "v2",
        value: a.toArray()
      } : a && a.isVector3 ? e.uniforms[r] = {
        type: "v3",
        value: a.toArray()
      } : a && a.isVector4 ? e.uniforms[r] = {
        type: "v4",
        value: a.toArray()
      } : a && a.isMatrix3 ? e.uniforms[r] = {
        type: "m3",
        value: a.toArray()
      } : a && a.isMatrix4 ? e.uniforms[r] = {
        type: "m4",
        value: a.toArray()
      } : e.uniforms[r] = {
        value: a
      };
    }
    Object.keys(this.defines).length > 0 && (e.defines = this.defines), e.vertexShader = this.vertexShader, e.fragmentShader = this.fragmentShader, e.lights = this.lights, e.clipping = this.clipping;
    const n = {};
    for (const r in this.extensions)
      this.extensions[r] === !0 && (n[r] = !0);
    return Object.keys(n).length > 0 && (e.extensions = n), e;
  }
}
class Ol extends _e {
  /**
   * Constructs a new camera.
   */
  constructor() {
    super(), this.isCamera = !0, this.type = "Camera", this.matrixWorldInverse = new Wt(), this.projectionMatrix = new Wt(), this.projectionMatrixInverse = new Wt(), this.coordinateSystem = mn;
  }
  copy(t, e) {
    return super.copy(t, e), this.matrixWorldInverse.copy(t.matrixWorldInverse), this.projectionMatrix.copy(t.projectionMatrix), this.projectionMatrixInverse.copy(t.projectionMatrixInverse), this.coordinateSystem = t.coordinateSystem, this;
  }
  /**
   * Returns a vector representing the ("look") direction of the 3D object in world space.
   *
   * This method is overwritten since cameras have a different forward vector compared to other
   * 3D objects. A camera looks down its local, negative z-axis by default.
   *
   * @param {Vector3} target - The target vector the result is stored to.
   * @return {Vector3} The 3D object's direction in world space.
   */
  getWorldDirection(t) {
    return super.getWorldDirection(t).negate();
  }
  updateMatrixWorld(t) {
    super.updateMatrixWorld(t), this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  updateWorldMatrix(t, e) {
    super.updateWorldMatrix(t, e), this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const An = /* @__PURE__ */ new I(), fo = /* @__PURE__ */ new mt(), po = /* @__PURE__ */ new mt();
class He extends Ol {
  /**
   * Constructs a new perspective camera.
   *
   * @param {number} [fov=50] - The vertical field of view.
   * @param {number} [aspect=1] - The aspect ratio.
   * @param {number} [near=0.1] - The camera's near plane.
   * @param {number} [far=2000] - The camera's far plane.
   */
  constructor(t = 50, e = 1, n = 0.1, r = 2e3) {
    super(), this.isPerspectiveCamera = !0, this.type = "PerspectiveCamera", this.fov = t, this.zoom = 1, this.near = n, this.far = r, this.focus = 10, this.aspect = e, this.view = null, this.filmGauge = 35, this.filmOffset = 0, this.updateProjectionMatrix();
  }
  copy(t, e) {
    return super.copy(t, e), this.fov = t.fov, this.zoom = t.zoom, this.near = t.near, this.far = t.far, this.focus = t.focus, this.aspect = t.aspect, this.view = t.view === null ? null : Object.assign({}, t.view), this.filmGauge = t.filmGauge, this.filmOffset = t.filmOffset, this;
  }
  /**
   * Sets the FOV by focal length in respect to the current {@link PerspectiveCamera#filmGauge}.
   *
   * The default film gauge is 35, so that the focal length can be specified for
   * a 35mm (full frame) camera.
   *
   * @param {number} focalLength - Values for focal length and film gauge must have the same unit.
   */
  setFocalLength(t) {
    const e = 0.5 * this.getFilmHeight() / t;
    this.fov = ga * 2 * Math.atan(e), this.updateProjectionMatrix();
  }
  /**
   * Returns the focal length from the current {@link PerspectiveCamera#fov} and
   * {@link PerspectiveCamera#filmGauge}.
   *
   * @return {number} The computed focal length.
   */
  getFocalLength() {
    const t = Math.tan(Jr * 0.5 * this.fov);
    return 0.5 * this.getFilmHeight() / t;
  }
  /**
   * Returns the current vertical field of view angle in degrees considering {@link PerspectiveCamera#zoom}.
   *
   * @return {number} The effective FOV.
   */
  getEffectiveFOV() {
    return ga * 2 * Math.atan(
      Math.tan(Jr * 0.5 * this.fov) / this.zoom
    );
  }
  /**
   * Returns the width of the image on the film. If {@link PerspectiveCamera#aspect} is greater than or
   * equal to one (landscape format), the result equals {@link PerspectiveCamera#filmGauge}.
   *
   * @return {number} The film width.
   */
  getFilmWidth() {
    return this.filmGauge * Math.min(this.aspect, 1);
  }
  /**
   * Returns the height of the image on the film. If {@link PerspectiveCamera#aspect} is greater than or
   * equal to one (landscape format), the result equals {@link PerspectiveCamera#filmGauge}.
   *
   * @return {number} The film width.
   */
  getFilmHeight() {
    return this.filmGauge / Math.max(this.aspect, 1);
  }
  /**
   * Computes the 2D bounds of the camera's viewable rectangle at a given distance along the viewing direction.
   * Sets `minTarget` and `maxTarget` to the coordinates of the lower-left and upper-right corners of the view rectangle.
   *
   * @param {number} distance - The viewing distance.
   * @param {Vector2} minTarget - The lower-left corner of the view rectangle is written into this vector.
   * @param {Vector2} maxTarget - The upper-right corner of the view rectangle is written into this vector.
   */
  getViewBounds(t, e, n) {
    An.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse), e.set(An.x, An.y).multiplyScalar(-t / An.z), An.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse), n.set(An.x, An.y).multiplyScalar(-t / An.z);
  }
  /**
   * Computes the width and height of the camera's viewable rectangle at a given distance along the viewing direction.
   *
   * @param {number} distance - The viewing distance.
   * @param {Vector2} target - The target vector that is used to store result where x is width and y is height.
   * @returns {Vector2} The view size.
   */
  getViewSize(t, e) {
    return this.getViewBounds(t, fo, po), e.subVectors(po, fo);
  }
  /**
   * Sets an offset in a larger frustum. This is useful for multi-window or
   * multi-monitor/multi-machine setups.
   *
   * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
   * the monitors are in grid like this
   *```
   *   +---+---+---+
   *   | A | B | C |
   *   +---+---+---+
   *   | D | E | F |
   *   +---+---+---+
   *```
   * then for each monitor you would call it like this:
   *```js
   * const w = 1920;
   * const h = 1080;
   * const fullWidth = w * 3;
   * const fullHeight = h * 2;
   *
   * // --A--
   * camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
   * // --B--
   * camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
   * // --C--
   * camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
   * // --D--
   * camera.setViewOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
   * // --E--
   * camera.setViewOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
   * // --F--
   * camera.setViewOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
   * ```
   *
   * Note there is no reason monitors have to be the same size or in a grid.
   *
   * @param {number} fullWidth - The full width of multiview setup.
   * @param {number} fullHeight - The full height of multiview setup.
   * @param {number} x - The horizontal offset of the subcamera.
   * @param {number} y - The vertical offset of the subcamera.
   * @param {number} width - The width of subcamera.
   * @param {number} height - The height of subcamera.
   */
  setViewOffset(t, e, n, r, s, a) {
    this.aspect = t / e, this.view === null && (this.view = {
      enabled: !0,
      fullWidth: 1,
      fullHeight: 1,
      offsetX: 0,
      offsetY: 0,
      width: 1,
      height: 1
    }), this.view.enabled = !0, this.view.fullWidth = t, this.view.fullHeight = e, this.view.offsetX = n, this.view.offsetY = r, this.view.width = s, this.view.height = a, this.updateProjectionMatrix();
  }
  /**
   * Removes the view offset from the projection matrix.
   */
  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
  }
  /**
   * Updates the camera's projection matrix. Must be called after any change of
   * camera properties.
   */
  updateProjectionMatrix() {
    const t = this.near;
    let e = t * Math.tan(Jr * 0.5 * this.fov) / this.zoom, n = 2 * e, r = this.aspect * n, s = -0.5 * r;
    const a = this.view;
    if (this.view !== null && this.view.enabled) {
      const l = a.fullWidth, c = a.fullHeight;
      s += a.offsetX * r / l, e -= a.offsetY * n / c, r *= a.width / l, n *= a.height / c;
    }
    const o = this.filmOffset;
    o !== 0 && (s += t * o / this.getFilmWidth()), this.projectionMatrix.makePerspective(s, s + r, e, e - n, t, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return e.object.fov = this.fov, e.object.zoom = this.zoom, e.object.near = this.near, e.object.far = this.far, e.object.focus = this.focus, e.object.aspect = this.aspect, this.view !== null && (e.object.view = Object.assign({}, this.view)), e.object.filmGauge = this.filmGauge, e.object.filmOffset = this.filmOffset, e;
  }
}
const li = -90, ci = 1;
class Uh extends _e {
  /**
   * Constructs a new cube camera.
   *
   * @param {number} near - The camera's near plane.
   * @param {number} far - The camera's far plane.
   * @param {WebGLCubeRenderTarget} renderTarget - The cube render target.
   */
  constructor(t, e, n) {
    super(), this.type = "CubeCamera", this.renderTarget = n, this.coordinateSystem = null, this.activeMipmapLevel = 0;
    const r = new He(li, ci, t, e);
    r.layers = this.layers, this.add(r);
    const s = new He(li, ci, t, e);
    s.layers = this.layers, this.add(s);
    const a = new He(li, ci, t, e);
    a.layers = this.layers, this.add(a);
    const o = new He(li, ci, t, e);
    o.layers = this.layers, this.add(o);
    const l = new He(li, ci, t, e);
    l.layers = this.layers, this.add(l);
    const c = new He(li, ci, t, e);
    c.layers = this.layers, this.add(c);
  }
  /**
   * Must be called when the coordinate system of the cube camera is changed.
   */
  updateCoordinateSystem() {
    const t = this.coordinateSystem, e = this.children.concat(), [n, r, s, a, o, l] = e;
    for (const c of e) this.remove(c);
    if (t === mn)
      n.up.set(0, 1, 0), n.lookAt(1, 0, 0), r.up.set(0, 1, 0), r.lookAt(-1, 0, 0), s.up.set(0, 0, -1), s.lookAt(0, 1, 0), a.up.set(0, 0, 1), a.lookAt(0, -1, 0), o.up.set(0, 1, 0), o.lookAt(0, 0, 1), l.up.set(0, 1, 0), l.lookAt(0, 0, -1);
    else if (t === kr)
      n.up.set(0, -1, 0), n.lookAt(-1, 0, 0), r.up.set(0, -1, 0), r.lookAt(1, 0, 0), s.up.set(0, 0, 1), s.lookAt(0, 1, 0), a.up.set(0, 0, -1), a.lookAt(0, -1, 0), o.up.set(0, -1, 0), o.lookAt(0, 0, 1), l.up.set(0, -1, 0), l.lookAt(0, 0, -1);
    else
      throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " + t);
    for (const c of e)
      this.add(c), c.updateMatrixWorld();
  }
  /**
   * Calling this method will render the given scene with the given renderer
   * into the cube render target of the camera.
   *
   * @param {(Renderer|WebGLRenderer)} renderer - The renderer.
   * @param {Scene} scene - The scene to render.
   */
  update(t, e) {
    this.parent === null && this.updateMatrixWorld();
    const { renderTarget: n, activeMipmapLevel: r } = this;
    this.coordinateSystem !== t.coordinateSystem && (this.coordinateSystem = t.coordinateSystem, this.updateCoordinateSystem());
    const [s, a, o, l, c, h] = this.children, u = t.getRenderTarget(), f = t.getActiveCubeFace(), d = t.getActiveMipmapLevel(), g = t.xr.enabled;
    t.xr.enabled = !1;
    const v = n.texture.generateMipmaps;
    n.texture.generateMipmaps = !1, t.setRenderTarget(n, 0, r), t.render(e, s), t.setRenderTarget(n, 1, r), t.render(e, a), t.setRenderTarget(n, 2, r), t.render(e, o), t.setRenderTarget(n, 3, r), t.render(e, l), t.setRenderTarget(n, 4, r), t.render(e, c), n.texture.generateMipmaps = v, t.setRenderTarget(n, 5, r), t.render(e, h), t.setRenderTarget(u, f, d), t.xr.enabled = g, n.texture.needsPMREMUpdate = !0;
  }
}
class Bl extends ge {
  /**
   * Constructs a new cube texture.
   *
   * @param {Array<Image>} [images=[]] - An array holding a image for each side of a cube.
   * @param {number} [mapping=CubeReflectionMapping] - The texture mapping.
   * @param {number} [wrapS=ClampToEdgeWrapping] - The wrapS value.
   * @param {number} [wrapT=ClampToEdgeWrapping] - The wrapT value.
   * @param {number} [magFilter=LinearFilter] - The mag filter value.
   * @param {number} [minFilter=LinearMipmapLinearFilter] - The min filter value.
   * @param {number} [format=RGBAFormat] - The texture format.
   * @param {number} [type=UnsignedByteType] - The texture type.
   * @param {number} [anisotropy=Texture.DEFAULT_ANISOTROPY] - The anisotropy value.
   * @param {string} [colorSpace=NoColorSpace] - The color space value.
   */
  constructor(t = [], e = vi, n, r, s, a, o, l, c, h) {
    super(t, e, n, r, s, a, o, l, c, h), this.isCubeTexture = !0, this.flipY = !1;
  }
  /**
   * Alias for {@link CubeTexture#image}.
   *
   * @type {Array<Image>}
   */
  get images() {
    return this.image;
  }
  set images(t) {
    this.image = t;
  }
}
class Nh extends Yn {
  /**
   * Constructs a new cube render target.
   *
   * @param {number} [size=1] - The size of the render target.
   * @param {RenderTarget~Options} [options] - The configuration object.
   */
  constructor(t = 1, e = {}) {
    super(t, t, e), this.isWebGLCubeRenderTarget = !0;
    const n = { width: t, height: t, depth: 1 }, r = [n, n, n, n, n, n];
    this.texture = new Bl(r, e.mapping, e.wrapS, e.wrapT, e.magFilter, e.minFilter, e.format, e.type, e.anisotropy, e.colorSpace), this.texture.isRenderTargetTexture = !0, this.texture.generateMipmaps = e.generateMipmaps !== void 0 ? e.generateMipmaps : !1, this.texture.minFilter = e.minFilter !== void 0 ? e.minFilter : ye;
  }
  /**
   * Converts the given equirectangular texture to a cube map.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {Texture} texture - The equirectangular texture.
   * @return {WebGLCubeRenderTarget} A reference to this cube render target.
   */
  fromEquirectangularTexture(t, e) {
    this.texture.type = e.type, this.texture.colorSpace = e.colorSpace, this.texture.generateMipmaps = e.generateMipmaps, this.texture.minFilter = e.minFilter, this.texture.magFilter = e.magFilter;
    const n = {
      uniforms: {
        tEquirect: { value: null }
      },
      vertexShader: (
        /* glsl */
        `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`
      ),
      fragmentShader: (
        /* glsl */
        `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`
      )
    }, r = new pe(5, 5, 5), s = new Cn({
      name: "CubemapFromEquirect",
      uniforms: Si(n.uniforms),
      vertexShader: n.vertexShader,
      fragmentShader: n.fragmentShader,
      side: Ce,
      blending: bn
    });
    s.uniforms.tEquirect.value = e;
    const a = new Kt(r, s), o = e.minFilter;
    return e.minFilter === Gn && (e.minFilter = ye), new Uh(1, 10, this).update(t, a), e.minFilter = o, a.geometry.dispose(), a.material.dispose(), this;
  }
  /**
   * Clears this cube render target.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {boolean} [color=true] - Whether the color buffer should be cleared or not.
   * @param {boolean} [depth=true] - Whether the depth buffer should be cleared or not.
   * @param {boolean} [stencil=true] - Whether the stencil buffer should be cleared or not.
   */
  clear(t, e = !0, n = !0, r = !0) {
    const s = t.getRenderTarget();
    for (let a = 0; a < 6; a++)
      t.setRenderTarget(this, a), t.clear(e, n, r);
    t.setRenderTarget(s);
  }
}
class fe extends _e {
  constructor() {
    super(), this.isGroup = !0, this.type = "Group";
  }
}
const Fh = { type: "move" };
class _s {
  /**
   * Constructs a new XR controller.
   */
  constructor() {
    this._targetRay = null, this._grip = null, this._hand = null;
  }
  /**
   * Returns a group representing the hand space of the XR controller.
   *
   * @return {Group} A group representing the hand space of the XR controller.
   */
  getHandSpace() {
    return this._hand === null && (this._hand = new fe(), this._hand.matrixAutoUpdate = !1, this._hand.visible = !1, this._hand.joints = {}, this._hand.inputState = { pinching: !1 }), this._hand;
  }
  /**
   * Returns a group representing the target ray space of the XR controller.
   *
   * @return {Group} A group representing the target ray space of the XR controller.
   */
  getTargetRaySpace() {
    return this._targetRay === null && (this._targetRay = new fe(), this._targetRay.matrixAutoUpdate = !1, this._targetRay.visible = !1, this._targetRay.hasLinearVelocity = !1, this._targetRay.linearVelocity = new I(), this._targetRay.hasAngularVelocity = !1, this._targetRay.angularVelocity = new I()), this._targetRay;
  }
  /**
   * Returns a group representing the grip space of the XR controller.
   *
   * @return {Group} A group representing the grip space of the XR controller.
   */
  getGripSpace() {
    return this._grip === null && (this._grip = new fe(), this._grip.matrixAutoUpdate = !1, this._grip.visible = !1, this._grip.hasLinearVelocity = !1, this._grip.linearVelocity = new I(), this._grip.hasAngularVelocity = !1, this._grip.angularVelocity = new I()), this._grip;
  }
  /**
   * Dispatches the given event to the groups representing
   * the different coordinate spaces of the XR controller.
   *
   * @param {Object} event - The event to dispatch.
   * @return {WebXRController} A reference to this instance.
   */
  dispatchEvent(t) {
    return this._targetRay !== null && this._targetRay.dispatchEvent(t), this._grip !== null && this._grip.dispatchEvent(t), this._hand !== null && this._hand.dispatchEvent(t), this;
  }
  /**
   * Connects the controller with the given XR input source.
   *
   * @param {XRInputSource} inputSource - The input source.
   * @return {WebXRController} A reference to this instance.
   */
  connect(t) {
    if (t && t.hand) {
      const e = this._hand;
      if (e)
        for (const n of t.hand.values())
          this._getHandJoint(e, n);
    }
    return this.dispatchEvent({ type: "connected", data: t }), this;
  }
  /**
   * Disconnects the controller from the given XR input source.
   *
   * @param {XRInputSource} inputSource - The input source.
   * @return {WebXRController} A reference to this instance.
   */
  disconnect(t) {
    return this.dispatchEvent({ type: "disconnected", data: t }), this._targetRay !== null && (this._targetRay.visible = !1), this._grip !== null && (this._grip.visible = !1), this._hand !== null && (this._hand.visible = !1), this;
  }
  /**
   * Updates the controller with the given input source, XR frame and reference space.
   * This updates the transformations of the groups that represent the different
   * coordinate systems of the controller.
   *
   * @param {XRInputSource} inputSource - The input source.
   * @param {XRFrame} frame - The XR frame.
   * @param {XRReferenceSpace} referenceSpace - The reference space.
   * @return {WebXRController} A reference to this instance.
   */
  update(t, e, n) {
    let r = null, s = null, a = null;
    const o = this._targetRay, l = this._grip, c = this._hand;
    if (t && e.session.visibilityState !== "visible-blurred") {
      if (c && t.hand) {
        a = !0;
        for (const v of t.hand.values()) {
          const m = e.getJointPose(v, n), p = this._getHandJoint(c, v);
          m !== null && (p.matrix.fromArray(m.transform.matrix), p.matrix.decompose(p.position, p.rotation, p.scale), p.matrixWorldNeedsUpdate = !0, p.jointRadius = m.radius), p.visible = m !== null;
        }
        const h = c.joints["index-finger-tip"], u = c.joints["thumb-tip"], f = h.position.distanceTo(u.position), d = 0.02, g = 5e-3;
        c.inputState.pinching && f > d + g ? (c.inputState.pinching = !1, this.dispatchEvent({
          type: "pinchend",
          handedness: t.handedness,
          target: this
        })) : !c.inputState.pinching && f <= d - g && (c.inputState.pinching = !0, this.dispatchEvent({
          type: "pinchstart",
          handedness: t.handedness,
          target: this
        }));
      } else
        l !== null && t.gripSpace && (s = e.getPose(t.gripSpace, n), s !== null && (l.matrix.fromArray(s.transform.matrix), l.matrix.decompose(l.position, l.rotation, l.scale), l.matrixWorldNeedsUpdate = !0, s.linearVelocity ? (l.hasLinearVelocity = !0, l.linearVelocity.copy(s.linearVelocity)) : l.hasLinearVelocity = !1, s.angularVelocity ? (l.hasAngularVelocity = !0, l.angularVelocity.copy(s.angularVelocity)) : l.hasAngularVelocity = !1));
      o !== null && (r = e.getPose(t.targetRaySpace, n), r === null && s !== null && (r = s), r !== null && (o.matrix.fromArray(r.transform.matrix), o.matrix.decompose(o.position, o.rotation, o.scale), o.matrixWorldNeedsUpdate = !0, r.linearVelocity ? (o.hasLinearVelocity = !0, o.linearVelocity.copy(r.linearVelocity)) : o.hasLinearVelocity = !1, r.angularVelocity ? (o.hasAngularVelocity = !0, o.angularVelocity.copy(r.angularVelocity)) : o.hasAngularVelocity = !1, this.dispatchEvent(Fh)));
    }
    return o !== null && (o.visible = r !== null), l !== null && (l.visible = s !== null), c !== null && (c.visible = a !== null), this;
  }
  /**
   * Returns a group representing the hand joint for the given input joint.
   *
   * @private
   * @param {Group} hand - The group representing the hand space.
   * @param {XRJointSpace} inputjoint - The hand joint data.
   * @return {Group} A group representing the hand joint for the given input joint.
   */
  _getHandJoint(t, e) {
    if (t.joints[e.jointName] === void 0) {
      const n = new fe();
      n.matrixAutoUpdate = !1, n.visible = !1, t.joints[e.jointName] = n, t.add(n);
    }
    return t.joints[e.jointName];
  }
}
class Ca {
  /**
   * Constructs a new fog.
   *
   * @param {number|Color} color - The fog's color.
   * @param {number} [near=1] - The minimum distance to start applying fog.
   * @param {number} [far=1000] - The maximum distance at which fog stops being calculated and applied.
   */
  constructor(t, e = 1, n = 1e3) {
    this.isFog = !0, this.name = "", this.color = new Ft(t), this.near = e, this.far = n;
  }
  /**
   * Returns a new fog with copied values from this instance.
   *
   * @return {Fog} A clone of this instance.
   */
  clone() {
    return new Ca(this.color, this.near, this.far);
  }
  /**
   * Serializes the fog into JSON.
   *
   * @param {?(Object|string)} meta - An optional value holding meta information about the serialization.
   * @return {Object} A JSON object representing the serialized fog
   */
  toJSON() {
    return {
      type: "Fog",
      name: this.name,
      color: this.color.getHex(),
      near: this.near,
      far: this.far
    };
  }
}
class Oh extends _e {
  /**
   * Constructs a new scene.
   */
  constructor() {
    super(), this.isScene = !0, this.type = "Scene", this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.backgroundRotation = new rn(), this.environmentIntensity = 1, this.environmentRotation = new rn(), this.overrideMaterial = null, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  copy(t, e) {
    return super.copy(t, e), t.background !== null && (this.background = t.background.clone()), t.environment !== null && (this.environment = t.environment.clone()), t.fog !== null && (this.fog = t.fog.clone()), this.backgroundBlurriness = t.backgroundBlurriness, this.backgroundIntensity = t.backgroundIntensity, this.backgroundRotation.copy(t.backgroundRotation), this.environmentIntensity = t.environmentIntensity, this.environmentRotation.copy(t.environmentRotation), t.overrideMaterial !== null && (this.overrideMaterial = t.overrideMaterial.clone()), this.matrixAutoUpdate = t.matrixAutoUpdate, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return this.fog !== null && (e.object.fog = this.fog.toJSON()), this.backgroundBlurriness > 0 && (e.object.backgroundBlurriness = this.backgroundBlurriness), this.backgroundIntensity !== 1 && (e.object.backgroundIntensity = this.backgroundIntensity), e.object.backgroundRotation = this.backgroundRotation.toArray(), this.environmentIntensity !== 1 && (e.object.environmentIntensity = this.environmentIntensity), e.object.environmentRotation = this.environmentRotation.toArray(), e;
  }
}
class Bh extends ge {
  /**
   * Constructs a new data texture.
   *
   * @param {?TypedArray} [data=null] - The buffer data.
   * @param {number} [width=1] - The width of the texture.
   * @param {number} [height=1] - The height of the texture.
   * @param {number} [format=RGBAFormat] - The texture format.
   * @param {number} [type=UnsignedByteType] - The texture type.
   * @param {number} [mapping=Texture.DEFAULT_MAPPING] - The texture mapping.
   * @param {number} [wrapS=ClampToEdgeWrapping] - The wrapS value.
   * @param {number} [wrapT=ClampToEdgeWrapping] - The wrapT value.
   * @param {number} [magFilter=NearestFilter] - The mag filter value.
   * @param {number} [minFilter=NearestFilter] - The min filter value.
   * @param {number} [anisotropy=Texture.DEFAULT_ANISOTROPY] - The anisotropy value.
   * @param {string} [colorSpace=NoColorSpace] - The color space.
   */
  constructor(t = null, e = 1, n = 1, r, s, a, o, l, c = Ue, h = Ue, u, f) {
    super(null, a, o, l, c, h, r, s, u, f), this.isDataTexture = !0, this.image = { data: t, width: e, height: n }, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
  }
}
class mo extends Ze {
  /**
   * Constructs a new instanced buffer attribute.
   *
   * @param {TypedArray} array - The array holding the attribute data.
   * @param {number} itemSize - The item size.
   * @param {boolean} [normalized=false] - Whether the data are normalized or not.
   * @param {number} [meshPerAttribute=1] - How often a value of this buffer attribute should be repeated.
   */
  constructor(t, e, n, r = 1) {
    super(t, e, n), this.isInstancedBufferAttribute = !0, this.meshPerAttribute = r;
  }
  copy(t) {
    return super.copy(t), this.meshPerAttribute = t.meshPerAttribute, this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.meshPerAttribute = this.meshPerAttribute, t.isInstancedBufferAttribute = !0, t;
  }
}
const hi = /* @__PURE__ */ new Wt(), go = /* @__PURE__ */ new Wt(), yr = [], _o = /* @__PURE__ */ new Zn(), zh = /* @__PURE__ */ new Wt(), Ii = /* @__PURE__ */ new Kt(), Ui = /* @__PURE__ */ new Qi();
class Ie extends Kt {
  /**
   * Constructs a new instanced mesh.
   *
   * @param {BufferGeometry} [geometry] - The mesh geometry.
   * @param {Material|Array<Material>} [material] - The mesh material.
   * @param {number} count - The number of instances.
   */
  constructor(t, e, n) {
    super(t, e), this.isInstancedMesh = !0, this.instanceMatrix = new mo(new Float32Array(n * 16), 16), this.instanceColor = null, this.morphTexture = null, this.count = n, this.boundingBox = null, this.boundingSphere = null;
    for (let r = 0; r < n; r++)
      this.setMatrixAt(r, zh);
  }
  /**
   * Computes the bounding box of the instanced mesh, and updates {@link InstancedMesh#boundingBox}.
   * The bounding box is not automatically computed by the engine; this method must be called by your app.
   * You may need to recompute the bounding box if an instance is transformed via {@link InstancedMesh#setMatrixAt}.
   */
  computeBoundingBox() {
    const t = this.geometry, e = this.count;
    this.boundingBox === null && (this.boundingBox = new Zn()), t.boundingBox === null && t.computeBoundingBox(), this.boundingBox.makeEmpty();
    for (let n = 0; n < e; n++)
      this.getMatrixAt(n, hi), _o.copy(t.boundingBox).applyMatrix4(hi), this.boundingBox.union(_o);
  }
  /**
   * Computes the bounding sphere of the instanced mesh, and updates {@link InstancedMesh#boundingSphere}
   * The engine automatically computes the bounding sphere when it is needed, e.g., for ray casting or view frustum culling.
   * You may need to recompute the bounding sphere if an instance is transformed via {@link InstancedMesh#setMatrixAt}.
   */
  computeBoundingSphere() {
    const t = this.geometry, e = this.count;
    this.boundingSphere === null && (this.boundingSphere = new Qi()), t.boundingSphere === null && t.computeBoundingSphere(), this.boundingSphere.makeEmpty();
    for (let n = 0; n < e; n++)
      this.getMatrixAt(n, hi), Ui.copy(t.boundingSphere).applyMatrix4(hi), this.boundingSphere.union(Ui);
  }
  copy(t, e) {
    return super.copy(t, e), this.instanceMatrix.copy(t.instanceMatrix), t.morphTexture !== null && (this.morphTexture = t.morphTexture.clone()), t.instanceColor !== null && (this.instanceColor = t.instanceColor.clone()), this.count = t.count, t.boundingBox !== null && (this.boundingBox = t.boundingBox.clone()), t.boundingSphere !== null && (this.boundingSphere = t.boundingSphere.clone()), this;
  }
  /**
   * Gets the color of the defined instance.
   *
   * @param {number} index - The instance index.
   * @param {Color} color - The target object that is used to store the method's result.
   */
  getColorAt(t, e) {
    e.fromArray(this.instanceColor.array, t * 3);
  }
  /**
   * Gets the local transformation matrix of the defined instance.
   *
   * @param {number} index - The instance index.
   * @param {Matrix4} matrix - The target object that is used to store the method's result.
   */
  getMatrixAt(t, e) {
    e.fromArray(this.instanceMatrix.array, t * 16);
  }
  /**
   * Gets the morph target weights of the defined instance.
   *
   * @param {number} index - The instance index.
   * @param {Mesh} object - The target object that is used to store the method's result.
   */
  getMorphAt(t, e) {
    const n = e.morphTargetInfluences, r = this.morphTexture.source.data.data, s = n.length + 1, a = t * s + 1;
    for (let o = 0; o < n.length; o++)
      n[o] = r[a + o];
  }
  raycast(t, e) {
    const n = this.matrixWorld, r = this.count;
    if (Ii.geometry = this.geometry, Ii.material = this.material, Ii.material !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), Ui.copy(this.boundingSphere), Ui.applyMatrix4(n), t.ray.intersectsSphere(Ui) !== !1))
      for (let s = 0; s < r; s++) {
        this.getMatrixAt(s, hi), go.multiplyMatrices(n, hi), Ii.matrixWorld = go, Ii.raycast(t, yr);
        for (let a = 0, o = yr.length; a < o; a++) {
          const l = yr[a];
          l.instanceId = s, l.object = this, e.push(l);
        }
        yr.length = 0;
      }
  }
  /**
   * Sets the given color to the defined instance. Make sure you set the `needsUpdate` flag of
   * {@link InstancedMesh#instanceColor} to `true` after updating all the colors.
   *
   * @param {number} index - The instance index.
   * @param {Color} color - The instance color.
   */
  setColorAt(t, e) {
    this.instanceColor === null && (this.instanceColor = new mo(new Float32Array(this.instanceMatrix.count * 3).fill(1), 3)), e.toArray(this.instanceColor.array, t * 3);
  }
  /**
   * Sets the given local transformation matrix to the defined instance. Make sure you set the `needsUpdate` flag of
   * {@link InstancedMesh#instanceMatrix} to `true` after updating all the colors.
   *
   * @param {number} index - The instance index.
   * @param {Matrix4} matrix - The local transformation.
   */
  setMatrixAt(t, e) {
    e.toArray(this.instanceMatrix.array, t * 16);
  }
  /**
   * Sets the morph target weights to the defined instance. Make sure you set the `needsUpdate` flag of
   * {@link InstancedMesh#morphTexture} to `true` after updating all the influences.
   *
   * @param {number} index - The instance index.
   * @param {Mesh} object -  A mesh which `morphTargetInfluences` property containing the morph target weights
   * of a single instance.
   */
  setMorphAt(t, e) {
    const n = e.morphTargetInfluences, r = n.length + 1;
    this.morphTexture === null && (this.morphTexture = new Bh(new Float32Array(r * this.count), r, this.count, Ta, tn));
    const s = this.morphTexture.source.data.data;
    let a = 0;
    for (let c = 0; c < n.length; c++)
      a += n[c];
    const o = this.geometry.morphTargetsRelative ? 1 : 1 - a, l = r * t;
    s[l] = o, s.set(n, l + 1);
  }
  updateMorphTargets() {
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever this instance is no longer used in your app.
   */
  dispose() {
    this.dispatchEvent({ type: "dispose" }), this.morphTexture !== null && (this.morphTexture.dispose(), this.morphTexture = null);
  }
}
const vs = /* @__PURE__ */ new I(), Hh = /* @__PURE__ */ new I(), kh = /* @__PURE__ */ new Lt();
class Bn {
  /**
   * Constructs a new plane.
   *
   * @param {Vector3} [normal=(1,0,0)] - A unit length vector defining the normal of the plane.
   * @param {number} [constant=0] - The signed distance from the origin to the plane.
   */
  constructor(t = new I(1, 0, 0), e = 0) {
    this.isPlane = !0, this.normal = t, this.constant = e;
  }
  /**
   * Sets the plane components by copying the given values.
   *
   * @param {Vector3} normal - The normal.
   * @param {number} constant - The constant.
   * @return {Plane} A reference to this plane.
   */
  set(t, e) {
    return this.normal.copy(t), this.constant = e, this;
  }
  /**
   * Sets the plane components by defining `x`, `y`, `z` as the
   * plane normal and `w` as the constant.
   *
   * @param {number} x - The value for the normal's x component.
   * @param {number} y - The value for the normal's y component.
   * @param {number} z - The value for the normal's z component.
   * @param {number} w - The constant value.
   * @return {Plane} A reference to this plane.
   */
  setComponents(t, e, n, r) {
    return this.normal.set(t, e, n), this.constant = r, this;
  }
  /**
   * Sets the plane from the given normal and coplanar point (that is a point
   * that lies onto the plane).
   *
   * @param {Vector3} normal - The normal.
   * @param {Vector3} point - A coplanar point.
   * @return {Plane} A reference to this plane.
   */
  setFromNormalAndCoplanarPoint(t, e) {
    return this.normal.copy(t), this.constant = -e.dot(this.normal), this;
  }
  /**
   * Sets the plane from three coplanar points. The winding order is
   * assumed to be counter-clockwise, and determines the direction of
   * the plane normal.
   *
   * @param {Vector3} a - The first coplanar point.
   * @param {Vector3} b - The second coplanar point.
   * @param {Vector3} c - The third coplanar point.
   * @return {Plane} A reference to this plane.
   */
  setFromCoplanarPoints(t, e, n) {
    const r = vs.subVectors(n, e).cross(Hh.subVectors(t, e)).normalize();
    return this.setFromNormalAndCoplanarPoint(r, t), this;
  }
  /**
   * Copies the values of the given plane to this instance.
   *
   * @param {Plane} plane - The plane to copy.
   * @return {Plane} A reference to this plane.
   */
  copy(t) {
    return this.normal.copy(t.normal), this.constant = t.constant, this;
  }
  /**
   * Normalizes the plane normal and adjusts the constant accordingly.
   *
   * @return {Plane} A reference to this plane.
   */
  normalize() {
    const t = 1 / this.normal.length();
    return this.normal.multiplyScalar(t), this.constant *= t, this;
  }
  /**
   * Negates both the plane normal and the constant.
   *
   * @return {Plane} A reference to this plane.
   */
  negate() {
    return this.constant *= -1, this.normal.negate(), this;
  }
  /**
   * Returns the signed distance from the given point to this plane.
   *
   * @param {Vector3} point - The point to compute the distance for.
   * @return {number} The signed distance.
   */
  distanceToPoint(t) {
    return this.normal.dot(t) + this.constant;
  }
  /**
   * Returns the signed distance from the given sphere to this plane.
   *
   * @param {Sphere} sphere - The sphere to compute the distance for.
   * @return {number} The signed distance.
   */
  distanceToSphere(t) {
    return this.distanceToPoint(t.center) - t.radius;
  }
  /**
   * Projects a the given point onto the plane.
   *
   * @param {Vector3} point - The point to project.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The projected point on the plane.
   */
  projectPoint(t, e) {
    return e.copy(t).addScaledVector(this.normal, -this.distanceToPoint(t));
  }
  /**
   * Returns the intersection point of the passed line and the plane. Returns
   * `null` if the line does not intersect. Returns the line's starting point if
   * the line is coplanar with the plane.
   *
   * @param {Line3} line - The line to compute the intersection for.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {?Vector3} The intersection point.
   */
  intersectLine(t, e) {
    const n = t.delta(vs), r = this.normal.dot(n);
    if (r === 0)
      return this.distanceToPoint(t.start) === 0 ? e.copy(t.start) : null;
    const s = -(t.start.dot(this.normal) + this.constant) / r;
    return s < 0 || s > 1 ? null : e.copy(t.start).addScaledVector(n, s);
  }
  /**
   * Returns `true` if the given line segment intersects with (passes through) the plane.
   *
   * @param {Line3} line - The line to test.
   * @return {boolean} Whether the given line segment intersects with the plane or not.
   */
  intersectsLine(t) {
    const e = this.distanceToPoint(t.start), n = this.distanceToPoint(t.end);
    return e < 0 && n > 0 || n < 0 && e > 0;
  }
  /**
   * Returns `true` if the given bounding box intersects with the plane.
   *
   * @param {Box3} box - The bounding box to test.
   * @return {boolean} Whether the given bounding box intersects with the plane or not.
   */
  intersectsBox(t) {
    return t.intersectsPlane(this);
  }
  /**
   * Returns `true` if the given bounding sphere intersects with the plane.
   *
   * @param {Sphere} sphere - The bounding sphere to test.
   * @return {boolean} Whether the given bounding sphere intersects with the plane or not.
   */
  intersectsSphere(t) {
    return t.intersectsPlane(this);
  }
  /**
   * Returns a coplanar vector to the plane, by calculating the
   * projection of the normal at the origin onto the plane.
   *
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The coplanar point.
   */
  coplanarPoint(t) {
    return t.copy(this.normal).multiplyScalar(-this.constant);
  }
  /**
   * Apply a 4x4 matrix to the plane. The matrix must be an affine, homogeneous transform.
   *
   * The optional normal matrix can be pre-computed like so:
   * ```js
   * const optionalNormalMatrix = new THREE.Matrix3().getNormalMatrix( matrix );
   * ```
   *
   * @param {Matrix4} matrix - The transformation matrix.
   * @param {Matrix4} [optionalNormalMatrix] - A pre-computed normal matrix.
   * @return {Plane} A reference to this plane.
   */
  applyMatrix4(t, e) {
    const n = e || kh.getNormalMatrix(t), r = this.coplanarPoint(vs).applyMatrix4(t), s = this.normal.applyMatrix3(n).normalize();
    return this.constant = -r.dot(s), this;
  }
  /**
   * Translates the plane by the distance defined by the given offset vector.
   * Note that this only affects the plane constant and will not affect the normal vector.
   *
   * @param {Vector3} offset - The offset vector.
   * @return {Plane} A reference to this plane.
   */
  translate(t) {
    return this.constant -= t.dot(this.normal), this;
  }
  /**
   * Returns `true` if this plane is equal with the given one.
   *
   * @param {Plane} plane - The plane to test for equality.
   * @return {boolean} Whether this plane is equal with the given one.
   */
  equals(t) {
    return t.normal.equals(this.normal) && t.constant === this.constant;
  }
  /**
   * Returns a new plane with copied values from this instance.
   *
   * @return {Plane} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
}
const Nn = /* @__PURE__ */ new Qi(), Er = /* @__PURE__ */ new I();
class Pa {
  /**
   * Constructs a new frustum.
   *
   * @param {Plane} [p0] - The first plane that encloses the frustum.
   * @param {Plane} [p1] - The second plane that encloses the frustum.
   * @param {Plane} [p2] - The third plane that encloses the frustum.
   * @param {Plane} [p3] - The fourth plane that encloses the frustum.
   * @param {Plane} [p4] - The fifth plane that encloses the frustum.
   * @param {Plane} [p5] - The sixth plane that encloses the frustum.
   */
  constructor(t = new Bn(), e = new Bn(), n = new Bn(), r = new Bn(), s = new Bn(), a = new Bn()) {
    this.planes = [t, e, n, r, s, a];
  }
  /**
   * Sets the frustum planes by copying the given planes.
   *
   * @param {Plane} [p0] - The first plane that encloses the frustum.
   * @param {Plane} [p1] - The second plane that encloses the frustum.
   * @param {Plane} [p2] - The third plane that encloses the frustum.
   * @param {Plane} [p3] - The fourth plane that encloses the frustum.
   * @param {Plane} [p4] - The fifth plane that encloses the frustum.
   * @param {Plane} [p5] - The sixth plane that encloses the frustum.
   * @return {Frustum} A reference to this frustum.
   */
  set(t, e, n, r, s, a) {
    const o = this.planes;
    return o[0].copy(t), o[1].copy(e), o[2].copy(n), o[3].copy(r), o[4].copy(s), o[5].copy(a), this;
  }
  /**
   * Copies the values of the given frustum to this instance.
   *
   * @param {Frustum} frustum - The frustum to copy.
   * @return {Frustum} A reference to this frustum.
   */
  copy(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++)
      e[n].copy(t.planes[n]);
    return this;
  }
  /**
   * Sets the frustum planes from the given projection matrix.
   *
   * @param {Matrix4} m - The projection matrix.
   * @param {(WebGLCoordinateSystem|WebGPUCoordinateSystem)} coordinateSystem - The coordinate system.
   * @return {Frustum} A reference to this frustum.
   */
  setFromProjectionMatrix(t, e = mn) {
    const n = this.planes, r = t.elements, s = r[0], a = r[1], o = r[2], l = r[3], c = r[4], h = r[5], u = r[6], f = r[7], d = r[8], g = r[9], v = r[10], m = r[11], p = r[12], A = r[13], T = r[14], S = r[15];
    if (n[0].setComponents(l - s, f - c, m - d, S - p).normalize(), n[1].setComponents(l + s, f + c, m + d, S + p).normalize(), n[2].setComponents(l + a, f + h, m + g, S + A).normalize(), n[3].setComponents(l - a, f - h, m - g, S - A).normalize(), n[4].setComponents(l - o, f - u, m - v, S - T).normalize(), e === mn)
      n[5].setComponents(l + o, f + u, m + v, S + T).normalize();
    else if (e === kr)
      n[5].setComponents(o, u, v, T).normalize();
    else
      throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + e);
    return this;
  }
  /**
   * Returns `true` if the 3D object's bounding sphere is intersecting this frustum.
   *
   * Note that the 3D object must have a geometry so that the bounding sphere can be calculated.
   *
   * @param {Object3D} object - The 3D object to test.
   * @return {boolean} Whether the 3D object's bounding sphere is intersecting this frustum or not.
   */
  intersectsObject(t) {
    if (t.boundingSphere !== void 0)
      t.boundingSphere === null && t.computeBoundingSphere(), Nn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);
    else {
      const e = t.geometry;
      e.boundingSphere === null && e.computeBoundingSphere(), Nn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld);
    }
    return this.intersectsSphere(Nn);
  }
  /**
   * Returns `true` if the given sprite is intersecting this frustum.
   *
   * @param {Sprite} sprite - The sprite to test.
   * @return {boolean} Whether the sprite is intersecting this frustum or not.
   */
  intersectsSprite(t) {
    return Nn.center.set(0, 0, 0), Nn.radius = 0.7071067811865476, Nn.applyMatrix4(t.matrixWorld), this.intersectsSphere(Nn);
  }
  /**
   * Returns `true` if the given bounding sphere is intersecting this frustum.
   *
   * @param {Sphere} sphere - The bounding sphere to test.
   * @return {boolean} Whether the bounding sphere is intersecting this frustum or not.
   */
  intersectsSphere(t) {
    const e = this.planes, n = t.center, r = -t.radius;
    for (let s = 0; s < 6; s++)
      if (e[s].distanceToPoint(n) < r)
        return !1;
    return !0;
  }
  /**
   * Returns `true` if the given bounding box is intersecting this frustum.
   *
   * @param {Box3} box - The bounding box to test.
   * @return {boolean} Whether the bounding box is intersecting this frustum or not.
   */
  intersectsBox(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++) {
      const r = e[n];
      if (Er.x = r.normal.x > 0 ? t.max.x : t.min.x, Er.y = r.normal.y > 0 ? t.max.y : t.min.y, Er.z = r.normal.z > 0 ? t.max.z : t.min.z, r.distanceToPoint(Er) < 0)
        return !1;
    }
    return !0;
  }
  /**
   * Returns `true` if the given point lies within the frustum.
   *
   * @param {Vector3} point - The point to test.
   * @return {boolean} Whether the point lies within this frustum or not.
   */
  containsPoint(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++)
      if (e[n].distanceToPoint(t) < 0)
        return !1;
    return !0;
  }
  /**
   * Returns a new frustum with copied values from this instance.
   *
   * @return {Frustum} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
}
class zl extends ge {
  /**
   * Constructs a new texture.
   *
   * @param {HTMLCanvasElement} [canvas] - The HTML canvas element.
   * @param {number} [mapping=Texture.DEFAULT_MAPPING] - The texture mapping.
   * @param {number} [wrapS=ClampToEdgeWrapping] - The wrapS value.
   * @param {number} [wrapT=ClampToEdgeWrapping] - The wrapT value.
   * @param {number} [magFilter=LinearFilter] - The mag filter value.
   * @param {number} [minFilter=LinearMipmapLinearFilter] - The min filter value.
   * @param {number} [format=RGBAFormat] - The texture format.
   * @param {number} [type=UnsignedByteType] - The texture type.
   * @param {number} [anisotropy=Texture.DEFAULT_ANISOTROPY] - The anisotropy value.
   */
  constructor(t, e, n, r, s, a, o, l, c) {
    super(t, e, n, r, s, a, o, l, c), this.isCanvasTexture = !0, this.needsUpdate = !0;
  }
}
class Hl extends ge {
  /**
   * Constructs a new depth texture.
   *
   * @param {number} width - The width of the texture.
   * @param {number} height - The height of the texture.
   * @param {number} [type=UnsignedIntType] - The texture type.
   * @param {number} [mapping=Texture.DEFAULT_MAPPING] - The texture mapping.
   * @param {number} [wrapS=ClampToEdgeWrapping] - The wrapS value.
   * @param {number} [wrapT=ClampToEdgeWrapping] - The wrapT value.
   * @param {number} [magFilter=LinearFilter] - The mag filter value.
   * @param {number} [minFilter=LinearFilter] - The min filter value.
   * @param {number} [anisotropy=Texture.DEFAULT_ANISOTROPY] - The anisotropy value.
   * @param {number} [format=DepthFormat] - The texture format.
   */
  constructor(t, e, n = qn, r, s, a, o = Ue, l = Ue, c, h = qi) {
    if (h !== qi && h !== Yi)
      throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
    super(null, r, s, a, o, l, h, n, c), this.isDepthTexture = !0, this.image = { width: t, height: e }, this.flipY = !1, this.generateMipmaps = !1, this.compareFunction = null;
  }
  copy(t) {
    return super.copy(t), this.source = new Ra(Object.assign({}, t.image)), this.compareFunction = t.compareFunction, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return this.compareFunction !== null && (e.compareFunction = this.compareFunction), e;
  }
}
class Vr extends vn {
  /**
   * Constructs a new cylinder geometry.
   *
   * @param {number} [radiusTop=1] - Radius of the cylinder at the top.
   * @param {number} [radiusBottom=1] - Radius of the cylinder at the bottom.
   * @param {number} [height=1] - Height of the cylinder.
   * @param {number} [radialSegments=32] - Number of segmented faces around the circumference of the cylinder.
   * @param {number} [heightSegments=1] - Number of rows of faces along the height of the cylinder.
   * @param {boolean} [openEnded=false] - Whether the base of the cylinder is open or capped.
   * @param {number} [thetaStart=0] - Start angle for first segment, in radians.
   * @param {number} [thetaLength=Math.PI*2] - The central angle, often called theta, of the circular sector, in radians.
   * The default value results in a complete cylinder.
   */
  constructor(t = 1, e = 1, n = 1, r = 32, s = 1, a = !1, o = 0, l = Math.PI * 2) {
    super(), this.type = "CylinderGeometry", this.parameters = {
      radiusTop: t,
      radiusBottom: e,
      height: n,
      radialSegments: r,
      heightSegments: s,
      openEnded: a,
      thetaStart: o,
      thetaLength: l
    };
    const c = this;
    r = Math.floor(r), s = Math.floor(s);
    const h = [], u = [], f = [], d = [];
    let g = 0;
    const v = [], m = n / 2;
    let p = 0;
    A(), a === !1 && (t > 0 && T(!0), e > 0 && T(!1)), this.setIndex(h), this.setAttribute("position", new Ne(u, 3)), this.setAttribute("normal", new Ne(f, 3)), this.setAttribute("uv", new Ne(d, 2));
    function A() {
      const S = new I(), N = new I();
      let w = 0;
      const R = (e - t) / n;
      for (let U = 0; U <= s; U++) {
        const y = [], M = U / s, C = M * (e - t) + t;
        for (let H = 0; H <= r; H++) {
          const B = H / r, G = B * l + o, Z = Math.sin(G), W = Math.cos(G);
          N.x = C * Z, N.y = -M * n + m, N.z = C * W, u.push(N.x, N.y, N.z), S.set(Z, R, W).normalize(), f.push(S.x, S.y, S.z), d.push(B, 1 - M), y.push(g++);
        }
        v.push(y);
      }
      for (let U = 0; U < r; U++)
        for (let y = 0; y < s; y++) {
          const M = v[y][U], C = v[y + 1][U], H = v[y + 1][U + 1], B = v[y][U + 1];
          (t > 0 || y !== 0) && (h.push(M, C, B), w += 3), (e > 0 || y !== s - 1) && (h.push(C, H, B), w += 3);
        }
      c.addGroup(p, w, 0), p += w;
    }
    function T(S) {
      const N = g, w = new mt(), R = new I();
      let U = 0;
      const y = S === !0 ? t : e, M = S === !0 ? 1 : -1;
      for (let H = 1; H <= r; H++)
        u.push(0, m * M, 0), f.push(0, M, 0), d.push(0.5, 0.5), g++;
      const C = g;
      for (let H = 0; H <= r; H++) {
        const G = H / r * l + o, Z = Math.cos(G), W = Math.sin(G);
        R.x = y * W, R.y = m * M, R.z = y * Z, u.push(R.x, R.y, R.z), f.push(0, M, 0), w.x = Z * 0.5 + 0.5, w.y = W * 0.5 * M + 0.5, d.push(w.x, w.y), g++;
      }
      for (let H = 0; H < r; H++) {
        const B = N + H, G = C + H;
        S === !0 ? h.push(G, G + 1, B) : h.push(G + 1, G, B), U += 3;
      }
      c.addGroup(p, U, S === !0 ? 1 : 2), p += U;
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  /**
   * Factory method for creating an instance of this class from the given
   * JSON object.
   *
   * @param {Object} data - A JSON object representing the serialized geometry.
   * @return {CylinderGeometry} A new instance.
   */
  static fromJSON(t) {
    return new Vr(t.radiusTop, t.radiusBottom, t.height, t.radialSegments, t.heightSegments, t.openEnded, t.thetaStart, t.thetaLength);
  }
}
class sn {
  /**
   * Constructs a new curve.
   */
  constructor() {
    this.type = "Curve", this.arcLengthDivisions = 200, this.needsUpdate = !1, this.cacheArcLengths = null;
  }
  /**
   * This method returns a vector in 2D or 3D space (depending on the curve definition)
   * for the given interpolation factor.
   *
   * @abstract
   * @param {number} t - A interpolation factor representing a position on the curve. Must be in the range `[0,1]`.
   * @param {(Vector2|Vector3)} [optionalTarget] - The optional target vector the result is written to.
   * @return {(Vector2|Vector3)} The position on the curve. It can be a 2D or 3D vector depending on the curve definition.
   */
  getPoint() {
    console.warn("THREE.Curve: .getPoint() not implemented.");
  }
  /**
   * This method returns a vector in 2D or 3D space (depending on the curve definition)
   * for the given interpolation factor. Unlike {@link Curve#getPoint}, this method honors the length
   * of the curve which equidistant samples.
   *
   * @param {number} u - A interpolation factor representing a position on the curve. Must be in the range `[0,1]`.
   * @param {(Vector2|Vector3)} [optionalTarget] - The optional target vector the result is written to.
   * @return {(Vector2|Vector3)} The position on the curve. It can be a 2D or 3D vector depending on the curve definition.
   */
  getPointAt(t, e) {
    const n = this.getUtoTmapping(t);
    return this.getPoint(n, e);
  }
  /**
   * This method samples the curve via {@link Curve#getPoint} and returns an array of points representing
   * the curve shape.
   *
   * @param {number} [divisions=5] - The number of divisions.
   * @return {Array<(Vector2|Vector3)>} An array holding the sampled curve values. The number of points is `divisions + 1`.
   */
  getPoints(t = 5) {
    const e = [];
    for (let n = 0; n <= t; n++)
      e.push(this.getPoint(n / t));
    return e;
  }
  // Get sequence of points using getPointAt( u )
  /**
   * This method samples the curve via {@link Curve#getPointAt} and returns an array of points representing
   * the curve shape. Unlike {@link Curve#getPoints}, this method returns equi-spaced points across the entire
   * curve.
   *
   * @param {number} [divisions=5] - The number of divisions.
   * @return {Array<(Vector2|Vector3)>} An array holding the sampled curve values. The number of points is `divisions + 1`.
   */
  getSpacedPoints(t = 5) {
    const e = [];
    for (let n = 0; n <= t; n++)
      e.push(this.getPointAt(n / t));
    return e;
  }
  /**
   * Returns the total arc length of the curve.
   *
   * @return {number} The length of the curve.
   */
  getLength() {
    const t = this.getLengths();
    return t[t.length - 1];
  }
  /**
   * Returns an array of cumulative segment lengths of the curve.
   *
   * @param {number} [divisions=this.arcLengthDivisions] - The number of divisions.
   * @return {Array<number>} An array holding the cumulative segment lengths.
   */
  getLengths(t = this.arcLengthDivisions) {
    if (this.cacheArcLengths && this.cacheArcLengths.length === t + 1 && !this.needsUpdate)
      return this.cacheArcLengths;
    this.needsUpdate = !1;
    const e = [];
    let n, r = this.getPoint(0), s = 0;
    e.push(0);
    for (let a = 1; a <= t; a++)
      n = this.getPoint(a / t), s += n.distanceTo(r), e.push(s), r = n;
    return this.cacheArcLengths = e, e;
  }
  /**
   * Update the cumulative segment distance cache. The method must be called
   * every time curve parameters are changed. If an updated curve is part of a
   * composed curve like {@link CurvePath}, this method must be called on the
   * composed curve, too.
   */
  updateArcLengths() {
    this.needsUpdate = !0, this.getLengths();
  }
  /**
   * Given an interpolation factor in the range `[0,1]`, this method returns an updated
   * interpolation factor in the same range that can be ued to sample equidistant points
   * from a curve.
   *
   * @param {number} u - The interpolation factor.
   * @param {?number} distance - An optional distance on the curve.
   * @return {number} The updated interpolation factor.
   */
  getUtoTmapping(t, e = null) {
    const n = this.getLengths();
    let r = 0;
    const s = n.length;
    let a;
    e ? a = e : a = t * n[s - 1];
    let o = 0, l = s - 1, c;
    for (; o <= l; )
      if (r = Math.floor(o + (l - o) / 2), c = n[r] - a, c < 0)
        o = r + 1;
      else if (c > 0)
        l = r - 1;
      else {
        l = r;
        break;
      }
    if (r = l, n[r] === a)
      return r / (s - 1);
    const h = n[r], f = n[r + 1] - h, d = (a - h) / f;
    return (r + d) / (s - 1);
  }
  /**
   * Returns a unit vector tangent for the given interpolation factor.
   * If the derived curve does not implement its tangent derivation,
   * two points a small delta apart will be used to find its gradient
   * which seems to give a reasonable approximation.
   *
   * @param {number} t - The interpolation factor.
   * @param {(Vector2|Vector3)} [optionalTarget] - The optional target vector the result is written to.
   * @return {(Vector2|Vector3)} The tangent vector.
   */
  getTangent(t, e) {
    let r = t - 1e-4, s = t + 1e-4;
    r < 0 && (r = 0), s > 1 && (s = 1);
    const a = this.getPoint(r), o = this.getPoint(s), l = e || (a.isVector2 ? new mt() : new I());
    return l.copy(o).sub(a).normalize(), l;
  }
  /**
   * Same as {@link Curve#getTangent} but with equidistant samples.
   *
   * @param {number} u - The interpolation factor.
   * @param {(Vector2|Vector3)} [optionalTarget] - The optional target vector the result is written to.
   * @return {(Vector2|Vector3)} The tangent vector.
   * @see {@link Curve#getPointAt}
   */
  getTangentAt(t, e) {
    const n = this.getUtoTmapping(t);
    return this.getTangent(n, e);
  }
  /**
   * Generates the Frenet Frames. Requires a curve definition in 3D space. Used
   * in geometries like {@link TubeGeometry} or {@link ExtrudeGeometry}.
   *
   * @param {number} segments - The number of segments.
   * @param {boolean} [closed=false] - Whether the curve is closed or not.
   * @return {{tangents: Array<Vector3>, normals: Array<Vector3>, binormals: Array<Vector3>}} The Frenet Frames.
   */
  computeFrenetFrames(t, e = !1) {
    const n = new I(), r = [], s = [], a = [], o = new I(), l = new Wt();
    for (let d = 0; d <= t; d++) {
      const g = d / t;
      r[d] = this.getTangentAt(g, new I());
    }
    s[0] = new I(), a[0] = new I();
    let c = Number.MAX_VALUE;
    const h = Math.abs(r[0].x), u = Math.abs(r[0].y), f = Math.abs(r[0].z);
    h <= c && (c = h, n.set(1, 0, 0)), u <= c && (c = u, n.set(0, 1, 0)), f <= c && n.set(0, 0, 1), o.crossVectors(r[0], n).normalize(), s[0].crossVectors(r[0], o), a[0].crossVectors(r[0], s[0]);
    for (let d = 1; d <= t; d++) {
      if (s[d] = s[d - 1].clone(), a[d] = a[d - 1].clone(), o.crossVectors(r[d - 1], r[d]), o.length() > Number.EPSILON) {
        o.normalize();
        const g = Math.acos(Nt(r[d - 1].dot(r[d]), -1, 1));
        s[d].applyMatrix4(l.makeRotationAxis(o, g));
      }
      a[d].crossVectors(r[d], s[d]);
    }
    if (e === !0) {
      let d = Math.acos(Nt(s[0].dot(s[t]), -1, 1));
      d /= t, r[0].dot(o.crossVectors(s[0], s[t])) > 0 && (d = -d);
      for (let g = 1; g <= t; g++)
        s[g].applyMatrix4(l.makeRotationAxis(r[g], d * g)), a[g].crossVectors(r[g], s[g]);
    }
    return {
      tangents: r,
      normals: s,
      binormals: a
    };
  }
  /**
   * Returns a new curve with copied values from this instance.
   *
   * @return {Curve} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
  /**
   * Copies the values of the given curve to this instance.
   *
   * @param {Curve} source - The curve to copy.
   * @return {Curve} A reference to this curve.
   */
  copy(t) {
    return this.arcLengthDivisions = t.arcLengthDivisions, this;
  }
  /**
   * Serializes the curve into JSON.
   *
   * @return {Object} A JSON object representing the serialized curve.
   * @see {@link ObjectLoader#parse}
   */
  toJSON() {
    const t = {
      metadata: {
        version: 4.6,
        type: "Curve",
        generator: "Curve.toJSON"
      }
    };
    return t.arcLengthDivisions = this.arcLengthDivisions, t.type = this.type, t;
  }
  /**
   * Deserializes the curve from the given JSON.
   *
   * @param {Object} json - The JSON holding the serialized curve.
   * @return {Curve} A reference to this curve.
   */
  fromJSON(t) {
    return this.arcLengthDivisions = t.arcLengthDivisions, this;
  }
}
class La extends sn {
  /**
   * Constructs a new ellipse curve.
   *
   * @param {number} [aX=0] - The X center of the ellipse.
   * @param {number} [aY=0] - The Y center of the ellipse.
   * @param {number} [xRadius=1] - The radius of the ellipse in the x direction.
   * @param {number} [yRadius=1] - The radius of the ellipse in the y direction.
   * @param {number} [aStartAngle=0] - The start angle of the curve in radians starting from the positive X axis.
   * @param {number} [aEndAngle=Math.PI*2] - The end angle of the curve in radians starting from the positive X axis.
   * @param {boolean} [aClockwise=false] - Whether the ellipse is drawn clockwise or not.
   * @param {number} [aRotation=0] - The rotation angle of the ellipse in radians, counterclockwise from the positive X axis.
   */
  constructor(t = 0, e = 0, n = 1, r = 1, s = 0, a = Math.PI * 2, o = !1, l = 0) {
    super(), this.isEllipseCurve = !0, this.type = "EllipseCurve", this.aX = t, this.aY = e, this.xRadius = n, this.yRadius = r, this.aStartAngle = s, this.aEndAngle = a, this.aClockwise = o, this.aRotation = l;
  }
  /**
   * Returns a point on the curve.
   *
   * @param {number} t - A interpolation factor representing a position on the curve. Must be in the range `[0,1]`.
   * @param {Vector2} [optionalTarget] - The optional target vector the result is written to.
   * @return {Vector2} The position on the curve.
   */
  getPoint(t, e = new mt()) {
    const n = e, r = Math.PI * 2;
    let s = this.aEndAngle - this.aStartAngle;
    const a = Math.abs(s) < Number.EPSILON;
    for (; s < 0; ) s += r;
    for (; s > r; ) s -= r;
    s < Number.EPSILON && (a ? s = 0 : s = r), this.aClockwise === !0 && !a && (s === r ? s = -r : s = s - r);
    const o = this.aStartAngle + t * s;
    let l = this.aX + this.xRadius * Math.cos(o), c = this.aY + this.yRadius * Math.sin(o);
    if (this.aRotation !== 0) {
      const h = Math.cos(this.aRotation), u = Math.sin(this.aRotation), f = l - this.aX, d = c - this.aY;
      l = f * h - d * u + this.aX, c = f * u + d * h + this.aY;
    }
    return n.set(l, c);
  }
  copy(t) {
    return super.copy(t), this.aX = t.aX, this.aY = t.aY, this.xRadius = t.xRadius, this.yRadius = t.yRadius, this.aStartAngle = t.aStartAngle, this.aEndAngle = t.aEndAngle, this.aClockwise = t.aClockwise, this.aRotation = t.aRotation, this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.aX = this.aX, t.aY = this.aY, t.xRadius = this.xRadius, t.yRadius = this.yRadius, t.aStartAngle = this.aStartAngle, t.aEndAngle = this.aEndAngle, t.aClockwise = this.aClockwise, t.aRotation = this.aRotation, t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.aX = t.aX, this.aY = t.aY, this.xRadius = t.xRadius, this.yRadius = t.yRadius, this.aStartAngle = t.aStartAngle, this.aEndAngle = t.aEndAngle, this.aClockwise = t.aClockwise, this.aRotation = t.aRotation, this;
  }
}
class Vh extends La {
  /**
   * Constructs a new arc curve.
   *
   * @param {number} [aX=0] - The X center of the ellipse.
   * @param {number} [aY=0] - The Y center of the ellipse.
   * @param {number} [aRadius=1] - The radius of the ellipse in the x direction.
   * @param {number} [aStartAngle=0] - The start angle of the curve in radians starting from the positive X axis.
   * @param {number} [aEndAngle=Math.PI*2] - The end angle of the curve in radians starting from the positive X axis.
   * @param {boolean} [aClockwise=false] - Whether the ellipse is drawn clockwise or not.
   */
  constructor(t, e, n, r, s, a) {
    super(t, e, n, n, r, s, a), this.isArcCurve = !0, this.type = "ArcCurve";
  }
}
function Da() {
  let i = 0, t = 0, e = 0, n = 0;
  function r(s, a, o, l) {
    i = s, t = o, e = -3 * s + 3 * a - 2 * o - l, n = 2 * s - 2 * a + o + l;
  }
  return {
    initCatmullRom: function(s, a, o, l, c) {
      r(a, o, c * (o - s), c * (l - a));
    },
    initNonuniformCatmullRom: function(s, a, o, l, c, h, u) {
      let f = (a - s) / c - (o - s) / (c + h) + (o - a) / h, d = (o - a) / h - (l - a) / (h + u) + (l - o) / u;
      f *= h, d *= h, r(a, o, f, d);
    },
    calc: function(s) {
      const a = s * s, o = a * s;
      return i + t * s + e * a + n * o;
    }
  };
}
const Tr = /* @__PURE__ */ new I(), xs = /* @__PURE__ */ new Da(), Ms = /* @__PURE__ */ new Da(), Ss = /* @__PURE__ */ new Da();
class Gh extends sn {
  /**
   * Constructs a new Catmull-Rom curve.
   *
   * @param {Array<Vector3>} [points] - An array of 3D points defining the curve.
   * @param {boolean} [closed=false] - Whether the curve is closed or not.
   * @param {('centripetal'|'chordal'|'catmullrom')} [curveType='centripetal'] - The curve type.
   * @param {number} [tension=0.5] - Tension of the curve.
   */
  constructor(t = [], e = !1, n = "centripetal", r = 0.5) {
    super(), this.isCatmullRomCurve3 = !0, this.type = "CatmullRomCurve3", this.points = t, this.closed = e, this.curveType = n, this.tension = r;
  }
  /**
   * Returns a point on the curve.
   *
   * @param {number} t - A interpolation factor representing a position on the curve. Must be in the range `[0,1]`.
   * @param {Vector3} [optionalTarget] - The optional target vector the result is written to.
   * @return {Vector3} The position on the curve.
   */
  getPoint(t, e = new I()) {
    const n = e, r = this.points, s = r.length, a = (s - (this.closed ? 0 : 1)) * t;
    let o = Math.floor(a), l = a - o;
    this.closed ? o += o > 0 ? 0 : (Math.floor(Math.abs(o) / s) + 1) * s : l === 0 && o === s - 1 && (o = s - 2, l = 1);
    let c, h;
    this.closed || o > 0 ? c = r[(o - 1) % s] : (Tr.subVectors(r[0], r[1]).add(r[0]), c = Tr);
    const u = r[o % s], f = r[(o + 1) % s];
    if (this.closed || o + 2 < s ? h = r[(o + 2) % s] : (Tr.subVectors(r[s - 1], r[s - 2]).add(r[s - 1]), h = Tr), this.curveType === "centripetal" || this.curveType === "chordal") {
      const d = this.curveType === "chordal" ? 0.5 : 0.25;
      let g = Math.pow(c.distanceToSquared(u), d), v = Math.pow(u.distanceToSquared(f), d), m = Math.pow(f.distanceToSquared(h), d);
      v < 1e-4 && (v = 1), g < 1e-4 && (g = v), m < 1e-4 && (m = v), xs.initNonuniformCatmullRom(c.x, u.x, f.x, h.x, g, v, m), Ms.initNonuniformCatmullRom(c.y, u.y, f.y, h.y, g, v, m), Ss.initNonuniformCatmullRom(c.z, u.z, f.z, h.z, g, v, m);
    } else this.curveType === "catmullrom" && (xs.initCatmullRom(c.x, u.x, f.x, h.x, this.tension), Ms.initCatmullRom(c.y, u.y, f.y, h.y, this.tension), Ss.initCatmullRom(c.z, u.z, f.z, h.z, this.tension));
    return n.set(
      xs.calc(l),
      Ms.calc(l),
      Ss.calc(l)
    ), n;
  }
  copy(t) {
    super.copy(t), this.points = [];
    for (let e = 0, n = t.points.length; e < n; e++) {
      const r = t.points[e];
      this.points.push(r.clone());
    }
    return this.closed = t.closed, this.curveType = t.curveType, this.tension = t.tension, this;
  }
  toJSON() {
    const t = super.toJSON();
    t.points = [];
    for (let e = 0, n = this.points.length; e < n; e++) {
      const r = this.points[e];
      t.points.push(r.toArray());
    }
    return t.closed = this.closed, t.curveType = this.curveType, t.tension = this.tension, t;
  }
  fromJSON(t) {
    super.fromJSON(t), this.points = [];
    for (let e = 0, n = t.points.length; e < n; e++) {
      const r = t.points[e];
      this.points.push(new I().fromArray(r));
    }
    return this.closed = t.closed, this.curveType = t.curveType, this.tension = t.tension, this;
  }
}
function vo(i, t, e, n, r) {
  const s = (n - t) * 0.5, a = (r - e) * 0.5, o = i * i, l = i * o;
  return (2 * e - 2 * n + s + a) * l + (-3 * e + 3 * n - 2 * s - a) * o + s * i + e;
}
function Wh(i, t) {
  const e = 1 - i;
  return e * e * t;
}
function Xh(i, t) {
  return 2 * (1 - i) * i * t;
}
function qh(i, t) {
  return i * i * t;
}
function Hi(i, t, e, n) {
  return Wh(i, t) + Xh(i, e) + qh(i, n);
}
function Yh(i, t) {
  const e = 1 - i;
  return e * e * e * t;
}
function $h(i, t) {
  const e = 1 - i;
  return 3 * e * e * i * t;
}
function Zh(i, t) {
  return 3 * (1 - i) * i * i * t;
}
function Jh(i, t) {
  return i * i * i * t;
}
function ki(i, t, e, n, r) {
  return Yh(i, t) + $h(i, e) + Zh(i, n) + Jh(i, r);
}
class kl extends sn {
  /**
   * Constructs a new Cubic Bezier curve.
   *
   * @param {Vector2} [v0] - The start point.
   * @param {Vector2} [v1] - The first control point.
   * @param {Vector2} [v2] - The second control point.
   * @param {Vector2} [v3] - The end point.
   */
  constructor(t = new mt(), e = new mt(), n = new mt(), r = new mt()) {
    super(), this.isCubicBezierCurve = !0, this.type = "CubicBezierCurve", this.v0 = t, this.v1 = e, this.v2 = n, this.v3 = r;
  }
  /**
   * Returns a point on the curve.
   *
   * @param {number} t - A interpolation factor representing a position on the curve. Must be in the range `[0,1]`.
   * @param {Vector2} [optionalTarget] - The optional target vector the result is written to.
   * @return {Vector2} The position on the curve.
   */
  getPoint(t, e = new mt()) {
    const n = e, r = this.v0, s = this.v1, a = this.v2, o = this.v3;
    return n.set(
      ki(t, r.x, s.x, a.x, o.x),
      ki(t, r.y, s.y, a.y, o.y)
    ), n;
  }
  copy(t) {
    return super.copy(t), this.v0.copy(t.v0), this.v1.copy(t.v1), this.v2.copy(t.v2), this.v3.copy(t.v3), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v0 = this.v0.toArray(), t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t.v3 = this.v3.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v0.fromArray(t.v0), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this.v3.fromArray(t.v3), this;
  }
}
class Kh extends sn {
  /**
   * Constructs a new Cubic Bezier curve.
   *
   * @param {Vector3} [v0] - The start point.
   * @param {Vector3} [v1] - The first control point.
   * @param {Vector3} [v2] - The second control point.
   * @param {Vector3} [v3] - The end point.
   */
  constructor(t = new I(), e = new I(), n = new I(), r = new I()) {
    super(), this.isCubicBezierCurve3 = !0, this.type = "CubicBezierCurve3", this.v0 = t, this.v1 = e, this.v2 = n, this.v3 = r;
  }
  /**
   * Returns a point on the curve.
   *
   * @param {number} t - A interpolation factor representing a position on the curve. Must be in the range `[0,1]`.
   * @param {Vector3} [optionalTarget] - The optional target vector the result is written to.
   * @return {Vector3} The position on the curve.
   */
  getPoint(t, e = new I()) {
    const n = e, r = this.v0, s = this.v1, a = this.v2, o = this.v3;
    return n.set(
      ki(t, r.x, s.x, a.x, o.x),
      ki(t, r.y, s.y, a.y, o.y),
      ki(t, r.z, s.z, a.z, o.z)
    ), n;
  }
  copy(t) {
    return super.copy(t), this.v0.copy(t.v0), this.v1.copy(t.v1), this.v2.copy(t.v2), this.v3.copy(t.v3), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v0 = this.v0.toArray(), t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t.v3 = this.v3.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v0.fromArray(t.v0), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this.v3.fromArray(t.v3), this;
  }
}
class Vl extends sn {
  /**
   * Constructs a new line curve.
   *
   * @param {Vector2} [v1] - The start point.
   * @param {Vector2} [v2] - The end point.
   */
  constructor(t = new mt(), e = new mt()) {
    super(), this.isLineCurve = !0, this.type = "LineCurve", this.v1 = t, this.v2 = e;
  }
  /**
   * Returns a point on the line.
   *
   * @param {number} t - A interpolation factor representing a position on the line. Must be in the range `[0,1]`.
   * @param {Vector2} [optionalTarget] - The optional target vector the result is written to.
   * @return {Vector2} The position on the line.
   */
  getPoint(t, e = new mt()) {
    const n = e;
    return t === 1 ? n.copy(this.v2) : (n.copy(this.v2).sub(this.v1), n.multiplyScalar(t).add(this.v1)), n;
  }
  // Line curve is linear, so we can overwrite default getPointAt
  getPointAt(t, e) {
    return this.getPoint(t, e);
  }
  getTangent(t, e = new mt()) {
    return e.subVectors(this.v2, this.v1).normalize();
  }
  getTangentAt(t, e) {
    return this.getTangent(t, e);
  }
  copy(t) {
    return super.copy(t), this.v1.copy(t.v1), this.v2.copy(t.v2), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this;
  }
}
class jh extends sn {
  /**
   * Constructs a new line curve.
   *
   * @param {Vector3} [v1] - The start point.
   * @param {Vector3} [v2] - The end point.
   */
  constructor(t = new I(), e = new I()) {
    super(), this.isLineCurve3 = !0, this.type = "LineCurve3", this.v1 = t, this.v2 = e;
  }
  /**
   * Returns a point on the line.
   *
   * @param {number} t - A interpolation factor representing a position on the line. Must be in the range `[0,1]`.
   * @param {Vector3} [optionalTarget] - The optional target vector the result is written to.
   * @return {Vector3} The position on the line.
   */
  getPoint(t, e = new I()) {
    const n = e;
    return t === 1 ? n.copy(this.v2) : (n.copy(this.v2).sub(this.v1), n.multiplyScalar(t).add(this.v1)), n;
  }
  // Line curve is linear, so we can overwrite default getPointAt
  getPointAt(t, e) {
    return this.getPoint(t, e);
  }
  getTangent(t, e = new I()) {
    return e.subVectors(this.v2, this.v1).normalize();
  }
  getTangentAt(t, e) {
    return this.getTangent(t, e);
  }
  copy(t) {
    return super.copy(t), this.v1.copy(t.v1), this.v2.copy(t.v2), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this;
  }
}
class Gl extends sn {
  /**
   * Constructs a new Quadratic Bezier curve.
   *
   * @param {Vector2} [v0] - The start point.
   * @param {Vector2} [v1] - The control point.
   * @param {Vector2} [v2] - The end point.
   */
  constructor(t = new mt(), e = new mt(), n = new mt()) {
    super(), this.isQuadraticBezierCurve = !0, this.type = "QuadraticBezierCurve", this.v0 = t, this.v1 = e, this.v2 = n;
  }
  /**
   * Returns a point on the curve.
   *
   * @param {number} t - A interpolation factor representing a position on the curve. Must be in the range `[0,1]`.
   * @param {Vector2} [optionalTarget] - The optional target vector the result is written to.
   * @return {Vector2} The position on the curve.
   */
  getPoint(t, e = new mt()) {
    const n = e, r = this.v0, s = this.v1, a = this.v2;
    return n.set(
      Hi(t, r.x, s.x, a.x),
      Hi(t, r.y, s.y, a.y)
    ), n;
  }
  copy(t) {
    return super.copy(t), this.v0.copy(t.v0), this.v1.copy(t.v1), this.v2.copy(t.v2), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v0 = this.v0.toArray(), t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v0.fromArray(t.v0), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this;
  }
}
class Qh extends sn {
  /**
   * Constructs a new Quadratic Bezier curve.
   *
   * @param {Vector3} [v0] - The start point.
   * @param {Vector3} [v1] - The control point.
   * @param {Vector3} [v2] - The end point.
   */
  constructor(t = new I(), e = new I(), n = new I()) {
    super(), this.isQuadraticBezierCurve3 = !0, this.type = "QuadraticBezierCurve3", this.v0 = t, this.v1 = e, this.v2 = n;
  }
  /**
   * Returns a point on the curve.
   *
   * @param {number} t - A interpolation factor representing a position on the curve. Must be in the range `[0,1]`.
   * @param {Vector3} [optionalTarget] - The optional target vector the result is written to.
   * @return {Vector3} The position on the curve.
   */
  getPoint(t, e = new I()) {
    const n = e, r = this.v0, s = this.v1, a = this.v2;
    return n.set(
      Hi(t, r.x, s.x, a.x),
      Hi(t, r.y, s.y, a.y),
      Hi(t, r.z, s.z, a.z)
    ), n;
  }
  copy(t) {
    return super.copy(t), this.v0.copy(t.v0), this.v1.copy(t.v1), this.v2.copy(t.v2), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.v0 = this.v0.toArray(), t.v1 = this.v1.toArray(), t.v2 = this.v2.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.v0.fromArray(t.v0), this.v1.fromArray(t.v1), this.v2.fromArray(t.v2), this;
  }
}
class Wl extends sn {
  /**
   * Constructs a new 2D spline curve.
   *
   * @param {Array<Vector2>} [points] -  An array of 2D points defining the curve.
   */
  constructor(t = []) {
    super(), this.isSplineCurve = !0, this.type = "SplineCurve", this.points = t;
  }
  /**
   * Returns a point on the curve.
   *
   * @param {number} t - A interpolation factor representing a position on the curve. Must be in the range `[0,1]`.
   * @param {Vector2} [optionalTarget] - The optional target vector the result is written to.
   * @return {Vector2} The position on the curve.
   */
  getPoint(t, e = new mt()) {
    const n = e, r = this.points, s = (r.length - 1) * t, a = Math.floor(s), o = s - a, l = r[a === 0 ? a : a - 1], c = r[a], h = r[a > r.length - 2 ? r.length - 1 : a + 1], u = r[a > r.length - 3 ? r.length - 1 : a + 2];
    return n.set(
      vo(o, l.x, c.x, h.x, u.x),
      vo(o, l.y, c.y, h.y, u.y)
    ), n;
  }
  copy(t) {
    super.copy(t), this.points = [];
    for (let e = 0, n = t.points.length; e < n; e++) {
      const r = t.points[e];
      this.points.push(r.clone());
    }
    return this;
  }
  toJSON() {
    const t = super.toJSON();
    t.points = [];
    for (let e = 0, n = this.points.length; e < n; e++) {
      const r = this.points[e];
      t.points.push(r.toArray());
    }
    return t;
  }
  fromJSON(t) {
    super.fromJSON(t), this.points = [];
    for (let e = 0, n = t.points.length; e < n; e++) {
      const r = t.points[e];
      this.points.push(new mt().fromArray(r));
    }
    return this;
  }
}
var xo = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ArcCurve: Vh,
  CatmullRomCurve3: Gh,
  CubicBezierCurve: kl,
  CubicBezierCurve3: Kh,
  EllipseCurve: La,
  LineCurve: Vl,
  LineCurve3: jh,
  QuadraticBezierCurve: Gl,
  QuadraticBezierCurve3: Qh,
  SplineCurve: Wl
});
class tu extends sn {
  /**
   * Constructs a new curve path.
   */
  constructor() {
    super(), this.type = "CurvePath", this.curves = [], this.autoClose = !1;
  }
  /**
   * Adds a curve to this curve path.
   *
   * @param {Curve} curve - The curve to add.
   */
  add(t) {
    this.curves.push(t);
  }
  /**
   * Adds a line curve to close the path.
   *
   * @return {CurvePath} A reference to this curve path.
   */
  closePath() {
    const t = this.curves[0].getPoint(0), e = this.curves[this.curves.length - 1].getPoint(1);
    if (!t.equals(e)) {
      const n = t.isVector2 === !0 ? "LineCurve" : "LineCurve3";
      this.curves.push(new xo[n](e, t));
    }
    return this;
  }
  /**
   * This method returns a vector in 2D or 3D space (depending on the curve definitions)
   * for the given interpolation factor.
   *
   * @param {number} t - A interpolation factor representing a position on the curve. Must be in the range `[0,1]`.
   * @param {(Vector2|Vector3)} [optionalTarget] - The optional target vector the result is written to.
   * @return {?(Vector2|Vector3)} The position on the curve. It can be a 2D or 3D vector depending on the curve definition.
   */
  getPoint(t, e) {
    const n = t * this.getLength(), r = this.getCurveLengths();
    let s = 0;
    for (; s < r.length; ) {
      if (r[s] >= n) {
        const a = r[s] - n, o = this.curves[s], l = o.getLength(), c = l === 0 ? 0 : 1 - a / l;
        return o.getPointAt(c, e);
      }
      s++;
    }
    return null;
  }
  getLength() {
    const t = this.getCurveLengths();
    return t[t.length - 1];
  }
  updateArcLengths() {
    this.needsUpdate = !0, this.cacheLengths = null, this.getCurveLengths();
  }
  /**
   * Returns list of cumulative curve lengths of the defined curves.
   *
   * @return {Array<number>} The curve lengths.
   */
  getCurveLengths() {
    if (this.cacheLengths && this.cacheLengths.length === this.curves.length)
      return this.cacheLengths;
    const t = [];
    let e = 0;
    for (let n = 0, r = this.curves.length; n < r; n++)
      e += this.curves[n].getLength(), t.push(e);
    return this.cacheLengths = t, t;
  }
  getSpacedPoints(t = 40) {
    const e = [];
    for (let n = 0; n <= t; n++)
      e.push(this.getPoint(n / t));
    return this.autoClose && e.push(e[0]), e;
  }
  getPoints(t = 12) {
    const e = [];
    let n;
    for (let r = 0, s = this.curves; r < s.length; r++) {
      const a = s[r], o = a.isEllipseCurve ? t * 2 : a.isLineCurve || a.isLineCurve3 ? 1 : a.isSplineCurve ? t * a.points.length : t, l = a.getPoints(o);
      for (let c = 0; c < l.length; c++) {
        const h = l[c];
        n && n.equals(h) || (e.push(h), n = h);
      }
    }
    return this.autoClose && e.length > 1 && !e[e.length - 1].equals(e[0]) && e.push(e[0]), e;
  }
  copy(t) {
    super.copy(t), this.curves = [];
    for (let e = 0, n = t.curves.length; e < n; e++) {
      const r = t.curves[e];
      this.curves.push(r.clone());
    }
    return this.autoClose = t.autoClose, this;
  }
  toJSON() {
    const t = super.toJSON();
    t.autoClose = this.autoClose, t.curves = [];
    for (let e = 0, n = this.curves.length; e < n; e++) {
      const r = this.curves[e];
      t.curves.push(r.toJSON());
    }
    return t;
  }
  fromJSON(t) {
    super.fromJSON(t), this.autoClose = t.autoClose, this.curves = [];
    for (let e = 0, n = t.curves.length; e < n; e++) {
      const r = t.curves[e];
      this.curves.push(new xo[r.type]().fromJSON(r));
    }
    return this;
  }
}
class Mo extends tu {
  /**
   * Constructs a new path.
   *
   * @param {Array<Vector2>} [points] - An array of 2D points defining the path.
   */
  constructor(t) {
    super(), this.type = "Path", this.currentPoint = new mt(), t && this.setFromPoints(t);
  }
  /**
   * Creates a path from the given list of points. The points are added
   * to the path as instances of {@link LineCurve}.
   *
   * @param {Array<Vector2>} points - An array of 2D points.
   * @return {Path} A reference to this path.
   */
  setFromPoints(t) {
    this.moveTo(t[0].x, t[0].y);
    for (let e = 1, n = t.length; e < n; e++)
      this.lineTo(t[e].x, t[e].y);
    return this;
  }
  /**
   * Moves {@link Path#currentPoint} to the given point.
   *
   * @param {number} x - The x coordinate.
   * @param {number} y - The y coordinate.
   * @return {Path} A reference to this path.
   */
  moveTo(t, e) {
    return this.currentPoint.set(t, e), this;
  }
  /**
   * Adds an instance of {@link LineCurve} to the path by connecting
   * the current point with the given one.
   *
   * @param {number} x - The x coordinate of the end point.
   * @param {number} y - The y coordinate of the end point.
   * @return {Path} A reference to this path.
   */
  lineTo(t, e) {
    const n = new Vl(this.currentPoint.clone(), new mt(t, e));
    return this.curves.push(n), this.currentPoint.set(t, e), this;
  }
  /**
   * Adds an instance of {@link QuadraticBezierCurve} to the path by connecting
   * the current point with the given one.
   *
   * @param {number} aCPx - The x coordinate of the control point.
   * @param {number} aCPy - The y coordinate of the control point.
   * @param {number} aX - The x coordinate of the end point.
   * @param {number} aY - The y coordinate of the end point.
   * @return {Path} A reference to this path.
   */
  quadraticCurveTo(t, e, n, r) {
    const s = new Gl(
      this.currentPoint.clone(),
      new mt(t, e),
      new mt(n, r)
    );
    return this.curves.push(s), this.currentPoint.set(n, r), this;
  }
  /**
   * Adds an instance of {@link CubicBezierCurve} to the path by connecting
   * the current point with the given one.
   *
   * @param {number} aCP1x - The x coordinate of the first control point.
   * @param {number} aCP1y - The y coordinate of the first control point.
   * @param {number} aCP2x - The x coordinate of the second control point.
   * @param {number} aCP2y - The y coordinate of the second control point.
   * @param {number} aX - The x coordinate of the end point.
   * @param {number} aY - The y coordinate of the end point.
   * @return {Path} A reference to this path.
   */
  bezierCurveTo(t, e, n, r, s, a) {
    const o = new kl(
      this.currentPoint.clone(),
      new mt(t, e),
      new mt(n, r),
      new mt(s, a)
    );
    return this.curves.push(o), this.currentPoint.set(s, a), this;
  }
  /**
   * Adds an instance of {@link SplineCurve} to the path by connecting
   * the current point with the given list of points.
   *
   * @param {Array<Vector2>} pts - An array of points in 2D space.
   * @return {Path} A reference to this path.
   */
  splineThru(t) {
    const e = [this.currentPoint.clone()].concat(t), n = new Wl(e);
    return this.curves.push(n), this.currentPoint.copy(t[t.length - 1]), this;
  }
  /**
   * Adds an arc as an instance of {@link EllipseCurve} to the path, positioned relative
   * to the current point.
   *
   * @param {number} aX - The x coordinate of the center of the arc offsetted from the previous curve.
   * @param {number} aY - The y coordinate of the center of the arc offsetted from the previous curve.
   * @param {number} aRadius - The radius of the arc.
   * @param {number} aStartAngle - The start angle in radians.
   * @param {number} aEndAngle - The end angle in radians.
   * @param {boolean} [aClockwise=false] - Whether to sweep the arc clockwise or not.
   * @return {Path} A reference to this path.
   */
  arc(t, e, n, r, s, a) {
    const o = this.currentPoint.x, l = this.currentPoint.y;
    return this.absarc(
      t + o,
      e + l,
      n,
      r,
      s,
      a
    ), this;
  }
  /**
   * Adds an absolutely positioned arc as an instance of {@link EllipseCurve} to the path.
   *
   * @param {number} aX - The x coordinate of the center of the arc.
   * @param {number} aY - The y coordinate of the center of the arc.
   * @param {number} aRadius - The radius of the arc.
   * @param {number} aStartAngle - The start angle in radians.
   * @param {number} aEndAngle - The end angle in radians.
   * @param {boolean} [aClockwise=false] - Whether to sweep the arc clockwise or not.
   * @return {Path} A reference to this path.
   */
  absarc(t, e, n, r, s, a) {
    return this.absellipse(t, e, n, n, r, s, a), this;
  }
  /**
   * Adds an ellipse as an instance of {@link EllipseCurve} to the path, positioned relative
   * to the current point
   *
   * @param {number} aX - The x coordinate of the center of the ellipse offsetted from the previous curve.
   * @param {number} aY - The y coordinate of the center of the ellipse offsetted from the previous curve.
   * @param {number} xRadius - The radius of the ellipse in the x axis.
   * @param {number} yRadius - The radius of the ellipse in the y axis.
   * @param {number} aStartAngle - The start angle in radians.
   * @param {number} aEndAngle - The end angle in radians.
   * @param {boolean} [aClockwise=false] - Whether to sweep the ellipse clockwise or not.
   * @param {number} [aRotation=0] - The rotation angle of the ellipse in radians, counterclockwise from the positive X axis.
   * @return {Path} A reference to this path.
   */
  ellipse(t, e, n, r, s, a, o, l) {
    const c = this.currentPoint.x, h = this.currentPoint.y;
    return this.absellipse(t + c, e + h, n, r, s, a, o, l), this;
  }
  /**
   * Adds an absolutely positioned ellipse as an instance of {@link EllipseCurve} to the path.
   *
   * @param {number} aX - The x coordinate of the absolute center of the ellipse.
   * @param {number} aY - The y coordinate of the absolute center of the ellipse.
   * @param {number} xRadius - The radius of the ellipse in the x axis.
   * @param {number} yRadius - The radius of the ellipse in the y axis.
   * @param {number} aStartAngle - The start angle in radians.
   * @param {number} aEndAngle - The end angle in radians.
   * @param {boolean} [aClockwise=false] - Whether to sweep the ellipse clockwise or not.
   * @param {number} [aRotation=0] - The rotation angle of the ellipse in radians, counterclockwise from the positive X axis.
   * @return {Path} A reference to this path.
   */
  absellipse(t, e, n, r, s, a, o, l) {
    const c = new La(t, e, n, r, s, a, o, l);
    if (this.curves.length > 0) {
      const u = c.getPoint(0);
      u.equals(this.currentPoint) || this.lineTo(u.x, u.y);
    }
    this.curves.push(c);
    const h = c.getPoint(1);
    return this.currentPoint.copy(h), this;
  }
  copy(t) {
    return super.copy(t), this.currentPoint.copy(t.currentPoint), this;
  }
  toJSON() {
    const t = super.toJSON();
    return t.currentPoint = this.currentPoint.toArray(), t;
  }
  fromJSON(t) {
    return super.fromJSON(t), this.currentPoint.fromArray(t.currentPoint), this;
  }
}
class Xl extends Mo {
  /**
   * Constructs a new shape.
   *
   * @param {Array<Vector2>} [points] - An array of 2D points defining the shape.
   */
  constructor(t) {
    super(t), this.uuid = Ti(), this.type = "Shape", this.holes = [];
  }
  /**
   * Returns an array representing each contour of the holes
   * as a list of 2D points.
   *
   * @param {number} divisions - The fineness of the result.
   * @return {Array<Array<Vector2>>} The holes as a series of 2D points.
   */
  getPointsHoles(t) {
    const e = [];
    for (let n = 0, r = this.holes.length; n < r; n++)
      e[n] = this.holes[n].getPoints(t);
    return e;
  }
  // get points of shape and holes (keypoints based on segments parameter)
  /**
   * Returns an object that holds contour data for the shape and its holes as
   * arrays of 2D points.
   *
   * @param {number} divisions - The fineness of the result.
   * @return {{shape:Array<Vector2>,holes:Array<Array<Vector2>>}} An object with contour data.
   */
  extractPoints(t) {
    return {
      shape: this.getPoints(t),
      holes: this.getPointsHoles(t)
    };
  }
  copy(t) {
    super.copy(t), this.holes = [];
    for (let e = 0, n = t.holes.length; e < n; e++) {
      const r = t.holes[e];
      this.holes.push(r.clone());
    }
    return this;
  }
  toJSON() {
    const t = super.toJSON();
    t.uuid = this.uuid, t.holes = [];
    for (let e = 0, n = this.holes.length; e < n; e++) {
      const r = this.holes[e];
      t.holes.push(r.toJSON());
    }
    return t;
  }
  fromJSON(t) {
    super.fromJSON(t), this.uuid = t.uuid, this.holes = [];
    for (let e = 0, n = t.holes.length; e < n; e++) {
      const r = t.holes[e];
      this.holes.push(new Mo().fromJSON(r));
    }
    return this;
  }
}
function eu(i, t, e = 2) {
  const n = t && t.length, r = n ? t[0] * e : i.length;
  let s = ql(i, 0, r, e, !0);
  const a = [];
  if (!s || s.next === s.prev) return a;
  let o, l, c;
  if (n && (s = au(i, t, s, e)), i.length > 80 * e) {
    o = 1 / 0, l = 1 / 0;
    let h = -1 / 0, u = -1 / 0;
    for (let f = e; f < r; f += e) {
      const d = i[f], g = i[f + 1];
      d < o && (o = d), g < l && (l = g), d > h && (h = d), g > u && (u = g);
    }
    c = Math.max(h - o, u - l), c = c !== 0 ? 32767 / c : 0;
  }
  return Zi(s, a, e, o, l, c, 0), a;
}
function ql(i, t, e, n, r) {
  let s;
  if (r === _u(i, t, e, n) > 0)
    for (let a = t; a < e; a += n) s = So(a / n | 0, i[a], i[a + 1], s);
  else
    for (let a = e - n; a >= t; a -= n) s = So(a / n | 0, i[a], i[a + 1], s);
  return s && yi(s, s.next) && (Ki(s), s = s.next), s;
}
function $n(i, t) {
  if (!i) return i;
  t || (t = i);
  let e = i, n;
  do
    if (n = !1, !e.steiner && (yi(e, e.next) || ne(e.prev, e, e.next) === 0)) {
      if (Ki(e), e = t = e.prev, e === e.next) break;
      n = !0;
    } else
      e = e.next;
  while (n || e !== t);
  return t;
}
function Zi(i, t, e, n, r, s, a) {
  if (!i) return;
  !a && s && uu(i, n, r, s);
  let o = i;
  for (; i.prev !== i.next; ) {
    const l = i.prev, c = i.next;
    if (s ? iu(i, n, r, s) : nu(i)) {
      t.push(l.i, i.i, c.i), Ki(i), i = c.next, o = c.next;
      continue;
    }
    if (i = c, i === o) {
      a ? a === 1 ? (i = ru($n(i), t), Zi(i, t, e, n, r, s, 2)) : a === 2 && su(i, t, e, n, r, s) : Zi($n(i), t, e, n, r, s, 1);
      break;
    }
  }
}
function nu(i) {
  const t = i.prev, e = i, n = i.next;
  if (ne(t, e, n) >= 0) return !1;
  const r = t.x, s = e.x, a = n.x, o = t.y, l = e.y, c = n.y, h = Math.min(r, s, a), u = Math.min(o, l, c), f = Math.max(r, s, a), d = Math.max(o, l, c);
  let g = n.next;
  for (; g !== t; ) {
    if (g.x >= h && g.x <= f && g.y >= u && g.y <= d && Bi(r, o, s, l, a, c, g.x, g.y) && ne(g.prev, g, g.next) >= 0) return !1;
    g = g.next;
  }
  return !0;
}
function iu(i, t, e, n) {
  const r = i.prev, s = i, a = i.next;
  if (ne(r, s, a) >= 0) return !1;
  const o = r.x, l = s.x, c = a.x, h = r.y, u = s.y, f = a.y, d = Math.min(o, l, c), g = Math.min(h, u, f), v = Math.max(o, l, c), m = Math.max(h, u, f), p = _a(d, g, t, e, n), A = _a(v, m, t, e, n);
  let T = i.prevZ, S = i.nextZ;
  for (; T && T.z >= p && S && S.z <= A; ) {
    if (T.x >= d && T.x <= v && T.y >= g && T.y <= m && T !== r && T !== a && Bi(o, h, l, u, c, f, T.x, T.y) && ne(T.prev, T, T.next) >= 0 || (T = T.prevZ, S.x >= d && S.x <= v && S.y >= g && S.y <= m && S !== r && S !== a && Bi(o, h, l, u, c, f, S.x, S.y) && ne(S.prev, S, S.next) >= 0)) return !1;
    S = S.nextZ;
  }
  for (; T && T.z >= p; ) {
    if (T.x >= d && T.x <= v && T.y >= g && T.y <= m && T !== r && T !== a && Bi(o, h, l, u, c, f, T.x, T.y) && ne(T.prev, T, T.next) >= 0) return !1;
    T = T.prevZ;
  }
  for (; S && S.z <= A; ) {
    if (S.x >= d && S.x <= v && S.y >= g && S.y <= m && S !== r && S !== a && Bi(o, h, l, u, c, f, S.x, S.y) && ne(S.prev, S, S.next) >= 0) return !1;
    S = S.nextZ;
  }
  return !0;
}
function ru(i, t) {
  let e = i;
  do {
    const n = e.prev, r = e.next.next;
    !yi(n, r) && $l(n, e, e.next, r) && Ji(n, r) && Ji(r, n) && (t.push(n.i, e.i, r.i), Ki(e), Ki(e.next), e = i = r), e = e.next;
  } while (e !== i);
  return $n(e);
}
function su(i, t, e, n, r, s) {
  let a = i;
  do {
    let o = a.next.next;
    for (; o !== a.prev; ) {
      if (a.i !== o.i && pu(a, o)) {
        let l = Zl(a, o);
        a = $n(a, a.next), l = $n(l, l.next), Zi(a, t, e, n, r, s, 0), Zi(l, t, e, n, r, s, 0);
        return;
      }
      o = o.next;
    }
    a = a.next;
  } while (a !== i);
}
function au(i, t, e, n) {
  const r = [];
  for (let s = 0, a = t.length; s < a; s++) {
    const o = t[s] * n, l = s < a - 1 ? t[s + 1] * n : i.length, c = ql(i, o, l, n, !1);
    c === c.next && (c.steiner = !0), r.push(fu(c));
  }
  r.sort(ou);
  for (let s = 0; s < r.length; s++)
    e = lu(r[s], e);
  return e;
}
function ou(i, t) {
  let e = i.x - t.x;
  if (e === 0 && (e = i.y - t.y, e === 0)) {
    const n = (i.next.y - i.y) / (i.next.x - i.x), r = (t.next.y - t.y) / (t.next.x - t.x);
    e = n - r;
  }
  return e;
}
function lu(i, t) {
  const e = cu(i, t);
  if (!e)
    return t;
  const n = Zl(e, i);
  return $n(n, n.next), $n(e, e.next);
}
function cu(i, t) {
  let e = t;
  const n = i.x, r = i.y;
  let s = -1 / 0, a;
  if (yi(i, e)) return e;
  do {
    if (yi(i, e.next)) return e.next;
    if (r <= e.y && r >= e.next.y && e.next.y !== e.y) {
      const u = e.x + (r - e.y) * (e.next.x - e.x) / (e.next.y - e.y);
      if (u <= n && u > s && (s = u, a = e.x < e.next.x ? e : e.next, u === n))
        return a;
    }
    e = e.next;
  } while (e !== t);
  if (!a) return null;
  const o = a, l = a.x, c = a.y;
  let h = 1 / 0;
  e = a;
  do {
    if (n >= e.x && e.x >= l && n !== e.x && Yl(r < c ? n : s, r, l, c, r < c ? s : n, r, e.x, e.y)) {
      const u = Math.abs(r - e.y) / (n - e.x);
      Ji(e, i) && (u < h || u === h && (e.x > a.x || e.x === a.x && hu(a, e))) && (a = e, h = u);
    }
    e = e.next;
  } while (e !== o);
  return a;
}
function hu(i, t) {
  return ne(i.prev, i, t.prev) < 0 && ne(t.next, i, i.next) < 0;
}
function uu(i, t, e, n) {
  let r = i;
  do
    r.z === 0 && (r.z = _a(r.x, r.y, t, e, n)), r.prevZ = r.prev, r.nextZ = r.next, r = r.next;
  while (r !== i);
  r.prevZ.nextZ = null, r.prevZ = null, du(r);
}
function du(i) {
  let t, e = 1;
  do {
    let n = i, r;
    i = null;
    let s = null;
    for (t = 0; n; ) {
      t++;
      let a = n, o = 0;
      for (let c = 0; c < e && (o++, a = a.nextZ, !!a); c++)
        ;
      let l = e;
      for (; o > 0 || l > 0 && a; )
        o !== 0 && (l === 0 || !a || n.z <= a.z) ? (r = n, n = n.nextZ, o--) : (r = a, a = a.nextZ, l--), s ? s.nextZ = r : i = r, r.prevZ = s, s = r;
      n = a;
    }
    s.nextZ = null, e *= 2;
  } while (t > 1);
  return i;
}
function _a(i, t, e, n, r) {
  return i = (i - e) * r | 0, t = (t - n) * r | 0, i = (i | i << 8) & 16711935, i = (i | i << 4) & 252645135, i = (i | i << 2) & 858993459, i = (i | i << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, i | t << 1;
}
function fu(i) {
  let t = i, e = i;
  do
    (t.x < e.x || t.x === e.x && t.y < e.y) && (e = t), t = t.next;
  while (t !== i);
  return e;
}
function Yl(i, t, e, n, r, s, a, o) {
  return (r - a) * (t - o) >= (i - a) * (s - o) && (i - a) * (n - o) >= (e - a) * (t - o) && (e - a) * (s - o) >= (r - a) * (n - o);
}
function Bi(i, t, e, n, r, s, a, o) {
  return !(i === a && t === o) && Yl(i, t, e, n, r, s, a, o);
}
function pu(i, t) {
  return i.next.i !== t.i && i.prev.i !== t.i && !mu(i, t) && // dones't intersect other edges
  (Ji(i, t) && Ji(t, i) && gu(i, t) && // locally visible
  (ne(i.prev, i, t.prev) || ne(i, t.prev, t)) || // does not create opposite-facing sectors
  yi(i, t) && ne(i.prev, i, i.next) > 0 && ne(t.prev, t, t.next) > 0);
}
function ne(i, t, e) {
  return (t.y - i.y) * (e.x - t.x) - (t.x - i.x) * (e.y - t.y);
}
function yi(i, t) {
  return i.x === t.x && i.y === t.y;
}
function $l(i, t, e, n) {
  const r = br(ne(i, t, e)), s = br(ne(i, t, n)), a = br(ne(e, n, i)), o = br(ne(e, n, t));
  return !!(r !== s && a !== o || r === 0 && Ar(i, e, t) || s === 0 && Ar(i, n, t) || a === 0 && Ar(e, i, n) || o === 0 && Ar(e, t, n));
}
function Ar(i, t, e) {
  return t.x <= Math.max(i.x, e.x) && t.x >= Math.min(i.x, e.x) && t.y <= Math.max(i.y, e.y) && t.y >= Math.min(i.y, e.y);
}
function br(i) {
  return i > 0 ? 1 : i < 0 ? -1 : 0;
}
function mu(i, t) {
  let e = i;
  do {
    if (e.i !== i.i && e.next.i !== i.i && e.i !== t.i && e.next.i !== t.i && $l(e, e.next, i, t)) return !0;
    e = e.next;
  } while (e !== i);
  return !1;
}
function Ji(i, t) {
  return ne(i.prev, i, i.next) < 0 ? ne(i, t, i.next) >= 0 && ne(i, i.prev, t) >= 0 : ne(i, t, i.prev) < 0 || ne(i, i.next, t) < 0;
}
function gu(i, t) {
  let e = i, n = !1;
  const r = (i.x + t.x) / 2, s = (i.y + t.y) / 2;
  do
    e.y > s != e.next.y > s && e.next.y !== e.y && r < (e.next.x - e.x) * (s - e.y) / (e.next.y - e.y) + e.x && (n = !n), e = e.next;
  while (e !== i);
  return n;
}
function Zl(i, t) {
  const e = va(i.i, i.x, i.y), n = va(t.i, t.x, t.y), r = i.next, s = t.prev;
  return i.next = t, t.prev = i, e.next = r, r.prev = e, n.next = e, e.prev = n, s.next = n, n.prev = s, n;
}
function So(i, t, e, n) {
  const r = va(i, t, e);
  return n ? (r.next = n.next, r.prev = n, n.next.prev = r, n.next = r) : (r.prev = r, r.next = r), r;
}
function Ki(i) {
  i.next.prev = i.prev, i.prev.next = i.next, i.prevZ && (i.prevZ.nextZ = i.nextZ), i.nextZ && (i.nextZ.prevZ = i.prevZ);
}
function va(i, t, e) {
  return {
    i,
    // vertex index in coordinates array
    x: t,
    y: e,
    // vertex coordinates
    prev: null,
    // previous and next vertex nodes in a polygon ring
    next: null,
    z: 0,
    // z-order curve value
    prevZ: null,
    // previous and next nodes in z-order
    nextZ: null,
    steiner: !1
    // indicates whether this is a steiner point
  };
}
function _u(i, t, e, n) {
  let r = 0;
  for (let s = t, a = e - n; s < e; s += n)
    r += (i[a] - i[s]) * (i[s + 1] + i[a + 1]), a = s;
  return r;
}
class vu {
  /**
   * Triangulates the given shape definition by returning an array of triangles.
   *
   * @param {Array<number>} data - An array with 2D points.
   * @param {Array<number>} holeIndices - An array with indices defining holes.
   * @param {number} [dim=2] - The number of coordinates per vertex in the input array.
   * @return {Array<number>} An array representing the triangulated faces. Each face is defined by three consecutive numbers
   * representing vertex indices.
   */
  static triangulate(t, e, n = 2) {
    return eu(t, e, n);
  }
}
class Vi {
  /**
   * Calculate area of a ( 2D ) contour polygon.
   *
   * @param {Array<Vector2>} contour - An array of 2D points.
   * @return {number} The area.
   */
  static area(t) {
    const e = t.length;
    let n = 0;
    for (let r = e - 1, s = 0; s < e; r = s++)
      n += t[r].x * t[s].y - t[s].x * t[r].y;
    return n * 0.5;
  }
  /**
   * Returns `true` if the given contour uses a clockwise winding order.
   *
   * @param {Array<Vector2>} pts - An array of 2D points defining a polygon.
   * @return {boolean} Whether the given contour uses a clockwise winding order or not.
   */
  static isClockWise(t) {
    return Vi.area(t) < 0;
  }
  /**
   * Triangulates the given shape definition.
   *
   * @param {Array<Vector2>} contour - An array of 2D points defining the contour.
   * @param {Array<Array<Vector2>>} holes - An array that holds arrays of 2D points defining the holes.
   * @return {Array<Array<number>>} An array that holds for each face definition an array with three indices.
   */
  static triangulateShape(t, e) {
    const n = [], r = [], s = [];
    yo(t), Eo(n, t);
    let a = t.length;
    e.forEach(yo);
    for (let l = 0; l < e.length; l++)
      r.push(a), a += e[l].length, Eo(n, e[l]);
    const o = vu.triangulate(n, r);
    for (let l = 0; l < o.length; l += 3)
      s.push(o.slice(l, l + 3));
    return s;
  }
}
function yo(i) {
  const t = i.length;
  t > 2 && i[t - 1].equals(i[0]) && i.pop();
}
function Eo(i, t) {
  for (let e = 0; e < t.length; e++)
    i.push(t[e].x), i.push(t[e].y);
}
class Je extends vn {
  /**
   * Constructs a new plane geometry.
   *
   * @param {number} [width=1] - The width along the X axis.
   * @param {number} [height=1] - The height along the Y axis
   * @param {number} [widthSegments=1] - The number of segments along the X axis.
   * @param {number} [heightSegments=1] - The number of segments along the Y axis.
   */
  constructor(t = 1, e = 1, n = 1, r = 1) {
    super(), this.type = "PlaneGeometry", this.parameters = {
      width: t,
      height: e,
      widthSegments: n,
      heightSegments: r
    };
    const s = t / 2, a = e / 2, o = Math.floor(n), l = Math.floor(r), c = o + 1, h = l + 1, u = t / o, f = e / l, d = [], g = [], v = [], m = [];
    for (let p = 0; p < h; p++) {
      const A = p * f - a;
      for (let T = 0; T < c; T++) {
        const S = T * u - s;
        g.push(S, -A, 0), v.push(0, 0, 1), m.push(T / o), m.push(1 - p / l);
      }
    }
    for (let p = 0; p < l; p++)
      for (let A = 0; A < o; A++) {
        const T = A + c * p, S = A + c * (p + 1), N = A + 1 + c * (p + 1), w = A + 1 + c * p;
        d.push(T, S, w), d.push(S, N, w);
      }
    this.setIndex(d), this.setAttribute("position", new Ne(g, 3)), this.setAttribute("normal", new Ne(v, 3)), this.setAttribute("uv", new Ne(m, 2));
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  /**
   * Factory method for creating an instance of this class from the given
   * JSON object.
   *
   * @param {Object} data - A JSON object representing the serialized geometry.
   * @return {PlaneGeometry} A new instance.
   */
  static fromJSON(t) {
    return new Je(t.width, t.height, t.widthSegments, t.heightSegments);
  }
}
class Ia extends vn {
  /**
   * Constructs a new shape geometry.
   *
   * @param {Shape|Array<Shape>} [shapes] - A shape or an array of shapes.
   * @param {number} [curveSegments=12] - Number of segments per shape.
   */
  constructor(t = new Xl([new mt(0, 0.5), new mt(-0.5, -0.5), new mt(0.5, -0.5)]), e = 12) {
    super(), this.type = "ShapeGeometry", this.parameters = {
      shapes: t,
      curveSegments: e
    };
    const n = [], r = [], s = [], a = [];
    let o = 0, l = 0;
    if (Array.isArray(t) === !1)
      c(t);
    else
      for (let h = 0; h < t.length; h++)
        c(t[h]), this.addGroup(o, l, h), o += l, l = 0;
    this.setIndex(n), this.setAttribute("position", new Ne(r, 3)), this.setAttribute("normal", new Ne(s, 3)), this.setAttribute("uv", new Ne(a, 2));
    function c(h) {
      const u = r.length / 3, f = h.extractPoints(e);
      let d = f.shape;
      const g = f.holes;
      Vi.isClockWise(d) === !1 && (d = d.reverse());
      for (let m = 0, p = g.length; m < p; m++) {
        const A = g[m];
        Vi.isClockWise(A) === !0 && (g[m] = A.reverse());
      }
      const v = Vi.triangulateShape(d, g);
      for (let m = 0, p = g.length; m < p; m++) {
        const A = g[m];
        d = d.concat(A);
      }
      for (let m = 0, p = d.length; m < p; m++) {
        const A = d[m];
        r.push(A.x, A.y, 0), s.push(0, 0, 1), a.push(A.x, A.y);
      }
      for (let m = 0, p = v.length; m < p; m++) {
        const A = v[m], T = A[0] + u, S = A[1] + u, N = A[2] + u;
        n.push(T, S, N), l += 3;
      }
    }
  }
  copy(t) {
    return super.copy(t), this.parameters = Object.assign({}, t.parameters), this;
  }
  toJSON() {
    const t = super.toJSON(), e = this.parameters.shapes;
    return xu(e, t);
  }
  /**
   * Factory method for creating an instance of this class from the given
   * JSON object.
   *
   * @param {Object} data - A JSON object representing the serialized geometry.
   * @param {Array<Shape>} shapes - An array of shapes.
   * @return {ShapeGeometry} A new instance.
   */
  static fromJSON(t, e) {
    const n = [];
    for (let r = 0, s = t.shapes.length; r < s; r++) {
      const a = e[t.shapes[r]];
      n.push(a);
    }
    return new Ia(n, t.curveSegments);
  }
}
function xu(i, t) {
  if (t.shapes = [], Array.isArray(i))
    for (let e = 0, n = i.length; e < n; e++) {
      const r = i[e];
      t.shapes.push(r.uuid);
    }
  else
    t.shapes.push(i.uuid);
  return t;
}
class Wn extends tr {
  /**
   * Constructs a new mesh standard material.
   *
   * @param {Object} [parameters] - An object with one or more properties
   * defining the material's appearance. Any property of the material
   * (including any property from inherited materials) can be passed
   * in here. Color values can be passed any type of value accepted
   * by {@link Color#set}.
   */
  constructor(t) {
    super(), this.isMeshStandardMaterial = !0, this.type = "MeshStandardMaterial", this.defines = { STANDARD: "" }, this.color = new Ft(16777215), this.roughness = 1, this.metalness = 0, this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new Ft(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = Rl, this.normalScale = new mt(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.roughnessMap = null, this.metalnessMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new rn(), this.envMapIntensity = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = !1, this.fog = !0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.defines = { STANDARD: "" }, this.color.copy(t.color), this.roughness = t.roughness, this.metalness = t.metalness, this.map = t.map, this.lightMap = t.lightMap, this.lightMapIntensity = t.lightMapIntensity, this.aoMap = t.aoMap, this.aoMapIntensity = t.aoMapIntensity, this.emissive.copy(t.emissive), this.emissiveMap = t.emissiveMap, this.emissiveIntensity = t.emissiveIntensity, this.bumpMap = t.bumpMap, this.bumpScale = t.bumpScale, this.normalMap = t.normalMap, this.normalMapType = t.normalMapType, this.normalScale.copy(t.normalScale), this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.roughnessMap = t.roughnessMap, this.metalnessMap = t.metalnessMap, this.alphaMap = t.alphaMap, this.envMap = t.envMap, this.envMapRotation.copy(t.envMapRotation), this.envMapIntensity = t.envMapIntensity, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.wireframeLinecap = t.wireframeLinecap, this.wireframeLinejoin = t.wireframeLinejoin, this.flatShading = t.flatShading, this.fog = t.fog, this;
  }
}
class Mu extends tr {
  /**
   * Constructs a new mesh depth material.
   *
   * @param {Object} [parameters] - An object with one or more properties
   * defining the material's appearance. Any property of the material
   * (including any property from inherited materials) can be passed
   * in here. Color values can be passed any type of value accepted
   * by {@link Color#set}.
   */
  constructor(t) {
    super(), this.isMeshDepthMaterial = !0, this.type = "MeshDepthMaterial", this.depthPacking = Kc, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = !1, this.wireframeLinewidth = 1, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.depthPacking = t.depthPacking, this.map = t.map, this.alphaMap = t.alphaMap, this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this;
  }
}
class Su extends tr {
  /**
   * Constructs a new mesh distance material.
   *
   * @param {Object} [parameters] - An object with one or more properties
   * defining the material's appearance. Any property of the material
   * (including any property from inherited materials) can be passed
   * in here. Color values can be passed any type of value accepted
   * by {@link Color#set}.
   */
  constructor(t) {
    super(), this.isMeshDistanceMaterial = !0, this.type = "MeshDistanceMaterial", this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(t);
  }
  copy(t) {
    return super.copy(t), this.map = t.map, this.alphaMap = t.alphaMap, this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this;
  }
}
const To = {
  /**
   * Whether caching is enabled or not.
   *
   * @static
   * @type {boolean}
   * @default false
   */
  enabled: !1,
  /**
   * A dictionary that holds cached files.
   *
   * @static
   * @type {Object<string,Object>}
   */
  files: {},
  /**
   * Adds a cache entry with a key to reference the file. If this key already
   * holds a file, it is overwritten.
   *
   * @static
   * @param {string} key - The key to reference the cached file.
   * @param {Object} file -  The file to be cached.
   */
  add: function(i, t) {
    this.enabled !== !1 && (this.files[i] = t);
  },
  /**
   * Gets the cached value for the given key.
   *
   * @static
   * @param {string} key - The key to reference the cached file.
   * @return {Object|undefined} The cached file. If the key does not exist `undefined` is returned.
   */
  get: function(i) {
    if (this.enabled !== !1)
      return this.files[i];
  },
  /**
   * Removes the cached file associated with the given key.
   *
   * @static
   * @param {string} key - The key to reference the cached file.
   */
  remove: function(i) {
    delete this.files[i];
  },
  /**
   * Remove all values from the cache.
   *
   * @static
   */
  clear: function() {
    this.files = {};
  }
};
class yu {
  /**
   * Constructs a new loading manager.
   *
   * @param {Function} [onLoad] - Executes when all items have been loaded.
   * @param {Function} [onProgress] - Executes when single items have been loaded.
   * @param {Function} [onError] - Executes when an error occurs.
   */
  constructor(t, e, n) {
    const r = this;
    let s = !1, a = 0, o = 0, l;
    const c = [];
    this.onStart = void 0, this.onLoad = t, this.onProgress = e, this.onError = n, this.itemStart = function(h) {
      o++, s === !1 && r.onStart !== void 0 && r.onStart(h, a, o), s = !0;
    }, this.itemEnd = function(h) {
      a++, r.onProgress !== void 0 && r.onProgress(h, a, o), a === o && (s = !1, r.onLoad !== void 0 && r.onLoad());
    }, this.itemError = function(h) {
      r.onError !== void 0 && r.onError(h);
    }, this.resolveURL = function(h) {
      return l ? l(h) : h;
    }, this.setURLModifier = function(h) {
      return l = h, this;
    }, this.addHandler = function(h, u) {
      return c.push(h, u), this;
    }, this.removeHandler = function(h) {
      const u = c.indexOf(h);
      return u !== -1 && c.splice(u, 2), this;
    }, this.getHandler = function(h) {
      for (let u = 0, f = c.length; u < f; u += 2) {
        const d = c[u], g = c[u + 1];
        if (d.global && (d.lastIndex = 0), d.test(h))
          return g;
      }
      return null;
    };
  }
}
const Eu = /* @__PURE__ */ new yu();
class Ua {
  /**
   * Constructs a new loader.
   *
   * @param {LoadingManager} [manager] - The loading manager.
   */
  constructor(t) {
    this.manager = t !== void 0 ? t : Eu, this.crossOrigin = "anonymous", this.withCredentials = !1, this.path = "", this.resourcePath = "", this.requestHeader = {};
  }
  /**
   * This method needs to be implemented by all concrete loaders. It holds the
   * logic for loading assets from the backend.
   *
   * @param {string} url - The path/URL of the file to be loaded.
   * @param {Function} onLoad - Executed when the loading process has been finished.
   * @param {onProgressCallback} [onProgress] - Executed while the loading is in progress.
   * @param {onErrorCallback} [onError] - Executed when errors occur.
   */
  load() {
  }
  /**
   * A async version of {@link Loader#load}.
   *
   * @param {string} url - The path/URL of the file to be loaded.
   * @param {onProgressCallback} [onProgress] - Executed while the loading is in progress.
   * @return {Promise} A Promise that resolves when the asset has been loaded.
   */
  loadAsync(t, e) {
    const n = this;
    return new Promise(function(r, s) {
      n.load(t, r, e, s);
    });
  }
  /**
   * This method needs to be implemented by all concrete loaders. It holds the
   * logic for parsing the asset into three.js entities.
   *
   * @param {any} data - The data to parse.
   */
  parse() {
  }
  /**
   * Sets the `crossOrigin` String to implement CORS for loading the URL
   * from a different domain that allows CORS.
   *
   * @param {string} crossOrigin - The `crossOrigin` value.
   * @return {Loader} A reference to this instance.
   */
  setCrossOrigin(t) {
    return this.crossOrigin = t, this;
  }
  /**
   * Whether the XMLHttpRequest uses credentials such as cookies, authorization
   * headers or TLS client certificates, see [XMLHttpRequest.withCredentials]{@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials}.
   *
   * Note: This setting has no effect if you are loading files locally or from the same domain.
   *
   * @param {boolean} value - The `withCredentials` value.
   * @return {Loader} A reference to this instance.
   */
  setWithCredentials(t) {
    return this.withCredentials = t, this;
  }
  /**
   * Sets the base path for the asset.
   *
   * @param {string} path - The base path.
   * @return {Loader} A reference to this instance.
   */
  setPath(t) {
    return this.path = t, this;
  }
  /**
   * Sets the base path for dependent resources like textures.
   *
   * @param {string} resourcePath - The resource path.
   * @return {Loader} A reference to this instance.
   */
  setResourcePath(t) {
    return this.resourcePath = t, this;
  }
  /**
   * Sets the given request header.
   *
   * @param {Object} requestHeader - A [request header]{@link https://developer.mozilla.org/en-US/docs/Glossary/Request_header}
   * for configuring the HTTP request.
   * @return {Loader} A reference to this instance.
   */
  setRequestHeader(t) {
    return this.requestHeader = t, this;
  }
}
Ua.DEFAULT_MATERIAL_NAME = "__DEFAULT";
class Tu extends Ua {
  /**
   * Constructs a new image loader.
   *
   * @param {LoadingManager} [manager] - The loading manager.
   */
  constructor(t) {
    super(t);
  }
  /**
   * Starts loading from the given URL and passes the loaded image
   * to the `onLoad()` callback. The method also returns a new `Image` object which can
   * directly be used for texture creation. If you do it this way, the texture
   * may pop up in your scene once the respective loading process is finished.
   *
   * @param {string} url - The path/URL of the file to be loaded. This can also be a data URI.
   * @param {function(Image)} onLoad - Executed when the loading process has been finished.
   * @param {onProgressCallback} onProgress - Unsupported in this loader.
   * @param {onErrorCallback} onError - Executed when errors occur.
   * @return {Image} The image.
   */
  load(t, e, n, r) {
    this.path !== void 0 && (t = this.path + t), t = this.manager.resolveURL(t);
    const s = this, a = To.get(t);
    if (a !== void 0)
      return s.manager.itemStart(t), setTimeout(function() {
        e && e(a), s.manager.itemEnd(t);
      }, 0), a;
    const o = $i("img");
    function l() {
      h(), To.add(t, this), e && e(this), s.manager.itemEnd(t);
    }
    function c(u) {
      h(), r && r(u), s.manager.itemError(t), s.manager.itemEnd(t);
    }
    function h() {
      o.removeEventListener("load", l, !1), o.removeEventListener("error", c, !1);
    }
    return o.addEventListener("load", l, !1), o.addEventListener("error", c, !1), t.slice(0, 5) !== "data:" && this.crossOrigin !== void 0 && (o.crossOrigin = this.crossOrigin), s.manager.itemStart(t), o.src = t, o;
  }
}
class Jl extends Ua {
  /**
   * Constructs a new texture loader.
   *
   * @param {LoadingManager} [manager] - The loading manager.
   */
  constructor(t) {
    super(t);
  }
  /**
   * Starts loading from the given URL and pass the fully loaded texture
   * to the `onLoad()` callback. The method also returns a new texture object which can
   * directly be used for material creation. If you do it this way, the texture
   * may pop up in your scene once the respective loading process is finished.
   *
   * @param {string} url - The path/URL of the file to be loaded. This can also be a data URI.
   * @param {function(Texture)} onLoad - Executed when the loading process has been finished.
   * @param {onProgressCallback} onProgress - Unsupported in this loader.
   * @param {onErrorCallback} onError - Executed when errors occur.
   * @return {Texture} The texture.
   */
  load(t, e, n, r) {
    const s = new ge(), a = new Tu(this.manager);
    return a.setCrossOrigin(this.crossOrigin), a.setPath(this.path), a.load(t, function(o) {
      s.image = o, s.needsUpdate = !0, e !== void 0 && e(s);
    }, n, r), s;
  }
}
class Na extends _e {
  /**
   * Constructs a new light.
   *
   * @param {(number|Color|string)} [color=0xffffff] - The light's color.
   * @param {number} [intensity=1] - The light's strength/intensity.
   */
  constructor(t, e = 1) {
    super(), this.isLight = !0, this.type = "Light", this.color = new Ft(t), this.intensity = e;
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever this instance is no longer used in your app.
   */
  dispose() {
  }
  copy(t, e) {
    return super.copy(t, e), this.color.copy(t.color), this.intensity = t.intensity, this;
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return e.object.color = this.color.getHex(), e.object.intensity = this.intensity, this.groundColor !== void 0 && (e.object.groundColor = this.groundColor.getHex()), this.distance !== void 0 && (e.object.distance = this.distance), this.angle !== void 0 && (e.object.angle = this.angle), this.decay !== void 0 && (e.object.decay = this.decay), this.penumbra !== void 0 && (e.object.penumbra = this.penumbra), this.shadow !== void 0 && (e.object.shadow = this.shadow.toJSON()), this.target !== void 0 && (e.object.target = this.target.uuid), e;
  }
}
class Au extends Na {
  /**
   * Constructs a new hemisphere light.
   *
   * @param {(number|Color|string)} [skyColor=0xffffff] - The light's sky color.
   * @param {(number|Color|string)} [groundColor=0xffffff] - The light's ground color.
   * @param {number} [intensity=1] - The light's strength/intensity.
   */
  constructor(t, e, n) {
    super(t, n), this.isHemisphereLight = !0, this.type = "HemisphereLight", this.position.copy(_e.DEFAULT_UP), this.updateMatrix(), this.groundColor = new Ft(e);
  }
  copy(t, e) {
    return super.copy(t, e), this.groundColor.copy(t.groundColor), this;
  }
}
const ys = /* @__PURE__ */ new Wt(), Ao = /* @__PURE__ */ new I(), bo = /* @__PURE__ */ new I();
class bu {
  /**
   * Constructs a new light shadow.
   *
   * @param {Camera} camera - The light's view of the world.
   */
  constructor(t) {
    this.camera = t, this.intensity = 1, this.bias = 0, this.normalBias = 0, this.radius = 1, this.blurSamples = 8, this.mapSize = new mt(512, 512), this.mapType = nn, this.map = null, this.mapPass = null, this.matrix = new Wt(), this.autoUpdate = !0, this.needsUpdate = !1, this._frustum = new Pa(), this._frameExtents = new mt(1, 1), this._viewportCount = 1, this._viewports = [
      new se(0, 0, 1, 1)
    ];
  }
  /**
   * Used internally by the renderer to get the number of viewports that need
   * to be rendered for this shadow.
   *
   * @return {number} The viewport count.
   */
  getViewportCount() {
    return this._viewportCount;
  }
  /**
   * Gets the shadow cameras frustum. Used internally by the renderer to cull objects.
   *
   * @return {Frustum} The shadow camera frustum.
   */
  getFrustum() {
    return this._frustum;
  }
  /**
   * Update the matrices for the camera and shadow, used internally by the renderer.
   *
   * @param {Light} light - The light for which the shadow is being rendered.
   */
  updateMatrices(t) {
    const e = this.camera, n = this.matrix;
    Ao.setFromMatrixPosition(t.matrixWorld), e.position.copy(Ao), bo.setFromMatrixPosition(t.target.matrixWorld), e.lookAt(bo), e.updateMatrixWorld(), ys.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse), this._frustum.setFromProjectionMatrix(ys), n.set(
      0.5,
      0,
      0,
      0.5,
      0,
      0.5,
      0,
      0.5,
      0,
      0,
      0.5,
      0.5,
      0,
      0,
      0,
      1
    ), n.multiply(ys);
  }
  /**
   * Returns a viewport definition for the given viewport index.
   *
   * @param {number} viewportIndex - The viewport index.
   * @return {Vector4} The viewport.
   */
  getViewport(t) {
    return this._viewports[t];
  }
  /**
   * Returns the frame extends.
   *
   * @return {Vector2} The frame extends.
   */
  getFrameExtents() {
    return this._frameExtents;
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever this instance is no longer used in your app.
   */
  dispose() {
    this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose();
  }
  /**
   * Copies the values of the given light shadow instance to this instance.
   *
   * @param {LightShadow} source - The light shadow to copy.
   * @return {LightShadow} A reference to this light shadow instance.
   */
  copy(t) {
    return this.camera = t.camera.clone(), this.intensity = t.intensity, this.bias = t.bias, this.radius = t.radius, this.autoUpdate = t.autoUpdate, this.needsUpdate = t.needsUpdate, this.normalBias = t.normalBias, this.blurSamples = t.blurSamples, this.mapSize.copy(t.mapSize), this;
  }
  /**
   * Returns a new light shadow instance with copied values from this instance.
   *
   * @return {LightShadow} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
  /**
   * Serializes the light shadow into JSON.
   *
   * @return {Object} A JSON object representing the serialized light shadow.
   * @see {@link ObjectLoader#parse}
   */
  toJSON() {
    const t = {};
    return this.intensity !== 1 && (t.intensity = this.intensity), this.bias !== 0 && (t.bias = this.bias), this.normalBias !== 0 && (t.normalBias = this.normalBias), this.radius !== 1 && (t.radius = this.radius), (this.mapSize.x !== 512 || this.mapSize.y !== 512) && (t.mapSize = this.mapSize.toArray()), t.camera = this.camera.toJSON(!1).object, delete t.camera.matrix, t;
  }
}
class Kl extends Ol {
  /**
   * Constructs a new orthographic camera.
   *
   * @param {number} [left=-1] - The left plane of the camera's frustum.
   * @param {number} [right=1] - The right plane of the camera's frustum.
   * @param {number} [top=1] - The top plane of the camera's frustum.
   * @param {number} [bottom=-1] - The bottom plane of the camera's frustum.
   * @param {number} [near=0.1] - The camera's near plane.
   * @param {number} [far=2000] - The camera's far plane.
   */
  constructor(t = -1, e = 1, n = 1, r = -1, s = 0.1, a = 2e3) {
    super(), this.isOrthographicCamera = !0, this.type = "OrthographicCamera", this.zoom = 1, this.view = null, this.left = t, this.right = e, this.top = n, this.bottom = r, this.near = s, this.far = a, this.updateProjectionMatrix();
  }
  copy(t, e) {
    return super.copy(t, e), this.left = t.left, this.right = t.right, this.top = t.top, this.bottom = t.bottom, this.near = t.near, this.far = t.far, this.zoom = t.zoom, this.view = t.view === null ? null : Object.assign({}, t.view), this;
  }
  /**
   * Sets an offset in a larger frustum. This is useful for multi-window or
   * multi-monitor/multi-machine setups.
   *
   * @param {number} fullWidth - The full width of multiview setup.
   * @param {number} fullHeight - The full height of multiview setup.
   * @param {number} x - The horizontal offset of the subcamera.
   * @param {number} y - The vertical offset of the subcamera.
   * @param {number} width - The width of subcamera.
   * @param {number} height - The height of subcamera.
   * @see {@link PerspectiveCamera#setViewOffset}
   */
  setViewOffset(t, e, n, r, s, a) {
    this.view === null && (this.view = {
      enabled: !0,
      fullWidth: 1,
      fullHeight: 1,
      offsetX: 0,
      offsetY: 0,
      width: 1,
      height: 1
    }), this.view.enabled = !0, this.view.fullWidth = t, this.view.fullHeight = e, this.view.offsetX = n, this.view.offsetY = r, this.view.width = s, this.view.height = a, this.updateProjectionMatrix();
  }
  /**
   * Removes the view offset from the projection matrix.
   */
  clearViewOffset() {
    this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
  }
  /**
   * Updates the camera's projection matrix. Must be called after any change of
   * camera properties.
   */
  updateProjectionMatrix() {
    const t = (this.right - this.left) / (2 * this.zoom), e = (this.top - this.bottom) / (2 * this.zoom), n = (this.right + this.left) / 2, r = (this.top + this.bottom) / 2;
    let s = n - t, a = n + t, o = r + e, l = r - e;
    if (this.view !== null && this.view.enabled) {
      const c = (this.right - this.left) / this.view.fullWidth / this.zoom, h = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
      s += c * this.view.offsetX, a = s + c * this.view.width, o -= h * this.view.offsetY, l = o - h * this.view.height;
    }
    this.projectionMatrix.makeOrthographic(s, a, o, l, this.near, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return e.object.zoom = this.zoom, e.object.left = this.left, e.object.right = this.right, e.object.top = this.top, e.object.bottom = this.bottom, e.object.near = this.near, e.object.far = this.far, this.view !== null && (e.object.view = Object.assign({}, this.view)), e;
  }
}
class wu extends bu {
  /**
   * Constructs a new directional light shadow.
   */
  constructor() {
    super(new Kl(-5, 5, 5, -5, 0.5, 500)), this.isDirectionalLightShadow = !0;
  }
}
class Ru extends Na {
  /**
   * Constructs a new directional light.
   *
   * @param {(number|Color|string)} [color=0xffffff] - The light's color.
   * @param {number} [intensity=1] - The light's strength/intensity.
   */
  constructor(t, e) {
    super(t, e), this.isDirectionalLight = !0, this.type = "DirectionalLight", this.position.copy(_e.DEFAULT_UP), this.updateMatrix(), this.target = new _e(), this.shadow = new wu();
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(t) {
    return super.copy(t), this.target = t.target.clone(), this.shadow = t.shadow.clone(), this;
  }
}
class Cu extends Na {
  /**
   * Constructs a new ambient light.
   *
   * @param {(number|Color|string)} [color=0xffffff] - The light's color.
   * @param {number} [intensity=1] - The light's strength/intensity.
   */
  constructor(t, e) {
    super(t, e), this.isAmbientLight = !0, this.type = "AmbientLight";
  }
}
class Pu extends He {
  /**
   * Constructs a new array camera.
   *
   * @param {Array<PerspectiveCamera>} [array=[]] - An array of perspective sub cameras.
   */
  constructor(t = []) {
    super(), this.isArrayCamera = !0, this.isMultiViewCamera = !1, this.cameras = t;
  }
}
function wo(i, t, e, n) {
  const r = Lu(n);
  switch (e) {
    // https://registry.khronos.org/OpenGL-Refpages/es3.0/html/glTexImage2D.xhtml
    case Tl:
      return i * t;
    case Ta:
      return i * t / r.components * r.byteLength;
    case Aa:
      return i * t / r.components * r.byteLength;
    case bl:
      return i * t * 2 / r.components * r.byteLength;
    case ba:
      return i * t * 2 / r.components * r.byteLength;
    case Al:
      return i * t * 3 / r.components * r.byteLength;
    case $e:
      return i * t * 4 / r.components * r.byteLength;
    case wa:
      return i * t * 4 / r.components * r.byteLength;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_s3tc_srgb/
    case Dr:
    case Ir:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 8;
    case Ur:
    case Nr:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_pvrtc/
    case Xs:
    case Ys:
      return Math.max(i, 16) * Math.max(t, 8) / 4;
    case Ws:
    case qs:
      return Math.max(i, 8) * Math.max(t, 8) / 2;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_etc/
    case $s:
    case Zs:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 8;
    case Js:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/WEBGL_compressed_texture_astc/
    case Ks:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    case js:
      return Math.floor((i + 4) / 5) * Math.floor((t + 3) / 4) * 16;
    case Qs:
      return Math.floor((i + 4) / 5) * Math.floor((t + 4) / 5) * 16;
    case ta:
      return Math.floor((i + 5) / 6) * Math.floor((t + 4) / 5) * 16;
    case ea:
      return Math.floor((i + 5) / 6) * Math.floor((t + 5) / 6) * 16;
    case na:
      return Math.floor((i + 7) / 8) * Math.floor((t + 4) / 5) * 16;
    case ia:
      return Math.floor((i + 7) / 8) * Math.floor((t + 5) / 6) * 16;
    case ra:
      return Math.floor((i + 7) / 8) * Math.floor((t + 7) / 8) * 16;
    case sa:
      return Math.floor((i + 9) / 10) * Math.floor((t + 4) / 5) * 16;
    case aa:
      return Math.floor((i + 9) / 10) * Math.floor((t + 5) / 6) * 16;
    case oa:
      return Math.floor((i + 9) / 10) * Math.floor((t + 7) / 8) * 16;
    case la:
      return Math.floor((i + 9) / 10) * Math.floor((t + 9) / 10) * 16;
    case ca:
      return Math.floor((i + 11) / 12) * Math.floor((t + 9) / 10) * 16;
    case ha:
      return Math.floor((i + 11) / 12) * Math.floor((t + 11) / 12) * 16;
    // https://registry.khronos.org/webgl/extensions/EXT_texture_compression_bptc/
    case Fr:
    case ua:
    case da:
      return Math.ceil(i / 4) * Math.ceil(t / 4) * 16;
    // https://registry.khronos.org/webgl/extensions/EXT_texture_compression_rgtc/
    case wl:
    case fa:
      return Math.ceil(i / 4) * Math.ceil(t / 4) * 8;
    case pa:
    case ma:
      return Math.ceil(i / 4) * Math.ceil(t / 4) * 16;
  }
  throw new Error(
    `Unable to determine texture byte length for ${e} format.`
  );
}
function Lu(i) {
  switch (i) {
    case nn:
    case Sl:
      return { byteLength: 1, components: 1 };
    case Wi:
    case yl:
    case ji:
      return { byteLength: 2, components: 1 };
    case ya:
    case Ea:
      return { byteLength: 2, components: 4 };
    case qn:
    case Sa:
    case tn:
      return { byteLength: 4, components: 1 };
    case El:
      return { byteLength: 4, components: 3 };
  }
  throw new Error(`Unknown texture type ${i}.`);
}
typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: {
  revision: Ma
} }));
typeof window < "u" && (window.__THREE__ ? console.warn("WARNING: Multiple instances of Three.js being imported.") : window.__THREE__ = Ma);
function jl() {
  let i = null, t = !1, e = null, n = null;
  function r(s, a) {
    e(s, a), n = i.requestAnimationFrame(r);
  }
  return {
    start: function() {
      t !== !0 && e !== null && (n = i.requestAnimationFrame(r), t = !0);
    },
    stop: function() {
      i.cancelAnimationFrame(n), t = !1;
    },
    setAnimationLoop: function(s) {
      e = s;
    },
    setContext: function(s) {
      i = s;
    }
  };
}
function Du(i) {
  const t = /* @__PURE__ */ new WeakMap();
  function e(o, l) {
    const c = o.array, h = o.usage, u = c.byteLength, f = i.createBuffer();
    i.bindBuffer(l, f), i.bufferData(l, c, h), o.onUploadCallback();
    let d;
    if (c instanceof Float32Array)
      d = i.FLOAT;
    else if (c instanceof Uint16Array)
      o.isFloat16BufferAttribute ? d = i.HALF_FLOAT : d = i.UNSIGNED_SHORT;
    else if (c instanceof Int16Array)
      d = i.SHORT;
    else if (c instanceof Uint32Array)
      d = i.UNSIGNED_INT;
    else if (c instanceof Int32Array)
      d = i.INT;
    else if (c instanceof Int8Array)
      d = i.BYTE;
    else if (c instanceof Uint8Array)
      d = i.UNSIGNED_BYTE;
    else if (c instanceof Uint8ClampedArray)
      d = i.UNSIGNED_BYTE;
    else
      throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: " + c);
    return {
      buffer: f,
      type: d,
      bytesPerElement: c.BYTES_PER_ELEMENT,
      version: o.version,
      size: u
    };
  }
  function n(o, l, c) {
    const h = l.array, u = l.updateRanges;
    if (i.bindBuffer(c, o), u.length === 0)
      i.bufferSubData(c, 0, h);
    else {
      u.sort((d, g) => d.start - g.start);
      let f = 0;
      for (let d = 1; d < u.length; d++) {
        const g = u[f], v = u[d];
        v.start <= g.start + g.count + 1 ? g.count = Math.max(
          g.count,
          v.start + v.count - g.start
        ) : (++f, u[f] = v);
      }
      u.length = f + 1;
      for (let d = 0, g = u.length; d < g; d++) {
        const v = u[d];
        i.bufferSubData(
          c,
          v.start * h.BYTES_PER_ELEMENT,
          h,
          v.start,
          v.count
        );
      }
      l.clearUpdateRanges();
    }
    l.onUploadCallback();
  }
  function r(o) {
    return o.isInterleavedBufferAttribute && (o = o.data), t.get(o);
  }
  function s(o) {
    o.isInterleavedBufferAttribute && (o = o.data);
    const l = t.get(o);
    l && (i.deleteBuffer(l.buffer), t.delete(o));
  }
  function a(o, l) {
    if (o.isInterleavedBufferAttribute && (o = o.data), o.isGLBufferAttribute) {
      const h = t.get(o);
      (!h || h.version < o.version) && t.set(o, {
        buffer: o.buffer,
        type: o.type,
        bytesPerElement: o.elementSize,
        version: o.version
      });
      return;
    }
    const c = t.get(o);
    if (c === void 0)
      t.set(o, e(o, l));
    else if (c.version < o.version) {
      if (c.size !== o.array.byteLength)
        throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");
      n(c.buffer, o, l), c.version = o.version;
    }
  }
  return {
    get: r,
    remove: s,
    update: a
  };
}
var Iu = `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`, Uu = `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`, Nu = `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`, Fu = `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, Ou = `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`, Bu = `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`, zu = `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`, Hu = `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`, ku = `#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`, Vu = `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`, Gu = `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`, Wu = `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`, Xu = `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`, qu = `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`, Yu = `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`, $u = `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`, Zu = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`, Ju = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`, Ku = `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`, ju = `#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`, Qu = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`, td = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`, ed = `#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`, nd = `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`, id = `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`, rd = `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`, sd = `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`, ad = `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`, od = `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`, ld = `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`, cd = "gl_FragColor = linearToOutputTexel( gl_FragColor );", hd = `vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`, ud = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`, dd = `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`, fd = `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`, pd = `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`, md = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`, gd = `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`, _d = `#ifdef USE_FOG
	varying float vFogDepth;
#endif`, vd = `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`, xd = `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`, Md = `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`, Sd = `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`, yd = `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`, Ed = `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`, Td = `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`, Ad = `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`, bd = `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`, wd = `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`, Rd = `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`, Cd = `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`, Pd = `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`, Ld = `struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`, Dd = `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`, Id = `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`, Ud = `#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`, Nd = `#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`, Fd = `#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, Od = `#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`, Bd = `#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`, zd = `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`, Hd = `#ifdef USE_MAP
	uniform sampler2D map;
#endif`, kd = `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`, Vd = `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`, Gd = `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`, Wd = `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`, Xd = `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`, qd = `#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`, Yd = `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, $d = `#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`, Zd = `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`, Jd = `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`, Kd = `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`, jd = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, Qd = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`, tf = `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`, ef = `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`, nf = `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`, rf = `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`, sf = `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`, af = `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`, of = `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`, lf = `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`, cf = `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`, hf = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`, uf = `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`, df = `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`, ff = `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`, pf = `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`, mf = `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`, gf = `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`, _f = `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`, vf = `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`, xf = `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`, Mf = `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`, Sf = `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`, yf = `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`, Ef = `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`, Tf = `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`, Af = `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`, bf = `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`, wf = `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`, Rf = `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`, Cf = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, Pf = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`, Lf = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`, Df = `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;
const If = `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`, Uf = `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Nf = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, Ff = `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Of = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`, Bf = `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, zf = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`, Hf = `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`, kf = `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`, Vf = `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`, Gf = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`, Wf = `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`, Xf = `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, qf = `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, Yf = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`, $f = `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Zf = `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, Jf = `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Kf = `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`, jf = `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, Qf = `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`, tp = `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`, ep = `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, np = `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, ip = `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`, rp = `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, sp = `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, ap = `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`, op = `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`, lp = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`, cp = `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`, hp = `uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, up = `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`, dp = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`, It = {
  alphahash_fragment: Iu,
  alphahash_pars_fragment: Uu,
  alphamap_fragment: Nu,
  alphamap_pars_fragment: Fu,
  alphatest_fragment: Ou,
  alphatest_pars_fragment: Bu,
  aomap_fragment: zu,
  aomap_pars_fragment: Hu,
  batching_pars_vertex: ku,
  batching_vertex: Vu,
  begin_vertex: Gu,
  beginnormal_vertex: Wu,
  bsdfs: Xu,
  iridescence_fragment: qu,
  bumpmap_pars_fragment: Yu,
  clipping_planes_fragment: $u,
  clipping_planes_pars_fragment: Zu,
  clipping_planes_pars_vertex: Ju,
  clipping_planes_vertex: Ku,
  color_fragment: ju,
  color_pars_fragment: Qu,
  color_pars_vertex: td,
  color_vertex: ed,
  common: nd,
  cube_uv_reflection_fragment: id,
  defaultnormal_vertex: rd,
  displacementmap_pars_vertex: sd,
  displacementmap_vertex: ad,
  emissivemap_fragment: od,
  emissivemap_pars_fragment: ld,
  colorspace_fragment: cd,
  colorspace_pars_fragment: hd,
  envmap_fragment: ud,
  envmap_common_pars_fragment: dd,
  envmap_pars_fragment: fd,
  envmap_pars_vertex: pd,
  envmap_physical_pars_fragment: Ad,
  envmap_vertex: md,
  fog_vertex: gd,
  fog_pars_vertex: _d,
  fog_fragment: vd,
  fog_pars_fragment: xd,
  gradientmap_pars_fragment: Md,
  lightmap_pars_fragment: Sd,
  lights_lambert_fragment: yd,
  lights_lambert_pars_fragment: Ed,
  lights_pars_begin: Td,
  lights_toon_fragment: bd,
  lights_toon_pars_fragment: wd,
  lights_phong_fragment: Rd,
  lights_phong_pars_fragment: Cd,
  lights_physical_fragment: Pd,
  lights_physical_pars_fragment: Ld,
  lights_fragment_begin: Dd,
  lights_fragment_maps: Id,
  lights_fragment_end: Ud,
  logdepthbuf_fragment: Nd,
  logdepthbuf_pars_fragment: Fd,
  logdepthbuf_pars_vertex: Od,
  logdepthbuf_vertex: Bd,
  map_fragment: zd,
  map_pars_fragment: Hd,
  map_particle_fragment: kd,
  map_particle_pars_fragment: Vd,
  metalnessmap_fragment: Gd,
  metalnessmap_pars_fragment: Wd,
  morphinstance_vertex: Xd,
  morphcolor_vertex: qd,
  morphnormal_vertex: Yd,
  morphtarget_pars_vertex: $d,
  morphtarget_vertex: Zd,
  normal_fragment_begin: Jd,
  normal_fragment_maps: Kd,
  normal_pars_fragment: jd,
  normal_pars_vertex: Qd,
  normal_vertex: tf,
  normalmap_pars_fragment: ef,
  clearcoat_normal_fragment_begin: nf,
  clearcoat_normal_fragment_maps: rf,
  clearcoat_pars_fragment: sf,
  iridescence_pars_fragment: af,
  opaque_fragment: of,
  packing: lf,
  premultiplied_alpha_fragment: cf,
  project_vertex: hf,
  dithering_fragment: uf,
  dithering_pars_fragment: df,
  roughnessmap_fragment: ff,
  roughnessmap_pars_fragment: pf,
  shadowmap_pars_fragment: mf,
  shadowmap_pars_vertex: gf,
  shadowmap_vertex: _f,
  shadowmask_pars_fragment: vf,
  skinbase_vertex: xf,
  skinning_pars_vertex: Mf,
  skinning_vertex: Sf,
  skinnormal_vertex: yf,
  specularmap_fragment: Ef,
  specularmap_pars_fragment: Tf,
  tonemapping_fragment: Af,
  tonemapping_pars_fragment: bf,
  transmission_fragment: wf,
  transmission_pars_fragment: Rf,
  uv_pars_fragment: Cf,
  uv_pars_vertex: Pf,
  uv_vertex: Lf,
  worldpos_vertex: Df,
  background_vert: If,
  background_frag: Uf,
  backgroundCube_vert: Nf,
  backgroundCube_frag: Ff,
  cube_vert: Of,
  cube_frag: Bf,
  depth_vert: zf,
  depth_frag: Hf,
  distanceRGBA_vert: kf,
  distanceRGBA_frag: Vf,
  equirect_vert: Gf,
  equirect_frag: Wf,
  linedashed_vert: Xf,
  linedashed_frag: qf,
  meshbasic_vert: Yf,
  meshbasic_frag: $f,
  meshlambert_vert: Zf,
  meshlambert_frag: Jf,
  meshmatcap_vert: Kf,
  meshmatcap_frag: jf,
  meshnormal_vert: Qf,
  meshnormal_frag: tp,
  meshphong_vert: ep,
  meshphong_frag: np,
  meshphysical_vert: ip,
  meshphysical_frag: rp,
  meshtoon_vert: sp,
  meshtoon_frag: ap,
  points_vert: op,
  points_frag: lp,
  shadow_vert: cp,
  shadow_frag: hp,
  sprite_vert: up,
  sprite_frag: dp
}, et = {
  common: {
    diffuse: { value: /* @__PURE__ */ new Ft(16777215) },
    opacity: { value: 1 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new Lt() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Lt() },
    alphaTest: { value: 0 }
  },
  specularmap: {
    specularMap: { value: null },
    specularMapTransform: { value: /* @__PURE__ */ new Lt() }
  },
  envmap: {
    envMap: { value: null },
    envMapRotation: { value: /* @__PURE__ */ new Lt() },
    flipEnvMap: { value: -1 },
    reflectivity: { value: 1 },
    // basic, lambert, phong
    ior: { value: 1.5 },
    // physical
    refractionRatio: { value: 0.98 }
    // basic, lambert, phong
  },
  aomap: {
    aoMap: { value: null },
    aoMapIntensity: { value: 1 },
    aoMapTransform: { value: /* @__PURE__ */ new Lt() }
  },
  lightmap: {
    lightMap: { value: null },
    lightMapIntensity: { value: 1 },
    lightMapTransform: { value: /* @__PURE__ */ new Lt() }
  },
  bumpmap: {
    bumpMap: { value: null },
    bumpMapTransform: { value: /* @__PURE__ */ new Lt() },
    bumpScale: { value: 1 }
  },
  normalmap: {
    normalMap: { value: null },
    normalMapTransform: { value: /* @__PURE__ */ new Lt() },
    normalScale: { value: /* @__PURE__ */ new mt(1, 1) }
  },
  displacementmap: {
    displacementMap: { value: null },
    displacementMapTransform: { value: /* @__PURE__ */ new Lt() },
    displacementScale: { value: 1 },
    displacementBias: { value: 0 }
  },
  emissivemap: {
    emissiveMap: { value: null },
    emissiveMapTransform: { value: /* @__PURE__ */ new Lt() }
  },
  metalnessmap: {
    metalnessMap: { value: null },
    metalnessMapTransform: { value: /* @__PURE__ */ new Lt() }
  },
  roughnessmap: {
    roughnessMap: { value: null },
    roughnessMapTransform: { value: /* @__PURE__ */ new Lt() }
  },
  gradientmap: {
    gradientMap: { value: null }
  },
  fog: {
    fogDensity: { value: 25e-5 },
    fogNear: { value: 1 },
    fogFar: { value: 2e3 },
    fogColor: { value: /* @__PURE__ */ new Ft(16777215) }
  },
  lights: {
    ambientLightColor: { value: [] },
    lightProbe: { value: [] },
    directionalLights: { value: [], properties: {
      direction: {},
      color: {}
    } },
    directionalLightShadows: { value: [], properties: {
      shadowIntensity: 1,
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {}
    } },
    directionalShadowMap: { value: [] },
    directionalShadowMatrix: { value: [] },
    spotLights: { value: [], properties: {
      color: {},
      position: {},
      direction: {},
      distance: {},
      coneCos: {},
      penumbraCos: {},
      decay: {}
    } },
    spotLightShadows: { value: [], properties: {
      shadowIntensity: 1,
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {}
    } },
    spotLightMap: { value: [] },
    spotShadowMap: { value: [] },
    spotLightMatrix: { value: [] },
    pointLights: { value: [], properties: {
      color: {},
      position: {},
      decay: {},
      distance: {}
    } },
    pointLightShadows: { value: [], properties: {
      shadowIntensity: 1,
      shadowBias: {},
      shadowNormalBias: {},
      shadowRadius: {},
      shadowMapSize: {},
      shadowCameraNear: {},
      shadowCameraFar: {}
    } },
    pointShadowMap: { value: [] },
    pointShadowMatrix: { value: [] },
    hemisphereLights: { value: [], properties: {
      direction: {},
      skyColor: {},
      groundColor: {}
    } },
    // TODO (abelnation): RectAreaLight BRDF data needs to be moved from example to main src
    rectAreaLights: { value: [], properties: {
      color: {},
      position: {},
      width: {},
      height: {}
    } },
    ltc_1: { value: null },
    ltc_2: { value: null }
  },
  points: {
    diffuse: { value: /* @__PURE__ */ new Ft(16777215) },
    opacity: { value: 1 },
    size: { value: 1 },
    scale: { value: 1 },
    map: { value: null },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Lt() },
    alphaTest: { value: 0 },
    uvTransform: { value: /* @__PURE__ */ new Lt() }
  },
  sprite: {
    diffuse: { value: /* @__PURE__ */ new Ft(16777215) },
    opacity: { value: 1 },
    center: { value: /* @__PURE__ */ new mt(0.5, 0.5) },
    rotation: { value: 0 },
    map: { value: null },
    mapTransform: { value: /* @__PURE__ */ new Lt() },
    alphaMap: { value: null },
    alphaMapTransform: { value: /* @__PURE__ */ new Lt() },
    alphaTest: { value: 0 }
  }
}, je = {
  basic: {
    uniforms: /* @__PURE__ */ Te([
      et.common,
      et.specularmap,
      et.envmap,
      et.aomap,
      et.lightmap,
      et.fog
    ]),
    vertexShader: It.meshbasic_vert,
    fragmentShader: It.meshbasic_frag
  },
  lambert: {
    uniforms: /* @__PURE__ */ Te([
      et.common,
      et.specularmap,
      et.envmap,
      et.aomap,
      et.lightmap,
      et.emissivemap,
      et.bumpmap,
      et.normalmap,
      et.displacementmap,
      et.fog,
      et.lights,
      {
        emissive: { value: /* @__PURE__ */ new Ft(0) }
      }
    ]),
    vertexShader: It.meshlambert_vert,
    fragmentShader: It.meshlambert_frag
  },
  phong: {
    uniforms: /* @__PURE__ */ Te([
      et.common,
      et.specularmap,
      et.envmap,
      et.aomap,
      et.lightmap,
      et.emissivemap,
      et.bumpmap,
      et.normalmap,
      et.displacementmap,
      et.fog,
      et.lights,
      {
        emissive: { value: /* @__PURE__ */ new Ft(0) },
        specular: { value: /* @__PURE__ */ new Ft(1118481) },
        shininess: { value: 30 }
      }
    ]),
    vertexShader: It.meshphong_vert,
    fragmentShader: It.meshphong_frag
  },
  standard: {
    uniforms: /* @__PURE__ */ Te([
      et.common,
      et.envmap,
      et.aomap,
      et.lightmap,
      et.emissivemap,
      et.bumpmap,
      et.normalmap,
      et.displacementmap,
      et.roughnessmap,
      et.metalnessmap,
      et.fog,
      et.lights,
      {
        emissive: { value: /* @__PURE__ */ new Ft(0) },
        roughness: { value: 1 },
        metalness: { value: 0 },
        envMapIntensity: { value: 1 }
      }
    ]),
    vertexShader: It.meshphysical_vert,
    fragmentShader: It.meshphysical_frag
  },
  toon: {
    uniforms: /* @__PURE__ */ Te([
      et.common,
      et.aomap,
      et.lightmap,
      et.emissivemap,
      et.bumpmap,
      et.normalmap,
      et.displacementmap,
      et.gradientmap,
      et.fog,
      et.lights,
      {
        emissive: { value: /* @__PURE__ */ new Ft(0) }
      }
    ]),
    vertexShader: It.meshtoon_vert,
    fragmentShader: It.meshtoon_frag
  },
  matcap: {
    uniforms: /* @__PURE__ */ Te([
      et.common,
      et.bumpmap,
      et.normalmap,
      et.displacementmap,
      et.fog,
      {
        matcap: { value: null }
      }
    ]),
    vertexShader: It.meshmatcap_vert,
    fragmentShader: It.meshmatcap_frag
  },
  points: {
    uniforms: /* @__PURE__ */ Te([
      et.points,
      et.fog
    ]),
    vertexShader: It.points_vert,
    fragmentShader: It.points_frag
  },
  dashed: {
    uniforms: /* @__PURE__ */ Te([
      et.common,
      et.fog,
      {
        scale: { value: 1 },
        dashSize: { value: 1 },
        totalSize: { value: 2 }
      }
    ]),
    vertexShader: It.linedashed_vert,
    fragmentShader: It.linedashed_frag
  },
  depth: {
    uniforms: /* @__PURE__ */ Te([
      et.common,
      et.displacementmap
    ]),
    vertexShader: It.depth_vert,
    fragmentShader: It.depth_frag
  },
  normal: {
    uniforms: /* @__PURE__ */ Te([
      et.common,
      et.bumpmap,
      et.normalmap,
      et.displacementmap,
      {
        opacity: { value: 1 }
      }
    ]),
    vertexShader: It.meshnormal_vert,
    fragmentShader: It.meshnormal_frag
  },
  sprite: {
    uniforms: /* @__PURE__ */ Te([
      et.sprite,
      et.fog
    ]),
    vertexShader: It.sprite_vert,
    fragmentShader: It.sprite_frag
  },
  background: {
    uniforms: {
      uvTransform: { value: /* @__PURE__ */ new Lt() },
      t2D: { value: null },
      backgroundIntensity: { value: 1 }
    },
    vertexShader: It.background_vert,
    fragmentShader: It.background_frag
  },
  backgroundCube: {
    uniforms: {
      envMap: { value: null },
      flipEnvMap: { value: -1 },
      backgroundBlurriness: { value: 0 },
      backgroundIntensity: { value: 1 },
      backgroundRotation: { value: /* @__PURE__ */ new Lt() }
    },
    vertexShader: It.backgroundCube_vert,
    fragmentShader: It.backgroundCube_frag
  },
  cube: {
    uniforms: {
      tCube: { value: null },
      tFlip: { value: -1 },
      opacity: { value: 1 }
    },
    vertexShader: It.cube_vert,
    fragmentShader: It.cube_frag
  },
  equirect: {
    uniforms: {
      tEquirect: { value: null }
    },
    vertexShader: It.equirect_vert,
    fragmentShader: It.equirect_frag
  },
  distanceRGBA: {
    uniforms: /* @__PURE__ */ Te([
      et.common,
      et.displacementmap,
      {
        referencePosition: { value: /* @__PURE__ */ new I() },
        nearDistance: { value: 1 },
        farDistance: { value: 1e3 }
      }
    ]),
    vertexShader: It.distanceRGBA_vert,
    fragmentShader: It.distanceRGBA_frag
  },
  shadow: {
    uniforms: /* @__PURE__ */ Te([
      et.lights,
      et.fog,
      {
        color: { value: /* @__PURE__ */ new Ft(0) },
        opacity: { value: 1 }
      }
    ]),
    vertexShader: It.shadow_vert,
    fragmentShader: It.shadow_frag
  }
};
je.physical = {
  uniforms: /* @__PURE__ */ Te([
    je.standard.uniforms,
    {
      clearcoat: { value: 0 },
      clearcoatMap: { value: null },
      clearcoatMapTransform: { value: /* @__PURE__ */ new Lt() },
      clearcoatNormalMap: { value: null },
      clearcoatNormalMapTransform: { value: /* @__PURE__ */ new Lt() },
      clearcoatNormalScale: { value: /* @__PURE__ */ new mt(1, 1) },
      clearcoatRoughness: { value: 0 },
      clearcoatRoughnessMap: { value: null },
      clearcoatRoughnessMapTransform: { value: /* @__PURE__ */ new Lt() },
      dispersion: { value: 0 },
      iridescence: { value: 0 },
      iridescenceMap: { value: null },
      iridescenceMapTransform: { value: /* @__PURE__ */ new Lt() },
      iridescenceIOR: { value: 1.3 },
      iridescenceThicknessMinimum: { value: 100 },
      iridescenceThicknessMaximum: { value: 400 },
      iridescenceThicknessMap: { value: null },
      iridescenceThicknessMapTransform: { value: /* @__PURE__ */ new Lt() },
      sheen: { value: 0 },
      sheenColor: { value: /* @__PURE__ */ new Ft(0) },
      sheenColorMap: { value: null },
      sheenColorMapTransform: { value: /* @__PURE__ */ new Lt() },
      sheenRoughness: { value: 1 },
      sheenRoughnessMap: { value: null },
      sheenRoughnessMapTransform: { value: /* @__PURE__ */ new Lt() },
      transmission: { value: 0 },
      transmissionMap: { value: null },
      transmissionMapTransform: { value: /* @__PURE__ */ new Lt() },
      transmissionSamplerSize: { value: /* @__PURE__ */ new mt() },
      transmissionSamplerMap: { value: null },
      thickness: { value: 0 },
      thicknessMap: { value: null },
      thicknessMapTransform: { value: /* @__PURE__ */ new Lt() },
      attenuationDistance: { value: 0 },
      attenuationColor: { value: /* @__PURE__ */ new Ft(0) },
      specularColor: { value: /* @__PURE__ */ new Ft(1, 1, 1) },
      specularColorMap: { value: null },
      specularColorMapTransform: { value: /* @__PURE__ */ new Lt() },
      specularIntensity: { value: 1 },
      specularIntensityMap: { value: null },
      specularIntensityMapTransform: { value: /* @__PURE__ */ new Lt() },
      anisotropyVector: { value: /* @__PURE__ */ new mt() },
      anisotropyMap: { value: null },
      anisotropyMapTransform: { value: /* @__PURE__ */ new Lt() }
    }
  ]),
  vertexShader: It.meshphysical_vert,
  fragmentShader: It.meshphysical_frag
};
const wr = { r: 0, b: 0, g: 0 }, Fn = /* @__PURE__ */ new rn(), fp = /* @__PURE__ */ new Wt();
function pp(i, t, e, n, r, s, a) {
  const o = new Ft(0);
  let l = s === !0 ? 0 : 1, c, h, u = null, f = 0, d = null;
  function g(T) {
    let S = T.isScene === !0 ? T.background : null;
    return S && S.isTexture && (S = (T.backgroundBlurriness > 0 ? e : t).get(S)), S;
  }
  function v(T) {
    let S = !1;
    const N = g(T);
    N === null ? p(o, l) : N && N.isColor && (p(N, 1), S = !0);
    const w = i.xr.getEnvironmentBlendMode();
    w === "additive" ? n.buffers.color.setClear(0, 0, 0, 1, a) : w === "alpha-blend" && n.buffers.color.setClear(0, 0, 0, 0, a), (i.autoClear || S) && (n.buffers.depth.setTest(!0), n.buffers.depth.setMask(!0), n.buffers.color.setMask(!0), i.clear(i.autoClearColor, i.autoClearDepth, i.autoClearStencil));
  }
  function m(T, S) {
    const N = g(S);
    N && (N.isCubeTexture || N.mapping === Wr) ? (h === void 0 && (h = new Kt(
      new pe(1, 1, 1),
      new Cn({
        name: "BackgroundCubeMaterial",
        uniforms: Si(je.backgroundCube.uniforms),
        vertexShader: je.backgroundCube.vertexShader,
        fragmentShader: je.backgroundCube.fragmentShader,
        side: Ce,
        depthTest: !1,
        depthWrite: !1,
        fog: !1,
        allowOverride: !1
      })
    ), h.geometry.deleteAttribute("normal"), h.geometry.deleteAttribute("uv"), h.onBeforeRender = function(w, R, U) {
      this.matrixWorld.copyPosition(U.matrixWorld);
    }, Object.defineProperty(h.material, "envMap", {
      get: function() {
        return this.uniforms.envMap.value;
      }
    }), r.update(h)), Fn.copy(S.backgroundRotation), Fn.x *= -1, Fn.y *= -1, Fn.z *= -1, N.isCubeTexture && N.isRenderTargetTexture === !1 && (Fn.y *= -1, Fn.z *= -1), h.material.uniforms.envMap.value = N, h.material.uniforms.flipEnvMap.value = N.isCubeTexture && N.isRenderTargetTexture === !1 ? -1 : 1, h.material.uniforms.backgroundBlurriness.value = S.backgroundBlurriness, h.material.uniforms.backgroundIntensity.value = S.backgroundIntensity, h.material.uniforms.backgroundRotation.value.setFromMatrix4(fp.makeRotationFromEuler(Fn)), h.material.toneMapped = Gt.getTransfer(N.colorSpace) !== Zt, (u !== N || f !== N.version || d !== i.toneMapping) && (h.material.needsUpdate = !0, u = N, f = N.version, d = i.toneMapping), h.layers.enableAll(), T.unshift(h, h.geometry, h.material, 0, 0, null)) : N && N.isTexture && (c === void 0 && (c = new Kt(
      new Je(2, 2),
      new Cn({
        name: "BackgroundMaterial",
        uniforms: Si(je.background.uniforms),
        vertexShader: je.background.vertexShader,
        fragmentShader: je.background.fragmentShader,
        side: Rn,
        depthTest: !1,
        depthWrite: !1,
        fog: !1,
        allowOverride: !1
      })
    ), c.geometry.deleteAttribute("normal"), Object.defineProperty(c.material, "map", {
      get: function() {
        return this.uniforms.t2D.value;
      }
    }), r.update(c)), c.material.uniforms.t2D.value = N, c.material.uniforms.backgroundIntensity.value = S.backgroundIntensity, c.material.toneMapped = Gt.getTransfer(N.colorSpace) !== Zt, N.matrixAutoUpdate === !0 && N.updateMatrix(), c.material.uniforms.uvTransform.value.copy(N.matrix), (u !== N || f !== N.version || d !== i.toneMapping) && (c.material.needsUpdate = !0, u = N, f = N.version, d = i.toneMapping), c.layers.enableAll(), T.unshift(c, c.geometry, c.material, 0, 0, null));
  }
  function p(T, S) {
    T.getRGB(wr, Fl(i)), n.buffers.color.setClear(wr.r, wr.g, wr.b, S, a);
  }
  function A() {
    h !== void 0 && (h.geometry.dispose(), h.material.dispose(), h = void 0), c !== void 0 && (c.geometry.dispose(), c.material.dispose(), c = void 0);
  }
  return {
    getClearColor: function() {
      return o;
    },
    setClearColor: function(T, S = 1) {
      o.set(T), l = S, p(o, l);
    },
    getClearAlpha: function() {
      return l;
    },
    setClearAlpha: function(T) {
      l = T, p(o, l);
    },
    render: v,
    addToRenderList: m,
    dispose: A
  };
}
function mp(i, t) {
  const e = i.getParameter(i.MAX_VERTEX_ATTRIBS), n = {}, r = f(null);
  let s = r, a = !1;
  function o(M, C, H, B, G) {
    let Z = !1;
    const W = u(B, H, C);
    s !== W && (s = W, c(s.object)), Z = d(M, B, H, G), Z && g(M, B, H, G), G !== null && t.update(G, i.ELEMENT_ARRAY_BUFFER), (Z || a) && (a = !1, S(M, C, H, B), G !== null && i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, t.get(G).buffer));
  }
  function l() {
    return i.createVertexArray();
  }
  function c(M) {
    return i.bindVertexArray(M);
  }
  function h(M) {
    return i.deleteVertexArray(M);
  }
  function u(M, C, H) {
    const B = H.wireframe === !0;
    let G = n[M.id];
    G === void 0 && (G = {}, n[M.id] = G);
    let Z = G[C.id];
    Z === void 0 && (Z = {}, G[C.id] = Z);
    let W = Z[B];
    return W === void 0 && (W = f(l()), Z[B] = W), W;
  }
  function f(M) {
    const C = [], H = [], B = [];
    for (let G = 0; G < e; G++)
      C[G] = 0, H[G] = 0, B[G] = 0;
    return {
      // for backward compatibility on non-VAO support browser
      geometry: null,
      program: null,
      wireframe: !1,
      newAttributes: C,
      enabledAttributes: H,
      attributeDivisors: B,
      object: M,
      attributes: {},
      index: null
    };
  }
  function d(M, C, H, B) {
    const G = s.attributes, Z = C.attributes;
    let W = 0;
    const Q = H.getAttributes();
    for (const V in Q)
      if (Q[V].location >= 0) {
        const ht = G[V];
        let vt = Z[V];
        if (vt === void 0 && (V === "instanceMatrix" && M.instanceMatrix && (vt = M.instanceMatrix), V === "instanceColor" && M.instanceColor && (vt = M.instanceColor)), ht === void 0 || ht.attribute !== vt || vt && ht.data !== vt.data) return !0;
        W++;
      }
    return s.attributesNum !== W || s.index !== B;
  }
  function g(M, C, H, B) {
    const G = {}, Z = C.attributes;
    let W = 0;
    const Q = H.getAttributes();
    for (const V in Q)
      if (Q[V].location >= 0) {
        let ht = Z[V];
        ht === void 0 && (V === "instanceMatrix" && M.instanceMatrix && (ht = M.instanceMatrix), V === "instanceColor" && M.instanceColor && (ht = M.instanceColor));
        const vt = {};
        vt.attribute = ht, ht && ht.data && (vt.data = ht.data), G[V] = vt, W++;
      }
    s.attributes = G, s.attributesNum = W, s.index = B;
  }
  function v() {
    const M = s.newAttributes;
    for (let C = 0, H = M.length; C < H; C++)
      M[C] = 0;
  }
  function m(M) {
    p(M, 0);
  }
  function p(M, C) {
    const H = s.newAttributes, B = s.enabledAttributes, G = s.attributeDivisors;
    H[M] = 1, B[M] === 0 && (i.enableVertexAttribArray(M), B[M] = 1), G[M] !== C && (i.vertexAttribDivisor(M, C), G[M] = C);
  }
  function A() {
    const M = s.newAttributes, C = s.enabledAttributes;
    for (let H = 0, B = C.length; H < B; H++)
      C[H] !== M[H] && (i.disableVertexAttribArray(H), C[H] = 0);
  }
  function T(M, C, H, B, G, Z, W) {
    W === !0 ? i.vertexAttribIPointer(M, C, H, G, Z) : i.vertexAttribPointer(M, C, H, B, G, Z);
  }
  function S(M, C, H, B) {
    v();
    const G = B.attributes, Z = H.getAttributes(), W = C.defaultAttributeValues;
    for (const Q in Z) {
      const V = Z[Q];
      if (V.location >= 0) {
        let it = G[Q];
        if (it === void 0 && (Q === "instanceMatrix" && M.instanceMatrix && (it = M.instanceMatrix), Q === "instanceColor" && M.instanceColor && (it = M.instanceColor)), it !== void 0) {
          const ht = it.normalized, vt = it.itemSize, Ut = t.get(it);
          if (Ut === void 0) continue;
          const Jt = Ut.buffer, q = Ut.type, tt = Ut.bytesPerElement, pt = q === i.INT || q === i.UNSIGNED_INT || it.gpuType === Sa;
          if (it.isInterleavedBufferAttribute) {
            const rt = it.data, yt = rt.stride, Xt = it.offset;
            if (rt.isInstancedInterleavedBuffer) {
              for (let bt = 0; bt < V.locationSize; bt++)
                p(V.location + bt, rt.meshPerAttribute);
              M.isInstancedMesh !== !0 && B._maxInstanceCount === void 0 && (B._maxInstanceCount = rt.meshPerAttribute * rt.count);
            } else
              for (let bt = 0; bt < V.locationSize; bt++)
                m(V.location + bt);
            i.bindBuffer(i.ARRAY_BUFFER, Jt);
            for (let bt = 0; bt < V.locationSize; bt++)
              T(
                V.location + bt,
                vt / V.locationSize,
                q,
                ht,
                yt * tt,
                (Xt + vt / V.locationSize * bt) * tt,
                pt
              );
          } else {
            if (it.isInstancedBufferAttribute) {
              for (let rt = 0; rt < V.locationSize; rt++)
                p(V.location + rt, it.meshPerAttribute);
              M.isInstancedMesh !== !0 && B._maxInstanceCount === void 0 && (B._maxInstanceCount = it.meshPerAttribute * it.count);
            } else
              for (let rt = 0; rt < V.locationSize; rt++)
                m(V.location + rt);
            i.bindBuffer(i.ARRAY_BUFFER, Jt);
            for (let rt = 0; rt < V.locationSize; rt++)
              T(
                V.location + rt,
                vt / V.locationSize,
                q,
                ht,
                vt * tt,
                vt / V.locationSize * rt * tt,
                pt
              );
          }
        } else if (W !== void 0) {
          const ht = W[Q];
          if (ht !== void 0)
            switch (ht.length) {
              case 2:
                i.vertexAttrib2fv(V.location, ht);
                break;
              case 3:
                i.vertexAttrib3fv(V.location, ht);
                break;
              case 4:
                i.vertexAttrib4fv(V.location, ht);
                break;
              default:
                i.vertexAttrib1fv(V.location, ht);
            }
        }
      }
    }
    A();
  }
  function N() {
    U();
    for (const M in n) {
      const C = n[M];
      for (const H in C) {
        const B = C[H];
        for (const G in B)
          h(B[G].object), delete B[G];
        delete C[H];
      }
      delete n[M];
    }
  }
  function w(M) {
    if (n[M.id] === void 0) return;
    const C = n[M.id];
    for (const H in C) {
      const B = C[H];
      for (const G in B)
        h(B[G].object), delete B[G];
      delete C[H];
    }
    delete n[M.id];
  }
  function R(M) {
    for (const C in n) {
      const H = n[C];
      if (H[M.id] === void 0) continue;
      const B = H[M.id];
      for (const G in B)
        h(B[G].object), delete B[G];
      delete H[M.id];
    }
  }
  function U() {
    y(), a = !0, s !== r && (s = r, c(s.object));
  }
  function y() {
    r.geometry = null, r.program = null, r.wireframe = !1;
  }
  return {
    setup: o,
    reset: U,
    resetDefaultState: y,
    dispose: N,
    releaseStatesOfGeometry: w,
    releaseStatesOfProgram: R,
    initAttributes: v,
    enableAttribute: m,
    disableUnusedAttributes: A
  };
}
function gp(i, t, e) {
  let n;
  function r(c) {
    n = c;
  }
  function s(c, h) {
    i.drawArrays(n, c, h), e.update(h, n, 1);
  }
  function a(c, h, u) {
    u !== 0 && (i.drawArraysInstanced(n, c, h, u), e.update(h, n, u));
  }
  function o(c, h, u) {
    if (u === 0) return;
    t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n, c, 0, h, 0, u);
    let d = 0;
    for (let g = 0; g < u; g++)
      d += h[g];
    e.update(d, n, 1);
  }
  function l(c, h, u, f) {
    if (u === 0) return;
    const d = t.get("WEBGL_multi_draw");
    if (d === null)
      for (let g = 0; g < c.length; g++)
        a(c[g], h[g], f[g]);
    else {
      d.multiDrawArraysInstancedWEBGL(n, c, 0, h, 0, f, 0, u);
      let g = 0;
      for (let v = 0; v < u; v++)
        g += h[v] * f[v];
      e.update(g, n, 1);
    }
  }
  this.setMode = r, this.render = s, this.renderInstances = a, this.renderMultiDraw = o, this.renderMultiDrawInstances = l;
}
function _p(i, t, e, n) {
  let r;
  function s() {
    if (r !== void 0) return r;
    if (t.has("EXT_texture_filter_anisotropic") === !0) {
      const R = t.get("EXT_texture_filter_anisotropic");
      r = i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    } else
      r = 0;
    return r;
  }
  function a(R) {
    return !(R !== $e && n.convert(R) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT));
  }
  function o(R) {
    const U = R === ji && (t.has("EXT_color_buffer_half_float") || t.has("EXT_color_buffer_float"));
    return !(R !== nn && n.convert(R) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE) && // Edge and Chrome Mac < 52 (#9513)
    R !== tn && !U);
  }
  function l(R) {
    if (R === "highp") {
      if (i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.HIGH_FLOAT).precision > 0 && i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.HIGH_FLOAT).precision > 0)
        return "highp";
      R = "mediump";
    }
    return R === "mediump" && i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.MEDIUM_FLOAT).precision > 0 && i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
  }
  let c = e.precision !== void 0 ? e.precision : "highp";
  const h = l(c);
  h !== c && (console.warn("THREE.WebGLRenderer:", c, "not supported, using", h, "instead."), c = h);
  const u = e.logarithmicDepthBuffer === !0, f = e.reverseDepthBuffer === !0 && t.has("EXT_clip_control"), d = i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS), g = i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS), v = i.getParameter(i.MAX_TEXTURE_SIZE), m = i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE), p = i.getParameter(i.MAX_VERTEX_ATTRIBS), A = i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS), T = i.getParameter(i.MAX_VARYING_VECTORS), S = i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS), N = g > 0, w = i.getParameter(i.MAX_SAMPLES);
  return {
    isWebGL2: !0,
    // keeping this for backwards compatibility
    getMaxAnisotropy: s,
    getMaxPrecision: l,
    textureFormatReadable: a,
    textureTypeReadable: o,
    precision: c,
    logarithmicDepthBuffer: u,
    reverseDepthBuffer: f,
    maxTextures: d,
    maxVertexTextures: g,
    maxTextureSize: v,
    maxCubemapSize: m,
    maxAttributes: p,
    maxVertexUniforms: A,
    maxVaryings: T,
    maxFragmentUniforms: S,
    vertexTextures: N,
    maxSamples: w
  };
}
function vp(i) {
  const t = this;
  let e = null, n = 0, r = !1, s = !1;
  const a = new Bn(), o = new Lt(), l = { value: null, needsUpdate: !1 };
  this.uniform = l, this.numPlanes = 0, this.numIntersection = 0, this.init = function(u, f) {
    const d = u.length !== 0 || f || // enable state of previous frame - the clipping code has to
    // run another frame in order to reset the state:
    n !== 0 || r;
    return r = f, n = u.length, d;
  }, this.beginShadows = function() {
    s = !0, h(null);
  }, this.endShadows = function() {
    s = !1;
  }, this.setGlobalState = function(u, f) {
    e = h(u, f, 0);
  }, this.setState = function(u, f, d) {
    const g = u.clippingPlanes, v = u.clipIntersection, m = u.clipShadows, p = i.get(u);
    if (!r || g === null || g.length === 0 || s && !m)
      s ? h(null) : c();
    else {
      const A = s ? 0 : n, T = A * 4;
      let S = p.clippingState || null;
      l.value = S, S = h(g, f, T, d);
      for (let N = 0; N !== T; ++N)
        S[N] = e[N];
      p.clippingState = S, this.numIntersection = v ? this.numPlanes : 0, this.numPlanes += A;
    }
  };
  function c() {
    l.value !== e && (l.value = e, l.needsUpdate = n > 0), t.numPlanes = n, t.numIntersection = 0;
  }
  function h(u, f, d, g) {
    const v = u !== null ? u.length : 0;
    let m = null;
    if (v !== 0) {
      if (m = l.value, g !== !0 || m === null) {
        const p = d + v * 4, A = f.matrixWorldInverse;
        o.getNormalMatrix(A), (m === null || m.length < p) && (m = new Float32Array(p));
        for (let T = 0, S = d; T !== v; ++T, S += 4)
          a.copy(u[T]).applyMatrix4(A, o), a.normal.toArray(m, S), m[S + 3] = a.constant;
      }
      l.value = m, l.needsUpdate = !0;
    }
    return t.numPlanes = v, t.numIntersection = 0, m;
  }
}
function xp(i) {
  let t = /* @__PURE__ */ new WeakMap();
  function e(a, o) {
    return o === ks ? a.mapping = vi : o === Vs && (a.mapping = xi), a;
  }
  function n(a) {
    if (a && a.isTexture) {
      const o = a.mapping;
      if (o === ks || o === Vs)
        if (t.has(a)) {
          const l = t.get(a).texture;
          return e(l, a.mapping);
        } else {
          const l = a.image;
          if (l && l.height > 0) {
            const c = new Nh(l.height);
            return c.fromEquirectangularTexture(i, a), t.set(a, c), a.addEventListener("dispose", r), e(c.texture, a.mapping);
          } else
            return null;
        }
    }
    return a;
  }
  function r(a) {
    const o = a.target;
    o.removeEventListener("dispose", r);
    const l = t.get(o);
    l !== void 0 && (t.delete(o), l.dispose());
  }
  function s() {
    t = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: n,
    dispose: s
  };
}
const pi = 4, Ro = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582], kn = 20, Es = /* @__PURE__ */ new Kl(), Co = /* @__PURE__ */ new Ft();
let Ts = null, As = 0, bs = 0, ws = !1;
const zn = (1 + Math.sqrt(5)) / 2, ui = 1 / zn, Po = [
  /* @__PURE__ */ new I(-zn, ui, 0),
  /* @__PURE__ */ new I(zn, ui, 0),
  /* @__PURE__ */ new I(-ui, 0, zn),
  /* @__PURE__ */ new I(ui, 0, zn),
  /* @__PURE__ */ new I(0, zn, -ui),
  /* @__PURE__ */ new I(0, zn, ui),
  /* @__PURE__ */ new I(-1, 1, -1),
  /* @__PURE__ */ new I(1, 1, -1),
  /* @__PURE__ */ new I(-1, 1, 1),
  /* @__PURE__ */ new I(1, 1, 1)
], Mp = /* @__PURE__ */ new I();
class Lo {
  /**
   * Constructs a new PMREM generator.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   */
  constructor(t) {
    this._renderer = t, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._lodPlanes = [], this._sizeLods = [], this._sigmas = [], this._blurMaterial = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._compileMaterial(this._blurMaterial);
  }
  /**
   * Generates a PMREM from a supplied Scene, which can be faster than using an
   * image if networking bandwidth is low. Optional sigma specifies a blur radius
   * in radians to be applied to the scene before PMREM generation. Optional near
   * and far planes ensure the scene is rendered in its entirety.
   *
   * @param {Scene} scene - The scene to be captured.
   * @param {number} [sigma=0] - The blur radius in radians.
   * @param {number} [near=0.1] - The near plane distance.
   * @param {number} [far=100] - The far plane distance.
   * @param {Object} [options={}] - The configuration options.
   * @param {number} [options.size=256] - The texture size of the PMREM.
   * @param {Vector3} [options.renderTarget=origin] - The position of the internal cube camera that renders the scene.
   * @return {WebGLRenderTarget} The resulting PMREM.
   */
  fromScene(t, e = 0, n = 0.1, r = 100, s = {}) {
    const {
      size: a = 256,
      position: o = Mp
    } = s;
    Ts = this._renderer.getRenderTarget(), As = this._renderer.getActiveCubeFace(), bs = this._renderer.getActiveMipmapLevel(), ws = this._renderer.xr.enabled, this._renderer.xr.enabled = !1, this._setSize(a);
    const l = this._allocateTargets();
    return l.depthBuffer = !0, this._sceneToCubeUV(t, n, r, l, o), e > 0 && this._blur(l, 0, 0, e), this._applyPMREM(l), this._cleanup(l), l;
  }
  /**
   * Generates a PMREM from an equirectangular texture, which can be either LDR
   * or HDR. The ideal input image size is 1k (1024 x 512),
   * as this matches best with the 256 x 256 cubemap output.
   *
   * @param {Texture} equirectangular - The equirectangular texture to be converted.
   * @param {?WebGLRenderTarget} [renderTarget=null] - The render target to use.
   * @return {WebGLRenderTarget} The resulting PMREM.
   */
  fromEquirectangular(t, e = null) {
    return this._fromTexture(t, e);
  }
  /**
   * Generates a PMREM from an cubemap texture, which can be either LDR
   * or HDR. The ideal input cube size is 256 x 256,
   * as this matches best with the 256 x 256 cubemap output.
   *
   * @param {Texture} cubemap - The cubemap texture to be converted.
   * @param {?WebGLRenderTarget} [renderTarget=null] - The render target to use.
   * @return {WebGLRenderTarget} The resulting PMREM.
   */
  fromCubemap(t, e = null) {
    return this._fromTexture(t, e);
  }
  /**
   * Pre-compiles the cubemap shader. You can get faster start-up by invoking this method during
   * your texture's network fetch for increased concurrency.
   */
  compileCubemapShader() {
    this._cubemapMaterial === null && (this._cubemapMaterial = Uo(), this._compileMaterial(this._cubemapMaterial));
  }
  /**
   * Pre-compiles the equirectangular shader. You can get faster start-up by invoking this method during
   * your texture's network fetch for increased concurrency.
   */
  compileEquirectangularShader() {
    this._equirectMaterial === null && (this._equirectMaterial = Io(), this._compileMaterial(this._equirectMaterial));
  }
  /**
   * Disposes of the PMREMGenerator's internal memory. Note that PMREMGenerator is a static class,
   * so you should not need more than one PMREMGenerator object. If you do, calling dispose() on
   * one of them will cause any others to also become unusable.
   */
  dispose() {
    this._dispose(), this._cubemapMaterial !== null && this._cubemapMaterial.dispose(), this._equirectMaterial !== null && this._equirectMaterial.dispose();
  }
  // private interface
  _setSize(t) {
    this._lodMax = Math.floor(Math.log2(t)), this._cubeSize = Math.pow(2, this._lodMax);
  }
  _dispose() {
    this._blurMaterial !== null && this._blurMaterial.dispose(), this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
    for (let t = 0; t < this._lodPlanes.length; t++)
      this._lodPlanes[t].dispose();
  }
  _cleanup(t) {
    this._renderer.setRenderTarget(Ts, As, bs), this._renderer.xr.enabled = ws, t.scissorTest = !1, Rr(t, 0, 0, t.width, t.height);
  }
  _fromTexture(t, e) {
    t.mapping === vi || t.mapping === xi ? this._setSize(t.image.length === 0 ? 16 : t.image[0].width || t.image[0].image.width) : this._setSize(t.image.width / 4), Ts = this._renderer.getRenderTarget(), As = this._renderer.getActiveCubeFace(), bs = this._renderer.getActiveMipmapLevel(), ws = this._renderer.xr.enabled, this._renderer.xr.enabled = !1;
    const n = e || this._allocateTargets();
    return this._textureToCubeUV(t, n), this._applyPMREM(n), this._cleanup(n), n;
  }
  _allocateTargets() {
    const t = 3 * Math.max(this._cubeSize, 112), e = 4 * this._cubeSize, n = {
      magFilter: ye,
      minFilter: ye,
      generateMipmaps: !1,
      type: ji,
      format: $e,
      colorSpace: Mi,
      depthBuffer: !1
    }, r = Do(t, e, n);
    if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== t || this._pingPongRenderTarget.height !== e) {
      this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = Do(t, e, n);
      const { _lodMax: s } = this;
      ({ sizeLods: this._sizeLods, lodPlanes: this._lodPlanes, sigmas: this._sigmas } = Sp(s)), this._blurMaterial = yp(s, t, e);
    }
    return r;
  }
  _compileMaterial(t) {
    const e = new Kt(this._lodPlanes[0], t);
    this._renderer.compile(e, Es);
  }
  _sceneToCubeUV(t, e, n, r, s) {
    const l = new He(90, 1, e, n), c = [1, -1, 1, 1, 1, 1], h = [1, 1, 1, -1, -1, -1], u = this._renderer, f = u.autoClear, d = u.toneMapping;
    u.getClearColor(Co), u.toneMapping = wn, u.autoClear = !1;
    const g = new Re({
      name: "PMREM.Background",
      side: Ce,
      depthWrite: !1,
      depthTest: !1
    }), v = new Kt(new pe(), g);
    let m = !1;
    const p = t.background;
    p ? p.isColor && (g.color.copy(p), t.background = null, m = !0) : (g.color.copy(Co), m = !0);
    for (let A = 0; A < 6; A++) {
      const T = A % 3;
      T === 0 ? (l.up.set(0, c[A], 0), l.position.set(s.x, s.y, s.z), l.lookAt(s.x + h[A], s.y, s.z)) : T === 1 ? (l.up.set(0, 0, c[A]), l.position.set(s.x, s.y, s.z), l.lookAt(s.x, s.y + h[A], s.z)) : (l.up.set(0, c[A], 0), l.position.set(s.x, s.y, s.z), l.lookAt(s.x, s.y, s.z + h[A]));
      const S = this._cubeSize;
      Rr(r, T * S, A > 2 ? S : 0, S, S), u.setRenderTarget(r), m && u.render(v, l), u.render(t, l);
    }
    v.geometry.dispose(), v.material.dispose(), u.toneMapping = d, u.autoClear = f, t.background = p;
  }
  _textureToCubeUV(t, e) {
    const n = this._renderer, r = t.mapping === vi || t.mapping === xi;
    r ? (this._cubemapMaterial === null && (this._cubemapMaterial = Uo()), this._cubemapMaterial.uniforms.flipEnvMap.value = t.isRenderTargetTexture === !1 ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = Io());
    const s = r ? this._cubemapMaterial : this._equirectMaterial, a = new Kt(this._lodPlanes[0], s), o = s.uniforms;
    o.envMap.value = t;
    const l = this._cubeSize;
    Rr(e, 0, 0, 3 * l, 2 * l), n.setRenderTarget(e), n.render(a, Es);
  }
  _applyPMREM(t) {
    const e = this._renderer, n = e.autoClear;
    e.autoClear = !1;
    const r = this._lodPlanes.length;
    for (let s = 1; s < r; s++) {
      const a = Math.sqrt(this._sigmas[s] * this._sigmas[s] - this._sigmas[s - 1] * this._sigmas[s - 1]), o = Po[(r - s - 1) % Po.length];
      this._blur(t, s - 1, s, a, o);
    }
    e.autoClear = n;
  }
  /**
   * This is a two-pass Gaussian blur for a cubemap. Normally this is done
   * vertically and horizontally, but this breaks down on a cube. Here we apply
   * the blur latitudinally (around the poles), and then longitudinally (towards
   * the poles) to approximate the orthogonally-separable blur. It is least
   * accurate at the poles, but still does a decent job.
   *
   * @private
   * @param {WebGLRenderTarget} cubeUVRenderTarget
   * @param {number} lodIn
   * @param {number} lodOut
   * @param {number} sigma
   * @param {Vector3} [poleAxis]
   */
  _blur(t, e, n, r, s) {
    const a = this._pingPongRenderTarget;
    this._halfBlur(
      t,
      a,
      e,
      n,
      r,
      "latitudinal",
      s
    ), this._halfBlur(
      a,
      t,
      n,
      n,
      r,
      "longitudinal",
      s
    );
  }
  _halfBlur(t, e, n, r, s, a, o) {
    const l = this._renderer, c = this._blurMaterial;
    a !== "latitudinal" && a !== "longitudinal" && console.error(
      "blur direction must be either latitudinal or longitudinal!"
    );
    const h = 3, u = new Kt(this._lodPlanes[r], c), f = c.uniforms, d = this._sizeLods[n] - 1, g = isFinite(s) ? Math.PI / (2 * d) : 2 * Math.PI / (2 * kn - 1), v = s / g, m = isFinite(s) ? 1 + Math.floor(h * v) : kn;
    m > kn && console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${kn}`);
    const p = [];
    let A = 0;
    for (let R = 0; R < kn; ++R) {
      const U = R / v, y = Math.exp(-U * U / 2);
      p.push(y), R === 0 ? A += y : R < m && (A += 2 * y);
    }
    for (let R = 0; R < p.length; R++)
      p[R] = p[R] / A;
    f.envMap.value = t.texture, f.samples.value = m, f.weights.value = p, f.latitudinal.value = a === "latitudinal", o && (f.poleAxis.value = o);
    const { _lodMax: T } = this;
    f.dTheta.value = g, f.mipInt.value = T - n;
    const S = this._sizeLods[r], N = 3 * S * (r > T - pi ? r - T + pi : 0), w = 4 * (this._cubeSize - S);
    Rr(e, N, w, 3 * S, 2 * S), l.setRenderTarget(e), l.render(u, Es);
  }
}
function Sp(i) {
  const t = [], e = [], n = [];
  let r = i;
  const s = i - pi + 1 + Ro.length;
  for (let a = 0; a < s; a++) {
    const o = Math.pow(2, r);
    e.push(o);
    let l = 1 / o;
    a > i - pi ? l = Ro[a - i + pi - 1] : a === 0 && (l = 0), n.push(l);
    const c = 1 / (o - 2), h = -c, u = 1 + c, f = [h, h, u, h, u, u, h, h, u, u, h, u], d = 6, g = 6, v = 3, m = 2, p = 1, A = new Float32Array(v * g * d), T = new Float32Array(m * g * d), S = new Float32Array(p * g * d);
    for (let w = 0; w < d; w++) {
      const R = w % 3 * 2 / 3 - 1, U = w > 2 ? 0 : -1, y = [
        R,
        U,
        0,
        R + 2 / 3,
        U,
        0,
        R + 2 / 3,
        U + 1,
        0,
        R,
        U,
        0,
        R + 2 / 3,
        U + 1,
        0,
        R,
        U + 1,
        0
      ];
      A.set(y, v * g * w), T.set(f, m * g * w);
      const M = [w, w, w, w, w, w];
      S.set(M, p * g * w);
    }
    const N = new vn();
    N.setAttribute("position", new Ze(A, v)), N.setAttribute("uv", new Ze(T, m)), N.setAttribute("faceIndex", new Ze(S, p)), t.push(N), r > pi && r--;
  }
  return { lodPlanes: t, sizeLods: e, sigmas: n };
}
function Do(i, t, e) {
  const n = new Yn(i, t, e);
  return n.texture.mapping = Wr, n.texture.name = "PMREM.cubeUv", n.scissorTest = !0, n;
}
function Rr(i, t, e, n, r) {
  i.viewport.set(t, e, n, r), i.scissor.set(t, e, n, r);
}
function yp(i, t, e) {
  const n = new Float32Array(kn), r = new I(0, 1, 0);
  return new Cn({
    name: "SphericalGaussianBlur",
    defines: {
      n: kn,
      CUBEUV_TEXEL_WIDTH: 1 / t,
      CUBEUV_TEXEL_HEIGHT: 1 / e,
      CUBEUV_MAX_MIP: `${i}.0`
    },
    uniforms: {
      envMap: { value: null },
      samples: { value: 1 },
      weights: { value: n },
      latitudinal: { value: !1 },
      dTheta: { value: 0 },
      mipInt: { value: 0 },
      poleAxis: { value: r }
    },
    vertexShader: Fa(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`
    ),
    blending: bn,
    depthTest: !1,
    depthWrite: !1
  });
}
function Io() {
  return new Cn({
    name: "EquirectangularToCubeUV",
    uniforms: {
      envMap: { value: null }
    },
    vertexShader: Fa(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`
    ),
    blending: bn,
    depthTest: !1,
    depthWrite: !1
  });
}
function Uo() {
  return new Cn({
    name: "CubemapToCubeUV",
    uniforms: {
      envMap: { value: null },
      flipEnvMap: { value: -1 }
    },
    vertexShader: Fa(),
    fragmentShader: (
      /* glsl */
      `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`
    ),
    blending: bn,
    depthTest: !1,
    depthWrite: !1
  });
}
function Fa() {
  return (
    /* glsl */
    `

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`
  );
}
function Ep(i) {
  let t = /* @__PURE__ */ new WeakMap(), e = null;
  function n(o) {
    if (o && o.isTexture) {
      const l = o.mapping, c = l === ks || l === Vs, h = l === vi || l === xi;
      if (c || h) {
        let u = t.get(o);
        const f = u !== void 0 ? u.texture.pmremVersion : 0;
        if (o.isRenderTargetTexture && o.pmremVersion !== f)
          return e === null && (e = new Lo(i)), u = c ? e.fromEquirectangular(o, u) : e.fromCubemap(o, u), u.texture.pmremVersion = o.pmremVersion, t.set(o, u), u.texture;
        if (u !== void 0)
          return u.texture;
        {
          const d = o.image;
          return c && d && d.height > 0 || h && d && r(d) ? (e === null && (e = new Lo(i)), u = c ? e.fromEquirectangular(o) : e.fromCubemap(o), u.texture.pmremVersion = o.pmremVersion, t.set(o, u), o.addEventListener("dispose", s), u.texture) : null;
        }
      }
    }
    return o;
  }
  function r(o) {
    let l = 0;
    const c = 6;
    for (let h = 0; h < c; h++)
      o[h] !== void 0 && l++;
    return l === c;
  }
  function s(o) {
    const l = o.target;
    l.removeEventListener("dispose", s);
    const c = t.get(l);
    c !== void 0 && (t.delete(l), c.dispose());
  }
  function a() {
    t = /* @__PURE__ */ new WeakMap(), e !== null && (e.dispose(), e = null);
  }
  return {
    get: n,
    dispose: a
  };
}
function Tp(i) {
  const t = {};
  function e(n) {
    if (t[n] !== void 0)
      return t[n];
    let r;
    switch (n) {
      case "WEBGL_depth_texture":
        r = i.getExtension("WEBGL_depth_texture") || i.getExtension("MOZ_WEBGL_depth_texture") || i.getExtension("WEBKIT_WEBGL_depth_texture");
        break;
      case "EXT_texture_filter_anisotropic":
        r = i.getExtension("EXT_texture_filter_anisotropic") || i.getExtension("MOZ_EXT_texture_filter_anisotropic") || i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
        break;
      case "WEBGL_compressed_texture_s3tc":
        r = i.getExtension("WEBGL_compressed_texture_s3tc") || i.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
        break;
      case "WEBGL_compressed_texture_pvrtc":
        r = i.getExtension("WEBGL_compressed_texture_pvrtc") || i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
        break;
      default:
        r = i.getExtension(n);
    }
    return t[n] = r, r;
  }
  return {
    has: function(n) {
      return e(n) !== null;
    },
    init: function() {
      e("EXT_color_buffer_float"), e("WEBGL_clip_cull_distance"), e("OES_texture_float_linear"), e("EXT_color_buffer_half_float"), e("WEBGL_multisampled_render_to_texture"), e("WEBGL_render_shared_exponent");
    },
    get: function(n) {
      const r = e(n);
      return r === null && Or("THREE.WebGLRenderer: " + n + " extension not supported."), r;
    }
  };
}
function Ap(i, t, e, n) {
  const r = {}, s = /* @__PURE__ */ new WeakMap();
  function a(u) {
    const f = u.target;
    f.index !== null && t.remove(f.index);
    for (const g in f.attributes)
      t.remove(f.attributes[g]);
    f.removeEventListener("dispose", a), delete r[f.id];
    const d = s.get(f);
    d && (t.remove(d), s.delete(f)), n.releaseStatesOfGeometry(f), f.isInstancedBufferGeometry === !0 && delete f._maxInstanceCount, e.memory.geometries--;
  }
  function o(u, f) {
    return r[f.id] === !0 || (f.addEventListener("dispose", a), r[f.id] = !0, e.memory.geometries++), f;
  }
  function l(u) {
    const f = u.attributes;
    for (const d in f)
      t.update(f[d], i.ARRAY_BUFFER);
  }
  function c(u) {
    const f = [], d = u.index, g = u.attributes.position;
    let v = 0;
    if (d !== null) {
      const A = d.array;
      v = d.version;
      for (let T = 0, S = A.length; T < S; T += 3) {
        const N = A[T + 0], w = A[T + 1], R = A[T + 2];
        f.push(N, w, w, R, R, N);
      }
    } else if (g !== void 0) {
      const A = g.array;
      v = g.version;
      for (let T = 0, S = A.length / 3 - 1; T < S; T += 3) {
        const N = T + 0, w = T + 1, R = T + 2;
        f.push(N, w, w, R, R, N);
      }
    } else
      return;
    const m = new (Pl(f) ? Nl : Ul)(f, 1);
    m.version = v;
    const p = s.get(u);
    p && t.remove(p), s.set(u, m);
  }
  function h(u) {
    const f = s.get(u);
    if (f) {
      const d = u.index;
      d !== null && f.version < d.version && c(u);
    } else
      c(u);
    return s.get(u);
  }
  return {
    get: o,
    update: l,
    getWireframeAttribute: h
  };
}
function bp(i, t, e) {
  let n;
  function r(f) {
    n = f;
  }
  let s, a;
  function o(f) {
    s = f.type, a = f.bytesPerElement;
  }
  function l(f, d) {
    i.drawElements(n, d, s, f * a), e.update(d, n, 1);
  }
  function c(f, d, g) {
    g !== 0 && (i.drawElementsInstanced(n, d, s, f * a, g), e.update(d, n, g));
  }
  function h(f, d, g) {
    if (g === 0) return;
    t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n, d, 0, s, f, 0, g);
    let m = 0;
    for (let p = 0; p < g; p++)
      m += d[p];
    e.update(m, n, 1);
  }
  function u(f, d, g, v) {
    if (g === 0) return;
    const m = t.get("WEBGL_multi_draw");
    if (m === null)
      for (let p = 0; p < f.length; p++)
        c(f[p] / a, d[p], v[p]);
    else {
      m.multiDrawElementsInstancedWEBGL(n, d, 0, s, f, 0, v, 0, g);
      let p = 0;
      for (let A = 0; A < g; A++)
        p += d[A] * v[A];
      e.update(p, n, 1);
    }
  }
  this.setMode = r, this.setIndex = o, this.render = l, this.renderInstances = c, this.renderMultiDraw = h, this.renderMultiDrawInstances = u;
}
function wp(i) {
  const t = {
    geometries: 0,
    textures: 0
  }, e = {
    frame: 0,
    calls: 0,
    triangles: 0,
    points: 0,
    lines: 0
  };
  function n(s, a, o) {
    switch (e.calls++, a) {
      case i.TRIANGLES:
        e.triangles += o * (s / 3);
        break;
      case i.LINES:
        e.lines += o * (s / 2);
        break;
      case i.LINE_STRIP:
        e.lines += o * (s - 1);
        break;
      case i.LINE_LOOP:
        e.lines += o * s;
        break;
      case i.POINTS:
        e.points += o * s;
        break;
      default:
        console.error("THREE.WebGLInfo: Unknown draw mode:", a);
        break;
    }
  }
  function r() {
    e.calls = 0, e.triangles = 0, e.points = 0, e.lines = 0;
  }
  return {
    memory: t,
    render: e,
    programs: null,
    autoReset: !0,
    reset: r,
    update: n
  };
}
function Rp(i, t, e) {
  const n = /* @__PURE__ */ new WeakMap(), r = new se();
  function s(a, o, l) {
    const c = a.morphTargetInfluences, h = o.morphAttributes.position || o.morphAttributes.normal || o.morphAttributes.color, u = h !== void 0 ? h.length : 0;
    let f = n.get(o);
    if (f === void 0 || f.count !== u) {
      let y = function() {
        R.dispose(), n.delete(o), o.removeEventListener("dispose", y);
      };
      f !== void 0 && f.texture.dispose();
      const d = o.morphAttributes.position !== void 0, g = o.morphAttributes.normal !== void 0, v = o.morphAttributes.color !== void 0, m = o.morphAttributes.position || [], p = o.morphAttributes.normal || [], A = o.morphAttributes.color || [];
      let T = 0;
      d === !0 && (T = 1), g === !0 && (T = 2), v === !0 && (T = 3);
      let S = o.attributes.position.count * T, N = 1;
      S > t.maxTextureSize && (N = Math.ceil(S / t.maxTextureSize), S = t.maxTextureSize);
      const w = new Float32Array(S * N * 4 * u), R = new Ll(w, S, N, u);
      R.type = tn, R.needsUpdate = !0;
      const U = T * 4;
      for (let M = 0; M < u; M++) {
        const C = m[M], H = p[M], B = A[M], G = S * N * 4 * M;
        for (let Z = 0; Z < C.count; Z++) {
          const W = Z * U;
          d === !0 && (r.fromBufferAttribute(C, Z), w[G + W + 0] = r.x, w[G + W + 1] = r.y, w[G + W + 2] = r.z, w[G + W + 3] = 0), g === !0 && (r.fromBufferAttribute(H, Z), w[G + W + 4] = r.x, w[G + W + 5] = r.y, w[G + W + 6] = r.z, w[G + W + 7] = 0), v === !0 && (r.fromBufferAttribute(B, Z), w[G + W + 8] = r.x, w[G + W + 9] = r.y, w[G + W + 10] = r.z, w[G + W + 11] = B.itemSize === 4 ? r.w : 1);
        }
      }
      f = {
        count: u,
        texture: R,
        size: new mt(S, N)
      }, n.set(o, f), o.addEventListener("dispose", y);
    }
    if (a.isInstancedMesh === !0 && a.morphTexture !== null)
      l.getUniforms().setValue(i, "morphTexture", a.morphTexture, e);
    else {
      let d = 0;
      for (let v = 0; v < c.length; v++)
        d += c[v];
      const g = o.morphTargetsRelative ? 1 : 1 - d;
      l.getUniforms().setValue(i, "morphTargetBaseInfluence", g), l.getUniforms().setValue(i, "morphTargetInfluences", c);
    }
    l.getUniforms().setValue(i, "morphTargetsTexture", f.texture, e), l.getUniforms().setValue(i, "morphTargetsTextureSize", f.size);
  }
  return {
    update: s
  };
}
function Cp(i, t, e, n) {
  let r = /* @__PURE__ */ new WeakMap();
  function s(l) {
    const c = n.render.frame, h = l.geometry, u = t.get(l, h);
    if (r.get(u) !== c && (t.update(u), r.set(u, c)), l.isInstancedMesh && (l.hasEventListener("dispose", o) === !1 && l.addEventListener("dispose", o), r.get(l) !== c && (e.update(l.instanceMatrix, i.ARRAY_BUFFER), l.instanceColor !== null && e.update(l.instanceColor, i.ARRAY_BUFFER), r.set(l, c))), l.isSkinnedMesh) {
      const f = l.skeleton;
      r.get(f) !== c && (f.update(), r.set(f, c));
    }
    return u;
  }
  function a() {
    r = /* @__PURE__ */ new WeakMap();
  }
  function o(l) {
    const c = l.target;
    c.removeEventListener("dispose", o), e.remove(c.instanceMatrix), c.instanceColor !== null && e.remove(c.instanceColor);
  }
  return {
    update: s,
    dispose: a
  };
}
const Ql = /* @__PURE__ */ new ge(), No = /* @__PURE__ */ new Hl(1, 1), tc = /* @__PURE__ */ new Ll(), ec = /* @__PURE__ */ new _h(), nc = /* @__PURE__ */ new Bl(), Fo = [], Oo = [], Bo = new Float32Array(16), zo = new Float32Array(9), Ho = new Float32Array(4);
function bi(i, t, e) {
  const n = i[0];
  if (n <= 0 || n > 0) return i;
  const r = t * e;
  let s = Fo[r];
  if (s === void 0 && (s = new Float32Array(r), Fo[r] = s), t !== 0) {
    n.toArray(s, 0);
    for (let a = 1, o = 0; a !== t; ++a)
      o += e, i[a].toArray(s, o);
  }
  return s;
}
function he(i, t) {
  if (i.length !== t.length) return !1;
  for (let e = 0, n = i.length; e < n; e++)
    if (i[e] !== t[e]) return !1;
  return !0;
}
function ue(i, t) {
  for (let e = 0, n = t.length; e < n; e++)
    i[e] = t[e];
}
function Xr(i, t) {
  let e = Oo[t];
  e === void 0 && (e = new Int32Array(t), Oo[t] = e);
  for (let n = 0; n !== t; ++n)
    e[n] = i.allocateTextureUnit();
  return e;
}
function Pp(i, t) {
  const e = this.cache;
  e[0] !== t && (i.uniform1f(this.addr, t), e[0] = t);
}
function Lp(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) && (i.uniform2f(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);
  else {
    if (he(e, t)) return;
    i.uniform2fv(this.addr, t), ue(e, t);
  }
}
function Dp(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (i.uniform3f(this.addr, t.x, t.y, t.z), e[0] = t.x, e[1] = t.y, e[2] = t.z);
  else if (t.r !== void 0)
    (e[0] !== t.r || e[1] !== t.g || e[2] !== t.b) && (i.uniform3f(this.addr, t.r, t.g, t.b), e[0] = t.r, e[1] = t.g, e[2] = t.b);
  else {
    if (he(e, t)) return;
    i.uniform3fv(this.addr, t), ue(e, t);
  }
}
function Ip(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (i.uniform4f(this.addr, t.x, t.y, t.z, t.w), e[0] = t.x, e[1] = t.y, e[2] = t.z, e[3] = t.w);
  else {
    if (he(e, t)) return;
    i.uniform4fv(this.addr, t), ue(e, t);
  }
}
function Up(i, t) {
  const e = this.cache, n = t.elements;
  if (n === void 0) {
    if (he(e, t)) return;
    i.uniformMatrix2fv(this.addr, !1, t), ue(e, t);
  } else {
    if (he(e, n)) return;
    Ho.set(n), i.uniformMatrix2fv(this.addr, !1, Ho), ue(e, n);
  }
}
function Np(i, t) {
  const e = this.cache, n = t.elements;
  if (n === void 0) {
    if (he(e, t)) return;
    i.uniformMatrix3fv(this.addr, !1, t), ue(e, t);
  } else {
    if (he(e, n)) return;
    zo.set(n), i.uniformMatrix3fv(this.addr, !1, zo), ue(e, n);
  }
}
function Fp(i, t) {
  const e = this.cache, n = t.elements;
  if (n === void 0) {
    if (he(e, t)) return;
    i.uniformMatrix4fv(this.addr, !1, t), ue(e, t);
  } else {
    if (he(e, n)) return;
    Bo.set(n), i.uniformMatrix4fv(this.addr, !1, Bo), ue(e, n);
  }
}
function Op(i, t) {
  const e = this.cache;
  e[0] !== t && (i.uniform1i(this.addr, t), e[0] = t);
}
function Bp(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) && (i.uniform2i(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);
  else {
    if (he(e, t)) return;
    i.uniform2iv(this.addr, t), ue(e, t);
  }
}
function zp(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (i.uniform3i(this.addr, t.x, t.y, t.z), e[0] = t.x, e[1] = t.y, e[2] = t.z);
  else {
    if (he(e, t)) return;
    i.uniform3iv(this.addr, t), ue(e, t);
  }
}
function Hp(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (i.uniform4i(this.addr, t.x, t.y, t.z, t.w), e[0] = t.x, e[1] = t.y, e[2] = t.z, e[3] = t.w);
  else {
    if (he(e, t)) return;
    i.uniform4iv(this.addr, t), ue(e, t);
  }
}
function kp(i, t) {
  const e = this.cache;
  e[0] !== t && (i.uniform1ui(this.addr, t), e[0] = t);
}
function Vp(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) && (i.uniform2ui(this.addr, t.x, t.y), e[0] = t.x, e[1] = t.y);
  else {
    if (he(e, t)) return;
    i.uniform2uiv(this.addr, t), ue(e, t);
  }
}
function Gp(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) && (i.uniform3ui(this.addr, t.x, t.y, t.z), e[0] = t.x, e[1] = t.y, e[2] = t.z);
  else {
    if (he(e, t)) return;
    i.uniform3uiv(this.addr, t), ue(e, t);
  }
}
function Wp(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) && (i.uniform4ui(this.addr, t.x, t.y, t.z, t.w), e[0] = t.x, e[1] = t.y, e[2] = t.z, e[3] = t.w);
  else {
    if (he(e, t)) return;
    i.uniform4uiv(this.addr, t), ue(e, t);
  }
}
function Xp(i, t, e) {
  const n = this.cache, r = e.allocateTextureUnit();
  n[0] !== r && (i.uniform1i(this.addr, r), n[0] = r);
  let s;
  this.type === i.SAMPLER_2D_SHADOW ? (No.compareFunction = Cl, s = No) : s = Ql, e.setTexture2D(t || s, r);
}
function qp(i, t, e) {
  const n = this.cache, r = e.allocateTextureUnit();
  n[0] !== r && (i.uniform1i(this.addr, r), n[0] = r), e.setTexture3D(t || ec, r);
}
function Yp(i, t, e) {
  const n = this.cache, r = e.allocateTextureUnit();
  n[0] !== r && (i.uniform1i(this.addr, r), n[0] = r), e.setTextureCube(t || nc, r);
}
function $p(i, t, e) {
  const n = this.cache, r = e.allocateTextureUnit();
  n[0] !== r && (i.uniform1i(this.addr, r), n[0] = r), e.setTexture2DArray(t || tc, r);
}
function Zp(i) {
  switch (i) {
    case 5126:
      return Pp;
    // FLOAT
    case 35664:
      return Lp;
    // _VEC2
    case 35665:
      return Dp;
    // _VEC3
    case 35666:
      return Ip;
    // _VEC4
    case 35674:
      return Up;
    // _MAT2
    case 35675:
      return Np;
    // _MAT3
    case 35676:
      return Fp;
    // _MAT4
    case 5124:
    case 35670:
      return Op;
    // INT, BOOL
    case 35667:
    case 35671:
      return Bp;
    // _VEC2
    case 35668:
    case 35672:
      return zp;
    // _VEC3
    case 35669:
    case 35673:
      return Hp;
    // _VEC4
    case 5125:
      return kp;
    // UINT
    case 36294:
      return Vp;
    // _VEC2
    case 36295:
      return Gp;
    // _VEC3
    case 36296:
      return Wp;
    // _VEC4
    case 35678:
    // SAMPLER_2D
    case 36198:
    // SAMPLER_EXTERNAL_OES
    case 36298:
    // INT_SAMPLER_2D
    case 36306:
    // UNSIGNED_INT_SAMPLER_2D
    case 35682:
      return Xp;
    case 35679:
    // SAMPLER_3D
    case 36299:
    // INT_SAMPLER_3D
    case 36307:
      return qp;
    case 35680:
    // SAMPLER_CUBE
    case 36300:
    // INT_SAMPLER_CUBE
    case 36308:
    // UNSIGNED_INT_SAMPLER_CUBE
    case 36293:
      return Yp;
    case 36289:
    // SAMPLER_2D_ARRAY
    case 36303:
    // INT_SAMPLER_2D_ARRAY
    case 36311:
    // UNSIGNED_INT_SAMPLER_2D_ARRAY
    case 36292:
      return $p;
  }
}
function Jp(i, t) {
  i.uniform1fv(this.addr, t);
}
function Kp(i, t) {
  const e = bi(t, this.size, 2);
  i.uniform2fv(this.addr, e);
}
function jp(i, t) {
  const e = bi(t, this.size, 3);
  i.uniform3fv(this.addr, e);
}
function Qp(i, t) {
  const e = bi(t, this.size, 4);
  i.uniform4fv(this.addr, e);
}
function tm(i, t) {
  const e = bi(t, this.size, 4);
  i.uniformMatrix2fv(this.addr, !1, e);
}
function em(i, t) {
  const e = bi(t, this.size, 9);
  i.uniformMatrix3fv(this.addr, !1, e);
}
function nm(i, t) {
  const e = bi(t, this.size, 16);
  i.uniformMatrix4fv(this.addr, !1, e);
}
function im(i, t) {
  i.uniform1iv(this.addr, t);
}
function rm(i, t) {
  i.uniform2iv(this.addr, t);
}
function sm(i, t) {
  i.uniform3iv(this.addr, t);
}
function am(i, t) {
  i.uniform4iv(this.addr, t);
}
function om(i, t) {
  i.uniform1uiv(this.addr, t);
}
function lm(i, t) {
  i.uniform2uiv(this.addr, t);
}
function cm(i, t) {
  i.uniform3uiv(this.addr, t);
}
function hm(i, t) {
  i.uniform4uiv(this.addr, t);
}
function um(i, t, e) {
  const n = this.cache, r = t.length, s = Xr(e, r);
  he(n, s) || (i.uniform1iv(this.addr, s), ue(n, s));
  for (let a = 0; a !== r; ++a)
    e.setTexture2D(t[a] || Ql, s[a]);
}
function dm(i, t, e) {
  const n = this.cache, r = t.length, s = Xr(e, r);
  he(n, s) || (i.uniform1iv(this.addr, s), ue(n, s));
  for (let a = 0; a !== r; ++a)
    e.setTexture3D(t[a] || ec, s[a]);
}
function fm(i, t, e) {
  const n = this.cache, r = t.length, s = Xr(e, r);
  he(n, s) || (i.uniform1iv(this.addr, s), ue(n, s));
  for (let a = 0; a !== r; ++a)
    e.setTextureCube(t[a] || nc, s[a]);
}
function pm(i, t, e) {
  const n = this.cache, r = t.length, s = Xr(e, r);
  he(n, s) || (i.uniform1iv(this.addr, s), ue(n, s));
  for (let a = 0; a !== r; ++a)
    e.setTexture2DArray(t[a] || tc, s[a]);
}
function mm(i) {
  switch (i) {
    case 5126:
      return Jp;
    // FLOAT
    case 35664:
      return Kp;
    // _VEC2
    case 35665:
      return jp;
    // _VEC3
    case 35666:
      return Qp;
    // _VEC4
    case 35674:
      return tm;
    // _MAT2
    case 35675:
      return em;
    // _MAT3
    case 35676:
      return nm;
    // _MAT4
    case 5124:
    case 35670:
      return im;
    // INT, BOOL
    case 35667:
    case 35671:
      return rm;
    // _VEC2
    case 35668:
    case 35672:
      return sm;
    // _VEC3
    case 35669:
    case 35673:
      return am;
    // _VEC4
    case 5125:
      return om;
    // UINT
    case 36294:
      return lm;
    // _VEC2
    case 36295:
      return cm;
    // _VEC3
    case 36296:
      return hm;
    // _VEC4
    case 35678:
    // SAMPLER_2D
    case 36198:
    // SAMPLER_EXTERNAL_OES
    case 36298:
    // INT_SAMPLER_2D
    case 36306:
    // UNSIGNED_INT_SAMPLER_2D
    case 35682:
      return um;
    case 35679:
    // SAMPLER_3D
    case 36299:
    // INT_SAMPLER_3D
    case 36307:
      return dm;
    case 35680:
    // SAMPLER_CUBE
    case 36300:
    // INT_SAMPLER_CUBE
    case 36308:
    // UNSIGNED_INT_SAMPLER_CUBE
    case 36293:
      return fm;
    case 36289:
    // SAMPLER_2D_ARRAY
    case 36303:
    // INT_SAMPLER_2D_ARRAY
    case 36311:
    // UNSIGNED_INT_SAMPLER_2D_ARRAY
    case 36292:
      return pm;
  }
}
class gm {
  constructor(t, e, n) {
    this.id = t, this.addr = n, this.cache = [], this.type = e.type, this.setValue = Zp(e.type);
  }
}
class _m {
  constructor(t, e, n) {
    this.id = t, this.addr = n, this.cache = [], this.type = e.type, this.size = e.size, this.setValue = mm(e.type);
  }
}
class vm {
  constructor(t) {
    this.id = t, this.seq = [], this.map = {};
  }
  setValue(t, e, n) {
    const r = this.seq;
    for (let s = 0, a = r.length; s !== a; ++s) {
      const o = r[s];
      o.setValue(t, e[o.id], n);
    }
  }
}
const Rs = /(\w+)(\])?(\[|\.)?/g;
function ko(i, t) {
  i.seq.push(t), i.map[t.id] = t;
}
function xm(i, t, e) {
  const n = i.name, r = n.length;
  for (Rs.lastIndex = 0; ; ) {
    const s = Rs.exec(n), a = Rs.lastIndex;
    let o = s[1];
    const l = s[2] === "]", c = s[3];
    if (l && (o = o | 0), c === void 0 || c === "[" && a + 2 === r) {
      ko(e, c === void 0 ? new gm(o, i, t) : new _m(o, i, t));
      break;
    } else {
      let u = e.map[o];
      u === void 0 && (u = new vm(o), ko(e, u)), e = u;
    }
  }
}
class Br {
  constructor(t, e) {
    this.seq = [], this.map = {};
    const n = t.getProgramParameter(e, t.ACTIVE_UNIFORMS);
    for (let r = 0; r < n; ++r) {
      const s = t.getActiveUniform(e, r), a = t.getUniformLocation(e, s.name);
      xm(s, a, this);
    }
  }
  setValue(t, e, n, r) {
    const s = this.map[e];
    s !== void 0 && s.setValue(t, n, r);
  }
  setOptional(t, e, n) {
    const r = e[n];
    r !== void 0 && this.setValue(t, n, r);
  }
  static upload(t, e, n, r) {
    for (let s = 0, a = e.length; s !== a; ++s) {
      const o = e[s], l = n[o.id];
      l.needsUpdate !== !1 && o.setValue(t, l.value, r);
    }
  }
  static seqWithValue(t, e) {
    const n = [];
    for (let r = 0, s = t.length; r !== s; ++r) {
      const a = t[r];
      a.id in e && n.push(a);
    }
    return n;
  }
}
function Vo(i, t, e) {
  const n = i.createShader(t);
  return i.shaderSource(n, e), i.compileShader(n), n;
}
const Mm = 37297;
let Sm = 0;
function ym(i, t) {
  const e = i.split(`
`), n = [], r = Math.max(t - 6, 0), s = Math.min(t + 6, e.length);
  for (let a = r; a < s; a++) {
    const o = a + 1;
    n.push(`${o === t ? ">" : " "} ${o}: ${e[a]}`);
  }
  return n.join(`
`);
}
const Go = /* @__PURE__ */ new Lt();
function Em(i) {
  Gt._getMatrix(Go, Gt.workingColorSpace, i);
  const t = `mat3( ${Go.elements.map((e) => e.toFixed(4))} )`;
  switch (Gt.getTransfer(i)) {
    case Hr:
      return [t, "LinearTransferOETF"];
    case Zt:
      return [t, "sRGBTransferOETF"];
    default:
      return console.warn("THREE.WebGLProgram: Unsupported color space: ", i), [t, "LinearTransferOETF"];
  }
}
function Wo(i, t, e) {
  const n = i.getShaderParameter(t, i.COMPILE_STATUS), r = i.getShaderInfoLog(t).trim();
  if (n && r === "") return "";
  const s = /ERROR: 0:(\d+)/.exec(r);
  if (s) {
    const a = parseInt(s[1]);
    return e.toUpperCase() + `

` + r + `

` + ym(i.getShaderSource(t), a);
  } else
    return r;
}
function Tm(i, t) {
  const e = Em(t);
  return [
    `vec4 ${i}( vec4 value ) {`,
    `	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,
    "}"
  ].join(`
`);
}
function Am(i, t) {
  let e;
  switch (t) {
    case Wc:
      e = "Linear";
      break;
    case Xc:
      e = "Reinhard";
      break;
    case qc:
      e = "Cineon";
      break;
    case xl:
      e = "ACESFilmic";
      break;
    case $c:
      e = "AgX";
      break;
    case Zc:
      e = "Neutral";
      break;
    case Yc:
      e = "Custom";
      break;
    default:
      console.warn("THREE.WebGLProgram: Unsupported toneMapping:", t), e = "Linear";
  }
  return "vec3 " + i + "( vec3 color ) { return " + e + "ToneMapping( color ); }";
}
const Cr = /* @__PURE__ */ new I();
function bm() {
  Gt.getLuminanceCoefficients(Cr);
  const i = Cr.x.toFixed(4), t = Cr.y.toFixed(4), e = Cr.z.toFixed(4);
  return [
    "float luminance( const in vec3 rgb ) {",
    `	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,
    "	return dot( weights, rgb );",
    "}"
  ].join(`
`);
}
function wm(i) {
  return [
    i.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : "",
    i.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : ""
  ].filter(zi).join(`
`);
}
function Rm(i) {
  const t = [];
  for (const e in i) {
    const n = i[e];
    n !== !1 && t.push("#define " + e + " " + n);
  }
  return t.join(`
`);
}
function Cm(i, t) {
  const e = {}, n = i.getProgramParameter(t, i.ACTIVE_ATTRIBUTES);
  for (let r = 0; r < n; r++) {
    const s = i.getActiveAttrib(t, r), a = s.name;
    let o = 1;
    s.type === i.FLOAT_MAT2 && (o = 2), s.type === i.FLOAT_MAT3 && (o = 3), s.type === i.FLOAT_MAT4 && (o = 4), e[a] = {
      type: s.type,
      location: i.getAttribLocation(t, a),
      locationSize: o
    };
  }
  return e;
}
function zi(i) {
  return i !== "";
}
function Xo(i, t) {
  const e = t.numSpotLightShadows + t.numSpotLightMaps - t.numSpotLightShadowsWithMaps;
  return i.replace(/NUM_DIR_LIGHTS/g, t.numDirLights).replace(/NUM_SPOT_LIGHTS/g, t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, e).replace(/NUM_RECT_AREA_LIGHTS/g, t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, t.numPointLights).replace(/NUM_HEMI_LIGHTS/g, t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g, t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, t.numPointLightShadows);
}
function qo(i, t) {
  return i.replace(/NUM_CLIPPING_PLANES/g, t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, t.numClippingPlanes - t.numClipIntersection);
}
const Pm = /^[ \t]*#include +<([\w\d./]+)>/gm;
function xa(i) {
  return i.replace(Pm, Dm);
}
const Lm = /* @__PURE__ */ new Map();
function Dm(i, t) {
  let e = It[t];
  if (e === void 0) {
    const n = Lm.get(t);
    if (n !== void 0)
      e = It[n], console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.', t, n);
    else
      throw new Error("Can not resolve #include <" + t + ">");
  }
  return xa(e);
}
const Im = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function Yo(i) {
  return i.replace(Im, Um);
}
function Um(i, t, e, n) {
  let r = "";
  for (let s = parseInt(t); s < parseInt(e); s++)
    r += n.replace(/\[\s*i\s*\]/g, "[ " + s + " ]").replace(/UNROLLED_LOOP_INDEX/g, s);
  return r;
}
function $o(i) {
  let t = `precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;
  return i.precision === "highp" ? t += `
#define HIGH_PRECISION` : i.precision === "mediump" ? t += `
#define MEDIUM_PRECISION` : i.precision === "lowp" && (t += `
#define LOW_PRECISION`), t;
}
function Nm(i) {
  let t = "SHADOWMAP_TYPE_BASIC";
  return i.shadowMapType === gl ? t = "SHADOWMAP_TYPE_PCF" : i.shadowMapType === _l ? t = "SHADOWMAP_TYPE_PCF_SOFT" : i.shadowMapType === dn && (t = "SHADOWMAP_TYPE_VSM"), t;
}
function Fm(i) {
  let t = "ENVMAP_TYPE_CUBE";
  if (i.envMap)
    switch (i.envMapMode) {
      case vi:
      case xi:
        t = "ENVMAP_TYPE_CUBE";
        break;
      case Wr:
        t = "ENVMAP_TYPE_CUBE_UV";
        break;
    }
  return t;
}
function Om(i) {
  let t = "ENVMAP_MODE_REFLECTION";
  return i.envMap && i.envMapMode === xi && (t = "ENVMAP_MODE_REFRACTION"), t;
}
function Bm(i) {
  let t = "ENVMAP_BLENDING_NONE";
  if (i.envMap)
    switch (i.combine) {
      case vl:
        t = "ENVMAP_BLENDING_MULTIPLY";
        break;
      case Vc:
        t = "ENVMAP_BLENDING_MIX";
        break;
      case Gc:
        t = "ENVMAP_BLENDING_ADD";
        break;
    }
  return t;
}
function zm(i) {
  const t = i.envMapCubeUVHeight;
  if (t === null) return null;
  const e = Math.log2(t) - 2, n = 1 / t;
  return { texelWidth: 1 / (3 * Math.max(Math.pow(2, e), 112)), texelHeight: n, maxMip: e };
}
function Hm(i, t, e, n) {
  const r = i.getContext(), s = e.defines;
  let a = e.vertexShader, o = e.fragmentShader;
  const l = Nm(e), c = Fm(e), h = Om(e), u = Bm(e), f = zm(e), d = wm(e), g = Rm(s), v = r.createProgram();
  let m, p, A = e.glslVersion ? "#version " + e.glslVersion + `
` : "";
  e.isRawShaderMaterial ? (m = [
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    g
  ].filter(zi).join(`
`), m.length > 0 && (m += `
`), p = [
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    g
  ].filter(zi).join(`
`), p.length > 0 && (p += `
`)) : (m = [
    $o(e),
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    g,
    e.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
    e.batching ? "#define USE_BATCHING" : "",
    e.batchingColor ? "#define USE_BATCHING_COLOR" : "",
    e.instancing ? "#define USE_INSTANCING" : "",
    e.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
    e.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
    e.useFog && e.fog ? "#define USE_FOG" : "",
    e.useFog && e.fogExp2 ? "#define FOG_EXP2" : "",
    e.map ? "#define USE_MAP" : "",
    e.envMap ? "#define USE_ENVMAP" : "",
    e.envMap ? "#define " + h : "",
    e.lightMap ? "#define USE_LIGHTMAP" : "",
    e.aoMap ? "#define USE_AOMAP" : "",
    e.bumpMap ? "#define USE_BUMPMAP" : "",
    e.normalMap ? "#define USE_NORMALMAP" : "",
    e.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    e.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    e.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
    e.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    e.anisotropy ? "#define USE_ANISOTROPY" : "",
    e.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    e.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    e.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    e.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    e.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    e.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
    e.specularMap ? "#define USE_SPECULARMAP" : "",
    e.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    e.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    e.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    e.metalnessMap ? "#define USE_METALNESSMAP" : "",
    e.alphaMap ? "#define USE_ALPHAMAP" : "",
    e.alphaHash ? "#define USE_ALPHAHASH" : "",
    e.transmission ? "#define USE_TRANSMISSION" : "",
    e.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    e.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    e.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    e.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    //
    e.mapUv ? "#define MAP_UV " + e.mapUv : "",
    e.alphaMapUv ? "#define ALPHAMAP_UV " + e.alphaMapUv : "",
    e.lightMapUv ? "#define LIGHTMAP_UV " + e.lightMapUv : "",
    e.aoMapUv ? "#define AOMAP_UV " + e.aoMapUv : "",
    e.emissiveMapUv ? "#define EMISSIVEMAP_UV " + e.emissiveMapUv : "",
    e.bumpMapUv ? "#define BUMPMAP_UV " + e.bumpMapUv : "",
    e.normalMapUv ? "#define NORMALMAP_UV " + e.normalMapUv : "",
    e.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + e.displacementMapUv : "",
    e.metalnessMapUv ? "#define METALNESSMAP_UV " + e.metalnessMapUv : "",
    e.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + e.roughnessMapUv : "",
    e.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + e.anisotropyMapUv : "",
    e.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + e.clearcoatMapUv : "",
    e.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + e.clearcoatNormalMapUv : "",
    e.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + e.clearcoatRoughnessMapUv : "",
    e.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + e.iridescenceMapUv : "",
    e.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + e.iridescenceThicknessMapUv : "",
    e.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + e.sheenColorMapUv : "",
    e.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + e.sheenRoughnessMapUv : "",
    e.specularMapUv ? "#define SPECULARMAP_UV " + e.specularMapUv : "",
    e.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + e.specularColorMapUv : "",
    e.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + e.specularIntensityMapUv : "",
    e.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + e.transmissionMapUv : "",
    e.thicknessMapUv ? "#define THICKNESSMAP_UV " + e.thicknessMapUv : "",
    //
    e.vertexTangents && e.flatShading === !1 ? "#define USE_TANGENT" : "",
    e.vertexColors ? "#define USE_COLOR" : "",
    e.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
    e.vertexUv1s ? "#define USE_UV1" : "",
    e.vertexUv2s ? "#define USE_UV2" : "",
    e.vertexUv3s ? "#define USE_UV3" : "",
    e.pointsUvs ? "#define USE_POINTS_UV" : "",
    e.flatShading ? "#define FLAT_SHADED" : "",
    e.skinning ? "#define USE_SKINNING" : "",
    e.morphTargets ? "#define USE_MORPHTARGETS" : "",
    e.morphNormals && e.flatShading === !1 ? "#define USE_MORPHNORMALS" : "",
    e.morphColors ? "#define USE_MORPHCOLORS" : "",
    e.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + e.morphTextureStride : "",
    e.morphTargetsCount > 0 ? "#define MORPHTARGETS_COUNT " + e.morphTargetsCount : "",
    e.doubleSided ? "#define DOUBLE_SIDED" : "",
    e.flipSided ? "#define FLIP_SIDED" : "",
    e.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    e.shadowMapEnabled ? "#define " + l : "",
    e.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
    e.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    e.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
    e.reverseDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "",
    "uniform mat4 modelMatrix;",
    "uniform mat4 modelViewMatrix;",
    "uniform mat4 projectionMatrix;",
    "uniform mat4 viewMatrix;",
    "uniform mat3 normalMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    "#ifdef USE_INSTANCING",
    "	attribute mat4 instanceMatrix;",
    "#endif",
    "#ifdef USE_INSTANCING_COLOR",
    "	attribute vec3 instanceColor;",
    "#endif",
    "#ifdef USE_INSTANCING_MORPH",
    "	uniform sampler2D morphTexture;",
    "#endif",
    "attribute vec3 position;",
    "attribute vec3 normal;",
    "attribute vec2 uv;",
    "#ifdef USE_UV1",
    "	attribute vec2 uv1;",
    "#endif",
    "#ifdef USE_UV2",
    "	attribute vec2 uv2;",
    "#endif",
    "#ifdef USE_UV3",
    "	attribute vec2 uv3;",
    "#endif",
    "#ifdef USE_TANGENT",
    "	attribute vec4 tangent;",
    "#endif",
    "#if defined( USE_COLOR_ALPHA )",
    "	attribute vec4 color;",
    "#elif defined( USE_COLOR )",
    "	attribute vec3 color;",
    "#endif",
    "#ifdef USE_SKINNING",
    "	attribute vec4 skinIndex;",
    "	attribute vec4 skinWeight;",
    "#endif",
    `
`
  ].filter(zi).join(`
`), p = [
    $o(e),
    "#define SHADER_TYPE " + e.shaderType,
    "#define SHADER_NAME " + e.shaderName,
    g,
    e.useFog && e.fog ? "#define USE_FOG" : "",
    e.useFog && e.fogExp2 ? "#define FOG_EXP2" : "",
    e.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
    e.map ? "#define USE_MAP" : "",
    e.matcap ? "#define USE_MATCAP" : "",
    e.envMap ? "#define USE_ENVMAP" : "",
    e.envMap ? "#define " + c : "",
    e.envMap ? "#define " + h : "",
    e.envMap ? "#define " + u : "",
    f ? "#define CUBEUV_TEXEL_WIDTH " + f.texelWidth : "",
    f ? "#define CUBEUV_TEXEL_HEIGHT " + f.texelHeight : "",
    f ? "#define CUBEUV_MAX_MIP " + f.maxMip + ".0" : "",
    e.lightMap ? "#define USE_LIGHTMAP" : "",
    e.aoMap ? "#define USE_AOMAP" : "",
    e.bumpMap ? "#define USE_BUMPMAP" : "",
    e.normalMap ? "#define USE_NORMALMAP" : "",
    e.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
    e.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
    e.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
    e.anisotropy ? "#define USE_ANISOTROPY" : "",
    e.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
    e.clearcoat ? "#define USE_CLEARCOAT" : "",
    e.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
    e.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
    e.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
    e.dispersion ? "#define USE_DISPERSION" : "",
    e.iridescence ? "#define USE_IRIDESCENCE" : "",
    e.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
    e.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
    e.specularMap ? "#define USE_SPECULARMAP" : "",
    e.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
    e.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
    e.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
    e.metalnessMap ? "#define USE_METALNESSMAP" : "",
    e.alphaMap ? "#define USE_ALPHAMAP" : "",
    e.alphaTest ? "#define USE_ALPHATEST" : "",
    e.alphaHash ? "#define USE_ALPHAHASH" : "",
    e.sheen ? "#define USE_SHEEN" : "",
    e.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
    e.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
    e.transmission ? "#define USE_TRANSMISSION" : "",
    e.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
    e.thicknessMap ? "#define USE_THICKNESSMAP" : "",
    e.vertexTangents && e.flatShading === !1 ? "#define USE_TANGENT" : "",
    e.vertexColors || e.instancingColor || e.batchingColor ? "#define USE_COLOR" : "",
    e.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
    e.vertexUv1s ? "#define USE_UV1" : "",
    e.vertexUv2s ? "#define USE_UV2" : "",
    e.vertexUv3s ? "#define USE_UV3" : "",
    e.pointsUvs ? "#define USE_POINTS_UV" : "",
    e.gradientMap ? "#define USE_GRADIENTMAP" : "",
    e.flatShading ? "#define FLAT_SHADED" : "",
    e.doubleSided ? "#define DOUBLE_SIDED" : "",
    e.flipSided ? "#define FLIP_SIDED" : "",
    e.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
    e.shadowMapEnabled ? "#define " + l : "",
    e.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
    e.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
    e.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
    e.decodeVideoTextureEmissive ? "#define DECODE_VIDEO_TEXTURE_EMISSIVE" : "",
    e.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
    e.reverseDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "",
    "uniform mat4 viewMatrix;",
    "uniform vec3 cameraPosition;",
    "uniform bool isOrthographic;",
    e.toneMapping !== wn ? "#define TONE_MAPPING" : "",
    e.toneMapping !== wn ? It.tonemapping_pars_fragment : "",
    // this code is required here because it is used by the toneMapping() function defined below
    e.toneMapping !== wn ? Am("toneMapping", e.toneMapping) : "",
    e.dithering ? "#define DITHERING" : "",
    e.opaque ? "#define OPAQUE" : "",
    It.colorspace_pars_fragment,
    // this code is required here because it is used by the various encoding/decoding function defined below
    Tm("linearToOutputTexel", e.outputColorSpace),
    bm(),
    e.useDepthPacking ? "#define DEPTH_PACKING " + e.depthPacking : "",
    `
`
  ].filter(zi).join(`
`)), a = xa(a), a = Xo(a, e), a = qo(a, e), o = xa(o), o = Xo(o, e), o = qo(o, e), a = Yo(a), o = Yo(o), e.isRawShaderMaterial !== !0 && (A = `#version 300 es
`, m = [
    d,
    "#define attribute in",
    "#define varying out",
    "#define texture2D texture"
  ].join(`
`) + `
` + m, p = [
    "#define varying in",
    e.glslVersion === Ja ? "" : "layout(location = 0) out highp vec4 pc_fragColor;",
    e.glslVersion === Ja ? "" : "#define gl_FragColor pc_fragColor",
    "#define gl_FragDepthEXT gl_FragDepth",
    "#define texture2D texture",
    "#define textureCube texture",
    "#define texture2DProj textureProj",
    "#define texture2DLodEXT textureLod",
    "#define texture2DProjLodEXT textureProjLod",
    "#define textureCubeLodEXT textureLod",
    "#define texture2DGradEXT textureGrad",
    "#define texture2DProjGradEXT textureProjGrad",
    "#define textureCubeGradEXT textureGrad"
  ].join(`
`) + `
` + p);
  const T = A + m + a, S = A + p + o, N = Vo(r, r.VERTEX_SHADER, T), w = Vo(r, r.FRAGMENT_SHADER, S);
  r.attachShader(v, N), r.attachShader(v, w), e.index0AttributeName !== void 0 ? r.bindAttribLocation(v, 0, e.index0AttributeName) : e.morphTargets === !0 && r.bindAttribLocation(v, 0, "position"), r.linkProgram(v);
  function R(C) {
    if (i.debug.checkShaderErrors) {
      const H = r.getProgramInfoLog(v).trim(), B = r.getShaderInfoLog(N).trim(), G = r.getShaderInfoLog(w).trim();
      let Z = !0, W = !0;
      if (r.getProgramParameter(v, r.LINK_STATUS) === !1)
        if (Z = !1, typeof i.debug.onShaderError == "function")
          i.debug.onShaderError(r, v, N, w);
        else {
          const Q = Wo(r, N, "vertex"), V = Wo(r, w, "fragment");
          console.error(
            "THREE.WebGLProgram: Shader Error " + r.getError() + " - VALIDATE_STATUS " + r.getProgramParameter(v, r.VALIDATE_STATUS) + `

Material Name: ` + C.name + `
Material Type: ` + C.type + `

Program Info Log: ` + H + `
` + Q + `
` + V
          );
        }
      else H !== "" ? console.warn("THREE.WebGLProgram: Program Info Log:", H) : (B === "" || G === "") && (W = !1);
      W && (C.diagnostics = {
        runnable: Z,
        programLog: H,
        vertexShader: {
          log: B,
          prefix: m
        },
        fragmentShader: {
          log: G,
          prefix: p
        }
      });
    }
    r.deleteShader(N), r.deleteShader(w), U = new Br(r, v), y = Cm(r, v);
  }
  let U;
  this.getUniforms = function() {
    return U === void 0 && R(this), U;
  };
  let y;
  this.getAttributes = function() {
    return y === void 0 && R(this), y;
  };
  let M = e.rendererExtensionParallelShaderCompile === !1;
  return this.isReady = function() {
    return M === !1 && (M = r.getProgramParameter(v, Mm)), M;
  }, this.destroy = function() {
    n.releaseStatesOfProgram(this), r.deleteProgram(v), this.program = void 0;
  }, this.type = e.shaderType, this.name = e.shaderName, this.id = Sm++, this.cacheKey = t, this.usedTimes = 1, this.program = v, this.vertexShader = N, this.fragmentShader = w, this;
}
let km = 0;
class Vm {
  constructor() {
    this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
  }
  update(t) {
    const e = t.vertexShader, n = t.fragmentShader, r = this._getShaderStage(e), s = this._getShaderStage(n), a = this._getShaderCacheForMaterial(t);
    return a.has(r) === !1 && (a.add(r), r.usedTimes++), a.has(s) === !1 && (a.add(s), s.usedTimes++), this;
  }
  remove(t) {
    const e = this.materialCache.get(t);
    for (const n of e)
      n.usedTimes--, n.usedTimes === 0 && this.shaderCache.delete(n.code);
    return this.materialCache.delete(t), this;
  }
  getVertexShaderID(t) {
    return this._getShaderStage(t.vertexShader).id;
  }
  getFragmentShaderID(t) {
    return this._getShaderStage(t.fragmentShader).id;
  }
  dispose() {
    this.shaderCache.clear(), this.materialCache.clear();
  }
  _getShaderCacheForMaterial(t) {
    const e = this.materialCache;
    let n = e.get(t);
    return n === void 0 && (n = /* @__PURE__ */ new Set(), e.set(t, n)), n;
  }
  _getShaderStage(t) {
    const e = this.shaderCache;
    let n = e.get(t);
    return n === void 0 && (n = new Gm(t), e.set(t, n)), n;
  }
}
class Gm {
  constructor(t) {
    this.id = km++, this.code = t, this.usedTimes = 0;
  }
}
function Wm(i, t, e, n, r, s, a) {
  const o = new Dl(), l = new Vm(), c = /* @__PURE__ */ new Set(), h = [], u = r.logarithmicDepthBuffer, f = r.vertexTextures;
  let d = r.precision;
  const g = {
    MeshDepthMaterial: "depth",
    MeshDistanceMaterial: "distanceRGBA",
    MeshNormalMaterial: "normal",
    MeshBasicMaterial: "basic",
    MeshLambertMaterial: "lambert",
    MeshPhongMaterial: "phong",
    MeshToonMaterial: "toon",
    MeshStandardMaterial: "physical",
    MeshPhysicalMaterial: "physical",
    MeshMatcapMaterial: "matcap",
    LineBasicMaterial: "basic",
    LineDashedMaterial: "dashed",
    PointsMaterial: "points",
    ShadowMaterial: "shadow",
    SpriteMaterial: "sprite"
  };
  function v(y) {
    return c.add(y), y === 0 ? "uv" : `uv${y}`;
  }
  function m(y, M, C, H, B) {
    const G = H.fog, Z = B.geometry, W = y.isMeshStandardMaterial ? H.environment : null, Q = (y.isMeshStandardMaterial ? e : t).get(y.envMap || W), V = Q && Q.mapping === Wr ? Q.image.height : null, it = g[y.type];
    y.precision !== null && (d = r.getMaxPrecision(y.precision), d !== y.precision && console.warn("THREE.WebGLProgram.getParameters:", y.precision, "not supported, using", d, "instead."));
    const ht = Z.morphAttributes.position || Z.morphAttributes.normal || Z.morphAttributes.color, vt = ht !== void 0 ? ht.length : 0;
    let Ut = 0;
    Z.morphAttributes.position !== void 0 && (Ut = 1), Z.morphAttributes.normal !== void 0 && (Ut = 2), Z.morphAttributes.color !== void 0 && (Ut = 3);
    let Jt, q, tt, pt;
    if (it) {
      const $t = je[it];
      Jt = $t.vertexShader, q = $t.fragmentShader;
    } else
      Jt = y.vertexShader, q = y.fragmentShader, l.update(y), tt = l.getVertexShaderID(y), pt = l.getFragmentShaderID(y);
    const rt = i.getRenderTarget(), yt = i.state.buffers.depth.getReversed(), Xt = B.isInstancedMesh === !0, bt = B.isBatchedMesh === !0, ae = !!y.map, ee = !!y.matcap, Ot = !!Q, b = !!y.aoMap, Fe = !!y.lightMap, Ht = !!y.bumpMap, Bt = !!y.normalMap, xt = !!y.displacementMap, Qt = !!y.emissiveMap, _t = !!y.metalnessMap, E = !!y.roughnessMap, _ = y.anisotropy > 0, F = y.clearcoat > 0, Y = y.dispersion > 0, J = y.iridescence > 0, X = y.sheen > 0, gt = y.transmission > 0, st = _ && !!y.anisotropyMap, Et = F && !!y.clearcoatMap, Tt = F && !!y.clearcoatNormalMap, K = F && !!y.clearcoatRoughnessMap, ut = J && !!y.iridescenceMap, At = J && !!y.iridescenceThicknessMap, Rt = X && !!y.sheenColorMap, dt = X && !!y.sheenRoughnessMap, zt = !!y.specularMap, Dt = !!y.specularColorMap, jt = !!y.specularIntensityMap, P = gt && !!y.transmissionMap, at = gt && !!y.thicknessMap, k = !!y.gradientMap, $ = !!y.alphaMap, lt = y.alphaTest > 0, ot = !!y.alphaHash, Pt = !!y.extensions;
    let ie = wn;
    y.toneMapped && (rt === null || rt.isXRRenderTarget === !0) && (ie = i.toneMapping);
    const ve = {
      shaderID: it,
      shaderType: y.type,
      shaderName: y.name,
      vertexShader: Jt,
      fragmentShader: q,
      defines: y.defines,
      customVertexShaderID: tt,
      customFragmentShaderID: pt,
      isRawShaderMaterial: y.isRawShaderMaterial === !0,
      glslVersion: y.glslVersion,
      precision: d,
      batching: bt,
      batchingColor: bt && B._colorsTexture !== null,
      instancing: Xt,
      instancingColor: Xt && B.instanceColor !== null,
      instancingMorph: Xt && B.morphTexture !== null,
      supportsVertexTextures: f,
      outputColorSpace: rt === null ? i.outputColorSpace : rt.isXRRenderTarget === !0 ? rt.texture.colorSpace : Mi,
      alphaToCoverage: !!y.alphaToCoverage,
      map: ae,
      matcap: ee,
      envMap: Ot,
      envMapMode: Ot && Q.mapping,
      envMapCubeUVHeight: V,
      aoMap: b,
      lightMap: Fe,
      bumpMap: Ht,
      normalMap: Bt,
      displacementMap: f && xt,
      emissiveMap: Qt,
      normalMapObjectSpace: Bt && y.normalMapType === Qc,
      normalMapTangentSpace: Bt && y.normalMapType === Rl,
      metalnessMap: _t,
      roughnessMap: E,
      anisotropy: _,
      anisotropyMap: st,
      clearcoat: F,
      clearcoatMap: Et,
      clearcoatNormalMap: Tt,
      clearcoatRoughnessMap: K,
      dispersion: Y,
      iridescence: J,
      iridescenceMap: ut,
      iridescenceThicknessMap: At,
      sheen: X,
      sheenColorMap: Rt,
      sheenRoughnessMap: dt,
      specularMap: zt,
      specularColorMap: Dt,
      specularIntensityMap: jt,
      transmission: gt,
      transmissionMap: P,
      thicknessMap: at,
      gradientMap: k,
      opaque: y.transparent === !1 && y.blending === mi && y.alphaToCoverage === !1,
      alphaMap: $,
      alphaTest: lt,
      alphaHash: ot,
      combine: y.combine,
      //
      mapUv: ae && v(y.map.channel),
      aoMapUv: b && v(y.aoMap.channel),
      lightMapUv: Fe && v(y.lightMap.channel),
      bumpMapUv: Ht && v(y.bumpMap.channel),
      normalMapUv: Bt && v(y.normalMap.channel),
      displacementMapUv: xt && v(y.displacementMap.channel),
      emissiveMapUv: Qt && v(y.emissiveMap.channel),
      metalnessMapUv: _t && v(y.metalnessMap.channel),
      roughnessMapUv: E && v(y.roughnessMap.channel),
      anisotropyMapUv: st && v(y.anisotropyMap.channel),
      clearcoatMapUv: Et && v(y.clearcoatMap.channel),
      clearcoatNormalMapUv: Tt && v(y.clearcoatNormalMap.channel),
      clearcoatRoughnessMapUv: K && v(y.clearcoatRoughnessMap.channel),
      iridescenceMapUv: ut && v(y.iridescenceMap.channel),
      iridescenceThicknessMapUv: At && v(y.iridescenceThicknessMap.channel),
      sheenColorMapUv: Rt && v(y.sheenColorMap.channel),
      sheenRoughnessMapUv: dt && v(y.sheenRoughnessMap.channel),
      specularMapUv: zt && v(y.specularMap.channel),
      specularColorMapUv: Dt && v(y.specularColorMap.channel),
      specularIntensityMapUv: jt && v(y.specularIntensityMap.channel),
      transmissionMapUv: P && v(y.transmissionMap.channel),
      thicknessMapUv: at && v(y.thicknessMap.channel),
      alphaMapUv: $ && v(y.alphaMap.channel),
      //
      vertexTangents: !!Z.attributes.tangent && (Bt || _),
      vertexColors: y.vertexColors,
      vertexAlphas: y.vertexColors === !0 && !!Z.attributes.color && Z.attributes.color.itemSize === 4,
      pointsUvs: B.isPoints === !0 && !!Z.attributes.uv && (ae || $),
      fog: !!G,
      useFog: y.fog === !0,
      fogExp2: !!G && G.isFogExp2,
      flatShading: y.flatShading === !0,
      sizeAttenuation: y.sizeAttenuation === !0,
      logarithmicDepthBuffer: u,
      reverseDepthBuffer: yt,
      skinning: B.isSkinnedMesh === !0,
      morphTargets: Z.morphAttributes.position !== void 0,
      morphNormals: Z.morphAttributes.normal !== void 0,
      morphColors: Z.morphAttributes.color !== void 0,
      morphTargetsCount: vt,
      morphTextureStride: Ut,
      numDirLights: M.directional.length,
      numPointLights: M.point.length,
      numSpotLights: M.spot.length,
      numSpotLightMaps: M.spotLightMap.length,
      numRectAreaLights: M.rectArea.length,
      numHemiLights: M.hemi.length,
      numDirLightShadows: M.directionalShadowMap.length,
      numPointLightShadows: M.pointShadowMap.length,
      numSpotLightShadows: M.spotShadowMap.length,
      numSpotLightShadowsWithMaps: M.numSpotLightShadowsWithMaps,
      numLightProbes: M.numLightProbes,
      numClippingPlanes: a.numPlanes,
      numClipIntersection: a.numIntersection,
      dithering: y.dithering,
      shadowMapEnabled: i.shadowMap.enabled && C.length > 0,
      shadowMapType: i.shadowMap.type,
      toneMapping: ie,
      decodeVideoTexture: ae && y.map.isVideoTexture === !0 && Gt.getTransfer(y.map.colorSpace) === Zt,
      decodeVideoTextureEmissive: Qt && y.emissiveMap.isVideoTexture === !0 && Gt.getTransfer(y.emissiveMap.colorSpace) === Zt,
      premultipliedAlpha: y.premultipliedAlpha,
      doubleSided: y.side === we,
      flipSided: y.side === Ce,
      useDepthPacking: y.depthPacking >= 0,
      depthPacking: y.depthPacking || 0,
      index0AttributeName: y.index0AttributeName,
      extensionClipCullDistance: Pt && y.extensions.clipCullDistance === !0 && n.has("WEBGL_clip_cull_distance"),
      extensionMultiDraw: (Pt && y.extensions.multiDraw === !0 || bt) && n.has("WEBGL_multi_draw"),
      rendererExtensionParallelShaderCompile: n.has("KHR_parallel_shader_compile"),
      customProgramCacheKey: y.customProgramCacheKey()
    };
    return ve.vertexUv1s = c.has(1), ve.vertexUv2s = c.has(2), ve.vertexUv3s = c.has(3), c.clear(), ve;
  }
  function p(y) {
    const M = [];
    if (y.shaderID ? M.push(y.shaderID) : (M.push(y.customVertexShaderID), M.push(y.customFragmentShaderID)), y.defines !== void 0)
      for (const C in y.defines)
        M.push(C), M.push(y.defines[C]);
    return y.isRawShaderMaterial === !1 && (A(M, y), T(M, y), M.push(i.outputColorSpace)), M.push(y.customProgramCacheKey), M.join();
  }
  function A(y, M) {
    y.push(M.precision), y.push(M.outputColorSpace), y.push(M.envMapMode), y.push(M.envMapCubeUVHeight), y.push(M.mapUv), y.push(M.alphaMapUv), y.push(M.lightMapUv), y.push(M.aoMapUv), y.push(M.bumpMapUv), y.push(M.normalMapUv), y.push(M.displacementMapUv), y.push(M.emissiveMapUv), y.push(M.metalnessMapUv), y.push(M.roughnessMapUv), y.push(M.anisotropyMapUv), y.push(M.clearcoatMapUv), y.push(M.clearcoatNormalMapUv), y.push(M.clearcoatRoughnessMapUv), y.push(M.iridescenceMapUv), y.push(M.iridescenceThicknessMapUv), y.push(M.sheenColorMapUv), y.push(M.sheenRoughnessMapUv), y.push(M.specularMapUv), y.push(M.specularColorMapUv), y.push(M.specularIntensityMapUv), y.push(M.transmissionMapUv), y.push(M.thicknessMapUv), y.push(M.combine), y.push(M.fogExp2), y.push(M.sizeAttenuation), y.push(M.morphTargetsCount), y.push(M.morphAttributeCount), y.push(M.numDirLights), y.push(M.numPointLights), y.push(M.numSpotLights), y.push(M.numSpotLightMaps), y.push(M.numHemiLights), y.push(M.numRectAreaLights), y.push(M.numDirLightShadows), y.push(M.numPointLightShadows), y.push(M.numSpotLightShadows), y.push(M.numSpotLightShadowsWithMaps), y.push(M.numLightProbes), y.push(M.shadowMapType), y.push(M.toneMapping), y.push(M.numClippingPlanes), y.push(M.numClipIntersection), y.push(M.depthPacking);
  }
  function T(y, M) {
    o.disableAll(), M.supportsVertexTextures && o.enable(0), M.instancing && o.enable(1), M.instancingColor && o.enable(2), M.instancingMorph && o.enable(3), M.matcap && o.enable(4), M.envMap && o.enable(5), M.normalMapObjectSpace && o.enable(6), M.normalMapTangentSpace && o.enable(7), M.clearcoat && o.enable(8), M.iridescence && o.enable(9), M.alphaTest && o.enable(10), M.vertexColors && o.enable(11), M.vertexAlphas && o.enable(12), M.vertexUv1s && o.enable(13), M.vertexUv2s && o.enable(14), M.vertexUv3s && o.enable(15), M.vertexTangents && o.enable(16), M.anisotropy && o.enable(17), M.alphaHash && o.enable(18), M.batching && o.enable(19), M.dispersion && o.enable(20), M.batchingColor && o.enable(21), y.push(o.mask), o.disableAll(), M.fog && o.enable(0), M.useFog && o.enable(1), M.flatShading && o.enable(2), M.logarithmicDepthBuffer && o.enable(3), M.reverseDepthBuffer && o.enable(4), M.skinning && o.enable(5), M.morphTargets && o.enable(6), M.morphNormals && o.enable(7), M.morphColors && o.enable(8), M.premultipliedAlpha && o.enable(9), M.shadowMapEnabled && o.enable(10), M.doubleSided && o.enable(11), M.flipSided && o.enable(12), M.useDepthPacking && o.enable(13), M.dithering && o.enable(14), M.transmission && o.enable(15), M.sheen && o.enable(16), M.opaque && o.enable(17), M.pointsUvs && o.enable(18), M.decodeVideoTexture && o.enable(19), M.decodeVideoTextureEmissive && o.enable(20), M.alphaToCoverage && o.enable(21), y.push(o.mask);
  }
  function S(y) {
    const M = g[y.type];
    let C;
    if (M) {
      const H = je[M];
      C = Lh.clone(H.uniforms);
    } else
      C = y.uniforms;
    return C;
  }
  function N(y, M) {
    let C;
    for (let H = 0, B = h.length; H < B; H++) {
      const G = h[H];
      if (G.cacheKey === M) {
        C = G, ++C.usedTimes;
        break;
      }
    }
    return C === void 0 && (C = new Hm(i, M, y, s), h.push(C)), C;
  }
  function w(y) {
    if (--y.usedTimes === 0) {
      const M = h.indexOf(y);
      h[M] = h[h.length - 1], h.pop(), y.destroy();
    }
  }
  function R(y) {
    l.remove(y);
  }
  function U() {
    l.dispose();
  }
  return {
    getParameters: m,
    getProgramCacheKey: p,
    getUniforms: S,
    acquireProgram: N,
    releaseProgram: w,
    releaseShaderCache: R,
    // Exposed for resource monitoring & error feedback via renderer.info:
    programs: h,
    dispose: U
  };
}
function Xm() {
  let i = /* @__PURE__ */ new WeakMap();
  function t(a) {
    return i.has(a);
  }
  function e(a) {
    let o = i.get(a);
    return o === void 0 && (o = {}, i.set(a, o)), o;
  }
  function n(a) {
    i.delete(a);
  }
  function r(a, o, l) {
    i.get(a)[o] = l;
  }
  function s() {
    i = /* @__PURE__ */ new WeakMap();
  }
  return {
    has: t,
    get: e,
    remove: n,
    update: r,
    dispose: s
  };
}
function qm(i, t) {
  return i.groupOrder !== t.groupOrder ? i.groupOrder - t.groupOrder : i.renderOrder !== t.renderOrder ? i.renderOrder - t.renderOrder : i.material.id !== t.material.id ? i.material.id - t.material.id : i.z !== t.z ? i.z - t.z : i.id - t.id;
}
function Zo(i, t) {
  return i.groupOrder !== t.groupOrder ? i.groupOrder - t.groupOrder : i.renderOrder !== t.renderOrder ? i.renderOrder - t.renderOrder : i.z !== t.z ? t.z - i.z : i.id - t.id;
}
function Jo() {
  const i = [];
  let t = 0;
  const e = [], n = [], r = [];
  function s() {
    t = 0, e.length = 0, n.length = 0, r.length = 0;
  }
  function a(u, f, d, g, v, m) {
    let p = i[t];
    return p === void 0 ? (p = {
      id: u.id,
      object: u,
      geometry: f,
      material: d,
      groupOrder: g,
      renderOrder: u.renderOrder,
      z: v,
      group: m
    }, i[t] = p) : (p.id = u.id, p.object = u, p.geometry = f, p.material = d, p.groupOrder = g, p.renderOrder = u.renderOrder, p.z = v, p.group = m), t++, p;
  }
  function o(u, f, d, g, v, m) {
    const p = a(u, f, d, g, v, m);
    d.transmission > 0 ? n.push(p) : d.transparent === !0 ? r.push(p) : e.push(p);
  }
  function l(u, f, d, g, v, m) {
    const p = a(u, f, d, g, v, m);
    d.transmission > 0 ? n.unshift(p) : d.transparent === !0 ? r.unshift(p) : e.unshift(p);
  }
  function c(u, f) {
    e.length > 1 && e.sort(u || qm), n.length > 1 && n.sort(f || Zo), r.length > 1 && r.sort(f || Zo);
  }
  function h() {
    for (let u = t, f = i.length; u < f; u++) {
      const d = i[u];
      if (d.id === null) break;
      d.id = null, d.object = null, d.geometry = null, d.material = null, d.group = null;
    }
  }
  return {
    opaque: e,
    transmissive: n,
    transparent: r,
    init: s,
    push: o,
    unshift: l,
    finish: h,
    sort: c
  };
}
function Ym() {
  let i = /* @__PURE__ */ new WeakMap();
  function t(n, r) {
    const s = i.get(n);
    let a;
    return s === void 0 ? (a = new Jo(), i.set(n, [a])) : r >= s.length ? (a = new Jo(), s.push(a)) : a = s[r], a;
  }
  function e() {
    i = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: t,
    dispose: e
  };
}
function $m() {
  const i = {};
  return {
    get: function(t) {
      if (i[t.id] !== void 0)
        return i[t.id];
      let e;
      switch (t.type) {
        case "DirectionalLight":
          e = {
            direction: new I(),
            color: new Ft()
          };
          break;
        case "SpotLight":
          e = {
            position: new I(),
            direction: new I(),
            color: new Ft(),
            distance: 0,
            coneCos: 0,
            penumbraCos: 0,
            decay: 0
          };
          break;
        case "PointLight":
          e = {
            position: new I(),
            color: new Ft(),
            distance: 0,
            decay: 0
          };
          break;
        case "HemisphereLight":
          e = {
            direction: new I(),
            skyColor: new Ft(),
            groundColor: new Ft()
          };
          break;
        case "RectAreaLight":
          e = {
            color: new Ft(),
            position: new I(),
            halfWidth: new I(),
            halfHeight: new I()
          };
          break;
      }
      return i[t.id] = e, e;
    }
  };
}
function Zm() {
  const i = {};
  return {
    get: function(t) {
      if (i[t.id] !== void 0)
        return i[t.id];
      let e;
      switch (t.type) {
        case "DirectionalLight":
          e = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new mt()
          };
          break;
        case "SpotLight":
          e = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new mt()
          };
          break;
        case "PointLight":
          e = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new mt(),
            shadowCameraNear: 1,
            shadowCameraFar: 1e3
          };
          break;
      }
      return i[t.id] = e, e;
    }
  };
}
let Jm = 0;
function Km(i, t) {
  return (t.castShadow ? 2 : 0) - (i.castShadow ? 2 : 0) + (t.map ? 1 : 0) - (i.map ? 1 : 0);
}
function jm(i) {
  const t = new $m(), e = Zm(), n = {
    version: 0,
    hash: {
      directionalLength: -1,
      pointLength: -1,
      spotLength: -1,
      rectAreaLength: -1,
      hemiLength: -1,
      numDirectionalShadows: -1,
      numPointShadows: -1,
      numSpotShadows: -1,
      numSpotMaps: -1,
      numLightProbes: -1
    },
    ambient: [0, 0, 0],
    probe: [],
    directional: [],
    directionalShadow: [],
    directionalShadowMap: [],
    directionalShadowMatrix: [],
    spot: [],
    spotLightMap: [],
    spotShadow: [],
    spotShadowMap: [],
    spotLightMatrix: [],
    rectArea: [],
    rectAreaLTC1: null,
    rectAreaLTC2: null,
    point: [],
    pointShadow: [],
    pointShadowMap: [],
    pointShadowMatrix: [],
    hemi: [],
    numSpotLightShadowsWithMaps: 0,
    numLightProbes: 0
  };
  for (let c = 0; c < 9; c++) n.probe.push(new I());
  const r = new I(), s = new Wt(), a = new Wt();
  function o(c) {
    let h = 0, u = 0, f = 0;
    for (let y = 0; y < 9; y++) n.probe[y].set(0, 0, 0);
    let d = 0, g = 0, v = 0, m = 0, p = 0, A = 0, T = 0, S = 0, N = 0, w = 0, R = 0;
    c.sort(Km);
    for (let y = 0, M = c.length; y < M; y++) {
      const C = c[y], H = C.color, B = C.intensity, G = C.distance, Z = C.shadow && C.shadow.map ? C.shadow.map.texture : null;
      if (C.isAmbientLight)
        h += H.r * B, u += H.g * B, f += H.b * B;
      else if (C.isLightProbe) {
        for (let W = 0; W < 9; W++)
          n.probe[W].addScaledVector(C.sh.coefficients[W], B);
        R++;
      } else if (C.isDirectionalLight) {
        const W = t.get(C);
        if (W.color.copy(C.color).multiplyScalar(C.intensity), C.castShadow) {
          const Q = C.shadow, V = e.get(C);
          V.shadowIntensity = Q.intensity, V.shadowBias = Q.bias, V.shadowNormalBias = Q.normalBias, V.shadowRadius = Q.radius, V.shadowMapSize = Q.mapSize, n.directionalShadow[d] = V, n.directionalShadowMap[d] = Z, n.directionalShadowMatrix[d] = C.shadow.matrix, A++;
        }
        n.directional[d] = W, d++;
      } else if (C.isSpotLight) {
        const W = t.get(C);
        W.position.setFromMatrixPosition(C.matrixWorld), W.color.copy(H).multiplyScalar(B), W.distance = G, W.coneCos = Math.cos(C.angle), W.penumbraCos = Math.cos(C.angle * (1 - C.penumbra)), W.decay = C.decay, n.spot[v] = W;
        const Q = C.shadow;
        if (C.map && (n.spotLightMap[N] = C.map, N++, Q.updateMatrices(C), C.castShadow && w++), n.spotLightMatrix[v] = Q.matrix, C.castShadow) {
          const V = e.get(C);
          V.shadowIntensity = Q.intensity, V.shadowBias = Q.bias, V.shadowNormalBias = Q.normalBias, V.shadowRadius = Q.radius, V.shadowMapSize = Q.mapSize, n.spotShadow[v] = V, n.spotShadowMap[v] = Z, S++;
        }
        v++;
      } else if (C.isRectAreaLight) {
        const W = t.get(C);
        W.color.copy(H).multiplyScalar(B), W.halfWidth.set(C.width * 0.5, 0, 0), W.halfHeight.set(0, C.height * 0.5, 0), n.rectArea[m] = W, m++;
      } else if (C.isPointLight) {
        const W = t.get(C);
        if (W.color.copy(C.color).multiplyScalar(C.intensity), W.distance = C.distance, W.decay = C.decay, C.castShadow) {
          const Q = C.shadow, V = e.get(C);
          V.shadowIntensity = Q.intensity, V.shadowBias = Q.bias, V.shadowNormalBias = Q.normalBias, V.shadowRadius = Q.radius, V.shadowMapSize = Q.mapSize, V.shadowCameraNear = Q.camera.near, V.shadowCameraFar = Q.camera.far, n.pointShadow[g] = V, n.pointShadowMap[g] = Z, n.pointShadowMatrix[g] = C.shadow.matrix, T++;
        }
        n.point[g] = W, g++;
      } else if (C.isHemisphereLight) {
        const W = t.get(C);
        W.skyColor.copy(C.color).multiplyScalar(B), W.groundColor.copy(C.groundColor).multiplyScalar(B), n.hemi[p] = W, p++;
      }
    }
    m > 0 && (i.has("OES_texture_float_linear") === !0 ? (n.rectAreaLTC1 = et.LTC_FLOAT_1, n.rectAreaLTC2 = et.LTC_FLOAT_2) : (n.rectAreaLTC1 = et.LTC_HALF_1, n.rectAreaLTC2 = et.LTC_HALF_2)), n.ambient[0] = h, n.ambient[1] = u, n.ambient[2] = f;
    const U = n.hash;
    (U.directionalLength !== d || U.pointLength !== g || U.spotLength !== v || U.rectAreaLength !== m || U.hemiLength !== p || U.numDirectionalShadows !== A || U.numPointShadows !== T || U.numSpotShadows !== S || U.numSpotMaps !== N || U.numLightProbes !== R) && (n.directional.length = d, n.spot.length = v, n.rectArea.length = m, n.point.length = g, n.hemi.length = p, n.directionalShadow.length = A, n.directionalShadowMap.length = A, n.pointShadow.length = T, n.pointShadowMap.length = T, n.spotShadow.length = S, n.spotShadowMap.length = S, n.directionalShadowMatrix.length = A, n.pointShadowMatrix.length = T, n.spotLightMatrix.length = S + N - w, n.spotLightMap.length = N, n.numSpotLightShadowsWithMaps = w, n.numLightProbes = R, U.directionalLength = d, U.pointLength = g, U.spotLength = v, U.rectAreaLength = m, U.hemiLength = p, U.numDirectionalShadows = A, U.numPointShadows = T, U.numSpotShadows = S, U.numSpotMaps = N, U.numLightProbes = R, n.version = Jm++);
  }
  function l(c, h) {
    let u = 0, f = 0, d = 0, g = 0, v = 0;
    const m = h.matrixWorldInverse;
    for (let p = 0, A = c.length; p < A; p++) {
      const T = c[p];
      if (T.isDirectionalLight) {
        const S = n.directional[u];
        S.direction.setFromMatrixPosition(T.matrixWorld), r.setFromMatrixPosition(T.target.matrixWorld), S.direction.sub(r), S.direction.transformDirection(m), u++;
      } else if (T.isSpotLight) {
        const S = n.spot[d];
        S.position.setFromMatrixPosition(T.matrixWorld), S.position.applyMatrix4(m), S.direction.setFromMatrixPosition(T.matrixWorld), r.setFromMatrixPosition(T.target.matrixWorld), S.direction.sub(r), S.direction.transformDirection(m), d++;
      } else if (T.isRectAreaLight) {
        const S = n.rectArea[g];
        S.position.setFromMatrixPosition(T.matrixWorld), S.position.applyMatrix4(m), a.identity(), s.copy(T.matrixWorld), s.premultiply(m), a.extractRotation(s), S.halfWidth.set(T.width * 0.5, 0, 0), S.halfHeight.set(0, T.height * 0.5, 0), S.halfWidth.applyMatrix4(a), S.halfHeight.applyMatrix4(a), g++;
      } else if (T.isPointLight) {
        const S = n.point[f];
        S.position.setFromMatrixPosition(T.matrixWorld), S.position.applyMatrix4(m), f++;
      } else if (T.isHemisphereLight) {
        const S = n.hemi[v];
        S.direction.setFromMatrixPosition(T.matrixWorld), S.direction.transformDirection(m), v++;
      }
    }
  }
  return {
    setup: o,
    setupView: l,
    state: n
  };
}
function Ko(i) {
  const t = new jm(i), e = [], n = [];
  function r(h) {
    c.camera = h, e.length = 0, n.length = 0;
  }
  function s(h) {
    e.push(h);
  }
  function a(h) {
    n.push(h);
  }
  function o() {
    t.setup(e);
  }
  function l(h) {
    t.setupView(e, h);
  }
  const c = {
    lightsArray: e,
    shadowsArray: n,
    camera: null,
    lights: t,
    transmissionRenderTarget: {}
  };
  return {
    init: r,
    state: c,
    setupLights: o,
    setupLightsView: l,
    pushLight: s,
    pushShadow: a
  };
}
function Qm(i) {
  let t = /* @__PURE__ */ new WeakMap();
  function e(r, s = 0) {
    const a = t.get(r);
    let o;
    return a === void 0 ? (o = new Ko(i), t.set(r, [o])) : s >= a.length ? (o = new Ko(i), a.push(o)) : o = a[s], o;
  }
  function n() {
    t = /* @__PURE__ */ new WeakMap();
  }
  return {
    get: e,
    dispose: n
  };
}
const tg = `void main() {
	gl_Position = vec4( position, 1.0 );
}`, eg = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;
function ng(i, t, e) {
  let n = new Pa();
  const r = new mt(), s = new mt(), a = new se(), o = new Mu({ depthPacking: jc }), l = new Su(), c = {}, h = e.maxTextureSize, u = { [Rn]: Ce, [Ce]: Rn, [we]: we }, f = new Cn({
    defines: {
      VSM_SAMPLES: 8
    },
    uniforms: {
      shadow_pass: { value: null },
      resolution: { value: new mt() },
      radius: { value: 4 }
    },
    vertexShader: tg,
    fragmentShader: eg
  }), d = f.clone();
  d.defines.HORIZONTAL_PASS = 1;
  const g = new vn();
  g.setAttribute(
    "position",
    new Ze(
      new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]),
      3
    )
  );
  const v = new Kt(g, f), m = this;
  this.enabled = !1, this.autoUpdate = !0, this.needsUpdate = !1, this.type = gl;
  let p = this.type;
  this.render = function(w, R, U) {
    if (m.enabled === !1 || m.autoUpdate === !1 && m.needsUpdate === !1 || w.length === 0) return;
    const y = i.getRenderTarget(), M = i.getActiveCubeFace(), C = i.getActiveMipmapLevel(), H = i.state;
    H.setBlending(bn), H.buffers.color.setClear(1, 1, 1, 1), H.buffers.depth.setTest(!0), H.setScissorTest(!1);
    const B = p !== dn && this.type === dn, G = p === dn && this.type !== dn;
    for (let Z = 0, W = w.length; Z < W; Z++) {
      const Q = w[Z], V = Q.shadow;
      if (V === void 0) {
        console.warn("THREE.WebGLShadowMap:", Q, "has no shadow.");
        continue;
      }
      if (V.autoUpdate === !1 && V.needsUpdate === !1) continue;
      r.copy(V.mapSize);
      const it = V.getFrameExtents();
      if (r.multiply(it), s.copy(V.mapSize), (r.x > h || r.y > h) && (r.x > h && (s.x = Math.floor(h / it.x), r.x = s.x * it.x, V.mapSize.x = s.x), r.y > h && (s.y = Math.floor(h / it.y), r.y = s.y * it.y, V.mapSize.y = s.y)), V.map === null || B === !0 || G === !0) {
        const vt = this.type !== dn ? { minFilter: Ue, magFilter: Ue } : {};
        V.map !== null && V.map.dispose(), V.map = new Yn(r.x, r.y, vt), V.map.texture.name = Q.name + ".shadowMap", V.camera.updateProjectionMatrix();
      }
      i.setRenderTarget(V.map), i.clear();
      const ht = V.getViewportCount();
      for (let vt = 0; vt < ht; vt++) {
        const Ut = V.getViewport(vt);
        a.set(
          s.x * Ut.x,
          s.y * Ut.y,
          s.x * Ut.z,
          s.y * Ut.w
        ), H.viewport(a), V.updateMatrices(Q, vt), n = V.getFrustum(), S(R, U, V.camera, Q, this.type);
      }
      V.isPointLightShadow !== !0 && this.type === dn && A(V, U), V.needsUpdate = !1;
    }
    p = this.type, m.needsUpdate = !1, i.setRenderTarget(y, M, C);
  };
  function A(w, R) {
    const U = t.update(v);
    f.defines.VSM_SAMPLES !== w.blurSamples && (f.defines.VSM_SAMPLES = w.blurSamples, d.defines.VSM_SAMPLES = w.blurSamples, f.needsUpdate = !0, d.needsUpdate = !0), w.mapPass === null && (w.mapPass = new Yn(r.x, r.y)), f.uniforms.shadow_pass.value = w.map.texture, f.uniforms.resolution.value = w.mapSize, f.uniforms.radius.value = w.radius, i.setRenderTarget(w.mapPass), i.clear(), i.renderBufferDirect(R, null, U, f, v, null), d.uniforms.shadow_pass.value = w.mapPass.texture, d.uniforms.resolution.value = w.mapSize, d.uniforms.radius.value = w.radius, i.setRenderTarget(w.map), i.clear(), i.renderBufferDirect(R, null, U, d, v, null);
  }
  function T(w, R, U, y) {
    let M = null;
    const C = U.isPointLight === !0 ? w.customDistanceMaterial : w.customDepthMaterial;
    if (C !== void 0)
      M = C;
    else if (M = U.isPointLight === !0 ? l : o, i.localClippingEnabled && R.clipShadows === !0 && Array.isArray(R.clippingPlanes) && R.clippingPlanes.length !== 0 || R.displacementMap && R.displacementScale !== 0 || R.alphaMap && R.alphaTest > 0 || R.map && R.alphaTest > 0 || R.alphaToCoverage === !0) {
      const H = M.uuid, B = R.uuid;
      let G = c[H];
      G === void 0 && (G = {}, c[H] = G);
      let Z = G[B];
      Z === void 0 && (Z = M.clone(), G[B] = Z, R.addEventListener("dispose", N)), M = Z;
    }
    if (M.visible = R.visible, M.wireframe = R.wireframe, y === dn ? M.side = R.shadowSide !== null ? R.shadowSide : R.side : M.side = R.shadowSide !== null ? R.shadowSide : u[R.side], M.alphaMap = R.alphaMap, M.alphaTest = R.alphaToCoverage === !0 ? 0.5 : R.alphaTest, M.map = R.map, M.clipShadows = R.clipShadows, M.clippingPlanes = R.clippingPlanes, M.clipIntersection = R.clipIntersection, M.displacementMap = R.displacementMap, M.displacementScale = R.displacementScale, M.displacementBias = R.displacementBias, M.wireframeLinewidth = R.wireframeLinewidth, M.linewidth = R.linewidth, U.isPointLight === !0 && M.isMeshDistanceMaterial === !0) {
      const H = i.properties.get(M);
      H.light = U;
    }
    return M;
  }
  function S(w, R, U, y, M) {
    if (w.visible === !1) return;
    if (w.layers.test(R.layers) && (w.isMesh || w.isLine || w.isPoints) && (w.castShadow || w.receiveShadow && M === dn) && (!w.frustumCulled || n.intersectsObject(w))) {
      w.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse, w.matrixWorld);
      const B = t.update(w), G = w.material;
      if (Array.isArray(G)) {
        const Z = B.groups;
        for (let W = 0, Q = Z.length; W < Q; W++) {
          const V = Z[W], it = G[V.materialIndex];
          if (it && it.visible) {
            const ht = T(w, it, y, M);
            w.onBeforeShadow(i, w, R, U, B, ht, V), i.renderBufferDirect(U, null, B, ht, w, V), w.onAfterShadow(i, w, R, U, B, ht, V);
          }
        }
      } else if (G.visible) {
        const Z = T(w, G, y, M);
        w.onBeforeShadow(i, w, R, U, B, Z, null), i.renderBufferDirect(U, null, B, Z, w, null), w.onAfterShadow(i, w, R, U, B, Z, null);
      }
    }
    const H = w.children;
    for (let B = 0, G = H.length; B < G; B++)
      S(H[B], R, U, y, M);
  }
  function N(w) {
    w.target.removeEventListener("dispose", N);
    for (const U in c) {
      const y = c[U], M = w.target.uuid;
      M in y && (y[M].dispose(), delete y[M]);
    }
  }
}
const ig = {
  [Us]: Ns,
  [Fs]: zs,
  [Os]: Hs,
  [_i]: Bs,
  [Ns]: Us,
  [zs]: Fs,
  [Hs]: Os,
  [Bs]: _i
};
function rg(i, t) {
  function e() {
    let P = !1;
    const at = new se();
    let k = null;
    const $ = new se(0, 0, 0, 0);
    return {
      setMask: function(lt) {
        k !== lt && !P && (i.colorMask(lt, lt, lt, lt), k = lt);
      },
      setLocked: function(lt) {
        P = lt;
      },
      setClear: function(lt, ot, Pt, ie, ve) {
        ve === !0 && (lt *= ie, ot *= ie, Pt *= ie), at.set(lt, ot, Pt, ie), $.equals(at) === !1 && (i.clearColor(lt, ot, Pt, ie), $.copy(at));
      },
      reset: function() {
        P = !1, k = null, $.set(-1, 0, 0, 0);
      }
    };
  }
  function n() {
    let P = !1, at = !1, k = null, $ = null, lt = null;
    return {
      setReversed: function(ot) {
        if (at !== ot) {
          const Pt = t.get("EXT_clip_control");
          ot ? Pt.clipControlEXT(Pt.LOWER_LEFT_EXT, Pt.ZERO_TO_ONE_EXT) : Pt.clipControlEXT(Pt.LOWER_LEFT_EXT, Pt.NEGATIVE_ONE_TO_ONE_EXT), at = ot;
          const ie = lt;
          lt = null, this.setClear(ie);
        }
      },
      getReversed: function() {
        return at;
      },
      setTest: function(ot) {
        ot ? rt(i.DEPTH_TEST) : yt(i.DEPTH_TEST);
      },
      setMask: function(ot) {
        k !== ot && !P && (i.depthMask(ot), k = ot);
      },
      setFunc: function(ot) {
        if (at && (ot = ig[ot]), $ !== ot) {
          switch (ot) {
            case Us:
              i.depthFunc(i.NEVER);
              break;
            case Ns:
              i.depthFunc(i.ALWAYS);
              break;
            case Fs:
              i.depthFunc(i.LESS);
              break;
            case _i:
              i.depthFunc(i.LEQUAL);
              break;
            case Os:
              i.depthFunc(i.EQUAL);
              break;
            case Bs:
              i.depthFunc(i.GEQUAL);
              break;
            case zs:
              i.depthFunc(i.GREATER);
              break;
            case Hs:
              i.depthFunc(i.NOTEQUAL);
              break;
            default:
              i.depthFunc(i.LEQUAL);
          }
          $ = ot;
        }
      },
      setLocked: function(ot) {
        P = ot;
      },
      setClear: function(ot) {
        lt !== ot && (at && (ot = 1 - ot), i.clearDepth(ot), lt = ot);
      },
      reset: function() {
        P = !1, k = null, $ = null, lt = null, at = !1;
      }
    };
  }
  function r() {
    let P = !1, at = null, k = null, $ = null, lt = null, ot = null, Pt = null, ie = null, ve = null;
    return {
      setTest: function($t) {
        P || ($t ? rt(i.STENCIL_TEST) : yt(i.STENCIL_TEST));
      },
      setMask: function($t) {
        at !== $t && !P && (i.stencilMask($t), at = $t);
      },
      setFunc: function($t, ke, an) {
        (k !== $t || $ !== ke || lt !== an) && (i.stencilFunc($t, ke, an), k = $t, $ = ke, lt = an);
      },
      setOp: function($t, ke, an) {
        (ot !== $t || Pt !== ke || ie !== an) && (i.stencilOp($t, ke, an), ot = $t, Pt = ke, ie = an);
      },
      setLocked: function($t) {
        P = $t;
      },
      setClear: function($t) {
        ve !== $t && (i.clearStencil($t), ve = $t);
      },
      reset: function() {
        P = !1, at = null, k = null, $ = null, lt = null, ot = null, Pt = null, ie = null, ve = null;
      }
    };
  }
  const s = new e(), a = new n(), o = new r(), l = /* @__PURE__ */ new WeakMap(), c = /* @__PURE__ */ new WeakMap();
  let h = {}, u = {}, f = /* @__PURE__ */ new WeakMap(), d = [], g = null, v = !1, m = null, p = null, A = null, T = null, S = null, N = null, w = null, R = new Ft(0, 0, 0), U = 0, y = !1, M = null, C = null, H = null, B = null, G = null;
  const Z = i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  let W = !1, Q = 0;
  const V = i.getParameter(i.VERSION);
  V.indexOf("WebGL") !== -1 ? (Q = parseFloat(/^WebGL (\d)/.exec(V)[1]), W = Q >= 1) : V.indexOf("OpenGL ES") !== -1 && (Q = parseFloat(/^OpenGL ES (\d)/.exec(V)[1]), W = Q >= 2);
  let it = null, ht = {};
  const vt = i.getParameter(i.SCISSOR_BOX), Ut = i.getParameter(i.VIEWPORT), Jt = new se().fromArray(vt), q = new se().fromArray(Ut);
  function tt(P, at, k, $) {
    const lt = new Uint8Array(4), ot = i.createTexture();
    i.bindTexture(P, ot), i.texParameteri(P, i.TEXTURE_MIN_FILTER, i.NEAREST), i.texParameteri(P, i.TEXTURE_MAG_FILTER, i.NEAREST);
    for (let Pt = 0; Pt < k; Pt++)
      P === i.TEXTURE_3D || P === i.TEXTURE_2D_ARRAY ? i.texImage3D(at, 0, i.RGBA, 1, 1, $, 0, i.RGBA, i.UNSIGNED_BYTE, lt) : i.texImage2D(at + Pt, 0, i.RGBA, 1, 1, 0, i.RGBA, i.UNSIGNED_BYTE, lt);
    return ot;
  }
  const pt = {};
  pt[i.TEXTURE_2D] = tt(i.TEXTURE_2D, i.TEXTURE_2D, 1), pt[i.TEXTURE_CUBE_MAP] = tt(i.TEXTURE_CUBE_MAP, i.TEXTURE_CUBE_MAP_POSITIVE_X, 6), pt[i.TEXTURE_2D_ARRAY] = tt(i.TEXTURE_2D_ARRAY, i.TEXTURE_2D_ARRAY, 1, 1), pt[i.TEXTURE_3D] = tt(i.TEXTURE_3D, i.TEXTURE_3D, 1, 1), s.setClear(0, 0, 0, 1), a.setClear(1), o.setClear(0), rt(i.DEPTH_TEST), a.setFunc(_i), Ht(!1), Bt(Xa), rt(i.CULL_FACE), b(bn);
  function rt(P) {
    h[P] !== !0 && (i.enable(P), h[P] = !0);
  }
  function yt(P) {
    h[P] !== !1 && (i.disable(P), h[P] = !1);
  }
  function Xt(P, at) {
    return u[P] !== at ? (i.bindFramebuffer(P, at), u[P] = at, P === i.DRAW_FRAMEBUFFER && (u[i.FRAMEBUFFER] = at), P === i.FRAMEBUFFER && (u[i.DRAW_FRAMEBUFFER] = at), !0) : !1;
  }
  function bt(P, at) {
    let k = d, $ = !1;
    if (P) {
      k = f.get(at), k === void 0 && (k = [], f.set(at, k));
      const lt = P.textures;
      if (k.length !== lt.length || k[0] !== i.COLOR_ATTACHMENT0) {
        for (let ot = 0, Pt = lt.length; ot < Pt; ot++)
          k[ot] = i.COLOR_ATTACHMENT0 + ot;
        k.length = lt.length, $ = !0;
      }
    } else
      k[0] !== i.BACK && (k[0] = i.BACK, $ = !0);
    $ && i.drawBuffers(k);
  }
  function ae(P) {
    return g !== P ? (i.useProgram(P), g = P, !0) : !1;
  }
  const ee = {
    [Hn]: i.FUNC_ADD,
    [Ac]: i.FUNC_SUBTRACT,
    [bc]: i.FUNC_REVERSE_SUBTRACT
  };
  ee[wc] = i.MIN, ee[Rc] = i.MAX;
  const Ot = {
    [Cc]: i.ZERO,
    [Pc]: i.ONE,
    [Lc]: i.SRC_COLOR,
    [Ds]: i.SRC_ALPHA,
    [Oc]: i.SRC_ALPHA_SATURATE,
    [Nc]: i.DST_COLOR,
    [Ic]: i.DST_ALPHA,
    [Dc]: i.ONE_MINUS_SRC_COLOR,
    [Is]: i.ONE_MINUS_SRC_ALPHA,
    [Fc]: i.ONE_MINUS_DST_COLOR,
    [Uc]: i.ONE_MINUS_DST_ALPHA,
    [Bc]: i.CONSTANT_COLOR,
    [zc]: i.ONE_MINUS_CONSTANT_COLOR,
    [Hc]: i.CONSTANT_ALPHA,
    [kc]: i.ONE_MINUS_CONSTANT_ALPHA
  };
  function b(P, at, k, $, lt, ot, Pt, ie, ve, $t) {
    if (P === bn) {
      v === !0 && (yt(i.BLEND), v = !1);
      return;
    }
    if (v === !1 && (rt(i.BLEND), v = !0), P !== Tc) {
      if (P !== m || $t !== y) {
        if ((p !== Hn || S !== Hn) && (i.blendEquation(i.FUNC_ADD), p = Hn, S = Hn), $t)
          switch (P) {
            case mi:
              i.blendFuncSeparate(i.ONE, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA);
              break;
            case zr:
              i.blendFunc(i.ONE, i.ONE);
              break;
            case qa:
              i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE);
              break;
            case Ya:
              i.blendFuncSeparate(i.ZERO, i.SRC_COLOR, i.ZERO, i.SRC_ALPHA);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", P);
              break;
          }
        else
          switch (P) {
            case mi:
              i.blendFuncSeparate(i.SRC_ALPHA, i.ONE_MINUS_SRC_ALPHA, i.ONE, i.ONE_MINUS_SRC_ALPHA);
              break;
            case zr:
              i.blendFunc(i.SRC_ALPHA, i.ONE);
              break;
            case qa:
              i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE);
              break;
            case Ya:
              i.blendFunc(i.ZERO, i.SRC_COLOR);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", P);
              break;
          }
        A = null, T = null, N = null, w = null, R.set(0, 0, 0), U = 0, m = P, y = $t;
      }
      return;
    }
    lt = lt || at, ot = ot || k, Pt = Pt || $, (at !== p || lt !== S) && (i.blendEquationSeparate(ee[at], ee[lt]), p = at, S = lt), (k !== A || $ !== T || ot !== N || Pt !== w) && (i.blendFuncSeparate(Ot[k], Ot[$], Ot[ot], Ot[Pt]), A = k, T = $, N = ot, w = Pt), (ie.equals(R) === !1 || ve !== U) && (i.blendColor(ie.r, ie.g, ie.b, ve), R.copy(ie), U = ve), m = P, y = !1;
  }
  function Fe(P, at) {
    P.side === we ? yt(i.CULL_FACE) : rt(i.CULL_FACE);
    let k = P.side === Ce;
    at && (k = !k), Ht(k), P.blending === mi && P.transparent === !1 ? b(bn) : b(P.blending, P.blendEquation, P.blendSrc, P.blendDst, P.blendEquationAlpha, P.blendSrcAlpha, P.blendDstAlpha, P.blendColor, P.blendAlpha, P.premultipliedAlpha), a.setFunc(P.depthFunc), a.setTest(P.depthTest), a.setMask(P.depthWrite), s.setMask(P.colorWrite);
    const $ = P.stencilWrite;
    o.setTest($), $ && (o.setMask(P.stencilWriteMask), o.setFunc(P.stencilFunc, P.stencilRef, P.stencilFuncMask), o.setOp(P.stencilFail, P.stencilZFail, P.stencilZPass)), Qt(P.polygonOffset, P.polygonOffsetFactor, P.polygonOffsetUnits), P.alphaToCoverage === !0 ? rt(i.SAMPLE_ALPHA_TO_COVERAGE) : yt(i.SAMPLE_ALPHA_TO_COVERAGE);
  }
  function Ht(P) {
    M !== P && (P ? i.frontFace(i.CW) : i.frontFace(i.CCW), M = P);
  }
  function Bt(P) {
    P !== yc ? (rt(i.CULL_FACE), P !== C && (P === Xa ? i.cullFace(i.BACK) : P === Ec ? i.cullFace(i.FRONT) : i.cullFace(i.FRONT_AND_BACK))) : yt(i.CULL_FACE), C = P;
  }
  function xt(P) {
    P !== H && (W && i.lineWidth(P), H = P);
  }
  function Qt(P, at, k) {
    P ? (rt(i.POLYGON_OFFSET_FILL), (B !== at || G !== k) && (i.polygonOffset(at, k), B = at, G = k)) : yt(i.POLYGON_OFFSET_FILL);
  }
  function _t(P) {
    P ? rt(i.SCISSOR_TEST) : yt(i.SCISSOR_TEST);
  }
  function E(P) {
    P === void 0 && (P = i.TEXTURE0 + Z - 1), it !== P && (i.activeTexture(P), it = P);
  }
  function _(P, at, k) {
    k === void 0 && (it === null ? k = i.TEXTURE0 + Z - 1 : k = it);
    let $ = ht[k];
    $ === void 0 && ($ = { type: void 0, texture: void 0 }, ht[k] = $), ($.type !== P || $.texture !== at) && (it !== k && (i.activeTexture(k), it = k), i.bindTexture(P, at || pt[P]), $.type = P, $.texture = at);
  }
  function F() {
    const P = ht[it];
    P !== void 0 && P.type !== void 0 && (i.bindTexture(P.type, null), P.type = void 0, P.texture = void 0);
  }
  function Y() {
    try {
      i.compressedTexImage2D(...arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function J() {
    try {
      i.compressedTexImage3D(...arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function X() {
    try {
      i.texSubImage2D(...arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function gt() {
    try {
      i.texSubImage3D(...arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function st() {
    try {
      i.compressedTexSubImage2D(...arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function Et() {
    try {
      i.compressedTexSubImage3D(...arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function Tt() {
    try {
      i.texStorage2D(...arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function K() {
    try {
      i.texStorage3D(...arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function ut() {
    try {
      i.texImage2D(...arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function At() {
    try {
      i.texImage3D(...arguments);
    } catch (P) {
      console.error("THREE.WebGLState:", P);
    }
  }
  function Rt(P) {
    Jt.equals(P) === !1 && (i.scissor(P.x, P.y, P.z, P.w), Jt.copy(P));
  }
  function dt(P) {
    q.equals(P) === !1 && (i.viewport(P.x, P.y, P.z, P.w), q.copy(P));
  }
  function zt(P, at) {
    let k = c.get(at);
    k === void 0 && (k = /* @__PURE__ */ new WeakMap(), c.set(at, k));
    let $ = k.get(P);
    $ === void 0 && ($ = i.getUniformBlockIndex(at, P.name), k.set(P, $));
  }
  function Dt(P, at) {
    const $ = c.get(at).get(P);
    l.get(at) !== $ && (i.uniformBlockBinding(at, $, P.__bindingPointIndex), l.set(at, $));
  }
  function jt() {
    i.disable(i.BLEND), i.disable(i.CULL_FACE), i.disable(i.DEPTH_TEST), i.disable(i.POLYGON_OFFSET_FILL), i.disable(i.SCISSOR_TEST), i.disable(i.STENCIL_TEST), i.disable(i.SAMPLE_ALPHA_TO_COVERAGE), i.blendEquation(i.FUNC_ADD), i.blendFunc(i.ONE, i.ZERO), i.blendFuncSeparate(i.ONE, i.ZERO, i.ONE, i.ZERO), i.blendColor(0, 0, 0, 0), i.colorMask(!0, !0, !0, !0), i.clearColor(0, 0, 0, 0), i.depthMask(!0), i.depthFunc(i.LESS), a.setReversed(!1), i.clearDepth(1), i.stencilMask(4294967295), i.stencilFunc(i.ALWAYS, 0, 4294967295), i.stencilOp(i.KEEP, i.KEEP, i.KEEP), i.clearStencil(0), i.cullFace(i.BACK), i.frontFace(i.CCW), i.polygonOffset(0, 0), i.activeTexture(i.TEXTURE0), i.bindFramebuffer(i.FRAMEBUFFER, null), i.bindFramebuffer(i.DRAW_FRAMEBUFFER, null), i.bindFramebuffer(i.READ_FRAMEBUFFER, null), i.useProgram(null), i.lineWidth(1), i.scissor(0, 0, i.canvas.width, i.canvas.height), i.viewport(0, 0, i.canvas.width, i.canvas.height), h = {}, it = null, ht = {}, u = {}, f = /* @__PURE__ */ new WeakMap(), d = [], g = null, v = !1, m = null, p = null, A = null, T = null, S = null, N = null, w = null, R = new Ft(0, 0, 0), U = 0, y = !1, M = null, C = null, H = null, B = null, G = null, Jt.set(0, 0, i.canvas.width, i.canvas.height), q.set(0, 0, i.canvas.width, i.canvas.height), s.reset(), a.reset(), o.reset();
  }
  return {
    buffers: {
      color: s,
      depth: a,
      stencil: o
    },
    enable: rt,
    disable: yt,
    bindFramebuffer: Xt,
    drawBuffers: bt,
    useProgram: ae,
    setBlending: b,
    setMaterial: Fe,
    setFlipSided: Ht,
    setCullFace: Bt,
    setLineWidth: xt,
    setPolygonOffset: Qt,
    setScissorTest: _t,
    activeTexture: E,
    bindTexture: _,
    unbindTexture: F,
    compressedTexImage2D: Y,
    compressedTexImage3D: J,
    texImage2D: ut,
    texImage3D: At,
    updateUBOMapping: zt,
    uniformBlockBinding: Dt,
    texStorage2D: Tt,
    texStorage3D: K,
    texSubImage2D: X,
    texSubImage3D: gt,
    compressedTexSubImage2D: st,
    compressedTexSubImage3D: Et,
    scissor: Rt,
    viewport: dt,
    reset: jt
  };
}
function sg(i, t, e, n, r, s, a) {
  const o = t.has("WEBGL_multisampled_render_to_texture") ? t.get("WEBGL_multisampled_render_to_texture") : null, l = typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent), c = new mt(), h = /* @__PURE__ */ new WeakMap();
  let u;
  const f = /* @__PURE__ */ new WeakMap();
  let d = !1;
  try {
    d = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null;
  } catch {
  }
  function g(E, _) {
    return d ? (
      // eslint-disable-next-line compat/compat
      new OffscreenCanvas(E, _)
    ) : $i("canvas");
  }
  function v(E, _, F) {
    let Y = 1;
    const J = _t(E);
    if ((J.width > F || J.height > F) && (Y = F / Math.max(J.width, J.height)), Y < 1)
      if (typeof HTMLImageElement < "u" && E instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && E instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && E instanceof ImageBitmap || typeof VideoFrame < "u" && E instanceof VideoFrame) {
        const X = Math.floor(Y * J.width), gt = Math.floor(Y * J.height);
        u === void 0 && (u = g(X, gt));
        const st = _ ? g(X, gt) : u;
        return st.width = X, st.height = gt, st.getContext("2d").drawImage(E, 0, 0, X, gt), console.warn("THREE.WebGLRenderer: Texture has been resized from (" + J.width + "x" + J.height + ") to (" + X + "x" + gt + ")."), st;
      } else
        return "data" in E && console.warn("THREE.WebGLRenderer: Image in DataTexture is too big (" + J.width + "x" + J.height + ")."), E;
    return E;
  }
  function m(E) {
    return E.generateMipmaps;
  }
  function p(E) {
    i.generateMipmap(E);
  }
  function A(E) {
    return E.isWebGLCubeRenderTarget ? i.TEXTURE_CUBE_MAP : E.isWebGL3DRenderTarget ? i.TEXTURE_3D : E.isWebGLArrayRenderTarget || E.isCompressedArrayTexture ? i.TEXTURE_2D_ARRAY : i.TEXTURE_2D;
  }
  function T(E, _, F, Y, J = !1) {
    if (E !== null) {
      if (i[E] !== void 0) return i[E];
      console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '" + E + "'");
    }
    let X = _;
    if (_ === i.RED && (F === i.FLOAT && (X = i.R32F), F === i.HALF_FLOAT && (X = i.R16F), F === i.UNSIGNED_BYTE && (X = i.R8)), _ === i.RED_INTEGER && (F === i.UNSIGNED_BYTE && (X = i.R8UI), F === i.UNSIGNED_SHORT && (X = i.R16UI), F === i.UNSIGNED_INT && (X = i.R32UI), F === i.BYTE && (X = i.R8I), F === i.SHORT && (X = i.R16I), F === i.INT && (X = i.R32I)), _ === i.RG && (F === i.FLOAT && (X = i.RG32F), F === i.HALF_FLOAT && (X = i.RG16F), F === i.UNSIGNED_BYTE && (X = i.RG8)), _ === i.RG_INTEGER && (F === i.UNSIGNED_BYTE && (X = i.RG8UI), F === i.UNSIGNED_SHORT && (X = i.RG16UI), F === i.UNSIGNED_INT && (X = i.RG32UI), F === i.BYTE && (X = i.RG8I), F === i.SHORT && (X = i.RG16I), F === i.INT && (X = i.RG32I)), _ === i.RGB_INTEGER && (F === i.UNSIGNED_BYTE && (X = i.RGB8UI), F === i.UNSIGNED_SHORT && (X = i.RGB16UI), F === i.UNSIGNED_INT && (X = i.RGB32UI), F === i.BYTE && (X = i.RGB8I), F === i.SHORT && (X = i.RGB16I), F === i.INT && (X = i.RGB32I)), _ === i.RGBA_INTEGER && (F === i.UNSIGNED_BYTE && (X = i.RGBA8UI), F === i.UNSIGNED_SHORT && (X = i.RGBA16UI), F === i.UNSIGNED_INT && (X = i.RGBA32UI), F === i.BYTE && (X = i.RGBA8I), F === i.SHORT && (X = i.RGBA16I), F === i.INT && (X = i.RGBA32I)), _ === i.RGB && F === i.UNSIGNED_INT_5_9_9_9_REV && (X = i.RGB9_E5), _ === i.RGBA) {
      const gt = J ? Hr : Gt.getTransfer(Y);
      F === i.FLOAT && (X = i.RGBA32F), F === i.HALF_FLOAT && (X = i.RGBA16F), F === i.UNSIGNED_BYTE && (X = gt === Zt ? i.SRGB8_ALPHA8 : i.RGBA8), F === i.UNSIGNED_SHORT_4_4_4_4 && (X = i.RGBA4), F === i.UNSIGNED_SHORT_5_5_5_1 && (X = i.RGB5_A1);
    }
    return (X === i.R16F || X === i.R32F || X === i.RG16F || X === i.RG32F || X === i.RGBA16F || X === i.RGBA32F) && t.get("EXT_color_buffer_float"), X;
  }
  function S(E, _) {
    let F;
    return E ? _ === null || _ === qn || _ === Xi ? F = i.DEPTH24_STENCIL8 : _ === tn ? F = i.DEPTH32F_STENCIL8 : _ === Wi && (F = i.DEPTH24_STENCIL8, console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")) : _ === null || _ === qn || _ === Xi ? F = i.DEPTH_COMPONENT24 : _ === tn ? F = i.DEPTH_COMPONENT32F : _ === Wi && (F = i.DEPTH_COMPONENT16), F;
  }
  function N(E, _) {
    return m(E) === !0 || E.isFramebufferTexture && E.minFilter !== Ue && E.minFilter !== ye ? Math.log2(Math.max(_.width, _.height)) + 1 : E.mipmaps !== void 0 && E.mipmaps.length > 0 ? E.mipmaps.length : E.isCompressedTexture && Array.isArray(E.image) ? _.mipmaps.length : 1;
  }
  function w(E) {
    const _ = E.target;
    _.removeEventListener("dispose", w), U(_), _.isVideoTexture && h.delete(_);
  }
  function R(E) {
    const _ = E.target;
    _.removeEventListener("dispose", R), M(_);
  }
  function U(E) {
    const _ = n.get(E);
    if (_.__webglInit === void 0) return;
    const F = E.source, Y = f.get(F);
    if (Y) {
      const J = Y[_.__cacheKey];
      J.usedTimes--, J.usedTimes === 0 && y(E), Object.keys(Y).length === 0 && f.delete(F);
    }
    n.remove(E);
  }
  function y(E) {
    const _ = n.get(E);
    i.deleteTexture(_.__webglTexture);
    const F = E.source, Y = f.get(F);
    delete Y[_.__cacheKey], a.memory.textures--;
  }
  function M(E) {
    const _ = n.get(E);
    if (E.depthTexture && (E.depthTexture.dispose(), n.remove(E.depthTexture)), E.isWebGLCubeRenderTarget)
      for (let Y = 0; Y < 6; Y++) {
        if (Array.isArray(_.__webglFramebuffer[Y]))
          for (let J = 0; J < _.__webglFramebuffer[Y].length; J++) i.deleteFramebuffer(_.__webglFramebuffer[Y][J]);
        else
          i.deleteFramebuffer(_.__webglFramebuffer[Y]);
        _.__webglDepthbuffer && i.deleteRenderbuffer(_.__webglDepthbuffer[Y]);
      }
    else {
      if (Array.isArray(_.__webglFramebuffer))
        for (let Y = 0; Y < _.__webglFramebuffer.length; Y++) i.deleteFramebuffer(_.__webglFramebuffer[Y]);
      else
        i.deleteFramebuffer(_.__webglFramebuffer);
      if (_.__webglDepthbuffer && i.deleteRenderbuffer(_.__webglDepthbuffer), _.__webglMultisampledFramebuffer && i.deleteFramebuffer(_.__webglMultisampledFramebuffer), _.__webglColorRenderbuffer)
        for (let Y = 0; Y < _.__webglColorRenderbuffer.length; Y++)
          _.__webglColorRenderbuffer[Y] && i.deleteRenderbuffer(_.__webglColorRenderbuffer[Y]);
      _.__webglDepthRenderbuffer && i.deleteRenderbuffer(_.__webglDepthRenderbuffer);
    }
    const F = E.textures;
    for (let Y = 0, J = F.length; Y < J; Y++) {
      const X = n.get(F[Y]);
      X.__webglTexture && (i.deleteTexture(X.__webglTexture), a.memory.textures--), n.remove(F[Y]);
    }
    n.remove(E);
  }
  let C = 0;
  function H() {
    C = 0;
  }
  function B() {
    const E = C;
    return E >= r.maxTextures && console.warn("THREE.WebGLTextures: Trying to use " + E + " texture units while this GPU supports only " + r.maxTextures), C += 1, E;
  }
  function G(E) {
    const _ = [];
    return _.push(E.wrapS), _.push(E.wrapT), _.push(E.wrapR || 0), _.push(E.magFilter), _.push(E.minFilter), _.push(E.anisotropy), _.push(E.internalFormat), _.push(E.format), _.push(E.type), _.push(E.generateMipmaps), _.push(E.premultiplyAlpha), _.push(E.flipY), _.push(E.unpackAlignment), _.push(E.colorSpace), _.join();
  }
  function Z(E, _) {
    const F = n.get(E);
    if (E.isVideoTexture && xt(E), E.isRenderTargetTexture === !1 && E.version > 0 && F.__version !== E.version) {
      const Y = E.image;
      if (Y === null)
        console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");
      else if (Y.complete === !1)
        console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");
      else {
        q(F, E, _);
        return;
      }
    }
    e.bindTexture(i.TEXTURE_2D, F.__webglTexture, i.TEXTURE0 + _);
  }
  function W(E, _) {
    const F = n.get(E);
    if (E.version > 0 && F.__version !== E.version) {
      q(F, E, _);
      return;
    }
    e.bindTexture(i.TEXTURE_2D_ARRAY, F.__webglTexture, i.TEXTURE0 + _);
  }
  function Q(E, _) {
    const F = n.get(E);
    if (E.version > 0 && F.__version !== E.version) {
      q(F, E, _);
      return;
    }
    e.bindTexture(i.TEXTURE_3D, F.__webglTexture, i.TEXTURE0 + _);
  }
  function V(E, _) {
    const F = n.get(E);
    if (E.version > 0 && F.__version !== E.version) {
      tt(F, E, _);
      return;
    }
    e.bindTexture(i.TEXTURE_CUBE_MAP, F.__webglTexture, i.TEXTURE0 + _);
  }
  const it = {
    [Xn]: i.REPEAT,
    [Vn]: i.CLAMP_TO_EDGE,
    [Gs]: i.MIRRORED_REPEAT
  }, ht = {
    [Ue]: i.NEAREST,
    [Jc]: i.NEAREST_MIPMAP_NEAREST,
    [sr]: i.NEAREST_MIPMAP_LINEAR,
    [ye]: i.LINEAR,
    [Zr]: i.LINEAR_MIPMAP_NEAREST,
    [Gn]: i.LINEAR_MIPMAP_LINEAR
  }, vt = {
    [th]: i.NEVER,
    [ah]: i.ALWAYS,
    [eh]: i.LESS,
    [Cl]: i.LEQUAL,
    [nh]: i.EQUAL,
    [sh]: i.GEQUAL,
    [ih]: i.GREATER,
    [rh]: i.NOTEQUAL
  };
  function Ut(E, _) {
    if (_.type === tn && t.has("OES_texture_float_linear") === !1 && (_.magFilter === ye || _.magFilter === Zr || _.magFilter === sr || _.magFilter === Gn || _.minFilter === ye || _.minFilter === Zr || _.minFilter === sr || _.minFilter === Gn) && console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."), i.texParameteri(E, i.TEXTURE_WRAP_S, it[_.wrapS]), i.texParameteri(E, i.TEXTURE_WRAP_T, it[_.wrapT]), (E === i.TEXTURE_3D || E === i.TEXTURE_2D_ARRAY) && i.texParameteri(E, i.TEXTURE_WRAP_R, it[_.wrapR]), i.texParameteri(E, i.TEXTURE_MAG_FILTER, ht[_.magFilter]), i.texParameteri(E, i.TEXTURE_MIN_FILTER, ht[_.minFilter]), _.compareFunction && (i.texParameteri(E, i.TEXTURE_COMPARE_MODE, i.COMPARE_REF_TO_TEXTURE), i.texParameteri(E, i.TEXTURE_COMPARE_FUNC, vt[_.compareFunction])), t.has("EXT_texture_filter_anisotropic") === !0) {
      if (_.magFilter === Ue || _.minFilter !== sr && _.minFilter !== Gn || _.type === tn && t.has("OES_texture_float_linear") === !1) return;
      if (_.anisotropy > 1 || n.get(_).__currentAnisotropy) {
        const F = t.get("EXT_texture_filter_anisotropic");
        i.texParameterf(E, F.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(_.anisotropy, r.getMaxAnisotropy())), n.get(_).__currentAnisotropy = _.anisotropy;
      }
    }
  }
  function Jt(E, _) {
    let F = !1;
    E.__webglInit === void 0 && (E.__webglInit = !0, _.addEventListener("dispose", w));
    const Y = _.source;
    let J = f.get(Y);
    J === void 0 && (J = {}, f.set(Y, J));
    const X = G(_);
    if (X !== E.__cacheKey) {
      J[X] === void 0 && (J[X] = {
        texture: i.createTexture(),
        usedTimes: 0
      }, a.memory.textures++, F = !0), J[X].usedTimes++;
      const gt = J[E.__cacheKey];
      gt !== void 0 && (J[E.__cacheKey].usedTimes--, gt.usedTimes === 0 && y(_)), E.__cacheKey = X, E.__webglTexture = J[X].texture;
    }
    return F;
  }
  function q(E, _, F) {
    let Y = i.TEXTURE_2D;
    (_.isDataArrayTexture || _.isCompressedArrayTexture) && (Y = i.TEXTURE_2D_ARRAY), _.isData3DTexture && (Y = i.TEXTURE_3D);
    const J = Jt(E, _), X = _.source;
    e.bindTexture(Y, E.__webglTexture, i.TEXTURE0 + F);
    const gt = n.get(X);
    if (X.version !== gt.__version || J === !0) {
      e.activeTexture(i.TEXTURE0 + F);
      const st = Gt.getPrimaries(Gt.workingColorSpace), Et = _.colorSpace === fn ? null : Gt.getPrimaries(_.colorSpace), Tt = _.colorSpace === fn || st === Et ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
      i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, _.flipY), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, _.premultiplyAlpha), i.pixelStorei(i.UNPACK_ALIGNMENT, _.unpackAlignment), i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, Tt);
      let K = v(_.image, !1, r.maxTextureSize);
      K = Qt(_, K);
      const ut = s.convert(_.format, _.colorSpace), At = s.convert(_.type);
      let Rt = T(_.internalFormat, ut, At, _.colorSpace, _.isVideoTexture);
      Ut(Y, _);
      let dt;
      const zt = _.mipmaps, Dt = _.isVideoTexture !== !0, jt = gt.__version === void 0 || J === !0, P = X.dataReady, at = N(_, K);
      if (_.isDepthTexture)
        Rt = S(_.format === Yi, _.type), jt && (Dt ? e.texStorage2D(i.TEXTURE_2D, 1, Rt, K.width, K.height) : e.texImage2D(i.TEXTURE_2D, 0, Rt, K.width, K.height, 0, ut, At, null));
      else if (_.isDataTexture)
        if (zt.length > 0) {
          Dt && jt && e.texStorage2D(i.TEXTURE_2D, at, Rt, zt[0].width, zt[0].height);
          for (let k = 0, $ = zt.length; k < $; k++)
            dt = zt[k], Dt ? P && e.texSubImage2D(i.TEXTURE_2D, k, 0, 0, dt.width, dt.height, ut, At, dt.data) : e.texImage2D(i.TEXTURE_2D, k, Rt, dt.width, dt.height, 0, ut, At, dt.data);
          _.generateMipmaps = !1;
        } else
          Dt ? (jt && e.texStorage2D(i.TEXTURE_2D, at, Rt, K.width, K.height), P && e.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, K.width, K.height, ut, At, K.data)) : e.texImage2D(i.TEXTURE_2D, 0, Rt, K.width, K.height, 0, ut, At, K.data);
      else if (_.isCompressedTexture)
        if (_.isCompressedArrayTexture) {
          Dt && jt && e.texStorage3D(i.TEXTURE_2D_ARRAY, at, Rt, zt[0].width, zt[0].height, K.depth);
          for (let k = 0, $ = zt.length; k < $; k++)
            if (dt = zt[k], _.format !== $e)
              if (ut !== null)
                if (Dt) {
                  if (P)
                    if (_.layerUpdates.size > 0) {
                      const lt = wo(dt.width, dt.height, _.format, _.type);
                      for (const ot of _.layerUpdates) {
                        const Pt = dt.data.subarray(
                          ot * lt / dt.data.BYTES_PER_ELEMENT,
                          (ot + 1) * lt / dt.data.BYTES_PER_ELEMENT
                        );
                        e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY, k, 0, 0, ot, dt.width, dt.height, 1, ut, Pt);
                      }
                      _.clearLayerUpdates();
                    } else
                      e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY, k, 0, 0, 0, dt.width, dt.height, K.depth, ut, dt.data);
                } else
                  e.compressedTexImage3D(i.TEXTURE_2D_ARRAY, k, Rt, dt.width, dt.height, K.depth, 0, dt.data, 0, 0);
              else
                console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");
            else
              Dt ? P && e.texSubImage3D(i.TEXTURE_2D_ARRAY, k, 0, 0, 0, dt.width, dt.height, K.depth, ut, At, dt.data) : e.texImage3D(i.TEXTURE_2D_ARRAY, k, Rt, dt.width, dt.height, K.depth, 0, ut, At, dt.data);
        } else {
          Dt && jt && e.texStorage2D(i.TEXTURE_2D, at, Rt, zt[0].width, zt[0].height);
          for (let k = 0, $ = zt.length; k < $; k++)
            dt = zt[k], _.format !== $e ? ut !== null ? Dt ? P && e.compressedTexSubImage2D(i.TEXTURE_2D, k, 0, 0, dt.width, dt.height, ut, dt.data) : e.compressedTexImage2D(i.TEXTURE_2D, k, Rt, dt.width, dt.height, 0, dt.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : Dt ? P && e.texSubImage2D(i.TEXTURE_2D, k, 0, 0, dt.width, dt.height, ut, At, dt.data) : e.texImage2D(i.TEXTURE_2D, k, Rt, dt.width, dt.height, 0, ut, At, dt.data);
        }
      else if (_.isDataArrayTexture)
        if (Dt) {
          if (jt && e.texStorage3D(i.TEXTURE_2D_ARRAY, at, Rt, K.width, K.height, K.depth), P)
            if (_.layerUpdates.size > 0) {
              const k = wo(K.width, K.height, _.format, _.type);
              for (const $ of _.layerUpdates) {
                const lt = K.data.subarray(
                  $ * k / K.data.BYTES_PER_ELEMENT,
                  ($ + 1) * k / K.data.BYTES_PER_ELEMENT
                );
                e.texSubImage3D(i.TEXTURE_2D_ARRAY, 0, 0, 0, $, K.width, K.height, 1, ut, At, lt);
              }
              _.clearLayerUpdates();
            } else
              e.texSubImage3D(i.TEXTURE_2D_ARRAY, 0, 0, 0, 0, K.width, K.height, K.depth, ut, At, K.data);
        } else
          e.texImage3D(i.TEXTURE_2D_ARRAY, 0, Rt, K.width, K.height, K.depth, 0, ut, At, K.data);
      else if (_.isData3DTexture)
        Dt ? (jt && e.texStorage3D(i.TEXTURE_3D, at, Rt, K.width, K.height, K.depth), P && e.texSubImage3D(i.TEXTURE_3D, 0, 0, 0, 0, K.width, K.height, K.depth, ut, At, K.data)) : e.texImage3D(i.TEXTURE_3D, 0, Rt, K.width, K.height, K.depth, 0, ut, At, K.data);
      else if (_.isFramebufferTexture) {
        if (jt)
          if (Dt)
            e.texStorage2D(i.TEXTURE_2D, at, Rt, K.width, K.height);
          else {
            let k = K.width, $ = K.height;
            for (let lt = 0; lt < at; lt++)
              e.texImage2D(i.TEXTURE_2D, lt, Rt, k, $, 0, ut, At, null), k >>= 1, $ >>= 1;
          }
      } else if (zt.length > 0) {
        if (Dt && jt) {
          const k = _t(zt[0]);
          e.texStorage2D(i.TEXTURE_2D, at, Rt, k.width, k.height);
        }
        for (let k = 0, $ = zt.length; k < $; k++)
          dt = zt[k], Dt ? P && e.texSubImage2D(i.TEXTURE_2D, k, 0, 0, ut, At, dt) : e.texImage2D(i.TEXTURE_2D, k, Rt, ut, At, dt);
        _.generateMipmaps = !1;
      } else if (Dt) {
        if (jt) {
          const k = _t(K);
          e.texStorage2D(i.TEXTURE_2D, at, Rt, k.width, k.height);
        }
        P && e.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, ut, At, K);
      } else
        e.texImage2D(i.TEXTURE_2D, 0, Rt, ut, At, K);
      m(_) && p(Y), gt.__version = X.version, _.onUpdate && _.onUpdate(_);
    }
    E.__version = _.version;
  }
  function tt(E, _, F) {
    if (_.image.length !== 6) return;
    const Y = Jt(E, _), J = _.source;
    e.bindTexture(i.TEXTURE_CUBE_MAP, E.__webglTexture, i.TEXTURE0 + F);
    const X = n.get(J);
    if (J.version !== X.__version || Y === !0) {
      e.activeTexture(i.TEXTURE0 + F);
      const gt = Gt.getPrimaries(Gt.workingColorSpace), st = _.colorSpace === fn ? null : Gt.getPrimaries(_.colorSpace), Et = _.colorSpace === fn || gt === st ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
      i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, _.flipY), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, _.premultiplyAlpha), i.pixelStorei(i.UNPACK_ALIGNMENT, _.unpackAlignment), i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, Et);
      const Tt = _.isCompressedTexture || _.image[0].isCompressedTexture, K = _.image[0] && _.image[0].isDataTexture, ut = [];
      for (let $ = 0; $ < 6; $++)
        !Tt && !K ? ut[$] = v(_.image[$], !0, r.maxCubemapSize) : ut[$] = K ? _.image[$].image : _.image[$], ut[$] = Qt(_, ut[$]);
      const At = ut[0], Rt = s.convert(_.format, _.colorSpace), dt = s.convert(_.type), zt = T(_.internalFormat, Rt, dt, _.colorSpace), Dt = _.isVideoTexture !== !0, jt = X.__version === void 0 || Y === !0, P = J.dataReady;
      let at = N(_, At);
      Ut(i.TEXTURE_CUBE_MAP, _);
      let k;
      if (Tt) {
        Dt && jt && e.texStorage2D(i.TEXTURE_CUBE_MAP, at, zt, At.width, At.height);
        for (let $ = 0; $ < 6; $++) {
          k = ut[$].mipmaps;
          for (let lt = 0; lt < k.length; lt++) {
            const ot = k[lt];
            _.format !== $e ? Rt !== null ? Dt ? P && e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + $, lt, 0, 0, ot.width, ot.height, Rt, ot.data) : e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + $, lt, zt, ot.width, ot.height, 0, ot.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : Dt ? P && e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + $, lt, 0, 0, ot.width, ot.height, Rt, dt, ot.data) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + $, lt, zt, ot.width, ot.height, 0, Rt, dt, ot.data);
          }
        }
      } else {
        if (k = _.mipmaps, Dt && jt) {
          k.length > 0 && at++;
          const $ = _t(ut[0]);
          e.texStorage2D(i.TEXTURE_CUBE_MAP, at, zt, $.width, $.height);
        }
        for (let $ = 0; $ < 6; $++)
          if (K) {
            Dt ? P && e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + $, 0, 0, 0, ut[$].width, ut[$].height, Rt, dt, ut[$].data) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + $, 0, zt, ut[$].width, ut[$].height, 0, Rt, dt, ut[$].data);
            for (let lt = 0; lt < k.length; lt++) {
              const Pt = k[lt].image[$].image;
              Dt ? P && e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + $, lt + 1, 0, 0, Pt.width, Pt.height, Rt, dt, Pt.data) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + $, lt + 1, zt, Pt.width, Pt.height, 0, Rt, dt, Pt.data);
            }
          } else {
            Dt ? P && e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + $, 0, 0, 0, Rt, dt, ut[$]) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + $, 0, zt, Rt, dt, ut[$]);
            for (let lt = 0; lt < k.length; lt++) {
              const ot = k[lt];
              Dt ? P && e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + $, lt + 1, 0, 0, Rt, dt, ot.image[$]) : e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X + $, lt + 1, zt, Rt, dt, ot.image[$]);
            }
          }
      }
      m(_) && p(i.TEXTURE_CUBE_MAP), X.__version = J.version, _.onUpdate && _.onUpdate(_);
    }
    E.__version = _.version;
  }
  function pt(E, _, F, Y, J, X) {
    const gt = s.convert(F.format, F.colorSpace), st = s.convert(F.type), Et = T(F.internalFormat, gt, st, F.colorSpace), Tt = n.get(_), K = n.get(F);
    if (K.__renderTarget = _, !Tt.__hasExternalTextures) {
      const ut = Math.max(1, _.width >> X), At = Math.max(1, _.height >> X);
      J === i.TEXTURE_3D || J === i.TEXTURE_2D_ARRAY ? e.texImage3D(J, X, Et, ut, At, _.depth, 0, gt, st, null) : e.texImage2D(J, X, Et, ut, At, 0, gt, st, null);
    }
    e.bindFramebuffer(i.FRAMEBUFFER, E), Bt(_) ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, Y, J, K.__webglTexture, 0, Ht(_)) : (J === i.TEXTURE_2D || J >= i.TEXTURE_CUBE_MAP_POSITIVE_X && J <= i.TEXTURE_CUBE_MAP_NEGATIVE_Z) && i.framebufferTexture2D(i.FRAMEBUFFER, Y, J, K.__webglTexture, X), e.bindFramebuffer(i.FRAMEBUFFER, null);
  }
  function rt(E, _, F) {
    if (i.bindRenderbuffer(i.RENDERBUFFER, E), _.depthBuffer) {
      const Y = _.depthTexture, J = Y && Y.isDepthTexture ? Y.type : null, X = S(_.stencilBuffer, J), gt = _.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, st = Ht(_);
      Bt(_) ? o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER, st, X, _.width, _.height) : F ? i.renderbufferStorageMultisample(i.RENDERBUFFER, st, X, _.width, _.height) : i.renderbufferStorage(i.RENDERBUFFER, X, _.width, _.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, gt, i.RENDERBUFFER, E);
    } else {
      const Y = _.textures;
      for (let J = 0; J < Y.length; J++) {
        const X = Y[J], gt = s.convert(X.format, X.colorSpace), st = s.convert(X.type), Et = T(X.internalFormat, gt, st, X.colorSpace), Tt = Ht(_);
        F && Bt(_) === !1 ? i.renderbufferStorageMultisample(i.RENDERBUFFER, Tt, Et, _.width, _.height) : Bt(_) ? o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER, Tt, Et, _.width, _.height) : i.renderbufferStorage(i.RENDERBUFFER, Et, _.width, _.height);
      }
    }
    i.bindRenderbuffer(i.RENDERBUFFER, null);
  }
  function yt(E, _) {
    if (_ && _.isWebGLCubeRenderTarget) throw new Error("Depth Texture with cube render targets is not supported");
    if (e.bindFramebuffer(i.FRAMEBUFFER, E), !(_.depthTexture && _.depthTexture.isDepthTexture))
      throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");
    const Y = n.get(_.depthTexture);
    Y.__renderTarget = _, (!Y.__webglTexture || _.depthTexture.image.width !== _.width || _.depthTexture.image.height !== _.height) && (_.depthTexture.image.width = _.width, _.depthTexture.image.height = _.height, _.depthTexture.needsUpdate = !0), Z(_.depthTexture, 0);
    const J = Y.__webglTexture, X = Ht(_);
    if (_.depthTexture.format === qi)
      Bt(_) ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, i.DEPTH_ATTACHMENT, i.TEXTURE_2D, J, 0, X) : i.framebufferTexture2D(i.FRAMEBUFFER, i.DEPTH_ATTACHMENT, i.TEXTURE_2D, J, 0);
    else if (_.depthTexture.format === Yi)
      Bt(_) ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, i.DEPTH_STENCIL_ATTACHMENT, i.TEXTURE_2D, J, 0, X) : i.framebufferTexture2D(i.FRAMEBUFFER, i.DEPTH_STENCIL_ATTACHMENT, i.TEXTURE_2D, J, 0);
    else
      throw new Error("Unknown depthTexture format");
  }
  function Xt(E) {
    const _ = n.get(E), F = E.isWebGLCubeRenderTarget === !0;
    if (_.__boundDepthTexture !== E.depthTexture) {
      const Y = E.depthTexture;
      if (_.__depthDisposeCallback && _.__depthDisposeCallback(), Y) {
        const J = () => {
          delete _.__boundDepthTexture, delete _.__depthDisposeCallback, Y.removeEventListener("dispose", J);
        };
        Y.addEventListener("dispose", J), _.__depthDisposeCallback = J;
      }
      _.__boundDepthTexture = Y;
    }
    if (E.depthTexture && !_.__autoAllocateDepthBuffer) {
      if (F) throw new Error("target.depthTexture not supported in Cube render targets");
      const Y = E.texture.mipmaps;
      Y && Y.length > 0 ? yt(_.__webglFramebuffer[0], E) : yt(_.__webglFramebuffer, E);
    } else if (F) {
      _.__webglDepthbuffer = [];
      for (let Y = 0; Y < 6; Y++)
        if (e.bindFramebuffer(i.FRAMEBUFFER, _.__webglFramebuffer[Y]), _.__webglDepthbuffer[Y] === void 0)
          _.__webglDepthbuffer[Y] = i.createRenderbuffer(), rt(_.__webglDepthbuffer[Y], E, !1);
        else {
          const J = E.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, X = _.__webglDepthbuffer[Y];
          i.bindRenderbuffer(i.RENDERBUFFER, X), i.framebufferRenderbuffer(i.FRAMEBUFFER, J, i.RENDERBUFFER, X);
        }
    } else {
      const Y = E.texture.mipmaps;
      if (Y && Y.length > 0 ? e.bindFramebuffer(i.FRAMEBUFFER, _.__webglFramebuffer[0]) : e.bindFramebuffer(i.FRAMEBUFFER, _.__webglFramebuffer), _.__webglDepthbuffer === void 0)
        _.__webglDepthbuffer = i.createRenderbuffer(), rt(_.__webglDepthbuffer, E, !1);
      else {
        const J = E.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, X = _.__webglDepthbuffer;
        i.bindRenderbuffer(i.RENDERBUFFER, X), i.framebufferRenderbuffer(i.FRAMEBUFFER, J, i.RENDERBUFFER, X);
      }
    }
    e.bindFramebuffer(i.FRAMEBUFFER, null);
  }
  function bt(E, _, F) {
    const Y = n.get(E);
    _ !== void 0 && pt(Y.__webglFramebuffer, E, E.texture, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, 0), F !== void 0 && Xt(E);
  }
  function ae(E) {
    const _ = E.texture, F = n.get(E), Y = n.get(_);
    E.addEventListener("dispose", R);
    const J = E.textures, X = E.isWebGLCubeRenderTarget === !0, gt = J.length > 1;
    if (gt || (Y.__webglTexture === void 0 && (Y.__webglTexture = i.createTexture()), Y.__version = _.version, a.memory.textures++), X) {
      F.__webglFramebuffer = [];
      for (let st = 0; st < 6; st++)
        if (_.mipmaps && _.mipmaps.length > 0) {
          F.__webglFramebuffer[st] = [];
          for (let Et = 0; Et < _.mipmaps.length; Et++)
            F.__webglFramebuffer[st][Et] = i.createFramebuffer();
        } else
          F.__webglFramebuffer[st] = i.createFramebuffer();
    } else {
      if (_.mipmaps && _.mipmaps.length > 0) {
        F.__webglFramebuffer = [];
        for (let st = 0; st < _.mipmaps.length; st++)
          F.__webglFramebuffer[st] = i.createFramebuffer();
      } else
        F.__webglFramebuffer = i.createFramebuffer();
      if (gt)
        for (let st = 0, Et = J.length; st < Et; st++) {
          const Tt = n.get(J[st]);
          Tt.__webglTexture === void 0 && (Tt.__webglTexture = i.createTexture(), a.memory.textures++);
        }
      if (E.samples > 0 && Bt(E) === !1) {
        F.__webglMultisampledFramebuffer = i.createFramebuffer(), F.__webglColorRenderbuffer = [], e.bindFramebuffer(i.FRAMEBUFFER, F.__webglMultisampledFramebuffer);
        for (let st = 0; st < J.length; st++) {
          const Et = J[st];
          F.__webglColorRenderbuffer[st] = i.createRenderbuffer(), i.bindRenderbuffer(i.RENDERBUFFER, F.__webglColorRenderbuffer[st]);
          const Tt = s.convert(Et.format, Et.colorSpace), K = s.convert(Et.type), ut = T(Et.internalFormat, Tt, K, Et.colorSpace, E.isXRRenderTarget === !0), At = Ht(E);
          i.renderbufferStorageMultisample(i.RENDERBUFFER, At, ut, E.width, E.height), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + st, i.RENDERBUFFER, F.__webglColorRenderbuffer[st]);
        }
        i.bindRenderbuffer(i.RENDERBUFFER, null), E.depthBuffer && (F.__webglDepthRenderbuffer = i.createRenderbuffer(), rt(F.__webglDepthRenderbuffer, E, !0)), e.bindFramebuffer(i.FRAMEBUFFER, null);
      }
    }
    if (X) {
      e.bindTexture(i.TEXTURE_CUBE_MAP, Y.__webglTexture), Ut(i.TEXTURE_CUBE_MAP, _);
      for (let st = 0; st < 6; st++)
        if (_.mipmaps && _.mipmaps.length > 0)
          for (let Et = 0; Et < _.mipmaps.length; Et++)
            pt(F.__webglFramebuffer[st][Et], E, _, i.COLOR_ATTACHMENT0, i.TEXTURE_CUBE_MAP_POSITIVE_X + st, Et);
        else
          pt(F.__webglFramebuffer[st], E, _, i.COLOR_ATTACHMENT0, i.TEXTURE_CUBE_MAP_POSITIVE_X + st, 0);
      m(_) && p(i.TEXTURE_CUBE_MAP), e.unbindTexture();
    } else if (gt) {
      for (let st = 0, Et = J.length; st < Et; st++) {
        const Tt = J[st], K = n.get(Tt);
        e.bindTexture(i.TEXTURE_2D, K.__webglTexture), Ut(i.TEXTURE_2D, Tt), pt(F.__webglFramebuffer, E, Tt, i.COLOR_ATTACHMENT0 + st, i.TEXTURE_2D, 0), m(Tt) && p(i.TEXTURE_2D);
      }
      e.unbindTexture();
    } else {
      let st = i.TEXTURE_2D;
      if ((E.isWebGL3DRenderTarget || E.isWebGLArrayRenderTarget) && (st = E.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY), e.bindTexture(st, Y.__webglTexture), Ut(st, _), _.mipmaps && _.mipmaps.length > 0)
        for (let Et = 0; Et < _.mipmaps.length; Et++)
          pt(F.__webglFramebuffer[Et], E, _, i.COLOR_ATTACHMENT0, st, Et);
      else
        pt(F.__webglFramebuffer, E, _, i.COLOR_ATTACHMENT0, st, 0);
      m(_) && p(st), e.unbindTexture();
    }
    E.depthBuffer && Xt(E);
  }
  function ee(E) {
    const _ = E.textures;
    for (let F = 0, Y = _.length; F < Y; F++) {
      const J = _[F];
      if (m(J)) {
        const X = A(E), gt = n.get(J).__webglTexture;
        e.bindTexture(X, gt), p(X), e.unbindTexture();
      }
    }
  }
  const Ot = [], b = [];
  function Fe(E) {
    if (E.samples > 0) {
      if (Bt(E) === !1) {
        const _ = E.textures, F = E.width, Y = E.height;
        let J = i.COLOR_BUFFER_BIT;
        const X = E.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT, gt = n.get(E), st = _.length > 1;
        if (st)
          for (let Tt = 0; Tt < _.length; Tt++)
            e.bindFramebuffer(i.FRAMEBUFFER, gt.__webglMultisampledFramebuffer), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + Tt, i.RENDERBUFFER, null), e.bindFramebuffer(i.FRAMEBUFFER, gt.__webglFramebuffer), i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0 + Tt, i.TEXTURE_2D, null, 0);
        e.bindFramebuffer(i.READ_FRAMEBUFFER, gt.__webglMultisampledFramebuffer);
        const Et = E.texture.mipmaps;
        Et && Et.length > 0 ? e.bindFramebuffer(i.DRAW_FRAMEBUFFER, gt.__webglFramebuffer[0]) : e.bindFramebuffer(i.DRAW_FRAMEBUFFER, gt.__webglFramebuffer);
        for (let Tt = 0; Tt < _.length; Tt++) {
          if (E.resolveDepthBuffer && (E.depthBuffer && (J |= i.DEPTH_BUFFER_BIT), E.stencilBuffer && E.resolveStencilBuffer && (J |= i.STENCIL_BUFFER_BIT)), st) {
            i.framebufferRenderbuffer(i.READ_FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.RENDERBUFFER, gt.__webglColorRenderbuffer[Tt]);
            const K = n.get(_[Tt]).__webglTexture;
            i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0, i.TEXTURE_2D, K, 0);
          }
          i.blitFramebuffer(0, 0, F, Y, 0, 0, F, Y, J, i.NEAREST), l === !0 && (Ot.length = 0, b.length = 0, Ot.push(i.COLOR_ATTACHMENT0 + Tt), E.depthBuffer && E.resolveDepthBuffer === !1 && (Ot.push(X), b.push(X), i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, b)), i.invalidateFramebuffer(i.READ_FRAMEBUFFER, Ot));
        }
        if (e.bindFramebuffer(i.READ_FRAMEBUFFER, null), e.bindFramebuffer(i.DRAW_FRAMEBUFFER, null), st)
          for (let Tt = 0; Tt < _.length; Tt++) {
            e.bindFramebuffer(i.FRAMEBUFFER, gt.__webglMultisampledFramebuffer), i.framebufferRenderbuffer(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + Tt, i.RENDERBUFFER, gt.__webglColorRenderbuffer[Tt]);
            const K = n.get(_[Tt]).__webglTexture;
            e.bindFramebuffer(i.FRAMEBUFFER, gt.__webglFramebuffer), i.framebufferTexture2D(i.DRAW_FRAMEBUFFER, i.COLOR_ATTACHMENT0 + Tt, i.TEXTURE_2D, K, 0);
          }
        e.bindFramebuffer(i.DRAW_FRAMEBUFFER, gt.__webglMultisampledFramebuffer);
      } else if (E.depthBuffer && E.resolveDepthBuffer === !1 && l) {
        const _ = E.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT;
        i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, [_]);
      }
    }
  }
  function Ht(E) {
    return Math.min(r.maxSamples, E.samples);
  }
  function Bt(E) {
    const _ = n.get(E);
    return E.samples > 0 && t.has("WEBGL_multisampled_render_to_texture") === !0 && _.__useRenderToTexture !== !1;
  }
  function xt(E) {
    const _ = a.render.frame;
    h.get(E) !== _ && (h.set(E, _), E.update());
  }
  function Qt(E, _) {
    const F = E.colorSpace, Y = E.format, J = E.type;
    return E.isCompressedTexture === !0 || E.isVideoTexture === !0 || F !== Mi && F !== fn && (Gt.getTransfer(F) === Zt ? (Y !== $e || J !== nn) && console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : console.error("THREE.WebGLTextures: Unsupported texture color space:", F)), _;
  }
  function _t(E) {
    return typeof HTMLImageElement < "u" && E instanceof HTMLImageElement ? (c.width = E.naturalWidth || E.width, c.height = E.naturalHeight || E.height) : typeof VideoFrame < "u" && E instanceof VideoFrame ? (c.width = E.displayWidth, c.height = E.displayHeight) : (c.width = E.width, c.height = E.height), c;
  }
  this.allocateTextureUnit = B, this.resetTextureUnits = H, this.setTexture2D = Z, this.setTexture2DArray = W, this.setTexture3D = Q, this.setTextureCube = V, this.rebindTextures = bt, this.setupRenderTarget = ae, this.updateRenderTargetMipmap = ee, this.updateMultisampleRenderTarget = Fe, this.setupDepthRenderbuffer = Xt, this.setupFrameBufferTexture = pt, this.useMultisampledRTT = Bt;
}
function ag(i, t) {
  function e(n, r = fn) {
    let s;
    const a = Gt.getTransfer(r);
    if (n === nn) return i.UNSIGNED_BYTE;
    if (n === ya) return i.UNSIGNED_SHORT_4_4_4_4;
    if (n === Ea) return i.UNSIGNED_SHORT_5_5_5_1;
    if (n === El) return i.UNSIGNED_INT_5_9_9_9_REV;
    if (n === Sl) return i.BYTE;
    if (n === yl) return i.SHORT;
    if (n === Wi) return i.UNSIGNED_SHORT;
    if (n === Sa) return i.INT;
    if (n === qn) return i.UNSIGNED_INT;
    if (n === tn) return i.FLOAT;
    if (n === ji) return i.HALF_FLOAT;
    if (n === Tl) return i.ALPHA;
    if (n === Al) return i.RGB;
    if (n === $e) return i.RGBA;
    if (n === qi) return i.DEPTH_COMPONENT;
    if (n === Yi) return i.DEPTH_STENCIL;
    if (n === Ta) return i.RED;
    if (n === Aa) return i.RED_INTEGER;
    if (n === bl) return i.RG;
    if (n === ba) return i.RG_INTEGER;
    if (n === wa) return i.RGBA_INTEGER;
    if (n === Dr || n === Ir || n === Ur || n === Nr)
      if (a === Zt)
        if (s = t.get("WEBGL_compressed_texture_s3tc_srgb"), s !== null) {
          if (n === Dr) return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;
          if (n === Ir) return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
          if (n === Ur) return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
          if (n === Nr) return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
        } else
          return null;
      else if (s = t.get("WEBGL_compressed_texture_s3tc"), s !== null) {
        if (n === Dr) return s.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (n === Ir) return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (n === Ur) return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (n === Nr) return s.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      } else
        return null;
    if (n === Ws || n === Xs || n === qs || n === Ys)
      if (s = t.get("WEBGL_compressed_texture_pvrtc"), s !== null) {
        if (n === Ws) return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (n === Xs) return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (n === qs) return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (n === Ys) return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      } else
        return null;
    if (n === $s || n === Zs || n === Js)
      if (s = t.get("WEBGL_compressed_texture_etc"), s !== null) {
        if (n === $s || n === Zs) return a === Zt ? s.COMPRESSED_SRGB8_ETC2 : s.COMPRESSED_RGB8_ETC2;
        if (n === Js) return a === Zt ? s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : s.COMPRESSED_RGBA8_ETC2_EAC;
      } else
        return null;
    if (n === Ks || n === js || n === Qs || n === ta || n === ea || n === na || n === ia || n === ra || n === sa || n === aa || n === oa || n === la || n === ca || n === ha)
      if (s = t.get("WEBGL_compressed_texture_astc"), s !== null) {
        if (n === Ks) return a === Zt ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : s.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (n === js) return a === Zt ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : s.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (n === Qs) return a === Zt ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : s.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (n === ta) return a === Zt ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : s.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (n === ea) return a === Zt ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : s.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (n === na) return a === Zt ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : s.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (n === ia) return a === Zt ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : s.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (n === ra) return a === Zt ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : s.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (n === sa) return a === Zt ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : s.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (n === aa) return a === Zt ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : s.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (n === oa) return a === Zt ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : s.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (n === la) return a === Zt ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : s.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (n === ca) return a === Zt ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : s.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (n === ha) return a === Zt ? s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : s.COMPRESSED_RGBA_ASTC_12x12_KHR;
      } else
        return null;
    if (n === Fr || n === ua || n === da)
      if (s = t.get("EXT_texture_compression_bptc"), s !== null) {
        if (n === Fr) return a === Zt ? s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : s.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (n === ua) return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (n === da) return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      } else
        return null;
    if (n === wl || n === fa || n === pa || n === ma)
      if (s = t.get("EXT_texture_compression_rgtc"), s !== null) {
        if (n === Fr) return s.COMPRESSED_RED_RGTC1_EXT;
        if (n === fa) return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (n === pa) return s.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (n === ma) return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      } else
        return null;
    return n === Xi ? i.UNSIGNED_INT_24_8 : i[n] !== void 0 ? i[n] : null;
  }
  return { convert: e };
}
const og = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`, lg = `
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;
class cg {
  /**
   * Constructs a new depth sensing module.
   */
  constructor() {
    this.texture = null, this.mesh = null, this.depthNear = 0, this.depthFar = 0;
  }
  /**
   * Inits the depth sensing module
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {XRWebGLDepthInformation} depthData - The XR depth data.
   * @param {XRRenderState} renderState - The XR render state.
   */
  init(t, e, n) {
    if (this.texture === null) {
      const r = new ge(), s = t.properties.get(r);
      s.__webglTexture = e.texture, (e.depthNear !== n.depthNear || e.depthFar !== n.depthFar) && (this.depthNear = e.depthNear, this.depthFar = e.depthFar), this.texture = r;
    }
  }
  /**
   * Returns a plane mesh that visualizes the depth texture.
   *
   * @param {ArrayCamera} cameraXR - The XR camera.
   * @return {?Mesh} The plane mesh.
   */
  getMesh(t) {
    if (this.texture !== null && this.mesh === null) {
      const e = t.cameras[0].viewport, n = new Cn({
        vertexShader: og,
        fragmentShader: lg,
        uniforms: {
          depthColor: { value: this.texture },
          depthWidth: { value: e.z },
          depthHeight: { value: e.w }
        }
      });
      this.mesh = new Kt(new Je(20, 20), n);
    }
    return this.mesh;
  }
  /**
   * Resets the module
   */
  reset() {
    this.texture = null, this.mesh = null;
  }
  /**
   * Returns a texture representing the depth of the user's environment.
   *
   * @return {?Texture} The depth texture.
   */
  getDepthTexture() {
    return this.texture;
  }
}
class hg extends Ei {
  /**
   * Constructs a new WebGL renderer.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   * @param {WebGL2RenderingContext} gl - The rendering context.
   */
  constructor(t, e) {
    super();
    const n = this;
    let r = null, s = 1, a = null, o = "local-floor", l = 1, c = null, h = null, u = null, f = null, d = null, g = null;
    const v = new cg(), m = e.getContextAttributes();
    let p = null, A = null;
    const T = [], S = [], N = new mt();
    let w = null;
    const R = new He();
    R.viewport = new se();
    const U = new He();
    U.viewport = new se();
    const y = [R, U], M = new Pu();
    let C = null, H = null;
    this.cameraAutoUpdate = !0, this.enabled = !1, this.isPresenting = !1, this.getController = function(q) {
      let tt = T[q];
      return tt === void 0 && (tt = new _s(), T[q] = tt), tt.getTargetRaySpace();
    }, this.getControllerGrip = function(q) {
      let tt = T[q];
      return tt === void 0 && (tt = new _s(), T[q] = tt), tt.getGripSpace();
    }, this.getHand = function(q) {
      let tt = T[q];
      return tt === void 0 && (tt = new _s(), T[q] = tt), tt.getHandSpace();
    };
    function B(q) {
      const tt = S.indexOf(q.inputSource);
      if (tt === -1)
        return;
      const pt = T[tt];
      pt !== void 0 && (pt.update(q.inputSource, q.frame, c || a), pt.dispatchEvent({ type: q.type, data: q.inputSource }));
    }
    function G() {
      r.removeEventListener("select", B), r.removeEventListener("selectstart", B), r.removeEventListener("selectend", B), r.removeEventListener("squeeze", B), r.removeEventListener("squeezestart", B), r.removeEventListener("squeezeend", B), r.removeEventListener("end", G), r.removeEventListener("inputsourceschange", Z);
      for (let q = 0; q < T.length; q++) {
        const tt = S[q];
        tt !== null && (S[q] = null, T[q].disconnect(tt));
      }
      C = null, H = null, v.reset(), t.setRenderTarget(p), d = null, f = null, u = null, r = null, A = null, Jt.stop(), n.isPresenting = !1, t.setPixelRatio(w), t.setSize(N.width, N.height, !1), n.dispatchEvent({ type: "sessionend" });
    }
    this.setFramebufferScaleFactor = function(q) {
      s = q, n.isPresenting === !0 && console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.");
    }, this.setReferenceSpaceType = function(q) {
      o = q, n.isPresenting === !0 && console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.");
    }, this.getReferenceSpace = function() {
      return c || a;
    }, this.setReferenceSpace = function(q) {
      c = q;
    }, this.getBaseLayer = function() {
      return f !== null ? f : d;
    }, this.getBinding = function() {
      return u;
    }, this.getFrame = function() {
      return g;
    }, this.getSession = function() {
      return r;
    }, this.setSession = async function(q) {
      if (r = q, r !== null) {
        if (p = t.getRenderTarget(), r.addEventListener("select", B), r.addEventListener("selectstart", B), r.addEventListener("selectend", B), r.addEventListener("squeeze", B), r.addEventListener("squeezestart", B), r.addEventListener("squeezeend", B), r.addEventListener("end", G), r.addEventListener("inputsourceschange", Z), m.xrCompatible !== !0 && await e.makeXRCompatible(), w = t.getPixelRatio(), t.getSize(N), typeof XRWebGLBinding < "u" && "createProjectionLayer" in XRWebGLBinding.prototype) {
          let pt = null, rt = null, yt = null;
          m.depth && (yt = m.stencil ? e.DEPTH24_STENCIL8 : e.DEPTH_COMPONENT24, pt = m.stencil ? Yi : qi, rt = m.stencil ? Xi : qn);
          const Xt = {
            colorFormat: e.RGBA8,
            depthFormat: yt,
            scaleFactor: s
          };
          u = new XRWebGLBinding(r, e), f = u.createProjectionLayer(Xt), r.updateRenderState({ layers: [f] }), t.setPixelRatio(1), t.setSize(f.textureWidth, f.textureHeight, !1), A = new Yn(
            f.textureWidth,
            f.textureHeight,
            {
              format: $e,
              type: nn,
              depthTexture: new Hl(f.textureWidth, f.textureHeight, rt, void 0, void 0, void 0, void 0, void 0, void 0, pt),
              stencilBuffer: m.stencil,
              colorSpace: t.outputColorSpace,
              samples: m.antialias ? 4 : 0,
              resolveDepthBuffer: f.ignoreDepthValues === !1,
              resolveStencilBuffer: f.ignoreDepthValues === !1
            }
          );
        } else {
          const pt = {
            antialias: m.antialias,
            alpha: !0,
            depth: m.depth,
            stencil: m.stencil,
            framebufferScaleFactor: s
          };
          d = new XRWebGLLayer(r, e, pt), r.updateRenderState({ baseLayer: d }), t.setPixelRatio(1), t.setSize(d.framebufferWidth, d.framebufferHeight, !1), A = new Yn(
            d.framebufferWidth,
            d.framebufferHeight,
            {
              format: $e,
              type: nn,
              colorSpace: t.outputColorSpace,
              stencilBuffer: m.stencil,
              resolveDepthBuffer: d.ignoreDepthValues === !1,
              resolveStencilBuffer: d.ignoreDepthValues === !1
            }
          );
        }
        A.isXRRenderTarget = !0, this.setFoveation(l), c = null, a = await r.requestReferenceSpace(o), Jt.setContext(r), Jt.start(), n.isPresenting = !0, n.dispatchEvent({ type: "sessionstart" });
      }
    }, this.getEnvironmentBlendMode = function() {
      if (r !== null)
        return r.environmentBlendMode;
    }, this.getDepthTexture = function() {
      return v.getDepthTexture();
    };
    function Z(q) {
      for (let tt = 0; tt < q.removed.length; tt++) {
        const pt = q.removed[tt], rt = S.indexOf(pt);
        rt >= 0 && (S[rt] = null, T[rt].disconnect(pt));
      }
      for (let tt = 0; tt < q.added.length; tt++) {
        const pt = q.added[tt];
        let rt = S.indexOf(pt);
        if (rt === -1) {
          for (let Xt = 0; Xt < T.length; Xt++)
            if (Xt >= S.length) {
              S.push(pt), rt = Xt;
              break;
            } else if (S[Xt] === null) {
              S[Xt] = pt, rt = Xt;
              break;
            }
          if (rt === -1) break;
        }
        const yt = T[rt];
        yt && yt.connect(pt);
      }
    }
    const W = new I(), Q = new I();
    function V(q, tt, pt) {
      W.setFromMatrixPosition(tt.matrixWorld), Q.setFromMatrixPosition(pt.matrixWorld);
      const rt = W.distanceTo(Q), yt = tt.projectionMatrix.elements, Xt = pt.projectionMatrix.elements, bt = yt[14] / (yt[10] - 1), ae = yt[14] / (yt[10] + 1), ee = (yt[9] + 1) / yt[5], Ot = (yt[9] - 1) / yt[5], b = (yt[8] - 1) / yt[0], Fe = (Xt[8] + 1) / Xt[0], Ht = bt * b, Bt = bt * Fe, xt = rt / (-b + Fe), Qt = xt * -b;
      if (tt.matrixWorld.decompose(q.position, q.quaternion, q.scale), q.translateX(Qt), q.translateZ(xt), q.matrixWorld.compose(q.position, q.quaternion, q.scale), q.matrixWorldInverse.copy(q.matrixWorld).invert(), yt[10] === -1)
        q.projectionMatrix.copy(tt.projectionMatrix), q.projectionMatrixInverse.copy(tt.projectionMatrixInverse);
      else {
        const _t = bt + xt, E = ae + xt, _ = Ht - Qt, F = Bt + (rt - Qt), Y = ee * ae / E * _t, J = Ot * ae / E * _t;
        q.projectionMatrix.makePerspective(_, F, Y, J, _t, E), q.projectionMatrixInverse.copy(q.projectionMatrix).invert();
      }
    }
    function it(q, tt) {
      tt === null ? q.matrixWorld.copy(q.matrix) : q.matrixWorld.multiplyMatrices(tt.matrixWorld, q.matrix), q.matrixWorldInverse.copy(q.matrixWorld).invert();
    }
    this.updateCamera = function(q) {
      if (r === null) return;
      let tt = q.near, pt = q.far;
      v.texture !== null && (v.depthNear > 0 && (tt = v.depthNear), v.depthFar > 0 && (pt = v.depthFar)), M.near = U.near = R.near = tt, M.far = U.far = R.far = pt, (C !== M.near || H !== M.far) && (r.updateRenderState({
        depthNear: M.near,
        depthFar: M.far
      }), C = M.near, H = M.far), R.layers.mask = q.layers.mask | 2, U.layers.mask = q.layers.mask | 4, M.layers.mask = R.layers.mask | U.layers.mask;
      const rt = q.parent, yt = M.cameras;
      it(M, rt);
      for (let Xt = 0; Xt < yt.length; Xt++)
        it(yt[Xt], rt);
      yt.length === 2 ? V(M, R, U) : M.projectionMatrix.copy(R.projectionMatrix), ht(q, M, rt);
    };
    function ht(q, tt, pt) {
      pt === null ? q.matrix.copy(tt.matrixWorld) : (q.matrix.copy(pt.matrixWorld), q.matrix.invert(), q.matrix.multiply(tt.matrixWorld)), q.matrix.decompose(q.position, q.quaternion, q.scale), q.updateMatrixWorld(!0), q.projectionMatrix.copy(tt.projectionMatrix), q.projectionMatrixInverse.copy(tt.projectionMatrixInverse), q.isPerspectiveCamera && (q.fov = ga * 2 * Math.atan(1 / q.projectionMatrix.elements[5]), q.zoom = 1);
    }
    this.getCamera = function() {
      return M;
    }, this.getFoveation = function() {
      if (!(f === null && d === null))
        return l;
    }, this.setFoveation = function(q) {
      l = q, f !== null && (f.fixedFoveation = q), d !== null && d.fixedFoveation !== void 0 && (d.fixedFoveation = q);
    }, this.hasDepthSensing = function() {
      return v.texture !== null;
    }, this.getDepthSensingMesh = function() {
      return v.getMesh(M);
    };
    let vt = null;
    function Ut(q, tt) {
      if (h = tt.getViewerPose(c || a), g = tt, h !== null) {
        const pt = h.views;
        d !== null && (t.setRenderTargetFramebuffer(A, d.framebuffer), t.setRenderTarget(A));
        let rt = !1;
        pt.length !== M.cameras.length && (M.cameras.length = 0, rt = !0);
        for (let bt = 0; bt < pt.length; bt++) {
          const ae = pt[bt];
          let ee = null;
          if (d !== null)
            ee = d.getViewport(ae);
          else {
            const b = u.getViewSubImage(f, ae);
            ee = b.viewport, bt === 0 && (t.setRenderTargetTextures(
              A,
              b.colorTexture,
              b.depthStencilTexture
            ), t.setRenderTarget(A));
          }
          let Ot = y[bt];
          Ot === void 0 && (Ot = new He(), Ot.layers.enable(bt), Ot.viewport = new se(), y[bt] = Ot), Ot.matrix.fromArray(ae.transform.matrix), Ot.matrix.decompose(Ot.position, Ot.quaternion, Ot.scale), Ot.projectionMatrix.fromArray(ae.projectionMatrix), Ot.projectionMatrixInverse.copy(Ot.projectionMatrix).invert(), Ot.viewport.set(ee.x, ee.y, ee.width, ee.height), bt === 0 && (M.matrix.copy(Ot.matrix), M.matrix.decompose(M.position, M.quaternion, M.scale)), rt === !0 && M.cameras.push(Ot);
        }
        const yt = r.enabledFeatures;
        if (yt && yt.includes("depth-sensing") && r.depthUsage == "gpu-optimized" && u) {
          const bt = u.getDepthInformation(pt[0]);
          bt && bt.isValid && bt.texture && v.init(t, bt, r.renderState);
        }
      }
      for (let pt = 0; pt < T.length; pt++) {
        const rt = S[pt], yt = T[pt];
        rt !== null && yt !== void 0 && yt.update(rt, tt, c || a);
      }
      vt && vt(q, tt), tt.detectedPlanes && n.dispatchEvent({ type: "planesdetected", data: tt }), g = null;
    }
    const Jt = new jl();
    Jt.setAnimationLoop(Ut), this.setAnimationLoop = function(q) {
      vt = q;
    }, this.dispose = function() {
    };
  }
}
const On = /* @__PURE__ */ new rn(), ug = /* @__PURE__ */ new Wt();
function dg(i, t) {
  function e(m, p) {
    m.matrixAutoUpdate === !0 && m.updateMatrix(), p.value.copy(m.matrix);
  }
  function n(m, p) {
    p.color.getRGB(m.fogColor.value, Fl(i)), p.isFog ? (m.fogNear.value = p.near, m.fogFar.value = p.far) : p.isFogExp2 && (m.fogDensity.value = p.density);
  }
  function r(m, p, A, T, S) {
    p.isMeshBasicMaterial || p.isMeshLambertMaterial ? s(m, p) : p.isMeshToonMaterial ? (s(m, p), u(m, p)) : p.isMeshPhongMaterial ? (s(m, p), h(m, p)) : p.isMeshStandardMaterial ? (s(m, p), f(m, p), p.isMeshPhysicalMaterial && d(m, p, S)) : p.isMeshMatcapMaterial ? (s(m, p), g(m, p)) : p.isMeshDepthMaterial ? s(m, p) : p.isMeshDistanceMaterial ? (s(m, p), v(m, p)) : p.isMeshNormalMaterial ? s(m, p) : p.isLineBasicMaterial ? (a(m, p), p.isLineDashedMaterial && o(m, p)) : p.isPointsMaterial ? l(m, p, A, T) : p.isSpriteMaterial ? c(m, p) : p.isShadowMaterial ? (m.color.value.copy(p.color), m.opacity.value = p.opacity) : p.isShaderMaterial && (p.uniformsNeedUpdate = !1);
  }
  function s(m, p) {
    m.opacity.value = p.opacity, p.color && m.diffuse.value.copy(p.color), p.emissive && m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity), p.map && (m.map.value = p.map, e(p.map, m.mapTransform)), p.alphaMap && (m.alphaMap.value = p.alphaMap, e(p.alphaMap, m.alphaMapTransform)), p.bumpMap && (m.bumpMap.value = p.bumpMap, e(p.bumpMap, m.bumpMapTransform), m.bumpScale.value = p.bumpScale, p.side === Ce && (m.bumpScale.value *= -1)), p.normalMap && (m.normalMap.value = p.normalMap, e(p.normalMap, m.normalMapTransform), m.normalScale.value.copy(p.normalScale), p.side === Ce && m.normalScale.value.negate()), p.displacementMap && (m.displacementMap.value = p.displacementMap, e(p.displacementMap, m.displacementMapTransform), m.displacementScale.value = p.displacementScale, m.displacementBias.value = p.displacementBias), p.emissiveMap && (m.emissiveMap.value = p.emissiveMap, e(p.emissiveMap, m.emissiveMapTransform)), p.specularMap && (m.specularMap.value = p.specularMap, e(p.specularMap, m.specularMapTransform)), p.alphaTest > 0 && (m.alphaTest.value = p.alphaTest);
    const A = t.get(p), T = A.envMap, S = A.envMapRotation;
    T && (m.envMap.value = T, On.copy(S), On.x *= -1, On.y *= -1, On.z *= -1, T.isCubeTexture && T.isRenderTargetTexture === !1 && (On.y *= -1, On.z *= -1), m.envMapRotation.value.setFromMatrix4(ug.makeRotationFromEuler(On)), m.flipEnvMap.value = T.isCubeTexture && T.isRenderTargetTexture === !1 ? -1 : 1, m.reflectivity.value = p.reflectivity, m.ior.value = p.ior, m.refractionRatio.value = p.refractionRatio), p.lightMap && (m.lightMap.value = p.lightMap, m.lightMapIntensity.value = p.lightMapIntensity, e(p.lightMap, m.lightMapTransform)), p.aoMap && (m.aoMap.value = p.aoMap, m.aoMapIntensity.value = p.aoMapIntensity, e(p.aoMap, m.aoMapTransform));
  }
  function a(m, p) {
    m.diffuse.value.copy(p.color), m.opacity.value = p.opacity, p.map && (m.map.value = p.map, e(p.map, m.mapTransform));
  }
  function o(m, p) {
    m.dashSize.value = p.dashSize, m.totalSize.value = p.dashSize + p.gapSize, m.scale.value = p.scale;
  }
  function l(m, p, A, T) {
    m.diffuse.value.copy(p.color), m.opacity.value = p.opacity, m.size.value = p.size * A, m.scale.value = T * 0.5, p.map && (m.map.value = p.map, e(p.map, m.uvTransform)), p.alphaMap && (m.alphaMap.value = p.alphaMap, e(p.alphaMap, m.alphaMapTransform)), p.alphaTest > 0 && (m.alphaTest.value = p.alphaTest);
  }
  function c(m, p) {
    m.diffuse.value.copy(p.color), m.opacity.value = p.opacity, m.rotation.value = p.rotation, p.map && (m.map.value = p.map, e(p.map, m.mapTransform)), p.alphaMap && (m.alphaMap.value = p.alphaMap, e(p.alphaMap, m.alphaMapTransform)), p.alphaTest > 0 && (m.alphaTest.value = p.alphaTest);
  }
  function h(m, p) {
    m.specular.value.copy(p.specular), m.shininess.value = Math.max(p.shininess, 1e-4);
  }
  function u(m, p) {
    p.gradientMap && (m.gradientMap.value = p.gradientMap);
  }
  function f(m, p) {
    m.metalness.value = p.metalness, p.metalnessMap && (m.metalnessMap.value = p.metalnessMap, e(p.metalnessMap, m.metalnessMapTransform)), m.roughness.value = p.roughness, p.roughnessMap && (m.roughnessMap.value = p.roughnessMap, e(p.roughnessMap, m.roughnessMapTransform)), p.envMap && (m.envMapIntensity.value = p.envMapIntensity);
  }
  function d(m, p, A) {
    m.ior.value = p.ior, p.sheen > 0 && (m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen), m.sheenRoughness.value = p.sheenRoughness, p.sheenColorMap && (m.sheenColorMap.value = p.sheenColorMap, e(p.sheenColorMap, m.sheenColorMapTransform)), p.sheenRoughnessMap && (m.sheenRoughnessMap.value = p.sheenRoughnessMap, e(p.sheenRoughnessMap, m.sheenRoughnessMapTransform))), p.clearcoat > 0 && (m.clearcoat.value = p.clearcoat, m.clearcoatRoughness.value = p.clearcoatRoughness, p.clearcoatMap && (m.clearcoatMap.value = p.clearcoatMap, e(p.clearcoatMap, m.clearcoatMapTransform)), p.clearcoatRoughnessMap && (m.clearcoatRoughnessMap.value = p.clearcoatRoughnessMap, e(p.clearcoatRoughnessMap, m.clearcoatRoughnessMapTransform)), p.clearcoatNormalMap && (m.clearcoatNormalMap.value = p.clearcoatNormalMap, e(p.clearcoatNormalMap, m.clearcoatNormalMapTransform), m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale), p.side === Ce && m.clearcoatNormalScale.value.negate())), p.dispersion > 0 && (m.dispersion.value = p.dispersion), p.iridescence > 0 && (m.iridescence.value = p.iridescence, m.iridescenceIOR.value = p.iridescenceIOR, m.iridescenceThicknessMinimum.value = p.iridescenceThicknessRange[0], m.iridescenceThicknessMaximum.value = p.iridescenceThicknessRange[1], p.iridescenceMap && (m.iridescenceMap.value = p.iridescenceMap, e(p.iridescenceMap, m.iridescenceMapTransform)), p.iridescenceThicknessMap && (m.iridescenceThicknessMap.value = p.iridescenceThicknessMap, e(p.iridescenceThicknessMap, m.iridescenceThicknessMapTransform))), p.transmission > 0 && (m.transmission.value = p.transmission, m.transmissionSamplerMap.value = A.texture, m.transmissionSamplerSize.value.set(A.width, A.height), p.transmissionMap && (m.transmissionMap.value = p.transmissionMap, e(p.transmissionMap, m.transmissionMapTransform)), m.thickness.value = p.thickness, p.thicknessMap && (m.thicknessMap.value = p.thicknessMap, e(p.thicknessMap, m.thicknessMapTransform)), m.attenuationDistance.value = p.attenuationDistance, m.attenuationColor.value.copy(p.attenuationColor)), p.anisotropy > 0 && (m.anisotropyVector.value.set(p.anisotropy * Math.cos(p.anisotropyRotation), p.anisotropy * Math.sin(p.anisotropyRotation)), p.anisotropyMap && (m.anisotropyMap.value = p.anisotropyMap, e(p.anisotropyMap, m.anisotropyMapTransform))), m.specularIntensity.value = p.specularIntensity, m.specularColor.value.copy(p.specularColor), p.specularColorMap && (m.specularColorMap.value = p.specularColorMap, e(p.specularColorMap, m.specularColorMapTransform)), p.specularIntensityMap && (m.specularIntensityMap.value = p.specularIntensityMap, e(p.specularIntensityMap, m.specularIntensityMapTransform));
  }
  function g(m, p) {
    p.matcap && (m.matcap.value = p.matcap);
  }
  function v(m, p) {
    const A = t.get(p).light;
    m.referencePosition.value.setFromMatrixPosition(A.matrixWorld), m.nearDistance.value = A.shadow.camera.near, m.farDistance.value = A.shadow.camera.far;
  }
  return {
    refreshFogUniforms: n,
    refreshMaterialUniforms: r
  };
}
function fg(i, t, e, n) {
  let r = {}, s = {}, a = [];
  const o = i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);
  function l(A, T) {
    const S = T.program;
    n.uniformBlockBinding(A, S);
  }
  function c(A, T) {
    let S = r[A.id];
    S === void 0 && (g(A), S = h(A), r[A.id] = S, A.addEventListener("dispose", m));
    const N = T.program;
    n.updateUBOMapping(A, N);
    const w = t.render.frame;
    s[A.id] !== w && (f(A), s[A.id] = w);
  }
  function h(A) {
    const T = u();
    A.__bindingPointIndex = T;
    const S = i.createBuffer(), N = A.__size, w = A.usage;
    return i.bindBuffer(i.UNIFORM_BUFFER, S), i.bufferData(i.UNIFORM_BUFFER, N, w), i.bindBuffer(i.UNIFORM_BUFFER, null), i.bindBufferBase(i.UNIFORM_BUFFER, T, S), S;
  }
  function u() {
    for (let A = 0; A < o; A++)
      if (a.indexOf(A) === -1)
        return a.push(A), A;
    return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0;
  }
  function f(A) {
    const T = r[A.id], S = A.uniforms, N = A.__cache;
    i.bindBuffer(i.UNIFORM_BUFFER, T);
    for (let w = 0, R = S.length; w < R; w++) {
      const U = Array.isArray(S[w]) ? S[w] : [S[w]];
      for (let y = 0, M = U.length; y < M; y++) {
        const C = U[y];
        if (d(C, w, y, N) === !0) {
          const H = C.__offset, B = Array.isArray(C.value) ? C.value : [C.value];
          let G = 0;
          for (let Z = 0; Z < B.length; Z++) {
            const W = B[Z], Q = v(W);
            typeof W == "number" || typeof W == "boolean" ? (C.__data[0] = W, i.bufferSubData(i.UNIFORM_BUFFER, H + G, C.__data)) : W.isMatrix3 ? (C.__data[0] = W.elements[0], C.__data[1] = W.elements[1], C.__data[2] = W.elements[2], C.__data[3] = 0, C.__data[4] = W.elements[3], C.__data[5] = W.elements[4], C.__data[6] = W.elements[5], C.__data[7] = 0, C.__data[8] = W.elements[6], C.__data[9] = W.elements[7], C.__data[10] = W.elements[8], C.__data[11] = 0) : (W.toArray(C.__data, G), G += Q.storage / Float32Array.BYTES_PER_ELEMENT);
          }
          i.bufferSubData(i.UNIFORM_BUFFER, H, C.__data);
        }
      }
    }
    i.bindBuffer(i.UNIFORM_BUFFER, null);
  }
  function d(A, T, S, N) {
    const w = A.value, R = T + "_" + S;
    if (N[R] === void 0)
      return typeof w == "number" || typeof w == "boolean" ? N[R] = w : N[R] = w.clone(), !0;
    {
      const U = N[R];
      if (typeof w == "number" || typeof w == "boolean") {
        if (U !== w)
          return N[R] = w, !0;
      } else if (U.equals(w) === !1)
        return U.copy(w), !0;
    }
    return !1;
  }
  function g(A) {
    const T = A.uniforms;
    let S = 0;
    const N = 16;
    for (let R = 0, U = T.length; R < U; R++) {
      const y = Array.isArray(T[R]) ? T[R] : [T[R]];
      for (let M = 0, C = y.length; M < C; M++) {
        const H = y[M], B = Array.isArray(H.value) ? H.value : [H.value];
        for (let G = 0, Z = B.length; G < Z; G++) {
          const W = B[G], Q = v(W), V = S % N, it = V % Q.boundary, ht = V + it;
          S += it, ht !== 0 && N - ht < Q.storage && (S += N - ht), H.__data = new Float32Array(Q.storage / Float32Array.BYTES_PER_ELEMENT), H.__offset = S, S += Q.storage;
        }
      }
    }
    const w = S % N;
    return w > 0 && (S += N - w), A.__size = S, A.__cache = {}, this;
  }
  function v(A) {
    const T = {
      boundary: 0,
      // bytes
      storage: 0
      // bytes
    };
    return typeof A == "number" || typeof A == "boolean" ? (T.boundary = 4, T.storage = 4) : A.isVector2 ? (T.boundary = 8, T.storage = 8) : A.isVector3 || A.isColor ? (T.boundary = 16, T.storage = 12) : A.isVector4 ? (T.boundary = 16, T.storage = 16) : A.isMatrix3 ? (T.boundary = 48, T.storage = 48) : A.isMatrix4 ? (T.boundary = 64, T.storage = 64) : A.isTexture ? console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.") : console.warn("THREE.WebGLRenderer: Unsupported uniform value type.", A), T;
  }
  function m(A) {
    const T = A.target;
    T.removeEventListener("dispose", m);
    const S = a.indexOf(T.__bindingPointIndex);
    a.splice(S, 1), i.deleteBuffer(r[T.id]), delete r[T.id], delete s[T.id];
  }
  function p() {
    for (const A in r)
      i.deleteBuffer(r[A]);
    a = [], r = {}, s = {};
  }
  return {
    bind: l,
    update: c,
    dispose: p
  };
}
class pg {
  /**
   * Constructs a new WebGL renderer.
   *
   * @param {WebGLRenderer~Options} [parameters] - The configuration parameter.
   */
  constructor(t = {}) {
    const {
      canvas: e = lh(),
      context: n = null,
      depth: r = !0,
      stencil: s = !1,
      alpha: a = !1,
      antialias: o = !1,
      premultipliedAlpha: l = !0,
      preserveDrawingBuffer: c = !1,
      powerPreference: h = "default",
      failIfMajorPerformanceCaveat: u = !1,
      reverseDepthBuffer: f = !1
    } = t;
    this.isWebGLRenderer = !0;
    let d;
    if (n !== null) {
      if (typeof WebGLRenderingContext < "u" && n instanceof WebGLRenderingContext)
        throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");
      d = n.getContextAttributes().alpha;
    } else
      d = a;
    const g = new Uint32Array(4), v = new Int32Array(4);
    let m = null, p = null;
    const A = [], T = [];
    this.domElement = e, this.debug = {
      /**
       * Enables error checking and reporting when shader programs are being compiled.
       * @type {boolean}
       */
      checkShaderErrors: !0,
      /**
       * Callback for custom error reporting.
       * @type {?Function}
       */
      onShaderError: null
    }, this.autoClear = !0, this.autoClearColor = !0, this.autoClearDepth = !0, this.autoClearStencil = !0, this.sortObjects = !0, this.clippingPlanes = [], this.localClippingEnabled = !1, this.toneMapping = wn, this.toneMappingExposure = 1, this.transmissionResolutionScale = 1;
    const S = this;
    let N = !1;
    this._outputColorSpace = Se;
    let w = 0, R = 0, U = null, y = -1, M = null;
    const C = new se(), H = new se();
    let B = null;
    const G = new Ft(0);
    let Z = 0, W = e.width, Q = e.height, V = 1, it = null, ht = null;
    const vt = new se(0, 0, W, Q), Ut = new se(0, 0, W, Q);
    let Jt = !1;
    const q = new Pa();
    let tt = !1, pt = !1;
    const rt = new Wt(), yt = new Wt(), Xt = new I(), bt = new se(), ae = { background: null, fog: null, environment: null, overrideMaterial: null, isScene: !0 };
    let ee = !1;
    function Ot() {
      return U === null ? V : 1;
    }
    let b = n;
    function Fe(x, L) {
      return e.getContext(x, L);
    }
    try {
      const x = {
        alpha: !0,
        depth: r,
        stencil: s,
        antialias: o,
        premultipliedAlpha: l,
        preserveDrawingBuffer: c,
        powerPreference: h,
        failIfMajorPerformanceCaveat: u
      };
      if ("setAttribute" in e && e.setAttribute("data-engine", `three.js r${Ma}`), e.addEventListener("webglcontextlost", $, !1), e.addEventListener("webglcontextrestored", lt, !1), e.addEventListener("webglcontextcreationerror", ot, !1), b === null) {
        const L = "webgl2";
        if (b = Fe(L, x), b === null)
          throw Fe(L) ? new Error("Error creating WebGL context with your selected attributes.") : new Error("Error creating WebGL context.");
      }
    } catch (x) {
      throw console.error("THREE.WebGLRenderer: " + x.message), x;
    }
    let Ht, Bt, xt, Qt, _t, E, _, F, Y, J, X, gt, st, Et, Tt, K, ut, At, Rt, dt, zt, Dt, jt, P;
    function at() {
      Ht = new Tp(b), Ht.init(), Dt = new ag(b, Ht), Bt = new _p(b, Ht, t, Dt), xt = new rg(b, Ht), Bt.reverseDepthBuffer && f && xt.buffers.depth.setReversed(!0), Qt = new wp(b), _t = new Xm(), E = new sg(b, Ht, xt, _t, Bt, Dt, Qt), _ = new xp(S), F = new Ep(S), Y = new Du(b), jt = new mp(b, Y), J = new Ap(b, Y, Qt, jt), X = new Cp(b, J, Y, Qt), Rt = new Rp(b, Bt, E), K = new vp(_t), gt = new Wm(S, _, F, Ht, Bt, jt, K), st = new dg(S, _t), Et = new Ym(), Tt = new Qm(Ht), At = new pp(S, _, F, xt, X, d, l), ut = new ng(S, X, Bt), P = new fg(b, Qt, Bt, xt), dt = new gp(b, Ht, Qt), zt = new bp(b, Ht, Qt), Qt.programs = gt.programs, S.capabilities = Bt, S.extensions = Ht, S.properties = _t, S.renderLists = Et, S.shadowMap = ut, S.state = xt, S.info = Qt;
    }
    at();
    const k = new hg(S, b);
    this.xr = k, this.getContext = function() {
      return b;
    }, this.getContextAttributes = function() {
      return b.getContextAttributes();
    }, this.forceContextLoss = function() {
      const x = Ht.get("WEBGL_lose_context");
      x && x.loseContext();
    }, this.forceContextRestore = function() {
      const x = Ht.get("WEBGL_lose_context");
      x && x.restoreContext();
    }, this.getPixelRatio = function() {
      return V;
    }, this.setPixelRatio = function(x) {
      x !== void 0 && (V = x, this.setSize(W, Q, !1));
    }, this.getSize = function(x) {
      return x.set(W, Q);
    }, this.setSize = function(x, L, O = !0) {
      if (k.isPresenting) {
        console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");
        return;
      }
      W = x, Q = L, e.width = Math.floor(x * V), e.height = Math.floor(L * V), O === !0 && (e.style.width = x + "px", e.style.height = L + "px"), this.setViewport(0, 0, x, L);
    }, this.getDrawingBufferSize = function(x) {
      return x.set(W * V, Q * V).floor();
    }, this.setDrawingBufferSize = function(x, L, O) {
      W = x, Q = L, V = O, e.width = Math.floor(x * O), e.height = Math.floor(L * O), this.setViewport(0, 0, x, L);
    }, this.getCurrentViewport = function(x) {
      return x.copy(C);
    }, this.getViewport = function(x) {
      return x.copy(vt);
    }, this.setViewport = function(x, L, O, z) {
      x.isVector4 ? vt.set(x.x, x.y, x.z, x.w) : vt.set(x, L, O, z), xt.viewport(C.copy(vt).multiplyScalar(V).round());
    }, this.getScissor = function(x) {
      return x.copy(Ut);
    }, this.setScissor = function(x, L, O, z) {
      x.isVector4 ? Ut.set(x.x, x.y, x.z, x.w) : Ut.set(x, L, O, z), xt.scissor(H.copy(Ut).multiplyScalar(V).round());
    }, this.getScissorTest = function() {
      return Jt;
    }, this.setScissorTest = function(x) {
      xt.setScissorTest(Jt = x);
    }, this.setOpaqueSort = function(x) {
      it = x;
    }, this.setTransparentSort = function(x) {
      ht = x;
    }, this.getClearColor = function(x) {
      return x.copy(At.getClearColor());
    }, this.setClearColor = function() {
      At.setClearColor(...arguments);
    }, this.getClearAlpha = function() {
      return At.getClearAlpha();
    }, this.setClearAlpha = function() {
      At.setClearAlpha(...arguments);
    }, this.clear = function(x = !0, L = !0, O = !0) {
      let z = 0;
      if (x) {
        let D = !1;
        if (U !== null) {
          const j = U.texture.format;
          D = j === wa || j === ba || j === Aa;
        }
        if (D) {
          const j = U.texture.type, nt = j === nn || j === qn || j === Wi || j === Xi || j === ya || j === Ea, ct = At.getClearColor(), ft = At.getClearAlpha(), Ct = ct.r, wt = ct.g, Mt = ct.b;
          nt ? (g[0] = Ct, g[1] = wt, g[2] = Mt, g[3] = ft, b.clearBufferuiv(b.COLOR, 0, g)) : (v[0] = Ct, v[1] = wt, v[2] = Mt, v[3] = ft, b.clearBufferiv(b.COLOR, 0, v));
        } else
          z |= b.COLOR_BUFFER_BIT;
      }
      L && (z |= b.DEPTH_BUFFER_BIT), O && (z |= b.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), b.clear(z);
    }, this.clearColor = function() {
      this.clear(!0, !1, !1);
    }, this.clearDepth = function() {
      this.clear(!1, !0, !1);
    }, this.clearStencil = function() {
      this.clear(!1, !1, !0);
    }, this.dispose = function() {
      e.removeEventListener("webglcontextlost", $, !1), e.removeEventListener("webglcontextrestored", lt, !1), e.removeEventListener("webglcontextcreationerror", ot, !1), At.dispose(), Et.dispose(), Tt.dispose(), _t.dispose(), _.dispose(), F.dispose(), X.dispose(), jt.dispose(), P.dispose(), gt.dispose(), k.dispose(), k.removeEventListener("sessionstart", Ba), k.removeEventListener("sessionend", za), Pn.stop();
    };
    function $(x) {
      x.preventDefault(), console.log("THREE.WebGLRenderer: Context Lost."), N = !0;
    }
    function lt() {
      console.log("THREE.WebGLRenderer: Context Restored."), N = !1;
      const x = Qt.autoReset, L = ut.enabled, O = ut.autoUpdate, z = ut.needsUpdate, D = ut.type;
      at(), Qt.autoReset = x, ut.enabled = L, ut.autoUpdate = O, ut.needsUpdate = z, ut.type = D;
    }
    function ot(x) {
      console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ", x.statusMessage);
    }
    function Pt(x) {
      const L = x.target;
      L.removeEventListener("dispose", Pt), ie(L);
    }
    function ie(x) {
      ve(x), _t.remove(x);
    }
    function ve(x) {
      const L = _t.get(x).programs;
      L !== void 0 && (L.forEach(function(O) {
        gt.releaseProgram(O);
      }), x.isShaderMaterial && gt.releaseShaderCache(x));
    }
    this.renderBufferDirect = function(x, L, O, z, D, j) {
      L === null && (L = ae);
      const nt = D.isMesh && D.matrixWorld.determinant() < 0, ct = sc(x, L, O, z, D);
      xt.setMaterial(z, nt);
      let ft = O.index, Ct = 1;
      if (z.wireframe === !0) {
        if (ft = J.getWireframeAttribute(O), ft === void 0) return;
        Ct = 2;
      }
      const wt = O.drawRange, Mt = O.attributes.position;
      let kt = wt.start * Ct, qt = (wt.start + wt.count) * Ct;
      j !== null && (kt = Math.max(kt, j.start * Ct), qt = Math.min(qt, (j.start + j.count) * Ct)), ft !== null ? (kt = Math.max(kt, 0), qt = Math.min(qt, ft.count)) : Mt != null && (kt = Math.max(kt, 0), qt = Math.min(qt, Mt.count));
      const oe = qt - kt;
      if (oe < 0 || oe === 1 / 0) return;
      jt.setup(D, z, ct, O, ft);
      let re, Vt = dt;
      if (ft !== null && (re = Y.get(ft), Vt = zt, Vt.setIndex(re)), D.isMesh)
        z.wireframe === !0 ? (xt.setLineWidth(z.wireframeLinewidth * Ot()), Vt.setMode(b.LINES)) : Vt.setMode(b.TRIANGLES);
      else if (D.isLine) {
        let St = z.linewidth;
        St === void 0 && (St = 1), xt.setLineWidth(St * Ot()), D.isLineSegments ? Vt.setMode(b.LINES) : D.isLineLoop ? Vt.setMode(b.LINE_LOOP) : Vt.setMode(b.LINE_STRIP);
      } else D.isPoints ? Vt.setMode(b.POINTS) : D.isSprite && Vt.setMode(b.TRIANGLES);
      if (D.isBatchedMesh)
        if (D._multiDrawInstances !== null)
          Or("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."), Vt.renderMultiDrawInstances(D._multiDrawStarts, D._multiDrawCounts, D._multiDrawCount, D._multiDrawInstances);
        else if (Ht.get("WEBGL_multi_draw"))
          Vt.renderMultiDraw(D._multiDrawStarts, D._multiDrawCounts, D._multiDrawCount);
        else {
          const St = D._multiDrawStarts, me = D._multiDrawCounts, Yt = D._multiDrawCount, Ve = ft ? Y.get(ft).bytesPerElement : 1, Jn = _t.get(z).currentProgram.getUniforms();
          for (let Pe = 0; Pe < Yt; Pe++)
            Jn.setValue(b, "_gl_DrawID", Pe), Vt.render(St[Pe] / Ve, me[Pe]);
        }
      else if (D.isInstancedMesh)
        Vt.renderInstances(kt, oe, D.count);
      else if (O.isInstancedBufferGeometry) {
        const St = O._maxInstanceCount !== void 0 ? O._maxInstanceCount : 1 / 0, me = Math.min(O.instanceCount, St);
        Vt.renderInstances(kt, oe, me);
      } else
        Vt.render(kt, oe);
    };
    function $t(x, L, O) {
      x.transparent === !0 && x.side === we && x.forceSinglePass === !1 ? (x.side = Ce, x.needsUpdate = !0, rr(x, L, O), x.side = Rn, x.needsUpdate = !0, rr(x, L, O), x.side = we) : rr(x, L, O);
    }
    this.compile = function(x, L, O = null) {
      O === null && (O = x), p = Tt.get(O), p.init(L), T.push(p), O.traverseVisible(function(D) {
        D.isLight && D.layers.test(L.layers) && (p.pushLight(D), D.castShadow && p.pushShadow(D));
      }), x !== O && x.traverseVisible(function(D) {
        D.isLight && D.layers.test(L.layers) && (p.pushLight(D), D.castShadow && p.pushShadow(D));
      }), p.setupLights();
      const z = /* @__PURE__ */ new Set();
      return x.traverse(function(D) {
        if (!(D.isMesh || D.isPoints || D.isLine || D.isSprite))
          return;
        const j = D.material;
        if (j)
          if (Array.isArray(j))
            for (let nt = 0; nt < j.length; nt++) {
              const ct = j[nt];
              $t(ct, O, D), z.add(ct);
            }
          else
            $t(j, O, D), z.add(j);
      }), p = T.pop(), z;
    }, this.compileAsync = function(x, L, O = null) {
      const z = this.compile(x, L, O);
      return new Promise((D) => {
        function j() {
          if (z.forEach(function(nt) {
            _t.get(nt).currentProgram.isReady() && z.delete(nt);
          }), z.size === 0) {
            D(x);
            return;
          }
          setTimeout(j, 10);
        }
        Ht.get("KHR_parallel_shader_compile") !== null ? j() : setTimeout(j, 10);
      });
    };
    let ke = null;
    function an(x) {
      ke && ke(x);
    }
    function Ba() {
      Pn.stop();
    }
    function za() {
      Pn.start();
    }
    const Pn = new jl();
    Pn.setAnimationLoop(an), typeof self < "u" && Pn.setContext(self), this.setAnimationLoop = function(x) {
      ke = x, k.setAnimationLoop(x), x === null ? Pn.stop() : Pn.start();
    }, k.addEventListener("sessionstart", Ba), k.addEventListener("sessionend", za), this.render = function(x, L) {
      if (L !== void 0 && L.isCamera !== !0) {
        console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");
        return;
      }
      if (N === !0) return;
      if (x.matrixWorldAutoUpdate === !0 && x.updateMatrixWorld(), L.parent === null && L.matrixWorldAutoUpdate === !0 && L.updateMatrixWorld(), k.enabled === !0 && k.isPresenting === !0 && (k.cameraAutoUpdate === !0 && k.updateCamera(L), L = k.getCamera()), x.isScene === !0 && x.onBeforeRender(S, x, L, U), p = Tt.get(x, T.length), p.init(L), T.push(p), yt.multiplyMatrices(L.projectionMatrix, L.matrixWorldInverse), q.setFromProjectionMatrix(yt), pt = this.localClippingEnabled, tt = K.init(this.clippingPlanes, pt), m = Et.get(x, A.length), m.init(), A.push(m), k.enabled === !0 && k.isPresenting === !0) {
        const j = S.xr.getDepthSensingMesh();
        j !== null && Yr(j, L, -1 / 0, S.sortObjects);
      }
      Yr(x, L, 0, S.sortObjects), m.finish(), S.sortObjects === !0 && m.sort(it, ht), ee = k.enabled === !1 || k.isPresenting === !1 || k.hasDepthSensing() === !1, ee && At.addToRenderList(m, x), this.info.render.frame++, tt === !0 && K.beginShadows();
      const O = p.state.shadowsArray;
      ut.render(O, x, L), tt === !0 && K.endShadows(), this.info.autoReset === !0 && this.info.reset();
      const z = m.opaque, D = m.transmissive;
      if (p.setupLights(), L.isArrayCamera) {
        const j = L.cameras;
        if (D.length > 0)
          for (let nt = 0, ct = j.length; nt < ct; nt++) {
            const ft = j[nt];
            ka(z, D, x, ft);
          }
        ee && At.render(x);
        for (let nt = 0, ct = j.length; nt < ct; nt++) {
          const ft = j[nt];
          Ha(m, x, ft, ft.viewport);
        }
      } else
        D.length > 0 && ka(z, D, x, L), ee && At.render(x), Ha(m, x, L);
      U !== null && R === 0 && (E.updateMultisampleRenderTarget(U), E.updateRenderTargetMipmap(U)), x.isScene === !0 && x.onAfterRender(S, x, L), jt.resetDefaultState(), y = -1, M = null, T.pop(), T.length > 0 ? (p = T[T.length - 1], tt === !0 && K.setGlobalState(S.clippingPlanes, p.state.camera)) : p = null, A.pop(), A.length > 0 ? m = A[A.length - 1] : m = null;
    };
    function Yr(x, L, O, z) {
      if (x.visible === !1) return;
      if (x.layers.test(L.layers)) {
        if (x.isGroup)
          O = x.renderOrder;
        else if (x.isLOD)
          x.autoUpdate === !0 && x.update(L);
        else if (x.isLight)
          p.pushLight(x), x.castShadow && p.pushShadow(x);
        else if (x.isSprite) {
          if (!x.frustumCulled || q.intersectsSprite(x)) {
            z && bt.setFromMatrixPosition(x.matrixWorld).applyMatrix4(yt);
            const nt = X.update(x), ct = x.material;
            ct.visible && m.push(x, nt, ct, O, bt.z, null);
          }
        } else if ((x.isMesh || x.isLine || x.isPoints) && (!x.frustumCulled || q.intersectsObject(x))) {
          const nt = X.update(x), ct = x.material;
          if (z && (x.boundingSphere !== void 0 ? (x.boundingSphere === null && x.computeBoundingSphere(), bt.copy(x.boundingSphere.center)) : (nt.boundingSphere === null && nt.computeBoundingSphere(), bt.copy(nt.boundingSphere.center)), bt.applyMatrix4(x.matrixWorld).applyMatrix4(yt)), Array.isArray(ct)) {
            const ft = nt.groups;
            for (let Ct = 0, wt = ft.length; Ct < wt; Ct++) {
              const Mt = ft[Ct], kt = ct[Mt.materialIndex];
              kt && kt.visible && m.push(x, nt, kt, O, bt.z, Mt);
            }
          } else ct.visible && m.push(x, nt, ct, O, bt.z, null);
        }
      }
      const j = x.children;
      for (let nt = 0, ct = j.length; nt < ct; nt++)
        Yr(j[nt], L, O, z);
    }
    function Ha(x, L, O, z) {
      const D = x.opaque, j = x.transmissive, nt = x.transparent;
      p.setupLightsView(O), tt === !0 && K.setGlobalState(S.clippingPlanes, O), z && xt.viewport(C.copy(z)), D.length > 0 && ir(D, L, O), j.length > 0 && ir(j, L, O), nt.length > 0 && ir(nt, L, O), xt.buffers.depth.setTest(!0), xt.buffers.depth.setMask(!0), xt.buffers.color.setMask(!0), xt.setPolygonOffset(!1);
    }
    function ka(x, L, O, z) {
      if ((O.isScene === !0 ? O.overrideMaterial : null) !== null)
        return;
      p.state.transmissionRenderTarget[z.id] === void 0 && (p.state.transmissionRenderTarget[z.id] = new Yn(1, 1, {
        generateMipmaps: !0,
        type: Ht.has("EXT_color_buffer_half_float") || Ht.has("EXT_color_buffer_float") ? ji : nn,
        minFilter: Gn,
        samples: 4,
        stencilBuffer: s,
        resolveDepthBuffer: !1,
        resolveStencilBuffer: !1,
        colorSpace: Gt.workingColorSpace
      }));
      const j = p.state.transmissionRenderTarget[z.id], nt = z.viewport || C;
      j.setSize(nt.z * S.transmissionResolutionScale, nt.w * S.transmissionResolutionScale);
      const ct = S.getRenderTarget();
      S.setRenderTarget(j), S.getClearColor(G), Z = S.getClearAlpha(), Z < 1 && S.setClearColor(16777215, 0.5), S.clear(), ee && At.render(O);
      const ft = S.toneMapping;
      S.toneMapping = wn;
      const Ct = z.viewport;
      if (z.viewport !== void 0 && (z.viewport = void 0), p.setupLightsView(z), tt === !0 && K.setGlobalState(S.clippingPlanes, z), ir(x, O, z), E.updateMultisampleRenderTarget(j), E.updateRenderTargetMipmap(j), Ht.has("WEBGL_multisampled_render_to_texture") === !1) {
        let wt = !1;
        for (let Mt = 0, kt = L.length; Mt < kt; Mt++) {
          const qt = L[Mt], oe = qt.object, re = qt.geometry, Vt = qt.material, St = qt.group;
          if (Vt.side === we && oe.layers.test(z.layers)) {
            const me = Vt.side;
            Vt.side = Ce, Vt.needsUpdate = !0, Va(oe, O, z, re, Vt, St), Vt.side = me, Vt.needsUpdate = !0, wt = !0;
          }
        }
        wt === !0 && (E.updateMultisampleRenderTarget(j), E.updateRenderTargetMipmap(j));
      }
      S.setRenderTarget(ct), S.setClearColor(G, Z), Ct !== void 0 && (z.viewport = Ct), S.toneMapping = ft;
    }
    function ir(x, L, O) {
      const z = L.isScene === !0 ? L.overrideMaterial : null;
      for (let D = 0, j = x.length; D < j; D++) {
        const nt = x[D], ct = nt.object, ft = nt.geometry, Ct = nt.group;
        let wt = nt.material;
        wt.allowOverride === !0 && z !== null && (wt = z), ct.layers.test(O.layers) && Va(ct, L, O, ft, wt, Ct);
      }
    }
    function Va(x, L, O, z, D, j) {
      x.onBeforeRender(S, L, O, z, D, j), x.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse, x.matrixWorld), x.normalMatrix.getNormalMatrix(x.modelViewMatrix), D.onBeforeRender(S, L, O, z, x, j), D.transparent === !0 && D.side === we && D.forceSinglePass === !1 ? (D.side = Ce, D.needsUpdate = !0, S.renderBufferDirect(O, L, z, D, x, j), D.side = Rn, D.needsUpdate = !0, S.renderBufferDirect(O, L, z, D, x, j), D.side = we) : S.renderBufferDirect(O, L, z, D, x, j), x.onAfterRender(S, L, O, z, D, j);
    }
    function rr(x, L, O) {
      L.isScene !== !0 && (L = ae);
      const z = _t.get(x), D = p.state.lights, j = p.state.shadowsArray, nt = D.state.version, ct = gt.getParameters(x, D.state, j, L, O), ft = gt.getProgramCacheKey(ct);
      let Ct = z.programs;
      z.environment = x.isMeshStandardMaterial ? L.environment : null, z.fog = L.fog, z.envMap = (x.isMeshStandardMaterial ? F : _).get(x.envMap || z.environment), z.envMapRotation = z.environment !== null && x.envMap === null ? L.environmentRotation : x.envMapRotation, Ct === void 0 && (x.addEventListener("dispose", Pt), Ct = /* @__PURE__ */ new Map(), z.programs = Ct);
      let wt = Ct.get(ft);
      if (wt !== void 0) {
        if (z.currentProgram === wt && z.lightsStateVersion === nt)
          return Wa(x, ct), wt;
      } else
        ct.uniforms = gt.getUniforms(x), x.onBeforeCompile(ct, S), wt = gt.acquireProgram(ct, ft), Ct.set(ft, wt), z.uniforms = ct.uniforms;
      const Mt = z.uniforms;
      return (!x.isShaderMaterial && !x.isRawShaderMaterial || x.clipping === !0) && (Mt.clippingPlanes = K.uniform), Wa(x, ct), z.needsLights = oc(x), z.lightsStateVersion = nt, z.needsLights && (Mt.ambientLightColor.value = D.state.ambient, Mt.lightProbe.value = D.state.probe, Mt.directionalLights.value = D.state.directional, Mt.directionalLightShadows.value = D.state.directionalShadow, Mt.spotLights.value = D.state.spot, Mt.spotLightShadows.value = D.state.spotShadow, Mt.rectAreaLights.value = D.state.rectArea, Mt.ltc_1.value = D.state.rectAreaLTC1, Mt.ltc_2.value = D.state.rectAreaLTC2, Mt.pointLights.value = D.state.point, Mt.pointLightShadows.value = D.state.pointShadow, Mt.hemisphereLights.value = D.state.hemi, Mt.directionalShadowMap.value = D.state.directionalShadowMap, Mt.directionalShadowMatrix.value = D.state.directionalShadowMatrix, Mt.spotShadowMap.value = D.state.spotShadowMap, Mt.spotLightMatrix.value = D.state.spotLightMatrix, Mt.spotLightMap.value = D.state.spotLightMap, Mt.pointShadowMap.value = D.state.pointShadowMap, Mt.pointShadowMatrix.value = D.state.pointShadowMatrix), z.currentProgram = wt, z.uniformsList = null, wt;
    }
    function Ga(x) {
      if (x.uniformsList === null) {
        const L = x.currentProgram.getUniforms();
        x.uniformsList = Br.seqWithValue(L.seq, x.uniforms);
      }
      return x.uniformsList;
    }
    function Wa(x, L) {
      const O = _t.get(x);
      O.outputColorSpace = L.outputColorSpace, O.batching = L.batching, O.batchingColor = L.batchingColor, O.instancing = L.instancing, O.instancingColor = L.instancingColor, O.instancingMorph = L.instancingMorph, O.skinning = L.skinning, O.morphTargets = L.morphTargets, O.morphNormals = L.morphNormals, O.morphColors = L.morphColors, O.morphTargetsCount = L.morphTargetsCount, O.numClippingPlanes = L.numClippingPlanes, O.numIntersection = L.numClipIntersection, O.vertexAlphas = L.vertexAlphas, O.vertexTangents = L.vertexTangents, O.toneMapping = L.toneMapping;
    }
    function sc(x, L, O, z, D) {
      L.isScene !== !0 && (L = ae), E.resetTextureUnits();
      const j = L.fog, nt = z.isMeshStandardMaterial ? L.environment : null, ct = U === null ? S.outputColorSpace : U.isXRRenderTarget === !0 ? U.texture.colorSpace : Mi, ft = (z.isMeshStandardMaterial ? F : _).get(z.envMap || nt), Ct = z.vertexColors === !0 && !!O.attributes.color && O.attributes.color.itemSize === 4, wt = !!O.attributes.tangent && (!!z.normalMap || z.anisotropy > 0), Mt = !!O.morphAttributes.position, kt = !!O.morphAttributes.normal, qt = !!O.morphAttributes.color;
      let oe = wn;
      z.toneMapped && (U === null || U.isXRRenderTarget === !0) && (oe = S.toneMapping);
      const re = O.morphAttributes.position || O.morphAttributes.normal || O.morphAttributes.color, Vt = re !== void 0 ? re.length : 0, St = _t.get(z), me = p.state.lights;
      if (tt === !0 && (pt === !0 || x !== M)) {
        const Ee = x === M && z.id === y;
        K.setState(z, x, Ee);
      }
      let Yt = !1;
      z.version === St.__version ? (St.needsLights && St.lightsStateVersion !== me.state.version || St.outputColorSpace !== ct || D.isBatchedMesh && St.batching === !1 || !D.isBatchedMesh && St.batching === !0 || D.isBatchedMesh && St.batchingColor === !0 && D.colorTexture === null || D.isBatchedMesh && St.batchingColor === !1 && D.colorTexture !== null || D.isInstancedMesh && St.instancing === !1 || !D.isInstancedMesh && St.instancing === !0 || D.isSkinnedMesh && St.skinning === !1 || !D.isSkinnedMesh && St.skinning === !0 || D.isInstancedMesh && St.instancingColor === !0 && D.instanceColor === null || D.isInstancedMesh && St.instancingColor === !1 && D.instanceColor !== null || D.isInstancedMesh && St.instancingMorph === !0 && D.morphTexture === null || D.isInstancedMesh && St.instancingMorph === !1 && D.morphTexture !== null || St.envMap !== ft || z.fog === !0 && St.fog !== j || St.numClippingPlanes !== void 0 && (St.numClippingPlanes !== K.numPlanes || St.numIntersection !== K.numIntersection) || St.vertexAlphas !== Ct || St.vertexTangents !== wt || St.morphTargets !== Mt || St.morphNormals !== kt || St.morphColors !== qt || St.toneMapping !== oe || St.morphTargetsCount !== Vt) && (Yt = !0) : (Yt = !0, St.__version = z.version);
      let Ve = St.currentProgram;
      Yt === !0 && (Ve = rr(z, L, D));
      let Jn = !1, Pe = !1, wi = !1;
      const te = Ve.getUniforms(), Oe = St.uniforms;
      if (xt.useProgram(Ve.program) && (Jn = !0, Pe = !0, wi = !0), z.id !== y && (y = z.id, Pe = !0), Jn || M !== x) {
        xt.buffers.depth.getReversed() ? (rt.copy(x.projectionMatrix), hh(rt), uh(rt), te.setValue(b, "projectionMatrix", rt)) : te.setValue(b, "projectionMatrix", x.projectionMatrix), te.setValue(b, "viewMatrix", x.matrixWorldInverse);
        const Ae = te.map.cameraPosition;
        Ae !== void 0 && Ae.setValue(b, Xt.setFromMatrixPosition(x.matrixWorld)), Bt.logarithmicDepthBuffer && te.setValue(
          b,
          "logDepthBufFC",
          2 / (Math.log(x.far + 1) / Math.LN2)
        ), (z.isMeshPhongMaterial || z.isMeshToonMaterial || z.isMeshLambertMaterial || z.isMeshBasicMaterial || z.isMeshStandardMaterial || z.isShaderMaterial) && te.setValue(b, "isOrthographic", x.isOrthographicCamera === !0), M !== x && (M = x, Pe = !0, wi = !0);
      }
      if (D.isSkinnedMesh) {
        te.setOptional(b, D, "bindMatrix"), te.setOptional(b, D, "bindMatrixInverse");
        const Ee = D.skeleton;
        Ee && (Ee.boneTexture === null && Ee.computeBoneTexture(), te.setValue(b, "boneTexture", Ee.boneTexture, E));
      }
      D.isBatchedMesh && (te.setOptional(b, D, "batchingTexture"), te.setValue(b, "batchingTexture", D._matricesTexture, E), te.setOptional(b, D, "batchingIdTexture"), te.setValue(b, "batchingIdTexture", D._indirectTexture, E), te.setOptional(b, D, "batchingColorTexture"), D._colorsTexture !== null && te.setValue(b, "batchingColorTexture", D._colorsTexture, E));
      const Be = O.morphAttributes;
      if ((Be.position !== void 0 || Be.normal !== void 0 || Be.color !== void 0) && Rt.update(D, O, Ve), (Pe || St.receiveShadow !== D.receiveShadow) && (St.receiveShadow = D.receiveShadow, te.setValue(b, "receiveShadow", D.receiveShadow)), z.isMeshGouraudMaterial && z.envMap !== null && (Oe.envMap.value = ft, Oe.flipEnvMap.value = ft.isCubeTexture && ft.isRenderTargetTexture === !1 ? -1 : 1), z.isMeshStandardMaterial && z.envMap === null && L.environment !== null && (Oe.envMapIntensity.value = L.environmentIntensity), Pe && (te.setValue(b, "toneMappingExposure", S.toneMappingExposure), St.needsLights && ac(Oe, wi), j && z.fog === !0 && st.refreshFogUniforms(Oe, j), st.refreshMaterialUniforms(Oe, z, V, Q, p.state.transmissionRenderTarget[x.id]), Br.upload(b, Ga(St), Oe, E)), z.isShaderMaterial && z.uniformsNeedUpdate === !0 && (Br.upload(b, Ga(St), Oe, E), z.uniformsNeedUpdate = !1), z.isSpriteMaterial && te.setValue(b, "center", D.center), te.setValue(b, "modelViewMatrix", D.modelViewMatrix), te.setValue(b, "normalMatrix", D.normalMatrix), te.setValue(b, "modelMatrix", D.matrixWorld), z.isShaderMaterial || z.isRawShaderMaterial) {
        const Ee = z.uniformsGroups;
        for (let Ae = 0, $r = Ee.length; Ae < $r; Ae++) {
          const Ln = Ee[Ae];
          P.update(Ln, Ve), P.bind(Ln, Ve);
        }
      }
      return Ve;
    }
    function ac(x, L) {
      x.ambientLightColor.needsUpdate = L, x.lightProbe.needsUpdate = L, x.directionalLights.needsUpdate = L, x.directionalLightShadows.needsUpdate = L, x.pointLights.needsUpdate = L, x.pointLightShadows.needsUpdate = L, x.spotLights.needsUpdate = L, x.spotLightShadows.needsUpdate = L, x.rectAreaLights.needsUpdate = L, x.hemisphereLights.needsUpdate = L;
    }
    function oc(x) {
      return x.isMeshLambertMaterial || x.isMeshToonMaterial || x.isMeshPhongMaterial || x.isMeshStandardMaterial || x.isShadowMaterial || x.isShaderMaterial && x.lights === !0;
    }
    this.getActiveCubeFace = function() {
      return w;
    }, this.getActiveMipmapLevel = function() {
      return R;
    }, this.getRenderTarget = function() {
      return U;
    }, this.setRenderTargetTextures = function(x, L, O) {
      const z = _t.get(x);
      z.__autoAllocateDepthBuffer = x.resolveDepthBuffer === !1, z.__autoAllocateDepthBuffer === !1 && (z.__useRenderToTexture = !1), _t.get(x.texture).__webglTexture = L, _t.get(x.depthTexture).__webglTexture = z.__autoAllocateDepthBuffer ? void 0 : O, z.__hasExternalTextures = !0;
    }, this.setRenderTargetFramebuffer = function(x, L) {
      const O = _t.get(x);
      O.__webglFramebuffer = L, O.__useDefaultFramebuffer = L === void 0;
    };
    const lc = b.createFramebuffer();
    this.setRenderTarget = function(x, L = 0, O = 0) {
      U = x, w = L, R = O;
      let z = !0, D = null, j = !1, nt = !1;
      if (x) {
        const ft = _t.get(x);
        if (ft.__useDefaultFramebuffer !== void 0)
          xt.bindFramebuffer(b.FRAMEBUFFER, null), z = !1;
        else if (ft.__webglFramebuffer === void 0)
          E.setupRenderTarget(x);
        else if (ft.__hasExternalTextures)
          E.rebindTextures(x, _t.get(x.texture).__webglTexture, _t.get(x.depthTexture).__webglTexture);
        else if (x.depthBuffer) {
          const Mt = x.depthTexture;
          if (ft.__boundDepthTexture !== Mt) {
            if (Mt !== null && _t.has(Mt) && (x.width !== Mt.image.width || x.height !== Mt.image.height))
              throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");
            E.setupDepthRenderbuffer(x);
          }
        }
        const Ct = x.texture;
        (Ct.isData3DTexture || Ct.isDataArrayTexture || Ct.isCompressedArrayTexture) && (nt = !0);
        const wt = _t.get(x).__webglFramebuffer;
        x.isWebGLCubeRenderTarget ? (Array.isArray(wt[L]) ? D = wt[L][O] : D = wt[L], j = !0) : x.samples > 0 && E.useMultisampledRTT(x) === !1 ? D = _t.get(x).__webglMultisampledFramebuffer : Array.isArray(wt) ? D = wt[O] : D = wt, C.copy(x.viewport), H.copy(x.scissor), B = x.scissorTest;
      } else
        C.copy(vt).multiplyScalar(V).floor(), H.copy(Ut).multiplyScalar(V).floor(), B = Jt;
      if (O !== 0 && (D = lc), xt.bindFramebuffer(b.FRAMEBUFFER, D) && z && xt.drawBuffers(x, D), xt.viewport(C), xt.scissor(H), xt.setScissorTest(B), j) {
        const ft = _t.get(x.texture);
        b.framebufferTexture2D(b.FRAMEBUFFER, b.COLOR_ATTACHMENT0, b.TEXTURE_CUBE_MAP_POSITIVE_X + L, ft.__webglTexture, O);
      } else if (nt) {
        const ft = _t.get(x.texture), Ct = L;
        b.framebufferTextureLayer(b.FRAMEBUFFER, b.COLOR_ATTACHMENT0, ft.__webglTexture, O, Ct);
      } else if (x !== null && O !== 0) {
        const ft = _t.get(x.texture);
        b.framebufferTexture2D(b.FRAMEBUFFER, b.COLOR_ATTACHMENT0, b.TEXTURE_2D, ft.__webglTexture, O);
      }
      y = -1;
    }, this.readRenderTargetPixels = function(x, L, O, z, D, j, nt) {
      if (!(x && x.isWebGLRenderTarget)) {
        console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
        return;
      }
      let ct = _t.get(x).__webglFramebuffer;
      if (x.isWebGLCubeRenderTarget && nt !== void 0 && (ct = ct[nt]), ct) {
        xt.bindFramebuffer(b.FRAMEBUFFER, ct);
        try {
          const ft = x.texture, Ct = ft.format, wt = ft.type;
          if (!Bt.textureFormatReadable(Ct)) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
            return;
          }
          if (!Bt.textureTypeReadable(wt)) {
            console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
            return;
          }
          L >= 0 && L <= x.width - z && O >= 0 && O <= x.height - D && b.readPixels(L, O, z, D, Dt.convert(Ct), Dt.convert(wt), j);
        } finally {
          const ft = U !== null ? _t.get(U).__webglFramebuffer : null;
          xt.bindFramebuffer(b.FRAMEBUFFER, ft);
        }
      }
    }, this.readRenderTargetPixelsAsync = async function(x, L, O, z, D, j, nt) {
      if (!(x && x.isWebGLRenderTarget))
        throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
      let ct = _t.get(x).__webglFramebuffer;
      if (x.isWebGLCubeRenderTarget && nt !== void 0 && (ct = ct[nt]), ct)
        if (L >= 0 && L <= x.width - z && O >= 0 && O <= x.height - D) {
          xt.bindFramebuffer(b.FRAMEBUFFER, ct);
          const ft = x.texture, Ct = ft.format, wt = ft.type;
          if (!Bt.textureFormatReadable(Ct))
            throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");
          if (!Bt.textureTypeReadable(wt))
            throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");
          const Mt = b.createBuffer();
          b.bindBuffer(b.PIXEL_PACK_BUFFER, Mt), b.bufferData(b.PIXEL_PACK_BUFFER, j.byteLength, b.STREAM_READ), b.readPixels(L, O, z, D, Dt.convert(Ct), Dt.convert(wt), 0);
          const kt = U !== null ? _t.get(U).__webglFramebuffer : null;
          xt.bindFramebuffer(b.FRAMEBUFFER, kt);
          const qt = b.fenceSync(b.SYNC_GPU_COMMANDS_COMPLETE, 0);
          return b.flush(), await ch(b, qt, 4), b.bindBuffer(b.PIXEL_PACK_BUFFER, Mt), b.getBufferSubData(b.PIXEL_PACK_BUFFER, 0, j), b.deleteBuffer(Mt), b.deleteSync(qt), j;
        } else
          throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.");
    }, this.copyFramebufferToTexture = function(x, L = null, O = 0) {
      const z = Math.pow(2, -O), D = Math.floor(x.image.width * z), j = Math.floor(x.image.height * z), nt = L !== null ? L.x : 0, ct = L !== null ? L.y : 0;
      E.setTexture2D(x, 0), b.copyTexSubImage2D(b.TEXTURE_2D, O, 0, 0, nt, ct, D, j), xt.unbindTexture();
    };
    const cc = b.createFramebuffer(), hc = b.createFramebuffer();
    this.copyTextureToTexture = function(x, L, O = null, z = null, D = 0, j = null) {
      j === null && (D !== 0 ? (Or("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."), j = D, D = 0) : j = 0);
      let nt, ct, ft, Ct, wt, Mt, kt, qt, oe;
      const re = x.isCompressedTexture ? x.mipmaps[j] : x.image;
      if (O !== null)
        nt = O.max.x - O.min.x, ct = O.max.y - O.min.y, ft = O.isBox3 ? O.max.z - O.min.z : 1, Ct = O.min.x, wt = O.min.y, Mt = O.isBox3 ? O.min.z : 0;
      else {
        const Be = Math.pow(2, -D);
        nt = Math.floor(re.width * Be), ct = Math.floor(re.height * Be), x.isDataArrayTexture ? ft = re.depth : x.isData3DTexture ? ft = Math.floor(re.depth * Be) : ft = 1, Ct = 0, wt = 0, Mt = 0;
      }
      z !== null ? (kt = z.x, qt = z.y, oe = z.z) : (kt = 0, qt = 0, oe = 0);
      const Vt = Dt.convert(L.format), St = Dt.convert(L.type);
      let me;
      L.isData3DTexture ? (E.setTexture3D(L, 0), me = b.TEXTURE_3D) : L.isDataArrayTexture || L.isCompressedArrayTexture ? (E.setTexture2DArray(L, 0), me = b.TEXTURE_2D_ARRAY) : (E.setTexture2D(L, 0), me = b.TEXTURE_2D), b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL, L.flipY), b.pixelStorei(b.UNPACK_PREMULTIPLY_ALPHA_WEBGL, L.premultiplyAlpha), b.pixelStorei(b.UNPACK_ALIGNMENT, L.unpackAlignment);
      const Yt = b.getParameter(b.UNPACK_ROW_LENGTH), Ve = b.getParameter(b.UNPACK_IMAGE_HEIGHT), Jn = b.getParameter(b.UNPACK_SKIP_PIXELS), Pe = b.getParameter(b.UNPACK_SKIP_ROWS), wi = b.getParameter(b.UNPACK_SKIP_IMAGES);
      b.pixelStorei(b.UNPACK_ROW_LENGTH, re.width), b.pixelStorei(b.UNPACK_IMAGE_HEIGHT, re.height), b.pixelStorei(b.UNPACK_SKIP_PIXELS, Ct), b.pixelStorei(b.UNPACK_SKIP_ROWS, wt), b.pixelStorei(b.UNPACK_SKIP_IMAGES, Mt);
      const te = x.isDataArrayTexture || x.isData3DTexture, Oe = L.isDataArrayTexture || L.isData3DTexture;
      if (x.isDepthTexture) {
        const Be = _t.get(x), Ee = _t.get(L), Ae = _t.get(Be.__renderTarget), $r = _t.get(Ee.__renderTarget);
        xt.bindFramebuffer(b.READ_FRAMEBUFFER, Ae.__webglFramebuffer), xt.bindFramebuffer(b.DRAW_FRAMEBUFFER, $r.__webglFramebuffer);
        for (let Ln = 0; Ln < ft; Ln++)
          te && (b.framebufferTextureLayer(b.READ_FRAMEBUFFER, b.COLOR_ATTACHMENT0, _t.get(x).__webglTexture, D, Mt + Ln), b.framebufferTextureLayer(b.DRAW_FRAMEBUFFER, b.COLOR_ATTACHMENT0, _t.get(L).__webglTexture, j, oe + Ln)), b.blitFramebuffer(Ct, wt, nt, ct, kt, qt, nt, ct, b.DEPTH_BUFFER_BIT, b.NEAREST);
        xt.bindFramebuffer(b.READ_FRAMEBUFFER, null), xt.bindFramebuffer(b.DRAW_FRAMEBUFFER, null);
      } else if (D !== 0 || x.isRenderTargetTexture || _t.has(x)) {
        const Be = _t.get(x), Ee = _t.get(L);
        xt.bindFramebuffer(b.READ_FRAMEBUFFER, cc), xt.bindFramebuffer(b.DRAW_FRAMEBUFFER, hc);
        for (let Ae = 0; Ae < ft; Ae++)
          te ? b.framebufferTextureLayer(b.READ_FRAMEBUFFER, b.COLOR_ATTACHMENT0, Be.__webglTexture, D, Mt + Ae) : b.framebufferTexture2D(b.READ_FRAMEBUFFER, b.COLOR_ATTACHMENT0, b.TEXTURE_2D, Be.__webglTexture, D), Oe ? b.framebufferTextureLayer(b.DRAW_FRAMEBUFFER, b.COLOR_ATTACHMENT0, Ee.__webglTexture, j, oe + Ae) : b.framebufferTexture2D(b.DRAW_FRAMEBUFFER, b.COLOR_ATTACHMENT0, b.TEXTURE_2D, Ee.__webglTexture, j), D !== 0 ? b.blitFramebuffer(Ct, wt, nt, ct, kt, qt, nt, ct, b.COLOR_BUFFER_BIT, b.NEAREST) : Oe ? b.copyTexSubImage3D(me, j, kt, qt, oe + Ae, Ct, wt, nt, ct) : b.copyTexSubImage2D(me, j, kt, qt, Ct, wt, nt, ct);
        xt.bindFramebuffer(b.READ_FRAMEBUFFER, null), xt.bindFramebuffer(b.DRAW_FRAMEBUFFER, null);
      } else
        Oe ? x.isDataTexture || x.isData3DTexture ? b.texSubImage3D(me, j, kt, qt, oe, nt, ct, ft, Vt, St, re.data) : L.isCompressedArrayTexture ? b.compressedTexSubImage3D(me, j, kt, qt, oe, nt, ct, ft, Vt, re.data) : b.texSubImage3D(me, j, kt, qt, oe, nt, ct, ft, Vt, St, re) : x.isDataTexture ? b.texSubImage2D(b.TEXTURE_2D, j, kt, qt, nt, ct, Vt, St, re.data) : x.isCompressedTexture ? b.compressedTexSubImage2D(b.TEXTURE_2D, j, kt, qt, re.width, re.height, Vt, re.data) : b.texSubImage2D(b.TEXTURE_2D, j, kt, qt, nt, ct, Vt, St, re);
      b.pixelStorei(b.UNPACK_ROW_LENGTH, Yt), b.pixelStorei(b.UNPACK_IMAGE_HEIGHT, Ve), b.pixelStorei(b.UNPACK_SKIP_PIXELS, Jn), b.pixelStorei(b.UNPACK_SKIP_ROWS, Pe), b.pixelStorei(b.UNPACK_SKIP_IMAGES, wi), j === 0 && L.generateMipmaps && b.generateMipmap(me), xt.unbindTexture();
    }, this.copyTextureToTexture3D = function(x, L, O = null, z = null, D = 0) {
      return Or('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'), this.copyTextureToTexture(x, L, O, z, D);
    }, this.initRenderTarget = function(x) {
      _t.get(x).__webglFramebuffer === void 0 && E.setupRenderTarget(x);
    }, this.initTexture = function(x) {
      x.isCubeTexture ? E.setTextureCube(x, 0) : x.isData3DTexture ? E.setTexture3D(x, 0) : x.isDataArrayTexture || x.isCompressedArrayTexture ? E.setTexture2DArray(x, 0) : E.setTexture2D(x, 0), xt.unbindTexture();
    }, this.resetState = function() {
      w = 0, R = 0, U = null, xt.reset(), jt.reset();
    }, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
  }
  /**
   * Defines the coordinate system of the renderer.
   *
   * In `WebGLRenderer`, the value is always `WebGLCoordinateSystem`.
   *
   * @type {WebGLCoordinateSystem|WebGPUCoordinateSystem}
   * @default WebGLCoordinateSystem
   * @readonly
   */
  get coordinateSystem() {
    return mn;
  }
  /**
   * Defines the output color space of the renderer.
   *
   * @type {SRGBColorSpace|LinearSRGBColorSpace}
   * @default SRGBColorSpace
   */
  get outputColorSpace() {
    return this._outputColorSpace;
  }
  set outputColorSpace(t) {
    this._outputColorSpace = t;
    const e = this.getContext();
    e.drawingBufferColorSpace = Gt._getDrawingBufferColorSpace(t), e.unpackColorSpace = Gt._getUnpackColorSpace();
  }
}
const jo = (i, t, e, n, r) => new Kt(
  i.unitBox,
  i.getStandardSurface(r, 0.48, 0.32)
), Oa = (i, t, e) => {
  const n = new fe(), r = 0.08, s = 0.08, a = new Kt(
    e.unitPlane,
    t.texture ? new Re({
      map: t.texture,
      side: we,
      toneMapped: !1
    }) : e.getBasicSurface(t.surfaceColor)
  ), o = jo(e, t.width + r * 2, r, s, t.frameColor), l = o.clone(), c = jo(e, r, t.height, s, t.frameColor), h = c.clone();
  if (a.scale.set(t.width, t.height, 1), o.scale.set(t.width + r * 2, r, s), l.scale.copy(o.scale), c.scale.set(r, t.height, s), h.scale.copy(c.scale), o.position.y = t.height / 2 + r / 2, l.position.y = -t.height / 2 - r / 2, c.position.x = -t.width / 2 - r / 2, h.position.x = t.width / 2 + r / 2, t.emissive) {
    const u = new Kt(
      e.unitPlane,
      e.getGlow(t.emissive, 0.16)
    );
    u.scale.set(t.width + 0.28, t.height + 0.28, 1), u.position.z = -0.04, n.add(u);
  }
  return n.add(a, o, l, c, h), n.position.set(i.position.x, i.position.y, i.position.z), n.rotation.set(i.rotation.x, i.rotation.y, i.rotation.z), n.name = `${i.type}:${i.id}`, n;
};
class mg {
  type = "artwork";
  async create(t, e) {
    const n = await e.assets.getTextureForItem(t);
    return Oa(t, {
      width: t.bounds?.width ?? 2.2,
      height: t.bounds?.height ?? 1.55,
      surfaceColor: "#d8d1bf",
      frameColor: "#1f1e1b",
      emissive: "#d4b26a",
      texture: n
    }, e.resources);
  }
}
const Ni = (i, t) => {
  const e = i[t];
  return typeof e == "string" && e.trim().length > 0 ? e : void 0;
}, gg = (i) => {
  const t = i.metadata;
  if (!t || typeof t != "object" || Array.isArray(t))
    return;
  const e = Object.entries(t).filter(
    (n) => typeof n[1] == "string"
  );
  return e.length > 0 ? Object.fromEntries(e) : void 0;
}, er = (i) => ({
  eyebrow: Ni(i.content, "eyebrow"),
  title: Ni(i.content, "title") ?? i.id,
  subtitle: Ni(i.content, "subtitle"),
  description: Ni(i.content, "description"),
  body: Ni(i.content, "body"),
  metadata: gg(i.content)
}), di = 1024, Qo = 768, Pr = (i, t, e, n, r, s) => {
  const a = t.split(/\s+/);
  let o = "", l = n;
  return a.forEach((c) => {
    const h = o.length > 0 ? `${o} ${c}` : c;
    if (i.measureText(h).width > r && o.length > 0) {
      i.fillText(o, e, l), o = c, l += s;
      return;
    }
    o = h;
  }), o.length > 0 && i.fillText(o, e, l), l + s;
}, _g = (i, t, e) => {
  const n = document.createElement("canvas");
  n.width = di, n.height = Qo;
  const r = n.getContext("2d");
  if (r)
    if (r.fillStyle = t.background, r.fillRect(0, 0, di, Qo), r.fillStyle = t.accent, r.fillRect(64, 64, 96, 6), r.fillStyle = t.foreground, r.textBaseline = "top", e)
      r.textAlign = "center", r.fillStyle = t.accent, r.fillRect(di / 2 - 48, 96, 96, 5), i.eyebrow && (r.font = "700 30px system-ui, sans-serif", r.globalAlpha = 0.72, r.fillText(i.eyebrow.toUpperCase(), di / 2, 128), r.globalAlpha = 1), r.fillStyle = t.foreground, r.font = "800 86px system-ui, sans-serif", tl(r, (i.title ?? "").toUpperCase(), di / 2, 292, 820, 86), r.font = "500 34px system-ui, sans-serif", r.globalAlpha = 0.72, tl(
        r,
        i.description ?? i.body ?? i.subtitle ?? "",
        di / 2,
        548,
        760,
        44
      ), r.globalAlpha = 1;
    else if (i.eyebrow) {
      r.font = "500 34px system-ui, sans-serif", r.globalAlpha = 0.72, r.fillText(i.eyebrow.toUpperCase(), 64, 96), r.globalAlpha = 1, r.font = "600 76px system-ui, sans-serif";
      const a = Pr(r, i.title ?? "", 64, 160, 860, 88);
      r.font = "400 38px system-ui, sans-serif", r.globalAlpha = 0.78, Pr(
        r,
        i.description ?? i.body ?? i.subtitle ?? "",
        64,
        a + 34,
        840,
        52
      ), r.globalAlpha = 1;
    } else {
      r.font = "600 76px system-ui, sans-serif";
      const a = Pr(r, i.title ?? "", 64, 160, 860, 88);
      r.font = "400 38px system-ui, sans-serif", r.globalAlpha = 0.78, Pr(
        r,
        i.description ?? i.body ?? i.subtitle ?? "",
        64,
        a + 34,
        840,
        52
      ), r.globalAlpha = 1;
    }
  const s = new zl(n);
  return s.colorSpace = "srgb", s.needsUpdate = !0, s;
}, tl = (i, t, e, n, r, s) => {
  const a = t.split(/\s+/);
  let o = "", l = n;
  return a.forEach((c) => {
    const h = o.length > 0 ? `${o} ${c}` : c;
    if (i.measureText(h).width > r && o.length > 0) {
      i.fillText(o, e, l), o = c, l += s;
      return;
    }
    o = h;
  }), o.length > 0 && i.fillText(o, e, l), l + s;
}, qr = (i, t, e, n) => {
  const r = new fe(), s = i.placement.side === "center", a = _g(t, e, s), o = new Kt(
    n.unitPlane,
    new Re({
      map: a,
      side: we,
      toneMapped: !1
    })
  ), l = new Kt(
    n.unitPlane,
    n.getStandardSurface(new Ft(e.background).multiplyScalar(0.45).getStyle(), 0.68, 0.14)
  );
  return o.scale.set(e.width, e.height, 1), l.scale.set(e.width + 0.08, e.height + 0.08, 1), l.position.z = -0.025, r.add(l, o), s ? r.add(vg(e.width, e.height)) : r.add(xg(e.width, e.height, e.accent)), r.position.set(i.position.x, i.position.y, i.position.z), r.rotation.set(i.rotation.x, i.rotation.y, i.rotation.z), r.name = `${i.type}:${i.id}`, r;
}, pn = (i, t, e, n) => new Kt(new pe(i, t, e), n), vg = (i, t) => {
  const e = new fe(), n = new Wn({
    color: "#15120f",
    roughness: 0.48,
    metalness: 0.22
  }), r = new Re({
    color: "#fff5d6",
    toneMapped: !1
  }), s = i + 1.18, a = t + 0.72, o = 0.12, l = pn(s, o, 0.14, n), c = pn(s, o, 0.14, n), h = pn(o, a, 0.14, n), u = pn(o, a, 0.14, n), f = pn(s - 0.28, 0.025, 0.025, r);
  return l.position.set(0, a / 2, -0.05), c.position.set(0, -a / 2, -0.05), h.position.set(-s / 2, 0, -0.05), u.position.set(s / 2, 0, -0.05), f.position.set(0, a / 2 - 0.16, 0.045), e.name = "station-portal-frame", e.add(l, c, h, u, f), e;
}, xg = (i, t, e) => {
  const n = new fe(), r = new Wn({
    color: "#0f0e0c",
    roughness: 0.56,
    metalness: 0.18
  }), s = new Re({
    color: e,
    toneMapped: !1
  }), a = 0.055, o = pn(i + 0.18, a, 0.06, r), l = pn(i + 0.18, a, 0.06, r), c = pn(a, t + 0.18, 0.06, r), h = pn(i * 0.42, 0.022, 0.022, s);
  return o.position.set(0, t / 2 + 0.075, 0.035), l.position.set(0, -t / 2 - 0.075, 0.035), c.position.set(-i / 2 - 0.075, 0, 0.035), h.position.set(-i * 0.22, t / 2 + 0.12, 0.075), n.name = "wall-panel-frame", n.add(o, l, c, h), n;
};
class Mg {
  type = "cta";
  create(t, e) {
    return qr(t, er(t), {
      width: t.bounds?.width ?? 3.2,
      height: t.bounds?.height ?? 1.8,
      background: "#f1eee6",
      foreground: "#181817",
      accent: "#b08d57"
    }, e.resources);
  }
}
class Sg {
  type = "image";
  async create(t, e) {
    const n = await e.assets.getTextureForItem(t);
    return Oa(t, {
      width: t.bounds?.width ?? 2.4,
      height: t.bounds?.height ?? 1.6,
      surfaceColor: "#c4c9c4",
      frameColor: "#2d302e",
      texture: n
    }, e.resources);
  }
}
class yg {
  type = "profile";
  create(t, e) {
    return qr(t, er(t), {
      width: t.bounds?.width ?? 3.4,
      height: t.bounds?.height ?? 2.1,
      background: "#202322",
      foreground: "#f3eee3",
      accent: "#9bb3a5"
    }, e.resources);
  }
}
class Eg {
  type = "quote";
  create(t, e) {
    return qr(t, er(t), {
      width: t.bounds?.width ?? 3.2,
      height: t.bounds?.height ?? 2,
      background: "#eee8da",
      foreground: "#20201d",
      accent: "#6f7569"
    }, e.resources);
  }
}
class Tg {
  type = "statement";
  create(t, e) {
    return qr(t, er(t), {
      width: t.bounds?.width ?? 3.8,
      height: t.bounds?.height ?? 2.2,
      background: "#171716",
      foreground: "#f5f0e8",
      accent: "#d4b26a"
    }, e.resources);
  }
}
const Ag = () => {
  const i = new Xl();
  return i.moveTo(-0.18, -0.24), i.lineTo(0.28, 0), i.lineTo(-0.18, 0.24), i.closePath(), new Kt(
    new Ia(i),
    new Re({
      color: "#f5f0e8",
      transparent: !0,
      opacity: 0.9,
      toneMapped: !1
    })
  );
};
class bg {
  type = "video";
  create(t, e) {
    const n = Oa(t, {
      width: t.bounds?.width ?? 2.8,
      height: t.bounds?.height ?? 1.58,
      surfaceColor: e.quality.preset === "low" ? "#242626" : "#101314",
      frameColor: "#151716",
      emissive: "#6f9ca3"
    }, e.resources), r = Ag();
    return r.position.z = 0.05, n.add(r), n;
  }
}
const wg = () => {
  const i = fc();
  return i.register(new mg()), i.register(new Tg()), i.register(new Eg()), i.register(new yg()), i.register(new Sg()), i.register(new bg()), i.register(new Mg()), i;
}, Rg = {
  cameraHeight: 1.7,
  focusDistance: 4.2,
  lookAhead: 2.2
}, Fi = (i, t, e, n) => ({
  x: i.x + t,
  y: i.y + e,
  z: i.z + n
}), Cg = (i, t) => {
  const e = i.bounds, n = e?.width ?? 2.4, r = e?.height ?? 1.6;
  return Math.max(1.35, Math.min(t, Math.max(n * 0.9, r * 1.05)));
}, Pg = (i, t = {}) => {
  const e = { ...Rg, ...t };
  if (i.length === 0)
    return [
      {
        progress: 0,
        position: { x: 0, y: e.cameraHeight, z: 4 },
        lookAt: { x: 0, y: e.cameraHeight, z: -4 },
        activeItemId: null,
        label: "empty"
      }
    ];
  const n = 1 / Math.max(1, i.length), r = [
    {
      progress: 0,
      position: { x: 0, y: e.cameraHeight, z: 0.9 },
      lookAt: Fi(i[0].focusTarget, 0, 0, -e.lookAhead),
      activeItemId: null,
      label: "start"
    }
  ];
  i.forEach((a, o) => {
    const l = o * n, c = a.placement.side ?? "auto";
    if (c === "center") {
      const v = Math.min(1, l + n * 0.32), m = Math.min(1, l + n * 0.72);
      r.push({
        progress: v,
        position: { x: 0, y: e.cameraHeight, z: a.position.z + e.focusDistance },
        lookAt: Fi(a.focusTarget, 0, 0, -e.lookAhead),
        activeItemId: a.id,
        label: `${a.id}:approach`
      }), r.push({
        progress: m,
        position: { x: 0, y: e.cameraHeight, z: a.position.z - e.focusDistance * 0.28 },
        lookAt: Fi(a.focusTarget, 0, 0, -e.lookAhead * 1.8),
        activeItemId: a.id,
        label: `${a.id}:pass-through`
      });
      return;
    }
    const u = c === "left" ? 1 : -1, f = Cg(a, e.focusDistance), d = {
      x: 0,
      y: e.cameraHeight,
      z: a.position.z + Math.max(1.45, e.lookAhead * 0.72)
    }, g = {
      x: a.position.x + u * f,
      y: e.cameraHeight,
      z: a.position.z
    };
    r.push({
      progress: Math.min(1, l + n * 0.36),
      position: d,
      lookAt: Fi(a.focusTarget, u * 0.24, 0, -e.lookAhead * 0.26),
      activeItemId: null,
      label: `${a.id}:turn-start`
    }), r.push({
      progress: Math.min(1, l + n * 0.64),
      position: g,
      lookAt: a.focusTarget,
      activeItemId: a.id,
      label: `${a.id}:focus`
    }), r.push({
      progress: Math.min(1, l + n * 0.86),
      position: g,
      lookAt: a.focusTarget,
      activeItemId: a.id,
      label: `${a.id}:hold`
    });
  });
  const s = i[i.length - 1];
  return r.push({
    progress: 1,
    position: { x: 0, y: e.cameraHeight, z: s.position.z - e.focusDistance },
    lookAt: Fi(s.focusTarget, 0, 0, -e.lookAhead),
    activeItemId: null,
    label: "end"
  }), r.sort((a, o) => a.progress - o.progress);
}, Gi = (i, t, e) => i + (t - i) * e, Lg = (i, t, e) => ({
  x: Gi(i.x, t.x, e),
  y: Gi(i.y, t.y, e),
  z: Gi(i.z, t.z, e)
}), Dg = (i) => i === "full" ? 1 : i === "half" ? 0.48 : 0, Ig = (i, t, e) => {
  const n = Dg(e);
  if (n === 0 || !t)
    return i;
  const r = Math.max(2.8, Math.abs(i.position.z - t.focusTarget.z)), s = {
    x: Gi(i.position.x, t.focusTarget.x * 0.18, n),
    y: i.position.y + n * 0.28,
    z: Gi(i.position.z, t.focusTarget.z + r * 0.72, n)
  }, a = Lg(i.lookAt, {
    x: t.focusTarget.x,
    y: t.focusTarget.y + n * 0.18,
    z: t.focusTarget.z
  }, n);
  return {
    ...i,
    position: s,
    lookAt: a
  };
}, Ug = (i, t) => ({
  ledStripCount: i.enabled ? Math.max(2, Math.round(12 * t.geometryDetail)) : 0,
  glowPlaneCount: i.enabled ? Math.max(2, Math.round(24 * t.geometryDetail)) : 0,
  dynamicLightCount: i.enabled ? Math.min(t.lightBudget, 4) : 0
}), Ng = (i, t, e, n) => {
  const r = new fe(), s = Ug({ enabled: !0 }, n), a = Math.max(2, s.glowPlaneCount), o = new Je(0.42, Math.max(1.2, t / a)), l = new Re({
    color: "#fff2c4",
    transparent: !0,
    opacity: n.preset === "low" ? 0.08 : 0.14,
    blending: zr,
    depthWrite: !1,
    side: we,
    toneMapped: !1
  }), c = new Ie(o, l, a * 2), h = new Wt(), u = new Ai().setFromAxisAngle(new I(1, 0, 0), -Math.PI / 2), f = new I(1, 1, 1);
  for (let d = 0; d < a; d += 1) {
    const g = -t * (d / Math.max(1, a - 1)), v = new I(-i / 2 + 0.36, 0.035, g), m = new I(i / 2 - 0.36, 0.035, g);
    h.compose(v, u, f), c.setMatrixAt(d * 2, h), h.compose(m, u, f), c.setMatrixAt(d * 2 + 1, h);
  }
  return c.instanceMatrix.needsUpdate = !0, c.name = "architectural-led-bake", r.name = "architectural-bake-root", r.add(c), r;
}, Fg = (i, t, e, n, r) => {
  const s = new fe();
  return s.name = "architectural-detail-layer", s.add(Og(i, t, e, n, r)), s.add(Bg(i, t, e, n, r)), s;
}, Og = (i, t, e, n, r) => {
  const s = new fe(), a = Math.max(7, Math.round((r.geometryDetail > 0.75 ? 12 : 8) * (t / 72))), o = t / a * 0.78, l = new Je(o, e * 0.56), c = new Je(o, 0.42), h = new Ie(l, n.wallAccent, a), u = new Ie(l, n.wallAccent, a), f = new Ie(c, n.floorAccent, a), d = new Ie(c, n.floorAccent, a), g = new Wt();
  for (let v = 0; v < a; v += 1) {
    const m = -o * 0.5 - v * (t / a);
    g.makeRotationY(Math.PI / 2), g.setPosition(-i / 2 + 0.072, e * 0.58, m), h.setMatrixAt(v, g), g.makeRotationY(-Math.PI / 2), g.setPosition(i / 2 - 0.072, e * 0.58, m), u.setMatrixAt(v, g), g.makeRotationY(Math.PI / 2), g.setPosition(-i / 2 + 0.078, 0.38, m), f.setMatrixAt(v, g), g.makeRotationY(-Math.PI / 2), g.setPosition(i / 2 - 0.078, 0.38, m), d.setMatrixAt(v, g);
  }
  return h.instanceMatrix.needsUpdate = !0, u.instanceMatrix.needsUpdate = !0, f.instanceMatrix.needsUpdate = !0, d.instanceMatrix.needsUpdate = !0, s.name = "wall-panel-fields", s.add(h, u, f, d), s;
}, Bg = (i, t, e, n, r) => {
  const s = new fe(), a = Math.max(8, Math.round((r.geometryDetail > 0.75 ? 14 : 9) * (t / 72))), o = t / a * 0.72, l = new Ie(
    new pe(i - 0.7, 0.025, o),
    n.ceilingAccent,
    a
  ), c = new Wt();
  for (let h = 0; h < a; h += 1)
    c.makeTranslation(0, e - 0.052, -o * 0.5 - h * (t / a)), l.setMatrixAt(h, c);
  return l.instanceMatrix.needsUpdate = !0, s.name = "ceiling-panel-fields", s.add(l), s;
}, zg = "/textures/stone/stone_color.jpg", Hg = "/textures/stone/stone_normal.jpg", kg = (i) => i.preset === "low" ? 384 : i.preset === "medium" ? 512 : 768, Vg = (i) => {
  const t = document.createElement("canvas");
  t.width = i, t.height = i;
  const e = t.getContext("2d");
  if (!e)
    throw new Error("Cannot create procedural architectural texture.");
  return { canvas: t, context: e };
}, Gg = (i, t, e) => {
  const n = new zl(i);
  return n.colorSpace = Se, n.wrapS = Xn, n.wrapT = Xn, n.repeat.set(t, e), n.minFilter = ye, n.magFilter = ye, n.needsUpdate = !0, n;
}, el = (i, t, e, n) => {
  const r = i.clone();
  return r.colorSpace = n, r.wrapS = Xn, r.wrapT = Xn, r.repeat.set(t, e), r.minFilter = ye, r.magFilter = ye, r.needsUpdate = !0, r;
}, Wg = (i) => {
  const { canvas: t, context: e } = Vg(i);
  e.fillStyle = "#2b2721", e.fillRect(0, 0, i, i);
  for (let n = 0; n < i; n += 6) {
    const r = 36 + Math.round((Math.sin(n * 0.04) + 1) * 18);
    e.strokeStyle = `rgb(${r + 16}, ${r + 10}, ${r})`, e.globalAlpha = 0.12, e.beginPath(), e.moveTo(0, n), e.bezierCurveTo(i * 0.26, n - 18, i * 0.58, n + 22, i, n - 8), e.stroke();
  }
  e.globalAlpha = 0.22, e.strokeStyle = "#0f0d0a";
  for (let n = i / 3; n < i; n += i / 3)
    e.beginPath(), e.moveTo(n, 0), e.lineTo(n + Math.sin(n) * 8, i), e.stroke();
  return e.globalAlpha = 1, t;
}, nl = async (i, t, e) => {
  try {
    const n = await i.loadAsync(t);
    return n.minFilter = ye, n.magFilter = ye, n.needsUpdate = !0, n;
  } catch {
    return Gg(e, 1, 1);
  }
}, Oi = (i, t, e, n, r, s, a, o) => new Wn({
  color: i,
  map: el(r, e, n, Se),
  normalMap: el(s, e, n, fn),
  normalScale: new mt(a, a),
  roughness: t,
  metalness: 0,
  emissive: new Ft("#2a2118"),
  emissiveIntensity: o
}), Xg = (i, t) => {
  const e = kg(i), r = Math.max(1, t / 12), s = Wg(e), a = new Jl();
  return Promise.all([
    nl(a, zg, s),
    nl(a, Hg, s)
  ]).then(([o, l]) => {
    const c = r * 1.35, h = 2, u = 8, f = r * 1.3, d = 8, g = r * 1.1;
    return {
      wall: Oi("#ffffff", 0.86, c, h, o, l, 0.72, 0.18),
      wallAccent: Oi(
        "#ffffff",
        0.86,
        c,
        h,
        o,
        l,
        0.58,
        0.12
      ),
      floor: Oi("#ffffff", 0.74, u, f, o, l, 0.64, 0.1),
      floorAccent: new Wn({
        color: "#6d5b43",
        roughness: 0.82,
        metalness: 0.03,
        emissive: "#201810",
        emissiveIntensity: 0.18
      }),
      ceiling: Oi("#ffffff", 0.84, d, g, o, l, 0.42, 0.14),
      ceilingAccent: Oi(
        "#ffffff",
        0.84,
        d,
        g,
        o,
        l,
        0.36,
        0.12
      ),
      trim: new Wn({
        color: "#11100d",
        roughness: 0.48,
        metalness: 0.2
      }),
      led: new Re({
        color: "#fff8df",
        toneMapped: !1
      }),
      bounce: new Re({
        color: "#e0b67a",
        transparent: !0,
        opacity: i.preset === "low" ? 0.12 : 0.2,
        depthWrite: !1,
        toneMapped: !1
      }),
      wallWash: new Re({
        color: "#d7985f",
        transparent: !0,
        opacity: i.preset === "low" ? 0.18 : 0.34,
        blending: zr,
        depthWrite: !1,
        toneMapped: !1
      }),
      fixtureTrim: new Wn({
        color: "#0c0b09",
        roughness: 0.42,
        metalness: 0.3
      }),
      fixtureCore: new Re({
        color: "#fff6df",
        toneMapped: !1
      })
    };
  });
}, qg = (i, t) => {
  const e = new fe(), n = i.bounds?.width ?? 5.4, r = i.bounds?.height ?? 3.4, s = Math.max(i.bounds?.depth ?? 44, 20);
  return Xg(t, s).then((a) => {
    const o = new Kt(new pe(n, 0.05, s), a.floor), l = new Kt(new Je(n, s), a.ceiling), c = new Kt(new Je(s, r), a.wall), h = new Kt(new Je(s, r), a.wall), u = new Kt(new pe(0.08, 0.9, s), a.floor), f = new Kt(new pe(0.08, 0.9, s), a.floor), d = new Cu("#f4ead9", t.preset === "low" ? 0.32 : 0.46), g = new Au("#fff4dc", "#5b452d", t.preset === "low" ? 0.58 : 0.82), v = new Ru("#fff2d7", t.lightBudget > 1 ? 1.24 : 0.78);
    return o.position.set(0, -0.025, -s / 2), l.position.set(0, r, -s / 2), l.rotation.x = Math.PI / 2, c.position.set(-n / 2, r / 2, -s / 2), c.rotation.y = Math.PI / 2, h.position.set(n / 2, r / 2, -s / 2), h.rotation.y = -Math.PI / 2, u.position.set(-n / 2 + 0.06, 0.45, -s / 2), f.position.set(n / 2 - 0.06, 0.45, -s / 2), v.position.set(-1.8, r - 0.45, 2.8), o.receiveShadow = !0, l.receiveShadow = !0, c.receiveShadow = !0, h.receiveShadow = !0, e.name = "architecture-shell", e.add(o, l, c, h, u, f, d, g, v), e.add(Fg(n, s, r, a, t)), e.add($g(n, s, r, a)), e.add(Zg(n, s, r, a, t)), e.add(Yg(n, s, r, a, t)), e.add(Jg(n, s, r, a, t)), e.add(Ng(n, s, r, t)), e;
  });
}, Yg = (i, t, e, n, r) => {
  const s = new fe(), a = 0.035, o = r.geometryDetail > 0.75 ? 4.2 : 5.6, l = Math.max(7, Math.floor(t / o)), c = [-i * 0.42, 0, i * 0.42], h = new Wt(), u = new Ie(new pe(i, a, a), n.trim, l), f = new Ie(
    new pe(a, a, t),
    n.trim,
    c.length
  );
  for (let d = 0; d < l; d += 1) {
    const g = -1.4 - d * ((t - 2.8) / Math.max(1, l - 1));
    h.makeTranslation(0, e - a * 0.5 - 0.014, g), u.setMatrixAt(d, h);
  }
  return c.forEach((d, g) => {
    h.makeTranslation(d, e - a * 0.5 - 0.018, -t / 2), f.setMatrixAt(g, h);
  }), u.instanceMatrix.needsUpdate = !0, f.instanceMatrix.needsUpdate = !0, s.name = "ceiling-grid", s.add(f, u), s;
}, $g = (i, t, e, n) => {
  const r = new fe(), s = new pe(0.035, 0.035, t), a = new pe(0.035, e - 0.3, 0.035);
  [
    [-i / 2 + 0.08, e - 0.18, -t / 2],
    [i / 2 - 0.08, e - 0.18, -t / 2],
    [-i / 2 + 0.08, 0.88, -t / 2],
    [i / 2 - 0.08, 0.88, -t / 2]
  ].forEach(([h, u, f], d) => {
    const g = new Kt(s, n.led);
    g.position.set(h, u, f), g.name = `corridor-long-led-${d}`, r.add(g);
  });
  const l = new Kt(a, n.led), c = new Kt(a, n.led);
  return l.position.set(-i / 2 + 0.08, e / 2, -0.04), c.position.set(i / 2 - 0.08, e / 2, -0.04), r.add(l, c), r.name = "corridor-long-leds", r;
}, Zg = (i, t, e, n, r) => {
  const s = new fe(), a = Math.max(5, Math.round((r.geometryDetail > 0.75 ? 9 : 6) * (t / 52))), o = new Wt(), l = new Ie(new pe(i, 0.05, 0.045), n.trim, a), c = new Ie(new pe(0.07, e, 0.045), n.trim, a * 2), h = new Ie(new pe(0.028, e - 0.45, 0.028), n.led, a * 2);
  for (let u = 0; u < a; u += 1) {
    const f = -t * (u / Math.max(1, a - 1));
    o.makeTranslation(0, e - 0.08, f), l.setMatrixAt(u, o), o.makeTranslation(-i / 2 + 0.08, e / 2, f), c.setMatrixAt(u * 2, o), h.setMatrixAt(u * 2, o), o.makeTranslation(i / 2 - 0.08, e / 2, f), c.setMatrixAt(u * 2 + 1, o), h.setMatrixAt(u * 2 + 1, o);
  }
  return l.instanceMatrix.needsUpdate = !0, c.instanceMatrix.needsUpdate = !0, h.instanceMatrix.needsUpdate = !0, s.name = "corridor-structural-ribs", s.add(l, c, h), s;
}, Jg = (i, t, e, n, r) => {
  const s = new fe(), a = r.preset === "low" ? 1 : 2, o = Math.max(5, Math.round(t / 8)), l = a * o, c = new Ie(new Vr(0.105, 0.105, 0.035, 20), n.fixtureTrim, l), h = new Ie(new Vr(0.058, 0.058, 0.039, 16), n.fixtureCore, l), u = new Wt();
  return (a === 1 ? [0] : [-i * 0.28, i * 0.28]).forEach((d, g) => {
    for (let v = 0; v < o; v += 1) {
      const m = -2.6 - v * (t - 5.2) / Math.max(1, o - 1), p = g * o + v;
      u.makeTranslation(d, e - 0.08, m), c.setMatrixAt(p, u), u.makeTranslation(d, e - 0.102, m), h.setMatrixAt(p, u);
    }
  }), c.instanceMatrix.needsUpdate = !0, h.instanceMatrix.needsUpdate = !0, s.name = "ceiling-downlights", s.add(c, h), s;
}, Kg = (i) => {
  i && typeof i == "object" && "isTexture" in i && "dispose" in i && i.dispose();
}, il = (i) => {
  Object.values(i).forEach(Kg), i.dispose();
}, Cs = (i) => {
  const t = /* @__PURE__ */ new Set(), e = /* @__PURE__ */ new Set();
  i.traverse((n) => {
    const r = n;
    if (r.geometry && !t.has(r.geometry) && (r.geometry.dispose(), t.add(r.geometry)), Array.isArray(r.material)) {
      r.material.forEach((s) => {
        e.has(s) || (il(s), e.add(s));
      });
      return;
    }
    r.material && !e.has(r.material) && (il(r.material), e.add(r.material));
  });
}, Qe = (i, t, e) => Number.isFinite(i) ? Math.min(e, Math.max(t, i)) : t, Ps = (i, t, e) => i + (t - i) * e, jg = (i) => {
  const t = Qe(i, 0, 1);
  return t * t * (3 - 2 * t);
}, rl = (i, t, e) => ({
  x: Ps(i.x, t.x, e),
  y: Ps(i.y, t.y, e),
  z: Ps(i.z, t.z, e)
}), Qg = (i, t, e) => i.activeItemId === t.activeItemId || e < 0.5 ? i.activeItemId : t.activeItemId, t_ = (i, t) => {
  if (i.length === 0)
    throw new Error("Cannot resolve camera state without keyframes.");
  const e = Qe(t, 0, 1), n = i[0], r = i[i.length - 1];
  if (e <= n.progress)
    return {
      position: n.position,
      lookAt: n.lookAt,
      activeItemId: n.activeItemId
    };
  if (e >= r.progress)
    return {
      position: r.position,
      lookAt: r.lookAt,
      activeItemId: r.activeItemId
    };
  let s = n, a = r;
  for (let h = 0; h < i.length - 1; h += 1) {
    const u = i[h], f = i[h + 1];
    if (e >= u.progress && e <= f.progress) {
      s = u, a = f;
      break;
    }
  }
  const o = Math.max(1e-4, a.progress - s.progress), l = Qe((e - s.progress) / o, 0, 1), c = jg(l);
  return {
    position: rl(s.position, a.position, c),
    lookAt: rl(s.lookAt, a.lookAt, c),
    activeItemId: Qg(s, a, l)
  };
}, Lr = {
  low: {
    preset: "low",
    pixelRatioCap: 1,
    textureScale: 0.5,
    lightBudget: 1,
    shadows: !1,
    geometryDetail: 0.55
  },
  medium: {
    preset: "medium",
    pixelRatioCap: 1.25,
    textureScale: 0.75,
    lightBudget: 2,
    shadows: !1,
    geometryDetail: 0.75
  },
  high: {
    preset: "high",
    pixelRatioCap: 1.6,
    textureScale: 1,
    lightBudget: 3,
    shadows: !1,
    geometryDetail: 1
  },
  ultra: {
    preset: "ultra",
    pixelRatioCap: 2,
    textureScale: 1,
    lightBudget: 4,
    shadows: !0,
    geometryDetail: 1.2
  }
}, sl = () => ({
  mobile: window.innerWidth <= 820,
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  devicePixelRatio: window.devicePixelRatio,
  viewportWidth: window.innerWidth,
  viewportHeight: window.innerHeight
}), al = (i, t) => i !== "auto" ? Lr[i] : t.mobile || t.reducedMotion ? Lr.medium : t.devicePixelRatio > 1.6 || t.viewportWidth >= 1600 ? Lr.high : Lr.medium, ol = {
  ktx2: 0,
  webp: 1,
  jpg: 2,
  png: 3
}, e_ = (i, t) => i.format === "ktx2" ? t.ktx2 : i.format === "webp" ? t.webp : !0, ll = (i, t) => {
  if (!i.quality || i.quality === "fallback")
    return 10;
  const e = ["low", "medium", "high", "ultra"];
  return Math.abs(e.indexOf(i.quality) - e.indexOf(t));
}, n_ = (i, t, e) => {
  const n = i.filter((r) => e_(r, e));
  return n.length === 0 ? null : [...n].sort((r, s) => {
    const a = ll(r, t) - ll(s, t);
    return a !== 0 ? a : ol[r.format] - ol[s.format];
  })[0];
}, i_ = {
  ktx2: !1,
  webp: !0
}, r_ = (i) => {
  const t = i.split("?")[0].split(".").pop()?.toLowerCase();
  return t === "ktx2" || t === "webp" || t === "jpg" || t === "png" ? t : t === "jpeg" ? "jpg" : "webp";
};
class s_ {
  quality;
  assetBaseUrl;
  capabilities;
  textureLoader = new Jl();
  textures = /* @__PURE__ */ new Map();
  constructor(t) {
    this.quality = t.quality, this.assetBaseUrl = t.assetBaseUrl, this.capabilities = t.capabilities ?? i_;
  }
  async getTextureForItem(t) {
    const e = this.getTextureSources(t), n = n_(e, this.quality.preset, this.capabilities);
    return n ? this.loadTexture(n.src) : null;
  }
  dispose() {
    this.textures.forEach((t) => {
      t.then((e) => e.dispose());
    }), this.textures.clear();
  }
  getTextureSources(t) {
    return (t.appearance.media ?? []).flatMap((n) => n.sources && n.sources.length > 0 ? n.sources : [{
      src: n.src,
      format: n.format ?? r_(n.src),
      quality: n.quality,
      width: n.width,
      height: n.height
    }]);
  }
  loadTexture(t) {
    const e = this.resolveUrl(t), n = this.textures.get(e);
    if (n)
      return n;
    const r = this.textureLoader.loadAsync(e).then((s) => (s.colorSpace = Se, s.needsUpdate = !0, s));
    return this.textures.set(e, r), r;
  }
  resolveUrl(t) {
    return !this.assetBaseUrl || /^https?:\/\//.test(t) || t.startsWith("data:") || t.startsWith("/") ? t : `${this.assetBaseUrl.replace(/\/$/, "")}/${t.replace(/^\//, "")}`;
  }
}
class a_ {
  container;
  onRender;
  onResize;
  resizeObserver = null;
  intersectionObserver = null;
  frameId = null;
  visibleByIntersection = !0;
  visibleByDocument = !0;
  dirty = !1;
  disposed = !1;
  constructor(t) {
    this.container = t.container, this.onRender = t.onRender, this.onResize = t.onResize;
  }
  start() {
    if (this.disposed)
      throw new Error("RenderScheduler has been disposed.");
    this.visibleByDocument = document.visibilityState !== "hidden", document.addEventListener("visibilitychange", this.handleVisibilityChange), this.resizeObserver = new ResizeObserver(() => {
      this.onResize(), this.invalidate("resize");
    }), this.resizeObserver.observe(this.container), this.intersectionObserver = new IntersectionObserver(this.handleIntersection), this.intersectionObserver.observe(this.container);
  }
  invalidate(t) {
    this.disposed || (this.dirty = !0, !(!this.canRender() || this.frameId !== null) && (this.frameId = requestAnimationFrame(this.renderFrame)));
  }
  dispose() {
    this.disposed || (this.disposed = !0, this.resizeObserver?.disconnect(), this.intersectionObserver?.disconnect(), document.removeEventListener("visibilitychange", this.handleVisibilityChange), this.frameId !== null && (cancelAnimationFrame(this.frameId), this.frameId = null));
  }
  renderFrame = () => {
    this.frameId = null, this.canRender() && (this.onRender(), this.dirty = !1);
  };
  handleVisibilityChange = () => {
    this.visibleByDocument = document.visibilityState !== "hidden", this.canRender() && this.dirty && this.invalidate("document-visible");
  };
  handleIntersection = (t) => {
    const e = t[0];
    this.visibleByIntersection = e ? e.isIntersecting : !0, this.canRender() && this.dirty && this.invalidate("visibility-resume");
  };
  canRender() {
    return !this.disposed && this.visibleByDocument && this.visibleByIntersection;
  }
}
class o_ {
  unitPlane = new Je(1, 1);
  unitBox = new pe(1, 1, 1);
  basicMaterials = /* @__PURE__ */ new Map();
  standardMaterials = /* @__PURE__ */ new Map();
  glowMaterials = /* @__PURE__ */ new Map();
  getBasicSurface(t) {
    const e = `basic:${t}`, n = this.basicMaterials.get(e);
    if (n)
      return n;
    const r = new Re({
      color: new Ft(t),
      side: we,
      toneMapped: !1
    });
    return this.basicMaterials.set(e, r), r;
  }
  getStandardSurface(t, e, n) {
    const r = `standard:${t}:${e}:${n}`, s = this.standardMaterials.get(r);
    if (s)
      return s;
    const a = new Wn({
      color: t,
      roughness: e,
      metalness: n
    });
    return this.standardMaterials.set(r, a), a;
  }
  getGlow(t, e) {
    const n = `glow:${t}:${e}`, r = this.glowMaterials.get(n);
    if (r)
      return r;
    const s = new Re({
      color: t,
      transparent: !0,
      opacity: e,
      depthWrite: !1,
      side: we,
      toneMapped: !1
    });
    return this.glowMaterials.set(n, s), s;
  }
}
const l_ = ["low", "medium", "high", "ultra", "auto"], ic = ["low", "medium", "high", "ultra", "fallback"], cl = ["stone", "concrete", "wood", "metal", "glass"], c_ = ["left", "right", "center", "auto"], h_ = ["scroll", "manual"], rc = ["ktx2", "webp", "jpg", "png"], nr = (i) => !!i && typeof i == "object" && !Array.isArray(i), en = (i, t) => {
  const e = i[t];
  return nr(e) ? e : {};
}, Ke = (i, t) => {
  const e = i[t];
  return typeof e == "string" && e.trim().length > 0 ? e : void 0;
}, ce = (i, t, e, n, r) => {
  const s = i[t];
  return typeof s != "number" ? e : Qe(s, n, r);
}, u_ = (i, t, e) => {
  const n = i[t];
  return typeof n == "boolean" ? n : e;
}, _n = (i, t, e) => typeof i == "string" && t.includes(i) ? i : e, d_ = (i) => {
  const t = en(i, "materials");
  return {
    quality: _n(i.quality, l_, "auto"),
    atmosphere: Ke(i, "atmosphere") ?? "calm",
    materials: {
      primary: _n(t.primary, cl, "concrete"),
      accent: t.accent ? _n(t.accent, cl, "metal") : void 0
    }
  };
}, f_ = (i) => {
  const t = en(i, "bounds");
  return {
    type: Ke(i, "type") ?? "corridor",
    spacing: ce(i, "spacing", 7, 1, 40),
    scale: ce(i, "scale", 1, 0.1, 8),
    seed: Ke(i, "seed"),
    bounds: {
      width: ce(t, "width", void 0, 1, 40),
      height: ce(t, "height", void 0, 1, 20),
      depth: ce(t, "depth", void 0, 4, 400)
    }
  };
}, p_ = (i) => {
  const t = en(i, "camera");
  return {
    mode: _n(i.mode, h_, "scroll"),
    loop: u_(i, "loop", !1),
    smoothing: ce(i, "smoothing", 0.18, 0.04, 1),
    damping: ce(i, "damping", 0.86, 0.2, 0.98),
    camera: {
      height: ce(t, "height", void 0, 0.8, 4),
      fov: ce(t, "fov", void 0, 28, 82),
      lookAhead: ce(t, "lookAhead", void 0, 0.2, 12)
    }
  };
}, m_ = (i) => {
  const t = en(i, "offset");
  return {
    slot: ce(i, "slot", void 0, 0, 1e4),
    side: i.side ? _n(i.side, c_, "auto") : void 0,
    anchor: Ke(i, "anchor"),
    offset: {
      x: ce(t, "x", void 0, -20, 20),
      y: ce(t, "y", void 0, -20, 20),
      z: ce(t, "z", void 0, -40, 40)
    },
    scale: ce(i, "scale", void 0, 0.1, 8),
    priority: ce(i, "priority", void 0, -1e3, 1e3)
  };
}, g_ = (i) => {
  const t = i.size;
  return {
    variant: Ke(i, "variant"),
    material: Ke(i, "material"),
    size: t === "small" || t === "medium" || t === "large" || typeof t == "number" ? t : void 0,
    lighting: i.lighting === "none" || i.lighting === "subtle" || i.lighting === "featured" ? i.lighting : void 0,
    media: x_(i.media)
  };
}, __ = (i) => {
  if (!nr(i))
    return null;
  const t = Ke(i, "src");
  return t ? {
    src: t,
    format: _n(i.format, rc, "webp"),
    quality: _n(i.quality, ic, "fallback"),
    width: ce(i, "width", void 0, 1, 16384),
    height: ce(i, "height", void 0, 1, 16384)
  } : null;
}, v_ = (i) => {
  if (!nr(i))
    return null;
  const t = Ke(i, "src");
  if (!t)
    return null;
  const e = Array.isArray(i.sources) ? i.sources.map(__).filter((n) => n !== null) : void 0;
  return {
    src: t,
    type: i.type === "image" || i.type === "video" || i.type === "texture" ? i.type : void 0,
    format: i.format ? _n(i.format, rc, "webp") : void 0,
    quality: i.quality ? _n(i.quality, ic, "fallback") : void 0,
    sources: e,
    alt: Ke(i, "alt"),
    width: ce(i, "width", void 0, 1, 16384),
    height: ce(i, "height", void 0, 1, 16384)
  };
}, x_ = (i) => {
  if (!Array.isArray(i))
    return;
  const t = i.map(v_).filter((e) => e !== null);
  return t.length > 0 ? t : void 0;
}, M_ = (i, t) => {
  if (!nr(i))
    throw new Error(`GalleryItem at index ${t} must be an object.`);
  const e = Ke(i, "id"), n = Ke(i, "type");
  if (!e)
    throw new Error(`GalleryItem at index ${t} is missing a valid id.`);
  if (!n)
    throw new Error(`GalleryItem ${e} is missing a valid type.`);
  return {
    id: e,
    type: n,
    placement: m_(en(i, "placement")),
    appearance: g_(en(i, "appearance")),
    content: { ...en(i, "content") }
  };
}, S_ = (i) => {
  const t = /* @__PURE__ */ new Set();
  for (const e of i) {
    if (t.has(e.id))
      throw new Error(`Duplicate GalleryItem id: ${e.id}`);
    t.add(e.id);
  }
}, Gr = (i) => {
  if (!nr(i))
    throw new Error("GalleryProject must be an object.");
  const e = (Array.isArray(i.items) ? i.items : []).map(M_);
  return S_(e), {
    theme: d_(en(i, "theme")),
    layout: f_(en(i, "layout")),
    journey: p_(en(i, "journey")),
    items: e,
    __validated: !0
  };
};
class y_ {
  container;
  renderers;
  layouts;
  assetBaseUrl;
  project;
  quality = null;
  scene = null;
  camera = null;
  renderer = null;
  sceneRoot = null;
  assets = null;
  scheduler = null;
  keyframes = [];
  positionedItems = [];
  progress = 0;
  buildSerial = 0;
  bottomSheetState = "collapsed";
  disposed = !1;
  constructor(t) {
    this.container = t.container, this.renderers = t.renderers, this.layouts = t.layouts, this.assetBaseUrl = t.assetBaseUrl, this.project = Gr(t.project);
  }
  async init() {
    this.assertActive(), this.quality = al(this.project.theme.quality, sl()), this.scene = new Oh(), this.scene.background = new Ft("#28251f"), this.scene.fog = new Ca("#28251f", 30, 108), this.camera = new He(this.project.journey.camera?.fov ?? 52, 1, 0.1, 160), this.renderer = new pg({
      alpha: !0,
      antialias: this.quality.preset !== "low",
      powerPreference: "high-performance"
    }), this.renderer.outputColorSpace = Se, this.renderer.toneMapping = xl, this.renderer.toneMappingExposure = this.quality.preset === "low" ? 1.18 : 1.34, this.renderer.shadowMap.enabled = this.quality.shadows, this.renderer.shadowMap.type = _l, this.renderer.domElement.style.display = "block", this.renderer.domElement.style.width = "100%", this.renderer.domElement.style.height = "100%", this.container.appendChild(this.renderer.domElement), this.scheduler = new a_({
      container: this.container,
      onRender: this.renderFrame,
      onResize: this.resize
    }), this.scheduler.start(), await this.rebuildScene(), this.resize(), this.setProgress(0);
  }
  async updateProject(t) {
    this.assertActive(), this.project = Gr(t), this.quality = al(this.project.theme.quality, sl()), await this.rebuildScene(), this.resize(), this.setProgress(0);
  }
  applyJourneyState(t) {
    this.assertActive(), this.applyCameraState(t.camera);
  }
  setProgress(t) {
    this.assertActive(), this.progress = t;
    const e = this.getComposedCameraState(t);
    return this.applyCameraState(e), e;
  }
  setBottomSheetState(t) {
    this.assertActive(), this.bottomSheetState = t;
    const e = this.getComposedCameraState(this.progress);
    return this.applyCameraState(e), e;
  }
  invalidate(t) {
    this.assertActive(), this.scheduler?.invalidate(t);
  }
  dispose() {
    this.disposed || (this.disposed = !0, this.scheduler?.dispose(), this.sceneRoot && (Cs(this.sceneRoot), this.scene?.remove(this.sceneRoot)), this.assets?.dispose(), this.renderer?.dispose(), this.renderer?.domElement.parentElement === this.container && this.container.removeChild(this.renderer.domElement), this.scene = null, this.camera = null, this.renderer = null, this.sceneRoot = null, this.assets = null, this.scheduler = null, this.keyframes = [], this.positionedItems = [], this.bottomSheetState = "collapsed");
  }
  async rebuildScene() {
    if (!this.scene || !this.quality)
      return;
    const t = this.buildSerial + 1;
    this.buildSerial = t, this.sceneRoot && (Cs(this.sceneRoot), this.scene.remove(this.sceneRoot));
    const e = new fe(), n = new o_();
    this.assets?.dispose(), this.assets = new s_({
      quality: this.quality,
      assetBaseUrl: this.assetBaseUrl
    });
    const r = {
      viewportAspect: this.getViewportAspect(),
      qualityScale: this.quality.geometryDetail
    };
    if (this.positionedItems = this.layouts.get(this.project.layout.type).layout(this.project, this.project.layout, r), this.keyframes = Pg(this.positionedItems, {
      cameraHeight: this.project.journey.camera?.height ?? 1.7,
      lookAhead: this.project.journey.camera?.lookAhead ?? 2.2
    }), e.add(await qg(this.project.layout, this.quality)), (await Promise.all(this.positionedItems.map((a) => this.renderers.get(a.type).create(a, {
      quality: this.quality,
      resources: n,
      assets: this.assets,
      assetBaseUrl: this.assetBaseUrl
    })))).forEach((a) => e.add(a)), this.disposed || t !== this.buildSerial || !this.scene) {
      Cs(e);
      return;
    }
    this.sceneRoot = e, this.scene.add(e), this.invalidate("scene-rebuild");
  }
  applyCameraState(t) {
    this.camera && (this.camera.position.set(t.position.x, t.position.y, t.position.z), this.camera.lookAt(t.lookAt.x, t.lookAt.y, t.lookAt.z), this.invalidate("camera-state"));
  }
  getComposedCameraState(t) {
    const e = t_(this.keyframes, t), n = this.positionedItems.find((r) => r.id === e.activeItemId) ?? null;
    return Ig(e, n, this.bottomSheetState);
  }
  renderFrame = () => {
    !this.renderer || !this.scene || !this.camera || (this.resize(), this.renderer.render(this.scene, this.camera));
  };
  resize() {
    if (!this.renderer || !this.camera || !this.quality)
      return;
    const t = Math.max(1, this.container.clientWidth || window.innerWidth), e = Math.max(1, this.container.clientHeight || window.innerHeight);
    this.camera.aspect = t / e, this.camera.updateProjectionMatrix(), this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.quality.pixelRatioCap, 2)), this.renderer.setSize(t, e, !1);
  }
  getViewportAspect() {
    const t = Math.max(1, this.container.clientWidth || window.innerWidth), e = Math.max(1, this.container.clientHeight || window.innerHeight);
    return t / e;
  }
  assertActive() {
    if (this.disposed)
      throw new Error("GalleryEngine has been disposed.");
  }
}
const E_ = 1e-5, hl = 1e-6;
class T_ {
  element;
  onProgress;
  smoothing;
  damping;
  loop;
  sensitivity;
  progress;
  targetProgress;
  velocity = 0;
  frameId = null;
  activeTouchId = null;
  lastTouchY = null;
  running = !1;
  constructor(t) {
    this.element = t.element, this.onProgress = t.onProgress, this.sensitivity = Qe(t.sensitivity ?? 28e-5, 5e-5, 0.01), this.smoothing = Qe(t.smoothing ?? 0.18, 0.04, 1), this.damping = Qe(t.damping ?? 0.86, 0.2, 0.98), this.loop = t.loop ?? !1, this.progress = this.normalizeProgress(t.initialProgress ?? 0), this.targetProgress = this.progress;
  }
  start() {
    this.running || (this.running = !0, this.element.addEventListener("wheel", this.handleWheel, { passive: !1 }), this.element.addEventListener("touchstart", this.handleTouchStart, { passive: !0 }), this.element.addEventListener("touchmove", this.handleTouchMove, { passive: !1 }), this.element.addEventListener("touchend", this.handleTouchEnd, { passive: !0 }), this.element.addEventListener("touchcancel", this.handleTouchCancel, { passive: !0 }), this.emit());
  }
  setProgress(t) {
    this.progress = this.normalizeProgress(t), this.targetProgress = this.progress, this.velocity = 0, this.emit();
  }
  setSensitivity(t) {
    this.sensitivity = Qe(t, 5e-5, 0.01);
  }
  dispose() {
    this.running = !1, this.element.removeEventListener("wheel", this.handleWheel), this.element.removeEventListener("touchstart", this.handleTouchStart), this.element.removeEventListener("touchmove", this.handleTouchMove), this.element.removeEventListener("touchend", this.handleTouchEnd), this.element.removeEventListener("touchcancel", this.handleTouchCancel), this.frameId !== null && (cancelAnimationFrame(this.frameId), this.frameId = null);
  }
  handleWheel = (t) => {
    t.ctrlKey || (t.preventDefault(), this.velocity += this.normalizeWheelDelta(t) * this.sensitivity, this.requestTick());
  };
  handleTouchStart = (t) => {
    const e = t.touches[0];
    e && (this.activeTouchId = e.identifier, this.lastTouchY = e.clientY);
  };
  handleTouchMove = (t) => {
    if (this.lastTouchY === null)
      return;
    const e = this.getTrackedTouch(t.touches);
    if (!e)
      return;
    t.cancelable && t.preventDefault();
    const n = this.lastTouchY - e.clientY;
    this.lastTouchY = e.clientY, this.activeTouchId = e.identifier, this.velocity += this.normalizePixelDelta(n) * this.sensitivity, this.requestTick();
  };
  handleTouchEnd = (t) => {
    const e = this.getTrackedTouch(t.touches);
    this.activeTouchId = e?.identifier ?? null, this.lastTouchY = e?.clientY ?? null;
  };
  handleTouchCancel = () => {
    this.activeTouchId = null, this.lastTouchY = null;
  };
  tick = () => {
    this.frameId = null, this.running && (this.targetProgress = this.loop ? this.targetProgress + this.velocity : this.normalizeProgress(this.targetProgress + this.velocity), this.velocity *= this.damping, Math.abs(this.velocity) < E_ && (this.velocity = 0), this.progress += (this.targetProgress - this.progress) * this.smoothing, Math.abs(this.targetProgress - this.progress) < hl && (this.progress = this.targetProgress), this.emit(), (this.velocity !== 0 || Math.abs(this.targetProgress - this.progress) >= hl) && this.requestTick());
  };
  requestTick() {
    this.frameId !== null || !this.running || (this.frameId = requestAnimationFrame(this.tick));
  }
  emit() {
    this.onProgress(this.normalizeProgress(this.progress));
  }
  getTrackedTouch(t) {
    const e = Array.from(t);
    return e.length === 0 ? null : e.find((n) => n.identifier === this.activeTouchId) ?? e[0];
  }
  normalizeWheelDelta(t) {
    return t.deltaMode === WheelEvent.DOM_DELTA_LINE ? this.normalizePixelDelta(t.deltaY * 16) : t.deltaMode === WheelEvent.DOM_DELTA_PAGE ? this.normalizePixelDelta(t.deltaY * window.innerHeight * 0.85) : this.normalizePixelDelta(t.deltaY);
  }
  normalizePixelDelta(t) {
    if (!Number.isFinite(t))
      return 0;
    const e = t / 100, n = Math.abs(e), r = n <= 1 ? e : Math.sign(e) * (1 + Math.log10(Math.max(1, n)));
    return Qe(r, -4, 4);
  }
  normalizeProgress(t) {
    return Number.isFinite(t) ? this.loop ? (t % 1 + 1) % 1 : Qe(t, 0, 1) : 0;
  }
}
const ul = (i) => {
  if (i.length === 0)
    return [];
  const t = 1 / Math.max(1, i.length);
  return i.map((e, n) => ({
    itemId: e.id,
    sourceItemId: e.id.split("__loop_")[0],
    index: n,
    progress: Math.min(1, n * t + t * 0.62)
  }));
}, A_ = (i, t) => i.find((e) => e.itemId === t || e.sourceItemId === t)?.progress ?? null, dl = (i, t, e) => {
  if (i.length === 0)
    return null;
  const n = t ? i.findIndex((a) => a.itemId === t) : -1, r = e > 0 ? 0 : i.length - 1, s = n >= 0 ? n + e : r;
  return s < 0 || s >= i.length ? null : i[s];
};
class b_ {
  state = "collapsed";
  item = null;
  listeners = /* @__PURE__ */ new Set();
  setActiveItem(t) {
    this.item !== t && (this.item = t, this.notify());
  }
  setState(t) {
    this.state !== t && (this.state = t, this.notify());
  }
  expand() {
    this.setState(this.state === "collapsed" ? "half" : "full");
  }
  collapse() {
    this.setState(this.state === "full" ? "half" : "collapsed");
  }
  getModel() {
    return {
      state: this.state,
      activeItemId: this.item?.id ?? null,
      item: this.item,
      content: this.item ? er(this.item) : null
    };
  }
  subscribe(t) {
    return this.listeners.add(t), t(this.getModel()), () => {
      this.listeners.delete(t);
    };
  }
  notify() {
    const t = this.getModel();
    this.listeners.forEach((e) => e(t));
  }
}
class w_ {
  renderers;
  layouts;
  constructor(t) {
    this.renderers = t.renderers, this.layouts = t.layouts;
  }
  async mount(t) {
    let e = Gr(t.project), n = ul(e.items), r = null, s = {
      progress: 0,
      activeItemId: null
    };
    const a = /* @__PURE__ */ new Set(), o = new b_(), l = new y_({
      container: t.container,
      project: e,
      renderers: this.renderers,
      layouts: this.layouts,
      assetBaseUrl: t.assetBaseUrl
    });
    await l.init();
    const c = (d) => {
      const g = l.setProgress(d);
      s = {
        progress: d,
        activeItemId: g.activeItemId
      };
      const v = g.activeItemId?.split("__loop_")[0] ?? null;
      o.setActiveItem(
        e.items.find((m) => m.id === v) ?? null
      ), a.forEach((m) => m(s));
    }, h = (d) => {
      r?.setProgress(d), r || c(d);
    }, u = (d) => d.journey.mode !== "scroll" || t.autoStartJourney === !1 ? null : new T_({
      element: t.scrollElement ?? t.container,
      smoothing: d.journey.smoothing,
      damping: d.journey.damping,
      loop: d.journey.loop,
      onProgress: c
    }), f = (d) => {
      r?.dispose(), r = u(d), r?.start();
    };
    return f(e), c(0), {
      updateProject: async (d) => {
        e = Gr(d), n = ul(e.items), await l.updateProject(e), f(e), c(0);
      },
      setProgress: h,
      focusItem: (d) => {
        const g = A_(n, d);
        return g === null ? !1 : (h(g), !0);
      },
      nextItem: () => {
        const d = dl(n, o.getModel().activeItemId, 1);
        return d ? (h(d.progress), !0) : !1;
      },
      previousItem: () => {
        const d = dl(n, o.getModel().activeItemId, -1);
        return d ? (h(d.progress), !0) : !1;
      },
      setBottomSheetState: (d) => {
        o.setState(d), l.setBottomSheetState(d);
      },
      getState: () => s,
      subscribeState: (d) => (a.add(d), d(s), () => {
        a.delete(d);
      }),
      getContentSurface: () => o.getModel(),
      subscribeContentSurface: (d) => o.subscribe(d),
      dispose: () => {
        r?.dispose(), a.clear(), l.dispose();
      }
    };
  }
}
const R_ = () => new w_({
  renderers: wg(),
  layouts: Sc()
}), L_ = async (i) => R_().mount({
  container: i.container,
  project: i.project,
  assetBaseUrl: i.assetBaseUrl,
  scrollElement: i.scrollElement,
  autoStartJourney: i.autoStartJourney
});
export {
  b_ as B,
  ml as C,
  y_ as G,
  Mc as I,
  T_ as J,
  fl as R,
  P_ as a,
  vc as b,
  C_ as c,
  a_ as d,
  w_ as e,
  Pg as f,
  ul as g,
  Ig as h,
  Ng as i,
  Sc as j,
  wg as k,
  R_ as l,
  L_ as m,
  pc as n,
  fc as o,
  dl as p,
  t_ as q,
  sl as r,
  A_ as s,
  Ug as t,
  al as u,
  Gr as v,
  n_ as w
};
//# sourceMappingURL=mountGalleryRuntime-BTC_DqIO.js.map
