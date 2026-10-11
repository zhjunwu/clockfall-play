// 巡逻日（约 2 分钟）：回城 → 巡逻报告 → 清小喽啰（可跳过）→ 被救者近况 → 在场角色一句话。
// 没有游戏魔、没有悬念、不留钩子。每天最多一次。
(function () {
  const G = window.Game;
  const { esc, fmt, paras, btn } = G.dom;
  const talk = (o) => G.screens.talk(o);
  const MINIONS = ["redDot", "autoplay", "streak"];

  // 在场角色：零 / 同伴 / 无人（零失踪与最后几天由 schedule 阶段决定；第一季前 25 天零都在）
  function whoIsPresent(day) {
    const s = G.state.get();
    if (day >= 37) return null;
    if (day >= 26 && day < 36) return (s.rescued && s.rescued[0]) || null;
    return "zero";
  }

  // 从一组里抽一句，避免和上次同一组抽到的重复（引擎规则：随机抽取不连续重复）
  function pick(arr, key) {
    if (!Array.isArray(arr) || !arr.length) return arr || null;
    if (arr.length === 1) return arr[0];
    const s = G.state.get();
    const last = (s.flags.lastPick || {})[key];
    let i;
    do i = Math.floor(Math.random() * arr.length); while (i === last);
    G.state.update((x) => (x.flags.lastPick = Object.assign(x.flags.lastPick || {}, { [key]: i })));
    return arr[i];
  }

  // 小喽啰：按住定住，再点出名字。认错只是跑掉。两只。
  function minionFight(id) {
    return new Promise((resolve) => {
      const order = [...MINIONS].sort(() => Math.random() - 0.5);
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("minion.eyebrow"))}</p>
          <div class="minion ${esc(id)}" id="minion" aria-hidden="true"><i></i></div>
          <p class="hint" id="hint">${fmt(G.t("minion.holdFirst"))}</p>
          <div class="surf" id="surf"><div class="bar" id="bar"></div><span class="label">${fmt(G.t(G.hold.useAlt() ? "hold.altPrompt" : "hold.prompt"))}</span></div>
          <div class="stack" id="names" hidden>
            <p class="eyebrow">${fmt(G.t("minion.whichOne"))}</p>
            ${order.map((m) => `<button type="button" class="btn-choice" data-m="${m}">${fmt(G.t("minion." + m))}</button>`).join("")}
          </div>
        </div>
      `, { name: "minion" });
      const $ = G.router.$;
      G.hold.attach($("#surf"), {
        onProgress: (p) => $("#bar").style.setProperty("--p", Math.round(p * 100)),
        onHold: () => {
          $("#minion").classList.add("frozen");
          $("#surf").hidden = true;
          $("#names").hidden = false;
        },
      });
      G.router.$$("#names button").forEach((b) =>
        b.addEventListener("click", () => {
          const ok = b.dataset.m === id;
          $("#names").hidden = true;
          $("#minion").classList.add(ok ? "killed" : "escaped");
          G.fx.play(ok ? "minion.kill" : "minion.escape", { id });
          $("#hint").textContent = G.text(ok ? "minion.killed" : "minion.escaped");
          G.events.log("minion", { correct: ok, option: id });
          setTimeout(() => resolve(ok), 700);
        })
      );
    });
  }

  function minionsIntro() {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk zero">
          ${paras(G.t("minion.intro"))}
        </div>
        ${btn("go", G.t("talk.next"))}
        ${btn("skip", G.t("minion.skip"), "btn-quiet")}
      `, { name: "minion-intro" });
      G.router.$("#go").addEventListener("click", () => resolve(true));
      G.router.$("#skip").addEventListener("click", () => resolve(false));
    });
  }

  async function run() {
    const day = G.clock.touch();
    const who = whoIsPresent(day);
    const s = G.state.get();
    const idx = s.calendar.completedSessions.length + 1;
    const delta = s.ledger.clockTicks - (s.sessions.lastSeenTicks || 0);

    // 回城
    if (who === "zero") await talk({ speaker: "zero", eyebrow: G.t("city.return.eyebrow"), lines: G.f("zero.returnLine", { session: idx, clockDelta: delta }) });
    else if (who) await talk({ speaker: "baker", eyebrow: G.t("city.return.eyebrow"), lines: pick(G.f("companion.returnLine", { who }), "return." + who) });
    else await talk({ speaker: "narrator", eyebrow: G.t("city.return.eyebrow"), lines: G.t("alone.patrolLine") });

    // 巡逻报告
    await G.patrol.report({ detail: idx >= 3 });
    await G.patrol.weekly();
    G.state.update((x) => (x.sessions.lastSeenTicks = x.ledger.clockTicks));

    // 小喽啰（可跳过）
    if (await minionsIntro()) {
      const two = [...MINIONS].sort(() => Math.random() - 0.5).slice(0, 2);
      for (const m of two) await minionFight(m);
      G.events.log("minions", { skipped: false });
    } else G.events.log("minions", { skipped: true });

    // 被救者近况（独立随机句，不连载）
    const rescued = s.rescued || [];
    for (const r of rescued) {
      const line = pick(G.t("rescued." + r), "news." + r);
      if (line) await talk({ speaker: r, lines: line });
    }

    // 结束：在场角色一句话；无人时只有旁白
    if (who === "zero") await talk({ speaker: "zero", lines: G.t("zero.patrolEnd"), nextLabel: G.t("talk.leaveNow") });
    else if (who) await talk({ speaker: "baker", lines: G.f("companion.patrolEnd", { who }), nextLabel: G.t("talk.leaveNow") });
    else await talk({ speaker: "narrator", lines: G.t("alone.patrolLine"), nextLabel: G.t("talk.leaveNow") });

    G.state.update((x) => (x.calendar.patrolDoneOnDay = Object.assign(x.calendar.patrolDoneOnDay || {}, { [day]: true })));
    G.events.log("patrolday.end", { day });
    G.app.city();
  }

  function doneToday() {
    const s = G.state.get();
    return !!(s.calendar.patrolDoneOnDay && s.calendar.patrolDoneOnDay[G.clock.today()]);
  }

  G.patrolday = { run, doneToday, whoIsPresent };
})();
