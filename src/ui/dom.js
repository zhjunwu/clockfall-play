// 渲染小工具：转义、术语占位、按钮。
(function () {
  const G = window.Game;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }

  // 把内容里的 {term:xxx} 替换成可点开的术语标记。内容已经是可信文本，但仍转义。
  function fmt(s) {
    if (s && s.missing) return `<span class="missing">${esc(s.text)}</span>`;
    return esc(s).replace(/\{term:([a-zA-Z0-9_]+)\}/g, (m, id) => {
      const t = G.term(id);
      if (!t) return `<span class="missing">${esc(G.i18n.BUILTIN[G.i18n.lang].missing)}</span>`;
      return `<button type="button" class="term" data-term="${esc(id)}" aria-expanded="false">${esc(t.teen || t.name)}</button>`;
    });
  }

  // 点术语：在它所在段落下方展开定义；出处默认折叠。全局只绑一次。
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest(".term");
    if (!b) return;
    const open = b.getAttribute("aria-expanded") === "true";
    document.querySelectorAll(".termbox").forEach((x) => x.remove());
    document.querySelectorAll(".term[aria-expanded=true]").forEach((x) => x.setAttribute("aria-expanded", "false"));
    if (open) return;
    const t = G.term(b.dataset.term);
    if (!t) return;
    b.setAttribute("aria-expanded", "true");
    const box = document.createElement("div");
    box.className = "termbox";
    box.innerHTML = `<b>${esc(t.name)}</b><p>${esc(t.definition || "")}</p>${t.source ? `<details><summary>${esc(G.text("term.sourceLabel"))}</summary><p>${esc(t.source)}</p></details>` : ""}`;
    const host = b.closest("p") || b.parentElement;
    host.insertAdjacentElement("afterend", box);
  });

  // 段落：字符串或字符串数组
  function paras(v, cls) {
    const arr = Array.isArray(v) ? v : [v];
    return arr.map((p) => `<p class="${cls || ""}">${fmt(p)}</p>`).join("");
  }

  function btn(id, label, cls, attrs) {
    return `<button type="button" class="${cls || "btn-main"}" id="${esc(id)}" ${attrs || ""}>${fmt(label)}</button>`;
  }

  G.dom = { esc, fmt, paras, btn };
})();
