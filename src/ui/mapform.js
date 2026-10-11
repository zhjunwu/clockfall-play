// 魔鬼地图的填写：一格一屏（什么时候 → 在哪里 → 什么心情 → 打开什么），选完自动进下一格，最后汇总确认。
// 允许跳过；跳过时零先猜一条（并说出依据），玩家可以接受、改一改、再拒绝。
(function () {
  const G = window.Game;
  const { esc, fmt, paras, btn } = G.dom;
  const FIELDS = ["when", "where", "mood", "app"];

  // 一格一屏。返回 { value } | { skip:true } | { back:true }
  function step(field, selected, opts) {
    const options = G.t("map." + field);
    const list = Array.isArray(options) ? options : [];
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("map.title"))} · ${opts.index + 1}/${opts.total}</p>
          ${opts.intro ? paras(G.t("map.intro")) : ""}
          <h2>${fmt(G.t("map." + field + ".label"))}</h2>
          <div class="chips" id="chips">
            ${list.map((o) => `<button type="button" class="chip" data-v="${esc(o)}" aria-pressed="${o === selected}">${esc(o)}</button>`).join("")}
            <button type="button" class="chip custom" data-custom="1">${fmt(G.t("map.custom"))}</button>
          </div>
          <div class="row" id="ownrow" hidden>
            <input class="own" id="own" type="text" maxlength="30" placeholder="${esc(G.text("map.customPlaceholder"))}">
            ${btn("ownok", G.t("map.next"), "btn-quiet")}
          </div>
        </div>
        ${opts.allowSkip !== false ? btn("skip", G.t("map.skip"), "btn-quiet") : ""}
      `, { name: "map" });
      G.router.$$("#chips .chip").forEach((c) =>
        c.addEventListener("click", () => {
          if (c.dataset.custom) {
            G.router.$("#ownrow").hidden = false;
            G.router.$("#own").focus();
            return;
          }
          resolve({ value: c.dataset.v });
        })
      );
      G.router.$("#ownok").addEventListener("click", () => {
        const v = G.router.$("#own").value.trim();
        if (v) resolve({ value: v });
      });
      const sk = G.router.$("#skip");
      if (sk) sk.addEventListener("click", () => resolve({ skip: true }));
    });
  }

  function summary(picked, fields) {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk zero">
          <p>${fmt(G.t("map.summary"))}</p>
          <div class="guess">
            ${fields.map((f) => `<p><span class="eyebrow">${fmt(G.t("map." + f + ".label"))}</span> ${esc(picked[f] || "")}</p>`).join("")}
          </div>
        </div>
        ${btn("done", G.t("map.done"))}
        ${btn("back", G.t("map.back"), "btn-quiet")}
      `, { name: "map-confirm" });
      G.router.$("#done").addEventListener("click", () => resolve(true));
      G.router.$("#back").addEventListener("click", () => resolve(false));
    });
  }

  // opts: { intro, fields, prefill, allowSkip }
  // 返回 { cue } | { skipped:true }
  async function ask(opts) {
    opts = opts || {};
    const fields = opts.fields || FIELDS;
    const picked = Object.assign({}, opts.prefill || {});
    // 预填 + startAtSummary：只走没预填的格子，然后直接到汇总，玩家改或确认；"重新选"才走全部四步
    let firstPass = !!opts.startAtSummary;
    for (;;) {
      for (let i = 0; i < fields.length; i++) {
        const f = fields[i];
        if (firstPass && picked[f]) continue;
        const r = await step(f, picked[f], { index: i, total: fields.length, intro: opts.intro && i === 0, allowSkip: opts.allowSkip });
        if (r.skip) return { skipped: true };
        picked[f] = r.value;
      }
      if (await summary(picked, fields)) return { cue: picked };
      firstPass = false;
    }
  }

  // 零先猜一条，并说出猜的依据（小明牌）：接受 / 改一改 / 再拒绝
  function offerGuess(g) {
    const h = new Date(G.clock.now()).getHours();
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk zero">
          ${paras(G.t("map.zeroGuess"))}
          ${paras(G.f("zero.guessBasis", { hourOfDay: h }))}
          <div class="guess">
            ${FIELDS.map((f) => `<p><span class="eyebrow">${fmt(G.t("map." + f + ".label"))}</span> ${esc(g[f] || "")}</p>`).join("")}
          </div>
        </div>
        ${btn("accept", G.t("map.acceptGuess"))}
        ${btn("edit", G.t("map.editGuess"), "btn-quiet")}
        ${btn("no", G.t("map.skip"), "btn-quiet")}
      `, { name: "mapguess" });
      G.router.$("#accept").addEventListener("click", () => resolve({ cue: Object.assign({ guessed: true }, g) }));
      G.router.$("#edit").addEventListener("click", () => resolve({ edit: true }));
      G.router.$("#no").addEventListener("click", () => resolve({ none: true }));
    });
  }

  // 完整流程：填 → 跳过则猜 → 猜也不要则尊重"没有"。返回加入的线索或 null。
  async function flow(opts) {
    opts = opts || {};
    let r = await ask(opts);
    if (r.cue) return G.map.add(r.cue);
    G.map.markSkipped();
    if (opts.insist) G.map.markInsisted();
    const g = G.map.guess();
    if (!g) return null;
    const o = await offerGuess(g);
    if (o.cue) return G.map.add(o.cue);
    if (o.edit) {
      const r2 = await ask(Object.assign({}, opts, { prefill: g, intro: false, allowSkip: false }));
      if (r2.cue) return G.map.add(r2.cue);
    }
    return null;
  }

  G.mapform = { ask, offerGuess, flow };
})();
