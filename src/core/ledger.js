// 觉察账本与大钟。现实部分每天最多计 2 次；大钟永不倒走，100 格封顶。
// gamedemon.js 不得引用本模块（底线：不惩罚诚实）；它通过 runner 传入的回调推钟。
(function () {
  const G = window.Game;
  const REAL = ["noticed", "later", "nowRemember", "notAppear"];

  function tick(kind) {
    const cfg = G.config;
    const amount = cfg.tick[kind] || 0;
    const day = G.clock.today();
    let applied = 0;
    G.state.update((s) => {
      if (REAL.includes(kind)) {
        const n = s.ledger.dailyTickCount[day] || 0;
        if (n >= cfg.dailyRealTickLimit) return;
        s.ledger.dailyTickCount[day] = n + 1;
      }
      const before = s.ledger.clockTicks;
      s.ledger.clockTicks = Math.min(cfg.clockMax, before + amount);
      applied = s.ledger.clockTicks - before;
    });
    if (applied) {
      G.events.log("tick", { tick: applied, option: kind });
      const now = G.state.get().ledger.clockTicks;
      G.fx.play("clock.tick", { from: now - applied, to: now, kind });
    }
    return applied;
  }

  // 巡逻报告（M2 起使用）：记录一次"停"
  function recordStop({ cueId, kind, what, whenLabel, doing }) {
    const day = G.clock.today();
    G.state.update((s) => s.ledger.stops.push({ day, cueId: cueId || null, kind, what: what || null, whenLabel: whenLabel || null, doing: doing || null }));
    G.events.log("patrol", { option: kind });
    return tick(kind);
  }

  function recordWeeklyScreen(week, minutes) {
    G.state.update((s) => {
      s.ledger.weeklyScreen.push({ week, minutes });
      if (!s.flags.weeklyAsked.includes(week)) s.flags.weeklyAsked.push(week);
    });
  }

  G.ledger = { tick, recordStop, recordWeeklyScreen };
})();
