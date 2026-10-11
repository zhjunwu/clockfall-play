// 夜枭第 3 局：决战 + 救守夜人（第 13 天）。回城与通用巡逻由 runner 做（本局 patrolDetail: false，不问"几点 / 在做什么"）。
// 第 2 局现实任务的报告 → 决战（三个夜晚 = 三回合，认招）→ 守夜人的梦 → 钟楼复苏、猎魔人·二 → 长廊预告（endHook: cliffhanger）。
// 决战：夜枭一条血（6 格）。每晚先播一段（关灯前，玩家自己的时间，圆环不亮）；到点后三级升级（低语 → 机制 → 加码），每级约 2.5 秒，没有倒计时压力。
// 第 1 级按住 3 格、第 2 级 2 格、第 3 级 1 格；认对再 1 格，认错不扣。前两晚最多打到剩 1 格，第三晚出门 = 最后一击。
// "再看一集"始终可点：真的播一集，时钟 +30 分钟，夜枭回 1 格血，之后回到第 1 级。自动播放同样计入，结尾分开说。没有失败状态。
(function () {
  const G = window.Game;
  const { esc, fmt, paras, btn } = G.dom;
  const talk = (o) => G.screens.talk(o);
  const HP_MAX = 6;
  const STAGE_MS = 2500;
  const PRE_MS = 4000;
  const EPISODE_MS = 3000;
  const DMG = [3, 2, 1];

  let hp = HP_MAX;

  function hpBar() {
    return `<div class="hpbar" aria-label="${esc(G.text("owl3.hpLabel"))}">${Array.from({ length: HP_MAX }, (_, i) => `<i class="${i < hp ? "on" : ""}"></i>`).join("")}</div>`;
  }
  function refreshHp() {
    const el = G.router.el.querySelector(".hpbar");
    if (el) el.outerHTML = hpBar();
  }
  function clockText(min) {
    return G.f("owl.clock", { h: Math.floor(min / 60), m: min % 60 });
  }
  function toMin(hhmm) {
    const [h, m] = String(hhmm || "22:30").split(":").map(Number);
    return (h || 22) * 60 + (m || 0);
  }
  // 倒计时时长：减少动态或替代按住时放宽到 10 秒
  function countdownS() {
    return G.fx.reducedMotion() || G.hold.useAlt() ? 10 : 5;
  }
  function owl2() {
    return G.state.get().sessions.owl2 || {};
  }
  function owl1rec() {
    const s = G.state.get();
    return (s.sessions.owl1 && s.sessions.owl1.record) || null;
  }
  // 夜里的线索：最近一条玩家自己填的（夜枭第 1 局补的那条通常就是它），否则 primary
  function nightCue() {
    const list = G.map.cues().filter((c) => !c.guessed);
    return G.map.forDemon(list[list.length - 1] || G.map.primary());
  }

  // 拖动：指针事件（触屏、鼠标都可用），也接受先点手机再点目标。返回 { cancel }。
  function draggable(phone, spot, onDone) {
    let drag = null, armed = false, finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      phone.style.transform = "";
      spot.classList.add("filled");
      spot.appendChild(phone);
      onDone();
    };
    phone.addEventListener("pointerdown", (e) => {
      drag = { x: e.clientX, y: e.clientY, moved: false };
      try { phone.setPointerCapture(e.pointerId); } catch (err) {}
    });
    phone.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true;
      if (drag.moved) phone.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    phone.addEventListener("pointerup", (e) => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      if (!moved) return;
      const r = spot.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) done();
      else phone.style.transform = "";
    });
    phone.addEventListener("pointercancel", () => ((drag = null), (phone.style.transform = "")));
    phone.addEventListener("click", () => ((armed = true), phone.classList.add("armed"), spot.classList.add("armed")));
    spot.addEventListener("click", () => armed && done());
  }

  // ---- 巡逻：第 2 局现实任务 ----
  function choice(eyebrow, q, options, name, skipLabel) {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk zero">
          <p class="eyebrow">${fmt(eyebrow)}</p>
          <p>${fmt(q)}</p>
          <div class="stack" id="opts">${options.map((o, i) => `<button type="button" class="btn-choice" data-i="${i}">${esc(o.label)}</button>`).join("")}</div>
        </div>
        ${skipLabel ? btn("skip", skipLabel, "btn-quiet") : ""}
      `, { name });
      G.router.$$("#opts button").forEach((b) => b.addEventListener("click", () => resolve(options[Number(b.dataset.i)])));
      const sk = G.router.$("#skip");
      if (sk) sk.addEventListener("click", () => resolve(null));
    });
  }
  // 选项可以是字符串，或 { v, label }（句子用 v，按钮显示 label）
  const asOpts = (arr) => (Array.isArray(arr) ? arr : []).map((x) => (x && typeof x === "object" ? { id: x.v, label: x.label } : { id: x, label: x }));

  async function taskReport() {
    const eb = G.t("owl3.task.eyebrow");
    const k = await choice(eb, G.t("owl3.task.q"), G.t("owl3.task.options"), "owl3-task", G.t("owl3.task.skip"));
    const r = { kind: k ? k.id : "skip", night: null, time: null, where: null };
    if (r.kind === "phone" || r.kind === "both") {
      const dr = G.t("owl3.task.dontRemember");
      const n = await choice(eb, G.t("owl3.task.nightQ"), asOpts(G.t("owl3.task.nightOptions")), "owl3-night", dr);
      r.night = n && n.id;
      // map.timeOptions 最后一项是"不记得"，这一屏已有"不记得了"跳过按钮，去掉重复的那一项
      const t = await choice(eb, G.t("owl3.task.timeQ"), asOpts(G.t("map.timeOptions")).slice(0, -1), "owl3-time", dr);
      r.time = t && t.id;
      const w = await choice(eb, G.t("owl3.task.whereQ"), asOpts([].concat(G.t("owl.ritual.phoneWhereOptions"), G.t("owl3.task.whereOther"))), "owl3-where", dr);
      r.where = w && w.id !== G.text("owl3.task.whereOther") ? w.id : null;
    }
    G.events.log("owl3.task", { option: r.kind });
    await talk({ speaker: "zero", lines: G.t("owl3.task.reply." + r.kind) });
    return r;
  }

  // ---- 决战：一晚 ----
  // opts: { night (1..3), lightsOut（这一晚此刻的关灯点，已含本晚多看的集数）, resume（出门前又点了一集，已过关灯时间）, whispers（按顺序轮换）, cliff, scale, stuck }
  // 返回 { stage, moves, extra, auto }
  function round(opts) {
    return new Promise((resolve) => {
      let stage = -1, done = false, timer = null, tick = null, playing = false, said = 0;
      let extra = 0, auto = 0;
      const moves = new Set();
      let clock = opts.resume ? opts.lightsOut : opts.lightsOut - 60;
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("owl3.eyebrow"))} · ${esc(pickNight(opts.night))}</p>
          ${hpBar()}
          <div class="tvtop"><p class="hint" id="state">${fmt(G.t(opts.resume ? "owl3.timeUp" : "owl3.before"))}</p><span class="tvclock" id="clock">${esc(clockText(clock))}</span></div>
          <div class="talk owl"><p id="say">${opts.resume ? fmt(G.t("owl3.healed")) : ""}</p></div>
          <ul class="daylist" id="daylist" hidden>${(G.t("owl.dayTasks") || []).slice(0, 5).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
          <div class="tv" id="tv">
            <p class="cliff" id="cliff"></p>
            <div class="playing run" id="playing"><i></i><span>${fmt(G.t("owl3.playing"))}</span></div>
            <p class="hint" id="countdown" hidden></p>
          </div>
          <div class="choices2"><button type="button" class="btn-choice tempt grow" id="more" hidden>${fmt(G.t("owl3.oneMore"))}</button></div>
          <div class="surf" id="surf" data-night="${opts.night}" hidden><div class="bar" id="bar"></div><span class="label">${fmt(G.t(G.hold.useAlt() ? "hold.altPrompt" : "hold.prompt"))}</span></div>
        </div>
      `, { name: "owl3-round" });
      const $ = G.router.$;
      const alive = () => !!G.router.$("#say") && !done;
      const say = (t) => alive() && ($("#say").textContent = t);
      const setClock = () => alive() && ($("#clock").textContent = clockText(clock));

      // 关灯前：剧在播，时钟走到关灯时间
      const pre = setInterval(() => {
        if (!alive()) return clearInterval(pre);
        clock = Math.min(opts.lightsOut, clock + 15);
        setClock();
      }, PRE_MS / 4);
      setTimeout(() => {
        clearInterval(pre);
        if (!alive()) return;
        clock = opts.lightsOut;
        setClock();
        $("#state").textContent = G.text("owl3.timeUp");
        $("#playing").hidden = true;
        $("#more").hidden = false;
        $("#surf").hidden = false;
        G.fx.play("owl.lightsOut", { night: opts.night });
        stageTo(0);
      }, PRE_MS);

      // 每一级出的招都记进 moves（认招时"本回合实际出过的招都算对"）：
      // 第 1 晚：低语 = 只有夜晚是你的 → 白天的事淡出 → 加码
      // 第 2 晚：到点那一集正好停在半句上（第 1 级就是"只说半句"）→ 自动倒计时开始 → 加码
      // 第 3 晚：低语"你那么累" = 越累越大 → 按钮放大（或长不动）→ 加码
      function stageTo(n) {
        clearTimeout(timer);
        if (!alive()) return;
        stage = n;
        $("#surf").dataset.stage = String(n);
        const N = opts.night;
        if (n === 0) {
          say(opts.whispers[said++ % opts.whispers.length]);
          if (N === 1) moves.add("myTime");
          if (N === 2) {
            moves.add("cliff");
            $("#cliff").textContent = opts.cliff || "";
          }
          if (N === 3) moves.add("bigger");
        } else if (n === 1) {
          if (N === 1) {
            $("#daylist").hidden = false;
            say(G.text("owl3.n1.mechanic"));
          } else if (N === 2) {
            moves.add("autoplay");
            say(G.text("owl3.n2.mechanic"));
            startCountdown();
          } else {
            const m = $("#more");
            if (opts.stuck) {
              m.classList.add("strain");
              say(G.text("owl3.n3.mechanicStuck"));
            } else {
              m.style.setProperty("--grow", String(opts.scale));
              say(G.text("owl3.n3.mechanicGrow"));
            }
            G.fx.play("owl.button", { scale: opts.stuck ? 1 : opts.scale, stuck: !!opts.stuck });
          }
        } else {
          say(G.text(N === 1 ? "owl3.n1.bait" : N === 2 ? "owl3.n2.bait" : "owl3.n3.bait"));
          return; // 第 3 级：停在这里等（第 2 晚倒计时照走）
        }
        timer = setTimeout(() => stageTo(n + 1), STAGE_MS);
      }

      function startCountdown() {
        let left = countdownS();
        const cd = $("#countdown");
        cd.hidden = false;
        cd.textContent = G.f("owl3.countdown", { sec: left });
        clearInterval(tick);
        tick = setInterval(() => {
          if (!alive()) return clearInterval(tick);
          left--;
          cd.textContent = G.f("owl3.countdown", { sec: left });
          if (left <= 0) {
            clearInterval(tick);
            auto++;
            G.events.log("owl.autoplay", { count: auto });
            G.fx.play("owl.autoplay", { episode: extra + 1 });
            play("owl3.autoHealed");
          }
        }, 1000);
      }

      // 播一集：时钟 +30，夜枭回 1 格血；播完回到第 1 级
      function play(lineId) {
        if (playing || !alive()) return;
        playing = true;
        clearTimeout(timer);
        clearInterval(tick);
        extra++;
        clock += 30;
        setClock();
        hp = Math.min(HP_MAX, hp + 1);
        refreshHp();
        say(G.text(lineId));
        $("#surf").hidden = true;
        $("#countdown").hidden = true;
        $("#cliff").textContent = "";
        const p = $("#playing");
        p.hidden = false;
        p.classList.remove("run");
        void p.offsetWidth;
        p.classList.add("run");
        setTimeout(() => {
          if (!alive()) return;
          playing = false;
          p.hidden = true;
          $("#surf").hidden = false;
          stageTo(0);
        }, EPISODE_MS);
      }

      $("#more").addEventListener("click", () => {
        if (stage < 0) return;
        G.events.log("owl3.more", { count: extra + 1 });
        play("owl3.healed");
      });

      // 按住只在到点后、不在播放中时算数；被忽略的那一下要重新挂上（hold 触发一次就锁住）
      let detach = null;
      function armHold() {
        if (detach) detach();
        detach = G.hold.attach($("#surf"), {
          onProgress: (p) => $("#bar").style.setProperty("--p", Math.round(p * 100)),
          onHold: () => {
            if (done) return;
            if (stage < 0 || playing) {
              $("#bar").style.setProperty("--p", 0);
              return setTimeout(armHold, 0);
            }
            done = true;
            clearTimeout(timer);
            clearInterval(tick);
            const dmg = DMG[Math.min(stage, 2)];
            hp = Math.max(opts.night < 3 ? 1 : 0, hp - dmg);
            G.events.log("owl3.hold", { count: stage, tick: dmg, option: String(opts.night) });
              resolve({ stage, moves: [...moves], extra, auto, said });
          },
        });
      }
      armHold();
    });
  }

  function pickNight(n) {
    const a = G.t("owl3.nights");
    return Array.isArray(a) ? a[n - 1] : "";
  }

  function recognize(moves) {
    return new Promise((resolve) => {
      const opts = G.t("owl3.moves");
      G.router.show(`
        <div class="stack">
          ${hpBar()}
          <p class="eyebrow">${fmt(G.t("owl3.stepRecognize"))}</p>
          <div class="stack" id="opts">
            ${(Array.isArray(opts) ? opts : []).map((o) => `<button type="button" class="btn-choice" data-move="${esc(o.move)}">${esc(o.label)}</button>`).join("")}
          </div>
        </div>
      `, { name: "owl3-recognize" });
      // 本回合实际出过的招都算对
      G.router.$$("#opts button").forEach((b) => b.addEventListener("click", () => resolve(moves.includes(b.dataset.move))));
    });
  }

  // 出门：把手机拖到门外。"再看一集"仍在，点了回到这一晚（返回 "more"）。
  function door(label) {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          ${hpBar()}
          <p class="eyebrow">${fmt(G.t("owl3.door.step"))}</p>
          <div class="phonedrop">
            <button type="button" class="phone" id="phone">${fmt(G.t("owl3.door.icon"))}</button>
            <div class="spot door" id="spot">${esc(label)}</div>
          </div>
          <p class="hint">${fmt(G.f("owl3.doorHint", { door: label }))}</p>
          <div class="choices2">${btn("more", G.t("owl3.oneMore"), "btn-choice tempt")}</div>
        </div>
      `, { name: "owl3-door" });
      let over = false;
      draggable(G.router.$("#phone"), G.router.$("#spot"), () => {
        over = true;
        G.fx.play("owl.phoneDown", { where: label });
        setTimeout(() => resolve("out"), 500);
      });
      G.router.$("#more").addEventListener("click", () => !over && resolve("more"));
    });
  }

  function feedback(lines) {
    return talk({ speaker: "narrator", lines, extraHtml: hpBar() });
  }

  async function battle(task) {
    hp = HP_MAX;
    const ritual = owl2().ritual || {};
    const lightsOut = toMin(ritual.lightsOut || "22:30");
    const where = ritual.where;
    const doorLabel = G.f("owl3.doorLabel", { where });
    // 第 2 晚的半句：玩家第 1 局没看过的那句；都看过取第一集（玩家最早听到的那半句）
    const cliffs = G.t("owl.episodeCliff") || [];
    const seen = (owl1rec() && owl1rec().cliffsSeen) || [];
    const unseen = cliffs.map((_, i) => i).filter((i) => !seen.includes(i));
    const cliff = cliffs[unseen.length ? unseen[0] : 0];

    G.fx.play("demon.appear", { who: "owl" });
    await talk({ speaker: "zero", lines: [].concat(G.t("owl3.intro"), G.clock.isLateNight() ? G.t("owl3.lateNote") : []) });
    let extra = 0, auto = 0, crits = 0, right = 0;
    for (let night = 1; night <= 3; night++) {
      // whispers：同一晚多看几集再回来时按顺序轮换，不重复（第 1 晚从随机一条开始）
      let whispers;
      let scale = 1, stuck = false;
      if (night === 1) {
        const all = [].concat(G.f("owl3.whisper1", nightCue() || {}));
        const k = Math.floor(Math.random() * all.length);
        whispers = all.slice(k).concat(all.slice(0, k));
      }
      else if (night === 2) whispers = [G.f("owl3.whisper2", task)];
      else {
        await talk({ speaker: "narrator", lines: G.f("owl3.n3.open", { extra }) });
        whispers = [G.text("owl3.n3.whisper")];
        // 倍数公式同第 1 局：每多看一集晚 30 分钟，精力 -0.1，按钮 1 + (1 - 精力) × 1.2
        stuck = extra === 0;
        scale = 1 + Math.min(0.6, extra * 0.1) * 1.2;
      }
      let recognized = false, nightExtra = 0, resume = false, said = 0;
      for (;;) {
        // 接着上一次说到的那一条往下轮
        const r = await round({ night, lightsOut: lightsOut + 30 * nightExtra, resume, whispers: whispers.slice(said % whispers.length).concat(whispers.slice(0, said % whispers.length)), cliff, scale, stuck });
        said += r.said;
        nightExtra += r.extra;
        extra += r.extra;
        auto += r.auto;
        if (r.stage === 0) crits++;
        await feedback(G.t(r.stage === 0 ? "owl3.crit" : r.stage >= 2 ? "owl3.lateHit" : "owl3.hit"));
        if (!recognized) {
          recognized = true;
          const ok = await recognize(r.moves);
          G.events.log("owl3.read", { correct: ok, option: r.moves.join("+") });
          if (ok) {
            right++;
            hp = Math.max(night < 3 ? 1 : 0, hp - 1);
            await feedback(G.t("owl3.readRight"));
          } else await talk({ speaker: "zero", lines: G.t("owl3.misread"), extraHtml: hpBar() });
          // 夜枭歪曲了报告：不论砍没砍中，零一定回一句
          if (night === 2) await talk({ speaker: "zero", lines: G.f("owl3.zeroRebut", task) });
        }
        const d = await door(doorLabel);
        if (d === "out") break;
        // 出门前又点了"再看一集"：真的播，回到这一晚
        hp = Math.min(HP_MAX, hp + 1);
        extra++;
        nightExtra++;
        resume = true;
      }
      if (night === 3) {
        hp = 0;
        await feedback(G.t("owl3.finalBlow"));
      } else await feedback(G.t("owl3.door.done"));
    }
    G.fx.play("owl.deflate", {});
    G.fx.play("demon.leave", { who: "owl" });
    await talk({ speaker: "narrator", lines: [].concat(G.t("owl3.deflate"), G.f("owl3.result", { extra, auto })) });
    await talk({ speaker: "owl", lines: G.t("owl3.owlLast") });
    await talk({ speaker: "zero", lines: [G.t("owl3.zeroLast"), G.t("owl3.zeroAfter")] });
    G.events.log("owl3.end", { count: crits, tick: right, option: String(extra) });
    return { crits, right, extra, auto };
  }

  // ---- 守夜人的梦 ----
  function watchmanDream(order) {
    const cliffs = G.t("owl.episodeCliff") || [];
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("watchman.eyebrow"))}</p>
          <p class="hint" id="hint">${fmt(G.t("watchman.watch"))}</p>
          <div class="tv" id="tv">
            <p class="cliff" id="cliff"></p>
            <div class="playing run" id="playing"><i></i><span>${fmt(G.t("owl3.playing"))}</span></div>
            <p class="hint" id="countdown" hidden></p>
          </div>
          <div class="phonedrop">
            <button type="button" class="phone" id="phone">${fmt(G.t("owl3.door.icon"))}</button>
            <div class="spot door" id="spot">${fmt(G.t("watchman.door"))}</div>
          </div>
        </div>
      `, { name: "owl3-dream" });
      const $ = G.router.$;
      let ep = 0, counting = false, attempts = 0, finished = false, timer = null, tick = null;
      const alive = () => !!G.router.$("#tv") && !finished;
      function playEp() {
        if (!alive()) return;
        counting = false;
        $("#countdown").hidden = true;
        $("#cliff").textContent = "";
        const p = $("#playing");
        p.hidden = false;
        p.classList.remove("run");
        void p.offsetWidth;
        p.classList.add("run");
        timer = setTimeout(() => {
          if (!alive()) return;
          p.hidden = true;
          const ci = order[ep % order.length];
          ep++;
          $("#cliff").textContent = cliffs[ci] || "";
          // 关键时刻：自动倒计时开始
          counting = true;
          attempts++;
          if (attempts >= 3) $("#spot").classList.add("hint-glow");
          $("#hint").textContent = G.text("watchman.now");
          let left = countdownS();
          const cd = $("#countdown");
          cd.hidden = false;
          cd.textContent = G.f("owl3.countdown", { sec: left });
          tick = setInterval(() => {
            if (!alive()) return clearInterval(tick);
            left--;
            cd.textContent = G.f("owl3.countdown", { sec: left });
            if (left <= 0) {
              clearInterval(tick);
              G.fx.play("owl.autoplay", { episode: ep, dream: true });
              $("#hint").textContent = G.text("watchman.again");
              playEp();
            }
          }, 1000);
        }, EPISODE_MS);
      }
      draggable($("#phone"), $("#spot"), () => {
        const early = !counting;
        finished = true;
        clearTimeout(timer);
        clearInterval(tick);
        $("#countdown").hidden = true;
        $("#hint").textContent = G.text(early ? "watchman.early" : "watchman.done");
        G.fx.play("owl.phoneDown", { where: "dream" });
        G.events.log("dream.hold", { held: true, count: attempts, option: early ? "early" : "countdown" });
        setTimeout(() => resolve({ early, attempts }), 900);
      });
      playEp();
    });
  }

  async function dream() {
    const rec = owl1rec();
    const mirrored = !!(rec && rec.cliffsSeen && rec.cliffsSeen.length);
    const order = mirrored ? rec.cliffsSeen : [0, 1, 2];
    await talk({ speaker: "narrator", lines: G.t(mirrored ? "watchman.intro" : "watchman.introDefault") });
    const r = await watchmanDream(order);
    if (r.early) await talk({ speaker: "narrator", lines: G.t("watchman.done") });
    await talk({ speaker: "watchman", lines: G.t("watchman.awake") });
    if (rec && rec.early) await talk({ speaker: "zero", lines: G.t("watchman.fasterThanHim") });
    G.state.update((s) => {
      s.rescued = s.rescued || [];
      if (!s.rescued.includes("watchman")) s.rescued.push("watchman");
    });
    return r;
  }

  const session3 = [
    async (ctx) => {
      ctx.task = await taskReport();
      G.state.update((s) => (s.sessions.owl3 = Object.assign(s.sessions.owl3 || {}, { task: ctx.task })));
    },
    async (ctx) => {
      ctx.battle = await battle(ctx.task);
      G.state.update((s) => (s.sessions.owl3 = Object.assign(s.sessions.owl3 || {}, { battle: ctx.battle })));
    },
    async (ctx) => {
      ctx.dream = await dream();
    },
    async () => {
      G.fx.play("district.revive", { district: "tower", state: 2 });
      await talk({ speaker: "narrator", lines: [].concat(G.t("tower.revived"), G.t("tower.companion")) });
      await G.titles.awardAndShow("hunter2");
    },
    // 预告：长廊。runner 随后亮牌 cliffhanger。
    () => talk({ speaker: "narrator", lines: G.t("teaser.abyss"), nextLabel: G.t("talk.silence") }),
  ];

  G.levels.owl = G.levels.owl || {};
  G.levels.owl.session3 = session3;
})();
