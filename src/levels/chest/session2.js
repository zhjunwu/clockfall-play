// 宝箱魔第 2 局：看穿 + 修炼（第 3 天）。节拍见 docs/helper/Mary_V003.md 1.3。
// 回城与巡逻报告由 runner 做；这里从"你的钟"开始。结尾钩子：进度钩（地图上的暗影只差一点就亮）。
(function () {
  const G = window.Game;
  const talk = (o) => G.screens.talk(o);

  const session2 = [
    () => talk({ speaker: "zero", lines: G.t("zero.yourClock") }),
    (ctx) => {
      const s = G.state.get();
      ctx.record = s.sessions.chest1 && s.sessions.chest1.record;
      return G.levels.chest.xray(ctx.record);
    },
    async (ctx) => {
      ctx.training = await G.levels.chest.training();
      G.state.update((s) => (s.sessions.chest2 = Object.assign(s.sessions.chest2 || {}, { training: ctx.training })));
    },
    () => talk({ speaker: "zero", lines: G.t("zero.stopTask") }),
    // 悬念：进度钩。三盏灯亮了两盏（三局），面包师还在宝箱后面。runner 随后亮牌 flag.progress。
    () =>
      talk({
        speaker: "narrator",
        lines: G.t("chest.progressCliff"),
        nextLabel: G.t("talk.silence"),
        extraHtml: `<div class="lamps" aria-hidden="true"><i class="lit"></i><i class="lit"></i><i></i></div>`,
      }),
  ];

  G.levels.chest = G.levels.chest || {};
  G.levels.chest.session2 = session2;
})();
