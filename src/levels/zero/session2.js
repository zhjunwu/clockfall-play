// 零复发线第 2 局（第 28 天）：零的小红点（静止）→ 认出是零的 → 零的地图（只有一条）→ 同伴讲那一晚 → 标出最早的一格 → 钟楼顶上的红光。
// 回城（同伴）与巡逻由 runner 做。endHook: cliffhanger，专用亮牌 flag.cliffhangerZero。
(function () {
  const G = window.Game;
  const { esc, fmt, btn } = G.dom;
  const talk = (o) => G.screens.talk(o);
  const who = () => (G.patrolday ? G.patrolday.whoIsPresent(G.clock.today()) : null) || "narrator";

  function choose(q, options, name, extraHtml) {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk ${esc(who())}">
          ${extraHtml || ""}
          <p>${fmt(q)}</p>
          <div class="stack" id="opts">${options.map((o) => `<button type="button" class="btn-choice" data-id="${esc(o.id)}">${esc(o.label)}</button>`).join("")}</div>
        </div>
      `, { name });
      G.router.$$("#opts button").forEach((b) => b.addEventListener("click", () => resolve(b.dataset.id)));
    });
  }

  function mapCard() {
    const cells = G.t("zero2.mapCells");
    return `<div class="zeromap" aria-label="${esc(G.text("zero2.mapTitle"))}">
      <p class="eyebrow">${fmt(G.t("zero2.mapTitle"))}</p>
      ${(Array.isArray(cells) ? cells : []).map((c) => `<p class="zcell"><b>${esc(c.label)}</b><span>${esc(c.value)}</span></p>`).join("")}
      <p class="znote">${fmt(G.t("zero2.mapNote"))}</p>
    </div>`;
  }

  const session2 = [
    () => {
      G.fx.play("zero.dot", { still: true });
      return talk({ speaker: "narrator", lines: G.t("zero2.dot"), extraHtml: `<div class="zerodot" aria-hidden="true"><i></i></div>` });
    },
    // 认：直到认出是零的为止；认错只说"再看看那条尾巴。"
    async (ctx) => {
      const opts = G.t("zero2.options");
      let misses = 0;
      for (;;) {
        const id = await choose(G.t("zero2.recognizeQ"), Array.isArray(opts) ? opts : [], "zero2-recognize", `<div class="zerodot" aria-hidden="true"><i></i></div>`);
        if (id === "zero") break;
        misses++;
        await talk({ speaker: who(), lines: G.t("zero2.lookAgain") });
      }
      ctx.misses = misses;
      G.fx.play("zero.relapse", {});
      await talk({ speaker: who(), lines: G.t("zero2.right") });
    },
    () => talk({ speaker: "narrator", lines: G.t("zero2.foundMap"), extraHtml: mapCard() }),
    () => talk({ speaker: who(), lines: G.t("zero2.howItHappened"), extraHtml: mapCard() }),
    // 标出最早的一格：哪一格都对，没有标准答案
    async (ctx) => {
      const cells = G.t("zero2.mapCells");
      const opts = (Array.isArray(cells) ? cells : []).map((c) => ({ id: c.id, label: `${c.label}：${c.value}` }));
      ctx.earliest = await choose(G.t("zero2.earliestQ"), opts, "zero2-earliest", mapCard());
      G.events.log("zero2.earliest", { option: ctx.earliest });
      G.state.update((s) => (s.sessions.zero2 = { earliest: ctx.earliest, misses: ctx.misses }));
      await talk({ speaker: who(), lines: G.t("zero2.earliestDone") });
    },
    // 钟楼顶上的红光；runner 随后亮牌（悬念，专用文字）
    () => {
      G.fx.play("zero.towerLight", {});
      return talk({ speaker: "narrator", lines: G.t("zero2.tower"), nextLabel: G.t("talk.silence") });
    },
  ];

  G.levels.zero = G.levels.zero || {};
  G.levels.zero.session2 = session2;
})();
