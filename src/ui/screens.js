// 通用屏幕：一段对话（逐段显示，点继续）、一句话加按钮。
(function () {
  const G = window.Game;
  const { fmt, paras, btn } = G.dom;

  // 对话屏：speaker 是 CSS 类名（zero / chest / demon / narrator），lines 是字符串或数组。
  // 返回 Promise，玩家点 nextLabel 后 resolve。
  function talk({ speaker, eyebrow, lines, nextLabel, xray, extraHtml }) {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk ${speaker || "narrator"}">
          ${eyebrow ? `<p class="eyebrow">${fmt(eyebrow)}</p>` : ""}
          ${paras(lines)}
          ${extraHtml || ""}
        </div>
        ${btn("next", nextLabel || G.t("talk.next"))}
      `, { xray: !!xray, name: "talk" });
      G.router.$("#next").addEventListener("click", resolve);
    });
  }

  G.screens = { talk };
})();
