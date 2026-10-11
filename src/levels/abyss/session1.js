// 无底渊第 1 局：被偷（第 17 天）。回城与通用巡逻由 runner 做。
// 回城 → 长廊小游戏 + 估计对照 → 无底渊现形 → 地图补"刷的时候"（一次性邀请）→ 现实任务 → 预告（endHook: escalation，亮牌 flag.escalationAbyss）。
(function () {
  const G = window.Game;
  const talk = (o) => G.screens.talk(o);

  const session1 = [
    () => talk({ speaker: "narrator", lines: G.t("abyss.cityIntro") }),
    () => talk({ speaker: "zero", lines: G.t("abyss.zeroIntro") }),
    async (ctx) => {
      ctx.record = await G.levels.abyss.minigame();
      G.state.update((s) => (s.sessions.abyss1 = Object.assign(s.sessions.abyss1 || {}, { record: ctx.record })));
    },
    () => talk({ speaker: "narrator", lines: G.t("abyss.endNotWall") }),
    () => {
      G.fx.play("demon.appear", { who: "abyss" });
      return talk({ speaker: "abyss", lines: G.t("abyss.boast") });
    },
    () => talk({ speaker: "zero", lines: G.t("abyss.zeroAfter") }),
    // 地图：一次性邀请补一条"刷的时候"的线索；地图里已有刷类 App 的线索就跳过
    async () => {
      const apps = G.t("abyss.feedApps");
      const has = G.map.cues().some((c) => Array.isArray(apps) && apps.includes(c.app));
      if (has || G.state.get().flags.cueInviteSent.abyss) return;
      G.state.update((s) => (s.flags.cueInviteSent.abyss = true));
      await talk({ speaker: "zero", lines: G.t("abyss.mapAsk") });
      // 预填：零按时段猜的那一条 + "刷动态"，直接到汇总屏，玩家改或确认（同夜枭第 1 局）
      const pre = G.t("abyss.cuePrefill");
      const prefill = Object.assign({}, G.map.guess() || {}, pre && typeof pre === "object" ? pre : {});
      const r = await G.mapform.ask({ intro: false, allowSkip: true, prefill, startAtSummary: true });
      if (r.cue) {
        G.map.add(r.cue);
        await talk({ speaker: "zero", lines: G.t("abyss.mapDone") });
      }
      await G.safety.maybeShow("zero");
    },
    () => talk({ speaker: "zero", lines: G.t("abyss.task") }),
    // 预告：无底渊许诺"下次更多"。runner 随后亮牌（加码）。
    () => talk({ speaker: "abyss", lines: G.t("abyss.teaser"), nextLabel: G.t("talk.silence") }),
  ];

  G.levels.abyss = G.levels.abyss || {};
  G.levels.abyss.session1 = session1;
})();
