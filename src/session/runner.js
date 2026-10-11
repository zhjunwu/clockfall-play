// 一局的驱动：主线节拍 → 悬念亮牌 → 最后一战 → 回城。
// 回城与巡逻报告从第 2 局起（M2）。中途关闭：phase 'main' 不算完成；phase 'endfight' 算离开（app.js 处理）。
(function () {
  const G = window.Game;

  async function start(session) {
    const beats = G.schedule.beatsOf(session);
    if (!beats) return G.app.city();
    const idx = G.schedule.list.findIndex((s) => s.id === session.id) + 1;
    G.state.update((s) => (s.inProgress = { sessionId: session.id, phase: "main", startedAt: Date.now() }));
    G.events.log("session.start", { sessionId: session.id });

    const ctx = { session, index: idx };

    // 回城 + 巡逻报告（第 1 局没有：还没有线索）
    if (idx > 1) {
      const st0 = G.state.get();
      const before = st0.ledger.clockTicks;
      const prevTicks = st0.sessions.lastSeenTicks || 0;
      // 零不在的日子（第 26～35 天）由同伴回城，没有同伴时是旁白
      const who = G.patrolday ? G.patrolday.whoIsPresent(G.clock.today()) : "zero";
      if (who === "zero") {
        await G.screens.talk({ speaker: "zero", eyebrow: G.t("city.return.eyebrow"), lines: G.f("zero.returnLine", { session: idx, clockDelta: before - prevTicks }) });
      } else {
        const ls = G.f("companion.returnLine", { who });
        await G.screens.talk({ speaker: who || "narrator", eyebrow: G.t("city.return.eyebrow"), lines: Array.isArray(ls) ? ls[Math.floor(Math.random() * ls.length)] : ls });
      }
      // 周屏幕时间要问的那一局不再追问"几点、在做什么"，免得一局里问太多
      // 本局自己追问细节的（patrolDetail: false）也不问
      await G.patrol.report({ detail: idx >= 3 && session.patrolDetail !== false && !G.patrol.weeklyDue() });
      await G.patrol.weekly();
      G.state.update((s) => (s.sessions.lastSeenTicks = s.ledger.clockTicks));
    }

    for (const beat of beats) await beat(ctx);

    // 没有最后一战的局（第 40 天总结：它自己的第 7 页就是"最后一环"）
    if (session.noEndfight) {
      G.clock.markSessionDone(session.id);
      G.events.log("session.end", { sessionId: session.id, choice: "leave" });
      G.state.update((s) => (s.inProgress = null));
      return G.app.city();
    }

    // 悬念亮牌，然后进入最后一战
    G.state.update((s) => (s.inProgress = { sessionId: session.id, phase: "endfight", startedAt: Date.now() }));
    if (session.endHook && session.endHook !== "none") await G.flags.show(session.endHook, { quiet: !!session.quietFlag, textId: session.flagId });

    const st = G.state.get();
    const prev = st.sessions[session.id] && st.sessions[session.id].exit;
    const result = await G.gamedemon.run({
      session,
      sessionIndex: idx,
      endHook: session.endHook,
      first: idx === 1,
      player: { firstHoldStreak: st.player.firstHoldStreak, autoStop: st.player.autoStop, lostAutoStop: !!st.player.lostAutoStop },
      late: G.clock.isLateNight(),
      record: ctx.record,
      training: ctx.training,
      battle: ctx.battle,
      lastExit: prev,
      onLeave: (choice) => G.ledger.tick(choice === "noUrge" ? "noUrge" : "leave"),
    });

    G.state.update((s) => {
      s.sessions[session.id] = Object.assign(s.sessions[session.id] || {}, { exit: result.choice, endedAt: Date.now() });
    });
    G.clock.markSessionDone(session.id);
    G.events.log("session.end", { sessionId: session.id, choice: result.choice });
    // 深夜结束时不说"今天就到这里"，让玩家看完就关
    G.app.city({ done: !G.clock.isLateNight() });
  }

  G.session = { start };
})();
