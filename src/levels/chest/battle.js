// 宝箱魔第 3 局：决战（Mary_V021）。
// 宝箱魔一条血（6 格），三回合。每回合诱惑三级升级（低语 → 发光 → 加码），每级约 2.5 秒，没有倒计时。
// 玩家任何时候按住：第 1 级按住 = 暴击（3 格），第 2 级 = 2 格，第 3 级 = 1 格；认对再 +1；认错不扣。
// 宝箱始终可点：点了照常开，宝箱魔回 1 格血。第 3 回合定数 = 最后一击，血归零。没有失败状态，不设评分。
(function () {
  const G = window.Game;
  const { esc, fmt, paras, btn } = G.dom;
  const talk = (o) => G.screens.talk(o);
  const HP_MAX = 6;
  const STAGE_MS = 2500;
  const DMG = [3, 2, 1]; // 按停在第几级

  let hp = HP_MAX;

  function hpBar() {
    return `<div class="hpbar" aria-label="${esc(G.text("battle.hpLabel"))}">${Array.from({ length: HP_MAX }, (_, i) => `<i class="${i < hp ? "on" : ""}"></i>`).join("")}</div>`;
  }

  function pick(arr) {
    return Array.isArray(arr) && arr.length ? arr[Math.floor(Math.random() * arr.length)] : String(arr || "");
  }

  function lastStop() {
    const s = G.state.get();
    return [...s.ledger.stops].reverse().find((x) => x.kind !== "notAppear") || s.ledger.stops[s.ledger.stops.length - 1] || {};
  }

  function whisperFor(round, ctx) {
    if (round === 1) return pick(G.f("demonTaunt", G.map.forDemon(G.map.primary()) || {}));
    if (round === 2) {
      const last = lastStop();
      return G.f("demonQuotePatrol", { kind: last.kind, whenLabel: last.whenLabel, doing: last.doing, what: last.what });
    }
    return G.t("battle.round3Setup");
  }

  // 一回合：返回 { stage, taps, crit }
  function round(i, rule, opts) {
    const rules = G.levels.chest.rules;
    return new Promise((resolve) => {
      let stage = 0, taps = 0, done = false, timer = null, n = 0;
      const stopAt = opts && opts.stopAt;
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("battle.eyebrow"))} · ${esc(G.f("battle.roundOf", { i, total: 3 }))}</p>
          ${hpBar()}
        </div>
        <div class="talk chest"><p id="say">${fmt(opts.whisper)}</p><p class="gloat" id="bait" hidden>${fmt(G.t("battle.stage3bait"))}</p></div>
        <div class="chest-wrap" id="wrap">
          <button type="button" class="chest" id="chest" aria-label="${esc(G.text("chest.mini.tap"))}">${G.levels.chest.CHEST_SVG}</button>
        </div>
        <div class="result" id="result" aria-live="polite">${stopAt ? esc(G.f("stopPointPrompt", { n: stopAt })) : ""}</div>
        <p class="eyebrow holdcue" id="holdcue">${fmt(G.t(stopAt ? "battle.openFirst" : "battle.stepStop"))}</p>
        <div class="surf ${stopAt ? "dim" : ""}" id="surf"><div class="bar" id="bar"></div><span class="label">${fmt(G.t(G.hold.useAlt() ? "hold.altPrompt" : "hold.prompt"))}</span></div>
      `, { name: "battle-round" });
      const $ = G.router.$;

      function escalate() {
        if (done) return;
        stage++;
        const c = $("#chest");
        if (!c) return;
        if (stage === 1 && !stopAt) {
          c.classList.add("glow");
          $("#say").textContent = G.f("battle.attackLine", { rule });
        } else if (stage >= 2) {
          c.classList.add("glow", "bright");
          G.fx.play("chest.bright", {});
          $("#bait").hidden = false;
          return; // 第 3 级：停在这里等
        }
        timer = setTimeout(escalate, STAGE_MS);
      }
      // 第 3 回合：先让玩家开到数，最后一个大奖，然后才发光（stage 直接到 1）
      if (!stopAt) timer = setTimeout(escalate, STAGE_MS);

      $("#chest").addEventListener("click", () => {
        if (done) return;
        n++;
        const d = stopAt ? (n === stopAt ? { kind: "big", reason: "plan" } : rules.decide(n, false, 999)) : rules.decide(n + 2, false, 999);
        const reward = d.kind === "big" ? rules.BIG : d.kind === "near" ? 0 : 1 + Math.floor(Math.random() * 5);
        const res = $("#result");
        res.className = "result " + d.kind;
        res.textContent = G.f("chest.mini.result", { kind: d.kind, reward });
        if (stopAt) {
          if (n === stopAt) {
            // 最后一个：大奖 + 最亮的光，诱惑开始；圆环亮起
            $("#chest").classList.add("glow", "bright");
            $("#surf").classList.remove("dim");
            $("#holdcue").textContent = G.text("battle.stepStop");
            $("#say").textContent = G.text("battle.round3Glow");
            stage = 1;
            timer = setTimeout(() => {
              stage = 2;
              const b = $("#bait");
              if (b) b.hidden = false;
            }, STAGE_MS);
          } else if (n > stopAt) {
            taps++;
            hp = Math.min(HP_MAX, hp + 1);
            $("#say").textContent = G.text("battle.tappedHeal");
            G.router.el.querySelector(".hpbar").outerHTML = hpBar();
          }
          return;
        }
        // 第 1、2 回合：点了就回血
        taps++;
        hp = Math.min(HP_MAX, hp + 1);
        $("#say").textContent = G.text("battle.tappedHeal");
        G.router.el.querySelector(".hpbar").outerHTML = hpBar();
      });

      // hold 触发一次就锁住：被忽略的那一下要重新挂上
      let detach = null;
      const armHold = () => {
        if (detach) detach();
        detach = G.hold.attach($("#surf"), holdOpts);
      };
      const holdOpts = {
        onProgress: (p) => $("#bar").style.setProperty("--p", Math.round(p * 100)),
        onHold: () => {
          if (done) return;
          if (stopAt && n < stopAt) {
            // 第 3 回合要先开到数（圆环此时是暗的）
            $("#bar").style.setProperty("--p", 0);
            return setTimeout(armHold, 0);
          }
          done = true;
          clearTimeout(timer);
          const dmg = DMG[Math.min(stage, 2)];
          // 前两回合最多打到剩 1 格：最后一格只能由第 3 回合的"走"打掉
          hp = Math.max(opts.floor == null ? 0 : opts.floor, hp - dmg);
          G.events.log("battle.hold", { count: stage, tick: dmg, option: rule });
          resolve({ stage, taps, dmg });
        },
      };
      armHold();
    });
  }

  function recognize(rule) {
    return new Promise((resolve) => {
      const opts = G.t("battle.recognizeOptions");
      G.router.show(`
        <div class="stack">
          ${hpBar()}
          <p class="eyebrow">${fmt(G.t("battle.stepRecognize"))}</p>
          <div class="stack" id="opts">
            ${(Array.isArray(opts) ? opts : []).map((o) => `<button type="button" class="btn-choice" data-rule="${esc(o.rule)}">${esc(o.label)}</button>`).join("")}
          </div>
        </div>
      `, { name: "battle-recognize" });
      G.router.$$("#opts button").forEach((b) => b.addEventListener("click", () => resolve(b.dataset.rule === rule)));
    });
  }

  // 选：前两回合"定个数 / 走"；第 3 回合只有"走"：刚中了大奖，正是该停的时候。按住 → 走，壳碎。
  function choose(final) {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          ${hpBar()}
          <p class="eyebrow">${fmt(G.t("battle.stepChoose"))}</p>
          ${final ? "" : btn("num", G.t("battle.btnSetNumber"))}
          ${btn("walk", G.t("battle.btnWalk"), final ? "btn-main" : "btn-quiet")}
        </div>
      `, { name: "battle-choose" });
      const n = G.router.$("#num");
      if (n) n.addEventListener("click", () => resolve("num"));
      G.router.$("#walk").addEventListener("click", () => resolve("walk"));
    });
  }

  function feedback(lines) {
    return talk({ speaker: "narrator", lines, extraHtml: hpBar(), nextLabel: G.t("talk.next") });
  }

  async function battle(ctx) {
    hp = HP_MAX;
    let crits = 0, taps = 0, right = 0;
    G.fx.play("demon.appear", { who: "chest" });
    await talk({ speaker: "zero", lines: G.t("battle.intro") });
    // 第 1 回合：新手好运或差一点；第 2 回合：发光或差一点（避免总是发光）；第 3 回合：计划的最后一次
    const first = Math.random() < 0.5 ? "luck" : "near";
    const second = first === "near" ? "pause" : Math.random() < 0.5 ? "pause" : "near";
    const plan = [first, second, "plan"];
    for (let i = 1; i <= 3; i++) {
      const rule = plan[i - 1];
      let stopAt = null;
      if (i === 3) {
        await talk({ speaker: "chest", lines: G.t("battle.round3Setup") });
        stopAt = await G.levels.chest.pickNumber();
      }
      const r = await round(i, rule, { whisper: i === 3 ? G.t("battle.round3Setup") : whisperFor(i, ctx), stopAt, floor: i < 3 ? 1 : 0 });
      taps += r.taps;
      if (r.stage === 0) crits++;
      await feedback(r.stage === 0 ? G.t("battle.crit") : r.stage >= 2 ? G.t("battle.lateHit") : G.t("battle.hit"));
      // 第 2 回合：魔鬼否定了玩家的报告，砍中之后零当场回一句
      if (i === 2) {
        const last = lastStop();
        const rebut = G.f("battle.zeroRebut", { kind: last.kind, what: last.what });
        if (rebut && typeof rebut === "string" && !rebut.includes(G.i18n.BUILTIN[G.i18n.lang].missing)) await talk({ speaker: "zero", lines: rebut });
      }
      const ok = await recognize(rule);
      if (ok) {
        right++;
        hp = Math.max(i < 3 ? 1 : 0, hp - 1);
        await feedback(G.t("battle.readRight"));
      } else {
        await talk({ speaker: "chest", lines: G.t("battle.misread"), extraHtml: hpBar() });
      }
      G.events.log("battle.read", { correct: ok, option: rule });
      const c = await choose(i === 3);
      if (i === 3) {
        hp = 0;
        await feedback(G.t("battle.finalBlow"));
      } else if (c === "walk") {
        await feedback(G.t("battle.walked"));
      }
    }
    // 不设评分：结束语只有三档之一已由血条表达，这里只讲壳碎了
    G.fx.play("chest.shatter", {});
    G.fx.play("demon.leave", { who: "chest" });
    await talk({ speaker: "narrator", lines: G.t("battle.shatter") });
    await talk({ speaker: "zero", lines: G.t("battle.zeroAfter") });
    G.events.log("battle.end", { count: crits, tick: right, option: String(taps) });
    return { crits, taps, right };
  }

  G.levels.chest = G.levels.chest || {};
  G.levels.chest.battle = battle;
})();
