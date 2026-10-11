// 零复发线第 5 局（第 36 天）：零回来。回城（零）与巡逻由 runner 做（第 36 天零已在场）。
// 零回来（zero.return）→ "第二次回来的路，比第一次短多了。"→ 零的钟（停过一阵的灰）→ 对玩家那句 → 被救的同伴各一句
// → 零把玩家那句话还给玩家 → 说明之后的巡逻规则。endHook: none。
(function () {
  const G = window.Game;
  const { esc } = G.dom;
  const talk = (o) => G.screens.talk(o);

  const session5 = [
    () => {
      G.fx.play("zero.return", {});
      return talk({ speaker: "narrator", lines: G.t("zero5.back") });
    },
    () => talk({ speaker: "zero", lines: G.t("zero5.shorter") }),
    () => talk({ speaker: "narrator", lines: G.t("zero5.clock"), extraHtml: `<div class="zeroclock" aria-hidden="true"><i class="run"></i><i class="paused"></i><i class="run"></i></div>` }),
    () => talk({ speaker: "zero", lines: [G.t("zero5.notErased"), G.t("zero5.forYou")] }),
    // 只有真被救回来的同伴说话
    async () => {
      const w = G.t("zero5.welcome") || {};
      for (const id of G.state.get().rescued || []) if (w[id]) await talk({ speaker: id, lines: w[id] });
    },
    async () => {
      const line = G.state.get().player.rebuttalLine;
      if (line) await talk({ speaker: "zero", lines: G.t("zero5.giveBack"), extraHtml: `<p class="rebuttal said">${esc(line)}</p>` });
    },
    () => {
      G.state.update((s) => (s.sessions.zero5 = { back: true }));
      return talk({ speaker: "zero", lines: G.t("zero5.ownPatrol") });
    },
  ];

  G.levels.zero = G.levels.zero || {};
  G.levels.zero.session5 = session5;
})();
