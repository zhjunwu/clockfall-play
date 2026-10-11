// 开场故事：第一次打开时，选完语言、零的通知之前播一次；设置里可重看（Mark_V052、Mary_V044）。
// 玩家点一下才翻页（不自动翻：自动前进是夜枭的招）；"跳过"一直在。没有倒计时、没有下一页的预告。
// 画面由 Victoria 的表现层接管：每页 .prologue-art[data-art]，翻页时发 prologue.page { i, art }。
(function () {
  const G = window.Game;
  const { esc, fmt, paras, btn } = G.dom;

  function seen() {
    return !!G.state.get().flags.prologueSeen;
  }

  // 返回 Promise：读完或跳过后 resolve。opts.replay：从设置里重看（不改"已看过"之外的任何东西）。
  function play(opts) {
    opts = opts || {};
    const pages = G.t("prologue.pages");
    const list = Array.isArray(pages) ? pages : [];
    return new Promise((resolve) => {
      let i = 0;
      const finish = (how) => {
        G.state.update((s) => (s.flags.prologueSeen = true));
        G.events.log("prologue", { option: how, count: i + 1 });
        resolve();
      };
      function show() {
        const p = list[i] || { lines: [] };
        const last = i === list.length - 1;
        G.router.show(`
          <div class="prologue${p.flag ? " flagpage" : ""}" data-page="${i}">
            <div class="prologue-top">${last ? "" : btn("skip", G.t("prologue.skip"), "btn-quiet")}</div>
            <div class="prologue-art" data-art="${esc(p.art || "")}" aria-hidden="true"></div>
            <div class="prologue-text">${paras(p.lines)}</div>
            ${btn("next", G.t(last ? "prologue.enter" : "prologue.next"), "btn-main")}
          </div>
        `, { name: "prologue" });
        G.fx.play("prologue.page", { i, art: p.art || "" });
        G.router.$("#next").addEventListener("click", () => {
          if (last) return finish(opts.replay ? "replayDone" : "done");
          i++;
          show();
        });
        const sk = G.router.$("#skip");
        if (sk) sk.addEventListener("click", () => finish(opts.replay ? "replaySkip" : "skip"));
      }
      if (!list.length) return finish("empty");
      show();
    });
  }

  G.prologue = { play, seen };
})();
