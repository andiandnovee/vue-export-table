import { ref as E, computed as x, watch as S, createElementBlock as d, openBlock as p, createElementVNode as t, toDisplayString as r, Fragment as h, renderList as f, renderSlot as D } from "vue";
import { utils as g, writeFile as F } from "xlsx";
async function I(c, e, s) {
  const l = (await import("jspdf")).default, i = (await import("jspdf-autotable")).default, v = new l();
  v.text(c || "Data", 10, 10), i(v, {
    startY: 20,
    head: [e.map((m) => m.text)],
    body: s.map((m) => e.map((_) => m[_.value]))
  }), v.save(`${c || "data"}.pdf`);
}
const L = (c, e) => {
  const s = c.__vccOpts || c;
  for (const [l, i] of e)
    s[l] = i;
  return s;
}, $ = { class: "flex justify-between items-center mb-4" }, O = { class: "text-lg font-semibold" }, T = { class: "overflow-x-auto rounded border" }, B = { class: "min-w-full text-sm text-gray-800" }, M = { class: "bg-gray-100" }, V = { class: "text-xs italic text-gray-400" }, A = { class: "mt-4 flex justify-between items-center" }, N = { class: "text-sm text-gray-600" }, R = { class: "flex items-center gap-2" }, U = ["disabled"], H = ["disabled"], Y = {
  __name: "ExportTable",
  props: {
    title: String,
    headers: Array,
    items: Array,
    search: String,
    perPage: { type: Number, default: 10 }
  },
  setup(c) {
    const e = c, s = E(1), l = x(() => {
      if (!e.search) return e.items;
      const n = e.search.toLowerCase();
      return e.items.filter(
        (b) => Object.values(b).some(
          (a) => typeof a == "string" && a.toLowerCase().includes(n)
        )
      );
    });
    console.log("✅ headers:", e.headers), console.log("✅ items:", e.items);
    const i = x(() => Math.ceil(l.value.length / e.perPage)), v = x(() => (s.value - 1) * e.perPage), m = x(() => Math.min(s.value * e.perPage, l.value.length)), _ = x(
      () => l.value.slice(v.value, m.value)
    );
    S(() => [e.search, e.items], () => {
      s.value = 1;
    });
    function k() {
      s.value > 1 && s.value--;
    }
    function y() {
      s.value < i.value && s.value++;
    }
    function w() {
      const n = [e.headers.map((o) => o.text)];
      l.value.forEach((o) => {
        n.push(e.headers.map((C) => o[C.value]));
      });
      const b = n.map((o) => o.join(",")).join(`
`), a = new Blob([b], { type: "text/csv" }), u = document.createElement("a");
      u.href = URL.createObjectURL(a), u.download = `${e.title || "data"}.csv`, u.click();
    }
    function P() {
      const n = l.value.map(
        (u) => Object.fromEntries(e.headers.map((o) => [o.text, u[o.value]]))
      ), b = g.json_to_sheet(n), a = g.book_new();
      g.book_append_sheet(a, b, "Sheet1"), F(a, `${e.title || "data"}.xlsx`);
    }
    function j() {
      I(e.title, e.headers, l.value);
    }
    return (n, b) => (p(), d("div", null, [
      t("div", $, [
        t("h2", O, r(e.title), 1),
        t("div", { class: "flex gap-2" }, [
          t("button", {
            onClick: w,
            class: "btn-export bg-emerald-500"
          }, "CSV"),
          t("button", {
            onClick: P,
            class: "btn-export bg-indigo-500"
          }, "Excel"),
          t("button", {
            onClick: j,
            class: "btn-export bg-rose-500"
          }, "PDF")
        ])
      ]),
      t("div", T, [
        t("table", B, [
          t("thead", M, [
            t("tr", null, [
              (p(!0), d(h, null, f(e.headers, (a) => (p(), d("th", {
                key: a.value,
                class: "text-left p-2"
              }, r(a.text), 1))), 128))
            ])
          ]),
          t("tbody", null, [
            (p(!0), d(h, null, f(_.value, (a, u) => (p(), d("tr", {
              key: a.id || u
            }, [
              (p(!0), d(h, null, f(e.headers, (o) => (p(), d("td", {
                key: o.value,
                class: "border-t p-2"
              }, [
                D(n.$slots, `cell-${o.value}`, { row: a }, () => [
                  t("span", V, "(" + r(o.value) + ")", 1)
                ], !0)
              ]))), 128))
            ]))), 128))
          ])
        ])
      ]),
      t("div", A, [
        t("div", N, " Menampilkan " + r(v.value + 1) + "–" + r(m.value) + " dari " + r(l.value.length), 1),
        t("div", R, [
          t("button", {
            onClick: k,
            disabled: s.value === 1,
            class: "btn-nav"
          }, "<", 8, U),
          t("span", null, "Hal. " + r(s.value) + " / " + r(i.value), 1),
          t("button", {
            onClick: y,
            disabled: s.value === i.value,
            class: "btn-nav"
          }, ">", 8, H)
        ])
      ])
    ]));
  }
}, G = /* @__PURE__ */ L(Y, [["__scopeId", "data-v-805c95d7"]]);
export {
  G as default
};
