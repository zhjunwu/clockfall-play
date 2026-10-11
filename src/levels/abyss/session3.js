// 无底渊第 3 局：决战 + 救长廊信使（第 22 天）。回城与通用巡逻由 runner 做（patrolDetail: false）。Mark_V062，Mary_V052。
// 现实里的门报告 → 决战（三条长廊 = 三回合：入口画门 → 进去 → 门亮后三级出招 → 按住 → 出门 → 认招）
// → 救长廊信使（在他进去之前画门）→ 长廊复苏、猎魔人·三 → 零发呆（endHook: cliffhanger，安静样式）。
// 无底渊一条血 6 格：第 1 级停 3 格、第 2 级 2 格、第 3 级 1 格；认对再 1 格；前两条最多打到剩 1 格；第三条出门 = 最后一击。
// 门亮后每多划一张，它回 1 格血。不画门直接进：里面画门被拒，只能从"出去"离开，这一回合给 1 格。没有失败。
// 停永远和平时一样容易；"出去"始终在原位，被挤走的只能是玩家画的门。
(function () {
  const G = window.Game;
  const { esc, fmt, btn } = G.dom;
  const talk = (o) => G.screens.talk(o);
  const HP_MAX = 6;
  const STAGE_MS = 2500;
  const DMG = [3, 2, 1];
  const MOVES = ["noBottom", "outside", "hideTime"];

  let hp = HP_MAX;

  function hpBar() {
    return `<div class="hpbar" aria-label="${esc(G.text("abyss3.hpLabel"))}">${Array.from({ length: HP_MAX }, (_, i) => `<i class="${i < hp ? "on" : ""}"></i>`).join("")}</div>`;
  }
  function refreshHp() {
    const el = G.router.el.querySelector(".hpbar");
    if (el) el.outerHTML = hpBar();
  }
  function sess(id) {
    return G.state.get().sessions[id] || {};
  }

  // 墙上拖出一扇门（或点"画门"）。onDone 返回 false 表示这一下不算（门消失，可以再画）
  function wallDraw(wallEl, btnEl, onDone) {
    let start = null, done = false;
    const finish = () => {
      if (done) return;
      done = true;
      const d = wallEl.querySelector(".drawn");
      if (d) d.hidden = false;
      if (onDone() === false) {
        done = false;
        if (d) d.hidden = true;
        return;
      }
      G.fx.play("abyss.doorDrawn", {});
    };
    wallEl.addEventListener("pointerdown", (e) => (start = { x: e.clientX, y: e.clientY }));
    wallEl.addEventListener("pointerup", (e) => {
      if (!start) return;
      const big = Math.abs(e.clientX - start.x) > 30 && Math.abs(e.clientY - start.y) > 40;
      start = null;
      if (big) finish();
    });
    if (btnEl) btnEl.addEventListener("click", finish);
    return { cancel: () => (done = true) };
  }

  // ---- 巡逻：现实里的门 ----
  function taskReport() {
    const opts = G.t("abyss3.task.options");
    const real = sess("abyss2").real;
    const realOpts = G.t("abyss2.realOptions");
    const realLabel = Array.isArray(realOpts) && real ? (realOpts.find((o) => o.id === real) || {}).label : null;
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk zero">
          <p class="eyebrow">${fmt(G.t("abyss3.task.eyebrow"))}</p>
          <p>${fmt(G.f("abyss3.task.q", { door: realLabel }))}</p>
          <div class="stack" id="opts">${(Array.isArray(opts) ? opts : []).map((o) => `<button type="button" class="btn-choice" data-id="${esc(o.id)}">${esc(o.label)}</button>`).join("")}</div>
        </div>
        ${btn("skip", G.t("abyss3.task.skip"), "btn-quiet")}
      `, { name: "abyss3-task" });
      G.router.$$("#opts button").forEach((b) => b.addEventListener("click", () => resolve(b.dataset.id)));
      G.router.$("#skip").addEventListener("click", () => resolve("skip"));
    }).then(async (kind) => {
      G.events.log("abyss3.task", { option: kind });
      await talk({ speaker: "zero", lines: G.t("abyss3.task.reply." + kind) });
      return kind;
    });
  }

  // ---- 决战：入口 ----
  function entrance(i) {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("abyss3.eyebrow"))} · ${esc((G.t("abyss3.corridors") || [])[i - 1] || "")}</p>
          ${hpBar()}
          <div class="talk zero"><p>${fmt(G.t("abyss3.entrance.say"))}</p></div>
          <div class="wall" id="wall"><i class="drawn" hidden></i></div>
          <p class="hint">${fmt(G.t("abyss3.entrance.hint"))}</p>
          <div class="row">${btn("draw", G.t("abyss2.drawBtn"), "btn-choice")}${btn("goIn", G.t("abyss3.goIn"), "btn-quiet")}</div>
        </div>
      `, { name: "abyss3-entrance" });
      const w = wallDraw(G.router.$("#wall"), G.router.$("#draw"), () => setTimeout(() => resolve(true), 400));
      G.router.$("#goIn").addEventListener("click", () => {
        w.cancel();
        resolve(false);
      });
    });
  }

  // ---- 决战：一条长廊 ----
  // opts: { i, door: {type, v} | null }。返回 { stage, moves, k, sec, n, noDoor }
  function corridor(opts) {
    const move = MOVES[opts.i - 1];
    const door = opts.door;
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack"><p class="eyebrow">${fmt(G.t("abyss3.eyebrow"))} · ${esc((G.t("abyss3.corridors") || [])[opts.i - 1] || "")}</p>
          ${hpBar()}
          <div class="talk abyss"><p id="say"></p></div>
        </div>
        <div class="feed" id="feed" aria-live="polite">${G.levels.abyss.cardHtml(60 + opts.i * 7)}</div>
        <p class="hint refused" id="refused" aria-live="polite"></p>
        <div class="feedlayer" id="feedlayer" tabindex="0"></div>
        ${door ? `<div class="walldoor" id="walldoor" data-type="${esc(door.type)}"><button type="button" class="doorbtn" id="door">${fmt(G.f("abyss3.doorLabel", door))}${door.type === "feel" ? `<small>${fmt(G.t("abyss2.feelTap"))}</small>` : ""}</button></div>` : `<div class="feeddraw">${btn("draw", G.t("abyss2.drawBtn"), "btn-choice")}</div>`}
        <div class="feedhold" id="hold" hidden><div class="surf" id="surf"><div class="bar" id="bar"></div><span class="label">${fmt(G.t(G.hold.useAlt() ? "hold.altPrompt" : "hold.prompt"))}</span></div></div>
        <div class="feedexit">${btn("exit", G.t("abyss.exit"), "btn-quiet")}</div>
      `, { name: "abyss3-corridor" });
      const $ = G.router.$;
      const start = Date.now();
      let n = 60 + opts.i * 7, seen = 1, lit = false, held = false, done = false, stage = -1, k = 0, timer = null, tick = null;
      const moves = new Set();
      const alive = () => !done && !!G.router.$("#say");
      const say = (t) => alive() && ($("#say").textContent = t);
      const finish = (extra) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        clearInterval(tick);
        resolve(Object.assign({ stage, moves: [...moves], k, sec: Math.round((Date.now() - start) / 1000), n: seen }, extra));
      };

      function stageTo(s) {
        if (!alive() || held) return;
        stage = s;
        moves.add(move);
        const key = "abyss3.m" + opts.i;
        const d = $("#walldoor");
        if (s === 0) say(G.text(key + ".whisper"));
        else if (s === 1) {
          say(G.text(key + ".mechanic"));
          // 机制只作用在玩家画的门上，"出去"不动
          if (d) d.classList.add(move === "noBottom" ? "pushed" : move === "outside" ? "dim" : "fade");
        } else {
          say(G.text(key + ".bait"));
          return;
        }
        timer = setTimeout(() => stageTo(s + 1), STAGE_MS);
      }
      function light() {
        if (lit || !alive()) return;
        lit = true;
        clearInterval(tick);
        const d = $("#walldoor");
        if (d) d.classList.add("lit");
        $("#hold").hidden = false;
        G.fx.play("abyss.doorLit", { type: door ? door.type : "none" });
        stageTo(0);
      }

      G.levels.abyss.swipeLayer($("#feedlayer"), () => {
        if (!alive() || held) return;
        n++;
        seen++;
        $("#feed").innerHTML = G.levels.abyss.cardHtml(n);
        G.fx.play("abyss.card", { n });
        if (lit) {
          k++;
          hp = Math.min(HP_MAX, hp + 1);
          refreshHp();
          say(G.text("abyss3.healed"));
          clearTimeout(timer);
          timer = setTimeout(() => stageTo(0), 900);
        }
        if (door && door.type === "count" && seen >= door.v) light();
        // 没画门：进来走几张，它照样出招（但你只能从"出去"离开）
        if (!door && seen === 3) {
          moves.add(move);
          say(G.text("abyss3.m" + opts.i + ".whisper"));
        }
      });
      if (door && door.type === "time") tick = setInterval(() => (Date.now() - start) / 1000 >= door.v && light(), 500);

      if (door) {
        $("#door").addEventListener("click", () => {
          if (door.type === "feel" && !lit) return light();
          if (held) finish({ noDoor: false });
        });
      } else {
        $("#draw").addEventListener("click", () => {
          const r = $("#refused");
          r.textContent = G.text("abyss3.noDoorInside");
          r.classList.remove("flash");
          void r.offsetWidth;
          r.classList.add("flash");
          G.fx.play("abyss.doorRefused", {});
        });
      }
      // 出口一直在原位
      $("#exit").addEventListener("click", () => {
        if (held) return finish({ noDoor: false });
        finish({ noDoor: !door, plainExit: true });
      });
      G.hold.attach($("#surf"), {
        onProgress: (p) => $("#bar").style.setProperty("--p", Math.round(p * 100)),
        onHold: () => {
          if (held || !lit) return;
          held = true;
          clearTimeout(timer);
          const d = $("#walldoor");
          if (d) d.classList.remove("pushed", "dim", "fade");
          if (d) d.classList.add("open");
          $("#hold").hidden = true;
          $("#door").textContent = G.text("abyss3.doorOut");
          G.fx.play("abyss.doorOpen", {});
        },
      });
    });
  }

  function recognize(moves) {
    const opts = G.t("abyss3.moves");
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          ${hpBar()}
          <p class="eyebrow">${fmt(G.t("abyss3.stepRecognize"))}</p>
          <div class="stack" id="opts">${(Array.isArray(opts) ? opts : []).map((o) => `<button type="button" class="btn-choice" data-move="${esc(o.move)}">${esc(o.label)}</button>`).join("")}</div>
        </div>
      `, { name: "abyss3-recognize" });
      G.router.$$("#opts button").forEach((b) => b.addEventListener("click", () => resolve(moves.includes(b.dataset.move))));
    });
  }

  const feedback = (lines) => talk({ speaker: "narrator", lines, extraHtml: hpBar() });

  async function battle() {
    hp = HP_MAX;
    const practiced = sess("abyss2").door || {};
    G.fx.play("demon.appear", { who: "abyss" });
    await talk({ speaker: "zero", lines: G.t("abyss3.intro") });
    let noDoor = 0, kTotal = 0, crits = 0, right = 0;
    for (let i = 1; i <= 3; i++) {
      const drew = await entrance(i);
      // 第 3 条用玩家第 2 局练的那一类门；其余是数量门"看到第 5 张"
      let door = null;
      if (drew) door = i === 3 && practiced.type ? { type: practiced.type, v: practiced.type === "time" ? 20 : practiced.type === "count" ? 5 : null } : { type: "count", v: 5 };
      const r = await corridor({ i, door });
      kTotal += r.k;
      if (r.noDoor) {
        noDoor++;
        hp = Math.max(i < 3 ? 1 : 0, hp - 1);
        await feedback(G.t("abyss3.hit"));
        await talk({ speaker: "zero", lines: G.t("abyss3.noDoorAfter"), extraHtml: hpBar() });
      } else if (r.stage >= 0) {
        if (r.stage === 0) crits++;
        hp = Math.max(i < 3 ? 1 : 0, hp - DMG[Math.min(r.stage, 2)]);
        await feedback(G.t(r.stage === 0 ? "abyss3.crit" : r.stage >= 2 ? "abyss3.lateHit" : "abyss3.hit"));
      } else {
        // 门没亮就从"出去"走了：也是停
        hp = Math.max(i < 3 ? 1 : 0, hp - 1);
        await feedback(G.t("abyss3.hit"));
      }
      if (r.moves.length) {
        const ok = await recognize(r.moves);
        G.events.log("abyss3.read", { correct: ok, option: r.moves.join("+") });
        if (ok) {
          right++;
          hp = Math.max(i < 3 ? 1 : 0, hp - 1);
          await feedback(G.t("abyss3.readRight"));
        } else await talk({ speaker: "zero", lines: G.t("abyss3.misread"), extraHtml: hpBar() });
      }
      // 拆穿"藏起时间"：这一条长廊的真实秒数和张数
      if (i === 3 && r.moves.includes("hideTime")) await talk({ speaker: "zero", lines: G.f("abyss3.hideTimeRebut", { sec: r.sec, n: r.n }) });
      G.events.log("abyss3.round", { count: i, option: r.noDoor ? "noDoor" : "door", tick: r.k });
    }
    hp = 0;
    await feedback(G.t("abyss3.finalBlow"));
    G.fx.play("abyss.deflate", {});
    G.fx.play("demon.leave", { who: "abyss" });
    await talk({ speaker: "narrator", lines: [].concat(G.t("abyss3.deflate"), G.f("abyss3.result", { noDoor, k: kTotal })) });
    await talk({ speaker: "zero", lines: G.t("abyss3.zeroAfter") });
    G.events.log("abyss3.end", { count: crits, tick: right, option: String(noDoor) });
    return { crits, right, noDoor, k: kTotal };
  }

  // ---- 救长廊信使：在他进去之前画门 ----
  function messenger() {
    const WALK_MS = 6000;
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("messenger.eyebrow"))}</p>
          <p class="hint" id="hint">${fmt(G.t("messenger.now"))}</p>
          <div class="messengerlane" id="lane"><i class="walker" id="walker"></i><div class="wall entrance" id="wall"><i class="drawn" hidden></i></div></div>
          ${btn("draw", G.t("abyss2.drawBtn"), "btn-choice")}
        </div>
      `, { name: "abyss3-messenger" });
      const $ = G.router.$;
      let t0 = Date.now(), done = false, attempts = 1, inside = false;
      const walker = $("#walker");
      const tick = setInterval(() => {
        if (done || !G.router.$("#walker")) return clearInterval(tick);
        const p = Math.min(1, (Date.now() - t0) / WALK_MS);
        walker.style.setProperty("--p", p.toFixed(3));
        if (p >= 1 && !inside) {
          // 他进去了：等他从出口转回来，再走一次。没有失败
          inside = true;
          walker.classList.add("inside");
          $("#hint").textContent = G.text("messenger.inside");
          setTimeout(() => {
            if (done) return;
            inside = false;
            attempts++;
            walker.classList.remove("inside");
            $("#hint").textContent = G.text("messenger.now");
            t0 = Date.now();
          }, 2500);
        }
      }, 100);
      wallDraw($("#wall"), $("#draw"), () => {
        if (inside) return false; // 他在里面时画不了（同一课：门要在外面画），等他回到入口再画
        done = true;
        clearInterval(tick);
        walker.classList.add("stopped");
        $("#hint").textContent = G.text("messenger.stopped");
        G.events.log("dream.hold", { held: true, count: attempts, option: "messenger" });
        setTimeout(() => resolve({ attempts }), 1200);
      });
    });
  }

  // ---- 零发呆：画面在动（尾巴慢摆、小红点极慢明暗），"继续"2 秒后才淡入 ----
  function stare() {
    return new Promise((resolve) => {
      G.fx.play("zero.stare", {});
      const lines = G.t("zero.stare");
      G.router.show(`
        <div class="stack stare">
          <div class="stareart" aria-hidden="true"><i class="zeroshape"></i><i class="reddot"></i></div>
          <p>${fmt(Array.isArray(lines) ? lines[0] : lines)}</p>
          <p class="hint late" id="later" hidden>${fmt(Array.isArray(lines) ? lines[1] : "")}</p>
        </div>
        ${btn("next", G.t("talk.next"), "btn-main fadein", "hidden")}
      `, { name: "abyss3-stare" });
      setTimeout(() => {
        if (!G.router.$("#next")) return;
        G.router.$("#later").hidden = false;
        G.router.$("#next").hidden = false;
      }, 2000);
      G.router.$("#next").addEventListener("click", resolve);
    });
  }

  const session3 = [
    async (ctx) => {
      ctx.task = await taskReport();
      G.state.update((s) => (s.sessions.abyss3 = Object.assign(s.sessions.abyss3 || {}, { task: ctx.task })));
    },
    async (ctx) => {
      ctx.battle = await battle();
      G.state.update((s) => (s.sessions.abyss3 = Object.assign(s.sessions.abyss3 || {}, { battle: ctx.battle })));
    },
    async () => {
      await talk({ speaker: "narrator", lines: G.t("messenger.intro") });
      const r = await messenger();
      await talk({ speaker: "messenger", lines: G.t("messenger.awake") });
      const r1 = (sess("abyss1").record || {});
      if (r1.exited) await talk({ speaker: "zero", lines: G.t("messenger.aheadOfHim") });
      G.state.update((s) => {
        s.rescued = s.rescued || [];
        if (!s.rescued.includes("messenger")) s.rescued.push("messenger");
        s.sessions.abyss3 = Object.assign(s.sessions.abyss3 || {}, { messenger: r });
      });
    },
    async () => {
      G.fx.play("district.revive", { district: "corridor", state: 2 });
      await talk({ speaker: "narrator", lines: [].concat(G.t("corridor.revived"), G.t("corridor.companion")) });
      await G.titles.awardAndShow("hunter3");
    },
    // 零发呆；runner 随后安静亮牌（悬念）
    async () => {
      await stare();
      await talk({ speaker: "zero", lines: G.t("zero.stareBack") });
    },
  ];

  G.levels.abyss = G.levels.abyss || {};
  G.levels.abyss.session3 = session3;
})();
