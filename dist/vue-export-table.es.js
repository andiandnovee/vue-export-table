import { ref as E, computed as v, watch as S, createElementBlock as u, openBlock as d, createElementVNode as t, toDisplayString as c, Fragment as b, renderList as h, renderSlot as D } from "vue";
import { utils as _, writeFile as F } from "xlsx";
import I from "jspdf";
import L from "jspdf-autotable";
const $ = (m, e) => {
  const a = m.__vccOpts || m;
  for (const [r, p] of e)
    a[r] = p;
  return a;
}, O = { class: "flex justify-between items-center mb-4" }, B = { class: "text-lg font-semibold" }, M = { class: "overflow-x-auto rounded border" }, T = { class: "min-w-full text-sm text-gray-800" }, V = { class: "bg-gray-100" }, A = { class: "text-xs italic text-gray-400" }, N = { class: "mt-4 flex justify-between items-center" }, R = { class: "text-sm text-gray-600" }, U = { class: "flex items-center gap-2" }, H = ["disabled"], Y = ["disabled"], q = {
  __name: "ExportTable",
  props: {
    title: String,
    headers: Array,
    items: Array,
    search: String,
    perPage: { type: Number, default: 10 }
  },
  setup(m) {
    const e = m, a = E(1), r = v(() => {
      if (!e.search) return e.items;
      const o = e.search.toLowerCase();
      return e.items.filter(
        (n) => Object.values(n).some(
          (s) => typeof s == "string" && s.toLowerCase().includes(o)
        )
      );
    });
    console.log("✅ headers:", e.headers), console.log("✅ items:", e.items);
    const p = v(() => Math.ceil(r.value.length / e.perPage)), x = v(() => (a.value - 1) * e.perPage), f = v(() => Math.min(a.value * e.perPage, r.value.length)), g = v(
      () => r.value.slice(x.value, f.value)
    );
    S(() => [e.search, e.items], () => {
      a.value = 1;
    });
    function k() {
      a.value > 1 && a.value--;
    }
    function y() {
      a.value < p.value && a.value++;
    }
    function w() {
      const o = [e.headers.map((l) => l.text)];
      r.value.forEach((l) => {
        o.push(e.headers.map((C) => l[C.value]));
      });
      const n = o.map((l) => l.join(",")).join(`
`), s = new Blob([n], { type: "text/csv" }), i = document.createElement("a");
      i.href = URL.createObjectURL(s), i.download = `${e.title || "data"}.csv`, i.click();
    }
    function P() {
      const o = r.value.map(
        (i) => Object.fromEntries(e.headers.map((l) => [l.text, i[l.value]]))
      ), n = _.json_to_sheet(o), s = _.book_new();
      _.book_append_sheet(s, n, "Sheet1"), F(s, `${e.title || "data"}.xlsx`);
    }
    function j() {
      const o = new I();
      o.text(e.title || "Data", 10, 10), L(o, {
        startY: 20,
        head: [e.headers.map((n) => n.text)],
        body: r.value.map((n) => e.headers.map((s) => n[s.value]))
      }), o.save(`${e.title || "data"}.pdf`);
    }
    return (o, n) => (d(), u("div", null, [
      t("div", O, [
        t("h2", B, c(e.title), 1),
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
      t("div", M, [
        t("table", T, [
          t("thead", V, [
            t("tr", null, [
              (d(!0), u(b, null, h(e.headers, (s) => (d(), u("th", {
                key: s.value,
                class: "text-left p-2"
              }, c(s.text), 1))), 128))
            ])
          ]),
          t("tbody", null, [
            (d(!0), u(b, null, h(g.value, (s, i) => (d(), u("tr", {
              key: s.id || i
            }, [
              (d(!0), u(b, null, h(e.headers, (l) => (d(), u("td", {
                key: l.value,
                class: "border-t p-2"
              }, [
                D(o.$slots, `cell-${l.value}`, { row: s }, () => [
                  t("span", A, "(" + c(l.value) + ")", 1)
                ], !0)
              ]))), 128))
            ]))), 128))
          ])
        ])
      ]),
      t("div", N, [
        t("div", R, " Menampilkan " + c(x.value + 1) + "–" + c(f.value) + " dari " + c(r.value.length), 1),
        t("div", U, [
          t("button", {
            onClick: k,
            disabled: a.value === 1,
            class: "btn-nav"
          }, "<", 8, H),
          t("span", null, "Hal. " + c(a.value) + " / " + c(p.value), 1),
          t("button", {
            onClick: y,
            disabled: a.value === p.value,
            class: "btn-nav"
          }, ">", 8, Y)
        ])
      ])
    ]));
  }
}, Q = /* @__PURE__ */ $(q, [["__scopeId", "data-v-71cb5f16"]]);
export {
  Q as default
};
