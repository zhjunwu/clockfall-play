// 宝箱魔第 3 局：决战 + 救人（第 6 天）。回城与巡逻报告（含细节追问）由 runner 做。
// 决战 → 面包师的梦境 → 集市复苏 → 夜枭预告（endHook: cliffhanger）
(function () {
  const G = window.Game;
  const { fmt } = G.dom;
  const talk = (o) => G.screens.talk(o);

  const session3 = [
    async (ctx) => {
      ctx.battle = await G.levels.chest.battle(ctx);
      G.state.update((s) => (s.sessions.chest3 = Object.assign(s.sessions.chest3 || {}, { battle: ctx.battle })));
    },
    async (ctx) => {
      const s = G.state.get();
      ctx.dream = await G.levels.chest.dream(s.sessions.chest1 && s.sessions.chest1.record);
    },
    async () => {
      G.fx.play("district.revive", { district: "market", state: 2 });
      await talk({
        speaker: "narrator",
        lines: [].concat(G.t("market.revived"), G.t("market.companion")),
        extraHtml: `<div class="lamps" aria-hidden="true"><i class="lit"></i><i class="lit"></i><i class="lit"></i></div>`,
      });
      // 救完人、灯亮了，再告诉玩家他变成了谁：打败第一个魔鬼 → 猎魔人·一
      await G.titles.awardAndShow("hunter1");
    },
    // 预告：钟楼夜里灯亮着。runner 随后亮牌 cliffhanger。
    () => talk({ speaker: "narrator", lines: G.t("teaser.owl"), nextLabel: G.t("talk.silence") }),
  ];

  G.levels.chest = G.levels.chest || {};
  G.levels.chest.session3 = session3;
})();
