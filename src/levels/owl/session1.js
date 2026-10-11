// 夜枭第 1 局：被偷（第 8 天）。回城与巡逻报告由 runner 做。
// 钟楼灯亮 → 零两句 → "两天一夜" → 夜枭只说前半句 → 地图补夜里的线索 + 睡眠格 → 现实任务只记录 → 悬念（cliffhanger）
(function () {
  const G = window.Game;
  const { esc, fmt, paras, btn } = G.dom;
  const talk = (o) => G.screens.talk(o);

  // 睡眠格：打算几点睡 / 昨晚实际几点放下。多次选"几乎没睡"计入安全网。
  function sleepForm() {
    const opts = G.t("map.timeOptions");
    const list = Array.isArray(opts) ? opts : [];
    const row = (field) => `
      <fieldset class="mapfield" data-field="${field}">
        <legend>${fmt(G.t("map." + field))}</legend>
        <div class="chips">${list.map((o) => `<button type="button" class="chip" data-v="${esc(o)}" aria-pressed="false">${esc(o)}</button>`).join("")}</div>
      </fieldset>`;
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("map.title"))}</p>
          ${row("bedtimePlanned")}
          ${row("phoneDownActual")}
        </div>
        ${btn("done", G.t("map.done"), "btn-main", "disabled")}
        ${btn("skip", G.t("map.skip"), "btn-quiet")}
      `, { name: "owl-sleep" });
      const picked = {};
      G.router.$$(".mapfield").forEach((fs) =>
        fs.querySelectorAll(".chip").forEach((c) =>
          c.addEventListener("click", () => {
            fs.querySelectorAll(".chip").forEach((x) => x.setAttribute("aria-pressed", "false"));
            c.setAttribute("aria-pressed", "true");
            picked[fs.dataset.field] = c.dataset.v;
            G.router.$("#done").disabled = !(picked.bedtimePlanned && picked.phoneDownActual);
          })
        )
      );
      G.router.$("#done").addEventListener("click", () => resolve(picked));
      G.router.$("#skip").addEventListener("click", () => resolve(null));
    });
  }

  const session1 = [
    () => talk({ speaker: "narrator", lines: G.t("owl.towerLit") }),
    () => talk({ speaker: "zero", lines: G.t("owl.zeroIntro") }),
    async (ctx) => {
      ctx.record = await G.levels.owl.minigame();
      G.state.update((s) => (s.sessions.owl1 = Object.assign(s.sessions.owl1 || {}, { record: ctx.record })));
    },
    () => talk({ speaker: "owl", lines: G.t("owl.revealFirstHalf"), extraHtml: `<p class="gloat">${fmt(G.t("owl.revealPause"))}</p>` }),
    // 地图：一次性邀请补一条夜里的线索（不追问），然后睡眠格
    async () => {
      await talk({ speaker: "zero", lines: G.t("owl.mapAsk") });
      if (!G.state.get().flags.cueInviteSent.owl) {
        G.state.update((s) => (s.flags.cueInviteSent.owl = true));
        const pre = G.t("owl.cuePrefill");
        await G.mapform.ask({ intro: false, allowSkip: true, prefill: pre && !pre.missing ? pre : {}, startAtSummary: true }).then((r) => r.cue && G.map.add(r.cue));
      }
      const sleep = await sleepForm();
      if (sleep) {
        G.state.update((s) => (s.map.sleep = Object.assign(s.map.sleep || {}, { planned: sleep.bedtimePlanned, actual: sleep.phoneDownActual, day: G.clock.today() })));
        const list = G.t("map.timeOptions");
        const almostNone = Array.isArray(list) ? list[list.length - 2] : null; // "几乎没睡"是倒数第二项
        if (sleep.phoneDownActual === almostNone) G.safety.bump("sleep");
        G.events.log("sleepform", { option: "filled" });
      } else G.events.log("sleepform", { skipped: true });
      await talk({ speaker: "zero", lines: G.t("owl.mapDone") });
      await G.safety.maybeShow("zero");
    },
    () => talk({ speaker: "zero", lines: G.t("owl.observeTask") }),
    () => talk({ speaker: "narrator", lines: G.t("owl.cliff"), nextLabel: G.t("talk.silence") }),
  ];

  G.levels.owl = G.levels.owl || {};
  G.levels.owl.session1 = session1;
})();
