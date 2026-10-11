// 宝箱魔第 2 局：看穿。两屏：先看自己（数字、时间线、第一句），再听魔鬼讲规则、零点名机制。
(function () {
  const G = window.Game;
  const { esc, fmt, paras, btn } = G.dom;

  function analyze(record) {
    const rec = record || { plan: null, taps: [], startedAt: 0, endedAt: 0, stoppedByUser: false, maxed: false };
    const taps = rec.taps || [];
    const countBig = (reason) => taps.filter((t) => t.reason === reason && t.kind === "big").length;
    return {
      rec,
      taps,
      n: taps.length,
      plan: rec.plan,
      secs: rec.endedAt && rec.startedAt ? Math.max(1, Math.round((rec.endedAt - rec.startedAt) / 1000)) : 0,
      hits: {
        luck: countBig("luck"),
        pause: countBig("pause"),
        plan: countBig("plan"),
        near: taps.filter((t) => t.kind === "near").length,
        random: countBig("luck") + countBig("pause") + countBig("plan"),
      },
    };
  }

  function screenSelf(a) {
    const { rec, taps, n, plan, secs } = a;
    const dots = taps
      .map((t, i) => {
        const cls = ["dot", t.kind, t.reason !== "random" && t.kind === "big" ? "rigged" : "", plan && i + 1 === plan && n > plan ? "plan-edge" : ""].join(" ");
        return `<span class="${cls}"></span>`;
      })
      .join("");
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("chest.xray.eyebrow"))}</p>
          <h1>${fmt(G.t("chest.xray.title"))}</h1>
          <p>${fmt(G.f("verdict", { plan, n, stoppedByUser: rec.stoppedByUser, maxed: rec.maxed }))}</p>
        </div>
        <div class="stats">
          <div class="stat ${plan && n > plan ? "over" : ""}"><b>${n}</b><span>${fmt(G.t("chest.xray.stat.actual"))}</span></div>
          <div class="stat"><b>${plan == null ? "–" : plan}</b><span>${fmt(G.t("chest.xray.stat.plan"))}</span></div>
          <div class="stat"><b>${esc(G.f("chest.xray.secs", { secs }))}</b><span>${fmt(G.t("chest.xray.stat.time"))}</span></div>
        </div>
        ${n ? `<div class="stack">
          <p class="eyebrow">${fmt(G.t("chest.xray.timeline"))}</p>
          <div class="timeline">${dots}</div>
          <div class="legend">
            <span><i style="background:var(--line)"></i>${fmt(G.t("chest.xray.legend.small"))}</span>
            <span><i style="background:var(--gold)"></i>${fmt(G.t("chest.xray.legend.big"))}</span>
            <span><i style="border:2px solid var(--warn)"></i>${fmt(G.t("chest.xray.legend.near"))}</span>
            <span><i style="border:2px solid var(--xray)"></i>${fmt(G.t("chest.xray.legend.rigged"))}</span>
          </div>
        </div>` : ""}
        ${btn("next", G.t("talk.next"))}
      `, { xray: true, name: "xray" });
      G.router.$("#next").addEventListener("click", resolve);
    });
  }

  function screenRules(a) {
    const rules = G.t("chest.rules");
    const ruleHtml = (Array.isArray(rules) ? rules : [])
      .map((r) => {
        const c = a.hits[r.rule] || 0;
        const hit = r.rule === "random" ? true : c > 0;
        return `<li class="rule ${hit ? "hit" : "miss"}"><span class="tag">${esc(G.f("ruleHit", { ruleId: r.rule, count: c }))}</span><b>${esc(r.title)}</b><p>${esc(r.body)}</p></li>`;
      })
      .join("");
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("chest.xray.rulesTitle"))}</p>
          <p class="hint">${fmt(G.t("chest.xray.intro"))}</p>
          <ul class="rules">${ruleHtml}</ul>
        </div>
        <div class="explain talk zero">
          <p class="eyebrow">${fmt(G.t("chest.xray.nameTitle"))}</p>
          ${paras(G.t("chest.xray.name"))}
        </div>
        ${btn("next", G.t("talk.next"))}
      `, { xray: true, name: "xray-rules" });
      G.router.$("#next").addEventListener("click", resolve);
    });
  }

  async function xray(record) {
    const a = analyze(record);
    await screenSelf(a);
    await screenRules(a);
  }

  G.levels.chest = G.levels.chest || {};
  G.levels.chest.xray = xray;
})();
