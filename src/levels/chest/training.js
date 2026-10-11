// 宝箱魔第 2 局：训练场。先按住、定数、到数发光；到数后宝箱继续可以点（现实里手机永远点得动），
// 按住圆环同时出现，任何时候按住都算停下；多点的次数如实记录，不扣分；最多多开 5 次后收摊。
// 可以续一次（亮牌），第二次想续集市打烊。续一次后破罐魔的小影子在角落说一句，被零赶走（伏笔，不解释）。
(function () {
  const G = window.Game;
  const { esc, fmt, paras, btn } = G.dom;
  const talk = (o) => G.screens.talk(o);
  const OVER_MAX = 5;

  function pickNumber() {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk zero">
          ${paras(G.t("training.setStopPoint"))}
          <p class="eyebrow">${fmt(G.f("stopPointPrompt", {}))}</p>
          <div class="row" id="nums">
            ${[3, 5, 8].map((n) => `<button type="button" class="btn-choice" data-n="${n}">${esc(G.f("chest.mini.planBtn", { n }))}</button>`).join("")}
          </div>
        </div>
      `, { name: "training-pick" });
      G.router.$$("#nums button").forEach((b) => b.addEventListener("click", () => resolve(Number(b.dataset.n))));
    });
  }

  // 开到 stopAt，然后发光；宝箱继续可点。返回 { held, over }
  function round(stopAt) {
    const rules = G.levels.chest.rules;
    return new Promise((resolve) => {
      let n = 0, coins = 0, over = 0, idleTimer = null, glowing = false, done = false;
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("training.eyebrow"))}</p>
          <p>${fmt(G.f("stopPointPrompt", { n: stopAt }))}</p>
        </div>
        <div class="hud">
          <span class="coins" id="coins">0</span>
          <span class="count" id="count">${esc(G.f("chest.mini.count", { n: 0 }))}</span>
        </div>
        <div class="chest-wrap" id="wrap">
          <button type="button" class="chest" id="chest" aria-label="${esc(G.text("chest.mini.tap"))}">${G.levels.chest.CHEST_SVG}</button>
        </div>
        <div class="result" id="result" aria-live="polite">${fmt(G.t("chest.mini.tap"))}</div>
        <p class="hint" id="hint"></p>
        <div class="surf" id="surf" hidden><div class="bar" id="bar"></div><span class="label">${fmt(G.t(G.hold.useAlt() ? "hold.altPrompt" : "hold.prompt"))}</span></div>
      `, { name: "training-round" });
      const $ = G.router.$;

      function finish(held) {
        if (done) return;
        done = true;
        clearTimeout(idleTimer);
        G.events.log("training.hold", { held, count: n, option: String(over) });
        setTimeout(() => resolve({ held, over }), held ? 500 : 900);
      }

      function showSurf() {
        const surf = $("#surf");
        if (!surf || !surf.hidden) return;
        surf.hidden = false;
        G.hold.attach(surf, {
          onProgress: (p) => $("#bar").style.setProperty("--p", Math.round(p * 100)),
          onHold: () => {
            $("#hint").textContent = G.text("training.held");
            finish(true);
          },
        });
      }

      $("#chest").addEventListener("click", () => {
        if (done) return;
        n++;
        const paused = glowing && n > stopAt;
        glowing = false;
        const d = rules.decide(n, paused, stopAt);
        const reward = d.kind === "big" ? rules.BIG : d.kind === "near" ? 0 : 1 + Math.floor(Math.random() * 5);
        coins += reward;
        const res = $("#result");
        res.className = "result " + d.kind;
        res.textContent = G.f("chest.mini.result", { kind: d.kind, reward });
        $("#coins").textContent = coins;
        $("#count").textContent = G.f("chest.mini.count", { n });
        if (n === stopAt) {
          // 到数：发光，按住圆环出现，宝箱照样能点
          $("#chest").classList.add("glow");
          $("#hint").textContent = G.text("training.reached");
          showSurf();
        } else if (n > stopAt) {
          over = n - stopAt;
          $("#chest").classList.add("glow");
          $("#hint").textContent = G.f("training.overTap", { over });
          if (over >= OVER_MAX) {
            $("#hint").textContent = G.text("training.marketClosed");
            return finish(false);
          }
        }
        // 秘密规则 2 在训练场里照样生效：你停下来，它就发光（玩家已经知道，再面对一次）
        clearTimeout(idleTimer);
        if (n >= 2 && n < stopAt) {
          idleTimer = setTimeout(() => {
            glowing = true;
            const c = G.router.$("#chest");
            if (c) c.classList.add("glow");
            if (G.router.$("#hint")) G.router.$("#hint").textContent = G.text("chest.mini.glowHint");
          }, rules.PAUSE_MS);
        }
      });
    });
  }

  function afterHold(canExtend) {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk zero">
          ${paras(G.t("training.afterHold"))}
        </div>
        <div class="stack talk chest">
          <p class="gloat">${fmt(G.t("chest.afterHoldWhisper"))}</p>
        </div>
        ${btn("leave", G.t("training.btnLeave"))}
        ${canExtend ? btn("extend", G.t("training.btnExtend"), "btn-quiet") : ""}
      `, { name: "training-after" });
      G.router.$("#leave").addEventListener("click", () => resolve("leave"));
      const e = G.router.$("#extend");
      if (e) e.addEventListener("click", () => resolve("extend"));
    });
  }

  // 破罐魔的小影子：角落里一行字，2 秒后零的一句，然后消失。不占一整屏。
  function jarShadow() {
    return new Promise((resolve) => {
      const el = document.createElement("div");
      el.className = "shadowline";
      el.innerHTML = `<p class="jar">${fmt(G.t("jar.firstShadow"))}</p>`;
      document.body.appendChild(el);
      setTimeout(() => el.classList.add("on"), 20);
      setTimeout(() => el.insertAdjacentHTML("beforeend", `<p class="zero">${fmt(G.t("zero.shooShadow"))}</p>`), 1500);
      setTimeout(() => {
        el.classList.remove("on");
        setTimeout(() => {
          el.remove();
          resolve();
        }, 300);
      }, 3600);
    });
  }

  async function training() {
    await talk({ speaker: "zero", lines: G.t("training.stopIntro") });
    await talk({ speaker: "zero", lines: G.t("training.youKnowNow") });
    let ext = 0, held = false, over = 0;
    let stopAt = await pickNumber();
    for (;;) {
      const r = await round(stopAt);
      held = held || r.held;
      over += r.over || 0;
      if (!r.held) break; // 多开到收摊：直接结算
      const canExtend = ext < G.config.trainingExtendMax;
      const choice = await afterHold(canExtend);
      if (choice !== "extend") break;
      ext++;
      G.events.log("training.extend", { count: ext });
      await G.flags.show("extendOnce");
      if (!G.state.get().flags.jarShadowShown) {
        G.state.update((s) => (s.flags.jarShadowShown = true));
        await jarShadow();
      }
      stopAt = await pickNumber();
    }
    G.ledger.tick("training");
    await talk({ speaker: "narrator", eyebrow: G.t("training.summaryTitle"), lines: G.f("training.summary", { extends: ext, held, over }) });
    return { extends: ext, held, over };
  }

  G.levels.chest = G.levels.chest || {};
  G.levels.chest.training = training;
  G.levels.chest.pickNumber = pickNumber;
})();
