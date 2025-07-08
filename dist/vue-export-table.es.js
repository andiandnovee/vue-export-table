import { ref as A, computed as f, watch as D, createElementBlock as p, openBlock as v, createElementVNode as r, toDisplayString as i, normalizeStyle as F, Fragment as x, renderList as y, mergeProps as $, renderSlot as I, createTextVNode as L } from "vue";
import { utils as _, writeFile as T } from "xlsx";
async function z(u, t, l) {
  const c = (await import("jspdf")).default, d = (await import("jspdf-autotable")).default, b = new c();
  b.text(u || "Data", 10, 10), d(b, {
    startY: 20,
    head: [t.map((m) => m.text)],
    body: l.map((m) => t.map((h) => m[h.value]))
  }), b.save(`${u || "data"}.pdf`);
}
const V = (u, t) => {
  const l = u.__vccOpts || u;
  for (const [c, d] of t)
    l[c] = d;
  return l;
}, B = { class: "flex justify-between items-center mb-4" }, M = { class: "text-lg font-semibold" }, N = { class: "min-w-full text-sm text-gray-800" }, R = { class: "bg-gray-100" }, U = { class: "mt-4 flex justify-between items-center" }, H = { class: "text-sm text-gray-600" }, Y = { class: "flex items-center gap-2" }, q = ["disabled"], G = ["disabled"], J = {
  __name: "ExportTable",
  props: {
    title: String,
    headers: Array,
    items: Array,
    search: String,
    perPage: { type: Number, default: 10 }
  },
  setup(u) {
    const t = u, l = A(1), c = f(() => {
      if (!t.search) return t.items;
      const o = t.search.toLowerCase();
      return t.items.filter(
        (n) => Object.values(n).some(
          (e) => typeof e == "string" && e.toLowerCase().includes(o)
        )
      );
    }), d = f(
      () => Math.ceil(c.value.length / t.perPage)
    ), b = f(() => (l.value - 1) * t.perPage), m = f(
      () => Math.min(l.value * t.perPage, c.value.length)
    ), h = f(
      () => c.value.slice(b.value, m.value)
    );
    D(
      () => [t.search, t.items],
      () => {
        l.value = 1;
      }
    );
    function k(o, n) {
      if (!o.sticky) return {};
      const e = o.stickyPosition || "left", s = e === "right" ? "z-30" : "z-20", a = e === "left" ? w.value[n] || 0 : P.value.find(([g]) => g === n)?.[1] || 0;
      return {
        class: `sticky bg-white ${s}`,
        style: `${e}: ${a}px; background: white;`
      };
    }
    const w = f(() => {
      let o = 0;
      return !t.headers || !Array.isArray(t.headers) ? [] : t.headers.map((n) => {
        if (n.sticky && n.stickyPosition === "left") {
          const e = o;
          return o += 150, e;
        }
        return null;
      });
    }), P = f(() => {
      let o = 0;
      const n = t.headers, e = [];
      if (!n || !Array.isArray(n)) return [];
      for (let s = n.length - 1; s >= 0; s--) {
        const a = n[s];
        a.sticky && a.stickyPosition === "right" && (e.unshift([s, o]), o += 150);
      }
      return e;
    });
    function j() {
      l.value > 1 && l.value--;
    }
    function E() {
      l.value < d.value && l.value++;
    }
    function S() {
      const o = [t.headers.map((a) => a.text)];
      c.value.forEach((a) => {
        o.push(t.headers.map((g) => a[g.value]));
      });
      const n = o.map((a) => a.join(",")).join(`
`), e = new Blob([n], { type: "text/csv" }), s = document.createElement("a");
      s.href = URL.createObjectURL(e), s.download = `${t.title || "data"}.csv`, s.click();
    }
    function C() {
      const o = c.value.map(
        (s) => Object.fromEntries(t.headers.map((a) => [a.text, s[a.value]]))
      ), n = _.json_to_sheet(o), e = _.book_new();
      _.book_append_sheet(e, n, "Sheet1"), T(e, `${t.title || "data"}.xlsx`);
    }
    function O() {
      z(t.title, t.headers, c.value);
    }
    return (o, n) => (v(), p("div", null, [
      r("div", B, [
        r("h2", M, i(t.title), 1),
        r("div", { class: "flex gap-2" }, [
          r("button", {
            onClick: S,
            class: "btn-export bg-emerald-500"
          }, " CSV "),
          r("button", {
            onClick: C,
            class: "btn-export bg-indigo-500"
          }, " Excel "),
          r("button", {
            onClick: O,
            class: "btn-export bg-rose-500"
          }, "PDF")
        ])
      ]),
      r("div", {
        class: "overflow-x-auto relative rounded border",
        style: F({
          ...Object.fromEntries(
            (w.value.value || []).map((e, s) => [
              `--offset-left-${s}`,
              `${e}px`
            ])
          ),
          ...Object.fromEntries(
            (P.value.value || []).map(([e, s]) => [
              `--offset-right-${e}`,
              `${s}px`
            ])
          )
        })
      }, [
        r("table", N, [
          r("thead", R, [
            r("tr", null, [
              (v(!0), p(x, null, y(t.headers, (e, s) => (v(), p("th", $({
                key: e.value
              }, { ref_for: !0 }, k(e, s), {
                class: ["text-left p-2", e.class]
              }), i(e.text), 17))), 128))
            ])
          ]),
          r("tbody", null, [
            (v(!0), p(x, null, y(h.value, (e, s) => (v(), p("tr", {
              key: e.id || s,
              class: "odd:bg-white even:bg-gray-50 hover:bg-gray-100"
            }, [
              (v(!0), p(x, null, y(t.headers, (a, g) => (v(), p("td", $({
                key: a.value
              }, { ref_for: !0 }, k(a, g), {
                class: ["border px-2 py-1 whitespace-nowrap", a.class]
              }), [
                I(o.$slots, `cell-${a.value}`, { row: e }, () => [
                  L(i(e[a.value]), 1)
                ], !0)
              ], 16))), 128))
            ]))), 128))
          ])
        ])
      ], 4),
      r("div", U, [
        r("div", H, " Menampilkan " + i(b.value + 1) + "–" + i(m.value) + " dari " + i(c.value.length), 1),
        r("div", Y, [
          r("button", {
            onClick: j,
            disabled: l.value === 1,
            class: "btn-nav"
          }, " < ", 8, q),
          r("span", null, "Hal. " + i(l.value) + " / " + i(d.value), 1),
          r("button", {
            onClick: E,
            disabled: l.value === d.value,
            class: "btn-nav"
          }, " > ", 8, G)
        ])
      ])
    ]));
  }
}, W = /* @__PURE__ */ V(J, [["__scopeId", "data-v-8b5fd7bc"]]);
export {
  W as default
};
