// 巡逻报告：上次之后现实中有没有"停"过一次。四个选项都有效；只奖励觉察，不奖励结果。
// 主线局（第 2 局起）与巡逻日共用。
(function () {
  const G = window.Game;
  // 说话的是此刻在场的角色：零 / 同伴 / 无人（旁白）。第 26～35 天零不在（design.md 4.4）
  function presentSpeaker() {
    const who = G.patrolday ? G.patrolday.whoIsPresent(G.clock.today()) : "zero";
    return who || "narrator";
  }
  const { esc, fmt, paras, btn } = G.dom;

  function ask() {
    return new Promise((resolve) => {
      const opts = G.t("patrol.options");
      G.router.show(`
        <div class="stack talk ${presentSpeaker()}">
          <p class="eyebrow">${fmt(G.t("patrol.eyebrow"))}</p>
          ${paras(G.t("patrol.question"))}
          <div class="stack" id="opts">
            ${(Array.isArray(opts) ? opts : []).map((o) => `<button type="button" class="btn-choice" data-id="${esc(o.id)}">${esc(o.label)}</button>`).join("")}
          </div>
        </div>
      `, { name: "patrol" });
      G.router.$$("#opts button").forEach((b) => b.addEventListener("click", () => resolve(b.dataset.id)));
    });
  }

  function whichCue() {
    const cues = G.map.cues();
    if (!cues.length) return Promise.resolve(null);
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk ${presentSpeaker()}">
          <p>${fmt(G.t("patrol.whichCue"))}</p>
          <div class="chips" id="cues">
            ${cues.map((c) => `<button type="button" class="chip" data-id="${esc(c.id)}">${esc(G.f("patrol.cueLabel", c))}</button>`).join("")}
            <button type="button" class="chip custom" data-id="">${fmt(G.t("patrol.otherCue"))}</button>
          </div>
        </div>
      `, { name: "patrol-cue" });
      G.router.$$("#cues button").forEach((b) => b.addEventListener("click", () => resolve(b.dataset.id || null)));
    });
  }

  function stoppedQ() {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk ${presentSpeaker()}">
          <p>${fmt(G.t("patrol.stoppedQ"))}</p>
          <div class="row">
            ${btn("yes", G.t("patrol.stoppedYes"), "btn-choice")}
            ${btn("no", G.t("patrol.stoppedNo"), "btn-choice")}
          </div>
        </div>
      `, { name: "patrol-stopped" });
      G.router.$("#yes").addEventListener("click", () => resolve(true));
      G.router.$("#no").addEventListener("click", () => resolve(false));
    });
  }

  function reply(kind, stopped, canMore) {
    return new Promise((resolve) => {
      const lines = [G.t("patrol.reply." + kind)];
      if (kind !== "notAppear" && stopped != null) lines.push(G.t(stopped ? "patrol.stoppedReplyYes" : "patrol.stoppedReplyNo"));
      G.router.show(`
        <div class="stack talk ${presentSpeaker()}">
          ${paras(lines)}
        </div>
        ${canMore ? btn("more", G.t("patrol.reportAnother"), "btn-quiet") : ""}
        ${btn("done", G.t("patrol.done"))}
      `, { name: "patrol-reply" });
      const m = G.router.$("#more");
      if (m) m.addEventListener("click", () => resolve("more"));
      G.router.$("#done").addEventListener("click", () => resolve("done"));
    });
  }

  // 细节追问（第 3 局起，只对"当时就注意到了"）：大概几点、当时在做什么。都可跳过。
  // 选项是 { label, phrase }：label 显示在按钮上，phrase 是嵌进魔鬼台词里的说法（可为空）
  function detail(field) {
    const raw = G.t("patrol." + field + "Options");
    const opts = (Array.isArray(raw) ? raw : []).map((o) => (typeof o === "string" ? { label: o, phrase: o } : o));
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk ${presentSpeaker()}">
          <p>${fmt(G.t("patrol." + field))}</p>
          <div class="chips" id="chips">
            ${opts.map((o, i) => `<button type="button" class="chip" data-i="${i}">${esc(o.label)}</button>`).join("")}
          </div>
        </div>
        ${btn("skip", G.t("patrol.detailSkip"), "btn-quiet")}
      `, { name: "patrol-" + field });
      G.router.$$("#chips .chip").forEach((c) => c.addEventListener("click", () => resolve(opts[Number(c.dataset.i)].phrase || null)));
      G.router.$("#skip").addEventListener("click", () => resolve(null));
    });
  }

  // 一次完整的巡逻报告，可"再报一次"直到当天计钟上限。返回报告次数。
  async function report(opts) {
    opts = opts || {};
    let count = 0;
    for (;;) {
      const kind = await ask();
      let cueId = null, stopped = null, whenLabel = null, doing = null;
      if (kind !== "notAppear") cueId = await whichCue();
      // 只在"当时就注意到了"之后才问有没有先按住；事后想起来的人当时不可能按住，再问就像查岗
      if (kind === "noticed") {
        stopped = await stoppedQ();
        if (opts.detail) {
          whenLabel = await detail("detailWhen");
          doing = await detail("detailWhat");
        }
      }
      G.ledger.recordStop({ cueId, kind, what: stopped == null ? null : stopped ? "held" : "tapped", whenLabel, doing });
      count++;
      const day = G.clock.today();
      const used = G.state.get().ledger.dailyTickCount[day] || 0;
      const canMore = kind !== "notAppear" && used < G.config.dailyRealTickLimit;
      const r = await reply(kind, stopped, canMore);
      if (r !== "more") break;
    }
    return count;
  }

  // 周屏幕时间：从第 2 周起，每周第一次打开问一次（第 2～6 周），可跳过；跳过也算问过。不填不提醒。
  function weeklyDue() {
    const c = G.config;
    const w = G.clock.weekOf();
    const s = G.state.get();
    return w >= c.weeklyAskFromWeek && w <= c.weeklyAskToWeek && !s.flags.weeklyAsked.includes(w);
  }

  function weekly() {
    if (!weeklyDue()) return Promise.resolve(false);
    const w = G.clock.weekOf();
    const how = G.t("patrol.howToFind");
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk ${presentSpeaker()}">
          ${paras(G.t("patrol.weeklyScreenTime"))}
          <ul class="hint howto">${(Array.isArray(how) ? how : [how]).map((h) => `<li>${fmt(h)}</li>`).join("")}</ul>
          <div class="row">
            <input class="own" id="hours" type="number" min="0" max="200" step="0.5" inputmode="decimal" placeholder="0">
            <span>${fmt(G.t("patrol.weeklyUnit"))}</span>
          </div>
        </div>
        ${btn("save", G.t("patrol.weeklySave"))}
        ${btn("skip", G.t("patrol.weeklySkip"), "btn-quiet")}
      `, { name: "weekly" });
      G.router.$("#save").addEventListener("click", () => {
        const v = parseFloat(G.router.$("#hours").value);
        if (Number.isFinite(v) && v >= 0) {
          G.ledger.recordWeeklyScreen(w, Math.round(v * 60));
          G.events.log("weekly", { option: "saved" });
        } else G.state.update((s) => s.flags.weeklyAsked.push(w));
        resolve(true);
      });
      G.router.$("#skip").addEventListener("click", () => {
        G.state.update((s) => s.flags.weeklyAsked.push(w));
        G.events.log("weekly", { skipped: true });
        resolve(true);
      });
    });
  }

  G.patrol = { report, weekly, weeklyDue };
})();
